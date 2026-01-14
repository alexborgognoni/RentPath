<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 3: Financial Capability
 *
 * Validates employment status, income, and related documents.
 * Rules are conditional based on employment status.
 */
class FinancialStepRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $tenantProfile = $this->getTenantProfile();
        $employmentStatus = $this->input('profile_employment_status');

        $rules = [
            // Common fields
            'profile_employment_status' => ['required', Rule::in($this->employmentStatuses())],
            'profile_income_currency' => ['required', Rule::in($this->currencies())],

            // Base fields (nullable by default)
            'profile_employer_name' => 'nullable|string|max:255',
            'profile_job_title' => 'nullable|string|max:255',
            'profile_employment_type' => ['nullable', Rule::in(['full_time', 'part_time', 'contract', 'temporary'])],
            'profile_employment_start_date' => 'nullable|date|before_or_equal:today',
            'profile_monthly_income' => 'nullable|numeric|min:0',
            'profile_university_name' => 'nullable|string|max:255',
            'profile_program_of_study' => 'nullable|string|max:255',
            'profile_expected_graduation_date' => 'nullable|date|after:today',
            'profile_student_income_source' => 'nullable|string|max:255',

            // Document base rules
            'profile_employment_contract' => $this->fileRule(),
            'profile_payslip_1' => $this->fileRule(),
            'profile_payslip_2' => $this->fileRule(),
            'profile_payslip_3' => $this->fileRule(),
            'profile_student_proof' => $this->fileRule(),
            'profile_other_income_proof' => $this->fileRule(),
        ];

        // Employed/Self-Employed: Require employment fields and documents
        if (in_array($employmentStatus, ['employed', 'self_employed'])) {
            $rules['profile_employer_name'] = 'required|string|max:255';
            $rules['profile_job_title'] = 'required|string|max:255';
            $rules['profile_monthly_income'] = 'required|numeric|min:0';

            // Employment documents required if not in profile
            if (! $tenantProfile?->employment_contract_path) {
                $rules['profile_employment_contract'] = $this->fileRule(true);
            }
            if (! $tenantProfile?->payslip_1_path) {
                $rules['profile_payslip_1'] = $this->fileRule(true);
            }
            if (! $tenantProfile?->payslip_2_path) {
                $rules['profile_payslip_2'] = $this->fileRule(true);
            }
            if (! $tenantProfile?->payslip_3_path) {
                $rules['profile_payslip_3'] = $this->fileRule(true);
            }
        }

        // Student: Require student fields and proof
        if ($employmentStatus === 'student') {
            $rules['profile_university_name'] = 'required|string|max:255';
            $rules['profile_program_of_study'] = 'required|string|max:255';

            if (! $tenantProfile?->student_proof_path) {
                $rules['profile_student_proof'] = $this->fileRule(true);
            }
        }

        // Unemployed/Retired: Require proof of income source
        if (in_array($employmentStatus, ['unemployed', 'retired'])) {
            if (! $tenantProfile?->other_income_proof_path) {
                $rules['profile_other_income_proof'] = $this->fileRule(true);
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'profile_employment_status.required' => 'Please select your employment status',
            'profile_income_currency.required' => 'Please select your income currency',
            'profile_employer_name.required' => 'Employer name is required',
            'profile_job_title.required' => 'Job title is required',
            'profile_monthly_income.required' => 'Monthly income is required',
            'profile_monthly_income.min' => 'Income must be a positive number',
            'profile_university_name.required' => 'University name is required',
            'profile_program_of_study.required' => 'Program of study is required',
            'profile_employment_contract.required' => 'Employment contract is required',
            'profile_payslip_1.required' => 'Payslip is required',
            'profile_payslip_2.required' => 'Payslip is required',
            'profile_payslip_3.required' => 'Payslip is required',
            'profile_student_proof.required' => 'Proof of student status is required',
            'profile_other_income_proof.required' => 'Proof of income source is required',
        ];
    }
}
