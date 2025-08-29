<?php

namespace App\Http\Controllers;

use App\Models\PropertyManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PropertyManagerController extends Controller
{
    /**
     * Show the form for creating a property manager profile.
     */
    public function create()
    {
        // Check if user already has a property manager profile
        if (Auth::user()->propertyManager) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('property-manager/setup', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Store a newly created property manager profile.
     */
    public function store(Request $request)
    {
        // Check if user already has a property manager profile
        if (Auth::user()->propertyManager) {
            return redirect()->route('dashboard')
                ->with('error', 'You already have a property manager profile.');
        }

        $validated = $request->validate([
            'type' => ['required', Rule::in(['individual', 'professional'])],
            'company_name' => 'nullable|string|max:255',
            'company_website' => 'nullable|url|max:255',
            'license_number' => 'nullable|string|max:255',
            'phone_number' => 'required|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'id_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120',
            'license_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ]);

        // Handle file uploads
        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture_path'] = $request->file('profile_picture')
                ->store('property-managers/profile-pictures', 'private');
        }

        if ($request->hasFile('id_document')) {
            $validated['id_document_path'] = $request->file('id_document')
                ->store('property-managers/id-documents', 'private');
        }

        if ($request->hasFile('license_document')) {
            $validated['license_document_path'] = $request->file('license_document')
                ->store('property-managers/license-documents', 'private');
        }

        // Remove file fields from validated data
        unset($validated['profile_picture'], $validated['id_document'], $validated['license_document']);

        // Create the property manager profile
        Auth::user()->propertyManager()->create($validated);

        return redirect()->route('dashboard')
            ->with('success', 'Property manager profile created successfully!');
    }

    /**
     * Show the form for editing the property manager profile.
     */
    public function edit()
    {
        $propertyManager = Auth::user()->propertyManager;
        
        if (!$propertyManager) {
            return redirect()->route('property-manager.create');
        }

        return Inertia::render('property-manager/edit', [
            'propertyManager' => $propertyManager,
            'user' => Auth::user(),
        ]);
    }

    /**
     * Update the property manager profile.
     */
    public function update(Request $request)
    {
        $propertyManager = Auth::user()->propertyManager;
        
        if (!$propertyManager) {
            return redirect()->route('property-manager.create');
        }

        $validated = $request->validate([
            'type' => ['required', Rule::in(['individual', 'professional'])],
            'company_name' => 'nullable|string|max:255',
            'company_website' => 'nullable|url|max:255',
            'license_number' => 'nullable|string|max:255',
            'phone_number' => 'required|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'id_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120',
            'license_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ]);

        // Handle file uploads
        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture_path'] = $request->file('profile_picture')
                ->store('property-managers/profile-pictures', 'private');
        }

        if ($request->hasFile('id_document')) {
            $validated['id_document_path'] = $request->file('id_document')
                ->store('property-managers/id-documents', 'private');
        }

        if ($request->hasFile('license_document')) {
            $validated['license_document_path'] = $request->file('license_document')
                ->store('property-managers/license-documents', 'private');
        }

        // Remove file fields from validated data
        unset($validated['profile_picture'], $validated['id_document'], $validated['license_document']);

        $propertyManager->update($validated);

        return redirect()->route('dashboard')
            ->with('success', 'Property manager profile updated successfully!');
    }
}
