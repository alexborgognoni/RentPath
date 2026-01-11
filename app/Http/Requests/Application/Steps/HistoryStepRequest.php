<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 5: Credit & Rental History
 *
 * Validates credit authorization, current/previous addresses, and references.
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
            // Credit Check Authorization
            'authorize_credit_check' => 'required|boolean|accepted',
            'authorize_background_check' => 'nullable|boolean',
            'credit_check_provider_preference' => ['nullable', Rule::in(['experian', 'equifax', 'transunion', 'illion_au', 'no_preference'])],
            'has_ccjs_or_bankruptcies' => 'nullable|boolean',
            'ccj_bankruptcy_details' => 'nullable|string|max:2000|required_if:has_ccjs_or_bankruptcies,true',
            'has_eviction_history' => 'nullable|boolean',
            'eviction_details' => 'nullable|string|max:2000|required_if:has_eviction_history,true',
            'self_reported_credit_score' => 'nullable|integer|min:300|max:850',

            // Current Address
            'current_living_situation' => ['required', Rule::in($this->livingSituations())],
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
            'reason_for_moving' => ['required', Rule::in($this->reasonsForMoving())],
            'reason_for_moving_other' => 'nullable|string|max:200|required_if:reason_for_moving,other',

            // Previous Addresses
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
            'previous_addresses.*.living_situation' => ['nullable', Rule::in($this->livingSituations())],
            'previous_addresses.*.monthly_rent' => 'nullable|numeric|min:0',
            'previous_addresses.*.rent_currency' => 'nullable|string|max:3',
            'previous_addresses.*.landlord_name' => 'nullable|string|max:200',
            'previous_addresses.*.landlord_contact' => 'nullable|string|max:200',
            'previous_addresses.*.can_contact_landlord' => 'nullable|boolean',

            // References
            'references' => 'nullable|array',
            'references.*.type' => ['required', Rule::in(['landlord', 'employer', 'personal', 'professional'])],
            'references.*.name' => 'required|string|max:200',
            'references.*.company' => 'nullable|string|max:200',
            'references.*.email' => 'required|email|max:255',
            'references.*.phone' => 'required|string|max:50',
            'references.*.property_address' => 'nullable|string|max:500',
            'references.*.tenancy_start_date' => 'nullable|date',
            'references.*.tenancy_end_date' => 'nullable|date',
            'references.*.monthly_rent_paid' => 'nullable|numeric|min:0',
            'references.*.job_title' => 'nullable|string|max:100',
            'references.*.relationship' => ['nullable', Rule::in(['professional', 'personal'])],
            'references.*.years_known' => 'nullable|integer|min:0|max:100',
            'references.*.consent_to_contact' => 'required|boolean|accepted',

            // Legacy reference fields (backward compatibility)
            'previous_landlord_name' => 'nullable|string|max:255',
            'previous_landlord_phone' => 'nullable|string|max:20',
            'previous_landlord_email' => 'nullable|email|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            // Credit
            'authorize_credit_check.required' => 'Credit check authorization is required',
            'authorize_credit_check.accepted' => 'You must authorize the credit check to proceed',
            'ccj_bankruptcy_details.required_if' => 'Please provide details about your CCJs or bankruptcies',
            'eviction_details.required_if' => 'Please provide details about your eviction history',

            // Current Address
            'current_living_situation.required' => 'Please select your current living situation',
            'current_address_street_name.required' => 'Street name is required',
            'current_address_house_number.required' => 'House number is required',
            'current_address_city.required' => 'City is required',
            'current_address_postal_code.required' => 'Postal code is required',
            'current_address_country.required' => 'Country is required',
            'current_address_move_in_date.required' => 'Move-in date is required',
            'current_address_move_in_date.before_or_equal' => 'Move-in date cannot be in the future',
            'current_monthly_rent.required_if' => 'Monthly rent is required for renters',
            'reason_for_moving.required' => 'Please select your reason for moving',
            'reason_for_moving_other.required_if' => 'Please specify your reason for moving',

            // Previous Addresses
            'previous_addresses.*.street_name.required' => 'Street name is required',
            'previous_addresses.*.city.required' => 'City is required',
            'previous_addresses.*.from_date.required' => 'Start date is required',
            'previous_addresses.*.to_date.required' => 'End date is required',
            'previous_addresses.*.to_date.after' => 'End date must be after start date',

            // References
            'references.*.name.required' => 'Reference name is required',
            'references.*.email.required' => 'Reference email is required',
            'references.*.email.email' => 'Please enter a valid email address',
            'references.*.phone.required' => 'Reference phone is required',
            'references.*.consent_to_contact.accepted' => 'Reference must consent to being contacted',
        ];
    }
}
