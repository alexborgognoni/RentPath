<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
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
        
        if (!$propertyManager) {
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
     */
    public function create()
    {
        return Inertia::render('property-create', [
            'isEditing' => false,
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
                'garage', 'indoor_spot', 'outdoor_spot'
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
            'year_built' => 'nullable|integer|min:1800|max:' . date('Y'),

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

        if (!$propertyManager) {
            return redirect()->route('dashboard')
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
        if (!empty($images)) {
            foreach ($images as $index => $image) {
                $path = $image->store('properties/' . $property->id, 'properties');

                $property->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                    'is_main' => $index === $mainImageIndex,
                ]);
            }
        }

        return redirect()->route('dashboard')
            ->with('success', 'Property created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        // Load property images
        $property->load('images');

        // Set tenant count (will be implemented later)
        $property->tenant_count = 0;

        return Inertia::render('property', [
            'property' => $property,
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
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
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
    public function update(Request $request, Property $property)
    {
        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

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
                'garage', 'indoor_spot', 'outdoor_spot'
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
            'year_built' => 'nullable|integer|min:1800|max:' . date('Y'),

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

        // Update the property
        $property->update($validated);

        // Handle new image uploads
        if (!empty($images)) {
            // Delete old images
            foreach ($property->images as $oldImage) {
                Storage::disk('properties')->delete($oldImage->image_path);
                $oldImage->delete();
            }

            // Upload new images
            foreach ($images as $index => $image) {
                $path = $image->store('properties/' . $property->id, 'properties');

                $property->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                    'is_main' => $index === $mainImageIndex,
                ]);
            }
        }

        return redirect()->route('dashboard')
            ->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $property->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Property deleted successfully.');
    }

    /**
     * Find property by invite token for tenant applications.
     */
    public function findByToken(string $token)
    {
        $property = Property::where('invite_token', $token)->firstOrFail();

        // Check if token is valid
        if (!$property->hasValidInviteToken()) {
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
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
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
            'invite_url' => route('property.show', ['property' => $property->id]) . '?token=' . $token,
        ]);
    }

    /**
     * Invalidate the current invite token.
     */
    public function invalidateInviteToken(Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $property->invalidateInviteToken();

        return response()->json([
            'message' => 'Invite token invalidated successfully',
        ]);
    }

    /**
     * Toggle public apply URL access.
     */
    public function togglePublicAccess(Property $property)
    {
        // Ensure user owns this property
        $propertyManager = Auth::user()->propertyManager;
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $property->public_apply_url_enabled = !$property->public_apply_url_enabled;
        $property->save();

        return response()->json([
            'public_apply_url_enabled' => $property->public_apply_url_enabled,
        ]);
    }

    /**
     * Serve property image securely to authenticated property owner.
     */
    public function showImage(Property $property)
    {
        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        if (!$property->image_path) {
            abort(404, 'No image found for this property');
        }

        if (!Storage::disk('properties')->exists($property->image_path)) {
            abort(404, 'Image file not found');
        }

        $file = Storage::disk('properties')->get($property->image_path);
        $mimeType = Storage::disk('properties')->mimeType($property->image_path);

        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Serve property image via temporary signed URL for sharing.
     */
    public function showImageSigned(Request $request, Property $property)
    {
        if (!$request->hasValidSignature()) {
            abort(403, 'Invalid or expired signature');
        }

        if (!$property->image_path) {
            abort(404, 'No image found for this property');
        }

        if (!Storage::disk('properties')->exists($property->image_path)) {
            abort(404, 'Image file not found');
        }

        $file = Storage::disk('properties')->get($property->image_path);
        $mimeType = Storage::disk('properties')->mimeType($property->image_path);

        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Serve individual property image from property_images table.
     */
    public function showPropertyImage(Property $property, PropertyImage $propertyImage)
    {
        // Ensure the image belongs to the property
        if ($propertyImage->property_id !== $property->id) {
            abort(404);
        }

        // Ensure user owns this property through their property manager
        $propertyManager = Auth::user()->propertyManager;
        if (!$propertyManager || $property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        if (!Storage::disk('properties')->exists($propertyImage->image_path)) {
            abort(404, 'Image file not found');
        }

        $file = Storage::disk('properties')->get($propertyImage->image_path);
        $mimeType = Storage::disk('properties')->mimeType($propertyImage->image_path);

        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
