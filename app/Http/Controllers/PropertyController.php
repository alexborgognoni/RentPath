<?php

namespace App\Http\Controllers;

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
        return Inertia::render('Properties/Create', [
            'propertyTypes' => Property::getTypeOptions(),
            'sizeUnits' => Property::getSizeUnitOptions(),
            'currencies' => Property::getCurrencyOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'house_number' => 'required|string|max:20',
            'street_name' => 'required|string|max:255',
            'street_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|size:2',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url|max:500',
            'image_path' => 'nullable|string|max:500',
            'type' => ['required', Rule::in([
                'apartment',
                'house',
                'condo',
                'townhouse',
                'studio',
                'loft',
                'room',
                'office',
                'garage',
                'storage',
                'warehouse',
                'retail',
                'commercial'
            ])],
            'bedrooms' => 'required|integer|min:0|max:20',
            'bathrooms' => 'required|numeric|min:0|max:10',
            'parking_spots' => 'required|integer|min:0|max:20',
            'size' => 'nullable|numeric|min:0|max:10000',
            'size_unit' => ['required', Rule::in(['square_meters', 'square_feet'])],
            'available_date' => 'nullable|date|after_or_equal:today',
            'rent_amount' => 'required|numeric|min:0|max:999999.99',
            'rent_currency' => ['required', Rule::in(['eur', 'usd', 'gbp', 'chf'])],
            'is_active' => 'boolean',
        ]);

        // Get the user's property manager profile
        $propertyManager = Auth::user()->propertyManager;
        
        if (!$propertyManager) {
            return redirect()->route('dashboard')
                ->with('error', 'You need to set up your property manager profile first.');
        }

        $property = $propertyManager->properties()->create($validated);

        return redirect()->route('property.show', $property)
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

        // $property->loadCount('tenantApplications as tenant_count');
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

        return Inertia::render('Properties/Edit', [
            'property' => $property,
            'propertyTypes' => Property::getTypeOptions(),
            'sizeUnits' => Property::getSizeUnitOptions(),
            'currencies' => Property::getCurrencyOptions(),
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
            'title' => 'required|string|max:255',
            'house_number' => 'required|string|max:20',
            'street_name' => 'required|string|max:255',
            'street_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|size:2',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url|max:500',
            'image_path' => 'nullable|string|max:500',
            'type' => ['required', Rule::in([
                'apartment',
                'house',
                'condo',
                'townhouse',
                'studio',
                'loft',
                'room',
                'office',
                'garage',
                'storage',
                'warehouse',
                'retail',
                'commercial'
            ])],
            'bedrooms' => 'required|integer|min:0|max:20',
            'bathrooms' => 'required|numeric|min:0|max:10',
            'parking_spots' => 'required|integer|min:0|max:20',
            'size' => 'nullable|numeric|min:0|max:10000',
            'size_unit' => ['required', Rule::in(['square_meters', 'square_feet'])],
            'available_date' => 'nullable|date|after_or_equal:today',
            'rent_amount' => 'required|numeric|min:0|max:999999.99',
            'rent_currency' => ['required', Rule::in(['eur', 'usd', 'gbp', 'chf'])],
            'is_active' => 'boolean',
        ]);

        $property->update($validated);

        return redirect()->route('property.show', $property)
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
        $property = Property::where('invite_token', $token)
            ->where('is_active', true)
            ->firstOrFail();

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
            'image_url' => $property->image_url,
            'type' => $property->type,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'size' => $property->size,
            'size_unit' => $property->size_unit,
            'rent_amount' => $property->rent_amount,
            'rent_currency' => $property->rent_currency,
            'formatted_rent' => $property->formatted_rent,
            'formatted_size' => $property->formatted_size,
            'tenant_count' => 0, // Always 0 for now
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
}
