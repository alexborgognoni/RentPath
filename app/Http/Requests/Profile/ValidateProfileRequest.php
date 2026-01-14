<?php

namespace App\Http\Requests\Profile;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ValidateProfileRequest extends FormRequest
{
    use ApplicationValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            // Personal info
            'date_of_birth' => ['nullable', 'date', 'before:today', 'after:'.now()->subYears(120)->toDateString()],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'nationality' => ['nullable', 'string', 'size:2'],
            'phone_country_code' => ['nullable', 'string', 'max:10'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],

            // ID Document
            'id_document_type' => ['nullable', Rule::in(['passport', 'national_id', 'drivers_license'])],
            'id_number' => ['nullable', 'string', 'max:50'],
            'id_issuing_country' => ['nullable', 'string', 'size:2'],
            'id_expiry_date' => ['nullable', 'date', 'after:today'],

            // Immigration Status
            'immigration_status' => ['nullable', Rule::in($this->immigrationStatuses())],
            'immigration_status_other' => ['nullable', 'string', 'max:100', 'required_if:immigration_status,other'],
            'visa_type' => ['nullable', Rule::in($this->visaTypes())],
            'visa_type_other' => ['nullable', 'string', 'max:100', 'required_if:visa_type,other'],
            'visa_expiry_date' => ['nullable', 'date', 'after:today'],
            'work_permit_number' => ['nullable', 'string', 'max:50'],

            // Right to Rent
            'right_to_rent_share_code' => ['nullable', 'string', 'max:20'],

            // Current Address
            'current_house_number' => ['nullable', 'string', 'max:20'],
            'current_address_line_2' => ['nullable', 'string', 'max:255'],
            'current_street_name' => ['nullable', 'string', 'max:255'],
            'current_city' => ['nullable', 'string', 'max:100'],
            'current_state_province' => ['nullable', 'string', 'max:100'],
            'current_postal_code' => ['nullable', 'string', 'max:20'],
            'current_country' => ['nullable', 'string', 'size:2'],

            // Employment
            'employment_status' => ['nullable', Rule::in($this->employmentStatuses())],
            'income_currency' => ['nullable', Rule::in($this->currencies())],

            // Employed fields
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

        return $rules;
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

    /**
     * Get the visa type options.
     */
    protected function visaTypes(): array
    {
        return [
            'work',
            'student',
            'family',
            'tourist',
            'business',
            'other',
        ];
    }
}
