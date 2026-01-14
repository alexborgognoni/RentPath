<?php

namespace App\Http\Requests;

use App\Rules\ValidCountryCode;
use App\Rules\ValidPhoneNumber;
use App\Rules\ValidPostalCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employmentStatus = $this->input('profile_employment_status');
        $tenantProfile = Auth::user()?->tenantProfile;

        $rules = [
            // =====================================
            // STEP 1: Identity & Legal Eligibility
            // =====================================
            'profile_date_of_birth' => 'required|date|before:-18 years',
            'profile_middle_name' => 'nullable|string|max:100',
            'profile_nationality' => ['required', 'string', 'max:2', new ValidCountryCode],
            'profile_phone_country_code' => 'required|string|max:5',
            'profile_phone_number' => ['required', 'string', 'max:20', new ValidPhoneNumber('profile_phone_country_code')],
            'profile_bio' => 'nullable|string|max:1000',

            // ID Document
            'profile_id_document_type' => 'required|in:passport,national_id,drivers_license',
            'profile_id_number' => 'required|string|max:100',
            'profile_id_issuing_country' => ['required', 'string', 'max:2', new ValidCountryCode],
            'profile_id_expiry_date' => 'required|date|after:today',

            // Immigration (optional)
            'profile_immigration_status' => 'nullable|in:citizen,permanent_resident,visa_holder,refugee,asylum_seeker,other',
            'profile_immigration_status_other' => 'nullable|string|max:100|required_if:profile_immigration_status,other',
            'profile_visa_type' => 'nullable|string|max:100|required_if:profile_immigration_status,visa_holder',
            'profile_visa_expiry_date' => 'nullable|date|after:today|required_if:profile_immigration_status,visa_holder',
            'profile_work_permit_number' => 'nullable|string|max:100',

            // Regional enhancements (optional)
            'profile_right_to_rent_share_code' => 'nullable|string|max:50',
            'profile_identity_verification_method' => 'nullable|in:document_based,points_based',
            'profile_identity_points_documents' => 'nullable|array',
            'profile_identity_points_total' => 'nullable|integer|min:0|max:200',

            // Current address (moved to Step 5 but kept here for backward compatibility)
            'profile_current_house_number' => 'required|string|max:20',
            'profile_current_address_line_2' => 'nullable|string|max:100',
            'profile_current_street_name' => 'required|string|max:255',
            'profile_current_city' => 'required|string|max:100',
            'profile_current_state_province' => 'nullable|string|max:100',
            'profile_current_postal_code' => ['required', 'string', 'max:20', new ValidPostalCode('profile_current_country')],
            'profile_current_country' => ['required', 'string', 'max:2', new ValidCountryCode],

            // =====================================
            // STEP 2: Employment & Income (Conditional)
            // =====================================
            'profile_employment_status' => 'required|in:employed,self_employed,student,unemployed,retired',
            'profile_income_currency' => 'required|in:eur,usd,gbp,chf',

            // Base nullable fields (will be overridden with required for specific statuses)
            'profile_employer_name' => 'nullable|string|max:255',
            'profile_job_title' => 'nullable|string|max:255',
            'profile_employment_type' => 'nullable|in:full_time,part_time,contract,temporary',
            'profile_employment_start_date' => 'nullable|date|before_or_equal:today',
            'profile_monthly_income' => 'nullable|numeric|min:0',
            'profile_university_name' => 'nullable|string|max:255',
            'profile_program_of_study' => 'nullable|string|max:255',
            'profile_expected_graduation_date' => 'nullable|date|after:today',
            'profile_student_income_source' => 'nullable|string|max:255',

            // Document base rules (nullable by default, will be overridden conditionally)
            // Note: With immediate uploads, documents are already in tenant profile
            // These rules handle fallback upload on form submission
            'profile_id_document_front' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_id_document_back' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_employment_contract' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_payslip_1' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_payslip_2' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_payslip_3' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_student_proof' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_other_income_proof' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',

            // =====================================
            // STEP 2: Household Composition
            // =====================================
            'desired_move_in_date' => 'required|date|after:today',
            'lease_duration_months' => 'required|integer|min:1|max:60',
            'is_flexible_on_move_in' => 'nullable|boolean',
            'is_flexible_on_duration' => 'nullable|boolean',
            'additional_occupants' => 'required|integer|min:0|max:20',
            'occupants_details' => 'nullable|array',
            'occupants_details.*.first_name' => 'required|string|max:100',
            'occupants_details.*.last_name' => 'required|string|max:100',
            'occupants_details.*.date_of_birth' => 'required|date',
            'occupants_details.*.relationship' => 'required|string|max:100',
            'occupants_details.*.relationship_other' => 'nullable|string|max:100',
            'occupants_details.*.will_sign_lease' => 'nullable|boolean',
            'occupants_details.*.is_dependent' => 'nullable|boolean',
            'has_pets' => 'required|boolean',
            'pets_details' => 'nullable|array',
            'pets_details.*.type' => 'required|string|max:100',
            'pets_details.*.type_other' => 'nullable|string|max:100',
            'pets_details.*.breed' => 'nullable|string|max:100',
            'pets_details.*.name' => 'nullable|string|max:100',
            'pets_details.*.age_years' => 'nullable|integer|min:0|max:50',
            'pets_details.*.weight_kg' => 'nullable|numeric|min:0',
            'pets_details.*.size' => 'nullable|in:small,medium,large',
            'pets_details.*.is_registered_assistance_animal' => 'nullable|boolean',
            // Emergency contact (optional, suggested for US/AU)
            'emergency_contact_first_name' => 'nullable|string|max:100',
            'emergency_contact_last_name' => 'nullable|string|max:100',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'emergency_contact_phone_country_code' => 'nullable|string|max:10',
            'emergency_contact_phone_number' => 'nullable|string|max:30',
            'emergency_contact_email' => 'nullable|email|max:255',
            'message_to_landlord' => 'nullable|string|max:2000',

            // =====================================
            // STEP 4: Risk Mitigation (Co-signers & Guarantors)
            // =====================================
            'co_signers' => 'nullable|array',
            'co_signers.*.occupant_index' => 'required|integer|min:0',
            'co_signers.*.from_occupant_index' => 'nullable|integer|min:0',
            // Personal details
            'co_signers.*.first_name' => 'required|string|max:100',
            'co_signers.*.last_name' => 'required|string|max:100',
            'co_signers.*.email' => 'required|email|max:255',
            'co_signers.*.phone_country_code' => 'required|string|max:10',
            'co_signers.*.phone_number' => 'required|string|max:30',
            'co_signers.*.date_of_birth' => 'required|date|before:-18 years',
            'co_signers.*.nationality' => 'required|string|max:2',
            'co_signers.*.relationship' => 'required|in:spouse,partner,parent,sibling,child,friend,employer,other',
            'co_signers.*.relationship_other' => 'nullable|string|max:100',
            // ID Document
            'co_signers.*.id_document_type' => 'required|in:passport,national_id,drivers_license',
            'co_signers.*.id_number' => 'required|string|max:100',
            'co_signers.*.id_issuing_country' => 'required|string|max:2',
            'co_signers.*.id_expiry_date' => 'required|date|after:today',
            // Address
            'co_signers.*.street_name' => 'required|string|max:255',
            'co_signers.*.house_number' => 'required|string|max:50',
            'co_signers.*.address_line_2' => 'nullable|string|max:255',
            'co_signers.*.city' => 'required|string|max:100',
            'co_signers.*.state_province' => 'nullable|string|max:100',
            'co_signers.*.postal_code' => 'required|string|max:20',
            'co_signers.*.country' => 'required|string|max:2',
            // Employment & Financial
            'co_signers.*.employment_status' => 'required|in:employed,self_employed,student,unemployed,retired,other',
            'co_signers.*.employer_name' => 'nullable|string|max:200',
            'co_signers.*.job_title' => 'nullable|string|max:100',
            'co_signers.*.employment_type' => 'nullable|in:full_time,part_time,contract,temporary,zero_hours',
            'co_signers.*.employment_start_date' => 'nullable|date|before_or_equal:today',
            'co_signers.*.net_monthly_income' => 'nullable|numeric|min:0',
            'co_signers.*.income_currency' => 'nullable|string|max:3',

            'guarantors' => 'nullable|array',
            'guarantors.*.for_signer_type' => 'required|in:primary,co_signer',
            'guarantors.*.for_co_signer_index' => 'nullable|integer|min:0',
            // Personal details
            'guarantors.*.first_name' => 'required|string|max:100',
            'guarantors.*.last_name' => 'required|string|max:100',
            'guarantors.*.email' => 'required|email|max:255',
            'guarantors.*.phone_country_code' => 'required|string|max:10',
            'guarantors.*.phone_number' => 'required|string|max:30',
            'guarantors.*.date_of_birth' => 'required|date|before:-18 years',
            'guarantors.*.nationality' => 'required|string|max:2',
            'guarantors.*.relationship' => 'required|in:spouse,partner,parent,sibling,child,friend,employer,other',
            'guarantors.*.relationship_other' => 'nullable|string|max:100',
            // ID Document
            'guarantors.*.id_document_type' => 'required|in:passport,national_id,drivers_license',
            'guarantors.*.id_number' => 'required|string|max:100',
            'guarantors.*.id_issuing_country' => 'required|string|max:2',
            'guarantors.*.id_expiry_date' => 'required|date|after:today',
            // Address
            'guarantors.*.street_name' => 'required|string|max:255',
            'guarantors.*.house_number' => 'required|string|max:50',
            'guarantors.*.address_line_2' => 'nullable|string|max:255',
            'guarantors.*.city' => 'required|string|max:100',
            'guarantors.*.state_province' => 'nullable|string|max:100',
            'guarantors.*.postal_code' => 'required|string|max:20',
            'guarantors.*.country' => 'required|string|max:2',
            // Employment & Financial
            'guarantors.*.employment_status' => 'required|in:employed,self_employed,student,unemployed,retired,other',
            'guarantors.*.employer_name' => 'nullable|string|max:200',
            'guarantors.*.job_title' => 'nullable|string|max:100',
            'guarantors.*.net_monthly_income' => 'required|numeric|min:0',
            'guarantors.*.income_currency' => 'required|string|max:3',
            // Consent
            'guarantors.*.consent_to_credit_check' => 'required|boolean|accepted',
            'guarantors.*.consent_to_contact' => 'required|boolean|accepted',
            'guarantors.*.guarantee_consent_signed' => 'required|boolean|accepted',

            // Rent guarantee insurance
            'interested_in_rent_insurance' => 'nullable|in:yes,no,already_have',
            'existing_insurance_provider' => 'nullable|string|max:200',
            'existing_insurance_policy_number' => 'nullable|string|max:100',

            // =====================================
            // STEP 5: Credit & Rental History
            // =====================================
            'authorize_credit_check' => 'required|boolean|accepted',
            'authorize_background_check' => 'nullable|boolean',
            'credit_check_provider_preference' => 'nullable|in:experian,equifax,transunion,illion_au,no_preference',
            'has_ccjs_or_bankruptcies' => 'nullable|boolean',
            'ccj_bankruptcy_details' => 'nullable|string|max:2000|required_if:has_ccjs_or_bankruptcies,true',
            'has_eviction_history' => 'nullable|boolean',
            'eviction_details' => 'nullable|string|max:2000|required_if:has_eviction_history,true',
            'self_reported_credit_score' => 'nullable|integer|min:300|max:850',

            // Current address (required - matching AddressForm structure)
            'current_living_situation' => 'required|in:renting,owner,living_with_family,student_housing,employer_provided,other',
            'current_address_street_name' => 'required|string|max:255',
            'current_address_house_number' => 'required|string|max:20',
            'current_address_address_line_2' => 'nullable|string|max:100',
            'current_address_city' => 'required|string|max:100',
            'current_address_state_province' => 'nullable|string|max:100',
            'current_address_postal_code' => 'required|string|max:20',
            'current_address_country' => 'required|string|max:2',
            'current_address_move_in_date' => 'required|date|before_or_equal:today',
            'current_monthly_rent' => 'nullable|numeric|min:0|required_if:current_living_situation,renting',
            'current_rent_currency' => 'nullable|string|max:3',
            'current_landlord_name' => 'nullable|string|max:200',
            'current_landlord_contact' => 'nullable|string|max:200',
            'reason_for_moving' => 'required|in:relocation_work,relocation_personal,upsizing,downsizing,end_of_lease,buying_property,relationship_change,closer_to_family,better_location,cost,first_time_renter,other',
            'reason_for_moving_other' => 'nullable|string|max:200|required_if:reason_for_moving,other',

            // Previous addresses (matching AddressForm structure)
            'previous_addresses' => 'nullable|array|max:5',
            'previous_addresses.*.street_name' => 'required|string|max:255',
            'previous_addresses.*.house_number' => 'required|string|max:20',
            'previous_addresses.*.address_line_2' => 'nullable|string|max:100',
            'previous_addresses.*.city' => 'required|string|max:100',
            'previous_addresses.*.state_province' => 'nullable|string|max:100',
            'previous_addresses.*.postal_code' => 'required|string|max:20',
            'previous_addresses.*.country' => 'required|string|max:2',
            'previous_addresses.*.from_date' => 'required|date',
            'previous_addresses.*.to_date' => 'required|date|after:previous_addresses.*.from_date',
            'previous_addresses.*.living_situation' => 'nullable|in:renting,owner,living_with_family,student_housing,employer_provided,other',
            'previous_addresses.*.monthly_rent' => 'nullable|numeric|min:0',
            'previous_addresses.*.rent_currency' => 'nullable|string|max:3',
            'previous_addresses.*.landlord_name' => 'nullable|string|max:200',
            'previous_addresses.*.landlord_contact' => 'nullable|string|max:200',
            'previous_addresses.*.can_contact_landlord' => 'nullable|boolean',

            // References (updated structure)
            'references' => 'nullable|array',
            'references.*.type' => 'required|in:landlord,employer,personal,professional',
            'references.*.name' => 'required|string|max:200',
            'references.*.company' => 'nullable|string|max:200',
            'references.*.email' => 'required|email|max:255',
            'references.*.phone' => 'required|string|max:50',
            'references.*.property_address' => 'nullable|string|max:500',
            'references.*.tenancy_start_date' => 'nullable|date',
            'references.*.tenancy_end_date' => 'nullable|date',
            'references.*.monthly_rent_paid' => 'nullable|numeric|min:0',
            'references.*.job_title' => 'nullable|string|max:100',
            'references.*.relationship' => 'nullable|in:professional,personal',
            'references.*.years_known' => 'nullable|integer|min:0|max:100',
            'references.*.consent_to_contact' => 'required|boolean|accepted',

            // Legacy fields (being phased out, kept for compatibility)
            'previous_landlord_name' => 'nullable|string|max:255',
            'previous_landlord_phone' => 'nullable|string|max:20',
            'previous_landlord_email' => 'nullable|email|max:255',

            // =====================================
            // STEP 6: Additional Information
            // =====================================
            'additional_information' => 'nullable|string|max:2000',

            // =====================================
            // STEP 7: Declarations & Consent
            // =====================================
            'declaration_accuracy' => 'required|boolean|accepted',
            'consent_screening' => 'required|boolean|accepted',
            'consent_data_processing' => 'required|boolean|accepted',
            'consent_reference_contact' => 'required|boolean|accepted',
            'consent_data_sharing' => 'nullable|boolean',
            'consent_marketing' => 'nullable|boolean',
            'digital_signature' => 'required|string|max:200',

            // =====================================
            // Additional documents (optional)
            // =====================================
            'application_id_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'application_proof_of_income' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'application_reference_letter' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'additional_documents' => 'nullable|array',
            'additional_documents.*' => 'file|mimes:pdf,jpeg,png,jpg|max:20480',

            // Token tracking
            'invited_via_token' => 'nullable|string|max:64',
        ];

        // =====================================
        // CONDITIONAL VALIDATION RULES
        // =====================================

        // ID Document: Always required if not already in profile
        if (! $tenantProfile?->id_document_front_path) {
            $rules['profile_id_document_front'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
        }
        if (! $tenantProfile?->id_document_back_path) {
            $rules['profile_id_document_back'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
        }

        // Employed/Self-Employed: Require employment fields and documents
        if (in_array($employmentStatus, ['employed', 'self_employed'])) {
            $rules['profile_employer_name'] = 'required|string|max:255';
            $rules['profile_job_title'] = 'required|string|max:255';
            $rules['profile_monthly_income'] = 'required|numeric|min:0';

            // Employment documents required if not in profile
            if (! $tenantProfile?->employment_contract_path) {
                $rules['profile_employment_contract'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
            if (! $tenantProfile?->payslip_1_path) {
                $rules['profile_payslip_1'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
            if (! $tenantProfile?->payslip_2_path) {
                $rules['profile_payslip_2'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
            if (! $tenantProfile?->payslip_3_path) {
                $rules['profile_payslip_3'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
        }

        // Student: Require student fields and proof
        if ($employmentStatus === 'student') {
            $rules['profile_university_name'] = 'required|string|max:255';
            $rules['profile_program_of_study'] = 'required|string|max:255';

            if (! $tenantProfile?->student_proof_path) {
                $rules['profile_student_proof'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
        }

        // Unemployed/Retired: Require proof of income source (benefits, pension, savings)
        if (in_array($employmentStatus, ['unemployed', 'retired'])) {
            if (! $tenantProfile?->other_income_proof_path) {
                $rules['profile_other_income_proof'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
        }

        // Countries that require state/province
        // IMPORTANT: This list MUST match the frontend list in:
        // resources/js/utils/state-province-data.ts (COUNTRIES_REQUIRING_STATE)
        $countriesRequiringState = ['US', 'CA', 'AU', 'BR', 'MX', 'IN'];

        // State/Province: Required for current address in countries that mandate it
        $countryCode = $this->input('profile_current_country');
        if ($countryCode && in_array(strtoupper($countryCode), $countriesRequiringState)) {
            $rules['profile_current_state_province'] = 'required|string|max:100';
        }

        return $rules;
    }

    /**
     * Get custom error messages for validation.
     *
     * IMPORTANT: These messages should match the frontend messages in:
     * resources/js/lib/validation/application-schemas.ts (APPLICATION_MESSAGES)
     *
     * Per DESIGN.md validation strategy, frontend and backend must have identical
     * error messages for consistent user experience.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Personal Info - must match APPLICATION_MESSAGES
            'profile_date_of_birth.required' => 'Date of birth is required',
            'profile_date_of_birth.before' => 'You must be at least 18 years old',
            'profile_nationality.required' => 'Nationality is required',
            'profile_phone_number.required' => 'Phone number is required',
            'profile_current_street_name.required' => 'Street name is required',
            'profile_current_house_number.required' => 'House number is required',
            'profile_current_city.required' => 'City is required',
            'profile_current_postal_code.required' => 'Postal code is required',
            'profile_current_country.required' => 'Country is required',
            'profile_current_state_province.required' => 'State/Province is required for this country',

            // Employment - must match APPLICATION_MESSAGES
            'profile_employment_status.required' => 'Please select your employment status',
            'profile_employer_name.required' => 'Employer name is required',
            'profile_job_title.required' => 'Job title is required',
            'profile_monthly_income.required' => 'Monthly income is required',
            'profile_monthly_income.min' => 'Income must be a positive number',
            'profile_university_name.required' => 'University name is required',
            'profile_program_of_study.required' => 'Program of study is required',

            // Documents - must match APPLICATION_MESSAGES
            'profile_id_document_front.required' => 'Front side of ID document is required',
            'profile_id_document_back.required' => 'Back side of ID document is required',
            'profile_employment_contract.required' => 'Employment contract is required',
            'profile_payslip_1.required' => 'Payslip is required',
            'profile_payslip_2.required' => 'Payslip is required',
            'profile_payslip_3.required' => 'Payslip is required',
            'profile_student_proof.required' => 'Proof of student status is required',
            'profile_other_income_proof.required' => 'Proof of income source is required',

            // Details - must match APPLICATION_MESSAGES
            'desired_move_in_date.required' => 'Move-in date is required',
            'desired_move_in_date.after' => 'Move-in date must be in the future',
            'lease_duration_months.required' => 'Lease duration is required',
            'lease_duration_months.min' => 'Lease duration must be at least 1 month',
            'lease_duration_months.max' => 'Lease duration cannot exceed 60 months',
            'message_to_landlord.max' => 'Message cannot exceed 2000 characters',
            'additional_occupants.max' => 'Cannot have more than 20 additional occupants',

            // Occupants - must match APPLICATION_MESSAGES
            'occupants_details.*.first_name.required' => 'First name is required',
            'occupants_details.*.first_name.max' => 'First name cannot exceed 100 characters',
            'occupants_details.*.last_name.required' => 'Last name is required',
            'occupants_details.*.last_name.max' => 'Last name cannot exceed 100 characters',
            'occupants_details.*.date_of_birth.required' => 'Date of birth is required',
            'occupants_details.*.date_of_birth.date' => 'Please enter a valid date of birth',
            'occupants_details.*.relationship.required' => 'Relationship is required',
            'occupants_details.*.relationship.max' => 'Relationship cannot exceed 100 characters',

            // Pets - must match APPLICATION_MESSAGES
            'pets_details.*.type.required' => 'Pet type is required',
            'pets_details.*.type.max' => 'Pet type cannot exceed 100 characters',
            'pets_details.*.breed.max' => 'Breed cannot exceed 100 characters',
            'pets_details.*.age.max' => 'Pet age cannot exceed 50 years',

            // References - must match APPLICATION_MESSAGES
            'references.*.name.required' => 'Name is required',
            'references.*.email.email' => 'Valid email is required',
        ];
    }
}
