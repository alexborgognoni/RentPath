import axios from '@/lib/axios';
import { PROPERTY_MESSAGES } from '@/lib/validation/property-messages';
import { validateField, validateForPublish, validateStep, type StepId } from '@/lib/validation/property-schemas';
import type { SharedData } from '@/types';
import type { Property, PropertyFormData } from '@/types/dashboard';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWizard, type AutosaveStatus, type WizardStepConfig } from './useWizard';

export type { AutosaveStatus } from './useWizard';

export type WizardStep = 'property-type' | 'location' | 'specifications' | 'amenities' | 'energy' | 'pricing' | 'media' | 'review';

export type { WizardStepConfig };

export const WIZARD_STEPS: WizardStepConfig<WizardStep>[] = [
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
    size_unit: property?.size_unit || 'sqm',
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
    currentStepConfig: WizardStepConfig<WizardStep>;
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
    // Property-specific state
    const [propertyId, setPropertyId] = useState<number | null>(property?.id ?? null);
    const [isInitialized, setIsInitialized] = useState(!!property?.id);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate initial step from property's wizard_step (used as starting point before validation)
    const initialStepIndex = property?.wizard_step ? Math.min(property.wizard_step - 1, WIZARD_STEPS.length - 1) : 0;

    // Property-specific validation wrapper
    const validateStepWrapper = useCallback((stepId: WizardStep, data: PropertyWizardData) => {
        // Additional image validation for media step
        if (stepId === 'media') {
            if (data.images.length === 0) {
                return { success: false, errors: { images: PROPERTY_MESSAGES.images.required } };
            }
        }

        const result = validateStep(stepId as StepId, data);
        return {
            success: result.success,
            errors: result.success ? {} : (result.errors as Record<string, string>),
        };
    }, []);

    // Property-specific save function
    const handleSave = useCallback(
        async (data: PropertyWizardData, wizardStep: number) => {
            if (!propertyId || isEditMode) {
                return {};
            }

            const autosaveData = getAutosaveData(data);
            const response = await axios.patch(`/properties/${propertyId}/draft`, {
                ...autosaveData,
                wizard_step: wizardStep,
            });

            return {
                maxValidStep: response.data.max_valid_step,
            };
        },
        [propertyId, isEditMode],
    );

    // Use the generic wizard hook
    const wizard = useWizard<PropertyWizardData, WizardStep>({
        steps: WIZARD_STEPS,
        initialData: getInitialData(property),
        initialStepIndex: Math.max(0, initialStepIndex),
        validateStep: validateStepWrapper,
        onSave: handleSave,
        enableAutosave: !isEditMode && isInitialized && !!propertyId,
    });

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

        if (!property?.id && !propertyId && !isInitialized && wizard.hasUserInteracted) {
            const createDraft = async () => {
                try {
                    const response = await axios.post('/properties/draft', {
                        type: wizard.data.type,
                        subtype: wizard.data.subtype,
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
    }, [property?.id, propertyId, isInitialized, wizard.hasUserInteracted, wizard.data.type, wizard.data.subtype, onDraftCreated, isEditMode]);

    // Property-specific: reset specification fields when type changes
    const updateData = useCallback(
        <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => {
            if (key === 'type' && value !== wizard.data.type) {
                // Reset all specification fields to defaults when type changes
                wizard.updateFields({
                    [key]: value,
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
                } as Partial<PropertyWizardData>);
                // Clear specification errors
                wizard.setErrors((prev) => {
                    const newErrors = { ...prev };
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
                    return newErrors;
                });
            } else {
                wizard.updateField(key, value);
            }
        },
        [wizard],
    );

    // Property-specific field validation on blur
    const validateFieldOnBlur = useCallback(
        (field: keyof PropertyWizardData, value: unknown) => {
            const stepId = wizard.currentStep as StepId;
            if (stepId === 'review') return; // Review step uses full validation

            const error = validateField(stepId, field as string, value, wizard.data as unknown as Record<string, unknown>);

            wizard.setErrors((prev) => {
                if (error) {
                    return { ...prev, [field]: error };
                } else {
                    const newErrors = { ...prev };
                    delete newErrors[field as string];
                    return newErrors;
                }
            });
        },
        [wizard],
    );

    // Property-specific: validate a specific step (for edit mode)
    const validateSpecificStep = useCallback(
        (step: WizardStep): boolean => {
            const stepId = step as StepId;

            // Special handling for media step - check images
            if (stepId === 'media') {
                if (wizard.data.images.length === 0) {
                    wizard.setErrors({ images: PROPERTY_MESSAGES.images.required });
                    return false;
                }
            }

            const result = validateStep(stepId, wizard.data);

            if (result.success) {
                wizard.setErrors({});
                return true;
            }

            wizard.setErrors(result.errors as Partial<Record<keyof PropertyWizardData, string>>);
            return false;
        },
        [wizard],
    );

    // Property-specific: validate all data for publishing
    const validateForPublishFn = useCallback((): boolean => {
        const result = validateForPublish(wizard.data);
        const errors: Partial<Record<keyof PropertyWizardData, string>> = {};

        if (!result.success) {
            Object.assign(errors, result.errors);
        }

        // Validate images separately (File objects can't be validated with Zod)
        if (wizard.data.images.length === 0) {
            errors.images = PROPERTY_MESSAGES.images.required;
        }

        if (Object.keys(errors).length > 0) {
            wizard.setErrors(errors);
            return false;
        }

        wizard.setErrors({});
        return true;
    }, [wizard]);

    return {
        // Step state
        currentStep: wizard.currentStep,
        currentStepIndex: wizard.currentStepIndex,
        currentStepConfig: wizard.currentStepConfig,
        isFirstStep: wizard.isFirstStep,
        isLastStep: wizard.isLastStep,
        maxStepReached: wizard.maxStepReached,

        // Navigation
        goToStep: wizard.goToStep,
        goToNextStep: wizard.goToNextStep,
        goToPreviousStep: wizard.goToPreviousStep,
        canGoToStep: wizard.canGoToStep,

        // Data
        data: wizard.data,
        updateData,
        updateMultipleFields: wizard.updateFields,

        // Validation
        errors: wizard.errors as Partial<Record<keyof PropertyWizardData, string>>,
        setErrors: wizard.setErrors as React.Dispatch<React.SetStateAction<Partial<Record<keyof PropertyWizardData, string>>>>,
        validateCurrentStep: wizard.validateCurrentStep,
        validateSpecificStep,
        validateForPublish: validateForPublishFn,
        validateFieldOnBlur,

        // Submission
        isSubmitting,
        setIsSubmitting,

        // Progress
        progress: wizard.progress,

        // Autosave
        propertyId,
        autosaveStatus: wizard.autosaveStatus,
        lastSavedAt: wizard.lastSavedAt,
        saveNow: wizard.saveNow,
        isInitialized,
    };
}

/**
 * Hook to get translated wizard steps
 * Returns the WIZARD_STEPS array with translated titles and descriptions
 */
export function useWizardSteps(): WizardStepConfig<WizardStep>[] {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);

    return useMemo(
        () => [
            {
                id: 'property-type',
                title: t('wizard.steps.propertyType.title'),
                shortTitle: t('wizard.steps.propertyType.shortTitle'),
                description: t('wizard.steps.propertyType.description'),
            },
            {
                id: 'location',
                title: t('wizard.steps.location.title'),
                shortTitle: t('wizard.steps.location.shortTitle'),
                description: t('wizard.steps.location.description'),
            },
            {
                id: 'specifications',
                title: t('wizard.steps.specifications.title'),
                shortTitle: t('wizard.steps.specifications.shortTitle'),
                description: t('wizard.steps.specifications.description'),
            },
            {
                id: 'amenities',
                title: t('wizard.steps.amenities.title'),
                shortTitle: t('wizard.steps.amenities.shortTitle'),
                description: t('wizard.steps.amenities.description'),
            },
            {
                id: 'energy',
                title: t('wizard.steps.energy.title'),
                shortTitle: t('wizard.steps.energy.shortTitle'),
                description: t('wizard.steps.energy.description'),
                optional: true,
            },
            {
                id: 'pricing',
                title: t('wizard.steps.pricing.title'),
                shortTitle: t('wizard.steps.pricing.shortTitle'),
                description: t('wizard.steps.pricing.description'),
            },
            {
                id: 'media',
                title: t('wizard.steps.media.title'),
                shortTitle: t('wizard.steps.media.shortTitle'),
                description: t('wizard.steps.media.description'),
            },
            {
                id: 'review',
                title: t('wizard.steps.review.title'),
                shortTitle: t('wizard.steps.review.shortTitle'),
                description: t('wizard.steps.review.description'),
            },
        ],
        [translations],
    );
}
