<?php

namespace App\Http\Requests;

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
            'profile_nationality' => 'required|string|max:100',
            'profile_phone_country_code' => 'required|string|max:5',
            'profile_phone_number' => 'required|string|max:20',
            'profile_current_house_number' => 'required|string|max:20',
            'profile_current_street_name' => 'required|string|max:255',
            'profile_current_city' => 'required|string|max:100',
            'profile_current_postal_code' => 'required|string|max:20',
            'profile_current_country' => 'required|string|max:2',

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

        return $rules;
    }

    /**
     * Get custom error messages for validation.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'profile_date_of_birth.before' => 'You must be at least 18 years old to apply.',
            'profile_id_document.required' => 'Please upload a valid ID document (passport, national ID, or driver\'s license).',
            'profile_employment_contract.required' => 'Employment contract is required for employed applicants.',
            'profile_payslip_1.required' => 'Please upload your first payslip (most recent).',
            'profile_payslip_2.required' => 'Please upload your second payslip.',
            'profile_payslip_3.required' => 'Please upload your third payslip.',
            'profile_student_proof.required' => 'Please upload proof of student status (enrollment letter or student ID).',
            'profile_other_income_proof.required' => 'Please upload proof of income source (benefits, pension, savings statement, etc.).',
            'profile_guarantor_id.required' => 'Please upload your guarantor\'s ID document.',
            'profile_guarantor_proof_income.required' => 'Please upload your guarantor\'s proof of income.',
            'profile_employer_name.required' => 'Employer name is required for employed applicants.',
            'profile_job_title.required' => 'Job title is required for employed applicants.',
            'profile_monthly_income.required' => 'Monthly income is required for employed applicants.',
            'profile_university_name.required' => 'University name is required for student applicants.',
            'profile_program_of_study.required' => 'Program of study is required for student applicants.',
            'profile_guarantor_name.required' => 'Guarantor name is required when you have a guarantor.',
            'profile_guarantor_relationship.required' => 'Guarantor relationship is required when you have a guarantor.',
            'profile_guarantor_monthly_income.required' => 'Guarantor monthly income is required when you have a guarantor.',
            'desired_move_in_date.after' => 'Move-in date must be in the future.',
        ];
    }
}
