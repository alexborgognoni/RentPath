<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 1: Identity & Legal Eligibility
 *
 * Validates personal info, ID documents, and immigration status.
 */
class IdentityStepRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $tenantProfile = $this->getTenantProfile();

        $rules = [
            // Personal Details
            'profile_date_of_birth' => 'required|date|before:-18 years',
            'profile_middle_name' => 'nullable|string|max:100',
            'profile_nationality' => $this->countryCodeRules(),
            'profile_phone_country_code' => 'required|string|max:5',
            'profile_phone_number' => $this->phoneRules('profile_phone_country_code'),
            'profile_bio' => 'nullable|string|max:1000',

            // ID Document
            'profile_id_document_type' => ['required', Rule::in($this->idDocumentTypes())],
            'profile_id_number' => 'required|string|max:100',
            'profile_id_issuing_country' => $this->countryCodeRules(),
            'profile_id_expiry_date' => 'required|date|after:today',

            // Immigration Status
            'profile_immigration_status' => ['nullable', Rule::in($this->immigrationStatuses())],
            'profile_immigration_status_other' => 'nullable|string|max:100|required_if:profile_immigration_status,other',
            'profile_visa_type' => 'nullable|string|max:100|required_if:profile_immigration_status,visa_holder',
            'profile_visa_expiry_date' => 'nullable|date|after:today|required_if:profile_immigration_status,visa_holder',
            'profile_work_permit_number' => 'nullable|string|max:100',

            // Regional (optional)
            'profile_right_to_rent_share_code' => 'nullable|string|max:50',

            // Current Address
            'profile_current_house_number' => 'required|string|max:20',
            'profile_current_address_line_2' => 'nullable|string|max:100',
            'profile_current_street_name' => 'required|string|max:255',
            'profile_current_city' => 'required|string|max:100',
            'profile_current_state_province' => 'nullable|string|max:100',
            'profile_current_postal_code' => $this->postalCodeRules('profile_current_country'),
            'profile_current_country' => $this->countryCodeRules(),

            // ID Documents - nullable by default
            'profile_id_document_front' => $this->fileRule(),
            'profile_id_document_back' => $this->fileRule(),
        ];

        // Require ID documents if not already in profile
        if (! $tenantProfile?->id_document_front_path) {
            $rules['profile_id_document_front'] = $this->fileRule(true);
        }
        if (! $tenantProfile?->id_document_back_path) {
            $rules['profile_id_document_back'] = $this->fileRule(true);
        }

        // State/province required for certain countries
        $countryCode = $this->input('profile_current_country');
        if ($countryCode && in_array(strtoupper($countryCode), $this->countriesRequiringState())) {
            $rules['profile_current_state_province'] = 'required|string|max:100';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'profile_date_of_birth.required' => 'Date of birth is required',
            'profile_date_of_birth.before' => 'You must be at least 18 years old',
            'profile_nationality.required' => 'Nationality is required',
            'profile_phone_number.required' => 'Phone number is required',
            'profile_id_document_type.required' => 'ID document type is required',
            'profile_id_number.required' => 'ID number is required',
            'profile_id_issuing_country.required' => 'ID issuing country is required',
            'profile_id_expiry_date.required' => 'ID expiry date is required',
            'profile_id_expiry_date.after' => 'ID document must not be expired',
            'profile_id_document_front.required' => 'Front side of ID document is required',
            'profile_id_document_back.required' => 'Back side of ID document is required',
            'profile_current_street_name.required' => 'Street name is required',
            'profile_current_house_number.required' => 'House number is required',
            'profile_current_city.required' => 'City is required',
            'profile_current_postal_code.required' => 'Postal code is required',
            'profile_current_country.required' => 'Country is required',
            'profile_current_state_province.required' => 'State/Province is required for this country',
            'profile_immigration_status_other.required_if' => 'Please specify your immigration status',
            'profile_visa_type.required_if' => 'Visa type is required for visa holders',
            'profile_visa_expiry_date.required_if' => 'Visa expiry date is required',
            'profile_visa_expiry_date.after' => 'Visa must not be expired',
        ];
    }
}
