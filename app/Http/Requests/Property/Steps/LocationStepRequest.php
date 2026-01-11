<?php

namespace App\Http\Requests\Property\Steps;

use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Step 2: Location
 */
class LocationStepRequest extends FormRequest
{
    use PropertyValidationRules;

    protected ?Property $property = null;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function setProperty(Property $property): static
    {
        $this->property = $property;

        return $this;
    }

    public function rules(): array
    {
        return [
            'house_number' => 'required|string|max:'.self::$constraints['house_number']['max'],
            'street_name' => 'required|string|max:'.self::$constraints['street_name']['max'],
            'street_line2' => 'nullable|string|max:'.self::$constraints['street_line2']['max'],
            'city' => 'required|string|max:'.self::$constraints['city']['max'],
            'state' => 'nullable|string|max:'.self::$constraints['state']['max'],
            'postal_code' => 'required|string|max:'.self::$constraints['postal_code']['max'],
            'country' => 'required|string|size:'.self::$constraints['country']['length'],
        ];
    }

    public function messages(): array
    {
        return [
            'house_number.required' => 'House/building number is required',
            'house_number.max' => 'House number cannot exceed '.self::$constraints['house_number']['max'].' characters',
            'street_name.required' => 'Street name is required',
            'street_name.max' => 'Street name cannot exceed '.self::$constraints['street_name']['max'].' characters',
            'city.required' => 'City is required',
            'city.max' => 'City cannot exceed '.self::$constraints['city']['max'].' characters',
            'postal_code.required' => 'Postal code is required',
            'postal_code.max' => 'Postal code cannot exceed '.self::$constraints['postal_code']['max'].' characters',
            'country.required' => 'Country is required',
            'country.size' => 'Country code must be exactly 2 characters',
        ];
    }
}
