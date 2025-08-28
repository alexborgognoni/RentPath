<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the user's properties.
     */
    public function index()
    {
        $properties = Auth::user()->properties()
            ->with(['tenantApplications' => function ($query) {
                $query->selectRaw('property_id, count(*) as tenant_count')
                      ->groupBy('property_id');
            }])
            ->get()
            ->map(function ($property) {
                $property->tenant_count = $property->tenantApplications->first()?->tenant_count ?? 0;
                unset($property->tenantApplications);
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
            'address' => 'required|string|max:500',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url|max:500',
            'type' => ['required', Rule::in([
                'apartment', 'house', 'condo', 'townhouse', 'studio',
                'loft', 'room', 'office', 'garage', 'storage',
                'warehouse', 'retail', 'commercial'
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

        $property = Auth::user()->properties()->create($validated);

        return redirect()->route('properties.show', $property)
                        ->with('success', 'Property created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        // Ensure user owns this property
        if ($property->user_id !== Auth::id()) {
            abort(403);
        }

        // Load tenant applications count
        $property->loadCount('tenantApplications as tenant_count');
        
        return Inertia::render('Property', [
            'property' => $property,
            'propertyId' => (string) $property->id,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        // Ensure user owns this property
        if ($property->user_id !== Auth::id()) {
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
        // Ensure user owns this property
        if ($property->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url|max:500',
            'type' => ['required', Rule::in([
                'apartment', 'house', 'condo', 'townhouse', 'studio',
                'loft', 'room', 'office', 'garage', 'storage',
                'warehouse', 'retail', 'commercial'
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

        return redirect()->route('properties.show', $property)
                        ->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        // Ensure user owns this property
        if ($property->user_id !== Auth::id()) {
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
            'address' => $property->address,
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
        ]);
    }
}
