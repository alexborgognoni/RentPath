<?php

namespace App\Http\Requests\Property;

use App\Enums\EnergyClass;
use App\Enums\HeatingType;
use App\Enums\OccupancyStatus;
use App\Enums\PropertyType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            // Core Info
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'country' => 'required|string',

            // Rent & Availability
            'occupancy_status' => [
                'required',
                new Enum(OccupancyStatus::class),
            ],
            'rent_amount' => 'required|integer',
            'security_deposit' => 'nullable|ineger',
            'available_from' => 'nullable|date|after_or_equal:today',
            'lease_term_months' => 'nullable|integer',

            // Property Details
            'property_type' => [
                'required',
                new Enum(PropertyType::class),
            ],
            'bedrooms' => [
                'not_required_if:property_type,garage',
                'integer',
                'min:0',
            ],
            'bathrooms' => [
                'not_required_if:property_type,garage',
                'integer',
                'min:0',
            ],
            'square_meters' => 'required|integer',
            'bathrooms' => [
                'not_required_if:property_type,garage',
                'integer',
            ],
            'total_floors' => ['required_if:property_type,apartment,studio,penthouse,duplex,triplex,loft'],
            'year_built' => 'nullable|integer',
            'furnished' => [
                'not_required_if:property_type,garage',
                'boolean',
            ],
            'pets_allowed' => [
                'not_required_if:property_type,garage',
                'boolean',
            ],
            'smoking_allowed' => [
                'not_required_if:property_type,garage',
                'boolean',
            ],
            'indoor_parking_spots' => 'required|integer',
            'outdoor_parking_spots' => 'required|integer',
            'heating_type' => [
                'required',
                new Enum(HeatingType::class),
            ],
            'energy_class' => [
                'required',
                new Enum(EnergyClass::class),
            ],

            // Visibility & Access
            'is_visible' => 'required|boolean',
            'is_active' => 'required|boolean',
            'is_invite_only' => 'required|boolean',
            'access_code' => 'nullable|string',

            // Timestamps & Auditing
            'created_by' => 'required|string'
        ];
    }

    public function messages()
    {
        return [
            // Core Info
            'title.required' => 'A property title is required',
            'title.string' => 'The title must be text',
            'title.max' => 'The title cannot exceed 255 characters',
            'description.string' => 'The description must be text',
            'price.required' => 'A price is required',
            'price.numeric' => 'The price must be a number',
            'address.required' => 'An address is required',
            'address.string' => 'The address must be text',
            'city.required' => 'A city is required',
            'city.string' => 'The city must be text',
            'postal_code.required' => 'A postal code is required',
            'postal_code.string' => 'The postal code must be text',
            'country.required' => 'A country is required',
            'country.string' => 'The country must be text',

            // Rent & Availability
            'occupancy_status.required' => 'Please select an occupancy status',
            'occupancy_status.Illuminate\Validation\Rules\Enum' => 'Invalid occupancy status selected',
            'rent_amount.required' => 'A rent amount is required',
            'rent_amount.integer' => 'Rent amount must be a whole number',
            'security_deposit.integer' => 'Security deposit must be a whole number',
            'available_from.required' => 'An available from date is required',
            'available_from.date' => 'Invalid date format',
            'available_from.after_or_equal' => 'Availability date cannot be in the past',
            'lease_term_months.integer' => 'Lease term must be a whole number of months',

            // Property Details
            'property_type.required' => 'Please select a property type',
            'property_type.Illuminate\Validation\Rules\Enum' => 'Invalid property type selected',
            'bedrooms.integer' => 'Number of bedrooms must be a whole number',
            'bedrooms.min' => 'Number of bedrooms cannot be negative',
            'bedrooms.not_required_if' => 'Bedrooms field is not required for garages',
            'bathrooms.integer' => 'Number of bathrooms must be a whole number',
            'bathrooms.min' => 'Number of bathrooms cannot be negative',
            'bathrooms.not_required_if' => 'Bathrooms field is not required for garages',
            'square_meters.required' => 'Square meters is required',
            'square_meters.integer' => 'Square meters must be a whole number',
            'total_floors.required_if' => 'Total floors is required for this property type',
            'year_built.integer' => 'Year built must be a valid year',
            'furnished.boolean' => 'Furnished must be yes or no',
            'furnished.not_required_if' => 'Furnished field is not required for garages',
            'pets_allowed.boolean' => 'Pets allowed must be yes or no',
            'pets_allowed.not_required_if' => 'Pets allowed field is not required for garages',
            'smoking_allowed.boolean' => 'Smoking allowed must be yes or no',
            'smoking_allowed.not_required_if' => 'Smoking allowed field is not required for garages',
            'indoor_parking_spots.required' => 'Please specify indoor parking spots (enter 0 if none)',
            'indoor_parking_spots.integer' => 'Indoor parking spots must be a whole number',
            'outdoor_parking_spots.required' => 'Please specify outdoor parking spots (enter 0 if none)',
            'outdoor_parking_spots.integer' => 'Outdoor parking spots must be a whole number',
            'heating_type.required' => 'Please select a heating type',
            'heating_type.Illuminate\Validation\Rules\Enum' => 'Invalid heating type selected',
            'energy_class.required' => 'Please select an energy class',
            'energy_class.Illuminate\Validation\Rules\Enum' => 'Invalid energy class selected',

            // Visibility & Access
            'is_visible.required' => 'Please specify visibility status',
            'is_visible.boolean' => 'Visibility must be yes or no',
            'is_active.required' => 'Please specify active status',
            'is_active.boolean' => 'Active status must be yes or no',
            'is_invite_only.required' => 'Please specify if property is invite-only',
            'is_invite_only.boolean' => 'Invite-only must be yes or no',
            'access_code.string' => 'Access code must be text',

            // Timestamps & Auditing
            'created_by.required' => 'Creator information is required',
            'created_by.string' => 'Creator information must be text'
        ];
    }
}
