<?php

namespace App\Http\Requests;

use App\Enums\EnergyClass;
use App\Enums\HeatingType;
use App\Enums\OccupancyStatus;
use App\Enums\PropertyType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdatePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            // Core Info
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'postal_code' => 'sometimes|string',
            'country' => 'sometimes|string',

            // Rent & Availability
            'occupancy_status' => [
                'sometimes',
                new Enum(OccupancyStatus::class),
            ],
            'rent_amount' => 'sometimes|integer',
            'security_deposit' => 'nullable|ineger',
            'available_from' => 'nullable|date|after_or_equal:today',
            'lease_term_months' => 'nullable|integer',

            // Property Details
            'property_type' => [
                'sometimes',
                new Enum(PropertyType::class),
            ],
            'bedrooms' => [
                'not_sometimes_if:property_type,garage',
                'integer',
                'min:0',
            ],
            'bathrooms' => [
                'not_sometimes_if:property_type,garage',
                'integer',
                'min:0',
            ],
            'square_meters' => 'sometimes|integer',
            'bathrooms' => 'sometimes|integer',
            'total_floors' => 'sometimes|integer',
            'year_built' => 'nullable|integer',
            'furnished' => 'sometimes|boolean',
            'pets_allowed' => 'sometimes|boolean',
            'smoking_allowed' => 'sometimes|boolean',
            'indoor_parking_spots' => 'sometimes|integer',
            'outdoor_parking_spots' => 'sometimes|integer',
            'heating_type' => [
                'sometimes',
                new Enum(HeatingType::class),
            ],
            'energy_class' => [
                'sometimes',
                new Enum(EnergyClass::class),
            ],

            // Visibility & Access
            'is_visible' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'is_invite_only' => 'sometimes|boolean',
            'access_code' => 'nullable|string',
        ];
    }
}
