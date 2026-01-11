<?php

namespace App\Services;

use App\Helpers\StorageHelper;
use App\Http\Requests\Property\Steps\AmenitiesStepRequest;
use App\Http\Requests\Property\Steps\EnergyStepRequest;
use App\Http\Requests\Property\Steps\LocationStepRequest;
use App\Http\Requests\Property\Steps\MediaStepRequest;
use App\Http\Requests\Property\Steps\PricingStepRequest;
use App\Http\Requests\Property\Steps\SpecsStepRequest;
use App\Http\Requests\Property\Steps\TypeStepRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Support\Facades\Validator;

/**
 * Property wizard service.
 *
 * Handles all property wizard logic: drafts, validation, publishing.
 * Single source of truth for property business logic.
 */
class PropertyService
{
    /**
     * Step request class mapping.
     */
    private const STEP_REQUESTS = [
        1 => TypeStepRequest::class,
        2 => LocationStepRequest::class,
        3 => SpecsStepRequest::class,
        4 => AmenitiesStepRequest::class,
        5 => EnergyStepRequest::class,
        6 => PricingStepRequest::class,
        7 => MediaStepRequest::class,
    ];

    /**
     * Boolean fields that need conversion.
     */
    private const BOOLEAN_FIELDS = [
        'has_elevator', 'kitchen_equipped', 'kitchen_separated', 'has_cellar',
        'has_laundry', 'has_fireplace', 'has_air_conditioning', 'has_garden', 'has_rooftop',
    ];

    /**
     * Create a new draft property.
     */
    public function createDraft(int $propertyManagerId, array $data): Property
    {
        $data = $this->convertBooleanFields($data);

        return Property::create([
            'property_manager_id' => $propertyManagerId,
            'status' => 'draft',
            'wizard_step' => 1,
            'title' => $data['title'] ?? '',
            'type' => $data['type'] ?? 'apartment',
            'subtype' => $data['subtype'] ?? 'studio',
            'house_number' => $data['house_number'] ?? '',
            'street_name' => $data['street_name'] ?? '',
            'city' => $data['city'] ?? '',
            'postal_code' => $data['postal_code'] ?? '',
            'country' => $data['country'] ?? 'CH',
            'bedrooms' => $data['bedrooms'] ?? 0,
            'bathrooms' => $data['bathrooms'] ?? 0,
            'rent_amount' => $data['rent_amount'] ?? 0,
            'rent_currency' => $data['rent_currency'] ?? 'eur',
        ]);
    }

    /**
     * Save draft and calculate max valid step.
     */
    public function saveDraft(Property $property, array $data, int $requestedStep): array
    {
        $data = $this->convertBooleanFields($data);
        $maxValidStep = $this->calculateMaxValidStep($data, $requestedStep, $property);

        $filteredData = $this->filterDraftFields($data);
        $filteredData['wizard_step'] = min($requestedStep, $maxValidStep);

        $property->update($filteredData);

        return [
            'maxValidStep' => $maxValidStep,
            'savedAt' => now()->toIso8601String(),
        ];
    }

    /**
     * Publish a draft property.
     *
     * @param  array  $options  Additional options: new_images, deleted_image_ids, image_order, main_image_id, main_image_index, is_active
     */
    public function publish(Property $property, array $data, array $options = []): Property
    {
        $data = $this->convertBooleanFields($data);

        // Set status based on is_active preference
        $isActive = $options['is_active'] ?? true;

        $property->update([
            ...$this->filterDraftFields($data),
            'status' => Property::STATUS_VACANT,
            'visibility' => $isActive ? Property::VISIBILITY_UNLISTED : Property::VISIBILITY_PRIVATE,
            'accepting_applications' => $isActive,
            'published_at' => now(),
        ]);

        // Handle image operations
        $this->handlePublishImages($property, $options);

        return $property;
    }

    /**
     * Handle image operations during publish.
     */
    private function handlePublishImages(Property $property, array $options): void
    {
        $newImages = $options['new_images'] ?? [];
        $deletedImageIds = $options['deleted_image_ids'] ?? [];
        $imageOrder = $options['image_order'] ?? [];
        $mainImageId = $options['main_image_id'] ?? null;
        $mainImageIndex = $options['main_image_index'] ?? 0;

        // 1. Delete removed images
        if (! empty($deletedImageIds)) {
            $this->deleteImages($property, $deletedImageIds);
        }

        // 2. Upload new images and track their IDs for ordering
        $newImageRecords = [];
        foreach ($newImages as $image) {
            $path = StorageHelper::store($image, 'properties/'.$property->id, 'private');
            $newImageRecords[] = $property->images()->create([
                'image_path' => $path,
                'sort_order' => 999, // Temporary, will be updated below
                'is_main' => false,
            ]);
        }

        // 3. Update ordering based on image_order array
        foreach ($imageOrder as $index => $orderValue) {
            if (str_starts_with($orderValue, 'new:')) {
                $newIndex = (int) substr($orderValue, 4);
                if (isset($newImageRecords[$newIndex])) {
                    $newImageRecords[$newIndex]->update(['sort_order' => $index]);
                }
            } else {
                $imageId = (int) $orderValue;
                $property->images()->where('id', $imageId)->update(['sort_order' => $index]);
            }
        }

        // 4. Set main image
        $property->images()->update(['is_main' => false]);
        if ($mainImageId !== null) {
            $property->images()->where('id', $mainImageId)->update(['is_main' => true]);
        } elseif (! empty($newImageRecords) && isset($newImageRecords[$mainImageIndex])) {
            $newImageRecords[$mainImageIndex]->update(['is_main' => true]);
        } elseif ($property->images()->count() > 0) {
            $property->images()->orderBy('sort_order')->first()?->update(['is_main' => true]);
        }
    }

    /**
     * Calculate the maximum valid step.
     */
    public function calculateMaxValidStep(array $data, int $requestedStep, Property $property): int
    {
        $validatedMaxStep = 0;

        for ($step = 1; $step <= min($requestedStep, 7); $step++) {
            $errors = $this->validateStep($step, $data, $property);

            if ($errors !== null) {
                break;
            }

            $validatedMaxStep = $step;
        }

        return $validatedMaxStep;
    }

    /**
     * Validate a specific step.
     *
     * @return array|null Errors array or null if valid
     */
    public function validateStep(int $step, array $data, Property $property): ?array
    {
        if (! isset(self::STEP_REQUESTS[$step])) {
            return null;
        }

        $requestClass = self::STEP_REQUESTS[$step];

        // Create instance directly (don't use app() as it binds to current HTTP request)
        $request = new $requestClass;
        $request->merge($data);

        if (method_exists($request, 'setProperty')) {
            $request->setProperty($property);
        }

        $validator = Validator::make($data, $request->rules(), $request->messages());

        // Run custom validation (withValidator)
        if (method_exists($request, 'withValidator')) {
            $request->withValidator($validator);
        }

        if ($validator->fails()) {
            return $validator->errors()->toArray();
        }

        return null;
    }

    /**
     * Find the first invalid step.
     */
    public function findFirstInvalidStep(array $data, Property $property): ?int
    {
        for ($step = 1; $step <= 7; $step++) {
            $errors = $this->validateStep($step, $data, $property);
            if ($errors !== null) {
                return $step;
            }
        }

        return null;
    }

    /**
     * Upload images for a property.
     */
    public function uploadImages(Property $property, array $images, ?int $mainImageIndex = null): void
    {
        $existingCount = $property->images()->count();

        foreach ($images as $index => $image) {
            $path = StorageHelper::store($image, 'properties/images', 'private');

            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $path,
                'is_main' => $mainImageIndex === $index && $existingCount === 0,
                'sort_order' => $existingCount + $index,
            ]);
        }
    }

    /**
     * Delete images by IDs.
     */
    public function deleteImages(Property $property, array $imageIds): void
    {
        $images = $property->images()->whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            StorageHelper::delete($image->image_path, 'private');
            $image->delete();
        }

        // If main image was deleted, set first remaining as main
        if ($property->images()->where('is_main', true)->doesntExist()) {
            $firstImage = $property->images()->orderBy('sort_order')->first();
            if ($firstImage) {
                $firstImage->update(['is_main' => true]);
            }
        }
    }

    /**
     * Set main image by ID.
     */
    public function setMainImage(Property $property, int $imageId): void
    {
        $property->images()->update(['is_main' => false]);
        $property->images()->where('id', $imageId)->update(['is_main' => true]);
    }

    /**
     * Reorder images.
     */
    public function reorderImages(Property $property, array $imageIds): void
    {
        foreach ($imageIds as $index => $imageId) {
            $property->images()->where('id', $imageId)->update(['sort_order' => $index]);
        }
    }

    /**
     * Convert boolean fields from strings.
     */
    private function convertBooleanFields(array $data): array
    {
        foreach (self::BOOLEAN_FIELDS as $field) {
            if (isset($data[$field])) {
                $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        return $data;
    }

    /**
     * Filter to property-only fields (exclude images and transient fields).
     */
    private function filterDraftFields(array $data): array
    {
        $excluded = [
            'images', 'new_images', 'deleted_image_ids', 'image_order',
            'main_image_index', 'main_image_id', 'wizard_step', 'is_active',
        ];

        return array_filter(
            $data,
            fn ($key) => ! in_array($key, $excluded),
            ARRAY_FILTER_USE_KEY
        );
    }
}
