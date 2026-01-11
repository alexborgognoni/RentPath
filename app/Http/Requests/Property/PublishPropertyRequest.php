<?php

namespace App\Http\Requests\Property;

use App\Http\Requests\Property\Steps\AmenitiesStepRequest;
use App\Http\Requests\Property\Steps\EnergyStepRequest;
use App\Http\Requests\Property\Steps\LocationStepRequest;
use App\Http\Requests\Property\Steps\MediaStepRequest;
use App\Http\Requests\Property\Steps\PricingStepRequest;
use App\Http\Requests\Property\Steps\SpecsStepRequest;
use App\Http\Requests\Property\Steps\TypeStepRequest;
use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Full property publish validation.
 *
 * Combines all step rules plus image requirements.
 */
class PublishPropertyRequest extends FormRequest
{
    use PropertyValidationRules;

    protected ?Property $property = null;

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

        // Can only publish drafts
        if ($property->status !== 'draft') {
            return false;
        }

        return true;
    }

    public function setProperty(Property $property): static
    {
        $this->property = $property;

        return $this;
    }

    /**
     * Get the validated data with boolean conversions applied.
     */
    public function validatedWithBooleans(): array
    {
        return $this->convertBooleanFields($this->validated());
    }

    public function rules(): array
    {
        $property = $this->route('property');
        $existingImageCount = $property ? $property->images()->count() : 0;
        $deletedImageIds = $this->input('deleted_image_ids', []);
        $deletedCount = is_array($deletedImageIds) ? count($deletedImageIds) : 0;
        $remainingImages = $existingImageCount - $deletedCount;

        // Support both 'images' (legacy) and 'new_images' (delta approach)
        $newImagesCount = count($this->file('new_images', []) ?: $this->file('images', []));

        // Require at least one image total (existing + new - deleted)
        $hasEnoughImages = ($remainingImages + $newImagesCount) >= 1;
        $imageRule = $hasEnoughImages ? 'nullable|array' : 'required|array|min:1';

        return array_merge(
            $this->getStepRules(TypeStepRequest::class),
            $this->getStepRules(LocationStepRequest::class),
            $this->getStepRules(SpecsStepRequest::class),
            $this->getStepRules(AmenitiesStepRequest::class),
            $this->getStepRules(EnergyStepRequest::class),
            $this->getStepRules(PricingStepRequest::class),
            $this->getStepRules(MediaStepRequest::class),
            [
                // Support both 'images' (legacy) and 'new_images' (delta approach)
                'images' => $imageRule,
                'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
                'new_images' => 'nullable|array',
                'new_images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
                'deleted_image_ids' => 'nullable|array',
                'deleted_image_ids.*' => 'integer',
                'image_order' => 'nullable|array',
                'image_order.*' => 'string',
                'main_image_id' => 'nullable|integer',
                'main_image_index' => 'nullable|integer|min:0',

                // Publishing options
                'is_active' => 'nullable|boolean',

                // Extras
                'extras' => 'nullable|json',
            ]
        );
    }

    public function messages(): array
    {
        return array_merge(
            $this->getStepMessages(TypeStepRequest::class),
            $this->getStepMessages(LocationStepRequest::class),
            $this->getStepMessages(SpecsStepRequest::class),
            $this->getStepMessages(AmenitiesStepRequest::class),
            $this->getStepMessages(EnergyStepRequest::class),
            $this->getStepMessages(PricingStepRequest::class),
            $this->getStepMessages(MediaStepRequest::class),
            [
                'images.required' => 'At least one photo is required',
                'images.min' => 'At least one photo is required',
                'images.*.image' => 'Each file must be an image',
                'images.*.mimes' => 'Images must be JPEG, PNG, or WebP format',
                'images.*.max' => 'Each image must be less than 10MB',
            ]
        );
    }

    /**
     * Configure the validator with additional step validations.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate subtype matches type
            if (! $this->validateSubtypeMatchesType($this->all())) {
                $validator->errors()->add('subtype', 'Please select a valid subtype for the selected property type');
            }

            // Validate specs for type
            $specsErrors = $this->validateSpecsForType($this->all());
            foreach ($specsErrors as $field => $message) {
                $validator->errors()->add($field, $message);
            }
        });
    }

    /**
     * Get rules from a step request class.
     */
    private function getStepRules(string $requestClass): array
    {
        $request = new $requestClass;
        $request->merge($this->all());

        if (method_exists($request, 'setProperty') && $this->property) {
            $request->setProperty($this->property);
        }

        return $request->rules();
    }

    /**
     * Get messages from a step request class.
     */
    private function getStepMessages(string $requestClass): array
    {
        return (new $requestClass)->messages();
    }
}
