import axios from '@/lib/axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface WizardStepConfig<TStepId extends string> {
    id: TStepId;
    title: string;
    shortTitle: string;
    description?: string;
    optional?: boolean;
    fields: string[]; // Fields that belong to this step - for Precognition validation
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataType = Record<string, any>;

export interface UseWizardPrecognitionOptions<TData extends FormDataType, TStepId extends string> {
    steps: WizardStepConfig<TStepId>[];
    initialData: TData;
    initialStepIndex?: number;

    // Route builder for Precognition validation
    // Returns null if validation route is not yet available (e.g., draft not created)
    getValidationRoute: () => string | null;
    method: 'post' | 'patch' | 'put';

    // Autosave
    onSave?: (data: TData, wizardStep: number) => Promise<{ maxValidStep?: number }>;
    saveDebounceMs?: number;
    enableAutosave?: boolean;
    autosaveExcludeSteps?: TStepId[];

    // Callbacks
    onStepChange?: (step: TStepId, index: number) => void;
}

export interface UseWizardPrecognitionReturn<TData extends FormDataType, TStepId extends string> {
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
    goToNextStep: () => Promise<boolean>;
    goToPreviousStep: () => void;
    canGoToStep: (step: TStepId) => boolean;

    // Data
    data: TData;
    setData: React.Dispatch<React.SetStateAction<TData>>;
    updateField: <K extends keyof TData>(key: K, value: TData[K]) => void;
    updateFields: (updates: Partial<TData>) => void;

    // Validation - via Precognition
    errors: Partial<Record<keyof TData, string>>;
    setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof TData, string>>>>;
    validating: boolean;
    validateField: (field: keyof TData) => Promise<void>;
    validateFieldAndRecalculateMaxStep: (field: keyof TData) => Promise<void>;
    validateStep: (stepId: TStepId) => Promise<boolean>;
    hasErrors: boolean;
    clearErrors: () => void;

    // Touched fields - for showing errors only after user interaction
    touchedFields: Record<string, boolean>;
    setTouchedFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    markFieldTouched: (field: string) => void;
    clearTouchedFields: () => void;
    markAllCurrentStepFieldsTouched: () => void;
    createIndexedBlurHandler: (prefix: string, index: number, field: string) => () => void;
    focusFirstInvalidField: () => void;

    // Autosave
    autosaveStatus: AutosaveStatus;
    lastSavedAt: Date | null;
    saveNow: (stepOverride?: number) => Promise<void>;
    hasUserInteracted: boolean;
    markAsInteracted: () => void;

    // Progress
    progress: number;

    // Form submission
    processing: boolean;
}

/**
 * Wizard hook with Laravel Precognition for real-time validation.
 *
 * Uses backend FormRequest rules as the single source of truth.
 * Makes axios requests with Precognition headers to validate without saving.
 */
export function useWizardPrecognition<TData extends FormDataType, TStepId extends string>({
    steps,
    initialData,
    initialStepIndex = 0,
    getValidationRoute,
    method,
    onSave,
    saveDebounceMs = 1000,
    enableAutosave = true,
    autosaveExcludeSteps = [],
    onStepChange,
}: UseWizardPrecognitionOptions<TData, TStepId>): UseWizardPrecognitionReturn<TData, TStepId> {
    // Core state
    const [data, setData] = useState<TData>(initialData);
    const [errors, setErrors] = useState<Partial<Record<keyof TData, string>>>({});
    const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [maxStepReached, setMaxStepReached] = useState(initialStepIndex);
    const [validating, setValidating] = useState(false);
    const processing = false; // Reserved for future save-in-progress indicator

    // Touched fields - track which fields user has interacted with
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    // Autosave state
    const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedDataRef = useRef<string | null>(null);

    // Derived values
    const safeStepIndex = Math.max(0, Math.min(currentStepIndex, steps.length - 1));
    const currentStep = steps[safeStepIndex].id;
    const currentStepConfig = steps[safeStepIndex];
    const isFirstStep = safeStepIndex === 0;
    const isLastStep = safeStepIndex === steps.length - 1;
    const progress = ((safeStepIndex + 1) / steps.length) * 100;
    const hasErrors = Object.keys(errors).length > 0;

    // Memoize data for comparison
    const dataString = useMemo(() => JSON.stringify(data), [data]);

    // Get fields for a step
    const getStepFields = useCallback(
        (stepId: TStepId): string[] => {
            const step = steps.find((s) => s.id === stepId);
            return step?.fields ?? [];
        },
        [steps],
    );

    // Find which step index a field belongs to
    const getFieldStepIndex = useCallback(
        (field: string): number => {
            for (let i = 0; i < steps.length; i++) {
                if (steps[i].fields.includes(field)) {
                    return i;
                }
            }
            return -1;
        },
        [steps],
    );

    /**
     * Make a Precognition validation request.
     * Returns validation errors or null if valid.
     */
    const validateWithPrecognition = useCallback(
        async (fieldsToValidate?: string[]): Promise<Record<string, string> | null> => {
            const route = getValidationRoute();
            if (!route) {
                // No route available yet (draft not created), skip validation
                return null;
            }

            setValidating(true);
            try {
                const headers: Record<string, string> = {
                    Precognition: 'true',
                };

                // If specific fields, only validate those
                if (fieldsToValidate && fieldsToValidate.length > 0) {
                    headers['Precognition-Validate-Only'] = fieldsToValidate.join(',');
                }

                await axios.request({
                    method,
                    url: route,
                    data,
                    headers,
                });

                // 204 No Content = validation passed
                return null;
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 422) {
                    // Validation failed - extract errors
                    const responseErrors = error.response.data?.errors || {};
                    const flatErrors: Record<string, string> = {};

                    // Flatten array errors to first message
                    Object.entries(responseErrors).forEach(([field, messages]) => {
                        if (Array.isArray(messages) && messages.length > 0) {
                            flatErrors[field] = messages[0] as string;
                        } else if (typeof messages === 'string') {
                            flatErrors[field] = messages;
                        }
                    });

                    return flatErrors;
                }

                // Other errors (network, 500, etc.) - log but don't block
                console.error('Precognition validation error:', error);
                return null;
            } finally {
                setValidating(false);
            }
        },
        [data, getValidationRoute, method],
    );

    // Validate a specific step
    const validateStep = useCallback(
        async (stepId: TStepId): Promise<boolean> => {
            const stepFields = getStepFields(stepId);

            // Don't pass fields to Precognition - validate ALL fields and filter on frontend
            // This is necessary because Precognition-Validate-Only header doesn't expand
            // parent fields to include nested array validation (e.g., occupants_details.*.first_name)
            const validationErrors = await validateWithPrecognition();

            if (validationErrors) {
                // Filter to errors that match this step's fields (including nested like occupants_details.0.first_name)
                const stepErrors: Record<string, string> = {};
                Object.entries(validationErrors).forEach(([errorField, errorMessage]) => {
                    // Check if error field matches any step field (exact match or starts with field name + ".")
                    const belongsToStep = stepFields.some((field) => errorField === field || errorField.startsWith(`${field}.`));
                    if (belongsToStep) {
                        stepErrors[errorField] = errorMessage;
                    }
                });

                if (Object.keys(stepErrors).length > 0) {
                    setErrors(stepErrors as Partial<Record<keyof TData, string>>);
                    return false;
                }
            }

            setErrors({});
            return true;
        },
        [getStepFields, validateWithPrecognition],
    );

    // Validate a single field
    const validateField = useCallback(
        async (field: keyof TData): Promise<void> => {
            const validationErrors = await validateWithPrecognition([field as string]);

            setErrors((prev) => {
                const newErrors = { ...prev };
                if (validationErrors && validationErrors[field as string]) {
                    newErrors[field] = validationErrors[field as string];
                } else {
                    delete newErrors[field];
                }
                return newErrors;
            });
        },
        [validateWithPrecognition],
    );

    /**
     * Calculate the maximum valid step by validating all steps in order.
     * Returns the index of the last valid step (or -1 if step 0 is invalid).
     */
    const calculateMaxValidStep = useCallback(
        async (upToStepIndex: number): Promise<number> => {
            // Collect all fields from step 0 to upToStepIndex
            const fieldsToValidate: string[] = [];
            for (let i = 0; i <= upToStepIndex && i < steps.length; i++) {
                fieldsToValidate.push(...steps[i].fields);
            }

            if (fieldsToValidate.length === 0) {
                return upToStepIndex;
            }

            const validationErrors = await validateWithPrecognition(fieldsToValidate);

            if (!validationErrors) {
                // No validation errors - all steps up to upToStepIndex are valid
                return upToStepIndex;
            }

            // Find the first step that has errors
            for (let i = 0; i <= upToStepIndex && i < steps.length; i++) {
                const stepFields = steps[i].fields;
                const hasStepErrors = stepFields.some((field) => validationErrors[field]);
                if (hasStepErrors) {
                    // Step i has errors, so max valid step is i-1 (previous step)
                    // But we allow staying on the current step, so return i (user can view but not advance)
                    return Math.max(0, i);
                }
            }

            return upToStepIndex;
        },
        [steps, validateWithPrecognition],
    );

    /**
     * Validate a field and recalculate maxStepReached if the field belongs to an earlier step.
     * This ensures that invalidating data from a previous step locks future steps.
     */
    const validateFieldAndRecalculateMaxStep = useCallback(
        async (field: keyof TData): Promise<void> => {
            // First, validate the field itself
            const validationErrors = await validateWithPrecognition([field as string]);

            setErrors((prev) => {
                const newErrors = { ...prev };
                if (validationErrors && validationErrors[field as string]) {
                    newErrors[field] = validationErrors[field as string];
                } else {
                    delete newErrors[field];
                }
                return newErrors;
            });

            // Find which step this field belongs to
            const fieldStepIndex = getFieldStepIndex(field as string);

            // If the field belongs to a step before maxStepReached, recalculate
            if (fieldStepIndex >= 0 && fieldStepIndex < maxStepReached) {
                const newMaxValidStep = await calculateMaxValidStep(maxStepReached);
                setMaxStepReached(newMaxValidStep);
            }
        },
        [validateWithPrecognition, getFieldStepIndex, maxStepReached, calculateMaxValidStep],
    );

    // Navigation - go to next step with validation
    const goToNextStep = useCallback(async (): Promise<boolean> => {
        const isValid = await validateStep(currentStep);

        if (!isValid) {
            return false;
        }

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setHasUserInteracted(true);
            setCurrentStepIndex(nextIndex);
            setMaxStepReached((prev) => Math.max(prev, nextIndex));
            setErrors({});
            onStepChange?.(steps[nextIndex].id, nextIndex);
        }
        return true;
    }, [currentStep, currentStepIndex, onStepChange, steps, validateStep]);

    // Navigation - go to previous step (no validation needed)
    const goToPreviousStep = useCallback(() => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStepIndex(prevIndex);
            onStepChange?.(steps[prevIndex].id, prevIndex);
        }
    }, [currentStepIndex, onStepChange, steps]);

    // Navigation - go to specific step
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

            // Can only go forward up to max step reached
            if (targetIndex <= maxStepReached) {
                setCurrentStepIndex(targetIndex);
                onStepChange?.(step, targetIndex);
            }
        },
        [currentStepIndex, maxStepReached, onStepChange, steps],
    );

    // Check if can navigate to step
    const canGoToStep = useCallback(
        (step: TStepId): boolean => {
            const stepIndex = steps.findIndex((s) => s.id === step);
            if (stepIndex <= currentStepIndex) return true;
            return stepIndex <= maxStepReached;
        },
        [currentStepIndex, maxStepReached, steps],
    );

    // Data update - single field
    const updateField = useCallback(<K extends keyof TData>(key: K, value: TData[K]) => {
        setHasUserInteracted(true);
        setData((prev) => ({ ...prev, [key]: value }));
        // Clear error for this field
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });
    }, []);

    // Update multiple fields
    const updateFields = useCallback((updates: Partial<TData>) => {
        setHasUserInteracted(true);
        setData((prev) => ({ ...prev, ...updates }));
        // Clear errors for updated fields
        setErrors((prev) => {
            const newErrors = { ...prev };
            Object.keys(updates).forEach((key) => {
                delete newErrors[key as keyof TData];
            });
            return newErrors;
        });
    }, []);

    // Clear all errors
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    // ===== Touched Fields =====

    // Mark a single field as touched
    const markFieldTouched = useCallback((field: string) => {
        setTouchedFields((prev) => ({ ...prev, [field]: true }));
    }, []);

    // Clear all touched fields
    const clearTouchedFields = useCallback(() => {
        setTouchedFields({});
    }, []);

    /**
     * Creates a blur handler for indexed fields (occupants, pets, references, etc.)
     * Returns a function that marks the specific field as touched when called.
     *
     * Usage in step components:
     *   <input onBlur={createIndexedBlurHandler('occupant', index, 'first_name')} />
     *   <input onBlur={createIndexedBlurHandler('pet', index, 'type')} />
     *
     * The field key format is: `${prefix}_${index}_${field}`
     */
    const createIndexedBlurHandler = useCallback(
        (prefix: string, index: number, field: string) => () => {
            setTouchedFields((prev) => ({ ...prev, [`${prefix}_${index}_${field}`]: true }));
        },
        [],
    );

    /**
     * Mark all fields in the current step as touched.
     * Uses the step's `fields` array from the config.
     * Override this in wrapper hooks for complex conditional logic.
     */
    const markAllCurrentStepFieldsTouched = useCallback(() => {
        const stepFields = currentStepConfig.fields;
        setTouchedFields((prev) => {
            const newTouched = { ...prev };
            stepFields.forEach((field) => {
                newTouched[field] = true;
            });
            return newTouched;
        });
    }, [currentStepConfig.fields]);

    /**
     * Focus the first invalid field in the DOM.
     * Finds elements with aria-invalid="true" and focuses + scrolls to the first one.
     * Should be called after marking fields as touched when validation fails.
     */
    const focusFirstInvalidField = useCallback(() => {
        // Use setTimeout to ensure DOM has updated after touchedFields change
        setTimeout(() => {
            const invalidElement = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
            if (invalidElement) {
                invalidElement.focus();
                invalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50);
    }, []);

    // Manual save
    const saveNow = useCallback(
        async (stepOverride?: number) => {
            if (!onSave) return;

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            setAutosaveStatus('saving');
            try {
                const savedStep = stepOverride ?? currentStepIndex + 1;
                await onSave(data, savedStep);
                // Note: We intentionally do NOT update maxStepReached from save response
                // maxStepReached should only be updated via explicit navigation (goToNextStep)
                lastSavedDataRef.current = dataString;
                setLastSavedAt(new Date());
                setAutosaveStatus('saved');
            } catch (error) {
                console.error('Save failed:', error);
                setAutosaveStatus('error');
            }
        },
        [currentStepIndex, data, dataString, onSave],
    );

    // Autosave effect
    useEffect(() => {
        if (!enableAutosave || !onSave || !hasUserInteracted) {
            return;
        }

        if (autosaveExcludeSteps.includes(currentStep)) {
            return;
        }

        if (lastSavedDataRef.current === dataString) {
            return;
        }

        setAutosaveStatus('pending');

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(async () => {
            setAutosaveStatus('saving');
            try {
                await onSave(data, currentStepIndex + 1);
                // Note: We intentionally do NOT update maxStepReached from autosave
                // maxStepReached should only be updated via explicit navigation (goToNextStep)
                lastSavedDataRef.current = dataString;
                setLastSavedAt(new Date());
                setAutosaveStatus('saved');
            } catch (error) {
                console.error('Autosave failed:', error);
                setAutosaveStatus('error');
            }
        }, saveDebounceMs);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [autosaveExcludeSteps, currentStep, currentStepIndex, data, dataString, enableAutosave, hasUserInteracted, onSave, saveDebounceMs]);

    const markAsInteracted = useCallback(() => {
        setHasUserInteracted(true);
    }, []);

    // Track if mount validation has been done
    const mountValidationDoneRef = useRef(false);

    // On mount, calculate maxStepReached based on actual validation if starting past step 0
    useEffect(() => {
        // Only run once on mount
        if (mountValidationDoneRef.current) return;

        // If we're starting at step 0, nothing to validate
        if (initialStepIndex === 0) {
            mountValidationDoneRef.current = true;
            return;
        }

        // Calculate the actual max valid step on mount
        const validateOnMount = async () => {
            const maxValidStep = await calculateMaxValidStep(initialStepIndex);
            setMaxStepReached(maxValidStep);

            // If the calculated max is less than where we're trying to start,
            // move back to the first invalid step
            if (maxValidStep < initialStepIndex) {
                setCurrentStepIndex(maxValidStep);
            }
        };

        validateOnMount();
        mountValidationDoneRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

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
        setData,
        updateField,
        updateFields,

        // Validation
        errors,
        setErrors,
        validating,
        validateField,
        validateFieldAndRecalculateMaxStep,
        validateStep,
        hasErrors,
        clearErrors,

        // Touched fields
        touchedFields,
        setTouchedFields,
        markFieldTouched,
        clearTouchedFields,
        markAllCurrentStepFieldsTouched,
        createIndexedBlurHandler,
        focusFirstInvalidField,

        // Autosave
        autosaveStatus,
        lastSavedAt,
        saveNow,
        hasUserInteracted,
        markAsInteracted,

        // Progress
        progress,

        // Submission
        processing,
    };
}
