<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use App\Rules\ValidCountryCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 4: Financial Support
 *
 * Validates co-signers, guarantors, and rent insurance.
 */
class SupportStepRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $tenantProfile = $this->getTenantProfile();
        $hasGuarantor = $this->boolean('profile_has_guarantor');

        $rules = [
            // Co-signers array
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
            'co_signers.*.relationship' => ['required', Rule::in($this->relationships())],
            'co_signers.*.relationship_other' => 'nullable|string|max:100',
            // ID Document
            'co_signers.*.id_document_type' => ['required', Rule::in($this->idDocumentTypes())],
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
            'co_signers.*.employment_status' => ['required', Rule::in([...$this->employmentStatuses(), 'other'])],
            'co_signers.*.employer_name' => 'nullable|string|max:200',
            'co_signers.*.job_title' => 'nullable|string|max:100',
            'co_signers.*.employment_type' => ['nullable', Rule::in(['full_time', 'part_time', 'contract', 'temporary', 'zero_hours'])],
            'co_signers.*.employment_start_date' => 'nullable|date|before_or_equal:today',
            'co_signers.*.net_monthly_income' => 'nullable|numeric|min:0',
            'co_signers.*.income_currency' => 'nullable|string|max:3',

            // Guarantors array
            'guarantors' => 'nullable|array',
            'guarantors.*.for_signer_type' => ['required', Rule::in(['primary', 'co_signer'])],
            'guarantors.*.for_co_signer_index' => 'nullable|integer|min:0',
            // Personal details
            'guarantors.*.first_name' => 'required|string|max:100',
            'guarantors.*.last_name' => 'required|string|max:100',
            'guarantors.*.email' => 'required|email|max:255',
            'guarantors.*.phone_country_code' => 'required|string|max:10',
            'guarantors.*.phone_number' => 'required|string|max:30',
            'guarantors.*.date_of_birth' => 'required|date|before:-18 years',
            'guarantors.*.nationality' => 'required|string|max:2',
            'guarantors.*.relationship' => ['required', Rule::in($this->relationships())],
            'guarantors.*.relationship_other' => 'nullable|string|max:100',
            // ID Document
            'guarantors.*.id_document_type' => ['required', Rule::in($this->idDocumentTypes())],
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
            // Employment & Financial (income required for guarantors)
            'guarantors.*.employment_status' => ['required', Rule::in([...$this->employmentStatuses(), 'other'])],
            'guarantors.*.employer_name' => 'nullable|string|max:200',
            'guarantors.*.job_title' => 'nullable|string|max:100',
            'guarantors.*.net_monthly_income' => 'required|numeric|min:0',
            'guarantors.*.income_currency' => 'required|string|max:3',
            // Consent
            'guarantors.*.consent_to_credit_check' => 'required|boolean|accepted',
            'guarantors.*.consent_to_contact' => 'required|boolean|accepted',
            'guarantors.*.guarantee_consent_signed' => 'required|boolean|accepted',

            // Rent guarantee insurance
            'interested_in_rent_insurance' => ['nullable', Rule::in(['yes', 'no', 'already_have'])],
            'existing_insurance_provider' => 'nullable|string|max:200',
            'existing_insurance_policy_number' => 'nullable|string|max:100',

            // Legacy guarantor fields (for backward compatibility)
            'profile_guarantor_first_name' => 'nullable|string|max:100',
            'profile_guarantor_last_name' => 'nullable|string|max:100',
            'profile_guarantor_relationship' => 'nullable|string|max:100',
            'profile_guarantor_relationship_other' => 'nullable|string|max:100',
            'profile_guarantor_phone_country_code' => 'nullable|string|max:5',
            'profile_guarantor_phone_number' => 'nullable|string|max:20',
            'profile_guarantor_email' => 'nullable|email|max:255',
            'profile_guarantor_street_name' => 'nullable|string|max:255',
            'profile_guarantor_house_number' => 'nullable|string|max:20',
            'profile_guarantor_address_line_2' => 'nullable|string|max:100',
            'profile_guarantor_city' => 'nullable|string|max:100',
            'profile_guarantor_state_province' => 'nullable|string|max:100',
            'profile_guarantor_postal_code' => 'nullable|string|max:20',
            'profile_guarantor_country' => ['nullable', 'string', 'max:2', new ValidCountryCode],
            'profile_guarantor_employment_status' => ['nullable', Rule::in($this->employmentStatuses())],
            'profile_guarantor_employer_name' => 'nullable|string|max:255',
            'profile_guarantor_job_title' => 'nullable|string|max:255',
            'profile_guarantor_employment_type' => ['nullable', Rule::in(['full_time', 'part_time', 'contract', 'temporary'])],
            'profile_guarantor_employment_start_date' => 'nullable|date|before_or_equal:today',
            'profile_guarantor_monthly_income' => 'nullable|numeric|min:0',
            'profile_guarantor_income_currency' => ['nullable', Rule::in($this->currencies())],
            'profile_guarantor_university_name' => 'nullable|string|max:255',
            'profile_guarantor_program_of_study' => 'nullable|string|max:255',
            'profile_guarantor_expected_graduation_date' => 'nullable|date|after:today',
            'profile_guarantor_student_income_source' => 'nullable|string|max:255',

            // Guarantor documents
            'profile_guarantor_id_front' => $this->fileRule(),
            'profile_guarantor_id_back' => $this->fileRule(),
            'profile_guarantor_proof_income' => $this->fileRule(),
            'profile_guarantor_employment_contract' => $this->fileRule(),
            'profile_guarantor_payslip_1' => $this->fileRule(),
            'profile_guarantor_payslip_2' => $this->fileRule(),
            'profile_guarantor_payslip_3' => $this->fileRule(),
            'profile_guarantor_student_proof' => $this->fileRule(),
            'profile_guarantor_other_income_proof' => $this->fileRule(),
        ];

        // Apply legacy guarantor required rules if has_guarantor is true
        if ($hasGuarantor) {
            $rules = $this->applyLegacyGuarantorRules($rules, $tenantProfile);
        }

        return $rules;
    }

    /**
     * Apply required rules for legacy guarantor fields.
     */
    private function applyLegacyGuarantorRules(array $rules, $tenantProfile): array
    {
        $guarantorEmploymentStatus = $this->input('profile_guarantor_employment_status');

        // Basic info - always required
        $rules['profile_guarantor_first_name'] = 'required|string|max:100';
        $rules['profile_guarantor_last_name'] = 'required|string|max:100';
        $rules['profile_guarantor_relationship'] = 'required|string|max:100';
        $rules['profile_guarantor_phone_country_code'] = 'required|string|max:5';
        $rules['profile_guarantor_phone_number'] = 'required|string|max:20';
        $rules['profile_guarantor_email'] = 'required|email|max:255';
        $rules['profile_guarantor_street_name'] = 'required|string|max:255';
        $rules['profile_guarantor_house_number'] = 'required|string|max:20';
        $rules['profile_guarantor_city'] = 'required|string|max:100';
        $rules['profile_guarantor_postal_code'] = 'required|string|max:20';
        $rules['profile_guarantor_country'] = $this->countryCodeRules();
        $rules['profile_guarantor_employment_status'] = ['required', Rule::in($this->employmentStatuses())];
        $rules['profile_guarantor_monthly_income'] = 'required|numeric|min:0';
        $rules['profile_guarantor_income_currency'] = ['required', Rule::in($this->currencies())];

        // Relationship "Other" requires specification
        if ($this->input('profile_guarantor_relationship') === 'Other') {
            $rules['profile_guarantor_relationship_other'] = 'required|string|max:100';
        }

        // State/province for certain countries
        $guarantorCountry = $this->input('profile_guarantor_country');
        if ($guarantorCountry && in_array(strtoupper($guarantorCountry), $this->countriesRequiringState())) {
            $rules['profile_guarantor_state_province'] = 'required|string|max:100';
        }

        // ID Documents
        if (! $tenantProfile?->guarantor_id_front_path) {
            $rules['profile_guarantor_id_front'] = $this->fileRule(true);
        }
        if (! $tenantProfile?->guarantor_id_back_path) {
            $rules['profile_guarantor_id_back'] = $this->fileRule(true);
        }

        // Employment-specific rules
        if (in_array($guarantorEmploymentStatus, ['employed', 'self_employed'])) {
            $rules['profile_guarantor_employer_name'] = 'required|string|max:255';
            $rules['profile_guarantor_job_title'] = 'required|string|max:255';
            $rules['profile_guarantor_employment_type'] = ['required', Rule::in(['full_time', 'part_time', 'contract', 'temporary'])];
            $rules['profile_guarantor_employment_start_date'] = 'required|date|before_or_equal:today';

            if (! $tenantProfile?->guarantor_employment_contract_path) {
                $rules['profile_guarantor_employment_contract'] = $this->fileRule(true);
            }
            if (! $tenantProfile?->guarantor_payslip_1_path) {
                $rules['profile_guarantor_payslip_1'] = $this->fileRule(true);
            }
            if (! $tenantProfile?->guarantor_payslip_2_path) {
                $rules['profile_guarantor_payslip_2'] = $this->fileRule(true);
            }
            if (! $tenantProfile?->guarantor_payslip_3_path) {
                $rules['profile_guarantor_payslip_3'] = $this->fileRule(true);
            }
        }

        if ($guarantorEmploymentStatus === 'student') {
            $rules['profile_guarantor_university_name'] = 'required|string|max:255';
            $rules['profile_guarantor_program_of_study'] = 'required|string|max:255';

            if (! $tenantProfile?->guarantor_student_proof_path) {
                $rules['profile_guarantor_student_proof'] = $this->fileRule(true);
            }
        }

        if (in_array($guarantorEmploymentStatus, ['unemployed', 'retired'])) {
            if (! $tenantProfile?->guarantor_other_income_proof_path) {
                $rules['profile_guarantor_other_income_proof'] = $this->fileRule(true);
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            // Co-signers
            'co_signers.*.first_name.required' => 'Co-signer first name is required',
            'co_signers.*.last_name.required' => 'Co-signer last name is required',
            'co_signers.*.email.required' => 'Co-signer email is required',
            'co_signers.*.date_of_birth.before' => 'Co-signer must be at least 18 years old',
            'co_signers.*.id_expiry_date.after' => 'ID document must not be expired',

            // Guarantors
            'guarantors.*.first_name.required' => 'Guarantor first name is required',
            'guarantors.*.last_name.required' => 'Guarantor last name is required',
            'guarantors.*.email.required' => 'Guarantor email is required',
            'guarantors.*.date_of_birth.before' => 'Guarantor must be at least 18 years old',
            'guarantors.*.net_monthly_income.required' => 'Guarantor income is required',
            'guarantors.*.consent_to_credit_check.accepted' => 'Guarantor must consent to credit check',
            'guarantors.*.consent_to_contact.accepted' => 'Guarantor must consent to being contacted',
            'guarantors.*.guarantee_consent_signed.accepted' => 'Guarantor must sign the guarantee consent',

            // Legacy guarantor
            'profile_guarantor_first_name.required' => 'Guarantor first name is required',
            'profile_guarantor_last_name.required' => 'Guarantor last name is required',
            'profile_guarantor_relationship.required' => 'Guarantor relationship is required',
            'profile_guarantor_relationship_other.required' => 'Please specify the relationship',
            'profile_guarantor_phone_number.required' => 'Guarantor phone number is required',
            'profile_guarantor_email.required' => 'Guarantor email is required',
            'profile_guarantor_monthly_income.required' => 'Guarantor income is required',
            'profile_guarantor_id_front.required' => 'Guarantor ID document (front) is required',
            'profile_guarantor_id_back.required' => 'Guarantor ID document (back) is required',
            'profile_guarantor_employment_contract.required' => 'Guarantor employment contract is required',
            'profile_guarantor_payslip_1.required' => 'Guarantor payslip is required',
        ];
    }
}
