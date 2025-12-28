import {
    findFirstInvalidApplicationStep,
    validateApplicationForSubmit,
    validateApplicationStep,
    type ApplicationStepId,
    type ExistingDocumentsContext,
} from '@/lib/validation/application-schemas';
import type { TenantProfile } from '@/types';
import { route } from '@/utils/route';
import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { useProfileAutosave } from './useProfileAutosave';
import { useWizard, type AutosaveStatus, type WizardStepConfig } from './useWizard';

export type { AutosaveStatus } from './useWizard';

export type ApplicationStep = 'personal' | 'employment' | 'details' | 'references' | 'emergency' | 'review';

export const APPLICATION_STEPS: WizardStepConfig<ApplicationStep>[] = [
    {
        id: 'personal',
        title: 'Personal Information',
        shortTitle: 'Personal',
        description: 'Your basic information and current address',
    },
    {
        id: 'employment',
        title: 'Employment & Income',
        shortTitle: 'Employment',
        description: 'Your employment status and financial information',
    },
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
        id: 'review',
        title: 'Review & Submit',
        shortTitle: 'Review',
        description: 'Review your application before submitting',
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
    weight_unit: string;
}

export interface ReferenceDetails {
    type: 'landlord' | 'personal' | 'professional';
    name: string;
    phone: string;
    email: string;
    relationship: string;
    relationship_other: string;
    years_known: string;
}

export interface ApplicationWizardData {
    // Step 1: Personal Info (profile data)
    profile_date_of_birth: string;
    profile_nationality: string;
    profile_phone_country_code: string;
    profile_phone_number: string;
    profile_current_house_number: string;
    profile_current_address_line_2: string;
    profile_current_street_name: string;
    profile_current_city: string;
    profile_current_state_province: string;
    profile_current_postal_code: string;
    profile_current_country: string;

    // Step 2: Employment & Income (profile data)
    profile_employment_status: string;
    profile_employer_name: string;
    profile_job_title: string;
    profile_employment_type: string;
    profile_employment_start_date: string;
    profile_monthly_income: string;
    profile_income_currency: string;
    profile_university_name: string;
    profile_program_of_study: string;
    profile_expected_graduation_date: string;
    profile_student_income_source: string;
    profile_has_guarantor: boolean;
    profile_guarantor_name: string;
    profile_guarantor_relationship: string;
    profile_guarantor_phone: string;
    profile_guarantor_email: string;
    profile_guarantor_address: string;
    profile_guarantor_employer: string;
    profile_guarantor_monthly_income: string;
    profile_guarantor_income_currency: string;
    // Profile documents
    profile_id_document_front: File | null;
    profile_id_document_back: File | null;
    profile_employment_contract: File | null;
    profile_payslip_1: File | null;
    profile_payslip_2: File | null;
    profile_payslip_3: File | null;
    profile_student_proof: File | null;
    profile_other_income_proof: File | null;
    profile_guarantor_id: File | null;
    profile_guarantor_proof_income: File | null;

    // Step 3: Application Details
    desired_move_in_date: string;
    lease_duration_months: number;
    message_to_landlord: string;
    additional_occupants: number;
    occupants_details: OccupantDetails[];
    has_pets: boolean;
    pets_details: PetDetails[];

    // Step 4: References (unified - landlord refs merged with type field)
    references: ReferenceDetails[];

    // Step 5: Emergency Contact
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;

    // Token
    invited_via_token: string;

    // Legacy fields (kept for backwards compatibility)
    previous_landlord_name: string;
    previous_landlord_phone: string;
    previous_landlord_email: string;
}

/**
 * Draft application data structure.
 *
 * Note: Profile fields are NOT stored in drafts. They are autosaved directly to TenantProfile
 * and always loaded from tenantProfile prop. Only application-specific fields are stored here.
 */
export interface DraftApplication {
    current_step: number;
    // Application specific fields only
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

function formatDateForInput(date: string | Date | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}

/**
 * Get initial wizard data.
 *
 * Profile fields ALWAYS come from TenantProfile (single source of truth).
 * Application-specific fields come from the draft if resuming.
 * This ensures profile changes are automatically reflected across all draft applications.
 */
function getInitialData(draft?: DraftApplication | null, tenantProfile?: TenantProfile, token?: string | null): ApplicationWizardData {
    return {
        // Step 1: Personal Info - ALWAYS from TenantProfile
        profile_date_of_birth: formatDateForInput(tenantProfile?.date_of_birth),
        profile_nationality: tenantProfile?.nationality || '',
        profile_phone_country_code: tenantProfile?.phone_country_code || '+31',
        profile_phone_number: tenantProfile?.phone_number || '',
        profile_current_house_number: tenantProfile?.current_house_number || '',
        profile_current_address_line_2: tenantProfile?.current_address_line_2 || '',
        profile_current_street_name: tenantProfile?.current_street_name || '',
        profile_current_city: tenantProfile?.current_city || '',
        profile_current_state_province: tenantProfile?.current_state_province || '',
        profile_current_postal_code: tenantProfile?.current_postal_code || '',
        profile_current_country: tenantProfile?.current_country || '',

        // Step 2: Employment & Income - ALWAYS from TenantProfile
        profile_employment_status: tenantProfile?.employment_status || '',
        profile_employer_name: tenantProfile?.employer_name || '',
        profile_job_title: tenantProfile?.job_title || '',
        profile_employment_type: tenantProfile?.employment_type || '',
        profile_employment_start_date: formatDateForInput(tenantProfile?.employment_start_date),
        profile_monthly_income: tenantProfile?.monthly_income?.toString() || '',
        profile_income_currency: tenantProfile?.income_currency || 'eur',
        profile_university_name: tenantProfile?.university_name || '',
        profile_program_of_study: tenantProfile?.program_of_study || '',
        profile_expected_graduation_date: formatDateForInput(tenantProfile?.expected_graduation_date),
        profile_student_income_source: tenantProfile?.student_income_source || '',
        profile_has_guarantor: tenantProfile?.has_guarantor ?? false,
        profile_guarantor_name: tenantProfile?.guarantor_name || '',
        profile_guarantor_relationship: tenantProfile?.guarantor_relationship || '',
        profile_guarantor_phone: tenantProfile?.guarantor_phone || '',
        profile_guarantor_email: tenantProfile?.guarantor_email || '',
        profile_guarantor_address: tenantProfile?.guarantor_address || '',
        profile_guarantor_employer: tenantProfile?.guarantor_employer || '',
        profile_guarantor_monthly_income: tenantProfile?.guarantor_monthly_income?.toString() || '',
        profile_guarantor_income_currency: tenantProfile?.guarantor_income_currency || 'eur',
        // Profile documents (always start null - existing docs shown from tenantProfile)
        profile_id_document_front: null,
        profile_id_document_back: null,
        profile_employment_contract: null,
        profile_payslip_1: null,
        profile_payslip_2: null,
        profile_payslip_3: null,
        profile_student_proof: null,
        profile_other_income_proof: null,
        profile_guarantor_id: null,
        profile_guarantor_proof_income: null,

        // Step 3: Application Details - from draft if resuming
        desired_move_in_date: draft?.desired_move_in_date ? formatDateForInput(draft.desired_move_in_date) : '',
        lease_duration_months: draft?.lease_duration_months || 12,
        message_to_landlord: draft?.message_to_landlord || '',
        additional_occupants: draft?.additional_occupants || 0,
        occupants_details: draft?.occupants_details || [],
        has_pets: draft?.has_pets || false,
        pets_details: draft?.pets_details || [],

        // Step 4: References - from draft if resuming
        references: draft?.references || [],

        // Step 5: Emergency Contact - prefer draft, fall back to profile
        emergency_contact_name: draft?.emergency_contact_name || tenantProfile?.emergency_contact_name || '',
        emergency_contact_phone: draft?.emergency_contact_phone || tenantProfile?.emergency_contact_phone || '',
        emergency_contact_relationship: draft?.emergency_contact_relationship || tenantProfile?.emergency_contact_relationship || '',

        // Token
        invited_via_token: token || '',

        // Legacy fields (kept for backwards compatibility)
        previous_landlord_name: draft?.previous_landlord_name || '',
        previous_landlord_phone: draft?.previous_landlord_phone || '',
        previous_landlord_email: draft?.previous_landlord_email || '',
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
    addReference: (type?: 'landlord' | 'personal' | 'professional') => void;
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

    // Build existing documents context from tenant profile
    const existingDocsContext: ExistingDocumentsContext = {
        id_document_front: !!tenantProfile?.id_document_front_path,
        id_document_back: !!tenantProfile?.id_document_back_path,
        employment_contract: !!tenantProfile?.employment_contract_path,
        payslip_1: !!tenantProfile?.payslip_1_path,
        payslip_2: !!tenantProfile?.payslip_2_path,
        payslip_3: !!tenantProfile?.payslip_3_path,
        student_proof: !!tenantProfile?.student_proof_path,
        other_income_proof: !!tenantProfile?.other_income_proof_path,
        guarantor_id: !!tenantProfile?.guarantor_id_path,
        guarantor_proof_income: !!tenantProfile?.guarantor_proof_income_path,
    };

    // Validation wrapper - passes existing docs context for employment step
    const validateStepWrapper = useCallback(
        (stepId: ApplicationStep, data: ApplicationWizardData) => {
            const result = validateApplicationStep(stepId as ApplicationStepId, data as unknown as Record<string, unknown>, existingDocsContext);
            return {
                success: result.success,
                errors: result.errors,
            };
        },
        [existingDocsContext],
    );

    // Find first invalid step wrapper - passes existing docs context
    const findFirstInvalidStepWrapper = useCallback(
        (data: ApplicationWizardData): number => {
            return findFirstInvalidApplicationStep(data as unknown as Record<string, unknown>, existingDocsContext);
        },
        [existingDocsContext],
    );

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

    // Profile autosave hook - saves profile fields immediately to TenantProfile
    const { autosaveField, isProfileField } = useProfileAutosave();

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
        wizard.updateField('pets_details', [
            ...wizard.data.pets_details,
            { type: '', type_other: '', breed: '', age: '', weight: '', weight_unit: 'kg' },
        ]);
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
    const addReference = useCallback(
        (type: 'landlord' | 'personal' | 'professional' = 'personal') => {
            wizard.updateField('references', [
                ...wizard.data.references,
                { type, name: '', phone: '', email: '', relationship: '', relationship_other: '', years_known: '' },
            ]);
        },
        [wizard],
    );

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

        if (wizard.currentStep === 'personal') {
            newTouched.profile_date_of_birth = true;
            newTouched.profile_nationality = true;
            newTouched.profile_phone_number = true;
            newTouched.profile_current_street_name = true;
            newTouched.profile_current_house_number = true;
            newTouched.profile_current_address_line_2 = true;
            newTouched.profile_current_city = true;
            newTouched.profile_current_state_province = true;
            newTouched.profile_current_postal_code = true;
            newTouched.profile_current_country = true;
            newTouched.profile_id_document_front = true;
            newTouched.profile_id_document_back = true;
        }

        if (wizard.currentStep === 'employment') {
            newTouched.profile_employment_status = true;

            const isEmployed = wizard.data.profile_employment_status === 'employed' || wizard.data.profile_employment_status === 'self_employed';
            const isStudent = wizard.data.profile_employment_status === 'student';
            const isUnemployedOrRetired =
                wizard.data.profile_employment_status === 'unemployed' || wizard.data.profile_employment_status === 'retired';

            if (isEmployed) {
                newTouched.profile_employer_name = true;
                newTouched.profile_job_title = true;
                newTouched.profile_employment_type = true;
                newTouched.profile_employment_start_date = true;
                newTouched.profile_monthly_income = true;
                newTouched.profile_employment_contract = true;
                newTouched.profile_payslip_1 = true;
                newTouched.profile_payslip_2 = true;
                newTouched.profile_payslip_3 = true;
            }

            if (isStudent) {
                newTouched.profile_university_name = true;
                newTouched.profile_program_of_study = true;
                newTouched.profile_student_proof = true;
            }

            if (isUnemployedOrRetired) {
                newTouched.profile_other_income_proof = true;
            }

            if (wizard.data.profile_has_guarantor) {
                newTouched.profile_guarantor_name = true;
                newTouched.profile_guarantor_relationship = true;
                newTouched.profile_guarantor_monthly_income = true;
                newTouched.profile_guarantor_id = true;
                newTouched.profile_guarantor_proof_income = true;
            }
        }

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
        const result = validateApplicationForSubmit(wizard.data as unknown as Record<string, unknown>, existingDocsContext);
        if (!result.success) {
            wizard.setErrors(result.errors);
            return false;
        }
        wizard.setErrors({});
        return true;
    }, [wizard, existingDocsContext]);

    // ===== Submission =====
    const submit = useCallback(() => {
        if (!validateForSubmit()) {
            // Find first step with errors and navigate to it
            const stepIds: ApplicationStep[] = ['personal', 'employment', 'details', 'references', 'emergency'];
            for (const stepId of stepIds) {
                const result = validateApplicationStep(
                    stepId as ApplicationStepId,
                    wizard.data as unknown as Record<string, unknown>,
                    existingDocsContext,
                );
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

    // ===== Custom updateField that handles has_pets toggle and profile autosave =====
    const updateField = useCallback(
        <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => {
            // Handle has_pets toggle
            if (key === 'has_pets') {
                if (value && wizard.data.pets_details.length === 0) {
                    // Add mandatory first pet when checking "I have pets"
                    wizard.updateFields({
                        [key]: value,
                        pets_details: [{ type: '', type_other: '', breed: '', age: '', weight: '', weight_unit: 'kg' }],
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

            // Autosave profile fields immediately to TenantProfile
            if (isProfileField(key)) {
                autosaveField(key, value);
            }
        },
        [wizard, autosaveField, isProfileField],
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
