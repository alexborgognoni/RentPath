<?php

namespace App\Http\Requests\Property\Steps;

use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Step 4: Amenities
 *
 * All fields optional boolean toggles.
 */
class AmenitiesStepRequest extends FormRequest
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
            'kitchen_equipped' => 'nullable|boolean',
            'kitchen_separated' => 'nullable|boolean',
            'has_cellar' => 'nullable|boolean',
            'has_laundry' => 'nullable|boolean',
            'has_fireplace' => 'nullable|boolean',
            'has_air_conditioning' => 'nullable|boolean',
            'has_garden' => 'nullable|boolean',
            'has_rooftop' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
