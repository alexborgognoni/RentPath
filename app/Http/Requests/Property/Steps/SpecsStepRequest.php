<?php

namespace App\Http\Requests\Property\Steps;

use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Step 3: Specifications
 *
 * Type-specific validation for bedrooms, bathrooms, size, etc.
 */
class SpecsStepRequest extends FormRequest
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
        ];
    }

    /**
     * Validate type-specific requirements after standard validation.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $errors = $this->validateSpecsForType($this->all());
            foreach ($errors as $field => $message) {
                $validator->errors()->add($field, $message);
            }
        });
    }

    public function messages(): array
    {
        return [
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
        ];
    }
}
