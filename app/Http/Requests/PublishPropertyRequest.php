<?php

namespace App\Http\Requests;

use App\Http\Requests\Traits\PropertyValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Request validation for publishing a property.
 *
 * Uses strict validation - all required fields must be present and valid.
 * This is used when publishing a draft or creating a new property directly.
 */
class PublishPropertyRequest extends FormRequest
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

        // If publishing an existing property, must own it and it must be a draft
        if ($property) {
            if ($property->property_manager_id !== $propertyManager->id) {
                return false;
            }

            if ($property->status !== 'draft') {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = $this->publishRules();

        // Remove old images rule
        unset($rules['images']);

        // Delta image handling rules
        $rules['new_images'] = 'nullable|array';
        $rules['new_images.*'] = 'image|mimes:jpeg,png,webp|max:5120';
        $rules['deleted_image_ids'] = 'nullable|array';
        $rules['deleted_image_ids.*'] = 'integer';
        $rules['image_order'] = 'nullable|array';
        $rules['image_order.*'] = 'string';
        $rules['main_image_id'] = 'nullable|integer';
        $rules['main_image_index'] = 'nullable|integer';

        return $rules;
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

            // Validate type-specific specifications requirements
            $specsErrors = $this->validateSpecsForType($this->all());
            foreach ($specsErrors as $field => $message) {
                $validator->errors()->add($field, $message);
            }

            // Calculate final image count after delta changes
            $property = $this->route('property');
            $existingCount = $property ? $property->images()->count() : 0;
            $deletedCount = count($this->input('deleted_image_ids', []));
            $newCount = count($this->file('new_images', []));
            $finalCount = $existingCount - $deletedCount + $newCount;

            // Must have at least one image to publish
            if ($finalCount < 1) {
                $validator->errors()->add('images', 'At least one photo is required');
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

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        $property = $this->route('property');

        if ($property && $property->status !== 'draft') {
            abort(400, 'Property is not a draft');
        }

        if (! $this->user()->propertyManager) {
            abort(403, 'Property manager profile required');
        }

        abort(403);
    }
}
