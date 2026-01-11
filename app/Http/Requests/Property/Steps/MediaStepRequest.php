<?php

namespace App\Http\Requests\Property\Steps;

use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Step 7: Media
 */
class MediaStepRequest extends FormRequest
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
            'title' => 'required|string|max:'.self::$constraints['title']['max'],
            'description' => 'nullable|string|max:'.self::$constraints['description']['max'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Property title is required',
            'title.max' => 'Title cannot exceed '.self::$constraints['title']['max'].' characters',
            'description.max' => 'Description cannot exceed '.number_format(self::$constraints['description']['max']).' characters',
        ];
    }
}
