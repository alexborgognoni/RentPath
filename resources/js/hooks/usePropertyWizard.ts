import type { AutosaveStatus } from '@/hooks/useAutosave';
import { useAutosave } from '@/hooks/useAutosave';
import { findFirstInvalidStep, validateField, validateForPublish, validateStep, type StepId } from '@/lib/validation/property-schemas';
import type { Property, PropertyFormData } from '@/types/dashboard';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

export interface PropertyWizardData extends Omit<PropertyFormData, 'images'> {
    images: File[];
    imagePreviews: string[];
    mainImageIndex: number;
    existingImages?: Array<{
        id: number;
        image_url: string;
        image_path: string;
        is_main: boolean;
        sort_order: number;
    }>;
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

    // Specifications
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    parking_spots_interior: property?.parking_spots_interior || 0,
    parking_spots_exterior: property?.parking_spots_exterior || 0,
    size: property?.size || undefined,
    balcony_size: property?.balcony_size || undefined,
    land_size: property?.land_size || undefined,
    floor_level: property?.floor_level || undefined,
    has_elevator: property?.has_elevator || false,
    year_built: property?.year_built || undefined,

    // Amenities
    kitchen_equipped: property?.kitchen_equipped || false,
    kitchen_separated: property?.kitchen_separated || false,
    has_cellar: property?.has_cellar || false,
    has_laundry: property?.has_laundry || false,
    has_fireplace: property?.has_fireplace || false,
    has_air_conditioning: property?.has_air_conditioning || false,
    has_garden: property?.has_garden || false,
    has_rooftop: property?.has_rooftop || false,

    // Energy
    energy_class: property?.energy_class || undefined,
    thermal_insulation_class: property?.thermal_insulation_class || undefined,
    heating_type: property?.heating_type || undefined,

    // Pricing
    rent_amount: property?.rent_amount || 0,
    rent_currency: property?.rent_currency || 'eur',
    available_date: property?.available_date || undefined,

    // Media
    title: property?.title || '',
    description: property?.description || '',
    images: [],
    imagePreviews: [],
    mainImageIndex: 0,
    existingImages: property?.images as PropertyWizardData['existingImages'],
});

/** Data fields that should be autosaved (excludes images which need special handling) */
type AutosaveData = Omit<PropertyWizardData, 'images' | 'imagePreviews' | 'mainImageIndex' | 'existingImages'>;

function getAutosaveData(data: PropertyWizardData): AutosaveData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, imagePreviews, mainImageIndex, existingImages, ...autosaveData } = data;
    return autosaveData;
}

/** Calculate the maximum valid step based on current data using Zod validation */
function calculateMaxValidStep(data: PropertyWizardData): number {
    return findFirstInvalidStep(data);
}

export interface UsePropertyWizardOptions {
    property?: Property;
    isDraft?: boolean;
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
    goToNextStep: () => void;
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

    // Track if we should skip the next step lock check (for forward navigation)
    const skipNextLockCheck = useRef(false);

    const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);
    const currentStepConfig = WIZARD_STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;
    const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

    // Create draft on mount if no property exists
    useEffect(() => {
        if (!property?.id && !propertyId && !isInitialized) {
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
    }, [property?.id, propertyId, isInitialized, data.type, data.subtype, onDraftCreated]);

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

    // Autosave handler - includes wizard_step
    const handleAutosave = useCallback(
        async (autosaveData: AutosaveData) => {
            if (!propertyId) {
                throw new Error('No property ID for autosave');
            }

            const response = await axios.patch(`/properties/${propertyId}/draft`, {
                ...autosaveData,
                wizard_step: maxStepReached + 1, // 1-indexed for backend
            });

            // Backend may reduce max_valid_step if validation failed
            if (response.data.max_valid_step !== undefined) {
                const backendMaxStep = response.data.max_valid_step - 1; // Convert to 0-indexed
                if (backendMaxStep < maxStepReached) {
                    setMaxStepReached(backendMaxStep);
                    if (currentStepIndex > backendMaxStep) {
                        setCurrentStep(WIZARD_STEPS[backendMaxStep].id);
                    }
                }
            }
        },
        [propertyId, maxStepReached, currentStepIndex],
    );

    // Memoize autosave data to prevent unnecessary saves
    const autosaveData = useMemo(() => getAutosaveData(data), [data]);

    // Setup autosave
    const {
        status: autosaveStatus,
        lastSavedAt,
        saveNow,
    } = useAutosave({
        data: autosaveData,
        onSave: handleAutosave,
        debounceMs: 1000,
        enabled: isInitialized && !!propertyId,
        onError: (error) => {
            console.error('Autosave failed:', error);
        },
    });

    const updateData = useCallback(<K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => {
        setData((prev) => ({ ...prev, [key]: value }));
        // Clear error when field is updated
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });
    }, []);

    const updateMultipleFields = useCallback((updates: Partial<PropertyWizardData>) => {
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

            const error = validateField(stepId, field as string, value, data as Record<string, unknown>);

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
     * Validate all data for publishing using Zod schema
     */
    const validateForPublishFn = useCallback((): boolean => {
        const result = validateForPublish(data);

        if (result.success) {
            setErrors({});
            return true;
        }

        setErrors(result.errors as Partial<Record<keyof PropertyWizardData, string>>);
        return false;
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

    const goToNextStep = useCallback(() => {
        const stepId = currentStep as StepId;
        const result = validateStep(stepId, data);

        if (!result.success) {
            setErrors(result.errors as Partial<Record<keyof PropertyWizardData, string>>);
            return;
        }

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < WIZARD_STEPS.length) {
            // Update maxStepReached if advancing beyond current max
            if (nextIndex > maxStepReached) {
                // Skip the lock check since we're intentionally advancing
                skipNextLockCheck.current = true;
                setMaxStepReached(nextIndex);
            }
            setCurrentStep(WIZARD_STEPS[nextIndex].id);
            setErrors({}); // Clear errors when moving to next step
        }
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
