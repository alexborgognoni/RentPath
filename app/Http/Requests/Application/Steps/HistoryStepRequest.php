<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 5: Credit & Rental History
 *
 * Validates credit authorization, current/previous addresses, and references.
 * All fields are stored in TenantProfile (profile_ prefix).
 */
class HistoryStepRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            // Credit Check Authorization (stored in TenantProfile)
            'profile_authorize_credit_check' => 'required|boolean|accepted',
            'profile_authorize_background_check' => 'nullable|boolean',
            'profile_credit_check_provider_preference' => ['nullable', Rule::in(['experian', 'equifax', 'transunion', 'illion_au', 'no_preference'])],
            'profile_has_ccjs_or_bankruptcies' => 'nullable|boolean',
            'profile_ccj_bankruptcy_details' => 'nullable|string|max:2000|required_if:profile_has_ccjs_or_bankruptcies,true',
            'profile_has_eviction_history' => 'nullable|boolean',
            'profile_eviction_details' => 'nullable|string|max:2000|required_if:profile_has_eviction_history,true',

            // Current Address (uses existing profile current address fields)
            'profile_current_living_situation' => ['required', Rule::in($this->livingSituations())],
            'profile_current_street_name' => 'required|string|max:255',
            'profile_current_house_number' => 'required|string|max:20',
            'profile_current_address_line_2' => 'nullable|string|max:100',
            'profile_current_city' => 'required|string|max:100',
            'profile_current_state_province' => 'nullable|string|max:100',
            'profile_current_postal_code' => 'required|string|max:20',
            'profile_current_country' => 'required|string|max:2',
            'profile_current_address_move_in_date' => 'required|date|before_or_equal:today',
            'profile_current_monthly_rent' => 'nullable|numeric|min:0|required_if:profile_current_living_situation,renting',
            'profile_current_rent_currency' => 'nullable|string|max:3',
            'profile_current_landlord_name' => 'nullable|string|max:200',
            'profile_current_landlord_contact' => 'nullable|string|max:200',
            'profile_reason_for_moving' => ['required', Rule::in($this->reasonsForMoving())],
            'profile_reason_for_moving_other' => 'nullable|string|max:200|required_if:profile_reason_for_moving,other',

            // Previous Addresses (stored in TenantProfile as JSON)
            'profile_previous_addresses' => 'nullable|array|max:5',
            'profile_previous_addresses.*.street_name' => 'required|string|max:255',
            'profile_previous_addresses.*.house_number' => 'required|string|max:20',
            'profile_previous_addresses.*.address_line_2' => 'nullable|string|max:100',
            'profile_previous_addresses.*.city' => 'required|string|max:100',
            'profile_previous_addresses.*.state_province' => 'nullable|string|max:100',
            'profile_previous_addresses.*.postal_code' => 'required|string|max:20',
            'profile_previous_addresses.*.country' => 'required|string|max:2',
            'profile_previous_addresses.*.from_date' => 'required|date',
            'profile_previous_addresses.*.to_date' => 'required|date|after:profile_previous_addresses.*.from_date',
            'profile_previous_addresses.*.living_situation' => ['nullable', Rule::in($this->livingSituations())],
            'profile_previous_addresses.*.monthly_rent' => 'nullable|numeric|min:0',
            'profile_previous_addresses.*.rent_currency' => 'nullable|string|max:3',
            'profile_previous_addresses.*.landlord_name' => 'nullable|string|max:200',
            'profile_previous_addresses.*.landlord_contact' => 'nullable|string|max:200',
            'profile_previous_addresses.*.can_contact_landlord' => 'nullable|boolean',

            // Landlord References (stored in TenantProfile as JSON)
            'profile_landlord_references' => 'nullable|array|max:3',
            'profile_landlord_references.*.name' => 'required|string|max:200',
            'profile_landlord_references.*.company' => 'nullable|string|max:200',
            'profile_landlord_references.*.email' => 'required|email|max:255',
            'profile_landlord_references.*.phone' => 'required|string|max:50',
            'profile_landlord_references.*.property_address' => 'nullable|string|max:500',
            'profile_landlord_references.*.tenancy_start_date' => 'nullable|date',
            'profile_landlord_references.*.tenancy_end_date' => 'nullable|date',
            'profile_landlord_references.*.monthly_rent_paid' => 'nullable|numeric|min:0',
            'profile_landlord_references.*.consent_to_contact' => 'required|boolean|accepted',

            // Other References (stored in TenantProfile as JSON)
            'profile_other_references' => 'nullable|array|max:2',
            'profile_other_references.*.name' => 'required|string|max:200',
            'profile_other_references.*.email' => 'required|email|max:255',
            'profile_other_references.*.phone' => 'required|string|max:50',
            'profile_other_references.*.relationship' => ['required', Rule::in(['professional', 'personal'])],
            'profile_other_references.*.years_known' => 'nullable|integer|min:0|max:100',
            'profile_other_references.*.consent_to_contact' => 'required|boolean|accepted',
        ];
    }

    public function messages(): array
    {
        return [
            // Credit
            'profile_authorize_credit_check.required' => 'Credit check authorization is required',
            'profile_authorize_credit_check.accepted' => 'You must authorize the credit check to proceed',
            'profile_ccj_bankruptcy_details.required_if' => 'Please provide details about your CCJs or bankruptcies',
            'profile_eviction_details.required_if' => 'Please provide details about your eviction history',

            // Current Address
            'profile_current_living_situation.required' => 'Please select your current living situation',
            'profile_current_street_name.required' => 'Street name is required',
            'profile_current_house_number.required' => 'House number is required',
            'profile_current_city.required' => 'City is required',
            'profile_current_postal_code.required' => 'Postal code is required',
            'profile_current_country.required' => 'Country is required',
            'profile_current_address_move_in_date.required' => 'Move-in date is required',
            'profile_current_address_move_in_date.before_or_equal' => 'Move-in date cannot be in the future',
            'profile_current_monthly_rent.required_if' => 'Monthly rent is required for renters',
            'profile_reason_for_moving.required' => 'Please select your reason for moving',
            'profile_reason_for_moving_other.required_if' => 'Please specify your reason for moving',

            // Previous Addresses
            'profile_previous_addresses.*.street_name.required' => 'Street name is required',
            'profile_previous_addresses.*.city.required' => 'City is required',
            'profile_previous_addresses.*.from_date.required' => 'Start date is required',
            'profile_previous_addresses.*.to_date.required' => 'End date is required',
            'profile_previous_addresses.*.to_date.after' => 'End date must be after start date',

            // Landlord References
            'profile_landlord_references.*.name.required' => 'Reference name is required',
            'profile_landlord_references.*.email.required' => 'Reference email is required',
            'profile_landlord_references.*.email.email' => 'Please enter a valid email address',
            'profile_landlord_references.*.phone.required' => 'Reference phone is required',
            'profile_landlord_references.*.consent_to_contact.accepted' => 'Reference must consent to being contacted',

            // Other References
            'profile_other_references.*.name.required' => 'Reference name is required',
            'profile_other_references.*.email.required' => 'Reference email is required',
            'profile_other_references.*.email.email' => 'Please enter a valid email address',
            'profile_other_references.*.phone.required' => 'Reference phone is required',
            'profile_other_references.*.relationship.required' => 'Reference relationship is required',
            'profile_other_references.*.consent_to_contact.accepted' => 'Reference must consent to being contacted',
        ];
    }
}
