import axios from '@/lib/axios';
import { PROPERTY_MESSAGES } from '@/lib/validation/property-messages';
import { findFirstInvalidStep, validateField, validateForPublish, validateStep, type StepId } from '@/lib/validation/property-schemas';
import type { Property, PropertyFormData } from '@/types/dashboard';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export type WizardStep = 'property-type' | 'location' | 'specifications' | 'amenities' | 'energy' | 'pricing' | 'media' | 'review';

export interface WizardStepConfig {
    id: WizardStep;
    title: string;
    shortTitle: string;
    description: string;
    optional?: boolean;
}

export const WIZARD_STEPS: WizardStepConfig[] = [
    {
        id: 'property-type',
        title: 'Property Type',
        shortTitle: 'Type',
        description: 'What kind of property are you listing?',
    },
    {
        id: 'location',
        title: 'Location',
        shortTitle: 'Location',
        description: 'Where is your property located?',
    },
    {
        id: 'specifications',
        title: 'Specifications',
        shortTitle: 'Specs',
        description: 'Tell us about the space',
    },
    {
        id: 'amenities',
        title: 'Features & Amenities',
        shortTitle: 'Features',
        description: 'What does your property offer?',
    },
    {
        id: 'energy',
        title: 'Energy & Efficiency',
        shortTitle: 'Energy',
        description: 'Energy ratings help attract eco-conscious tenants',
        optional: true,
    },
    {
        id: 'pricing',
        title: 'Pricing & Availability',
        shortTitle: 'Pricing',
        description: 'Set your rent and availability',
    },
    {
        id: 'media',
        title: 'Photos & Description',
        shortTitle: 'Photos',
        description: 'Make your listing stand out',
    },
    {
        id: 'review',
        title: 'Review & Publish',
        shortTitle: 'Review',
        description: 'Review your listing before publishing',
    },
];

/** Unified image object - works for both existing and new images */
export interface WizardImage {
    id: number | null; // null = new image (not yet on server)
    file: File | null; // File object for new images only
    image_url: string; // Display URL (data URL for new, server URL for existing)
}

export interface PropertyWizardData extends Omit<PropertyFormData, 'images'> {
    images: WizardImage[];
    mainImageId: number | null; // ID of main image (null if main is a new image)
    mainImageIndex: number; // Index in array (used when main is new image or as fallback)
    deletedImageIds: number[]; // IDs of existing images marked for deletion
}

/** Safely coerce a value to number, returning undefined for empty/null/undefined */
function toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
}

/** Safely coerce a value to integer, returning undefined for empty/null/undefined */
function toInt(value: unknown): number | undefined {
    const num = toNumber(value);
    return num !== undefined ? Math.floor(num) : undefined;
}

const getInitialData = (property?: Property): PropertyWizardData => ({
    // Type
    type: property?.type || 'apartment',
    subtype: property?.subtype || 'studio',

    // Location
    house_number: property?.house_number || '',
    street_name: property?.street_name || '',
    street_line2: property?.street_line2 || '',
    city: property?.city || '',
    state: property?.state || '',
    postal_code: property?.postal_code || '',
    country: property?.country || 'CH',

    // Specifications - coerce to proper numeric types
    bedrooms: toInt(property?.bedrooms) ?? 0,
    bathrooms: toNumber(property?.bathrooms) ?? 0,
    parking_spots_interior: toInt(property?.parking_spots_interior) ?? 0,
    parking_spots_exterior: toInt(property?.parking_spots_exterior) ?? 0,
    size: toNumber(property?.size),
    balcony_size: toNumber(property?.balcony_size),
    land_size: toNumber(property?.land_size),
    floor_level: toInt(property?.floor_level),
    has_elevator: Boolean(property?.has_elevator),
    year_built: toInt(property?.year_built),

    // Amenities
    kitchen_equipped: Boolean(property?.kitchen_equipped),
    kitchen_separated: Boolean(property?.kitchen_separated),
    has_cellar: Boolean(property?.has_cellar),
    has_laundry: Boolean(property?.has_laundry),
    has_fireplace: Boolean(property?.has_fireplace),
    has_air_conditioning: Boolean(property?.has_air_conditioning),
    has_garden: Boolean(property?.has_garden),
    has_rooftop: Boolean(property?.has_rooftop),

    // Energy
    energy_class: property?.energy_class || undefined,
    thermal_insulation_class: property?.thermal_insulation_class || undefined,
    heating_type: property?.heating_type || undefined,

    // Pricing - coerce to proper numeric types
    rent_amount: toNumber(property?.rent_amount) ?? 0,
    rent_currency: property?.rent_currency || 'eur',
    available_date: property?.available_date || undefined,
    is_active: true, // Default to active (status = 'available')

    // Media
    title: property?.title || '',
    description: property?.description || '',
    // Convert existing images to unified format
    images: (property?.images || [])
        .filter((img) => img.image_url) // Only include images with URLs
        .map((img) => ({
            id: img.id,
            file: null,
            image_url: img.image_url!,
        })),
    // Find the main image ID, or null if no images
    mainImageId: property?.images?.find((img) => img.is_main)?.id ?? null,
    mainImageIndex: property?.images?.findIndex((img) => img.is_main) ?? 0,
    deletedImageIds: [],
});

/** Data fields that should be autosaved (excludes images which need special handling) */
type AutosaveData = Omit<PropertyWizardData, 'images' | 'mainImageId' | 'mainImageIndex' | 'deletedImageIds'>;

function getAutosaveData(data: PropertyWizardData): AutosaveData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, mainImageId, mainImageIndex, deletedImageIds, ...autosaveData } = data;
    return autosaveData;
}

/** Calculate the maximum valid step based on current data using Zod validation */
function calculateMaxValidStep(data: PropertyWizardData): number {
    return findFirstInvalidStep(data);
}

export interface UsePropertyWizardOptions {
    property?: Property;
    isDraft?: boolean;
    isEditMode?: boolean;
    onDraftCreated?: (propertyId: number) => void;
}

export interface UsePropertyWizardReturn {
    // Current step state
    currentStep: WizardStep;
    currentStepIndex: number;
    currentStepConfig: WizardStepConfig;
    isFirstStep: boolean;
    isLastStep: boolean;

    // Navigation
    goToStep: (step: WizardStep) => void;
    goToNextStep: () => boolean; // Returns true if navigation succeeded, false if validation failed
    goToPreviousStep: () => void;
    canGoToStep: (step: WizardStep) => boolean;

    // Data
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    updateMultipleFields: (updates: Partial<PropertyWizardData>) => void;

    // Validation
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof PropertyWizardData, string>>>>;
    validateCurrentStep: () => boolean;
    validateSpecificStep: (step: WizardStep) => boolean;
    validateForPublish: () => boolean;
    validateFieldOnBlur: (field: keyof PropertyWizardData, value: unknown) => void;

    // Step locking
    maxStepReached: number;

    // Submission
    isSubmitting: boolean;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;

    // Progress
    progress: number;

    // Autosave
    propertyId: number | null;
    autosaveStatus: AutosaveStatus;
    lastSavedAt: Date | null;
    saveNow: () => Promise<void>;
    isInitialized: boolean;
}

export function usePropertyWizard({
    property,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDraft = false,
    isEditMode = false,
    onDraftCreated,
}: UsePropertyWizardOptions = {}): UsePropertyWizardReturn {
    const [currentStep, setCurrentStep] = useState<WizardStep>(() => {
        // Initialize to the saved wizard step if resuming a draft
        if (property?.wizard_step) {
            const stepIndex = Math.min(property.wizard_step - 1, WIZARD_STEPS.length - 1);
            return WIZARD_STEPS[Math.max(0, stepIndex)].id;
        }
        return 'property-type';
    });
    const [data, setData] = useState<PropertyWizardData>(() => getInitialData(property));
    const [errors, setErrors] = useState<Partial<Record<keyof PropertyWizardData, string>>>({});
    const [maxStepReached, setMaxStepReached] = useState<number>(() => {
        // Initialize from property's wizard_step or calculate from data
        if (property?.wizard_step) {
            return property.wizard_step - 1; // Convert 1-indexed DB to 0-indexed
        }
        return 0;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Draft/autosave state
    const [propertyId, setPropertyId] = useState<number | null>(property?.id ?? null);
    const [isInitialized, setIsInitialized] = useState(!!property?.id);
    const [hasUserInteracted, setHasUserInteracted] = useState(!!property?.id); // Only create draft after user interaction

    // Track if we should skip the next step lock check (for forward navigation)
    const skipNextLockCheck = useRef(false);

    const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);
    const currentStepConfig = WIZARD_STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;
    const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

    // Create draft only after user has interacted (to avoid creating drafts for accidental visits)
    // Skip draft creation in edit mode - property already exists
    useEffect(() => {
        if (isEditMode) {
            // In edit mode, property already exists, just mark as initialized
            if (property?.id) {
                setIsInitialized(true);
            }
            return;
        }

        if (!property?.id && !propertyId && !isInitialized && hasUserInteracted) {
            const createDraft = async () => {
                try {
                    const response = await axios.post('/properties/draft', {
                        type: data.type,
                        subtype: data.subtype,
                    });
                    const newId = response.data.id;
                    setPropertyId(newId);
                    setIsInitialized(true);
                    onDraftCreated?.(newId);
                } catch (error) {
                    console.error('Failed to create draft:', error);
                    // Still mark as initialized to prevent retry loops
                    setIsInitialized(true);
                }
            };
            createDraft();
        } else if (property?.id) {
            setIsInitialized(true);
        }
    }, [property?.id, propertyId, isInitialized, hasUserInteracted, data.type, data.subtype, onDraftCreated, isEditMode]);

    // Effect to lock steps when data changes make earlier steps invalid
    useEffect(() => {
        // Skip lock check during forward navigation
        if (skipNextLockCheck.current) {
            skipNextLockCheck.current = false;
            return;
        }

        const maxValid = calculateMaxValidStep(data);

        // If current data invalidates a previous step, lock user to that step
        if (maxValid < maxStepReached) {
            setMaxStepReached(maxValid);
        }

        // If currently viewing a step beyond maxValid, navigate back
        if (currentStepIndex > maxValid) {
            setCurrentStep(WIZARD_STEPS[maxValid].id);
            // Show errors for the step they're being locked to
            const stepId = WIZARD_STEPS[maxValid].id as StepId;
            const result = validateStep(stepId, data);
            if (!result.success) {
                setErrors(result.errors as Partial<Record<keyof PropertyWizardData, string>>);
            }
        }
    }, [data, maxStepReached, currentStepIndex]);

    // Autosave state
    const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedDataRef = useRef<string | null>(null);

    // Memoize autosave data
    const autosaveData = useMemo(() => getAutosaveData(data), [data]);

    // Simple debounced autosave effect
    useEffect(() => {
        // Skip autosave in edit mode - changes are saved explicitly via Save button
        if (isEditMode) {
            return;
        }

        // Skip if not ready
        if (!isInitialized || !propertyId) {
            return;
        }

        // Skip if data hasn't changed from last save
        const dataStr = JSON.stringify(autosaveData);
        if (lastSavedDataRef.current === dataStr) {
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
                const response = await axios.patch(`/properties/${propertyId}/draft`, {
                    ...autosaveData,
                    wizard_step: maxStepReached + 1,
                });

                lastSavedDataRef.current = dataStr;
                setLastSavedAt(new Date());
                setAutosaveStatus('saved');

                // Backend may reduce max_valid_step if validation failed
                if (response.data.max_valid_step !== undefined) {
                    const backendMaxStep = response.data.max_valid_step - 1;
                    if (backendMaxStep < maxStepReached) {
                        setMaxStepReached(backendMaxStep);
                        if (currentStepIndex > backendMaxStep) {
                            setCurrentStep(WIZARD_STEPS[backendMaxStep].id);
                        }
                    }
                }
            } catch (error) {
                console.error('Autosave failed:', error);
                setAutosaveStatus('error');
            }
        }, 1000);

        // Cleanup
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [autosaveData, isInitialized, propertyId, maxStepReached, currentStepIndex, isEditMode]);

    // Manual save function
    const saveNow = useCallback(async () => {
        if (!propertyId) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        setAutosaveStatus('saving');
        try {
            await axios.patch(`/properties/${propertyId}/draft`, {
                ...autosaveData,
                wizard_step: maxStepReached + 1,
            });
            lastSavedDataRef.current = JSON.stringify(autosaveData);
            setLastSavedAt(new Date());
            setAutosaveStatus('saved');
        } catch (error) {
            console.error('Save failed:', error);
            setAutosaveStatus('error');
        }
    }, [propertyId, autosaveData, maxStepReached]);

    const updateData = useCallback(<K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => {
        setHasUserInteracted(true); // Mark that user has interacted
        setData((prev) => {
            // When property type changes, clear specification fields that may not apply to the new type
            if (key === 'type' && value !== prev.type) {
                return {
                    ...prev,
                    [key]: value,
                    // Reset all specification fields to defaults
                    bedrooms: 0,
                    bathrooms: 0,
                    parking_spots_interior: 0,
                    parking_spots_exterior: 0,
                    size: undefined,
                    balcony_size: undefined,
                    land_size: undefined,
                    floor_level: undefined,
                    has_elevator: false,
                    year_built: undefined,
                };
            }
            return { ...prev, [key]: value };
        });
        // Clear error when field is updated
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[key];
            // Also clear specification errors when type changes
            if (key === 'type') {
                delete newErrors.bedrooms;
                delete newErrors.bathrooms;
                delete newErrors.parking_spots_interior;
                delete newErrors.parking_spots_exterior;
                delete newErrors.size;
                delete newErrors.balcony_size;
                delete newErrors.land_size;
                delete newErrors.floor_level;
                delete newErrors.has_elevator;
                delete newErrors.year_built;
            }
            return newErrors;
        });
    }, []);

    const updateMultipleFields = useCallback((updates: Partial<PropertyWizardData>) => {
        setHasUserInteracted(true); // Mark that user has interacted
        setData((prev) => ({ ...prev, ...updates }));
        // Clear errors for updated fields
        setErrors((prev) => {
            const newErrors = { ...prev };
            Object.keys(updates).forEach((key) => {
                delete newErrors[key as keyof PropertyWizardData];
            });
            return newErrors;
        });
    }, []);

    /**
     * Validate a single field on blur using Zod schema
     */
    const validateFieldOnBlur = useCallback(
        (field: keyof PropertyWizardData, value: unknown) => {
            const stepId = currentStep as StepId;
            if (stepId === 'review') return; // Review step uses full validation

            const error = validateField(stepId, field as string, value, data as unknown as Record<string, unknown>);

            setErrors((prev) => {
                if (error) {
                    return { ...prev, [field]: error };
                } else {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                }
            });
        },
        [currentStep, data],
    );

    /**
     * Validate the current step using Zod schema
     */
    const validateCurrentStepFn = useCallback((): boolean => {
        const stepId = currentStep as StepId;
        const result = validateStep(stepId, data);

        if (result.success) {
            setErrors({});
            return true;
        }

        setErrors(result.errors as Partial<Record<keyof PropertyWizardData, string>>);
        return false;
    }, [currentStep, data]);

    /**
     * Validate a specific step using Zod schema (for edit mode)
     */
    const validateSpecificStepFn = useCallback(
        (step: WizardStep): boolean => {
            const stepId = step as StepId;

            // Special handling for media step - check images
            if (stepId === 'media') {
                if (data.images.length === 0) {
                    setErrors({ images: PROPERTY_MESSAGES.images.required });
                    return false;
                }
            }

            const result = validateStep(stepId, data);

            if (result.success) {
                setErrors({});
                return true;
            }

            setErrors(result.errors as Partial<Record<keyof PropertyWizardData, string>>);
            return false;
        },
        [data],
    );

    /**
     * Validate all data for publishing using Zod schema
     */
    const validateForPublishFn = useCallback((): boolean => {
        const result = validateForPublish(data);
        const errors: Partial<Record<keyof PropertyWizardData, string>> = {};

        if (!result.success) {
            Object.assign(errors, result.errors);
        }

        // Validate images separately (File objects can't be validated with Zod)
        if (data.images.length === 0) {
            errors.images = PROPERTY_MESSAGES.images.required;
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return false;
        }

        setErrors({});
        return true;
    }, [data]);

    const goToStep = useCallback(
        (step: WizardStep) => {
            const targetIndex = WIZARD_STEPS.findIndex((s) => s.id === step);

            // Can always go back
            if (targetIndex <= currentStepIndex) {
                setCurrentStep(step);
                return;
            }

            // Can only go forward if all previous steps are valid
            if (targetIndex <= maxStepReached) {
                setCurrentStep(step);
            }
        },
        [currentStepIndex, maxStepReached],
    );

    const goToNextStep = useCallback((): boolean => {
        const stepId = currentStep as StepId;
        const result = validateStep(stepId, data);
        const stepErrors: Partial<Record<keyof PropertyWizardData, string>> = {};

        if (!result.success) {
            Object.assign(stepErrors, result.errors);
        }

        // Additional image validation for media step
        if (stepId === 'media') {
            if (data.images.length === 0) {
                stepErrors.images = PROPERTY_MESSAGES.images.required;
            }
        }

        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return false; // Validation failed
        }

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < WIZARD_STEPS.length) {
            // Mark user interaction to trigger draft creation if not already done
            setHasUserInteracted(true);
            // Update maxStepReached if advancing beyond current max
            if (nextIndex > maxStepReached) {
                // Skip the lock check since we're intentionally advancing
                skipNextLockCheck.current = true;
                setMaxStepReached(nextIndex);
            }
            setCurrentStep(WIZARD_STEPS[nextIndex].id);
            setErrors({}); // Clear errors when moving to next step
        }
        return true; // Navigation succeeded
    }, [currentStep, currentStepIndex, data, maxStepReached]);

    const goToPreviousStep = useCallback(() => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(WIZARD_STEPS[prevIndex].id);
        }
    }, [currentStepIndex]);

    const canGoToStep = useCallback(
        (step: WizardStep): boolean => {
            const stepIndex = WIZARD_STEPS.findIndex((s) => s.id === step);
            // Can always go back
            if (stepIndex <= currentStepIndex) return true;
            // Can only go forward if within maxStepReached
            return stepIndex <= maxStepReached;
        },
        [currentStepIndex, maxStepReached],
    );

    return {
        currentStep,
        currentStepIndex,
        currentStepConfig,
        isFirstStep,
        isLastStep,
        goToStep,
        goToNextStep,
        goToPreviousStep,
        canGoToStep,
        data,
        updateData,
        updateMultipleFields,
        errors,
        setErrors,
        validateCurrentStep: validateCurrentStepFn,
        validateSpecificStep: validateSpecificStepFn,
        validateForPublish: validateForPublishFn,
        validateFieldOnBlur,
        maxStepReached,
        isSubmitting,
        setIsSubmitting,
        progress,
        // Autosave
        propertyId,
        autosaveStatus,
        lastSavedAt,
        saveNow,
        isInitialized,
    };
}
