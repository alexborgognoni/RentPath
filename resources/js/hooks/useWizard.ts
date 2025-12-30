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
    initialMaxStepReached?: number;

    // Validation - consumer provides the logic
    validateStep: (stepId: TStepId, data: TData) => ValidationResult;
    findFirstInvalidStep: (data: TData) => number;

    // Autosave - consumer provides the save function
    onSave?: (data: TData, wizardStep: number) => Promise<SaveResult>;
    saveDebounceMs?: number;
    enableAutosave?: boolean;

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
    clearFieldError: (field: string) => void;

    // Autosave
    autosaveStatus: AutosaveStatus;
    lastSavedAt: Date | null;
    saveNow: () => Promise<void>;
    hasUserInteracted: boolean;
    markAsInteracted: () => void;

    // Progress
    progress: number;
}

export function useWizard<TData, TStepId extends string>({
    steps,
    initialData,
    initialStepIndex = 0,
    initialMaxStepReached = 0,
    validateStep: validateStepFn,
    findFirstInvalidStep,
    onSave,
    saveDebounceMs = 1000,
    enableAutosave = true,
    onStepChange,
    onDataChange,
}: UseWizardOptions<TData, TStepId>): UseWizardReturn<TData, TStepId> {
    // Core state
    const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
    const [data, setData] = useState<TData>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [maxStepReached, setMaxStepReached] = useState(initialMaxStepReached);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    // Autosave state
    const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedDataRef = useRef<string | null>(null);

    // Track if we should skip the next step lock check (for forward navigation)
    const skipNextLockCheck = useRef(false);

    // Derived values (with safety bounds check)
    const safeStepIndex = Math.max(0, Math.min(currentStepIndex, steps.length - 1));
    const currentStep = steps[safeStepIndex].id;
    const currentStepConfig = steps[safeStepIndex];
    const isFirstStep = safeStepIndex === 0;
    const isLastStep = safeStepIndex === steps.length - 1;
    const progress = ((safeStepIndex + 1) / steps.length) * 100;

    // Memoize data for autosave comparison
    const dataString = useMemo(() => JSON.stringify(data), [data]);

    // Effect to lock steps when data changes make earlier steps invalid
    useEffect(() => {
        // Skip lock check during forward navigation
        if (skipNextLockCheck.current) {
            skipNextLockCheck.current = false;
            return;
        }

        const maxValid = findFirstInvalidStep(data);

        // If current data invalidates a previous step, lock user to that step
        if (maxValid < maxStepReached) {
            setMaxStepReached(maxValid);
        }

        // If currently viewing a step beyond maxValid, navigate back
        if (currentStepIndex > maxValid) {
            setCurrentStepIndex(maxValid);
            // Show errors for the step they're being locked to
            const stepId = steps[maxValid].id;
            const result = validateStepFn(stepId, data);
            if (!result.success) {
                setErrors(result.errors);
            }
            onStepChange?.(stepId, maxValid);
        }
    }, [data, maxStepReached, currentStepIndex, findFirstInvalidStep, validateStepFn, steps, onStepChange]);

    // Autosave effect
    useEffect(() => {
        if (!enableAutosave || !onSave || !hasUserInteracted) {
            return;
        }

        // Skip if data hasn't changed from last save
        if (lastSavedDataRef.current === dataString) {
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
                const result = await onSave(data, maxStepReached + 1);

                lastSavedDataRef.current = dataString;
                setLastSavedAt(new Date());
                setAutosaveStatus('saved');

                // Backend may reduce max_valid_step if validation failed
                // Allow user to stay on the first invalid step to fix it
                if (result.maxValidStep !== undefined) {
                    const lastValidStepIndex = result.maxValidStep - 1; // 0-indexed
                    const firstInvalidStepIndex = lastValidStepIndex + 1; // User can be here to fix

                    // Only reduce maxStepReached if user has progressed beyond first invalid step
                    if (firstInvalidStepIndex < maxStepReached) {
                        setMaxStepReached(firstInvalidStepIndex);
                    }

                    // Only navigate back if currently beyond the first invalid step
                    if (currentStepIndex > firstInvalidStepIndex) {
                        setCurrentStepIndex(firstInvalidStepIndex);
                        onStepChange?.(steps[firstInvalidStepIndex].id, firstInvalidStepIndex);
                    }
                }
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
    }, [dataString, hasUserInteracted, enableAutosave, onSave, maxStepReached, currentStepIndex, saveDebounceMs, steps, onStepChange, data]);

    // Manual save function
    const saveNow = useCallback(async () => {
        if (!onSave) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        setAutosaveStatus('saving');
        try {
            await onSave(data, maxStepReached + 1);
            lastSavedDataRef.current = dataString;
            setLastSavedAt(new Date());
            setAutosaveStatus('saved');
        } catch (error) {
            console.error('Save failed:', error);
            setAutosaveStatus('error');
        }
    }, [onSave, data, maxStepReached, dataString]);

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

            // Can only go forward if within maxStepReached
            if (targetIndex <= maxStepReached) {
                setCurrentStepIndex(targetIndex);
                onStepChange?.(step, targetIndex);
            }
        },
        [currentStepIndex, maxStepReached, steps, onStepChange],
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
            // Update maxStepReached if advancing beyond current max
            if (nextIndex > maxStepReached) {
                // Skip the lock check since we're intentionally advancing
                skipNextLockCheck.current = true;
                setMaxStepReached(nextIndex);
            }
            setCurrentStepIndex(nextIndex);
            setErrors({}); // Clear errors when moving to next step
            onStepChange?.(steps[nextIndex].id, nextIndex);
        }
        return true; // Navigation succeeded
    }, [currentStep, currentStepIndex, data, maxStepReached, steps, validateStepFn, onStepChange]);

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
            // Can only go forward if within maxStepReached
            return stepIndex <= maxStepReached;
        },
        [currentStepIndex, maxStepReached, steps],
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
        maxStepReached,
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
