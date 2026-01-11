<?php

namespace App\Http\Requests\Property\Steps;

use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 1: Property Type
 */
class TypeStepRequest extends FormRequest
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
            'type' => ['required', Rule::in(self::$propertyTypes)],
            'subtype' => ['required', Rule::in(self::$allSubtypes)],
        ];
    }

    /**
     * Configure the validator to check subtype matches type.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $this->validateSubtypeMatchesType($this->all())) {
                $validator->errors()->add('subtype', 'Please select a valid subtype for the selected property type');
            }
        });
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Property type is required',
            'type.in' => 'Please select a valid property type',
            'subtype.required' => 'Property subtype is required',
            'subtype.in' => 'Please select a valid subtype for the selected property type',
        ];
    }
}
