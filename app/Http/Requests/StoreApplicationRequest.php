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
        $hasGuarantor = $this->boolean('profile_has_guarantor');
        $tenantProfile = Auth::user()?->tenantProfile;

        $rules = [
            // =====================================
            // STEP 1: Personal Information (Required)
            // =====================================
            'profile_date_of_birth' => 'required|date|before:-18 years',
            'profile_nationality' => ['required', 'string', 'max:2', new ValidCountryCode],
            'profile_phone_country_code' => 'required|string|max:5',
            'profile_phone_number' => ['required', 'string', 'max:20', new ValidPhoneNumber('profile_phone_country_code')],
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
            'profile_has_guarantor' => 'required|boolean',

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
            'profile_guarantor_name' => 'nullable|string|max:255',
            'profile_guarantor_relationship' => 'nullable|string|max:100',
            'profile_guarantor_phone' => 'nullable|string|max:20',
            'profile_guarantor_email' => 'nullable|email|max:255',
            'profile_guarantor_address' => 'nullable|string|max:500',
            'profile_guarantor_employer' => 'nullable|string|max:255',
            'profile_guarantor_monthly_income' => 'nullable|numeric|min:0',

            // Document base rules (nullable by default, will be overridden conditionally)
            'profile_id_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_employment_contract' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_payslip_1' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_payslip_2' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_payslip_3' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_student_proof' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_other_income_proof' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_guarantor_id' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'profile_guarantor_proof_income' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',

            // =====================================
            // STEP 3: Application Details (Required)
            // =====================================
            'desired_move_in_date' => 'required|date|after:today',
            'lease_duration_months' => 'required|integer|min:1|max:60',
            'message_to_landlord' => 'nullable|string|max:2000',
            'additional_occupants' => 'required|integer|min:0|max:20',
            'occupants_details' => 'nullable|array',
            'occupants_details.*.name' => 'required|string|max:255',
            'occupants_details.*.age' => 'required|integer|min:0|max:120',
            'occupants_details.*.relationship' => 'required|string|max:100',
            'has_pets' => 'required|boolean',
            'pets_details' => 'nullable|array',
            'pets_details.*.type' => 'required|string|max:100',
            'pets_details.*.breed' => 'nullable|string|max:100',
            'pets_details.*.age' => 'nullable|integer|min:0|max:50',
            'pets_details.*.weight' => 'nullable|numeric|min:0',

            // =====================================
            // STEP 4: References (Optional)
            // =====================================
            'references' => 'nullable|array',
            'references.*.type' => 'required|in:landlord,personal,professional',
            'references.*.name' => 'required|string|max:255',
            'references.*.phone' => 'nullable|string|max:20',
            'references.*.email' => 'nullable|email|max:255',
            'references.*.relationship' => 'nullable|string|max:100',
            'references.*.years_known' => 'nullable|integer|min:0|max:100',

            // Legacy fields (being phased out, kept for compatibility)
            'previous_landlord_name' => 'nullable|string|max:255',
            'previous_landlord_phone' => 'nullable|string|max:20',
            'previous_landlord_email' => 'nullable|email|max:255',

            // =====================================
            // STEP 5: Emergency Contact (Optional)
            // =====================================
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',

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
        if (! $tenantProfile?->id_document_path) {
            $rules['profile_id_document'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
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

        // Guarantor: Require guarantor fields and documents if has_guarantor is true
        if ($hasGuarantor) {
            $rules['profile_guarantor_name'] = 'required|string|max:255';
            $rules['profile_guarantor_relationship'] = 'required|string|max:100';
            $rules['profile_guarantor_monthly_income'] = 'required|numeric|min:0';

            if (! $tenantProfile?->guarantor_id_path) {
                $rules['profile_guarantor_id'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
            if (! $tenantProfile?->guarantor_proof_income_path) {
                $rules['profile_guarantor_proof_income'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
        }

        // State/Province: Required for countries that mandate it
        // IMPORTANT: This list MUST match the frontend list in:
        // resources/js/utils/state-province-data.ts (COUNTRIES_REQUIRING_STATE)
        $countryCode = $this->input('profile_current_country');
        $countriesRequiringState = ['US', 'CA', 'AU', 'BR', 'MX', 'IN'];
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
            'profile_guarantor_name.required' => 'Guarantor name is required',
            'profile_guarantor_relationship.required' => 'Guarantor relationship is required',
            'profile_guarantor_monthly_income.required' => 'Guarantor income is required',
            'profile_guarantor_monthly_income.min' => 'Income must be a positive number',

            // Documents - must match APPLICATION_MESSAGES
            'profile_id_document.required' => 'ID document is required',
            'profile_employment_contract.required' => 'Employment contract is required',
            'profile_payslip_1.required' => 'Payslip is required',
            'profile_payslip_2.required' => 'Payslip is required',
            'profile_payslip_3.required' => 'Payslip is required',
            'profile_student_proof.required' => 'Proof of student status is required',
            'profile_other_income_proof.required' => 'Proof of income source is required',
            'profile_guarantor_id.required' => 'Guarantor ID document is required',
            'profile_guarantor_proof_income.required' => 'Guarantor proof of income is required',

            // Details - must match APPLICATION_MESSAGES
            'desired_move_in_date.required' => 'Move-in date is required',
            'desired_move_in_date.after' => 'Move-in date must be in the future',
            'lease_duration_months.required' => 'Lease duration is required',
            'lease_duration_months.min' => 'Lease duration must be at least 1 month',
            'lease_duration_months.max' => 'Lease duration cannot exceed 60 months',
            'message_to_landlord.max' => 'Message cannot exceed 2000 characters',
            'additional_occupants.max' => 'Cannot have more than 20 additional occupants',

            // Occupants - must match APPLICATION_MESSAGES
            'occupants_details.*.name.required' => 'Name is required',
            'occupants_details.*.name.max' => 'Name cannot exceed 255 characters',
            'occupants_details.*.age.required' => 'Age is required',
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
