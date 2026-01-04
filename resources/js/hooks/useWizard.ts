import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface WizardStepConfig<TStepId extends string> {
    id: TStepId;
    title: string;
    shortTitle: string;
    description?: string;
    optional?: boolean;
}

export interface ValidationResult {
    success: boolean;
    errors: Record<string, string>;
}

export interface SaveResult {
    maxValidStep?: number;
}

export interface UseWizardOptions<TData, TStepId extends string> {
    steps: WizardStepConfig<TStepId>[];
    initialData: TData;
    initialStepIndex?: number;

    // Validation - consumer provides the logic
    // This single function is used EVERYWHERE: goToNextStep AND computing first invalid step on mount
    // This ensures no validation discrepancy between clicking Continue and refreshing the page
    validateStep: (stepId: TStepId, data: TData) => ValidationResult;

    // Autosave - consumer provides the save function
    onSave?: (data: TData, wizardStep: number) => Promise<SaveResult>;
    saveDebounceMs?: number;
    enableAutosave?: boolean;
    autosaveExcludeSteps?: TStepId[]; // Steps where autosave should be skipped

    // Callbacks
    onStepChange?: (step: TStepId, index: number) => void;
    onDataChange?: (data: TData) => void;
}

export interface UseWizardReturn<TData, TStepId extends string> {
    // Step state
    currentStep: TStepId;
    currentStepIndex: number;
    currentStepConfig: WizardStepConfig<TStepId>;
    isFirstStep: boolean;
    isLastStep: boolean;
    maxStepReached: number;
    steps: WizardStepConfig<TStepId>[];

    // Navigation
    goToStep: (step: TStepId) => void;
    goToNextStep: () => boolean;
    goToPreviousStep: () => void;
    canGoToStep: (step: TStepId) => boolean;

    // Data
    data: TData;
    updateField: <K extends keyof TData>(key: K, value: TData[K]) => void;
    updateFields: (updates: Partial<TData>) => void;
    setData: React.Dispatch<React.SetStateAction<TData>>;

    // Validation
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    validateCurrentStep: () => boolean;
    validateStep: (stepId: TStepId) => boolean;
    validateField: (field: string) => void;
    clearFieldError: (field: string) => void;

    // Autosave
    autosaveStatus: AutosaveStatus;
    lastSavedAt: Date | null;
    saveNow: (stepOverride?: number) => Promise<void>;
    hasUserInteracted: boolean;
    markAsInteracted: () => void;

    // Progress
    progress: number;
}

export function useWizard<TData, TStepId extends string>({
    steps,
    initialData,
    initialStepIndex = 0,
    validateStep: validateStepFn,
    onSave,
    saveDebounceMs = 1000,
    enableAutosave = true,
    autosaveExcludeSteps = [],
    onStepChange,
    onDataChange,
}: UseWizardOptions<TData, TStepId>): UseWizardReturn<TData, TStepId> {
    // Core state
    const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
    const [data, setData] = useState<TData>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    // Autosave state
    const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedDataRef = useRef<string | null>(null);
    const lastSavedStepRef = useRef<number | null>(null);

    // Track initial mount for one-time navigation to first invalid step
    const isInitialMount = useRef(true);

    // Derived values (with safety bounds check)
    const safeStepIndex = Math.max(0, Math.min(currentStepIndex, steps.length - 1));
    const currentStep = steps[safeStepIndex].id;
    const currentStepConfig = steps[safeStepIndex];
    const isFirstStep = safeStepIndex === 0;
    const isLastStep = safeStepIndex === steps.length - 1;
    const progress = ((safeStepIndex + 1) / steps.length) * 100;

    // Memoize data for autosave comparison
    const dataString = useMemo(() => JSON.stringify(data), [data]);

    // Compute first invalid step - this is the furthest the user can go
    // Memoized to avoid recalculating on every render
    const firstInvalidStepIndex = useMemo(() => {
        for (let i = 0; i < steps.length; i++) {
            const result = validateStepFn(steps[i].id, data);
            if (!result.success) {
                return i;
            }
        }
        return steps.length; // All steps valid
    }, [steps, validateStepFn, data]);

    // On mount: navigate to the first invalid step (where user needs to continue)
    useEffect(() => {
        if (!isInitialMount.current) return;
        isInitialMount.current = false;

        // Navigate to first invalid step
        if (currentStepIndex !== firstInvalidStepIndex) {
            setCurrentStepIndex(firstInvalidStepIndex);
            onStepChange?.(steps[firstInvalidStepIndex].id, firstInvalidStepIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // After user interaction: handle step locking if validation changes
    useEffect(() => {
        if (!hasUserInteracted) return;

        // If user is now beyond the first invalid step, navigate back
        if (currentStepIndex > firstInvalidStepIndex) {
            setCurrentStepIndex(firstInvalidStepIndex);
            const stepId = steps[firstInvalidStepIndex].id;
            const result = validateStepFn(stepId, data);
            if (!result.success) {
                setErrors(result.errors);
            }
            onStepChange?.(steps[firstInvalidStepIndex].id, firstInvalidStepIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstInvalidStepIndex, hasUserInteracted]);

    // Autosave effect for data changes (debounced)
    useEffect(() => {
        if (!enableAutosave || !onSave || !hasUserInteracted) {
            return;
        }

        // Skip autosave on excluded steps (e.g., consent step)
        if (autosaveExcludeSteps.includes(currentStep)) {
            return;
        }

        // Skip if neither data nor step has changed from last save
        const stepToSave = firstInvalidStepIndex + 1; // 1-indexed for backend
        if (lastSavedDataRef.current === dataString && lastSavedStepRef.current === stepToSave) {
            return;
        }

        // Mark as pending
        setAutosaveStatus('pending');

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set debounce timer
        debounceTimerRef.current = setTimeout(async () => {
            setAutosaveStatus('saving');
            try {
                await onSave(data, stepToSave);
                lastSavedDataRef.current = dataString;
                lastSavedStepRef.current = stepToSave;
                setLastSavedAt(new Date());
                setAutosaveStatus('saved');
            } catch (error) {
                console.error('Autosave failed:', error);
                setAutosaveStatus('error');
            }
        }, saveDebounceMs);

        // Cleanup
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [dataString, hasUserInteracted, enableAutosave, onSave, firstInvalidStepIndex, saveDebounceMs, data, autosaveExcludeSteps, currentStep]);

    // Manual save function - optionally accepts a step override for immediate saves after state updates
    const saveNow = useCallback(
        async (stepOverride?: number) => {
            if (!onSave) return;

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            setAutosaveStatus('saving');
            try {
                const savedStep = stepOverride ?? firstInvalidStepIndex + 1;
                await onSave(data, savedStep);
                lastSavedDataRef.current = dataString;
                lastSavedStepRef.current = savedStep;
                setLastSavedAt(new Date());
                setAutosaveStatus('saved');
            } catch (error) {
                console.error('Save failed:', error);
                setAutosaveStatus('error');
            }
        },
        [onSave, data, firstInvalidStepIndex, dataString],
    );

    // Data update functions
    const updateField = useCallback(
        <K extends keyof TData>(key: K, value: TData[K]) => {
            setHasUserInteracted(true);
            setData((prev) => ({ ...prev, [key]: value }));
            // Clear error for this field
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key as string];
                return newErrors;
            });
            onDataChange?.({ ...data, [key]: value } as TData);
        },
        [data, onDataChange],
    );

    const updateFields = useCallback(
        (updates: Partial<TData>) => {
            setHasUserInteracted(true);
            setData((prev) => ({ ...prev, ...updates }));
            // Clear errors for updated fields
            setErrors((prev) => {
                const newErrors = { ...prev };
                Object.keys(updates).forEach((key) => {
                    delete newErrors[key];
                });
                return newErrors;
            });
            onDataChange?.({ ...data, ...updates } as TData);
        },
        [data, onDataChange],
    );

    const clearFieldError = useCallback((field: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    // Per-field validation - validates full step but only sets/clears error for specific field
    // This follows the DESIGN.md per-field blur pattern
    const validateField = useCallback(
        (field: string) => {
            const result = validateStepFn(currentStep, data);
            if (result.success) {
                // Clear error for this field since step is valid
                setErrors((prev) => {
                    if (!prev[field]) return prev;
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            } else {
                // Set or clear error for just this field
                const fieldError = result.errors[field];
                setErrors((prev) => {
                    if (fieldError) {
                        // Set error for this field
                        if (prev[field] === fieldError) return prev;
                        return { ...prev, [field]: fieldError };
                    } else {
                        // Clear error for this field (it's valid even though step has other errors)
                        if (!prev[field]) return prev;
                        const newErrors = { ...prev };
                        delete newErrors[field];
                        return newErrors;
                    }
                });
            }
        },
        [currentStep, data, validateStepFn],
    );

    // Validation functions
    const validateCurrentStep = useCallback((): boolean => {
        const result = validateStepFn(currentStep, data);
        if (result.success) {
            setErrors({});
            return true;
        }
        setErrors(result.errors);
        return false;
    }, [currentStep, data, validateStepFn]);

    const validateStepById = useCallback(
        (stepId: TStepId): boolean => {
            const result = validateStepFn(stepId, data);
            if (result.success) {
                setErrors({});
                return true;
            }
            setErrors(result.errors);
            return false;
        },
        [data, validateStepFn],
    );

    // Navigation functions
    const goToStep = useCallback(
        (step: TStepId) => {
            const targetIndex = steps.findIndex((s) => s.id === step);
            if (targetIndex === -1) return;

            // Can always go back
            if (targetIndex <= currentStepIndex) {
                setCurrentStepIndex(targetIndex);
                onStepChange?.(step, targetIndex);
                return;
            }

            // Can only go forward up to (and including) the first invalid step
            if (targetIndex <= firstInvalidStepIndex) {
                setCurrentStepIndex(targetIndex);
                onStepChange?.(step, targetIndex);
            }
        },
        [currentStepIndex, firstInvalidStepIndex, steps, onStepChange],
    );

    const goToNextStep = useCallback((): boolean => {
        const result = validateStepFn(currentStep, data);

        if (!result.success) {
            setErrors(result.errors);
            return false; // Validation failed
        }

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setHasUserInteracted(true);
            setCurrentStepIndex(nextIndex);
            setErrors({}); // Clear errors when moving to next step
            onStepChange?.(steps[nextIndex].id, nextIndex);
        }
        return true; // Navigation succeeded
    }, [currentStep, currentStepIndex, data, steps, validateStepFn, onStepChange]);

    const goToPreviousStep = useCallback(() => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStepIndex(prevIndex);
            onStepChange?.(steps[prevIndex].id, prevIndex);
        }
    }, [currentStepIndex, steps, onStepChange]);

    const canGoToStep = useCallback(
        (step: TStepId): boolean => {
            const stepIndex = steps.findIndex((s) => s.id === step);
            // Can always go back
            if (stepIndex <= currentStepIndex) return true;
            // Can only go forward up to (and including) the first invalid step
            return stepIndex <= firstInvalidStepIndex;
        },
        [currentStepIndex, firstInvalidStepIndex, steps],
    );

    const markAsInteracted = useCallback(() => {
        setHasUserInteracted(true);
    }, []);

    return {
        // Step state
        currentStep,
        currentStepIndex,
        currentStepConfig,
        isFirstStep,
        isLastStep,
        maxStepReached: firstInvalidStepIndex, // For API compatibility
        steps,

        // Navigation
        goToStep,
        goToNextStep,
        goToPreviousStep,
        canGoToStep,

        // Data
        data,
        updateField,
        updateFields,
        setData,

        // Validation
        errors,
        setErrors,
        validateCurrentStep,
        validateStep: validateStepById,
        validateField,
        clearFieldError,

        // Autosave
        autosaveStatus,
        lastSavedAt,
        saveNow,
        hasUserInteracted,
        markAsInteracted,

        // Progress
        progress,
    };
}
