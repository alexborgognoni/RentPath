<?php

namespace App\Http\Requests\Property;

use App\Http\Requests\Traits\PropertyValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StorePropertyRequest extends FormRequest
{
    use PropertyValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->propertyManager !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = $this->publishRules();

        // Override images validation for delta-style upload
        unset($rules['images'], $rules['images.*']);

        // Add delta image handling rules
        $rules['new_images'] = 'nullable|array';
        $rules['new_images.*'] = 'image|mimes:jpeg,png,webp|max:5120';
        $rules['deleted_image_ids'] = 'nullable|array';
        $rules['deleted_image_ids.*'] = 'integer';
        $rules['image_order'] = 'nullable|array';
        $rules['image_order.*'] = 'string';
        $rules['main_image_id'] = 'nullable|integer';
        $rules['main_image_index'] = 'nullable|integer|min:0';

        // Add is_active flag
        $rules['is_active'] = 'nullable|boolean';

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        $messages = $this->validationMessages();

        // Add delta image messages
        $messages['new_images.*.image'] = 'Each file must be an image';
        $messages['new_images.*.mimes'] = 'Images must be JPEG, PNG, or WebP format';
        $messages['new_images.*.max'] = 'Each image must be less than 5MB';

        return $messages;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert boolean fields from strings
        $data = $this->all();
        $data = $this->convertBooleanFields($data);
        $this->merge($data);
    }

    /**
     * Get validated data with proper boolean conversion.
     */
    public function validatedWithBooleans(): array
    {
        $data = $this->validated();

        return $this->convertBooleanFields($data);
    }
}
