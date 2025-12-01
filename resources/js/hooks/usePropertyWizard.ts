import type { Property, PropertyFormData } from '@/types/dashboard';
import { useCallback, useState } from 'react';

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
});

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
    completedSteps: Set<WizardStep>;

    // Submission
    isSubmitting: boolean;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;

    // Progress
    progress: number;
}

export function usePropertyWizard(property?: Property): UsePropertyWizardReturn {
    const [currentStep, setCurrentStep] = useState<WizardStep>('property-type');
    const [data, setData] = useState<PropertyWizardData>(() => getInitialData(property));
    const [errors, setErrors] = useState<Partial<Record<keyof PropertyWizardData, string>>>({});
    const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);
    const currentStepConfig = WIZARD_STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;
    const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

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

    const validateCurrentStep = useCallback((): boolean => {
        const newErrors: Partial<Record<keyof PropertyWizardData, string>> = {};

        switch (currentStep) {
            case 'property-type':
                if (!data.type) newErrors.type = 'Please select a property type';
                if (!data.subtype) newErrors.subtype = 'Please select a property subtype';
                break;

            case 'location':
                if (!data.house_number?.trim()) newErrors.house_number = 'House number is required';
                if (!data.street_name?.trim()) newErrors.street_name = 'Street name is required';
                if (!data.city?.trim()) newErrors.city = 'City is required';
                if (!data.postal_code?.trim()) newErrors.postal_code = 'Postal code is required';
                if (!data.country?.trim()) newErrors.country = 'Country is required';
                break;

            case 'specifications':
                // Size is recommended but not required
                break;

            case 'amenities':
                // All optional
                break;

            case 'energy':
                // All optional
                break;

            case 'pricing':
                if (!data.rent_amount || data.rent_amount <= 0) {
                    newErrors.rent_amount = 'Please enter a valid rent amount';
                }
                break;

            case 'media':
                if (!data.title?.trim()) newErrors.title = 'Property title is required';
                break;

            case 'review':
                // Final validation of all required fields
                if (!data.type) newErrors.type = 'Property type is required';
                if (!data.house_number?.trim()) newErrors.house_number = 'House number is required';
                if (!data.street_name?.trim()) newErrors.street_name = 'Street name is required';
                if (!data.city?.trim()) newErrors.city = 'City is required';
                if (!data.postal_code?.trim()) newErrors.postal_code = 'Postal code is required';
                if (!data.rent_amount || data.rent_amount <= 0) newErrors.rent_amount = 'Rent amount is required';
                if (!data.title?.trim()) newErrors.title = 'Property title is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [currentStep, data]);

    const markStepComplete = useCallback((step: WizardStep) => {
        setCompletedSteps((prev) => new Set([...prev, step]));
    }, []);

    const goToStep = useCallback((step: WizardStep) => {
        setCurrentStep(step);
    }, []);

    const goToNextStep = useCallback(() => {
        if (validateCurrentStep()) {
            markStepComplete(currentStep);
            const nextIndex = currentStepIndex + 1;
            if (nextIndex < WIZARD_STEPS.length) {
                setCurrentStep(WIZARD_STEPS[nextIndex].id);
            }
        }
    }, [currentStep, currentStepIndex, validateCurrentStep, markStepComplete]);

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
            if (stepIndex < currentStepIndex) return true;
            // Can go forward if all previous steps are completed
            for (let i = 0; i < stepIndex; i++) {
                if (!completedSteps.has(WIZARD_STEPS[i].id)) return false;
            }
            return true;
        },
        [currentStepIndex, completedSteps],
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
        validateCurrentStep,
        completedSteps,
        isSubmitting,
        setIsSubmitting,
        progress,
    };
}
