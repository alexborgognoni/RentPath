import {
    validateFinancialDocuments,
    validateFinancialFields,
    validateIdDocuments,
    type DocumentContext,
} from '@/lib/validation/financial-validation';
import { validatePhoneNumber } from '@/utils/phone-validation';
import { z } from 'zod';

// Step IDs - 8 steps (restructured)
export type ApplicationStepId =
    | 'identity' // Step 1: Identity & Legal Eligibility
    | 'household' // Step 2: Household Composition
    | 'financial' // Step 3: Financial Capability (Tenant)
    | 'support' // Step 4: Financial Support (Co-signers & Guarantors)
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
    profile_bio: {
        maxLength: 'Bio cannot exceed 1000 characters',
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
    profile_residence_permit_document: {
        required: 'Residence permit document is required',
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

    // Employment Step - Common
    profile_employment_status: {
        required: 'Please select your employment status',
    },

    // Employed fields
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
    profile_gross_annual_income: {
        required: 'Gross annual salary is required',
        min: 'Salary must be a positive number',
    },
    profile_net_monthly_income: {
        required: 'Net monthly income is required',
        min: 'Income must be a positive number',
    },
    profile_monthly_income: {
        required: 'Monthly income is required',
        min: 'Income must be a positive number',
    },

    // Self-employed fields
    profile_business_name: {
        required: 'Business name is required',
    },
    profile_business_type: {
        required: 'Business type is required',
    },
    profile_business_start_date: {
        required: 'Business start date is required',
    },
    profile_gross_annual_revenue: {
        required: 'Gross annual revenue is required',
        min: 'Revenue must be a positive number',
    },

    // Student fields
    profile_university_name: {
        required: 'University name is required',
    },
    profile_program_of_study: {
        required: 'Program of study is required',
    },
    profile_student_income_source_type: {
        required: 'Please select your income source',
    },
    profile_student_income_source_other: {
        required: 'Please specify your income source',
    },
    profile_student_monthly_income: {
        required: 'Monthly income is required',
        min: 'Income must be a positive number',
    },

    // Retired fields
    profile_pension_type: {
        required: 'Pension type is required',
    },
    profile_pension_monthly_income: {
        required: 'Monthly pension income is required',
        min: 'Pension must be a positive number',
    },
    profile_pension_statement: {
        required: 'Pension statement is required',
    },

    // Unemployed fields
    profile_unemployed_income_source: {
        required: 'Please select your income source',
    },
    profile_unemployed_income_source_other: {
        required: 'Please specify your income source',
    },
    profile_unemployment_benefits_amount: {
        required: 'Benefits amount is required',
        min: 'Amount must be a positive number',
    },
    profile_benefits_statement: {
        required: 'Benefits statement is required',
    },

    // Other employment situation fields
    profile_other_employment_situation: {
        required: 'Please select your current situation',
    },
    profile_other_employment_situation_details: {
        required: 'Please describe your situation',
    },
    profile_other_situation_monthly_income: {
        required: 'Monthly income is required',
        min: 'Income must be a positive number',
    },
    profile_other_situation_income_source: {
        required: 'Income source is required',
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
    // Current address fields (required)
    current_address_street_name: {
        required: 'Street name is required',
    },
    current_address_house_number: {
        required: 'House number is required',
    },
    current_address_city: {
        required: 'City is required',
    },
    current_address_postal_code: {
        required: 'Postal code is required',
    },
    current_address_country: {
        required: 'Country is required',
    },
    current_address_move_in_date: {
        required: 'Move-in date is required',
        past: 'Move-in date must be in the past or today',
    },
    current_monthly_rent: {
        required: 'Monthly rent is required when renting',
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
    // Previous address fields
    previous_address: {
        street_name: { required: 'Street name is required' },
        house_number: { required: 'House number is required' },
        city: { required: 'City is required' },
        postal_code: { required: 'Postal code is required' },
        country: { required: 'Country is required' },
        from_date: { required: 'From date is required' },
        to_date: { required: 'To date is required', afterFrom: 'To date must be after from date' },
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

    // Emergency Contact (Step 2)
    emergency_contact: {
        first_name: { required: 'First name is required' },
        last_name: { required: 'Last name is required' },
        relationship: { required: 'Relationship is required' },
        relationship_other: { required: 'Please specify the relationship' },
        phone_number: { required: 'Phone number is required' },
    },
};

// ===== Existing Documents Context =====
// Used to check if documents already exist in tenant profile
export interface ExistingDocumentsContext {
    // Main tenant documents
    id_document_front?: boolean;
    id_document_back?: boolean;
    residence_permit_document?: boolean;
    right_to_rent_document?: boolean;
    // Employment documents
    employment_contract?: boolean;
    payslip_1?: boolean;
    payslip_2?: boolean;
    payslip_3?: boolean;
    // Student documents
    student_proof?: boolean;
    // Retired documents
    pension_statement?: boolean;
    // Unemployed documents
    benefits_statement?: boolean;
    // Other documents
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
        // Check for lowercase 'other' (matching component values)
        if (data.relationship === 'other') {
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
    type: stringField().pipe(z.string().min(1, APPLICATION_MESSAGES.pet.type.required).max(100, APPLICATION_MESSAGES.pet.type.maxLength)),
    type_other: stringField().pipe(z.string().max(100, APPLICATION_MESSAGES.pet.type_other.maxLength)),
    breed: stringField().pipe(z.string().max(100, APPLICATION_MESSAGES.pet.breed.maxLength)),
    age: stringField().pipe(
        z.string().refine(
            (val) => {
                if (!val) return true; // Optional
                const num = parseInt(val);
                return !isNaN(num) && num >= 0 && num <= 50;
            },
            { message: APPLICATION_MESSAGES.pet.age.max },
        ),
    ),
    size: z.preprocess((val) => val ?? '', z.enum(['small', 'medium', 'large', '']).optional()),
    name: stringField().pipe(z.string().max(100)),
});

const petWithOtherSchema = petSchema.refine(
    (data) => {
        // Check for lowercase 'other' (matching component values)
        if (data.type === 'other') {
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

// Immigration / Residency Status Enum (must match backend)
export const IMMIGRATION_STATUS_VALUES = [
    'citizen',
    'permanent_resident',
    'temporary_resident',
    'visa_holder',
    'student',
    'work_permit',
    'family_reunification',
    'refugee_or_protected',
    'other',
] as const;
export type ImmigrationStatus = (typeof IMMIGRATION_STATUS_VALUES)[number];

// Step 1: Personal Info - Base schema (Identity & Legal Eligibility)
const personalInfoBaseSchema = z.object({
    // Personal Details
    profile_date_of_birth: z.string().min(1, APPLICATION_MESSAGES.profile_date_of_birth.required),
    profile_nationality: z.string().min(1, APPLICATION_MESSAGES.profile_nationality.required),
    profile_phone_country_code: z.string(),
    profile_phone_number: z.string().min(1, APPLICATION_MESSAGES.profile_phone_number.required),
    profile_bio: z.string().max(1000, APPLICATION_MESSAGES.profile_bio.maxLength).optional(),
    // ID Document
    profile_id_document_type: z.string().min(1, APPLICATION_MESSAGES.profile_id_document_type.required),
    profile_id_number: z.string().min(1, APPLICATION_MESSAGES.profile_id_number.required),
    profile_id_issuing_country: z.string().min(1, APPLICATION_MESSAGES.profile_id_issuing_country.required),
    profile_id_expiry_date: z.string().min(1, APPLICATION_MESSAGES.profile_id_expiry_date.required),
    profile_id_document_front: z.any().nullable(),
    profile_id_document_back: z.any().nullable(),
    // Immigration Status (required for all applicants)
    profile_immigration_status: z.string().min(1, APPLICATION_MESSAGES.profile_immigration_status.required),
    profile_immigration_status_other: z.string().optional(),
    profile_visa_type: z.string().optional(),
    profile_visa_type_other: z.string().optional(),
    profile_visa_expiry_date: z.string().optional(),
    profile_residence_permit_document: z.any().nullable().optional(),
    // Right to Rent (optional)
    profile_right_to_rent_share_code: z.string().optional(),
    profile_right_to_rent_document: z.any().nullable().optional(),
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

        // Validate ID expiry date is in the future (must be AFTER today, not equal)
        // Use string comparison (YYYY-MM-DD) to avoid timezone issues
        // Backend uses Laravel's `after:today` which is also strictly greater than
        if (data.profile_id_expiry_date) {
            const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
            if (data.profile_id_expiry_date <= todayStr) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_id_expiry_date.future,
                    path: ['profile_id_expiry_date'],
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

        // Immigration status conditional validation
        // If status is "other", require specification
        if (data.profile_immigration_status === 'other' && !data.profile_immigration_status_other?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.profile_immigration_status_other.required,
                path: ['profile_immigration_status_other'],
            });
        }

        // If status is one that requires permit details, make those fields mandatory
        const requiresPermitDetails = [
            'temporary_resident',
            'visa_holder',
            'student',
            'work_permit',
            'family_reunification',
            'refugee_or_protected',
        ].includes(data.profile_immigration_status || '');

        if (requiresPermitDetails) {
            if (!data.profile_visa_type?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_visa_type.required,
                    path: ['profile_visa_type'],
                });
            }
            // If visa type is "other", require specification
            if (data.profile_visa_type === 'other' && !data.profile_visa_type_other?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please specify your visa/permit type',
                    path: ['profile_visa_type_other'],
                });
            }
            if (!data.profile_visa_expiry_date) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_visa_expiry_date.required,
                    path: ['profile_visa_expiry_date'],
                });
            } else {
                // Validate visa expiry date is in the future
                const visaExpiryDate = new Date(data.profile_visa_expiry_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (visaExpiryDate <= today) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.profile_visa_expiry_date.future,
                        path: ['profile_visa_expiry_date'],
                    });
                }
            }
            // Residence permit document required for visa_holder (unless existing)
            if (
                data.profile_immigration_status === 'visa_holder' &&
                !data.profile_residence_permit_document &&
                !existingDocs.residence_permit_document
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_residence_permit_document?.required || 'Residence permit document is required',
                    path: ['profile_residence_permit_document'],
                });
            }
        }
    });
}

// Default export for backwards compatibility (no existing docs context)
export const personalInfoStepSchema = createPersonalInfoStepSchema();

// Step 3: Employment & Income - Base schema with all fields (Financial step)
const employmentBaseSchema = z.object({
    // Common
    profile_employment_status: z.string(),
    profile_income_currency: z.string(),

    // Employed fields
    profile_employer_name: z.string(),
    profile_job_title: z.string(),
    profile_employment_type: z.string(),
    profile_employment_start_date: z.string(),
    profile_gross_annual_income: z.string(),
    profile_net_monthly_income: z.string(),
    profile_monthly_income: z.string(), // Deprecated, kept for backwards compatibility

    // Self-employed fields
    profile_business_name: z.string(),
    profile_business_type: z.string(),
    profile_business_start_date: z.string(),
    profile_gross_annual_revenue: z.string(),

    // Student fields
    profile_university_name: z.string(),
    profile_program_of_study: z.string(),
    profile_expected_graduation_date: z.string(),
    profile_student_income_source: z.string(), // Deprecated
    profile_student_income_source_type: z.string(),
    profile_student_income_source_other: z.string(),
    profile_student_monthly_income: z.string(),

    // Retired fields
    profile_pension_monthly_income: z.string(),
    profile_pension_provider: z.string(),
    profile_pension_type: z.string(),
    profile_retirement_other_income: z.string(),

    // Unemployed fields
    profile_receiving_unemployment_benefits: z.boolean(),
    profile_unemployment_benefits_amount: z.string(),
    profile_unemployed_income_source: z.string(),
    profile_unemployed_income_source_other: z.string(),

    // Other employment situation fields
    profile_other_employment_situation: z.string(),
    profile_other_employment_situation_details: z.string(),
    profile_expected_return_to_work: z.string(),
    profile_other_situation_monthly_income: z.string(),
    profile_other_situation_income_source: z.string(),

    // Documents are validated as Files
    profile_id_document_front: z.any().nullable(),
    profile_id_document_back: z.any().nullable(),
    profile_employment_contract: z.any().nullable(),
    profile_payslip_1: z.any().nullable(),
    profile_payslip_2: z.any().nullable(),
    profile_payslip_3: z.any().nullable(),
    profile_student_proof: z.any().nullable(),
    profile_pension_statement: z.any().nullable(),
    profile_benefits_statement: z.any().nullable(),
    profile_other_income_proof: z.any().nullable(),
});

// Factory function that creates employment schema with existing docs context
export function createEmploymentStepSchema(existingDocs: ExistingDocumentsContext = {}) {
    return employmentBaseSchema.superRefine((data, ctx) => {
        const status = data.profile_employment_status;

        // Employment status is always required
        if (!status) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.profile_employment_status.required,
                path: ['profile_employment_status'],
            });
            return; // Stop here if no status
        }

        // EMPLOYED validations
        if (status === 'employed') {
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
            if (!data.profile_gross_annual_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_gross_annual_income.required,
                    path: ['profile_gross_annual_income'],
                });
            }
            if (!data.profile_net_monthly_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_net_monthly_income.required,
                    path: ['profile_net_monthly_income'],
                });
            }
            // Document validations for employed
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

        // SELF-EMPLOYED validations
        if (status === 'self_employed') {
            if (!data.profile_business_name?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_business_name.required,
                    path: ['profile_business_name'],
                });
            }
            if (!data.profile_business_type?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_business_type.required,
                    path: ['profile_business_type'],
                });
            }
            if (!data.profile_business_start_date?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_business_start_date.required,
                    path: ['profile_business_start_date'],
                });
            }
            if (!data.profile_gross_annual_revenue) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_gross_annual_revenue.required,
                    path: ['profile_gross_annual_revenue'],
                });
            }
            if (!data.profile_net_monthly_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_net_monthly_income.required,
                    path: ['profile_net_monthly_income'],
                });
            }
            // Self-employed typically needs tax returns/bank statements (handled via other_income_proof)
        }

        // STUDENT validations
        if (status === 'student') {
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
            if (!data.profile_student_income_source_type?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_student_income_source_type.required,
                    path: ['profile_student_income_source_type'],
                });
            }
            if (!data.profile_student_monthly_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_student_monthly_income.required,
                    path: ['profile_student_monthly_income'],
                });
            }
            // If income source is 'other', require specification
            if (data.profile_student_income_source_type === 'other' && !data.profile_student_income_source_other?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_student_income_source_other.required,
                    path: ['profile_student_income_source_other'],
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

        // RETIRED validations
        if (status === 'retired') {
            if (!data.profile_pension_type?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_pension_type.required,
                    path: ['profile_pension_type'],
                });
            }
            if (!data.profile_pension_monthly_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_pension_monthly_income.required,
                    path: ['profile_pension_monthly_income'],
                });
            }
            if (!data.profile_pension_statement && !existingDocs.pension_statement) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_pension_statement.required,
                    path: ['profile_pension_statement'],
                });
            }
        }

        // UNEMPLOYED validations
        if (status === 'unemployed') {
            // Income source is required
            if (!data.profile_unemployed_income_source?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_unemployed_income_source.required,
                    path: ['profile_unemployed_income_source'],
                });
            }
            // If income source is 'other', require specification
            if (data.profile_unemployed_income_source === 'other' && !data.profile_unemployed_income_source_other?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_unemployed_income_source_other.required,
                    path: ['profile_unemployed_income_source_other'],
                });
            }
            // Monthly income is always required
            if (!data.profile_unemployment_benefits_amount) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_unemployment_benefits_amount.required,
                    path: ['profile_unemployment_benefits_amount'],
                });
            }
            // Proof of income document is always required
            if (!data.profile_other_income_proof && !existingDocs.other_income_proof) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_other_income_proof.required,
                    path: ['profile_other_income_proof'],
                });
            }
        }

        // OTHER employment situation validations
        if (status === 'other') {
            if (!data.profile_other_employment_situation?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_other_employment_situation.required,
                    path: ['profile_other_employment_situation'],
                });
            }
            // If situation is 'other', require details
            if (data.profile_other_employment_situation === 'other' && !data.profile_other_employment_situation_details?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_other_employment_situation_details.required,
                    path: ['profile_other_employment_situation_details'],
                });
            }
            if (!data.profile_other_situation_monthly_income) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_other_situation_monthly_income.required,
                    path: ['profile_other_situation_monthly_income'],
                });
            }
            if (!data.profile_other_situation_income_source?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_other_situation_income_source.required,
                    path: ['profile_other_situation_income_source'],
                });
            }
            if (!data.profile_other_income_proof && !existingDocs.other_income_proof) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.profile_other_income_proof.required,
                    path: ['profile_other_income_proof'],
                });
            }
        }
    });
}

// Default export for backwards compatibility (no existing docs context)
export const employmentIncomeStepSchema = createEmploymentStepSchema();

// Step 2: Household Composition (move-in, lease, occupants, pets, emergency contact)
// Emergency contact is optional, but once any field is filled, all become required (except email)
export const detailsStepSchema = z
    .object({
        desired_move_in_date: z.string().min(1, APPLICATION_MESSAGES.desired_move_in_date.required),
        lease_duration_months: z.coerce
            .number()
            .min(1, APPLICATION_MESSAGES.lease_duration_months.min)
            .max(60, APPLICATION_MESSAGES.lease_duration_months.max),
        message_to_landlord: z.string().max(2000, APPLICATION_MESSAGES.message_to_landlord.maxLength),
        additional_occupants: z.coerce.number().min(0).max(20, APPLICATION_MESSAGES.additional_occupants.max),
        occupants_details: z.array(occupantSchema),
        pets_details: z.array(petSchema),
        // Emergency contact fields (optional until any field is filled)
        // Use nullable().transform() to convert null to empty string
        emergency_contact_first_name: z
            .string()
            .max(100)
            .nullable()
            .optional()
            .transform((v) => v ?? ''),
        emergency_contact_last_name: z
            .string()
            .max(100)
            .nullable()
            .optional()
            .transform((v) => v ?? ''),
        emergency_contact_relationship: z
            .string()
            .max(100)
            .nullable()
            .optional()
            .transform((v) => v ?? ''),
        emergency_contact_relationship_other: z
            .string()
            .max(100)
            .nullable()
            .optional()
            .transform((v) => v ?? ''),
        emergency_contact_phone_country_code: z
            .string()
            .max(10)
            .nullable()
            .optional()
            .transform((v) => v ?? ''),
        emergency_contact_phone_number: z
            .string()
            .max(20)
            .nullable()
            .optional()
            .transform((v) => v ?? ''),
        emergency_contact_email: z
            .string()
            .email()
            .max(255)
            .or(z.literal(''))
            .nullable()
            .optional()
            .transform((v) => v ?? ''),
    })
    .refine(
        (data) => {
            // Validate move-in date is today or in the future
            if (data.desired_move_in_date) {
                const selectedDate = new Date(data.desired_move_in_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today;
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.desired_move_in_date.future,
            path: ['desired_move_in_date'],
        },
    );

// ===== NEW STEP SCHEMAS (8-step structure) =====

// Step 4: Risk Mitigation - Support (co-signers, guarantors, insurance)
const riskMitigationBaseSchema = z.object({
    co_signers: z.array(z.any()),
    guarantors: z.array(z.any()),
    interested_in_rent_insurance: z.string(),
    existing_insurance_provider: z.string().optional(),
    existing_insurance_policy_number: z.string().optional(),
});

export const riskMitigationStepSchema = riskMitigationBaseSchema.superRefine((data, ctx) => {
    // Insurance is required - must be one of the valid options
    const validInsuranceOptions = ['yes', 'no', 'already_have'];
    if (!data.interested_in_rent_insurance || !validInsuranceOptions.includes(data.interested_in_rent_insurance)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select an option for rent guarantee insurance',
            path: ['interested_in_rent_insurance'],
        });
    }

    // If already_have insurance, provider is required
    if (data.interested_in_rent_insurance === 'already_have' && !data.existing_insurance_provider?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please provide your insurance provider name',
            path: ['existing_insurance_provider'],
        });
    }

    // Validate each co-signer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data.co_signers as any[]).forEach((coSigner, index) => {
        // === Personal Details ===
        // First name required
        if (!coSigner.first_name?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'First name is required',
                path: [`cosigner_${index}_first_name`],
            });
        }

        // Last name required
        if (!coSigner.last_name?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Last name is required',
                path: [`cosigner_${index}_last_name`],
            });
        }

        // Email required
        if (!coSigner.email?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Email is required',
                path: [`cosigner_${index}_email`],
            });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coSigner.email)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please enter a valid email address',
                path: [`cosigner_${index}_email`],
            });
        }

        // Phone required
        if (!coSigner.phone_number?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Phone number is required',
                path: [`cosigner_${index}_phone_number`],
            });
        }

        // Date of birth required
        if (!coSigner.date_of_birth) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Date of birth is required',
                path: [`cosigner_${index}_date_of_birth`],
            });
        }

        // Nationality required
        if (!coSigner.nationality?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Nationality is required',
                path: [`cosigner_${index}_nationality`],
            });
        }

        // Relationship required
        if (!coSigner.relationship?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Relationship is required',
                path: [`cosigner_${index}_relationship`],
            });
        } else if (coSigner.relationship === 'other' && !coSigner.relationship_other?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please specify the relationship',
                path: [`cosigner_${index}_relationship_other`],
            });
        }

        // === ID Document ===
        if (!coSigner.id_document_type?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'ID document type is required',
                path: [`cosigner_${index}_id_document_type`],
            });
        }

        if (!coSigner.id_number?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'ID number is required',
                path: [`cosigner_${index}_id_number`],
            });
        }

        if (!coSigner.id_issuing_country?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Issuing country is required',
                path: [`cosigner_${index}_id_issuing_country`],
            });
        }

        if (!coSigner.id_expiry_date) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'ID expiry date is required',
                path: [`cosigner_${index}_id_expiry_date`],
            });
        }

        // === Address ===
        if (!coSigner.street_name?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Street name is required',
                path: [`cosigner_${index}_street_name`],
            });
        }

        if (!coSigner.house_number?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'House number is required',
                path: [`cosigner_${index}_house_number`],
            });
        }

        if (!coSigner.city?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'City is required',
                path: [`cosigner_${index}_city`],
            });
        }

        if (!coSigner.postal_code?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Postal code is required',
                path: [`cosigner_${index}_postal_code`],
            });
        }

        if (!coSigner.country?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Country is required',
                path: [`cosigner_${index}_country`],
            });
        }

        // === Financial ===
        // Validate financial fields using the shared helper
        const financialErrors = validateFinancialFields(coSigner, 'co_signer');
        Object.entries(financialErrors).forEach(([field, message]) => {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message,
                path: [`cosigner_${index}_${field}`],
            });
        });

        // === ID Document Upload Validation (using shared function) ===
        const idDocContext: DocumentContext = {
            id_document_front: coSigner.id_document_front_path || null,
            id_document_back: coSigner.id_document_back_path || null,
        };
        const idDocErrors = validateIdDocuments(idDocContext);
        Object.entries(idDocErrors).forEach(([field, message]) => {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message,
                path: [`cosigner_${index}_${field}`],
            });
        });

        // === Financial Document Validation (using shared function) ===
        const finDocContext: DocumentContext = {
            employment_contract: coSigner.employment_contract_path || null,
            payslip_1: coSigner.payslip_1_path || null,
            payslip_2: coSigner.payslip_2_path || null,
            payslip_3: coSigner.payslip_3_path || null,
            income_proof: coSigner.income_proof_path || null,
            student_proof: coSigner.student_proof_path || coSigner.enrollment_proof_path || null,
            pension_statement: coSigner.pension_statement_path || null,
            benefits_statement: coSigner.benefits_statement_path || null,
            other_income_proof: coSigner.income_proof_path || null,
        };
        const finDocErrors = validateFinancialDocuments(coSigner, finDocContext, 'co_signer');
        Object.entries(finDocErrors).forEach(([field, message]) => {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message,
                path: [`cosigner_${index}_${field}`],
            });
        });
    });

    // Validate each guarantor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data.guarantors as any[]).forEach((guarantor, index) => {
        // === Personal Details ===
        // First name required
        if (!guarantor.first_name?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'First name is required',
                path: [`guarantor_${index}_first_name`],
            });
        }

        // Last name required
        if (!guarantor.last_name?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Last name is required',
                path: [`guarantor_${index}_last_name`],
            });
        }

        // Email required
        if (!guarantor.email?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Email is required',
                path: [`guarantor_${index}_email`],
            });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guarantor.email)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please enter a valid email address',
                path: [`guarantor_${index}_email`],
            });
        }

        // Phone required
        if (!guarantor.phone_number?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Phone number is required',
                path: [`guarantor_${index}_phone_number`],
            });
        }

        // Date of birth required
        if (!guarantor.date_of_birth) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Date of birth is required',
                path: [`guarantor_${index}_date_of_birth`],
            });
        }

        // Nationality required
        if (!guarantor.nationality?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Nationality is required',
                path: [`guarantor_${index}_nationality`],
            });
        }

        // Relationship required
        if (!guarantor.relationship?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Relationship is required',
                path: [`guarantor_${index}_relationship`],
            });
        } else if (guarantor.relationship === 'other' && !guarantor.relationship_other?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please specify the relationship',
                path: [`guarantor_${index}_relationship_other`],
            });
        }

        // === ID Document ===
        if (!guarantor.id_document_type?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'ID document type is required',
                path: [`guarantor_${index}_id_document_type`],
            });
        }

        if (!guarantor.id_number?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'ID number is required',
                path: [`guarantor_${index}_id_number`],
            });
        }

        if (!guarantor.id_issuing_country?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Issuing country is required',
                path: [`guarantor_${index}_id_issuing_country`],
            });
        }

        if (!guarantor.id_expiry_date) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'ID expiry date is required',
                path: [`guarantor_${index}_id_expiry_date`],
            });
        }

        // === Address ===
        if (!guarantor.street_name?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Street name is required',
                path: [`guarantor_${index}_street_name`],
            });
        }

        if (!guarantor.house_number?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'House number is required',
                path: [`guarantor_${index}_house_number`],
            });
        }

        if (!guarantor.city?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'City is required',
                path: [`guarantor_${index}_city`],
            });
        }

        if (!guarantor.postal_code?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Postal code is required',
                path: [`guarantor_${index}_postal_code`],
            });
        }

        if (!guarantor.country?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Country is required',
                path: [`guarantor_${index}_country`],
            });
        }

        // === Financial ===
        // Validate financial fields using the shared helper
        const financialErrors = validateFinancialFields(guarantor, 'guarantor');
        Object.entries(financialErrors).forEach(([field, message]) => {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message,
                path: [`guarantor_${index}_${field}`],
            });
        });

        // === ID Document Upload Validation (using shared function) ===
        const idDocContext: DocumentContext = {
            id_document_front: guarantor.id_document_front_path || null,
            id_document_back: guarantor.id_document_back_path || null,
        };
        const idDocErrors = validateIdDocuments(idDocContext);
        Object.entries(idDocErrors).forEach(([field, message]) => {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message,
                path: [`guarantor_${index}_${field}`],
            });
        });

        // === Proof of Income Document ===
        // Guarantors need proof of income regardless of employment status
        if (!guarantor.proof_of_income_path && !guarantor.income_proof_path) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Proof of income is required',
                path: [`guarantor_${index}_proof_of_income`],
            });
        }
    });
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
        // Current Address (required - matching AddressForm structure)
        current_living_situation: z.string().optional(),
        current_address_street_name: z.string().optional(),
        current_address_house_number: z.string().optional(),
        current_address_address_line_2: z.string().optional(),
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
        // Previous Addresses (with AddressForm-compatible structure)
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

        // === Current Address validation (required) ===
        // Living situation is required
        if (!data.current_living_situation?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_living_situation.required,
                path: ['current_living_situation'],
            });
        }

        // Street name required
        if (!data.current_address_street_name?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_address_street_name.required,
                path: ['current_address_street_name'],
            });
        }

        // House number required
        if (!data.current_address_house_number?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_address_house_number.required,
                path: ['current_address_house_number'],
            });
        }

        // City required
        if (!data.current_address_city?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_address_city.required,
                path: ['current_address_city'],
            });
        }

        // Postal code required
        if (!data.current_address_postal_code?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_address_postal_code.required,
                path: ['current_address_postal_code'],
            });
        }

        // Country required
        if (!data.current_address_country?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_address_country.required,
                path: ['current_address_country'],
            });
        }

        // Move-in date required
        if (!data.current_address_move_in_date?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_address_move_in_date.required,
                path: ['current_address_move_in_date'],
            });
        }

        // Monthly rent required if renting
        if (data.current_living_situation === 'renting' && !data.current_monthly_rent?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.current_monthly_rent.required,
                path: ['current_monthly_rent'],
            });
        }

        // Reason for moving required
        if (!data.reason_for_moving?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: APPLICATION_MESSAGES.reason_for_moving.required,
                path: ['reason_for_moving'],
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

        // === Previous Addresses validation ===
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const previousAddresses = data.previous_addresses as any[];
        previousAddresses?.forEach((addr, index) => {
            if (!addr.street_name?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.previous_address.street_name.required,
                    path: [`prevaddr_${index}_street_name`],
                });
            }
            if (!addr.house_number?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.previous_address.house_number.required,
                    path: [`prevaddr_${index}_house_number`],
                });
            }
            if (!addr.city?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.previous_address.city.required,
                    path: [`prevaddr_${index}_city`],
                });
            }
            if (!addr.postal_code?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.previous_address.postal_code.required,
                    path: [`prevaddr_${index}_postal_code`],
                });
            }
            if (!addr.country?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.previous_address.country.required,
                    path: [`prevaddr_${index}_country`],
                });
            }
            if (!addr.from_date?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.previous_address.from_date.required,
                    path: [`prevaddr_${index}_from_date`],
                });
            }
            if (!addr.to_date?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: APPLICATION_MESSAGES.previous_address.to_date.required,
                    path: [`prevaddr_${index}_to_date`],
                });
            }
            // Validate to_date is after from_date
            if (addr.from_date && addr.to_date) {
                const fromDate = new Date(addr.from_date);
                const toDate = new Date(addr.to_date);
                if (toDate <= fromDate) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: APPLICATION_MESSAGES.previous_address.to_date.afterFrom,
                        path: [`prevaddr_${index}_to_date`],
                    });
                }
            }
        });
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
        case 'support':
            // Step 4: Financial Support (co-signers, guarantors, insurance)
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
            let path = issue.path.map(String).join('.');

            // Transform nested array paths to match component field naming
            // e.g., "occupants_details.0.first_name" -> "occupant_0_first_name"
            // e.g., "pets_details.0.type" -> "pet_0_type"
            if (path.startsWith('occupants_details.')) {
                path = path.replace(/^occupants_details\.(\d+)\.(.+)$/, 'occupant_$1_$2');
            } else if (path.startsWith('pets_details.')) {
                path = path.replace(/^pets_details\.(\d+)\.(.+)$/, 'pet_$1_$2');
            }

            // Only set the first error for each path
            if (!errors[path]) {
                errors[path] = issue.message;
            }
        });
    }

    // Additional validation for occupants with "Other" relationship
    if (stepId === 'household') {
        const occupants = data.occupants_details as Array<{
            first_name: string;
            last_name: string;
            date_of_birth: string;
            relationship: string;
            relationship_other: string;
        }>;
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

        // Validate pets with "Other" type (if any pets provided)
        const pets = data.pets_details as Array<{ type: string; type_other: string; breed: string; age: string; size: string }>;
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

        // Emergency contact: if first name OR last name is filled, all fields become required (except email)
        const ecFirstName = (data.emergency_contact_first_name as string) || '';
        const ecLastName = (data.emergency_contact_last_name as string) || '';
        const ecRelationship = (data.emergency_contact_relationship as string) || '';
        const ecRelationshipOther = (data.emergency_contact_relationship_other as string) || '';
        const ecPhoneNumber = (data.emergency_contact_phone_number as string) || '';

        const hasEmergencyContactName = ecFirstName.trim() || ecLastName.trim();

        if (hasEmergencyContactName) {
            if (!ecFirstName.trim()) {
                errors.emergency_contact_first_name = APPLICATION_MESSAGES.emergency_contact.first_name.required;
            }
            if (!ecLastName.trim()) {
                errors.emergency_contact_last_name = APPLICATION_MESSAGES.emergency_contact.last_name.required;
            }
            if (!ecRelationship) {
                errors.emergency_contact_relationship = APPLICATION_MESSAGES.emergency_contact.relationship.required;
            }
            // If relationship is 'other', require specification
            if (ecRelationship === 'other' && !ecRelationshipOther.trim()) {
                errors.emergency_contact_relationship_other = APPLICATION_MESSAGES.emergency_contact.relationship_other.required;
            }
            if (!ecPhoneNumber.trim()) {
                errors.emergency_contact_phone_number = APPLICATION_MESSAGES.emergency_contact.phone_number.required;
            }
            // Email stays optional
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
 * Validate all data for submission
 */
export function validateApplicationForSubmit(data: Record<string, unknown>, existingDocs?: ExistingDocumentsContext): ValidationResult {
    const allErrors: Record<string, string> = {};
    // Validate all steps except review (which has no validation)
    const stepIds: ApplicationStepId[] = ['identity', 'household', 'financial', 'support', 'history', 'additional', 'consent'];

    for (const stepId of stepIds) {
        const result = validateApplicationStep(stepId, data, existingDocs);
        Object.assign(allErrors, result.errors);
    }

    return {
        success: Object.keys(allErrors).length === 0,
        errors: allErrors,
    };
}
