<?php

namespace App\Http\Requests\Traits;

use Illuminate\Validation\Rule;

/**
 * Shared property validation rules and messages.
 *
 * This trait provides centralized validation rules that are consistent
 * with the frontend Zod schemas. Error messages must match exactly
 * with property-messages.ts for a consistent user experience.
 */
trait PropertyValidationRules
{
    /**
     * Property types and their valid subtypes.
     */
    protected static array $propertyTypes = [
        'apartment', 'house', 'room', 'commercial', 'industrial', 'parking',
    ];

    protected static array $subtypesByType = [
        'apartment' => ['studio', 'loft', 'duplex', 'triplex', 'penthouse', 'serviced'],
        'house' => ['detached', 'semi-detached', 'villa', 'bungalow'],
        'room' => ['private_room', 'student_room', 'co-living'],
        'commercial' => ['office', 'retail'],
        'industrial' => ['warehouse', 'factory'],
        'parking' => ['garage', 'indoor_spot', 'outdoor_spot'],
    ];

    protected static array $allSubtypes = [
        'studio', 'loft', 'duplex', 'triplex', 'penthouse', 'serviced',
        'detached', 'semi-detached', 'villa', 'bungalow',
        'private_room', 'student_room', 'co-living',
        'office', 'retail',
        'warehouse', 'factory',
        'garage', 'indoor_spot', 'outdoor_spot',
    ];

    protected static array $energyClasses = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

    protected static array $thermalInsulationClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    protected static array $heatingTypes = ['gas', 'electric', 'district', 'wood', 'heat_pump', 'other'];

    protected static array $currencies = ['eur', 'usd', 'gbp', 'chf'];

    /**
     * Validation constraints matching property-validation.ts
     */
    protected static array $constraints = [
        'house_number' => ['max' => 20],
        'street_name' => ['max' => 255],
        'street_line2' => ['max' => 255],
        'city' => ['max' => 100],
        'state' => ['max' => 100],
        'postal_code' => ['max' => 20],
        'country' => ['length' => 2],
        'bedrooms' => ['min' => 0, 'max' => 20],
        'bathrooms' => ['min' => 0, 'max' => 10],
        'size' => ['min' => 1, 'max' => 100000],
        'floor_level' => ['min' => -10, 'max' => 200],
        'year_built' => ['min' => 1800],
        'parking_spots_interior' => ['min' => 0, 'max' => 20],
        'parking_spots_exterior' => ['min' => 0, 'max' => 20],
        'balcony_size' => ['min' => 0, 'max' => 10000],
        'land_size' => ['min' => 0, 'max' => 1000000],
        'rent_amount' => ['min' => 0.01, 'max' => 999999.99],
        'title' => ['max' => 255],
        'description' => ['max' => 10000],
    ];

    /**
     * Get draft validation rules (relaxed - most fields nullable).
     */
    protected function draftRules(): array
    {
        return [
            // Step 1: Property Type
            'type' => ['nullable', Rule::in(self::$propertyTypes)],
            'subtype' => ['nullable', Rule::in(self::$allSubtypes)],

            // Step 2: Location
            'house_number' => 'nullable|string|max:'.self::$constraints['house_number']['max'],
            'street_name' => 'nullable|string|max:'.self::$constraints['street_name']['max'],
            'street_line2' => 'nullable|string|max:'.self::$constraints['street_line2']['max'],
            'city' => 'nullable|string|max:'.self::$constraints['city']['max'],
            'state' => 'nullable|string|max:'.self::$constraints['state']['max'],
            'postal_code' => 'nullable|string|max:'.self::$constraints['postal_code']['max'],
            'country' => 'nullable|string|size:'.self::$constraints['country']['length'],

            // Step 3: Specifications
            'bedrooms' => 'nullable|integer|min:'.self::$constraints['bedrooms']['min'].'|max:'.self::$constraints['bedrooms']['max'],
            'bathrooms' => 'nullable|numeric|min:'.self::$constraints['bathrooms']['min'].'|max:'.self::$constraints['bathrooms']['max'],
            'size' => 'nullable|numeric|min:0|max:'.self::$constraints['size']['max'],
            'floor_level' => 'nullable|integer|min:'.self::$constraints['floor_level']['min'].'|max:'.self::$constraints['floor_level']['max'],
            'has_elevator' => 'nullable|boolean',
            'year_built' => 'nullable|integer|min:'.self::$constraints['year_built']['min'].'|max:'.date('Y'),
            'parking_spots_interior' => 'nullable|integer|min:'.self::$constraints['parking_spots_interior']['min'].'|max:'.self::$constraints['parking_spots_interior']['max'],
            'parking_spots_exterior' => 'nullable|integer|min:'.self::$constraints['parking_spots_exterior']['min'].'|max:'.self::$constraints['parking_spots_exterior']['max'],
            'balcony_size' => 'nullable|numeric|min:'.self::$constraints['balcony_size']['min'].'|max:'.self::$constraints['balcony_size']['max'],
            'land_size' => 'nullable|numeric|min:'.self::$constraints['land_size']['min'].'|max:'.self::$constraints['land_size']['max'],

            // Step 4: Amenities
            'kitchen_equipped' => 'nullable|boolean',
            'kitchen_separated' => 'nullable|boolean',
            'has_cellar' => 'nullable|boolean',
            'has_laundry' => 'nullable|boolean',
            'has_fireplace' => 'nullable|boolean',
            'has_air_conditioning' => 'nullable|boolean',
            'has_garden' => 'nullable|boolean',
            'has_rooftop' => 'nullable|boolean',

            // Step 5: Energy
            'energy_class' => ['nullable', Rule::in(self::$energyClasses)],
            'thermal_insulation_class' => ['nullable', Rule::in(self::$thermalInsulationClasses)],
            'heating_type' => ['nullable', Rule::in(self::$heatingTypes)],

            // Step 6: Pricing
            'rent_amount' => 'nullable|numeric|min:0|max:'.self::$constraints['rent_amount']['max'],
            'rent_currency' => ['nullable', Rule::in(self::$currencies)],
            'available_date' => 'nullable|date',

            // Step 7: Media
            'title' => 'nullable|string|max:'.self::$constraints['title']['max'],
            'description' => 'nullable|string|max:'.self::$constraints['description']['max'],

            // Extras
            'extras' => 'nullable|json',

            // Wizard tracking
            'wizard_step' => 'nullable|integer|min:1|max:8',
        ];
    }

    /**
     * Get publish validation rules (strict - required fields enforced).
     */
    protected function publishRules(): array
    {
        return [
            // Step 1: Property Type
            'type' => ['required', Rule::in(self::$propertyTypes)],
            'subtype' => ['required', Rule::in(self::$allSubtypes)],

            // Step 2: Location
            'house_number' => 'required|string|max:'.self::$constraints['house_number']['max'],
            'street_name' => 'required|string|max:'.self::$constraints['street_name']['max'],
            'street_line2' => 'nullable|string|max:'.self::$constraints['street_line2']['max'],
            'city' => 'required|string|max:'.self::$constraints['city']['max'],
            'state' => 'nullable|string|max:'.self::$constraints['state']['max'],
            'postal_code' => 'required|string|max:'.self::$constraints['postal_code']['max'],
            'country' => 'required|string|size:'.self::$constraints['country']['length'],

            // Step 3: Specifications
            'bedrooms' => 'required|integer|min:'.self::$constraints['bedrooms']['min'].'|max:'.self::$constraints['bedrooms']['max'],
            'bathrooms' => 'required|numeric|min:'.self::$constraints['bathrooms']['min'].'|max:'.self::$constraints['bathrooms']['max'],
            'size' => 'nullable|numeric|min:'.self::$constraints['size']['min'].'|max:'.self::$constraints['size']['max'],
            'floor_level' => 'nullable|integer|min:'.self::$constraints['floor_level']['min'].'|max:'.self::$constraints['floor_level']['max'],
            'has_elevator' => 'nullable|boolean',
            'year_built' => 'nullable|integer|min:'.self::$constraints['year_built']['min'].'|max:'.date('Y'),
            'parking_spots_interior' => 'nullable|integer|min:'.self::$constraints['parking_spots_interior']['min'].'|max:'.self::$constraints['parking_spots_interior']['max'],
            'parking_spots_exterior' => 'nullable|integer|min:'.self::$constraints['parking_spots_exterior']['min'].'|max:'.self::$constraints['parking_spots_exterior']['max'],
            'balcony_size' => 'nullable|numeric|min:'.self::$constraints['balcony_size']['min'].'|max:'.self::$constraints['balcony_size']['max'],
            'land_size' => 'nullable|numeric|min:'.self::$constraints['land_size']['min'].'|max:'.self::$constraints['land_size']['max'],

            // Step 4: Amenities
            'kitchen_equipped' => 'nullable|boolean',
            'kitchen_separated' => 'nullable|boolean',
            'has_cellar' => 'nullable|boolean',
            'has_laundry' => 'nullable|boolean',
            'has_fireplace' => 'nullable|boolean',
            'has_air_conditioning' => 'nullable|boolean',
            'has_garden' => 'nullable|boolean',
            'has_rooftop' => 'nullable|boolean',

            // Step 5: Energy
            'energy_class' => ['nullable', Rule::in(self::$energyClasses)],
            'thermal_insulation_class' => ['nullable', Rule::in(self::$thermalInsulationClasses)],
            'heating_type' => ['nullable', Rule::in(self::$heatingTypes)],

            // Step 6: Pricing
            'rent_amount' => 'required|numeric|min:'.self::$constraints['rent_amount']['min'].'|max:'.self::$constraints['rent_amount']['max'],
            'rent_currency' => ['required', Rule::in(self::$currencies)],
            'available_date' => 'nullable|date|after_or_equal:today',

            // Step 7: Media
            'title' => 'required|string|max:'.self::$constraints['title']['max'],
            'description' => 'nullable|string|max:'.self::$constraints['description']['max'],

            // Images - at least one required for publishing new properties
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
            'main_image_index' => 'nullable|integer|min:0',

            // Extras
            'extras' => 'nullable|json',
        ];
    }

    /**
     * Get validation messages matching property-messages.ts exactly.
     */
    protected function validationMessages(): array
    {
        return [
            // Step 1: Property Type
            'type.required' => 'Property type is required',
            'type.in' => 'Please select a valid property type',
            'subtype.required' => 'Property subtype is required',
            'subtype.in' => 'Please select a valid subtype for the selected property type',

            // Step 2: Location
            'house_number.required' => 'House/building number is required',
            'house_number.max' => 'House number cannot exceed '.self::$constraints['house_number']['max'].' characters',
            'street_name.required' => 'Street name is required',
            'street_name.max' => 'Street name cannot exceed '.self::$constraints['street_name']['max'].' characters',
            'street_line2.max' => 'Address line 2 cannot exceed '.self::$constraints['street_line2']['max'].' characters',
            'city.required' => 'City is required',
            'city.max' => 'City cannot exceed '.self::$constraints['city']['max'].' characters',
            'state.max' => 'State/province cannot exceed '.self::$constraints['state']['max'].' characters',
            'postal_code.required' => 'Postal code is required',
            'postal_code.max' => 'Postal code cannot exceed '.self::$constraints['postal_code']['max'].' characters',
            'country.required' => 'Country is required',
            'country.size' => 'Country code must be exactly 2 characters',

            // Step 3: Specifications
            'bedrooms.required' => 'Number of bedrooms is required',
            'bedrooms.min' => 'Bedrooms cannot be less than '.self::$constraints['bedrooms']['min'],
            'bedrooms.max' => 'Bedrooms cannot exceed '.self::$constraints['bedrooms']['max'],
            'bedrooms.integer' => 'Bedrooms must be a whole number',
            'bathrooms.required' => 'Number of bathrooms is required',
            'bathrooms.min' => 'Bathrooms cannot be less than '.self::$constraints['bathrooms']['min'],
            'bathrooms.max' => 'Bathrooms cannot exceed '.self::$constraints['bathrooms']['max'],
            'bathrooms.numeric' => 'Bathrooms must be a number',
            'size.min' => 'Size must be greater than 0',
            'size.max' => 'Size cannot exceed '.number_format(self::$constraints['size']['max']).' sqm',
            'size.numeric' => 'Size must be a valid number',
            'floor_level.min' => 'Floor level cannot be less than '.self::$constraints['floor_level']['min'],
            'floor_level.max' => 'Floor level cannot exceed '.self::$constraints['floor_level']['max'],
            'floor_level.integer' => 'Floor level must be a whole number',
            'year_built.min' => 'Year built cannot be earlier than '.self::$constraints['year_built']['min'],
            'year_built.max' => 'Year built cannot be later than '.date('Y'),
            'year_built.integer' => 'Year must be a whole number',
            'parking_spots_interior.min' => 'Interior parking spots cannot be less than '.self::$constraints['parking_spots_interior']['min'],
            'parking_spots_interior.max' => 'Interior parking spots cannot exceed '.self::$constraints['parking_spots_interior']['max'],
            'parking_spots_interior.integer' => 'Parking spots must be a whole number',
            'parking_spots_exterior.min' => 'Exterior parking spots cannot be less than '.self::$constraints['parking_spots_exterior']['min'],
            'parking_spots_exterior.max' => 'Exterior parking spots cannot exceed '.self::$constraints['parking_spots_exterior']['max'],
            'parking_spots_exterior.integer' => 'Parking spots must be a whole number',
            'balcony_size.min' => 'Balcony size cannot be negative',
            'balcony_size.max' => 'Balcony size cannot exceed '.number_format(self::$constraints['balcony_size']['max']).' sqm',
            'balcony_size.numeric' => 'Balcony size must be a valid number',
            'land_size.min' => 'Land size cannot be negative',
            'land_size.max' => 'Land size cannot exceed '.number_format(self::$constraints['land_size']['max']).' sqm',
            'land_size.numeric' => 'Land size must be a valid number',

            // Step 5: Energy
            'energy_class.in' => 'Please select a valid energy class',
            'thermal_insulation_class.in' => 'Please select a valid thermal insulation class',
            'heating_type.in' => 'Please select a valid heating type',

            // Step 6: Pricing
            'rent_amount.required' => 'Rent amount is required',
            'rent_amount.min' => 'Rent amount must be greater than 0',
            'rent_amount.max' => 'Rent amount cannot exceed '.number_format(self::$constraints['rent_amount']['max']),
            'rent_amount.numeric' => 'Rent amount must be a valid number',
            'rent_currency.required' => 'Currency is required',
            'rent_currency.in' => 'Please select a valid currency',
            'available_date.date' => 'Please enter a valid date',
            'available_date.after_or_equal' => 'Available date must be today or in the future',

            // Step 7: Media
            'title.required' => 'Property title is required',
            'title.max' => 'Title cannot exceed '.self::$constraints['title']['max'].' characters',
            'description.max' => 'Description cannot exceed '.number_format(self::$constraints['description']['max']).' characters',

            // Images
            'images.required' => 'At least one photo is required',
            'images.min' => 'At least one photo is required',
            'images.*.image' => 'Each file must be an image',
            'images.*.mimes' => 'Images must be JPEG, PNG, or WebP format',
            'images.*.max' => 'Each image must be less than 10MB',
        ];
    }

    /**
     * Validate that subtype matches the property type.
     */
    protected function validateSubtypeMatchesType(array $data): bool
    {
        if (empty($data['type']) || empty($data['subtype'])) {
            return true; // Skip validation if either is missing
        }

        $validSubtypes = self::$subtypesByType[$data['type']] ?? [];

        return in_array($data['subtype'], $validSubtypes, true);
    }

    /**
     * Get the list of boolean fields that need special handling.
     */
    protected function getBooleanFields(): array
    {
        return [
            'has_elevator',
            'kitchen_equipped',
            'kitchen_separated',
            'has_cellar',
            'has_laundry',
            'has_fireplace',
            'has_air_conditioning',
            'has_garden',
            'has_rooftop',
        ];
    }

    /**
     * Convert boolean fields from strings to actual booleans.
     */
    protected function convertBooleanFields(array $data): array
    {
        foreach ($this->getBooleanFields() as $field) {
            if (isset($data[$field])) {
                $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        return $data;
    }
}
