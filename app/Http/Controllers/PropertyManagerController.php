<?php

namespace App\Http\Controllers;

use App\Models\PropertyManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PropertyManagerController extends Controller
{
    /**
     * Show the form for creating a property manager profile.
     */
    public function create()
    {
        $user = Auth::user();

        // Check if user already has a property manager profile
        if ($user->propertyManager) {
            // If profile is rejected, allow editing
            if ($user->propertyManager->isRejected()) {
                return redirect()->route('property-manager.edit');
            }
            return redirect()->route('dashboard');
        }

        return Inertia::render('profile-setup', [
            'user' => $user,
            'isEditing' => false,
            'rejectionReason' => null,
            'rejectedFields' => [],
        ]);
    }

    /**
     * Store a newly created property manager profile.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        Log::info('Profile setup submission received', $request->all());

        // Check if user already has a property manager profile
        if (Auth::user()->propertyManager) {
            return redirect()->route('dashboard')
                ->with('error', 'You already have a property manager profile.');
        }

        $rules = [
            'type' => ['required', Rule::in(['individual', 'professional'])],
            'phone_country_code' => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'id_document' => 'required|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ];

        if ($request->input('type') === 'professional') {
            $rules['company_name'] = 'required|string|max:255';
            $rules['company_website'] = 'nullable|url|max:255';
            $rules['license_number'] = 'required|string|max:255';
            $rules['license_document'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:5120';
        }

        $validated = $request->validate($rules);

        // Handle file uploads
        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture_path'] = $request->file('profile_picture')
                ->store('property-managers/profile-pictures', ['disk' => 's3', 'visibility' => 'public']);
        }

        if ($request->hasFile('id_document')) {
            $validated['id_document_path'] = $request->file('id_document')
                ->store('property-managers/id-documents', ['disk' => 's3', 'visibility' => 'private']);
            $validated['id_document_original_name'] = $request->file('id_document')->getClientOriginalName();
        }

        if ($request->hasFile('license_document')) {
            $validated['license_document_path'] = $request->file('license_document')
                ->store('property-managers/license-documents', ['disk' => 's3', 'visibility' => 'private']);
            $validated['license_document_original_name'] = $request->file('license_document')->getClientOriginalName();
        }

        // Remove file fields from validated data
        unset($validated['profile_picture'], $validated['id_document'], $validated['license_document']);

        $user->propertyManager()->create($validated);

        return redirect()->route('profile.unverified')
            ->with('success', 'Profile submitted for review!');
    }

    /**
     * Show the form for editing the property manager profile.
     */
    public function edit()
    {
        $propertyManager = Auth::user()->propertyManager;
        
        if (!$propertyManager) {
            return redirect()->route('profile.setup');
        }

        return Inertia::render('profile-setup', [
            'propertyManager' => $propertyManager,
            'user' => Auth::user(),
            'isEditing' => true,
            'rejectionReason' => $propertyManager->rejection_reason,
            'rejectedFields' => $propertyManager->rejected_fields ?? [],
        ]);
    }

    /**
     * Update the property manager profile.
     */
    public function update(Request $request)
    {
        Log::info('Profile update request received', $request->all());
        
        $propertyManager = Auth::user()->propertyManager;
        
        if (!$propertyManager) {
            return redirect()->route('property-manager.create');
        }

        $rules = [
            'type' => ['required', Rule::in(['individual', 'professional'])],
            'phone_country_code' => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];

        // Only require documents if they don't already exist
        if (!$propertyManager->id_document_path) {
            $rules['id_document'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:5120';
        } else {
            $rules['id_document'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120';
        }

        if ($request->input('type') === 'professional') {
            $rules['company_name'] = 'required|string|max:255';
            $rules['company_website'] = 'nullable|url|max:255';
            $rules['license_number'] = 'required|string|max:255';
            
            if (!$propertyManager->license_document_path) {
                $rules['license_document'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:5120';
            } else {
                $rules['license_document'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120';
            }
        } else {
            $rules['company_name'] = 'nullable|string|max:255';
            $rules['company_website'] = 'nullable|url|max:255';
            $rules['license_number'] = 'nullable|string|max:255';
            $rules['license_document'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120';
        }

        $validated = $request->validate($rules);

        // Handle file uploads
        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture_path'] = $request->file('profile_picture')
                ->store('property-managers/profile-pictures', ['disk' => 's3', 'visibility' => 'public']);
        } elseif ($request->input('remove_profile_picture')) {
            $validated['profile_picture_path'] = null;
        }

        if ($request->hasFile('id_document')) {
            $validated['id_document_path'] = $request->file('id_document')
                ->store('property-managers/id-documents', ['disk' => 's3', 'visibility' => 'private']);
            $validated['id_document_original_name'] = $request->file('id_document')->getClientOriginalName();
        }

        if ($request->hasFile('license_document')) {
            $validated['license_document_path'] = $request->file('license_document')
                ->store('property-managers/license-documents', ['disk' => 's3', 'visibility' => 'private']);
            $validated['license_document_original_name'] = $request->file('license_document')->getClientOriginalName();
        }

        // Remove file fields from validated data
        unset($validated['profile_picture'], $validated['id_document'], $validated['license_document']);

        // Clear rejection data when resubmitting
        $validated['rejection_reason'] = null;
        $validated['rejected_fields'] = null;
        $validated['profile_verified_at'] = null; // Reset verification status

        $propertyManager->update($validated);

        return redirect()->route('profile.unverified')
            ->with('success', 'Profile updated and resubmitted for review!');
    }

    /**
     * Serve private documents for authenticated users.
     */
    public function serveDocument(Request $request, $type)
    {
        $user = Auth::user();
        $propertyManager = $user->propertyManager;
        
        if (!$propertyManager) {
            abort(404);
        }

        $documentPath = match($type) {
            'id_document' => $propertyManager->id_document_path,
            'license_document' => $propertyManager->license_document_path,
            'profile_picture' => $propertyManager->profile_picture_path,
            default => null
        };

        if (!$documentPath) {
            abort(404);
        }

        if ($type === 'profile_picture') {
            // Public file → return URL
            return redirect(Storage::disk('s3')->url($documentPath));
        }

        // Private file → generate temporary signed URL
        if (!Storage::disk('s3')->exists($documentPath)) {
            abort(404);
        }

        $temporaryUrl = Storage::disk('s3')->temporaryUrl(
            $documentPath,
            now()->addMinutes(30)
        );

        return redirect($temporaryUrl);
    }
}
