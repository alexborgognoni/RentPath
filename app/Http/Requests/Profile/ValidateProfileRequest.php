<?php

namespace App\Http\Requests\Profile;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates profile data with the same rules as the application wizard.
 *
 * Uses conditional validation based on employment_status and immigration_status
 * to match the wizard's per-field onBlur validation pattern.
 */
class ValidateProfileRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Rules match IdentityStepRequest and FinancialStepRequest from the wizard,
     * but without the 'profile_' prefix since this is the profile page.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employmentStatus = $this->input('employment_status');
        $immigrationStatus = $this->input('immigration_status');
        $countryCode = $this->input('current_country');

        $rules = [
            // ===== Personal Info (matches IdentityStepRequest) =====
            'date_of_birth' => ['required', 'date', 'before:-18 years'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'nationality' => $this->countryCodeRules(),
            'phone_country_code' => ['required', 'string', 'max:5'],
            'phone_number' => $this->phoneRules('phone_country_code'),
            'bio' => ['nullable', 'string', 'max:1000'],

            // ===== ID Document (matches IdentityStepRequest) =====
            'id_document_type' => ['required', Rule::in($this->idDocumentTypes())],
            'id_number' => ['required', 'string', 'max:100'],
            'id_issuing_country' => $this->countryCodeRules(),
            'id_expiry_date' => ['required', 'date', 'after:today'],

            // ===== Immigration Status (conditional) =====
            'immigration_status' => ['nullable', Rule::in($this->immigrationStatuses())],
            'immigration_status_other' => ['nullable', 'string', 'max:100', 'required_if:immigration_status,other'],
            'visa_type' => ['nullable', 'string', 'max:100', 'required_if:immigration_status,visa_holder'],
            'visa_type_other' => ['nullable', 'string', 'max:100', 'required_if:visa_type,other'],
            'visa_expiry_date' => ['nullable', 'date', 'after:today', 'required_if:immigration_status,visa_holder'],
            'work_permit_number' => ['nullable', 'string', 'max:100'],

            // Right to Rent (UK specific, optional)
            'right_to_rent_share_code' => ['nullable', 'string', 'max:50'],

            // ===== Current Address (matches IdentityStepRequest) =====
            'current_house_number' => ['required', 'string', 'max:20'],
            'current_address_line_2' => ['nullable', 'string', 'max:100'],
            'current_street_name' => ['required', 'string', 'max:255'],
            'current_city' => ['required', 'string', 'max:100'],
            'current_state_province' => ['nullable', 'string', 'max:100'],
            'current_postal_code' => $this->postalCodeRules('current_country'),
            'current_country' => $this->countryCodeRules(),

            // ===== Employment (matches FinancialStepRequest) =====
            'employment_status' => ['required', Rule::in($this->employmentStatuses())],
            'income_currency' => ['required', Rule::in($this->currencies())],

            // Base employment fields (nullable by default)
            'employer_name' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', Rule::in(['full_time', 'part_time', 'contract', 'temporary'])],
            'employment_start_date' => ['nullable', 'date', 'before_or_equal:today'],
            'gross_annual_income' => ['nullable', 'numeric', 'min:0'],
            'net_monthly_income' => ['nullable', 'numeric', 'min:0'],
            'monthly_income' => ['nullable', 'numeric', 'min:0'],
            'pay_frequency' => ['nullable', Rule::in(['weekly', 'bi_weekly', 'monthly', 'annually'])],
            'employment_contract_type' => ['nullable', Rule::in(['permanent', 'fixed_term', 'zero_hours'])],
            'employment_end_date' => ['nullable', 'date'],
            'probation_end_date' => ['nullable', 'date'],
            'employer_address' => ['nullable', 'string', 'max:500'],
            'employer_phone' => ['nullable', 'string', 'max:20'],

            // Self-employed fields
            'business_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:100'],
            'business_registration_number' => ['nullable', 'string', 'max:50'],
            'business_start_date' => ['nullable', 'date', 'before_or_equal:today'],
            'gross_annual_revenue' => ['nullable', 'numeric', 'min:0'],

            // Student fields
            'university_name' => ['nullable', 'string', 'max:255'],
            'program_of_study' => ['nullable', 'string', 'max:255'],
            'expected_graduation_date' => ['nullable', 'date', 'after:today'],
            'student_id_number' => ['nullable', 'string', 'max:50'],
            'student_income_source' => ['nullable', 'string', 'max:255'],
            'student_income_source_type' => ['nullable', Rule::in(['parents', 'scholarship', 'loan', 'savings', 'part_time_work', 'other'])],
            'student_income_source_other' => ['nullable', 'string', 'max:255'],
            'student_monthly_income' => ['nullable', 'numeric', 'min:0'],

            // Retired fields
            'pension_type' => ['nullable', Rule::in(['state', 'private', 'occupational', 'other'])],
            'pension_provider' => ['nullable', 'string', 'max:255'],
            'pension_monthly_income' => ['nullable', 'numeric', 'min:0'],
            'retirement_other_income' => ['nullable', 'numeric', 'min:0'],

            // Unemployed fields
            'receiving_unemployment_benefits' => ['nullable', 'boolean'],
            'unemployment_benefits_amount' => ['nullable', 'numeric', 'min:0'],
            'unemployed_income_source' => ['nullable', 'string', 'max:255'],
            'unemployed_income_source_other' => ['nullable', 'string', 'max:255'],

            // Other employment situation fields
            'other_employment_situation' => ['nullable', 'string', 'max:255'],
            'other_employment_situation_details' => ['nullable', 'string', 'max:1000'],
            'expected_return_to_work' => ['nullable', 'date'],
            'other_situation_monthly_income' => ['nullable', 'numeric', 'min:0'],
            'other_situation_income_source' => ['nullable', 'string', 'max:255'],

            // Additional income
            'has_additional_income' => ['nullable', 'boolean'],
        ];

        // ===== Conditional Employment Rules (matches FinancialStepRequest) =====

        // Employed/Self-Employed: Require core employment fields
        if (in_array($employmentStatus, ['employed', 'self_employed'])) {
            $rules['employer_name'] = ['required', 'string', 'max:255'];
            $rules['job_title'] = ['required', 'string', 'max:255'];
            $rules['monthly_income'] = ['required', 'numeric', 'min:0'];
        }

        // Student: Require student fields
        if ($employmentStatus === 'student') {
            $rules['university_name'] = ['required', 'string', 'max:255'];
            $rules['program_of_study'] = ['required', 'string', 'max:255'];
        }

        // ===== Conditional Address Rules (matches IdentityStepRequest) =====

        // State/province required for certain countries
        if ($countryCode && in_array(strtoupper($countryCode), $this->countriesRequiringState())) {
            $rules['current_state_province'] = ['required', 'string', 'max:100'];
        }

        return $rules;
    }

    /**
     * Get custom error messages matching the wizard's messages.
     */
    public function messages(): array
    {
        return [
            // Personal info
            'date_of_birth.required' => 'Date of birth is required',
            'date_of_birth.before' => 'You must be at least 18 years old',
            'nationality.required' => 'Nationality is required',
            'phone_country_code.required' => 'Country code is required',
            'phone_number.required' => 'Phone number is required',

            // ID Document
            'id_document_type.required' => 'ID document type is required',
            'id_number.required' => 'ID number is required',
            'id_issuing_country.required' => 'ID issuing country is required',
            'id_expiry_date.required' => 'ID expiry date is required',
            'id_expiry_date.after' => 'ID document must not be expired',

            // Address
            'current_house_number.required' => 'House number is required',
            'current_street_name.required' => 'Street name is required',
            'current_city.required' => 'City is required',
            'current_postal_code.required' => 'Postal code is required',
            'current_country.required' => 'Country is required',
            'current_state_province.required' => 'State/Province is required for this country',

            // Immigration
            'immigration_status_other.required_if' => 'Please specify your immigration status',
            'visa_type.required_if' => 'Visa type is required for visa holders',
            'visa_expiry_date.required_if' => 'Visa expiry date is required',
            'visa_expiry_date.after' => 'Visa must not be expired',

            // Employment
            'employment_status.required' => 'Please select your employment status',
            'income_currency.required' => 'Please select your income currency',
            'employer_name.required' => 'Employer name is required',
            'job_title.required' => 'Job title is required',
            'monthly_income.required' => 'Monthly income is required',
            'monthly_income.min' => 'Income must be a positive number',

            // Student
            'university_name.required' => 'University name is required',
            'program_of_study.required' => 'Program of study is required',
            'expected_graduation_date.after' => 'Graduation date must be in the future',

            // General numeric
            'gross_annual_income.min' => 'Income must be a positive number',
            'net_monthly_income.min' => 'Income must be a positive number',
            'student_monthly_income.min' => 'Income must be a positive number',
            'pension_monthly_income.min' => 'Income must be a positive number',
            'unemployment_benefits_amount.min' => 'Amount must be a positive number',
        ];
    }

    /**
     * Get the immigration status options.
     */
    protected function immigrationStatuses(): array
    {
        return [
            'citizen',
            'permanent_resident',
            'visa_holder',
            'refugee',
            'asylum_seeker',
            'other',
        ];
    }
}
