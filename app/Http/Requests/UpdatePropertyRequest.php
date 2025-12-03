<?php

namespace App\Http\Requests;

use App\Http\Requests\Traits\PropertyValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Request validation for updating an existing (published) property.
 *
 * Uses strict validation similar to publishing, since the property
 * is already live and must remain in a valid state.
 */
class UpdatePropertyRequest extends FormRequest
{
    use PropertyValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $property = $this->route('property');
        $propertyManager = $this->user()->propertyManager;

        // Must have a property manager profile
        if (! $propertyManager) {
            return false;
        }

        // Must own this property
        if ($property->property_manager_id !== $propertyManager->id) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return $this->publishRules();
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return $this->validationMessages();
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            // Validate that subtype matches the property type
            if (! $this->validateSubtypeMatchesType($this->all())) {
                $validator->errors()->add(
                    'subtype',
                    'Please select a valid subtype for the selected property type'
                );
            }
        });
    }

    /**
     * Get the validated data with boolean conversions applied.
     */
    public function validatedWithBooleans(): array
    {
        return $this->convertBooleanFields($this->validated());
    }
}
