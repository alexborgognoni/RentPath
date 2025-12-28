import { requiresStateProvince, validatePostalCode } from '@/utils/address-validation';
import { validatePhoneNumber } from '@/utils/phone-validation';
import { z } from 'zod';

// Step IDs - 6 steps (documents step removed)
export type ApplicationStepId = 'personal' | 'employment' | 'details' | 'references' | 'emergency' | 'review';

// ===== Error Messages =====
export const APPLICATION_MESSAGES = {
    // Personal Info Step
    profile_date_of_birth: {
        required: 'Date of birth is required',
        adult: 'You must be at least 18 years old',
    },
    profile_nationality: {
        required: 'Nationality is required',
    },
    profile_phone_number: {
        required: 'Phone number is required',
        invalid: 'Please enter a valid phone number',
    },
    profile_current_street_name: {
        required: 'Street name is required',
    },
    profile_current_house_number: {
        required: 'House number is required',
    },
    profile_current_city: {
        required: 'City is required',
    },
    profile_current_postal_code: {
        required: 'Postal code is required',
        invalid: 'Invalid postal code format for selected country',
    },
    profile_current_country: {
        required: 'Country is required',
    },
    profile_current_state_province: {
        required: 'State/Province is required for this country',
    },

    // Employment Step
    profile_employment_status: {
        required: 'Please select your employment status',
    },
    profile_employer_name: {
        required: 'Employer name is required',
    },
    profile_job_title: {
        required: 'Job title is required',
    },
    profile_monthly_income: {
        required: 'Monthly income is required',
        min: 'Income must be a positive number',
    },
    profile_university_name: {
        required: 'University name is required',
    },
    profile_program_of_study: {
        required: 'Program of study is required',
    },
    profile_id_document: {
        required: 'ID document is required',
    },
    profile_employment_contract: {
        required: 'Employment contract is required',
    },
    profile_payslip: {
        required: 'Payslip is required',
    },
    profile_student_proof: {
        required: 'Proof of student status is required',
    },
    profile_guarantor_name: {
        required: 'Guarantor name is required',
    },
    profile_guarantor_relationship: {
        required: 'Guarantor relationship is required',
    },
    profile_guarantor_monthly_income: {
        required: 'Guarantor income is required',
        min: 'Income must be a positive number',
    },
    profile_guarantor_id: {
        required: 'Guarantor ID document is required',
    },
    profile_guarantor_proof_income: {
        required: 'Guarantor proof of income is required',
    },

    // Existing messages
    desired_move_in_date: {
        required: 'Move-in date is required',
        future: 'Move-in date must be in the future',
    },
    lease_duration_months: {
        required: 'Lease duration is required',
        min: 'Lease duration must be at least 1 month',
        max: 'Lease duration cannot exceed 60 months',
    },
    message_to_landlord: {
        maxLength: 'Message cannot exceed 2000 characters',
    },
    additional_occupants: {
        max: 'Cannot have more than 20 additional occupants',
    },
    occupant: {
        name: {
            required: 'Name is required',
            maxLength: 'Name cannot exceed 255 characters',
        },
        age: {
            required: 'Age is required',
            invalid: 'Valid age is required (0-120)',
        },
        relationship: {
            required: 'Relationship is required',
            maxLength: 'Relationship cannot exceed 100 characters',
        },
        relationship_other: {
            required: 'Please specify the relationship',
            maxLength: 'Relationship cannot exceed 100 characters',
        },
    },
    pet: {
        type: {
            required: 'Pet type is required',
            maxLength: 'Pet type cannot exceed 100 characters',
        },
        type_other: {
            required: 'Please specify the pet type',
            maxLength: 'Pet type cannot exceed 100 characters',
        },
        breed: {
            maxLength: 'Breed cannot exceed 100 characters',
        },
        age: {
            max: 'Pet age cannot exceed 50 years',
        },
        required: 'At least one pet is required when "I have pets" is checked',
    },
    reference: {
        name: {
            required: 'Name is required',
        },
        phone: {
            required: 'Phone is required',
        },
        email: {
            required: 'Email is required',
            invalid: 'Valid email is required',
        },
        relationship: {
            required: 'Relationship is required',
        },
        relationship_other: {
            required: 'Please specify the relationship',
        },
        years_known: {
            required: 'Years known is required',
            invalid: 'Valid years known is required (0-100)',
        },
    },
};

// ===== Shared Sub-Schemas =====
const occupantSchema = z.object({
    name: z.string().min(1, APPLICATION_MESSAGES.occupant.name.required).max(255, APPLICATION_MESSAGES.occupant.name.maxLength),
    age: z
        .string()
        .min(1, APPLICATION_MESSAGES.occupant.age.required)
        .refine(
            (val) => {
                const num = parseInt(val);
                return !isNaN(num) && num >= 0 && num <= 120;
            },
            { message: APPLICATION_MESSAGES.occupant.age.invalid },
        ),
    relationship: z
        .string()
        .min(1, APPLICATION_MESSAGES.occupant.relationship.required)
        .max(100, APPLICATION_MESSAGES.occupant.relationship.maxLength),
    relationship_other: z.string().max(100, APPLICATION_MESSAGES.occupant.relationship_other.maxLength),
});

const occupantWithOtherSchema = occupantSchema.refine(
    (data) => {
        if (data.relationship === 'Other') {
            return data.relationship_other.trim().length > 0;
        }
        return true;
    },
    {
        message: APPLICATION_MESSAGES.occupant.relationship_other.required,
        path: ['relationship_other'],
    },
);

const petSchema = z.object({
    type: z.string().min(1, APPLICATION_MESSAGES.pet.type.required).max(100, APPLICATION_MESSAGES.pet.type.maxLength),
    type_other: z.string().max(100, APPLICATION_MESSAGES.pet.type_other.maxLength),
    breed: z.string().max(100, APPLICATION_MESSAGES.pet.breed.maxLength),
    age: z.string().refine(
        (val) => {
            if (!val) return true; // Optional
            const num = parseInt(val);
            return !isNaN(num) && num >= 0 && num <= 50;
        },
        { message: APPLICATION_MESSAGES.pet.age.max },
    ),
    weight: z.string(),
});

const petWithOtherSchema = petSchema.refine(
    (data) => {
        if (data.type === 'Other') {
            return data.type_other.trim().length > 0;
        }
        return true;
    },
    {
        message: APPLICATION_MESSAGES.pet.type_other.required,
        path: ['type_other'],
    },
);

const referenceSchema = z.object({
    type: z.enum(['landlord', 'personal', 'professional']),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    relationship: z.string(),
    relationship_other: z.string(),
    years_known: z.string(),
});

// ===== Step Schemas =====

// Step 1: Personal Info
export const personalInfoStepSchema = z
    .object({
        profile_date_of_birth: z.string().min(1, APPLICATION_MESSAGES.profile_date_of_birth.required),
        profile_nationality: z.string().min(1, APPLICATION_MESSAGES.profile_nationality.required),
        profile_phone_country_code: z.string(),
        profile_phone_number: z.string().min(1, APPLICATION_MESSAGES.profile_phone_number.required),
        profile_current_street_name: z.string().min(1, APPLICATION_MESSAGES.profile_current_street_name.required),
        profile_current_house_number: z.string().min(1, APPLICATION_MESSAGES.profile_current_house_number.required),
        profile_current_address_line_2: z.string().optional(),
        profile_current_city: z.string().min(1, APPLICATION_MESSAGES.profile_current_city.required),
        profile_current_state_province: z.string().optional(),
        profile_current_postal_code: z.string().min(1, APPLICATION_MESSAGES.profile_current_postal_code.required),
        profile_current_country: z.string().min(1, APPLICATION_MESSAGES.profile_current_country.required),
    })
    .refine(
        (data) => {
            // Validate user is at least 18 years old
            if (data.profile_date_of_birth) {
                const birthDate = new Date(data.profile_date_of_birth);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                return actualAge >= 18;
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.profile_date_of_birth.adult,
            path: ['profile_date_of_birth'],
        },
    )
    .refine(
        (data) => {
            // Validate phone number format for selected country
            if (data.profile_phone_number && data.profile_phone_country_code) {
                return validatePhoneNumber(data.profile_phone_number, data.profile_phone_country_code);
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.profile_phone_number.invalid,
            path: ['profile_phone_number'],
        },
    )
    .refine(
        (data) => {
            // Validate postal code format for selected country
            if (data.profile_current_postal_code && data.profile_current_country) {
                return validatePostalCode(data.profile_current_postal_code, data.profile_current_country);
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.profile_current_postal_code.invalid,
            path: ['profile_current_postal_code'],
        },
    )
    .refine(
        (data) => {
            // Validate state/province is provided for countries that require it
            if (data.profile_current_country && requiresStateProvince(data.profile_current_country)) {
                return !!data.profile_current_state_province?.trim();
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.profile_current_state_province.required,
            path: ['profile_current_state_province'],
        },
    );

// Step 2: Employment & Income (with conditional validation)
export const employmentIncomeStepSchema = z.object({
    profile_employment_status: z.string().min(1, APPLICATION_MESSAGES.profile_employment_status.required),
    profile_employer_name: z.string(),
    profile_job_title: z.string(),
    profile_employment_type: z.string(),
    profile_employment_start_date: z.string(),
    profile_monthly_income: z.string(),
    profile_income_currency: z.string(),
    profile_university_name: z.string(),
    profile_program_of_study: z.string(),
    profile_expected_graduation_date: z.string(),
    profile_student_income_source: z.string(),
    profile_has_guarantor: z.boolean(),
    profile_guarantor_name: z.string(),
    profile_guarantor_relationship: z.string(),
    profile_guarantor_phone: z.string(),
    profile_guarantor_email: z.string(),
    profile_guarantor_address: z.string(),
    profile_guarantor_employer: z.string(),
    profile_guarantor_monthly_income: z.string(),
    // Documents are validated separately as Files
    profile_id_document: z.any().nullable(),
    profile_employment_contract: z.any().nullable(),
    profile_payslip_1: z.any().nullable(),
    profile_payslip_2: z.any().nullable(),
    profile_payslip_3: z.any().nullable(),
    profile_student_proof: z.any().nullable(),
    profile_guarantor_id: z.any().nullable(),
    profile_guarantor_proof_income: z.any().nullable(),
});

// Step 3: Details (move-in, lease, occupants, pets)
export const detailsStepSchema = z
    .object({
        desired_move_in_date: z.string().min(1, APPLICATION_MESSAGES.desired_move_in_date.required),
        lease_duration_months: z
            .number()
            .min(1, APPLICATION_MESSAGES.lease_duration_months.min)
            .max(60, APPLICATION_MESSAGES.lease_duration_months.max),
        message_to_landlord: z.string().max(2000, APPLICATION_MESSAGES.message_to_landlord.maxLength),
        additional_occupants: z.number().min(0).max(20, APPLICATION_MESSAGES.additional_occupants.max),
        occupants_details: z.array(occupantSchema),
        has_pets: z.boolean(),
        pets_details: z.array(petSchema),
    })
    .refine(
        (data) => {
            // Validate move-in date is in the future
            if (data.desired_move_in_date) {
                const selectedDate = new Date(data.desired_move_in_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate > today;
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.desired_move_in_date.future,
            path: ['desired_move_in_date'],
        },
    )
    .refine(
        (data) => {
            // If has_pets is true, must have at least one pet
            if (data.has_pets && data.pets_details.length === 0) {
                return false;
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.pet.required,
            path: ['pets_details'],
        },
    );

// Step 4: References (unified - landlord merged with type field)
export const referencesStepSchema = z.object({
    references: z.array(referenceSchema),
    // Legacy fields kept for backwards compatibility
    previous_landlord_name: z.string().optional(),
    previous_landlord_phone: z.string().optional(),
    previous_landlord_email: z.string().optional(),
});

// Step 5: Emergency Contact
export const emergencyStepSchema = z.object({
    emergency_contact_name: z.string(),
    emergency_contact_phone: z.string(),
    emergency_contact_relationship: z.string(),
});

// ===== Validation Functions =====

export interface ValidationResult {
    success: boolean;
    errors: Record<string, string>;
}

/**
 * Validate a specific step
 */
export function validateApplicationStep(stepId: ApplicationStepId, data: Record<string, unknown>): ValidationResult {
    let schema: z.ZodSchema;

    switch (stepId) {
        case 'personal':
            schema = personalInfoStepSchema;
            break;
        case 'employment':
            schema = employmentIncomeStepSchema;
            break;
        case 'details':
            schema = detailsStepSchema;
            break;
        case 'references':
            schema = referencesStepSchema;
            break;
        case 'emergency':
            schema = emergencyStepSchema;
            break;
        case 'review':
            // Review step has no validation - just display
            return { success: true, errors: {} };
        default:
            return { success: true, errors: {} };
    }

    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, errors: {} };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
        const path = issue.path.map(String).join('.');
        // Only set the first error for each path
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });

    // Additional validation for employment step (conditional based on status)
    if (stepId === 'employment') {
        const employmentStatus = data.profile_employment_status as string;
        const isEmployed = employmentStatus === 'employed' || employmentStatus === 'self_employed';
        const isStudent = employmentStatus === 'student';
        const hasGuarantor = data.profile_has_guarantor as boolean;

        // ID document is always required
        if (!data.profile_id_document) {
            errors.profile_id_document = APPLICATION_MESSAGES.profile_id_document.required;
        }

        // Employed-specific validations
        if (isEmployed) {
            if (!data.profile_employer_name) {
                errors.profile_employer_name = APPLICATION_MESSAGES.profile_employer_name.required;
            }
            if (!data.profile_job_title) {
                errors.profile_job_title = APPLICATION_MESSAGES.profile_job_title.required;
            }
            if (!data.profile_monthly_income) {
                errors.profile_monthly_income = APPLICATION_MESSAGES.profile_monthly_income.required;
            }
            if (!data.profile_employment_contract) {
                errors.profile_employment_contract = APPLICATION_MESSAGES.profile_employment_contract.required;
            }
            if (!data.profile_payslip_1) {
                errors.profile_payslip_1 = APPLICATION_MESSAGES.profile_payslip.required;
            }
            if (!data.profile_payslip_2) {
                errors.profile_payslip_2 = APPLICATION_MESSAGES.profile_payslip.required;
            }
            if (!data.profile_payslip_3) {
                errors.profile_payslip_3 = APPLICATION_MESSAGES.profile_payslip.required;
            }
        }

        // Student-specific validations
        if (isStudent) {
            if (!data.profile_university_name) {
                errors.profile_university_name = APPLICATION_MESSAGES.profile_university_name.required;
            }
            if (!data.profile_program_of_study) {
                errors.profile_program_of_study = APPLICATION_MESSAGES.profile_program_of_study.required;
            }
            if (!data.profile_student_proof) {
                errors.profile_student_proof = APPLICATION_MESSAGES.profile_student_proof.required;
            }
        }

        // Guarantor validations
        if (hasGuarantor) {
            if (!data.profile_guarantor_name) {
                errors.profile_guarantor_name = APPLICATION_MESSAGES.profile_guarantor_name.required;
            }
            if (!data.profile_guarantor_relationship) {
                errors.profile_guarantor_relationship = APPLICATION_MESSAGES.profile_guarantor_relationship.required;
            }
            if (!data.profile_guarantor_monthly_income) {
                errors.profile_guarantor_monthly_income = APPLICATION_MESSAGES.profile_guarantor_monthly_income.required;
            }
            if (!data.profile_guarantor_id) {
                errors.profile_guarantor_id = APPLICATION_MESSAGES.profile_guarantor_id.required;
            }
            if (!data.profile_guarantor_proof_income) {
                errors.profile_guarantor_proof_income = APPLICATION_MESSAGES.profile_guarantor_proof_income.required;
            }
        }
    }

    // Additional validation for occupants with "Other" relationship
    if (stepId === 'details') {
        const occupants = data.occupants_details as Array<{ name: string; age: string; relationship: string; relationship_other: string }>;
        occupants?.forEach((occupant, index) => {
            const validationResult = occupantWithOtherSchema.safeParse(occupant);
            if (!validationResult.success) {
                validationResult.error.issues.forEach((issue) => {
                    const fieldKey = `occupant_${index}_${String(issue.path[0])}`;
                    if (!errors[fieldKey]) {
                        errors[fieldKey] = issue.message;
                    }
                });
            }
        });

        // Validate pets with "Other" type
        const hasPets = data.has_pets as boolean;
        const pets = data.pets_details as Array<{ type: string; type_other: string; breed: string; age: string; weight: string }>;
        if (hasPets) {
            pets?.forEach((pet, index) => {
                const validationResult = petWithOtherSchema.safeParse(pet);
                if (!validationResult.success) {
                    validationResult.error.issues.forEach((issue) => {
                        const fieldKey = `pet_${index}_${String(issue.path[0])}`;
                        if (!errors[fieldKey]) {
                            errors[fieldKey] = issue.message;
                        }
                    });
                }
            });
        }
    }

    // Additional validation for references
    if (stepId === 'references') {
        const references = data.references as Array<{
            type: string;
            name: string;
            phone: string;
            email: string;
            relationship: string;
            relationship_other: string;
            years_known: string;
        }>;
        references?.forEach((ref, index) => {
            const hasAnyData = ref.name || ref.phone || ref.email || ref.relationship || ref.years_known;
            if (hasAnyData) {
                // Validate all required fields
                if (!ref.name?.trim()) {
                    errors[`ref_${index}_name`] = APPLICATION_MESSAGES.reference.name.required;
                }
                if (!ref.phone?.trim()) {
                    errors[`ref_${index}_phone`] = APPLICATION_MESSAGES.reference.phone.required;
                }
                if (!ref.email?.trim()) {
                    errors[`ref_${index}_email`] = APPLICATION_MESSAGES.reference.email.required;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
                    errors[`ref_${index}_email`] = APPLICATION_MESSAGES.reference.email.invalid;
                }
                if (!ref.relationship) {
                    errors[`ref_${index}_relationship`] = APPLICATION_MESSAGES.reference.relationship.required;
                }
                if (ref.relationship === 'Other' && !ref.relationship_other?.trim()) {
                    errors[`ref_${index}_relationship_other`] = APPLICATION_MESSAGES.reference.relationship_other.required;
                }
                if (!ref.years_known) {
                    errors[`ref_${index}_years_known`] = APPLICATION_MESSAGES.reference.years_known.required;
                } else {
                    const yearsKnown = parseInt(ref.years_known);
                    if (isNaN(yearsKnown) || yearsKnown < 0 || yearsKnown > 100) {
                        errors[`ref_${index}_years_known`] = APPLICATION_MESSAGES.reference.years_known.invalid;
                    }
                }
            }
        });
    }

    return { success: Object.keys(errors).length === 0, errors };
}

/**
 * Find the first invalid step (returns the index)
 * Returns steps.length if all steps are valid
 */
export function findFirstInvalidApplicationStep(data: Record<string, unknown>): number {
    // 6-step order: personal, employment, details, references, emergency, review
    const stepIds: ApplicationStepId[] = ['personal', 'employment', 'details', 'references', 'emergency', 'review'];

    for (let i = 0; i < stepIds.length; i++) {
        const result = validateApplicationStep(stepIds[i], data);
        if (!result.success) {
            return i;
        }
    }

    return stepIds.length; // All steps valid
}

/**
 * Validate all data for submission
 */
export function validateApplicationForSubmit(data: Record<string, unknown>): ValidationResult {
    const allErrors: Record<string, string> = {};
    // Validate all steps except review (which has no validation)
    const stepIds: ApplicationStepId[] = ['personal', 'employment', 'details', 'references', 'emergency'];

    for (const stepId of stepIds) {
        const result = validateApplicationStep(stepId, data);
        Object.assign(allErrors, result.errors);
    }

    return {
        success: Object.keys(allErrors).length === 0,
        errors: allErrors,
    };
}
