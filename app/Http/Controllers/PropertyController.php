<?php

namespace App\Http\Controllers;

use App\Helpers\StorageHelper;
use App\Http\Requests\PublishPropertyRequest;
use App\Http\Requests\SavePropertyDraftRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the user's properties.
     */
    public function index()
    {
        // Get the user's property manager profile
        $propertyManager = Auth::user()->propertyManager;

        if (! $propertyManager) {
            return response()->json([]);
        }

        $properties = $propertyManager->properties()
            // ->with(['tenantApplications' => function ($query) {
            //     $query->selectRaw('property_id, count(*) as tenant_count')
            //         ->groupBy('property_id');
            // }])
            ->get()
            ->map(function ($property) {
                // $property->tenant_count = $property->tenantApplications->first()?->tenant_count ?? 0;
                // unset($property->tenantApplications);
                $property->tenant_count = 0;

                return $property;
            });

        return response()->json($properties);
    }

    /**
     * Show the form for creating a new resource.
     * If a draft ID is provided, load the existing draft.
     */
    public function create(Request $request)
    {
        $draftId = $request->query('draft');
        $property = null;

        if ($draftId) {
            $propertyManager = Auth::user()->propertyManager;
            if ($propertyManager) {
                $property = $propertyManager->properties()
                    ->where('id', $draftId)
                    ->where('status', 'draft')
                    ->with('images')
                    ->first();

                if ($property) {
                    // Transform images to include URLs
                    $property->images = $property->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_url' => StorageHelper::url($image->image_path, 'private', 1440),
                            'image_path' => $image->image_path,
                            'is_main' => $image->is_main,
                            'sort_order' => $image->sort_order,
                        ];
                    })->sortBy('sort_order')->values();
                }
            }
        }

        return Inertia::render('property-create', [
            'property' => $property,
            'isEditing' => false,
            'isDraft' => $property !== null,
        ]);
    }

    /**
     * Create a new draft property.
     * Called when user starts the wizard to get a property ID for autosave.
     */
    public function createDraft(Request $request)
    {
        $propertyManager = Auth::user()->propertyManager;

        if (! $propertyManager) {
            return response()->json([
                'error' => 'Property manager profile required',
            ], 403);
        }

        // Create minimal draft property
        $property = $propertyManager->properties()->create([
            'status' => 'draft',
            'title' => '',
            'type' => $request->input('type', 'apartment'),
            'subtype' => $request->input('subtype', 'studio'),
            'house_number' => '',
            'street_name' => '',
            'city' => '',
            'postal_code' => '',
            'country' => 'CH',
            'bedrooms' => 0,
            'bathrooms' => 0,
            'rent_amount' => 0,
            'rent_currency' => 'eur',
        ]);

        return response()->json([
            'id' => $property->id,
            'status' => 'draft',
        ]);
    }

    /**
     * Save draft property data (autosave endpoint).
     * Uses relaxed validation since drafts can be incomplete.
     */
    public function saveDraft(SavePropertyDraftRequest $request, Property $property)
    {
        // Get validated data with boolean conversions
        $validated = $request->validatedWithBooleans();

        // Extract wizard_step before filling property
        $requestedStep = $validated['wizard_step'] ?? $property->wizard_step ?? 1;
        unset($validated['wizard_step']);

        $property->fill($validated);

        // Calculate max valid step based on current data
        $maxValidStep = $this->calculateMaxValidStep($property);

        // Update wizard_step (never exceed what was requested, but may reduce)
        $property->wizard_step = min($requestedStep, $maxValidStep);

        $property->save();

        return response()->json([
            'id' => $property->id,
            'status' => 'draft',
            'saved_at' => now()->toISOString(),
            'wizard_step' => $property->wizard_step,
            'max_valid_step' => $maxValidStep,
        ]);
    }

    /**
     * Type-specific required fields for specifications step.
     * Must match SPECS_REQUIRED_BY_TYPE in property-validation.ts
     */
    private static array $specsRequiredByType = [
        'apartment' => ['bedrooms' => ['min' => 0], 'bathrooms' => ['min' => 1], 'size' => true],
        'house' => ['bedrooms' => ['min' => 1], 'bathrooms' => ['min' => 1], 'size' => true],
        'room' => ['bathrooms' => ['min' => 0], 'size' => true],
        'commercial' => ['size' => true],
        'industrial' => ['size' => true],
        'parking' => [], // No required fields
    ];

    /**
     * Validate specifications step for a given property type.
     */
    private function validateSpecsStep(Property $property): bool
    {
        $requirements = self::$specsRequiredByType[$property->type] ?? [];

        // Validate bedrooms requirement
        if (isset($requirements['bedrooms'])) {
            $minBedrooms = $requirements['bedrooms']['min'];
            if ($property->bedrooms < $minBedrooms) {
                return false;
            }
        }

        // Validate bathrooms requirement
        if (isset($requirements['bathrooms'])) {
            $minBathrooms = $requirements['bathrooms']['min'];
            if ($property->bathrooms < $minBathrooms) {
                return false;
            }
        }

        // Validate size requirement
        if (isset($requirements['size']) && $requirements['size'] === true) {
            if ($property->size === null || $property->size <= 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Calculate the maximum valid wizard step based on property data.
     * Returns 1-indexed step number.
     */
    private function calculateMaxValidStep(Property $property): int
    {
        $steps = [
            // Step 1: property-type
            fn () => ! empty($property->type) && ! empty($property->subtype),
            // Step 2: location
            fn () => ! empty($property->house_number) && ! empty($property->street_name)
                 && ! empty($property->city) && ! empty($property->postal_code)
                 && ! empty($property->country),
            // Step 3: specifications (type-specific validation)
            fn () => $this->validateSpecsStep($property),
            // Step 4: amenities (optional)
            fn () => true,
            // Step 5: energy (optional)
            fn () => true,
            // Step 6: pricing
            fn () => $property->rent_amount > 0,
            // Step 7: media
            fn () => ! empty($property->title),
            // Step 8: review (all previous must be valid)
            fn () => true,
        ];

        for ($i = 0; $i < count($steps); $i++) {
            if (! $steps[$i]()) {
                return $i + 1; // Return 1-indexed step of first invalid
            }
        }

        return count($steps); // All steps valid
    }

    /**
     * Publish a draft property (changes status from draft to inactive/available).
     */
    public function publishDraft(PublishPropertyRequest $request, Property $property)
    {
        // Get validated data with boolean conversions
        $validated = $request->validatedWithBooleans();

        // Handle images
        $images = $request->file('images', []);
        $mainImageIndex = $request->input('main_image_index', 0);

        // Update property and change status
        $validated['status'] = 'inactive';
        unset($validated['images'], $validated['main_image_index']);

        $property->fill($validated);
        $property->save();

        // Handle image uploads if new images provided
        if (! empty($images)) {
            // Delete old images
            $disk = StorageHelper::getDisk('private');
            foreach ($property->images as $oldImage) {
                Storage::disk($disk)->delete($oldImage->image_path);
                $oldImage->delete();
            }

            // Upload new images
            foreach ($images as $index => $image) {
                $path = StorageHelper::store($image, 'properties/'.$property->id, 'private');
                $property->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                    'is_main' => $index === (int) $mainImageIndex,
                ]);
            }
        }

        return redirect()->route('manager.properties.index')
            ->with('success', 'Property published successfully.');
    }

    /**
     * Delete a draft property.
     */
    public function deleteDraft(Property $property)
    {
        $propertyManager = Auth::user()->propertyManager;

        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        if ($property->status !== 'draft') {
            return response()->json([
                'error' => 'Can only delete draft properties via this endpoint',
            ], 400);
        }

        // Delete associated images from storage
        $disk = StorageHelper::getDisk('private');
        foreach ($property->images as $image) {
            Storage::disk($disk)->delete($image->image_path);
        }

        $property->delete();

        return response()->json([
            'message' => 'Draft deleted successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Basic info
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',

            // Address
            'house_number' => 'required|string|max:20',
            'street_name' => 'required|string|max:255',
            'street_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|size:2',

            // Type
            'type' => ['required', Rule::in(['apartment', 'house', 'room', 'commercial', 'industrial', 'parking'])],
            'subtype' => ['required', Rule::in([
                'studio', 'loft', 'duplex', 'triplex', 'penthouse', 'serviced',
                'detached', 'semi-detached', 'villa', 'bungalow',
                'private_room', 'student_room', 'co-living',
                'office', 'retail',
                'warehouse', 'factory',
                'garage', 'indoor_spot', 'outdoor_spot',
            ])],

            // Specifications
            'bedrooms' => 'required|integer|min:0|max:20',
            'bathrooms' => 'required|numeric|min:0|max:10',
            'parking_spots_interior' => 'nullable|integer|min:0|max:20',
            'parking_spots_exterior' => 'nullable|integer|min:0|max:20',
            'size' => 'nullable|numeric|min:0|max:100000',
            'balcony_size' => 'nullable|numeric|min:0|max:10000',
            'land_size' => 'nullable|numeric|min:0|max:1000000',
            'floor_level' => 'nullable|integer',
            'has_elevator' => 'nullable|boolean',
            'year_built' => 'nullable|integer|min:1800|max:'.date('Y'),

            // Energy/Building
            'energy_class' => ['nullable', Rule::in(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'])],
            'thermal_insulation_class' => ['nullable', Rule::in(['A', 'B', 'C', 'D', 'E', 'F', 'G'])],
            'heating_type' => ['nullable', Rule::in(['gas', 'electric', 'district', 'wood', 'heat_pump', 'other'])],

            // Kitchen
            'kitchen_equipped' => 'nullable|boolean',
            'kitchen_separated' => 'nullable|boolean',

            // Amenities
            'has_cellar' => 'nullable|boolean',
            'has_laundry' => 'nullable|boolean',
            'has_fireplace' => 'nullable|boolean',
            'has_air_conditioning' => 'nullable|boolean',
            'has_garden' => 'nullable|boolean',
            'has_rooftop' => 'nullable|boolean',
            'extras' => 'nullable|json',

            // Rental
            'rent_amount' => 'required|numeric|min:0|max:999999.99',
            'rent_currency' => ['required', Rule::in(['eur', 'usd', 'gbp', 'chf'])],
            'available_date' => 'nullable|date|after_or_equal:today',

            // Images
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max
            'main_image_index' => 'nullable|integer|min:0',
        ]);

        // Get the user's property manager profile
        $propertyManager = Auth::user()->propertyManager;

        if (! $propertyManager) {
            return redirect()->route('profile.setup')
                ->with('error', 'You need to set up your property manager profile first.');
        }

        // Set default status
        $validated['status'] = 'inactive';

        // Convert boolean fields from strings to actual booleans
        $booleanFields = ['has_elevator', 'kitchen_equipped', 'kitchen_separated', 'has_cellar',
            'has_laundry', 'has_fireplace', 'has_air_conditioning', 'has_garden', 'has_rooftop'];
        foreach ($booleanFields as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = filter_var($validated[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        // Remove images from validated data
        $images = $request->file('images', []);
        $mainImageIndex = $validated['main_image_index'] ?? 0;
        unset($validated['images'], $validated['main_image_index']);

        // Create the property
        $property = $propertyManager->properties()->create($validated);

        // Handle image uploads
        if (! empty($images)) {
            foreach ($images as $index => $image) {
                $path = StorageHelper::store($image, 'properties/'.$property->id, 'private');

                $property->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                    'is_main' => $index === $mainImageIndex,
                ]);
            }
        }

        return redirect()->route('manager.properties.index')
            ->with('success', 'Property created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        // Load property images
        $property->load('images');

        // Transform images to include URLs
        $imagesWithUrls = $property->images->map(function ($image) {
            return [
                'id' => $image->id,
                'image_url' => StorageHelper::url($image->image_path, 'private', 1440),
                'image_path' => $image->image_path,
                'is_main' => $image->is_main,
                'sort_order' => $image->sort_order,
            ];
        })->sortBy('sort_order')->values();

        // Build property data
        $propertyData = $property->toArray();
        $propertyData['images'] = $imagesWithUrls;
        $propertyData['tenant_count'] = 0; // Will be implemented later

        // Add default token if requires_invite is enabled
        $propertyData['default_token'] = null;
        if ($property->requires_invite) {
            $defaultTokenModel = $property->getOrCreateDefaultToken();
            $propertyData['default_token'] = [
                'token' => $defaultTokenModel->token,
                'used_count' => $defaultTokenModel->used_count,
            ];
        }

        return Inertia::render('property', [
            'property' => $propertyData,
            'propertyId' => (string) $property->id,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        // Load property with images
        $property->load('images');

        return Inertia::render('property-create', [
            'property' => $property,
            'isEditing' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyRequest $request, Property $property)
    {
        // Get validated data with boolean conversions
        $validated = $request->validatedWithBooleans();

        // Remove images from validated data
        $images = $request->file('images', []);
        $mainImageIndex = $validated['main_image_index'] ?? 0;
        unset($validated['images'], $validated['main_image_index']);

        // Update the property
        $property->update($validated);

        // Handle new image uploads
        if (! empty($images)) {
            // Delete old images
            $disk = StorageHelper::getDisk('private');
            foreach ($property->images as $oldImage) {
                Storage::disk($disk)->delete($oldImage->image_path);
                $oldImage->delete();
            }

            // Upload new images
            foreach ($images as $index => $image) {
                $path = StorageHelper::store($image, 'properties/'.$property->id, 'private');

                $property->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                    'is_main' => $index === $mainImageIndex,
                ]);
            }
        }

        return redirect()->route('manager.properties.index')
            ->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $property->delete();

        return redirect()->route('manager.properties.index')
            ->with('success', 'Property deleted successfully.');
    }

    /**
     * Find property by invite token for tenant applications.
     */
    public function findByToken(string $token)
    {
        $property = Property::where('invite_token', $token)->firstOrFail();

        // Check if token is valid
        if (! $property->hasValidInviteToken()) {
            abort(403, 'Invite link has expired or is invalid');
        }

        return response()->json([
            'id' => $property->id,
            'title' => $property->title,
            'house_number' => $property->house_number,
            'street_name' => $property->street_name,
            'street_line2' => $property->street_line2,
            'city' => $property->city,
            'state' => $property->state,
            'postal_code' => $property->postal_code,
            'country' => $property->country,
            'type' => $property->type,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'size' => $property->size,
            'rent_amount' => $property->rent_amount,
            'rent_currency' => $property->rent_currency,
            'formatted_rent' => $property->formatted_rent,
            'formatted_size' => $property->formatted_size,
            'tenant_count' => 0, // Always 0 for now
        ]);
    }

    /**
     * Generate a new invite token for the property.
     */
    public function generateInviteToken(Request $request, Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $validated = $request->validate([
            'expiration_days' => 'nullable|integer|min:1|max:365',
        ]);

        $expirationDays = $validated['expiration_days'] ?? 30;
        $token = $property->generateInviteToken($expirationDays);

        return response()->json([
            'token' => $token,
            'expires_at' => $property->invite_token_expires_at,
            'invite_url' => route('properties.show', ['property' => $property->id]).'?token='.$token,
        ]);
    }

    /**
     * Invalidate the current invite token.
     */
    public function invalidateInviteToken(Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $property->invalidateInviteToken();

        return response()->json([
            'message' => 'Invite token invalidated successfully',
        ]);
    }

    /**
     * Toggle invite requirement for applications.
     * When enabling for the first time, creates default token.
     */
    public function togglePublicAccess(Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $property->requires_invite = ! $property->requires_invite;
        $property->save();

        // If enabling requires_invite for first time, create default token
        $defaultToken = null;
        if ($property->requires_invite) {
            $defaultToken = $property->getOrCreateDefaultToken();
        }

        return response()->json([
            'requires_invite' => $property->requires_invite,
            'default_token' => $defaultToken ? [
                'token' => $defaultToken->token,
                'used_count' => $defaultToken->used_count,
            ] : null,
        ]);
    }

    /**
     * Regenerate the default invite token.
     */
    public function regenerateDefaultToken(Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $defaultToken = $property->regenerateDefaultToken();

        return response()->json([
            'token' => $defaultToken->token,
            'used_count' => $defaultToken->used_count,
        ]);
    }

    /**
     * Get all invite tokens for a property.
     */
    public function getInviteTokens(Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $tokens = $property->inviteTokens()->get()->map(function ($token) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'token' => $token->token,
                'type' => $token->type,
                'email' => $token->email,
                'max_uses' => $token->max_uses,
                'used_count' => $token->used_count,
                'expires_at' => $token->expires_at?->toISOString(),
                'is_valid' => $token->isValid(),
                'is_default' => $token->isDefault(),
            ];
        });

        return response()->json([
            'tokens' => $tokens,
        ]);
    }

    /**
     * Create a custom invite token.
     */
    public function createCustomToken(Request $request, Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'type' => 'required|in:private,invite',
            'email' => 'nullable|required_if:type,invite|email',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after:today',
        ]);

        $tokenData = [
            'name' => $validated['name'] ?? null,
            'type' => $validated['type'],
            'email' => $validated['email'] ?? null,
            'max_uses' => $validated['max_uses'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
        ];

        $token = $property->createCustomToken($tokenData);

        return response()->json([
            'id' => $token->id,
            'name' => $token->name,
            'token' => $token->token,
            'type' => $token->type,
            'email' => $token->email,
            'max_uses' => $token->max_uses,
            'used_count' => $token->used_count,
            'expires_at' => $token->expires_at?->toISOString(),
            'is_valid' => $token->isValid(),
        ]);
    }

    /**
     * Update a custom invite token.
     */
    public function updateCustomToken(Request $request, Property $property, $tokenId)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $token = $property->inviteTokens()->findOrFail($tokenId);

        // Cannot edit default token via this endpoint
        if ($token->isDefault()) {
            abort(403, 'Cannot edit default token');
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'max_uses' => 'nullable|integer|min:1',
            'expires_in_days' => 'nullable|integer|min:1|max:365',
        ]);

        $updates = [
            'name' => $validated['name'] ?? $token->name,
            'max_uses' => $validated['max_uses'] ?? $token->max_uses,
        ];

        if (isset($validated['expires_in_days'])) {
            $updates['expires_at'] = now()->addDays($validated['expires_in_days']);
        }

        $token->update($updates);

        return response()->json([
            'id' => $token->id,
            'name' => $token->name,
            'token' => $token->token,
            'type' => $token->type,
            'email' => $token->email,
            'max_uses' => $token->max_uses,
            'used_count' => $token->used_count,
            'expires_at' => $token->expires_at?->toISOString(),
            'is_valid' => $token->isValid(),
        ]);
    }

    /**
     * Delete a custom invite token.
     */
    public function deleteCustomToken(Property $property, $tokenId)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (! $propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $token = $property->inviteTokens()->findOrFail($tokenId);

        // Cannot delete default token
        if ($token->isDefault()) {
            abort(403, 'Cannot delete default token');
        }

        $token->delete();

        return response()->json([
            'message' => 'Token deleted successfully',
        ]);
    }
}
