import {
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

export type ApplicationStep = 'identity' | 'household' | 'financial' | 'support' | 'history' | 'additional' | 'consent' | 'review';

export const APPLICATION_STEPS: WizardStepConfig<ApplicationStep>[] = [
    { id: 'identity', title: 'Identity & Legal Eligibility', shortTitle: 'Identity' },
    { id: 'household', title: 'Household Composition', shortTitle: 'Household' },
    { id: 'financial', title: 'Financial Capability', shortTitle: 'Financial' },
    { id: 'support', title: 'Financial Support', shortTitle: 'Support' },
    { id: 'history', title: 'Credit & Rental History', shortTitle: 'History' },
    { id: 'additional', title: 'Additional Information', shortTitle: 'Additional', optional: true },
    { id: 'consent', title: 'Declarations & Consent', shortTitle: 'Consent' },
    { id: 'review', title: 'Review & Submit', shortTitle: 'Review' },
];

// ===== Types =====

export interface OccupantDetails {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    relationship: string;
    relationship_other: string;
    will_sign_lease: boolean;
    is_dependent: boolean;
}

export interface PetDetails {
    type: string;
    type_other: string;
    breed: string;
    name: string;
    age: string;
    size: 'small' | 'medium' | 'large' | '';
    is_registered_assistance_animal: boolean;
    assistance_animal_documentation: File | null;
}

export interface LandlordReferenceDetails {
    name: string;
    company: string;
    email: string;
    phone: string;
    property_address: string;
    tenancy_start_date: string;
    tenancy_end_date: string;
    monthly_rent_paid: string;
    consent_to_contact: boolean;
}

export interface EmployerReferenceDetails {
    name: string;
    email: string;
    phone: string;
    job_title: string;
    consent_to_contact: boolean;
}

export interface OtherReferenceDetails {
    name: string;
    email: string;
    phone: string;
    relationship: 'professional' | 'personal' | '';
    years_known: string;
    consent_to_contact: boolean;
}

export interface PreviousAddressDetails {
    // Address fields (matching AddressForm component)
    street_name: string;
    house_number: string;
    address_line_2: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
    // Date range
    from_date: string;
    to_date: string;
    // Rental info
    living_situation: string;
    monthly_rent: string;
    rent_currency: string;
    landlord_name: string;
    landlord_contact: string;
    can_contact_landlord: boolean;
}

export interface AdditionalIncomeSource {
    type: 'rental_income' | 'investments' | 'benefits' | 'child_support' | 'other' | '';
    monthly_amount: string;
    proof: File | null;
}

// Legacy reference type for backwards compatibility
export interface ReferenceDetails {
    type: 'landlord' | 'personal' | 'professional';
    name: string;
    phone: string;
    email: string;
    relationship: string;
    relationship_other: string;
    years_known: string;
}

// Co-signer per PLAN.md - requires full identity + financial
export interface CoSignerDetails {
    occupant_index: number;
    from_occupant_index: number | null; // null = manually added, number = auto-generated from occupant at this index
    // Identity
    first_name: string;
    last_name: string;
    email: string;
    phone_country_code: string;
    phone_number: string;
    date_of_birth: string;
    nationality: string;
    relationship: string;
    relationship_other: string;
    // ID Document
    id_document_type: 'passport' | 'national_id' | 'drivers_license' | 'residence_permit' | '';
    id_number: string;
    id_issuing_country: string;
    id_expiry_date: string;
    id_document_front: File | null;
    id_document_back: File | null;
    // Immigration (optional)
    immigration_status: string;
    visa_type: string;
    visa_expiry_date: string;
    // Financial
    employment_status: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'retired' | 'other' | '';
    employment_status_other: string;
    employer_name: string;
    job_title: string;
    employment_type: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'zero_hours' | '';
    employment_start_date: string;
    net_monthly_income: string;
    income_currency: string;
    employment_contract: File | null;
    payslips: File[];
    // Student specific
    university_name: string;
    enrollment_proof: File | null;
    student_income_source: string;
    student_monthly_income: string;
    // Unemployed/retired specific
    income_source: string;
    income_proof: File | null;
    // Address (matching AddressForm component)
    street_name: string;
    house_number: string;
    address_line_2: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
}

// Guarantor per PLAN.md - full identity, address, financial, consent
export interface GuarantorDetails {
    for_signer_type: 'primary' | 'co_signer';
    for_co_signer_index: number | null;
    // Identity
    first_name: string;
    last_name: string;
    email: string;
    phone_country_code: string;
    phone_number: string;
    date_of_birth: string;
    nationality: string;
    relationship: string;
    relationship_other: string;
    // ID Document
    id_document_type: 'passport' | 'national_id' | 'drivers_license' | '';
    id_number: string;
    id_issuing_country: string;
    id_expiry_date: string;
    id_document_front: File | null;
    id_document_back: File | null;
    // Address (matching AddressForm component)
    street_name: string;
    house_number: string;
    address_line_2: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
    years_at_address: string;
    proof_of_residence: File | null;
    // Financial (same options as tenant)
    employment_status: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'retired' | 'other' | '';
    employer_name: string;
    job_title: string;
    net_monthly_income: string;
    income_currency: string;
    proof_of_income: File | null;
    credit_report: File | null;
    // Consent & Legal
    consent_to_credit_check: boolean;
    consent_to_contact: boolean;
    guarantee_consent_signed: boolean;
}

export interface ApplicationWizardData {
    // ===== Step 1: Identity & Legal Eligibility =====
    // Personal Details
    profile_date_of_birth: string;
    profile_middle_name: string;
    profile_nationality: string;
    profile_phone_country_code: string;
    profile_phone_number: string;
    // ID Document
    profile_id_document_type: 'passport' | 'national_id' | 'drivers_license' | 'residence_permit' | '';
    profile_id_number: string;
    profile_id_issuing_country: string;
    profile_id_expiry_date: string;
    profile_id_document_front: File | null;
    profile_id_document_back: File | null;
    // Immigration Status (Optional)
    profile_immigration_status: 'citizen' | 'permanent_resident' | 'visa_holder' | 'refugee' | 'asylum_seeker' | 'other' | '';
    profile_immigration_status_other: string;
    profile_visa_type: string;
    profile_visa_type_other: string;
    profile_visa_expiry_date: string;
    profile_work_permit_number: string;
    // Regional Enhancements (Optional)
    profile_right_to_rent_document: File | null;
    profile_right_to_rent_share_code: string;

    // ===== Step 2: Household Composition =====
    // Rental Intent
    desired_move_in_date: string;
    lease_duration_months: number;
    is_flexible_on_move_in: boolean;
    is_flexible_on_duration: boolean;
    // Occupants
    additional_occupants: number;
    occupants_details: OccupantDetails[];
    // Pets
    pets_details: PetDetails[];
    // Emergency Contact (optional, suggested for US/AU)
    emergency_contact_first_name: string;
    emergency_contact_last_name: string;
    emergency_contact_relationship: string;
    emergency_contact_relationship_other: string;
    emergency_contact_phone_country_code: string;
    emergency_contact_phone_number: string;
    emergency_contact_email: string;

    // ===== Step 3: Financial Capability (Tenant) =====
    profile_employment_status: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'retired' | 'other' | '';
    profile_employment_status_other: string;
    // If employed
    profile_employer_name: string;
    profile_employer_address: string;
    profile_employer_phone: string;
    profile_job_title: string;
    profile_employment_type: 'full_time' | 'part_time' | 'zero_hours' | '';
    profile_employment_contract_type: 'permanent' | 'fixed_term' | 'freelance' | 'casual' | '';
    profile_employment_start_date: string;
    profile_employment_end_date: string;
    profile_probation_end_date: string;
    profile_net_monthly_income: string;
    profile_gross_annual_income: string;
    profile_income_currency: string;
    profile_pay_frequency: 'weekly' | 'fortnightly' | 'monthly' | 'annually' | '';
    profile_employment_contract: File | null;
    profile_payslip_1: File | null;
    profile_payslip_2: File | null;
    profile_payslip_3: File | null;
    profile_bank_statements: File[];
    // If self_employed
    profile_business_name: string;
    profile_business_type: string;
    profile_business_registration_number: string;
    profile_business_start_date: string;
    profile_gross_annual_revenue: string;
    profile_tax_returns: File[];
    profile_business_bank_statements: File[];
    profile_accountant_reference: File | null;
    // If student
    profile_university_name: string;
    profile_program_of_study: string;
    profile_expected_graduation_date: string;
    profile_student_id_number: string;
    profile_enrollment_proof: File | null;
    profile_student_income_source: 'loan' | 'grant' | 'parental_support' | 'part_time_work' | 'savings' | 'other' | '';
    profile_student_income_source_type: 'scholarship' | 'stipend' | 'part_time_job' | 'parental_support' | 'student_loan' | 'savings' | 'other' | '';
    profile_student_income_source_other: string;
    profile_student_monthly_income: string;
    // If retired
    profile_pension_monthly_income: string;
    profile_pension_provider: string;
    profile_pension_type: 'state_pension' | 'employer_pension' | 'private_pension' | 'annuity' | 'other' | '';
    profile_retirement_other_income: string;
    profile_pension_statement: File | null;
    // If unemployed
    profile_receiving_unemployment_benefits: boolean;
    profile_unemployment_benefits_amount: string;
    profile_unemployed_income_source:
        | 'unemployment_benefits'
        | 'severance_pay'
        | 'savings'
        | 'family_support'
        | 'rental_income'
        | 'investment_income'
        | 'alimony'
        | 'social_assistance'
        | 'disability_allowance'
        | 'freelance_gig'
        | 'other'
        | '';
    profile_unemployed_income_source_other: string;
    profile_benefits_statement: File | null;
    // If other employment situation
    profile_other_employment_situation:
        | 'parental_leave'
        | 'disability'
        | 'sabbatical'
        | 'career_break'
        | 'medical_leave'
        | 'caregiver'
        | 'homemaker'
        | 'volunteer'
        | 'gap_year'
        | 'early_retirement'
        | 'military_service'
        | 'other'
        | '';
    profile_other_employment_situation_details: string;
    profile_expected_return_to_work: string;
    profile_other_situation_monthly_income: string;
    profile_other_situation_income_source: string;
    // Legacy/generic
    profile_income_source: string;
    profile_other_income_proof: File | null;
    // Additional income (all statuses)
    profile_has_additional_income: boolean;
    profile_additional_income_sources: AdditionalIncomeSource[];

    // ===== Step 4: Risk Mitigation =====
    // Co-signers (occupants with will_sign_lease = true)
    co_signers: CoSignerDetails[];
    // Guarantors (linked to signers)
    guarantors: GuarantorDetails[];
    // Rent Guarantee Insurance
    interested_in_rent_insurance: 'yes' | 'no' | 'already_have' | '';
    existing_insurance_provider: string;
    existing_insurance_policy_number: string;

    // ===== Step 5: Credit & Rental History =====
    // Credit Check Authorization (Core)
    authorize_credit_check: boolean;
    credit_check_provider_preference: 'experian' | 'equifax' | 'transunion' | 'illion_au' | 'no_preference' | '';
    // Background & History (Optional - Suggested for US)
    authorize_background_check: boolean;
    has_ccjs_or_bankruptcies: boolean;
    ccj_bankruptcy_details: string;
    has_eviction_history: boolean;
    eviction_details: string;
    self_reported_credit_score: string;
    credit_report_upload: File | null;
    // Current Address (matching AddressForm component structure)
    current_living_situation: 'renting' | 'owner' | 'living_with_family' | 'student_housing' | 'employer_provided' | 'other' | '';
    current_address_street_name: string;
    current_address_house_number: string;
    current_address_address_line_2: string;
    current_address_city: string;
    current_address_state_province: string;
    current_address_postal_code: string;
    current_address_country: string;
    current_address_move_in_date: string;
    current_monthly_rent: string;
    current_rent_currency: string;
    current_landlord_name: string;
    current_landlord_contact: string;
    reason_for_moving:
        | 'relocation_work'
        | 'relocation_personal'
        | 'upsizing'
        | 'downsizing'
        | 'end_of_lease'
        | 'buying_property'
        | 'relationship_change'
        | 'closer_to_family'
        | 'better_location'
        | 'cost'
        | 'first_time_renter'
        | 'other'
        | '';
    reason_for_moving_other: string;
    // Previous Addresses (Last 3 years)
    previous_addresses: PreviousAddressDetails[];
    // Landlord References
    landlord_references: LandlordReferenceDetails[];
    // Employer Reference
    employer_reference_name: string;
    employer_reference_email: string;
    employer_reference_phone: string;
    employer_reference_job_title: string;
    consent_to_contact_employer: boolean;
    // Other References
    other_references: OtherReferenceDetails[];

    // ===== Step 6: Additional Information & Documents =====
    additional_information: string;
    additional_documents: { file: File; description: string }[];

    // ===== Step 7: Declarations & Consent =====
    declaration_accuracy: boolean;
    consent_screening: boolean;
    consent_data_processing: boolean;
    consent_reference_contact: boolean;
    consent_data_sharing: boolean;
    consent_marketing: boolean;
    digital_signature: string;
    signature_date: string;
    signature_ip_address: string;

    // ===== Token =====
    invited_via_token: string;

    // ===== Legacy fields (kept for backwards compatibility) =====
    profile_has_guarantor: boolean;
    profile_monthly_income: string;
    profile_student_proof: File | null;
    profile_current_house_number: string;
    profile_current_address_line_2: string;
    profile_current_street_name: string;
    profile_current_city: string;
    profile_current_state_province: string;
    profile_current_postal_code: string;
    profile_current_country: string;
    message_to_landlord: string;
    references: ReferenceDetails[];
    emergency_contact_name: string;
    emergency_contact_phone: string;
    previous_landlord_name: string;
    previous_landlord_phone: string;
    previous_landlord_email: string;
    // Legacy guarantor fields (now in guarantors array)
    profile_guarantor_first_name: string;
    profile_guarantor_last_name: string;
    profile_guarantor_relationship: string;
    profile_guarantor_relationship_other: string;
    profile_guarantor_phone_country_code: string;
    profile_guarantor_phone_number: string;
    profile_guarantor_email: string;
    profile_guarantor_street_name: string;
    profile_guarantor_house_number: string;
    profile_guarantor_address_line_2: string;
    profile_guarantor_city: string;
    profile_guarantor_state_province: string;
    profile_guarantor_postal_code: string;
    profile_guarantor_country: string;
    profile_guarantor_employment_status: string;
    profile_guarantor_employer_name: string;
    profile_guarantor_job_title: string;
    profile_guarantor_employment_type: string;
    profile_guarantor_employment_start_date: string;
    profile_guarantor_monthly_income: string;
    profile_guarantor_income_currency: string;
    profile_guarantor_university_name: string;
    profile_guarantor_program_of_study: string;
    profile_guarantor_expected_graduation_date: string;
    profile_guarantor_student_income_source: string;
    profile_guarantor_id_front: File | null;
    profile_guarantor_id_back: File | null;
    profile_guarantor_proof_income: File | null;
    profile_guarantor_employment_contract: File | null;
    profile_guarantor_payslip_1: File | null;
    profile_guarantor_payslip_2: File | null;
    profile_guarantor_payslip_3: File | null;
    profile_guarantor_student_proof: File | null;
    profile_guarantor_other_income_proof: File | null;
    // Old consent fields (replaced by new structure)
    consent_accurate_info: boolean;
    consent_background_check: boolean;
    consent_terms: boolean;
    signature_full_name: string;
    // Old additional step fields
    additional_bank_statements: File[] | null;
    additional_tax_returns: File[] | null;
    additional_other_documents: File[] | null;
    additional_notes: string;
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
    is_flexible_on_move_in: boolean;
    is_flexible_on_duration: boolean;
    message_to_landlord: string;
    additional_occupants: number;
    occupants_details: OccupantDetails[];
    pets_details: PetDetails[];
    previous_landlord_name: string;
    previous_landlord_phone: string;
    previous_landlord_email: string;
    // Emergency contact (application-specific)
    emergency_contact_first_name: string;
    emergency_contact_last_name: string;
    emergency_contact_relationship: string;
    emergency_contact_relationship_other: string;
    emergency_contact_phone_country_code: string;
    emergency_contact_phone_number: string;
    emergency_contact_email: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tp = tenantProfile as any; // Cast to any for accessing new fields not yet in TenantProfile type

    return {
        // ===== Step 1: Identity & Legal Eligibility =====
        profile_date_of_birth: formatDateForInput(tenantProfile?.date_of_birth),
        profile_middle_name: tp?.middle_name || '',
        profile_nationality: tenantProfile?.nationality || '',
        profile_phone_country_code: tenantProfile?.phone_country_code || '+31',
        profile_phone_number: tenantProfile?.phone_number || '',
        // ID Document
        profile_id_document_type: tp?.id_document_type || '',
        profile_id_number: tp?.id_number || '',
        profile_id_issuing_country: tp?.id_issuing_country || '',
        profile_id_expiry_date: formatDateForInput(tp?.id_expiry_date),
        profile_id_document_front: null,
        profile_id_document_back: null,
        // Immigration Status
        profile_immigration_status: tp?.immigration_status || '',
        profile_immigration_status_other: tp?.immigration_status_other || '',
        profile_visa_type: tp?.visa_type || '',
        profile_visa_type_other: tp?.visa_type_other || '',
        profile_visa_expiry_date: formatDateForInput(tp?.visa_expiry_date),
        profile_work_permit_number: tp?.work_permit_number || '',
        // Regional Enhancements
        profile_right_to_rent_document: null,
        profile_right_to_rent_share_code: tp?.right_to_rent_share_code || '',

        // ===== Step 2: Household Composition =====
        // Rental Intent
        desired_move_in_date: draft?.desired_move_in_date ? formatDateForInput(draft.desired_move_in_date) : '',
        lease_duration_months: draft?.lease_duration_months || 12,
        is_flexible_on_move_in: draft?.is_flexible_on_move_in || false,
        is_flexible_on_duration: draft?.is_flexible_on_duration || false,
        // Occupants
        additional_occupants: draft?.additional_occupants || 0,
        occupants_details: draft?.occupants_details || [],
        // Pets
        pets_details: draft?.pets_details || [],
        // Emergency Contact (application-specific, loaded from draft)
        emergency_contact_first_name: draft?.emergency_contact_first_name || '',
        emergency_contact_last_name: draft?.emergency_contact_last_name || '',
        emergency_contact_relationship: draft?.emergency_contact_relationship || '',
        emergency_contact_relationship_other: draft?.emergency_contact_relationship_other || '',
        emergency_contact_phone_country_code: draft?.emergency_contact_phone_country_code || '+31',
        emergency_contact_phone_number: draft?.emergency_contact_phone_number || '',
        emergency_contact_email: draft?.emergency_contact_email || '',

        // ===== Step 3: Financial Capability =====
        profile_employment_status: tenantProfile?.employment_status || 'employed',
        profile_employment_status_other: '',
        // Employed fields
        profile_employer_name: tenantProfile?.employer_name || '',
        profile_employer_address: tp?.employer_address || '',
        profile_employer_phone: tp?.employer_phone || '',
        profile_job_title: tenantProfile?.job_title || '',
        profile_employment_type: (tenantProfile?.employment_type as ApplicationWizardData['profile_employment_type']) || '',
        profile_employment_contract_type: tp?.employment_contract_type || '',
        profile_employment_start_date: formatDateForInput(tenantProfile?.employment_start_date),
        profile_employment_end_date: formatDateForInput(tp?.employment_end_date),
        profile_probation_end_date: formatDateForInput(tp?.probation_end_date),
        profile_net_monthly_income: tp?.net_monthly_income?.toString() || tenantProfile?.monthly_income?.toString() || '',
        profile_gross_annual_income: tp?.gross_annual_income?.toString() || '',
        profile_income_currency: tenantProfile?.income_currency || 'eur',
        profile_pay_frequency: tp?.pay_frequency || '',
        profile_employment_contract: null,
        profile_payslip_1: null,
        profile_payslip_2: null,
        profile_payslip_3: null,
        profile_bank_statements: [],
        // Self-employed fields
        profile_business_name: tp?.business_name || '',
        profile_business_type: tp?.business_type || '',
        profile_business_registration_number: tp?.business_registration_number || '',
        profile_business_start_date: formatDateForInput(tp?.business_start_date),
        profile_gross_annual_revenue: tp?.gross_annual_revenue?.toString() || '',
        profile_tax_returns: [],
        profile_business_bank_statements: [],
        profile_accountant_reference: null,
        // Student fields
        profile_university_name: tenantProfile?.university_name || '',
        profile_program_of_study: tenantProfile?.program_of_study || '',
        profile_expected_graduation_date: formatDateForInput(tenantProfile?.expected_graduation_date),
        profile_student_id_number: tp?.student_id_number || '',
        profile_enrollment_proof: null,
        profile_student_income_source: (tenantProfile?.student_income_source as ApplicationWizardData['profile_student_income_source']) || '',
        profile_student_income_source_type: tp?.student_income_source_type || '',
        profile_student_income_source_other: tp?.student_income_source_other || '',
        profile_student_monthly_income: tp?.student_monthly_income?.toString() || '',
        // Retired fields
        profile_pension_monthly_income: tp?.pension_monthly_income?.toString() || '',
        profile_pension_provider: tp?.pension_provider || '',
        profile_pension_type: tp?.pension_type || '',
        profile_retirement_other_income: tp?.retirement_other_income?.toString() || '',
        profile_pension_statement: null,
        // Unemployed fields
        profile_receiving_unemployment_benefits: tp?.receiving_unemployment_benefits || false,
        profile_unemployment_benefits_amount: tp?.unemployment_benefits_amount?.toString() || '',
        profile_unemployed_income_source: tp?.unemployed_income_source || '',
        profile_unemployed_income_source_other: tp?.unemployed_income_source_other || '',
        profile_benefits_statement: null,
        // Other employment situation fields
        profile_other_employment_situation: tp?.other_employment_situation || '',
        profile_other_employment_situation_details: tp?.other_employment_situation_details || '',
        profile_expected_return_to_work: formatDateForInput(tp?.expected_return_to_work),
        profile_other_situation_monthly_income: tp?.other_situation_monthly_income?.toString() || '',
        profile_other_situation_income_source: tp?.other_situation_income_source || '',
        // Legacy/generic
        profile_income_source: tp?.income_source || '',
        profile_other_income_proof: null,
        // Additional income
        profile_has_additional_income: tp?.has_additional_income || false,
        profile_additional_income_sources: tp?.additional_income_sources || [],

        // ===== Step 4: Risk Mitigation =====
        co_signers: [],
        guarantors: [],
        interested_in_rent_insurance: '',
        existing_insurance_provider: '',
        existing_insurance_policy_number: '',

        // ===== Step 5: Credit & Rental History =====
        // Credit Check
        authorize_credit_check: false,
        credit_check_provider_preference: '',
        authorize_background_check: false,
        has_ccjs_or_bankruptcies: false,
        ccj_bankruptcy_details: '',
        has_eviction_history: false,
        eviction_details: '',
        self_reported_credit_score: '',
        credit_report_upload: null,
        // Current Address (matching AddressForm component)
        current_living_situation: '',
        current_address_street_name: tenantProfile?.current_street_name || '',
        current_address_house_number: tenantProfile?.current_house_number || '',
        current_address_address_line_2: tenantProfile?.current_address_line_2 || '',
        current_address_city: tenantProfile?.current_city || '',
        current_address_state_province: tenantProfile?.current_state_province || '',
        current_address_postal_code: tenantProfile?.current_postal_code || '',
        current_address_country: tenantProfile?.current_country || '',
        current_address_move_in_date: '',
        current_monthly_rent: '',
        current_rent_currency: 'eur',
        current_landlord_name: '',
        current_landlord_contact: '',
        reason_for_moving: '',
        reason_for_moving_other: '',
        // Previous Addresses
        previous_addresses: [],
        // References
        landlord_references: [],
        employer_reference_name: '',
        employer_reference_email: '',
        employer_reference_phone: '',
        employer_reference_job_title: '',
        consent_to_contact_employer: false,
        other_references: [],

        // ===== Step 6: Additional Information =====
        additional_information: '',
        additional_documents: [],

        // ===== Step 7: Declarations & Consent =====
        declaration_accuracy: false,
        consent_screening: false,
        consent_data_processing: false,
        consent_reference_contact: false,
        consent_data_sharing: false,
        consent_marketing: false,
        digital_signature: '',
        signature_date: '',
        signature_ip_address: '',

        // ===== Token =====
        invited_via_token: token || '',

        // ===== Legacy fields (backwards compatibility) =====
        profile_has_guarantor: tenantProfile?.has_guarantor ?? false,
        profile_monthly_income: tenantProfile?.monthly_income?.toString() || '',
        profile_student_proof: null,
        profile_current_house_number: tenantProfile?.current_house_number || '',
        profile_current_address_line_2: tenantProfile?.current_address_line_2 || '',
        profile_current_street_name: tenantProfile?.current_street_name || '',
        profile_current_city: tenantProfile?.current_city || '',
        profile_current_state_province: tenantProfile?.current_state_province || '',
        profile_current_postal_code: tenantProfile?.current_postal_code || '',
        profile_current_country: tenantProfile?.current_country || '',
        message_to_landlord: draft?.message_to_landlord || '',
        references: draft?.references || [],
        emergency_contact_name: tenantProfile?.emergency_contact_name || '',
        emergency_contact_phone: tenantProfile?.emergency_contact_phone || '',
        previous_landlord_name: draft?.previous_landlord_name || '',
        previous_landlord_phone: draft?.previous_landlord_phone || '',
        previous_landlord_email: draft?.previous_landlord_email || '',
        // Legacy guarantor fields
        profile_guarantor_first_name: tenantProfile?.guarantor_first_name || '',
        profile_guarantor_last_name: tenantProfile?.guarantor_last_name || '',
        profile_guarantor_relationship: tenantProfile?.guarantor_relationship || '',
        profile_guarantor_relationship_other: tenantProfile?.guarantor_relationship_other || '',
        profile_guarantor_phone_country_code: tenantProfile?.guarantor_phone_country_code || '+31',
        profile_guarantor_phone_number: tenantProfile?.guarantor_phone_number || '',
        profile_guarantor_email: tenantProfile?.guarantor_email || '',
        profile_guarantor_street_name: tenantProfile?.guarantor_street_name || '',
        profile_guarantor_house_number: tenantProfile?.guarantor_house_number || '',
        profile_guarantor_address_line_2: tenantProfile?.guarantor_address_line_2 || '',
        profile_guarantor_city: tenantProfile?.guarantor_city || '',
        profile_guarantor_state_province: tenantProfile?.guarantor_state_province || '',
        profile_guarantor_postal_code: tenantProfile?.guarantor_postal_code || '',
        profile_guarantor_country: tenantProfile?.guarantor_country || '',
        profile_guarantor_employment_status: tenantProfile?.guarantor_employment_status || '',
        profile_guarantor_employer_name: tenantProfile?.guarantor_employer_name || '',
        profile_guarantor_job_title: tenantProfile?.guarantor_job_title || '',
        profile_guarantor_employment_type: tenantProfile?.guarantor_employment_type || '',
        profile_guarantor_employment_start_date: formatDateForInput(tenantProfile?.guarantor_employment_start_date),
        profile_guarantor_monthly_income: tenantProfile?.guarantor_monthly_income?.toString() || '',
        profile_guarantor_income_currency: tenantProfile?.guarantor_income_currency || 'eur',
        profile_guarantor_university_name: tenantProfile?.guarantor_university_name || '',
        profile_guarantor_program_of_study: tenantProfile?.guarantor_program_of_study || '',
        profile_guarantor_expected_graduation_date: formatDateForInput(tenantProfile?.guarantor_expected_graduation_date),
        profile_guarantor_student_income_source: tenantProfile?.guarantor_student_income_source || '',
        profile_guarantor_id_front: null,
        profile_guarantor_id_back: null,
        profile_guarantor_proof_income: null,
        profile_guarantor_employment_contract: null,
        profile_guarantor_payslip_1: null,
        profile_guarantor_payslip_2: null,
        profile_guarantor_payslip_3: null,
        profile_guarantor_student_proof: null,
        profile_guarantor_other_income_proof: null,
        // Old consent/additional fields
        consent_accurate_info: false,
        consent_background_check: false,
        consent_terms: false,
        signature_full_name: '',
        additional_bank_statements: null,
        additional_tax_returns: null,
        additional_other_documents: null,
        additional_notes: '',
    };
}

// ===== Hook Options =====

export interface UseApplicationWizardOptions {
    propertyId: number;
    tenantProfile?: TenantProfile;
    draftApplication?: DraftApplication | null;
    token?: string | null;
    onDraftUpdated?: (draft: DraftApplication) => void;
    steps?: WizardStepConfig<ApplicationStep>[];
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
    updateOccupant: (index: number, field: keyof OccupantDetails, value: string | boolean) => void;

    // Pets helpers
    addPet: () => void;
    removePet: (index: number) => void;
    updatePet: (index: number, field: keyof PetDetails, value: string | boolean | File | null) => void;

    // References helpers (legacy)
    addReference: (type?: 'landlord' | 'personal' | 'professional') => void;
    removeReference: (index: number) => void;
    updateReference: (index: number, field: keyof ReferenceDetails, value: string) => void;

    // Co-signer helpers
    addCoSigner: () => void;
    removeCoSigner: (index: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateCoSigner: (index: number, field: keyof CoSignerDetails, value: any) => void;
    syncCoSignersFromOccupants: () => void;

    // Guarantor helpers
    addGuarantor: (forSignerType?: 'primary' | 'co_signer', forCoSignerIndex?: number | null) => void;
    removeGuarantor: (index: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateGuarantor: (index: number, field: keyof GuarantorDetails, value: any) => void;

    // Previous addresses helpers
    addPreviousAddress: () => void;
    removePreviousAddress: (index: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePreviousAddress: (index: number, field: keyof PreviousAddressDetails, value: any) => void;

    // Landlord references helpers
    addLandlordReference: () => void;
    removeLandlordReference: (index: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateLandlordReference: (index: number, field: keyof LandlordReferenceDetails, value: any) => void;

    // Other references helpers
    addOtherReference: () => void;
    removeOtherReference: (index: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOtherReference: (index: number, field: keyof OtherReferenceDetails, value: any) => void;

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
    createIndexedBlurHandler: (prefix: string, index: number, field: string) => () => void;

    // Autosave
    autosaveStatus: AutosaveStatus;
    lastSavedAt: Date | null;
    saveNow: (stepOverride?: number) => Promise<void>;
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
    steps: providedSteps,
}: UseApplicationWizardOptions): UseApplicationWizardReturn {
    // Use provided steps or fall back to default (untranslated)
    const steps = providedSteps ?? APPLICATION_STEPS;
    // Application-specific state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [pendingSave, setPendingSave] = useState(false);

    // Calculate initial step from draft's current_step
    const initialStepIndex = draftApplication?.current_step ? Math.min(draftApplication.current_step - 1, steps.length - 1) : 0;
    const initialMaxStepReached = draftApplication?.current_step ? draftApplication.current_step - 1 : 0;

    // Build existing documents context from tenant profile
    const existingDocsContext: ExistingDocumentsContext = {
        // Main tenant documents
        id_document_front: !!tenantProfile?.id_document_front_path,
        id_document_back: !!tenantProfile?.id_document_back_path,
        residence_permit_document: !!tenantProfile?.residence_permit_document_path,
        right_to_rent_document: !!tenantProfile?.right_to_rent_document_path,
        employment_contract: !!tenantProfile?.employment_contract_path,
        payslip_1: !!tenantProfile?.payslip_1_path,
        payslip_2: !!tenantProfile?.payslip_2_path,
        payslip_3: !!tenantProfile?.payslip_3_path,
        student_proof: !!tenantProfile?.student_proof_path,
        other_income_proof: !!tenantProfile?.other_income_proof_path,
        // Guarantor documents
        guarantor_id_front: !!tenantProfile?.guarantor_id_front_path,
        guarantor_id_back: !!tenantProfile?.guarantor_id_back_path,
        guarantor_proof_income: !!tenantProfile?.guarantor_proof_income_path,
        guarantor_employment_contract: !!tenantProfile?.guarantor_employment_contract_path,
        guarantor_payslip_1: !!tenantProfile?.guarantor_payslip_1_path,
        guarantor_payslip_2: !!tenantProfile?.guarantor_payslip_2_path,
        guarantor_payslip_3: !!tenantProfile?.guarantor_payslip_3_path,
        guarantor_student_proof: !!tenantProfile?.guarantor_student_proof_path,
        guarantor_other_income_proof: !!tenantProfile?.guarantor_other_income_proof_path,
    };

    // Validation wrapper - passes existing docs context for employment step
    // This is the SINGLE SOURCE OF TRUTH for validation - used by both:
    // 1. goToNextStep() - validates current step when clicking Continue
    // 2. computeFirstInvalidStep() - validates all steps on mount/data change
    // This ensures NO validation discrepancy between clicking Continue and refreshing the page
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
        steps,
        initialData: getInitialData(draftApplication, tenantProfile, token),
        initialStepIndex: Math.max(0, initialStepIndex),
        initialMaxStepReached: Math.max(0, initialMaxStepReached),
        validateStep: validateStepWrapper,
        onSave: handleSave,
        enableAutosave: true,
        saveDebounceMs: 500,
    });

    // Profile autosave hook - saves profile fields immediately to TenantProfile
    const { autosaveField, isProfileField } = useProfileAutosave();

    // ===== Occupant Helpers =====
    const addOccupant = useCallback(() => {
        const updated: OccupantDetails[] = [
            ...wizard.data.occupants_details,
            {
                first_name: '',
                last_name: '',
                date_of_birth: '',
                relationship: '',
                relationship_other: '',
                will_sign_lease: false,
                is_dependent: false,
            },
        ];
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
        (index: number, field: keyof OccupantDetails, value: string | boolean) => {
            const updated = [...wizard.data.occupants_details];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('occupants_details', updated);
            // Don't mark as touched here - that happens on blur via handleOccupantFieldBlur
        },
        [wizard],
    );

    // ===== Pet Helpers =====
    const addPet = useCallback(() => {
        const newPet: PetDetails = {
            type: '',
            type_other: '',
            breed: '',
            name: '',
            age: '',
            size: '',
            is_registered_assistance_animal: false,
            assistance_animal_documentation: null,
        };
        wizard.updateField('pets_details', [...wizard.data.pets_details, newPet]);
    }, [wizard]);

    const removePet = useCallback(
        (index: number) => {
            wizard.updateField(
                'pets_details',
                wizard.data.pets_details.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updatePet = useCallback(
        (index: number, field: keyof PetDetails, value: string | boolean | File | null) => {
            const updated = [...wizard.data.pets_details];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updated[index] = { ...updated[index], [field]: value as any };
            wizard.updateField('pets_details', updated);
            // Don't mark as touched here - that happens on blur via handlePetFieldBlur
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
            // Don't mark as touched here - that happens on blur
        },
        [wizard],
    );

    // ===== Co-Signer Helpers =====
    const addCoSigner = useCallback(() => {
        const newCoSigner: CoSignerDetails = {
            occupant_index: -1,
            from_occupant_index: null, // Manually added co-signer
            // Identity
            first_name: '',
            last_name: '',
            email: '',
            phone_country_code: '+31',
            phone_number: '',
            date_of_birth: '',
            nationality: '',
            relationship: '',
            relationship_other: '',
            // ID Document
            id_document_type: '',
            id_number: '',
            id_issuing_country: '',
            id_expiry_date: '',
            id_document_front: null,
            id_document_back: null,
            // Immigration
            immigration_status: '',
            visa_type: '',
            visa_expiry_date: '',
            // Financial
            employment_status: '',
            employment_status_other: '',
            employer_name: '',
            job_title: '',
            employment_type: '',
            employment_start_date: '',
            net_monthly_income: '',
            income_currency: 'eur',
            employment_contract: null,
            payslips: [],
            // Student
            university_name: '',
            enrollment_proof: null,
            student_income_source: '',
            student_monthly_income: '',
            // Other
            income_source: '',
            income_proof: null,
            // Address (matching AddressForm component)
            street_name: '',
            house_number: '',
            address_line_2: '',
            city: '',
            state_province: '',
            postal_code: '',
            country: '',
        };
        wizard.updateField('co_signers', [...wizard.data.co_signers, newCoSigner]);
    }, [wizard]);

    const removeCoSigner = useCallback(
        (index: number) => {
            const coSigner = wizard.data.co_signers[index];
            // Cannot remove auto-generated co-signers (linked to occupant)
            if (coSigner?.from_occupant_index !== null) {
                console.warn('Cannot remove co-signer linked to occupant');
                return;
            }
            wizard.updateField(
                'co_signers',
                wizard.data.co_signers.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updateCoSigner = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (index: number, field: keyof CoSignerDetails, value: any) => {
            const updated = [...wizard.data.co_signers];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('co_signers', updated);
            // Don't mark as touched here - that happens on blur
        },
        [wizard],
    );

    /**
     * Sync co-signers from occupants marked as "will_sign_lease".
     * - Creates/updates auto-generated co-signers for each will_sign_lease occupant
     * - Preserves manually added co-signers (from_occupant_index === null)
     * - Removes auto-generated co-signers for occupants no longer signing
     */
    const syncCoSignersFromOccupants = useCallback(() => {
        const occupantsDetails = wizard.data.occupants_details;
        const currentCoSigners = wizard.data.co_signers;

        // Keep existing manual co-signers (from_occupant_index === null)
        const manualCoSigners = currentCoSigners.filter((cs) => cs.from_occupant_index === null);

        // Create/update co-signers for each will_sign_lease occupant
        const autoCoSigners: CoSignerDetails[] = [];

        occupantsDetails.forEach((occupant, occupantIndex) => {
            if (!occupant.will_sign_lease) return;

            // Check if we already have a co-signer for this occupant
            const existing = currentCoSigners.find((cs) => cs.from_occupant_index === occupantIndex);

            if (existing) {
                // Update name/relationship if occupant details changed, keep other fields
                autoCoSigners.push({
                    ...existing,
                    first_name: occupant.first_name,
                    last_name: occupant.last_name,
                    date_of_birth: occupant.date_of_birth,
                    relationship: occupant.relationship,
                    relationship_other: occupant.relationship_other,
                });
            } else {
                // Create new co-signer from occupant
                autoCoSigners.push({
                    occupant_index: occupantIndex,
                    from_occupant_index: occupantIndex,
                    // Identity - pre-filled from occupant
                    first_name: occupant.first_name,
                    last_name: occupant.last_name,
                    email: '',
                    phone_country_code: '+31',
                    phone_number: '',
                    date_of_birth: occupant.date_of_birth,
                    nationality: '',
                    relationship: occupant.relationship,
                    relationship_other: occupant.relationship_other,
                    // ID Document
                    id_document_type: '',
                    id_number: '',
                    id_issuing_country: '',
                    id_expiry_date: '',
                    id_document_front: null,
                    id_document_back: null,
                    // Immigration
                    immigration_status: '',
                    visa_type: '',
                    visa_expiry_date: '',
                    // Financial
                    employment_status: '',
                    employment_status_other: '',
                    employer_name: '',
                    job_title: '',
                    employment_type: '',
                    employment_start_date: '',
                    net_monthly_income: '',
                    income_currency: 'eur',
                    employment_contract: null,
                    payslips: [],
                    // Student
                    university_name: '',
                    enrollment_proof: null,
                    student_income_source: '',
                    student_monthly_income: '',
                    // Other
                    income_source: '',
                    income_proof: null,
                    // Address (matching AddressForm component)
                    street_name: '',
                    house_number: '',
                    address_line_2: '',
                    city: '',
                    state_province: '',
                    postal_code: '',
                    country: '',
                });
            }
        });

        // Combine: auto-generated first, then manual
        const newCoSigners = [...autoCoSigners, ...manualCoSigners];

        // Only update if there are changes
        if (JSON.stringify(newCoSigners) !== JSON.stringify(currentCoSigners)) {
            wizard.updateField('co_signers', newCoSigners);
        }
    }, [wizard]);

    // ===== Guarantor Helpers =====
    const addGuarantor = useCallback(
        (forSignerType: 'primary' | 'co_signer' = 'primary', forCoSignerIndex: number | null = null) => {
            const newGuarantor: GuarantorDetails = {
                for_signer_type: forSignerType,
                for_co_signer_index: forCoSignerIndex,
                // Identity
                first_name: '',
                last_name: '',
                email: '',
                phone_country_code: '+31',
                phone_number: '',
                date_of_birth: '',
                nationality: '',
                relationship: '',
                relationship_other: '',
                // ID Document
                id_document_type: '',
                id_number: '',
                id_issuing_country: '',
                id_expiry_date: '',
                id_document_front: null,
                id_document_back: null,
                // Address (matching AddressForm component)
                street_name: '',
                house_number: '',
                address_line_2: '',
                city: '',
                state_province: '',
                postal_code: '',
                country: '',
                years_at_address: '',
                proof_of_residence: null,
                // Financial
                employment_status: '',
                employer_name: '',
                job_title: '',
                net_monthly_income: '',
                income_currency: 'eur',
                proof_of_income: null,
                credit_report: null,
                // Consent
                consent_to_credit_check: false,
                consent_to_contact: false,
                guarantee_consent_signed: false,
            };
            wizard.updateField('guarantors', [...wizard.data.guarantors, newGuarantor]);
        },
        [wizard],
    );

    const removeGuarantor = useCallback(
        (index: number) => {
            wizard.updateField(
                'guarantors',
                wizard.data.guarantors.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updateGuarantor = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (index: number, field: keyof GuarantorDetails, value: any) => {
            const updated = [...wizard.data.guarantors];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('guarantors', updated);
            // Don't mark as touched here - that happens on blur
        },
        [wizard],
    );

    // ===== Previous Address Helpers =====
    const addPreviousAddress = useCallback(() => {
        const newAddress: PreviousAddressDetails = {
            // Address fields (matching AddressForm component)
            street_name: '',
            house_number: '',
            address_line_2: '',
            city: '',
            state_province: '',
            postal_code: '',
            country: '',
            // Date range
            from_date: '',
            to_date: '',
            // Rental info
            living_situation: '',
            monthly_rent: '',
            rent_currency: 'eur',
            landlord_name: '',
            landlord_contact: '',
            can_contact_landlord: true,
        };
        wizard.updateField('previous_addresses', [...wizard.data.previous_addresses, newAddress]);
    }, [wizard]);

    const removePreviousAddress = useCallback(
        (index: number) => {
            wizard.updateField(
                'previous_addresses',
                wizard.data.previous_addresses.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updatePreviousAddress = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (index: number, field: keyof PreviousAddressDetails, value: any) => {
            const updated = [...wizard.data.previous_addresses];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('previous_addresses', updated);
            // Don't mark as touched here - that happens on blur
        },
        [wizard],
    );

    // ===== Landlord Reference Helpers =====
    const addLandlordReference = useCallback(() => {
        const newRef: LandlordReferenceDetails = {
            name: '',
            company: '',
            email: '',
            phone: '',
            property_address: '',
            tenancy_start_date: '',
            tenancy_end_date: '',
            monthly_rent_paid: '',
            consent_to_contact: true,
        };
        wizard.updateField('landlord_references', [...wizard.data.landlord_references, newRef]);
    }, [wizard]);

    const removeLandlordReference = useCallback(
        (index: number) => {
            wizard.updateField(
                'landlord_references',
                wizard.data.landlord_references.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updateLandlordReference = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (index: number, field: keyof LandlordReferenceDetails, value: any) => {
            const updated = [...wizard.data.landlord_references];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('landlord_references', updated);
            // Don't mark as touched here - that happens on blur
        },
        [wizard],
    );

    // ===== Other Reference Helpers =====
    const addOtherReference = useCallback(() => {
        const newRef: OtherReferenceDetails = {
            name: '',
            email: '',
            phone: '',
            relationship: '',
            years_known: '',
            consent_to_contact: true,
        };
        wizard.updateField('other_references', [...wizard.data.other_references, newRef]);
    }, [wizard]);

    const removeOtherReference = useCallback(
        (index: number) => {
            wizard.updateField(
                'other_references',
                wizard.data.other_references.filter((_, i) => i !== index),
            );
        },
        [wizard],
    );

    const updateOtherReference = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (index: number, field: keyof OtherReferenceDetails, value: any) => {
            const updated = [...wizard.data.other_references];
            updated[index] = { ...updated[index], [field]: value };
            wizard.updateField('other_references', updated);
            // Don't mark as touched here - that happens on blur
        },
        [wizard],
    );

    // ===== Touched Fields =====
    const markFieldTouched = useCallback((field: string) => {
        setTouchedFields((prev) => ({ ...prev, [field]: true }));
    }, []);

    /**
     * Creates a blur handler for indexed fields (occupants, pets, references, etc.)
     * Returns a function that marks the specific field as touched when called.
     *
     * Usage in step components:
     *   <input onBlur={createIndexedBlurHandler('occupant', index, 'first_name')} />
     *   <input onBlur={createIndexedBlurHandler('pet', index, 'type')} />
     *   <input onBlur={createIndexedBlurHandler('cosigner', index, 'email')} />
     *
     * The field key format is: `${prefix}_${index}_${field}`
     */
    const createIndexedBlurHandler = useCallback(
        (prefix: string, index: number, field: string) => () => {
            setTouchedFields((prev) => ({ ...prev, [`${prefix}_${index}_${field}`]: true }));
        },
        [],
    );

    const markAllCurrentStepFieldsTouched = useCallback(() => {
        const newTouched: Record<string, boolean> = { ...touchedFields };

        if (wizard.currentStep === 'identity') {
            // Personal details
            newTouched.profile_date_of_birth = true;
            newTouched.profile_nationality = true;
            newTouched.profile_phone_number = true;
            // ID Document
            newTouched.profile_id_document_type = true;
            newTouched.profile_id_number = true;
            newTouched.profile_id_issuing_country = true;
            newTouched.profile_id_expiry_date = true;
            newTouched.profile_id_document_front = true;
            newTouched.profile_id_document_back = true;
            // Immigration (always required now)
            newTouched.profile_immigration_status = true;
            // Statuses that require permit details
            const requiresPermitDetails = [
                'temporary_resident',
                'visa_holder',
                'student',
                'work_permit',
                'family_reunification',
                'refugee_or_protected',
            ].includes(wizard.data.profile_immigration_status || '');
            if (requiresPermitDetails) {
                newTouched.profile_visa_type = true;
                newTouched.profile_visa_expiry_date = true;
                // Residence permit document required for visa_holder
                if (wizard.data.profile_immigration_status === 'visa_holder') {
                    newTouched.profile_residence_permit_document = true;
                }
            }
            if (wizard.data.profile_immigration_status === 'other') {
                newTouched.profile_immigration_status_other = true;
            }
        }

        if (wizard.currentStep === 'financial') {
            newTouched.profile_employment_status = true;
            const status = wizard.data.profile_employment_status;

            // EMPLOYED
            if (status === 'employed') {
                newTouched.profile_employer_name = true;
                newTouched.profile_job_title = true;
                newTouched.profile_employment_type = true;
                newTouched.profile_employment_start_date = true;
                newTouched.profile_gross_annual_income = true;
                newTouched.profile_net_monthly_income = true;
                newTouched.profile_employment_contract = true;
                newTouched.profile_payslip_1 = true;
                newTouched.profile_payslip_2 = true;
                newTouched.profile_payslip_3 = true;
            }

            // SELF-EMPLOYED
            if (status === 'self_employed') {
                newTouched.profile_business_name = true;
                newTouched.profile_business_type = true;
                newTouched.profile_business_start_date = true;
                newTouched.profile_gross_annual_revenue = true;
                newTouched.profile_net_monthly_income = true;
            }

            // STUDENT
            if (status === 'student') {
                newTouched.profile_university_name = true;
                newTouched.profile_program_of_study = true;
                newTouched.profile_student_income_source_type = true;
                newTouched.profile_student_monthly_income = true;
                newTouched.profile_student_proof = true;
                if (wizard.data.profile_student_income_source_type === 'other') {
                    newTouched.profile_student_income_source_other = true;
                }
            }

            // RETIRED
            if (status === 'retired') {
                newTouched.profile_pension_type = true;
                newTouched.profile_pension_monthly_income = true;
                newTouched.profile_pension_statement = true;
            }

            // UNEMPLOYED
            if (status === 'unemployed') {
                newTouched.profile_unemployed_income_source = true;
                newTouched.profile_unemployment_benefits_amount = true;
                if (wizard.data.profile_unemployed_income_source === 'other') {
                    newTouched.profile_unemployed_income_source_other = true;
                }
                if (wizard.data.profile_unemployed_income_source === 'unemployment_benefits') {
                    newTouched.profile_benefits_statement = true;
                } else if (wizard.data.profile_unemployed_income_source) {
                    newTouched.profile_other_income_proof = true;
                }
            }

            // OTHER
            if (status === 'other') {
                newTouched.profile_other_employment_situation = true;
                newTouched.profile_other_situation_monthly_income = true;
                newTouched.profile_other_situation_income_source = true;
                newTouched.profile_other_income_proof = true;
                if (wizard.data.profile_other_employment_situation === 'other') {
                    newTouched.profile_other_employment_situation_details = true;
                }
            }
        }

        if (wizard.currentStep === 'household') {
            // Rental Intent
            newTouched.desired_move_in_date = true;
            newTouched.lease_duration_months = true;

            // Occupants (if any)
            wizard.data.occupants_details.forEach((occupant, index) => {
                newTouched[`occupant_${index}_first_name`] = true;
                newTouched[`occupant_${index}_last_name`] = true;
                newTouched[`occupant_${index}_date_of_birth`] = true;
                newTouched[`occupant_${index}_relationship`] = true;
                if (occupant.relationship === 'other') {
                    newTouched[`occupant_${index}_relationship_other`] = true;
                }
            });

            // Pets (if any)
            wizard.data.pets_details.forEach((pet, index) => {
                newTouched[`pet_${index}_type`] = true;
                if (pet.type === 'other') {
                    newTouched[`pet_${index}_type_other`] = true;
                }
            });

            // Emergency contact: if first name OR last name is filled, mark all as touched
            const hasEmergencyContactName = wizard.data.emergency_contact_first_name?.trim() || wizard.data.emergency_contact_last_name?.trim();

            if (hasEmergencyContactName) {
                newTouched.emergency_contact_first_name = true;
                newTouched.emergency_contact_last_name = true;
                newTouched.emergency_contact_relationship = true;
                newTouched.emergency_contact_phone_number = true;
                // Only mark relationship_other if relationship is 'other'
                if (wizard.data.emergency_contact_relationship === 'other') {
                    newTouched.emergency_contact_relationship_other = true;
                }
            }
        }

        if (wizard.currentStep === 'support') {
            // Insurance
            newTouched.interested_in_rent_insurance = true;
            if (wizard.data.interested_in_rent_insurance === 'already_have') {
                newTouched.existing_insurance_provider = true;
            }

            // Co-signers
            wizard.data.co_signers.forEach((coSigner, index) => {
                // Personal details
                newTouched[`cosigner_${index}_first_name`] = true;
                newTouched[`cosigner_${index}_last_name`] = true;
                newTouched[`cosigner_${index}_email`] = true;
                newTouched[`cosigner_${index}_phone_number`] = true;
                newTouched[`cosigner_${index}_date_of_birth`] = true;
                newTouched[`cosigner_${index}_nationality`] = true;
                newTouched[`cosigner_${index}_relationship`] = true;
                if (coSigner.relationship === 'other') {
                    newTouched[`cosigner_${index}_relationship_other`] = true;
                }

                // ID Document
                newTouched[`cosigner_${index}_id_document_type`] = true;
                newTouched[`cosigner_${index}_id_number`] = true;
                newTouched[`cosigner_${index}_id_issuing_country`] = true;
                newTouched[`cosigner_${index}_id_expiry_date`] = true;

                // Address
                newTouched[`cosigner_${index}_street_name`] = true;
                newTouched[`cosigner_${index}_house_number`] = true;
                newTouched[`cosigner_${index}_city`] = true;
                newTouched[`cosigner_${index}_postal_code`] = true;
                newTouched[`cosigner_${index}_country`] = true;

                // Financial fields based on employment status
                newTouched[`cosigner_${index}_employment_status`] = true;
                const status = coSigner.employment_status;
                if (status === 'employed') {
                    newTouched[`cosigner_${index}_employer_name`] = true;
                    newTouched[`cosigner_${index}_job_title`] = true;
                    newTouched[`cosigner_${index}_employment_type`] = true;
                    newTouched[`cosigner_${index}_employment_start_date`] = true;
                    newTouched[`cosigner_${index}_gross_annual_income`] = true;
                    newTouched[`cosigner_${index}_net_monthly_income`] = true;
                }
                if (status === 'self_employed') {
                    newTouched[`cosigner_${index}_business_name`] = true;
                    newTouched[`cosigner_${index}_business_type`] = true;
                    newTouched[`cosigner_${index}_business_start_date`] = true;
                    newTouched[`cosigner_${index}_gross_annual_revenue`] = true;
                    newTouched[`cosigner_${index}_net_monthly_income`] = true;
                }
                if (status === 'student') {
                    newTouched[`cosigner_${index}_university_name`] = true;
                    newTouched[`cosigner_${index}_program_of_study`] = true;
                    newTouched[`cosigner_${index}_student_income_source_type`] = true;
                    newTouched[`cosigner_${index}_student_monthly_income`] = true;
                }
                if (status === 'retired') {
                    newTouched[`cosigner_${index}_pension_type`] = true;
                    newTouched[`cosigner_${index}_pension_monthly_income`] = true;
                }
                if (status === 'unemployed') {
                    newTouched[`cosigner_${index}_unemployed_income_source`] = true;
                    newTouched[`cosigner_${index}_unemployment_benefits_amount`] = true;
                }
                if (status === 'other') {
                    newTouched[`cosigner_${index}_other_employment_situation`] = true;
                    newTouched[`cosigner_${index}_other_situation_monthly_income`] = true;
                    newTouched[`cosigner_${index}_other_situation_income_source`] = true;
                }
            });

            // Guarantors
            wizard.data.guarantors.forEach((guarantor, index) => {
                // Personal details
                newTouched[`guarantor_${index}_first_name`] = true;
                newTouched[`guarantor_${index}_last_name`] = true;
                newTouched[`guarantor_${index}_email`] = true;
                newTouched[`guarantor_${index}_phone_number`] = true;
                newTouched[`guarantor_${index}_date_of_birth`] = true;
                newTouched[`guarantor_${index}_nationality`] = true;
                newTouched[`guarantor_${index}_relationship`] = true;
                if (guarantor.relationship === 'other') {
                    newTouched[`guarantor_${index}_relationship_other`] = true;
                }

                // ID Document
                newTouched[`guarantor_${index}_id_document_type`] = true;
                newTouched[`guarantor_${index}_id_number`] = true;
                newTouched[`guarantor_${index}_id_issuing_country`] = true;
                newTouched[`guarantor_${index}_id_expiry_date`] = true;

                // Address
                newTouched[`guarantor_${index}_street_name`] = true;
                newTouched[`guarantor_${index}_house_number`] = true;
                newTouched[`guarantor_${index}_city`] = true;
                newTouched[`guarantor_${index}_postal_code`] = true;
                newTouched[`guarantor_${index}_country`] = true;

                // Financial fields based on employment status
                newTouched[`guarantor_${index}_employment_status`] = true;
                const status = guarantor.employment_status;
                if (status === 'employed') {
                    newTouched[`guarantor_${index}_employer_name`] = true;
                    newTouched[`guarantor_${index}_job_title`] = true;
                    newTouched[`guarantor_${index}_net_monthly_income`] = true;
                }
                if (status === 'self_employed') {
                    newTouched[`guarantor_${index}_net_monthly_income`] = true;
                }
                if (status === 'retired') {
                    newTouched[`guarantor_${index}_net_monthly_income`] = true;
                }
                if (status === 'other') {
                    newTouched[`guarantor_${index}_net_monthly_income`] = true;
                }
            });
        }

        if (wizard.currentStep === 'history') {
            // Credit check
            newTouched.authorize_credit_check = true;

            // CCJ/eviction details if applicable
            if (wizard.data.has_ccjs_or_bankruptcies) {
                newTouched.ccj_bankruptcy_details = true;
            }
            if (wizard.data.has_eviction_history) {
                newTouched.eviction_details = true;
            }

            // Current address (required)
            newTouched.current_living_situation = true;
            newTouched.current_address_street_name = true;
            newTouched.current_address_house_number = true;
            newTouched.current_address_city = true;
            newTouched.current_address_postal_code = true;
            newTouched.current_address_country = true;
            newTouched.current_address_move_in_date = true;

            // Reason for moving
            newTouched.reason_for_moving = true;
            if (wizard.data.reason_for_moving === 'other') {
                newTouched.reason_for_moving_other = true;
            }

            // Landlord info if renting
            if (wizard.data.current_living_situation === 'renting') {
                newTouched.current_monthly_rent = true;
            }

            // Previous addresses
            wizard.data.previous_addresses.forEach((_, index) => {
                newTouched[`prevaddr_${index}_street_name`] = true;
                newTouched[`prevaddr_${index}_house_number`] = true;
                newTouched[`prevaddr_${index}_city`] = true;
                newTouched[`prevaddr_${index}_postal_code`] = true;
                newTouched[`prevaddr_${index}_country`] = true;
                newTouched[`prevaddr_${index}_from_date`] = true;
                newTouched[`prevaddr_${index}_to_date`] = true;
            });

            // Landlord references
            wizard.data.landlord_references.forEach((_, index) => {
                newTouched[`landlordref_${index}_name`] = true;
                newTouched[`landlordref_${index}_email`] = true;
                newTouched[`landlordref_${index}_phone`] = true;
            });

            // Other references
            wizard.data.other_references.forEach((_, index) => {
                newTouched[`otherref_${index}_name`] = true;
                newTouched[`otherref_${index}_email`] = true;
                newTouched[`otherref_${index}_phone`] = true;
                newTouched[`otherref_${index}_relationship`] = true;
            });

            // Legacy references
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
            const stepIds: ApplicationStep[] = ['identity', 'household', 'financial', 'support', 'history', 'additional', 'consent'];
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

    // ===== Custom updateField that handles profile autosave =====
    const updateField = useCallback(
        <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => {
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

        // Co-signer helpers
        addCoSigner,
        removeCoSigner,
        updateCoSigner,
        syncCoSignersFromOccupants,

        // Guarantor helpers
        addGuarantor,
        removeGuarantor,
        updateGuarantor,

        // Previous addresses helpers
        addPreviousAddress,
        removePreviousAddress,
        updatePreviousAddress,

        // Landlord references helpers
        addLandlordReference,
        removeLandlordReference,
        updateLandlordReference,

        // Other references helpers
        addOtherReference,
        removeOtherReference,
        updateOtherReference,

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

        // Blur handler factory (for per-field blur pattern)
        // Usage: createIndexedBlurHandler('occupant', index, 'first_name')
        createIndexedBlurHandler,

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
