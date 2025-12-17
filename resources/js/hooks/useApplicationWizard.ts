import {
    findFirstInvalidApplicationStep,
    validateApplicationForSubmit,
    validateApplicationStep,
    type ApplicationStepId,
} from '@/lib/validation/application-schemas';
import type { TenantProfile } from '@/types';
import { route } from '@/utils/route';
import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { useWizard, type AutosaveStatus, type WizardStepConfig } from './useWizard';

export type { AutosaveStatus } from './useWizard';

export type ApplicationStep = 'details' | 'references' | 'emergency' | 'documents';

export const APPLICATION_STEPS: WizardStepConfig<ApplicationStep>[] = [
    {
        id: 'details',
        title: 'Application Details',
        shortTitle: 'Details',
        description: 'Tell us about your move-in preferences',
    },
    {
        id: 'references',
        title: 'References',
        shortTitle: 'References',
        description: 'Previous landlord and personal references',
        optional: true,
    },
    {
        id: 'emergency',
        title: 'Emergency Contact',
        shortTitle: 'Emergency',
        description: 'Who should we contact in case of emergency?',
        optional: true,
    },
    {
        id: 'documents',
        title: 'Documents',
        shortTitle: 'Documents',
        description: 'Upload any additional documents',
        optional: true,
    },
];

// ===== Types =====

export interface OccupantDetails {
    name: string;
    age: string;
    relationship: string;
    relationship_other: string;
}

export interface PetDetails {
    type: string;
    type_other: string;
    breed: string;
    age: string;
    weight: string;
}

export interface ReferenceDetails {
    name: string;
    phone: string;
    email: string;
    relationship: string;
    relationship_other: string;
    years_known: string;
}

export interface ApplicationWizardData {
    // Step 1: Details
    desired_move_in_date: string;
    lease_duration_months: number;
    message_to_landlord: string;
    additional_occupants: number;
    occupants_details: OccupantDetails[];
    has_pets: boolean;
    pets_details: PetDetails[];

    // Step 2: References
    previous_landlord_name: string;
    previous_landlord_phone: string;
    previous_landlord_email: string;
    references: ReferenceDetails[];

    // Step 3: Emergency Contact
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;

    // Step 4: Documents
    application_id_document: File | null;
    application_proof_of_income: File | null;
    application_reference_letter: File | null;
    additional_documents: File[];

    // Token
    invited_via_token: string;
}

export interface DraftApplication {
    current_step: number;
    desired_move_in_date: string;
    lease_duration_months: number;
    message_to_landlord: string;
    additional_occupants: number;
    occupants_details: OccupantDetails[];
    has_pets: boolean;
    pets_details: PetDetails[];
    previous_landlord_name: string;
    previous_landlord_phone: string;
    previous_landlord_email: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
    references: ReferenceDetails[];
}

// ===== Initial Data =====

function getInitialData(draft?: DraftApplication | null, tenantProfile?: TenantProfile, token?: string | null): ApplicationWizardData {
    return {
        // Step 1: Details
        desired_move_in_date: draft?.desired_move_in_date ? new Date(draft.desired_move_in_date).toISOString().split('T')[0] : '',
        lease_duration_months: draft?.lease_duration_months || 12,
        message_to_landlord: draft?.message_to_landlord || '',
        additional_occupants: draft?.additional_occupants || 0,
        occupants_details: draft?.occupants_details || [],
        has_pets: draft?.has_pets || false,
        pets_details: draft?.pets_details || [],

        // Step 2: References
        previous_landlord_name: draft?.previous_landlord_name || '',
        previous_landlord_phone: draft?.previous_landlord_phone || '',
        previous_landlord_email: draft?.previous_landlord_email || '',
        references: draft?.references || [],

        // Step 3: Emergency Contact (pre-fill from tenant profile if available)
        emergency_contact_name: draft?.emergency_contact_name || tenantProfile?.emergency_contact_name || '',
        emergency_contact_phone: draft?.emergency_contact_phone || tenantProfile?.emergency_contact_phone || '',
        emergency_contact_relationship: draft?.emergency_contact_relationship || tenantProfile?.emergency_contact_relationship || '',

        // Step 4: Documents (always start empty - files can't be saved in draft)
        application_id_document: null,
        application_proof_of_income: null,
        application_reference_letter: null,
        additional_documents: [],

        // Token
        invited_via_token: token || '',
    };
}

// ===== Hook Options =====

export interface UseApplicationWizardOptions {
    propertyId: number;
    tenantProfile?: TenantProfile;
    draftApplication?: DraftApplication | null;
    token?: string | null;
    onDraftUpdated?: (draft: DraftApplication) => void;
}

export interface UseApplicationWizardReturn {
    // Step state
    currentStep: ApplicationStep;
    currentStepIndex: number;
    currentStepConfig: WizardStepConfig<ApplicationStep>;
    isFirstStep: boolean;
    isLastStep: boolean;
    maxStepReached: number;
    steps: WizardStepConfig<ApplicationStep>[];

    // Navigation
    goToStep: (step: ApplicationStep) => void;
    goToNextStep: () => boolean;
    goToPreviousStep: () => void;
    canGoToStep: (step: ApplicationStep) => boolean;

    // Data
    data: ApplicationWizardData;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    updateFields: (updates: Partial<ApplicationWizardData>) => void;

    // Occupants helpers
    addOccupant: () => void;
    removeOccupant: (index: number) => void;
    updateOccupant: (index: number, field: keyof OccupantDetails, value: string) => void;

    // Pets helpers
    addPet: () => void;
    removePet: (index: number) => void;
    updatePet: (index: number, field: keyof PetDetails, value: string) => void;

    // References helpers
    addReference: () => void;
    removeReference: (index: number) => void;
    updateReference: (index: number, field: keyof ReferenceDetails, value: string) => void;

    // Validation
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    validateCurrentStep: () => boolean;
    validateForSubmit: () => boolean;
    clearFieldError: (field: string) => void;

    // Touched fields (for showing errors)
    touchedFields: Record<string, boolean>;
    markFieldTouched: (field: string) => void;
    markAllCurrentStepFieldsTouched: () => void;

    // Autosave
    autosaveStatus: AutosaveStatus;
    lastSavedAt: Date | null;
    saveNow: () => Promise<void>;
    pendingSave: boolean;

    // Submission
    isSubmitting: boolean;
    submit: () => void;
    uploadProgress: number | null;

    // Progress
    progress: number;
}

// ===== Hook Implementation =====

export function useApplicationWizard({
    propertyId,
    tenantProfile,
    draftApplication,
    token,
    onDraftUpdated,
}: UseApplicationWizardOptions): UseApplicationWizardReturn {
    // Application-specific state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [pendingSave, setPendingSave] = useState(false);

    // Calculate initial step from draft's current_step
    const initialStepIndex = draftApplication?.current_step ? Math.min(draftApplication.current_step - 1, APPLICATION_STEPS.length - 1) : 0;
    const initialMaxStepReached = draftApplication?.current_step ? draftApplication.current_step - 1 : 0;

    // Validation wrapper
    const validateStepWrapper = useCallback((stepId: ApplicationStep, data: ApplicationWizardData) => {
        const result = validateApplicationStep(stepId as ApplicationStepId, data as unknown as Record<string, unknown>);
        return {
            success: result.success,
            errors: result.errors,
        };
    }, []);

    // Find first invalid step wrapper
    const findFirstInvalidStepWrapper = useCallback((data: ApplicationWizardData): number => {
        return findFirstInvalidApplicationStep(data as unknown as Record<string, unknown>);
    }, []);

    // Save function
    const handleSave = useCallback(
        async (data: ApplicationWizardData, wizardStep: number) => {
            setPendingSave(true);
            try {
                const url = route('applications.save-draft', { property: propertyId }) + (token ? `?token=${token}` : '');

                return new Promise<{ maxValidStep?: number }>((resolve, reject) => {
                    router.post(
                        url,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        { ...data, current_step: wizardStep } as any,
                        {
                            preserveState: true,
                            preserveScroll: true,
                            only: ['draftApplication'],
                            onSuccess: (page) => {
                                const updatedDraft = (page.props as { draftApplication?: DraftApplication }).draftApplication;
                                if (updatedDraft) {
                                    onDraftUpdated?.(updatedDraft);
                                    resolve({ maxValidStep: updatedDraft.current_step });
                                } else {
                                    resolve({});
                                }
                                setPendingSave(false);
                            },
                            onError: () => {
                                reject(new Error('Failed to save draft'));
                                setPendingSave(false);
                            },
                        },
                    );
                });
            } catch (error) {
                setPendingSave(false);
                throw error;
            }
        },
        [propertyId, token, onDraftUpdated],
    );

    // Use the generic wizard hook
    const wizard = useWizard<ApplicationWizardData, ApplicationStep>({
        steps: APPLICATION_STEPS,
        initialData: getInitialData(draftApplication, tenantProfile, token),
        initialStepIndex: Math.max(0, initialStepIndex),
        initialMaxStepReached: Math.max(0, initialMaxStepReached),
        validateStep: validateStepWrapper,
        findFirstInvalidStep: findFirstInvalidStepWrapper,
        onSave: handleSave,
        enableAutosave: true,
        saveDebounceMs: 500,
    });

    // ===== Occupant Helpers =====
    const addOccupant = useCallback(() => {
        const updated = [...wizard.data.occupants_details, { name: '', age: '', relationship: '', relationship_other: '' }];
        wizard.updateFields({
            occupants_details: updated,
            additional_occupants: updated.length,
        });
    }, [wizard]);

    const removeOccupant = useCallback(
        (index: number) => {
            const updated = wizard.data.occupants_details.filter((_, i) => i !== index);
            wizard.updateFields({
                occupants_details: updated,
                additional_occupants: updated.length,
            });
        },
        [wizard],
    );

    const updateOccupant = useCallback(
        (index: number, field: keyof OccupantDetails, value: string) => {
            const updated = [...wizard.data.occupants_details];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('occupants_details', updated);
            setTouchedFields((prev) => ({ ...prev, [`occupant_${index}_${field}`]: true }));
        },
        [wizard],
    );

    // ===== Pet Helpers =====
    const addPet = useCallback(() => {
        wizard.updateField('pets_details', [...wizard.data.pets_details, { type: '', type_other: '', breed: '', age: '', weight: '' }]);
    }, [wizard]);

    const removePet = useCallback(
        (index: number) => {
            // Prevent removing the first pet if has_pets is checked
            if (wizard.data.has_pets && wizard.data.pets_details.length === 1) {
                return;
            }
            wizard.updateField(
                'pets_details',
                wizard.data.pets_details.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updatePet = useCallback(
        (index: number, field: keyof PetDetails, value: string) => {
            const updated = [...wizard.data.pets_details];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('pets_details', updated);
            setTouchedFields((prev) => ({ ...prev, [`pet_${index}_${field}`]: true }));
        },
        [wizard],
    );

    // ===== Reference Helpers =====
    const addReference = useCallback(() => {
        wizard.updateField('references', [
            ...wizard.data.references,
            { name: '', phone: '', email: '', relationship: '', relationship_other: '', years_known: '' },
        ]);
    }, [wizard]);

    const removeReference = useCallback(
        (index: number) => {
            wizard.updateField(
                'references',
                wizard.data.references.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updateReference = useCallback(
        (index: number, field: keyof ReferenceDetails, value: string) => {
            const updated = [...wizard.data.references];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('references', updated);
            setTouchedFields((prev) => ({ ...prev, [`ref_${index}_${field}`]: true }));
        },
        [wizard],
    );

    // ===== Touched Fields =====
    const markFieldTouched = useCallback((field: string) => {
        setTouchedFields((prev) => ({ ...prev, [field]: true }));
    }, []);

    const markAllCurrentStepFieldsTouched = useCallback(() => {
        const newTouched: Record<string, boolean> = { ...touchedFields };

        if (wizard.currentStep === 'details') {
            newTouched.desired_move_in_date = true;
            newTouched.lease_duration_months = true;

            wizard.data.occupants_details.forEach((occupant, index) => {
                newTouched[`occupant_${index}_name`] = true;
                newTouched[`occupant_${index}_age`] = true;
                newTouched[`occupant_${index}_relationship`] = true;
                if (occupant.relationship === 'Other') {
                    newTouched[`occupant_${index}_relationship_other`] = true;
                }
            });

            if (wizard.data.has_pets) {
                wizard.data.pets_details.forEach((pet, index) => {
                    newTouched[`pet_${index}_type`] = true;
                    if (pet.type === 'Other') {
                        newTouched[`pet_${index}_type_other`] = true;
                    }
                });
            }
        }

        if (wizard.currentStep === 'references') {
            wizard.data.references.forEach((_, index) => {
                newTouched[`ref_${index}_name`] = true;
                newTouched[`ref_${index}_phone`] = true;
                newTouched[`ref_${index}_email`] = true;
                newTouched[`ref_${index}_relationship`] = true;
                newTouched[`ref_${index}_years_known`] = true;
            });
        }

        setTouchedFields(newTouched);
    }, [wizard.currentStep, wizard.data, touchedFields]);

    // ===== Validation =====
    const validateForSubmit = useCallback((): boolean => {
        const result = validateApplicationForSubmit(wizard.data as unknown as Record<string, unknown>);
        if (!result.success) {
            wizard.setErrors(result.errors);
            return false;
        }
        wizard.setErrors({});
        return true;
    }, [wizard]);

    // ===== Submission =====
    const submit = useCallback(() => {
        if (!validateForSubmit()) {
            // Find first step with errors and navigate to it
            const stepIds: ApplicationStep[] = ['details', 'references', 'emergency', 'documents'];
            for (const stepId of stepIds) {
                const result = validateApplicationStep(stepId as ApplicationStepId, wizard.data as unknown as Record<string, unknown>);
                if (!result.success) {
                    wizard.goToStep(stepId);
                    markAllCurrentStepFieldsTouched();
                    break;
                }
            }
            return;
        }

        setIsSubmitting(true);

        const url = route('applications.store', { property: propertyId }) + (token ? `?token=${token}` : '');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.post(url, wizard.data as any, {
            onProgress: (progress) => {
                if (progress?.percentage) {
                    setUploadProgress(progress.percentage);
                }
            },
            onSuccess: () => {
                setIsSubmitting(false);
                setUploadProgress(null);
            },
            onError: () => {
                setIsSubmitting(false);
                setUploadProgress(null);
            },
        });
    }, [validateForSubmit, wizard, propertyId, token, markAllCurrentStepFieldsTouched]);

    // ===== Custom updateField that handles has_pets toggle =====
    const updateField = useCallback(
        <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => {
            // Handle has_pets toggle
            if (key === 'has_pets') {
                if (value && wizard.data.pets_details.length === 0) {
                    // Add mandatory first pet when checking "I have pets"
                    wizard.updateFields({
                        [key]: value,
                        pets_details: [{ type: '', type_other: '', breed: '', age: '', weight: '' }],
                    } as Partial<ApplicationWizardData>);
                    return;
                } else if (!value) {
                    // Clear pets when unchecking
                    wizard.updateFields({
                        [key]: value,
                        pets_details: [],
                    } as Partial<ApplicationWizardData>);
                    return;
                }
            }

            wizard.updateField(key, value);
        },
        [wizard],
    );

    return {
        // Step state
        currentStep: wizard.currentStep,
        currentStepIndex: wizard.currentStepIndex,
        currentStepConfig: wizard.currentStepConfig,
        isFirstStep: wizard.isFirstStep,
        isLastStep: wizard.isLastStep,
        maxStepReached: wizard.maxStepReached,
        steps: wizard.steps,

        // Navigation
        goToStep: wizard.goToStep,
        goToNextStep: wizard.goToNextStep,
        goToPreviousStep: wizard.goToPreviousStep,
        canGoToStep: wizard.canGoToStep,

        // Data
        data: wizard.data,
        updateField,
        updateFields: wizard.updateFields,

        // Occupants helpers
        addOccupant,
        removeOccupant,
        updateOccupant,

        // Pets helpers
        addPet,
        removePet,
        updatePet,

        // References helpers
        addReference,
        removeReference,
        updateReference,

        // Validation
        errors: wizard.errors,
        setErrors: wizard.setErrors,
        validateCurrentStep: wizard.validateCurrentStep,
        validateForSubmit,
        clearFieldError: wizard.clearFieldError,

        // Touched fields
        touchedFields,
        markFieldTouched,
        markAllCurrentStepFieldsTouched,

        // Autosave
        autosaveStatus: wizard.autosaveStatus,
        lastSavedAt: wizard.lastSavedAt,
        saveNow: wizard.saveNow,
        pendingSave,

        // Submission
        isSubmitting,
        submit,
        uploadProgress,

        // Progress
        progress: wizard.progress,
    };
}
