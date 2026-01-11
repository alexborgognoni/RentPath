<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 2: Household Composition
 *
 * Validates move-in details, occupants, pets, and emergency contact.
 */
class HouseholdStepRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            // Move-in & Lease
            'desired_move_in_date' => 'required|date|after:today',
            'lease_duration_months' => 'required|integer|min:1|max:60',
            'is_flexible_on_move_in' => 'nullable|boolean',
            'is_flexible_on_duration' => 'nullable|boolean',

            // Occupants
            'additional_occupants' => 'required|integer|min:0|max:20',
            'occupants_details' => 'nullable|array',
            'occupants_details.*.first_name' => 'required|string|max:100',
            'occupants_details.*.last_name' => 'required|string|max:100',
            'occupants_details.*.date_of_birth' => 'required|date',
            'occupants_details.*.relationship' => 'required|string|max:100',
            'occupants_details.*.relationship_other' => 'nullable|string|max:100',
            'occupants_details.*.will_sign_lease' => 'nullable|boolean',
            'occupants_details.*.is_dependent' => 'nullable|boolean',

            // Pets
            'has_pets' => 'required|boolean',
            'pets_details' => 'nullable|array',
            'pets_details.*.type' => 'required|string|max:100',
            'pets_details.*.type_other' => 'nullable|string|max:100',
            'pets_details.*.breed' => 'nullable|string|max:100',
            'pets_details.*.name' => 'nullable|string|max:100',
            'pets_details.*.age_years' => 'nullable|integer|min:0|max:50',
            'pets_details.*.weight_kg' => 'nullable|numeric|min:0',
            'pets_details.*.size' => ['nullable', Rule::in(['small', 'medium', 'large'])],
            'pets_details.*.is_registered_assistance_animal' => 'nullable|boolean',

            // Emergency Contact (optional, but if one field filled, validate all)
            'emergency_contact_first_name' => 'nullable|string|max:100',
            'emergency_contact_last_name' => 'nullable|string|max:100',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'emergency_contact_phone_country_code' => 'nullable|string|max:10',
            'emergency_contact_phone_number' => 'nullable|string|max:30',
            'emergency_contact_email' => 'nullable|email|max:255',

            // Message
            'message_to_landlord' => 'nullable|string|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'desired_move_in_date.required' => 'Move-in date is required',
            'desired_move_in_date.after' => 'Move-in date must be in the future',
            'lease_duration_months.required' => 'Lease duration is required',
            'lease_duration_months.min' => 'Lease duration must be at least 1 month',
            'lease_duration_months.max' => 'Lease duration cannot exceed 60 months',
            'additional_occupants.max' => 'Cannot have more than 20 additional occupants',
            'message_to_landlord.max' => 'Message cannot exceed 2000 characters',

            // Occupants
            'occupants_details.*.first_name.required' => 'First name is required',
            'occupants_details.*.first_name.max' => 'First name cannot exceed 100 characters',
            'occupants_details.*.last_name.required' => 'Last name is required',
            'occupants_details.*.last_name.max' => 'Last name cannot exceed 100 characters',
            'occupants_details.*.date_of_birth.required' => 'Date of birth is required',
            'occupants_details.*.relationship.required' => 'Relationship is required',

            // Pets
            'pets_details.*.type.required' => 'Pet type is required',
            'pets_details.*.age_years.max' => 'Pet age cannot exceed 50 years',
        ];
    }
}
