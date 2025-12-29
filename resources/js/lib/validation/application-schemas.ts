import { requiresStateProvince, validatePostalCode } from '@/utils/address-validation';
import { validatePhoneNumber } from '@/utils/phone-validation';
import { z } from 'zod';

// Step IDs - 8 steps (restructured)
export type ApplicationStepId =
    | 'identity' // Step 1: Identity & Legal Eligibility
    | 'household' // Step 2: Household Composition
    | 'financial' // Step 3: Financial Capability (Tenant)
    | 'risk' // Step 4: Risk Mitigation (Co-signers & Guarantors)
    | 'history' // Step 5: Credit & Rental History
    | 'additional' // Step 6: Additional Information & Documents
    | 'consent' // Step 7: Declarations & Consent
    | 'review'; // Step 8: Review

// ===== Error Messages =====
export const APPLICATION_MESSAGES = {
    // Step 1: Identity & Legal Eligibility
    profile_date_of_birth: {
        required: 'Date of birth is required',
        adult: 'You must be at least 18 years old',
    },
    profile_middle_name: {
        maxLength: 'Middle name cannot exceed 100 characters',
    },
    profile_nationality: {
        required: 'Nationality is required',
    },
    profile_phone_number: {
        required: 'Phone number is required',
        invalid: 'Please enter a valid phone number',
    },
    profile_id_document_type: {
        required: 'Please select an ID document type',
    },
    profile_id_number: {
        required: 'ID number is required',
    },
    profile_id_issuing_country: {
        required: 'Issuing country is required',
    },
    profile_id_expiry_date: {
        required: 'ID expiry date is required',
        future: 'ID document must not be expired',
    },
    profile_immigration_status: {
        required: 'Immigration status is required',
    },
    profile_immigration_status_other: {
        required: 'Please specify your immigration status',
    },
    profile_visa_type: {
        required: 'Visa type is required',
    },
    profile_visa_expiry_date: {
        required: 'Visa expiry date is required',
        future: 'Visa must not be expired',
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
    profile_employment_type: {
        required: 'Employment type is required',
    },
    profile_employment_start_date: {
        required: 'Employment start date is required',
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
    profile_id_document_front: {
        required: 'Front side of ID document is required',
    },
    profile_id_document_back: {
        required: 'Back side of ID document is required',
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
    // Guarantor - Basic Info
    profile_guarantor_first_name: {
        required: 'Guarantor first name is required',
    },
    profile_guarantor_last_name: {
        required: 'Guarantor last name is required',
    },
    profile_guarantor_relationship: {
        required: 'Guarantor relationship is required',
    },
    profile_guarantor_relationship_other: {
        required: 'Please specify the relationship',
    },
    profile_guarantor_phone_number: {
        required: 'Guarantor phone number is required',
        invalid: 'Please enter a valid phone number',
    },
    profile_guarantor_email: {
        required: 'Guarantor email is required',
        invalid: 'Please enter a valid email address',
    },
    profile_guarantor_street_name: {
        required: 'Street name is required',
    },
    profile_guarantor_house_number: {
        required: 'House number is required',
    },
    profile_guarantor_city: {
        required: 'City is required',
    },
    profile_guarantor_postal_code: {
        required: 'Postal code is required',
        invalid: 'Invalid postal code format for selected country',
    },
    profile_guarantor_country: {
        required: 'Country is required',
    },
    profile_guarantor_state_province: {
        required: 'State/Province is required for this country',
    },
    // Guarantor - Employment
    profile_guarantor_employment_status: {
        required: 'Guarantor employment status is required',
    },
    profile_guarantor_employer_name: {
        required: 'Guarantor employer is required',
    },
    profile_guarantor_job_title: {
        required: 'Guarantor job title is required',
    },
    profile_guarantor_employment_type: {
        required: 'Employment type is required',
    },
    profile_guarantor_employment_start_date: {
        required: 'Employment start date is required',
    },
    profile_guarantor_monthly_income: {
        required: 'Guarantor income is required',
        min: 'Income must be a positive number',
    },
    // Guarantor - Student
    profile_guarantor_university_name: {
        required: 'University name is required',
    },
    profile_guarantor_program_of_study: {
        required: 'Program of study is required',
    },
    // Guarantor - Documents
    profile_guarantor_id_front: {
        required: 'Guarantor ID document (front) is required',
    },
    profile_guarantor_id_back: {
        required: 'Guarantor ID document (back) is required',
    },
    profile_guarantor_employment_contract: {
        required: 'Guarantor employment contract is required',
    },
    profile_guarantor_payslip: {
        required: 'Guarantor payslip is required',
    },
    profile_guarantor_student_proof: {
        required: 'Guarantor student proof is required',
    },
    profile_guarantor_other_income_proof: {
        required: 'Guarantor proof of income is required',
    },
    profile_other_income_proof: {
        required: 'Proof of income source is required',
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
        first_name: {
            required: 'First name is required',
            maxLength: 'First name cannot exceed 100 characters',
        },
        last_name: {
            required: 'Last name is required',
            maxLength: 'Last name cannot exceed 100 characters',
        },
        date_of_birth: {
            required: 'Date of birth is required',
            invalid: 'Please enter a valid date of birth',
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
        consent_to_contact: {
            required: 'You must consent to contact this reference',
        },
    },

    // Step 5: Credit & Rental History
    authorize_credit_check: {
        required: 'You must authorize a credit check',
    },
    current_living_situation: {
        required: 'Please select your current living situation',
    },
    reason_for_moving: {
        required: 'Please select your reason for moving',
    },
    reason_for_moving_other: {
        required: 'Please specify your reason for moving',
    },
    ccj_bankruptcy_details: {
        required: 'Please provide details about CCJs or bankruptcies',
    },
    eviction_details: {
        required: 'Please provide details about eviction history',
    },

    // Step 7: Declarations & Consent
    declaration_accuracy: {
        required: 'You must confirm the accuracy of your information',
    },
    consent_screening: {
        required: 'You must consent to screening checks',
    },
    consent_data_processing: {
        required: 'You must consent to data processing',
    },
    consent_reference_contact: {
        required: 'You must consent to reference contact',
    },
    digital_signature: {
        required: 'Please provide your digital signature',
    },

    // Co-signers (Step 4)
    co_signer: {
        first_name: { required: 'First name is required' },
        last_name: { required: 'Last name is required' },
        email: { required: 'Email is required', invalid: 'Valid email is required' },
        phone_number: { required: 'Phone number is required', invalid: 'Valid phone number is required' },
        date_of_birth: { required: 'Date of birth is required', adult: 'Co-signer must be at least 18' },
        nationality: { required: 'Nationality is required' },
        id_document_type: { required: 'ID document type is required' },
        id_number: { required: 'ID number is required' },
        id_issuing_country: { required: 'ID issuing country is required' },
        id_expiry_date: { required: 'ID expiry date is required', future: 'ID must not be expired' },
        employment_status: { required: 'Employment status is required' },
        net_monthly_income: { required: 'Monthly income is required' },
    },

    // Guarantors (Step 4)
    guarantor: {
        first_name: { required: 'Guarantor first name is required' },
        last_name: { required: 'Guarantor last name is required' },
        relationship: { required: 'Relationship is required' },
        relationship_other: { required: 'Please specify the relationship' },
        email: { required: 'Email is required', invalid: 'Valid email is required' },
        phone_number: { required: 'Phone number is required' },
        date_of_birth: { required: 'Date of birth is required', adult: 'Guarantor must be at least 18' },
        nationality: { required: 'Nationality is required' },
        id_document_type: { required: 'ID document type is required' },
        street_address: { required: 'Street address is required' },
        city: { required: 'City is required' },
        postal_code: { required: 'Postal code is required' },
        country: { required: 'Country is required' },
        employment_status: { required: 'Employment status is required' },
        net_monthly_income: { required: 'Monthly income is required' },
        consent_to_credit_check: { required: 'Guarantor must consent to credit check' },
        consent_to_contact: { required: 'Guarantor must consent to be contacted' },
        guarantee_consent_signed: { required: 'Guarantor must sign the guarantee consent' },
    },
};

// ===== Existing Documents Context =====
// Used to check if documents already exist in tenant profile
export interface ExistingDocumentsContext {
    // Main tenant documents
    id_document_front?: boolean;
    id_document_back?: boolean;
    employment_contract?: boolean;
    payslip_1?: boolean;
    payslip_2?: boolean;
    payslip_3?: boolean;
    student_proof?: boolean;
    other_income_proof?: boolean;
    // Guarantor documents
    guarantor_id_front?: boolean;
    guarantor_id_back?: boolean;
    guarantor_proof_income?: boolean;
    guarantor_employment_contract?: boolean;
    guarantor_payslip_1?: boolean;
    guarantor_payslip_2?: boolean;
    guarantor_payslip_3?: boolean;
    guarantor_student_proof?: boolean;
    guarantor_other_income_proof?: boolean;
}

// ===== Shared Sub-Schemas =====
// Helper to coerce null/undefined to empty string for form fields
const stringField = () => z.preprocess((val) => val ?? '', z.string());

const occupantSchema = z.object({
    first_name: stringField().pipe(
        z.string().min(1, APPLICATION_MESSAGES.occupant.first_name.required).max(100, APPLICATION_MESSAGES.occupant.first_name.maxLength),
    ),
    last_name: stringField().pipe(
        z.string().min(1, APPLICATION_MESSAGES.occupant.last_name.required).max(100, APPLICATION_MESSAGES.occupant.last_name.maxLength),
    ),
    date_of_birth: stringField().pipe(
        z
            .string()
            .min(1, APPLICATION_MESSAGES.occupant.date_of_birth.required)
            .refine(
                (val) => {
                    if (!val) return false;
                    const date = new Date(val);
                    return !isNaN(date.getTime()) && date < new Date();
                },
                { message: APPLICATION_MESSAGES.occupant.date_of_birth.invalid },
            ),
    ),
    relationship: stringField().pipe(
        z.string().min(1, APPLICATION_MESSAGES.occupant.relationship.required).max(100, APPLICATION_MESSAGES.occupant.relationship.maxLength),
    ),
    relationship_other: stringField().pipe(z.string().max(100, APPLICATION_MESSAGES.occupant.relationship_other.maxLength)),
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

// Step 1: Personal Info - Base schema
const personalInfoBaseSchema = z.object({
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
    profile_id_document_front: z.any().nullable(),
    profile_id_document_back: z.any().nullable(),
});

// Factory function that creates personal info schema with existing docs context
export function createPersonalInfoStepSchema(existingDocs: ExistingDocumentsContext = {}) {
    return personalInfoBaseSchema.superRefine((data, ctx) => {
        // Validate user is at least 18 years old
        if (data.profile_date_of_birth) {
            const birthDate = new Date(data.profile_date_of_birth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
            if (actualAge < 18) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_date_of_birth.adult,
                    path: ['profile_date_of_birth'],
                });
            }
        }

        // Validate phone number format for selected country
        if (data.profile_phone_number && data.profile_phone_country_code) {
            if (!validatePhoneNumber(data.profile_phone_number, data.profile_phone_country_code)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_phone_number.invalid,
                    path: ['profile_phone_number'],
                });
            }
        }

        // Validate postal code format for selected country
        if (data.profile_current_postal_code && data.profile_current_country) {
            if (!validatePostalCode(data.profile_current_postal_code, data.profile_current_country)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_current_postal_code.invalid,
                    path: ['profile_current_postal_code'],
                });
            }
        }

        // Validate state/province is provided for countries that require it
        if (data.profile_current_country && requiresStateProvince(data.profile_current_country)) {
            if (!data.profile_current_state_province?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_current_state_province.required,
                    path: ['profile_current_state_province'],
                });
            }
        }

        // ID document front always required (unless existing)
        if (!data.profile_id_document_front && !existingDocs.id_document_front) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.profile_id_document_front.required,
                path: ['profile_id_document_front'],
            });
        }

        // ID document back always required (unless existing)
        if (!data.profile_id_document_back && !existingDocs.id_document_back) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.profile_id_document_back.required,
                path: ['profile_id_document_back'],
            });
        }
    });
}

// Default export for backwards compatibility (no existing docs context)
export const personalInfoStepSchema = createPersonalInfoStepSchema();

// Step 2: Employment & Income - Base schema with all fields
const employmentBaseSchema = z.object({
    profile_employment_status: z.string(),
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
    // Guarantor - Basic Info
    profile_guarantor_first_name: z.string(),
    profile_guarantor_last_name: z.string(),
    profile_guarantor_relationship: z.string(),
    profile_guarantor_relationship_other: z.string(),
    profile_guarantor_phone_country_code: z.string(),
    profile_guarantor_phone_number: z.string(),
    profile_guarantor_email: z.string(),
    profile_guarantor_street_name: z.string(),
    profile_guarantor_house_number: z.string(),
    profile_guarantor_address_line_2: z.string(),
    profile_guarantor_city: z.string(),
    profile_guarantor_state_province: z.string(),
    profile_guarantor_postal_code: z.string(),
    profile_guarantor_country: z.string(),
    // Guarantor - Employment
    profile_guarantor_employment_status: z.string(),
    profile_guarantor_employer_name: z.string(),
    profile_guarantor_job_title: z.string(),
    profile_guarantor_employment_type: z.string(),
    profile_guarantor_employment_start_date: z.string(),
    profile_guarantor_monthly_income: z.string(),
    profile_guarantor_income_currency: z.string(),
    // Guarantor - Student Info
    profile_guarantor_university_name: z.string(),
    profile_guarantor_program_of_study: z.string(),
    profile_guarantor_expected_graduation_date: z.string(),
    profile_guarantor_student_income_source: z.string(),
    // Documents are validated as Files
    profile_id_document_front: z.any().nullable(),
    profile_id_document_back: z.any().nullable(),
    profile_employment_contract: z.any().nullable(),
    profile_payslip_1: z.any().nullable(),
    profile_payslip_2: z.any().nullable(),
    profile_payslip_3: z.any().nullable(),
    profile_student_proof: z.any().nullable(),
    profile_other_income_proof: z.any().nullable(),
    // Guarantor Documents
    profile_guarantor_id_front: z.any().nullable(),
    profile_guarantor_id_back: z.any().nullable(),
    profile_guarantor_proof_income: z.any().nullable(),
    profile_guarantor_employment_contract: z.any().nullable(),
    profile_guarantor_payslip_1: z.any().nullable(),
    profile_guarantor_payslip_2: z.any().nullable(),
    profile_guarantor_payslip_3: z.any().nullable(),
    profile_guarantor_student_proof: z.any().nullable(),
    profile_guarantor_other_income_proof: z.any().nullable(),
});

// Factory function that creates employment schema with existing docs context
export function createEmploymentStepSchema(existingDocs: ExistingDocumentsContext = {}) {
    return employmentBaseSchema.superRefine((data, ctx) => {
        const status = data.profile_employment_status;
        const isEmployed = status === 'employed' || status === 'self_employed';
        const isStudent = status === 'student';
        const isUnemployedOrRetired = status === 'unemployed' || status === 'retired';
        const hasGuarantor = data.profile_has_guarantor;

        // Employment status is always required
        if (!status) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.profile_employment_status.required,
                path: ['profile_employment_status'],
            });
        }

        // Employed/Self-employed validations
        if (isEmployed) {
            if (!data.profile_employer_name?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_employer_name.required,
                    path: ['profile_employer_name'],
                });
            }
            if (!data.profile_job_title?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_job_title.required,
                    path: ['profile_job_title'],
                });
            }
            if (!data.profile_employment_type?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_employment_type.required,
                    path: ['profile_employment_type'],
                });
            }
            if (!data.profile_employment_start_date?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_employment_start_date.required,
                    path: ['profile_employment_start_date'],
                });
            }
            if (!data.profile_monthly_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_monthly_income.required,
                    path: ['profile_monthly_income'],
                });
            }
            if (!data.profile_employment_contract && !existingDocs.employment_contract) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_employment_contract.required,
                    path: ['profile_employment_contract'],
                });
            }
            if (!data.profile_payslip_1 && !existingDocs.payslip_1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_payslip.required,
                    path: ['profile_payslip_1'],
                });
            }
            if (!data.profile_payslip_2 && !existingDocs.payslip_2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_payslip.required,
                    path: ['profile_payslip_2'],
                });
            }
            if (!data.profile_payslip_3 && !existingDocs.payslip_3) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_payslip.required,
                    path: ['profile_payslip_3'],
                });
            }
        }

        // Student validations
        if (isStudent) {
            if (!data.profile_university_name?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_university_name.required,
                    path: ['profile_university_name'],
                });
            }
            if (!data.profile_program_of_study?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_program_of_study.required,
                    path: ['profile_program_of_study'],
                });
            }
            if (!data.profile_student_proof && !existingDocs.student_proof) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_student_proof.required,
                    path: ['profile_student_proof'],
                });
            }
        }

        // Unemployed/Retired validations
        if (isUnemployedOrRetired) {
            if (!data.profile_other_income_proof && !existingDocs.other_income_proof) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_other_income_proof.required,
                    path: ['profile_other_income_proof'],
                });
            }
        }

        // Guarantor validations - all fields mandatory when guarantor is enabled
        if (hasGuarantor) {
            const guarantorStatus = data.profile_guarantor_employment_status;
            const isGuarantorEmployed = guarantorStatus === 'employed' || guarantorStatus === 'self_employed';
            const isGuarantorStudent = guarantorStatus === 'student';
            const isGuarantorUnemployedOrRetired = guarantorStatus === 'unemployed' || guarantorStatus === 'retired';

            // First name
            if (!data.profile_guarantor_first_name?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_first_name.required,
                    path: ['profile_guarantor_first_name'],
                });
            }
            // Last name
            if (!data.profile_guarantor_last_name?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_last_name.required,
                    path: ['profile_guarantor_last_name'],
                });
            }
            // Relationship
            if (!data.profile_guarantor_relationship?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_relationship.required,
                    path: ['profile_guarantor_relationship'],
                });
            }
            // Relationship "Other" - require specification
            if (data.profile_guarantor_relationship === 'Other' && !data.profile_guarantor_relationship_other?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_relationship_other.required,
                    path: ['profile_guarantor_relationship_other'],
                });
            }
            // Phone
            if (!data.profile_guarantor_phone_number?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_phone_number.required,
                    path: ['profile_guarantor_phone_number'],
                });
            } else if (data.profile_guarantor_phone_country_code) {
                if (!validatePhoneNumber(data.profile_guarantor_phone_number, data.profile_guarantor_phone_country_code)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_phone_number.invalid,
                        path: ['profile_guarantor_phone_number'],
                    });
                }
            }
            // Email
            if (!data.profile_guarantor_email?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_email.required,
                    path: ['profile_guarantor_email'],
                });
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile_guarantor_email)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_email.invalid,
                    path: ['profile_guarantor_email'],
                });
            }
            // Address - Street name
            if (!data.profile_guarantor_street_name?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_street_name.required,
                    path: ['profile_guarantor_street_name'],
                });
            }
            // Address - House number
            if (!data.profile_guarantor_house_number?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_house_number.required,
                    path: ['profile_guarantor_house_number'],
                });
            }
            // Address - City
            if (!data.profile_guarantor_city?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_city.required,
                    path: ['profile_guarantor_city'],
                });
            }
            // Address - Country
            if (!data.profile_guarantor_country?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_country.required,
                    path: ['profile_guarantor_country'],
                });
            }
            // Address - Postal code
            if (!data.profile_guarantor_postal_code?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_postal_code.required,
                    path: ['profile_guarantor_postal_code'],
                });
            } else if (data.profile_guarantor_country) {
                if (!validatePostalCode(data.profile_guarantor_postal_code, data.profile_guarantor_country)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_postal_code.invalid,
                        path: ['profile_guarantor_postal_code'],
                    });
                }
            }
            // Address - State/Province (required for certain countries)
            if (data.profile_guarantor_country && requiresStateProvince(data.profile_guarantor_country)) {
                if (!data.profile_guarantor_state_province?.trim()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_state_province.required,
                        path: ['profile_guarantor_state_province'],
                    });
                }
            }
            // Employment status (always required for guarantor)
            if (!guarantorStatus) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_employment_status.required,
                    path: ['profile_guarantor_employment_status'],
                });
            }
            // Monthly income (always required)
            if (!data.profile_guarantor_monthly_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_monthly_income.required,
                    path: ['profile_guarantor_monthly_income'],
                });
            }
            // ID Documents (always required for guarantor)
            if (!data.profile_guarantor_id_front && !existingDocs.guarantor_id_front) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_id_front.required,
                    path: ['profile_guarantor_id_front'],
                });
            }
            if (!data.profile_guarantor_id_back && !existingDocs.guarantor_id_back) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_guarantor_id_back.required,
                    path: ['profile_guarantor_id_back'],
                });
            }

            // Employed/Self-employed specific validations
            if (isGuarantorEmployed) {
                if (!data.profile_guarantor_employer_name?.trim()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_employer_name.required,
                        path: ['profile_guarantor_employer_name'],
                    });
                }
                if (!data.profile_guarantor_job_title?.trim()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_job_title.required,
                        path: ['profile_guarantor_job_title'],
                    });
                }
                if (!data.profile_guarantor_employment_type?.trim()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_employment_type.required,
                        path: ['profile_guarantor_employment_type'],
                    });
                }
                if (!data.profile_guarantor_employment_start_date?.trim()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_employment_start_date.required,
                        path: ['profile_guarantor_employment_start_date'],
                    });
                }
                // Employment documents
                if (!data.profile_guarantor_employment_contract && !existingDocs.guarantor_employment_contract) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_employment_contract.required,
                        path: ['profile_guarantor_employment_contract'],
                    });
                }
                if (!data.profile_guarantor_payslip_1 && !existingDocs.guarantor_payslip_1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_payslip.required,
                        path: ['profile_guarantor_payslip_1'],
                    });
                }
                if (!data.profile_guarantor_payslip_2 && !existingDocs.guarantor_payslip_2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_payslip.required,
                        path: ['profile_guarantor_payslip_2'],
                    });
                }
                if (!data.profile_guarantor_payslip_3 && !existingDocs.guarantor_payslip_3) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_payslip.required,
                        path: ['profile_guarantor_payslip_3'],
                    });
                }
            }

            // Student specific validations
            if (isGuarantorStudent) {
                if (!data.profile_guarantor_university_name?.trim()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_university_name.required,
                        path: ['profile_guarantor_university_name'],
                    });
                }
                if (!data.profile_guarantor_program_of_study?.trim()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_program_of_study.required,
                        path: ['profile_guarantor_program_of_study'],
                    });
                }
                if (!data.profile_guarantor_student_proof && !existingDocs.guarantor_student_proof) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_student_proof.required,
                        path: ['profile_guarantor_student_proof'],
                    });
                }
            }

            // Unemployed/Retired specific validations
            if (isGuarantorUnemployedOrRetired) {
                if (!data.profile_guarantor_other_income_proof && !existingDocs.guarantor_other_income_proof) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_guarantor_other_income_proof.required,
                        path: ['profile_guarantor_other_income_proof'],
                    });
                }
            }
        }
    });
}

// Default export for backwards compatibility (no existing docs context)
export const employmentIncomeStepSchema = createEmploymentStepSchema();

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

// ===== NEW STEP SCHEMAS (8-step structure) =====

// Step 4: Risk Mitigation - Support (all optional since co-signers/guarantors are "coming soon")
export const riskMitigationStepSchema = z.object({
    interested_in_rent_insurance: z.enum(['yes', 'no', 'already_have', '']).optional(),
    existing_insurance_provider: z.string().max(200).optional(),
    existing_insurance_policy_number: z.string().max(100).optional(),
});

// Step 5: Credit & Rental History (per PLAN.md)
export const historyStepSchema = z
    .object({
        // Credit Check Authorization (Core Requirement per PLAN.md)
        authorize_credit_check: z.boolean(),
        credit_check_provider_preference: z.string().optional(),
        // Background & History (Optional - Suggested for US)
        authorize_background_check: z.boolean().optional(),
        has_ccjs_or_bankruptcies: z.boolean().optional(),
        ccj_bankruptcy_details: z.string().max(2000).optional(),
        has_eviction_history: z.boolean().optional(),
        eviction_details: z.string().max(2000).optional(),
        self_reported_credit_score: z.string().optional(),
        credit_report_upload: z.any().nullable().optional(),
        // Current Address
        current_living_situation: z.string().optional(),
        current_address_street: z.string().optional(),
        current_address_unit: z.string().optional(),
        current_address_city: z.string().optional(),
        current_address_state_province: z.string().optional(),
        current_address_postal_code: z.string().optional(),
        current_address_country: z.string().optional(),
        current_address_move_in_date: z.string().optional(),
        current_monthly_rent: z.string().optional(),
        current_rent_currency: z.string().optional(),
        current_landlord_name: z.string().optional(),
        current_landlord_contact: z.string().optional(),
        reason_for_moving: z.string().optional(),
        reason_for_moving_other: z.string().max(500).optional(),
        // Previous Addresses
        previous_addresses: z.array(z.any()).optional(),
        // Landlord References
        landlord_references: z.array(z.any()).optional(),
        // Employer Reference
        employer_reference_name: z.string().optional(),
        employer_reference_email: z.string().optional(),
        employer_reference_phone: z.string().optional(),
        employer_reference_job_title: z.string().optional(),
        consent_to_contact_employer: z.boolean().optional(),
        // Other References
        other_references: z.array(z.any()).optional(),
        // Legacy fields
        references: z.array(referenceSchema).optional(),
        previous_landlord_name: z.string().optional(),
        previous_landlord_phone: z.string().optional(),
        previous_landlord_email: z.string().optional(),
        emergency_contact_name: z.string().optional(),
        emergency_contact_phone: z.string().optional(),
        emergency_contact_relationship: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // Credit check authorization is required
        if (!data.authorize_credit_check) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.authorize_credit_check.required,
                path: ['authorize_credit_check'],
            });
        }
        // If CCJs/bankruptcies, require details
        if (data.has_ccjs_or_bankruptcies && !data.ccj_bankruptcy_details?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.ccj_bankruptcy_details.required,
                path: ['ccj_bankruptcy_details'],
            });
        }
        // If eviction history, require details
        if (data.has_eviction_history && !data.eviction_details?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.eviction_details.required,
                path: ['eviction_details'],
            });
        }
        // If reason for moving is "other", require details
        if (data.reason_for_moving === 'other' && !data.reason_for_moving_other?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.reason_for_moving_other.required,
                path: ['reason_for_moving_other'],
            });
        }
    });

// Step 6: Additional Information & Documents (per PLAN.md)
export const additionalInfoStepSchema = z.object({
    // Main fields per PLAN.md
    additional_information: z.string().max(2000).optional(),
    additional_documents: z.array(z.any()).optional(), // Array of {file, description}
    // Legacy fields for backwards compatibility
    additional_bank_statements: z.array(z.any()).nullable().optional(),
    additional_tax_returns: z.array(z.any()).nullable().optional(),
    additional_other_documents: z.array(z.any()).nullable().optional(),
    additional_notes: z.string().max(2000).optional(),
});

// Step 7: Declarations & Consent (per PLAN.md)
export const consentStepSchema = z.object({
    // Required declarations
    declaration_accuracy: z.boolean().refine((val) => val === true, {
        message: APPLICATION_MESSAGES.declaration_accuracy.required,
    }),
    consent_screening: z.boolean().refine((val) => val === true, {
        message: APPLICATION_MESSAGES.consent_screening.required,
    }),
    consent_data_processing: z.boolean().refine((val) => val === true, {
        message: APPLICATION_MESSAGES.consent_data_processing.required,
    }),
    consent_reference_contact: z.boolean().refine((val) => val === true, {
        message: APPLICATION_MESSAGES.consent_reference_contact.required,
    }),
    // Optional consents
    consent_data_sharing: z.boolean().optional(),
    consent_marketing: z.boolean().optional(),
    // Signature
    digital_signature: z.string().min(1, APPLICATION_MESSAGES.digital_signature.required),
    signature_date: z.string().optional(), // Auto-filled
    signature_ip_address: z.string().optional(), // Auto-captured
    // Legacy fields for backwards compatibility
    consent_accurate_info: z.boolean().optional(),
    consent_background_check: z.boolean().optional(),
    consent_terms: z.boolean().optional(),
    signature_full_name: z.string().optional(),
});

// Legacy schemas (kept for backwards compatibility during migration)
export const referencesStepSchema = z.object({
    references: z.array(referenceSchema),
    previous_landlord_name: z.string().optional(),
    previous_landlord_phone: z.string().optional(),
    previous_landlord_email: z.string().optional(),
});

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
export function validateApplicationStep(
    stepId: ApplicationStepId,
    data: Record<string, unknown>,
    existingDocs?: ExistingDocumentsContext,
): ValidationResult {
    let schema: z.ZodSchema;

    switch (stepId) {
        // New 8-step structure
        case 'identity':
            // Step 1: Identity & Legal Eligibility
            schema = createPersonalInfoStepSchema(existingDocs);
            break;
        case 'household':
            // Step 2: Household Composition (move-in, occupants, pets, emergency contact)
            schema = detailsStepSchema;
            break;
        case 'financial':
            // Step 3: Financial Capability (employment, income)
            schema = createEmploymentStepSchema(existingDocs);
            break;
        case 'risk':
            // Step 4: Risk Mitigation (co-signers, guarantors, insurance)
            schema = riskMitigationStepSchema;
            break;
        case 'history':
            // Step 5: Credit & Rental History
            schema = historyStepSchema;
            break;
        case 'additional':
            // Step 6: Additional Information
            schema = additionalInfoStepSchema;
            break;
        case 'consent':
            // Step 7: Declarations & Consent
            schema = consentStepSchema;
            break;
        case 'review':
            // Step 8: Review - no validation, just display
            return { success: true, errors: {} };
        default:
            return { success: true, errors: {} };
    }

    const result = schema.safeParse(data);

    const errors: Record<string, string> = {};

    if (!result.success) {
        result.error.issues.forEach((issue) => {
            const path = issue.path.map(String).join('.');
            // Only set the first error for each path
            if (!errors[path]) {
                errors[path] = issue.message;
            }
        });
    }

    // Additional validation for occupants with "Other" relationship
    if (stepId === 'household') {
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
    if (stepId === 'history') {
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
export function findFirstInvalidApplicationStep(data: Record<string, unknown>, existingDocs?: ExistingDocumentsContext): number {
    // 8-step order: identity, household, financial, risk, history, additional, consent, review
    const stepIds: ApplicationStepId[] = ['identity', 'household', 'financial', 'risk', 'history', 'additional', 'consent', 'review'];

    for (let i = 0; i < stepIds.length; i++) {
        const result = validateApplicationStep(stepIds[i], data, existingDocs);
        if (!result.success) {
            return i;
        }
    }

    return stepIds.length; // All steps valid
}

/**
 * Validate all data for submission
 */
export function validateApplicationForSubmit(data: Record<string, unknown>, existingDocs?: ExistingDocumentsContext): ValidationResult {
    const allErrors: Record<string, string> = {};
    // Validate all steps except review (which has no validation)
    const stepIds: ApplicationStepId[] = ['identity', 'household', 'financial', 'risk', 'history', 'additional', 'consent'];

    for (const stepId of stepIds) {
        const result = validateApplicationStep(stepId, data, existingDocs);
        Object.assign(allErrors, result.errors);
    }

    return {
        success: Object.keys(allErrors).length === 0,
        errors: allErrors,
    };
}
