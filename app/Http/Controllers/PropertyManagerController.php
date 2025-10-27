<?php

namespace App\Http\Controllers;

use App\Helpers\StorageHelper;
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

        // Check if user already has a property manager profile
        if (Auth::user()->propertyManager) {
            return redirect()->route('dashboard')
                ->with('error', 'You already have a property manager profile.');
        }

        $rules = [
            'type' => ['required', Rule::in(['individual', 'professional'])],
            'phone_country_code' => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,webp|max:5120',
            'id_document' => 'required|file|mimes:pdf,jpeg,png,jpg|max:20480',
        ];

        if ($request->input('type') === 'professional') {
            $rules['company_name'] = 'required|string|max:255';
            $rules['company_website'] = 'nullable|string|max:255';
            $rules['license_number'] = 'required|string|max:255';
            $rules['license_document'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
        }

        $messages = [
            'phone_number.required' => 'Please enter your phone number.',
            'profile_picture.image' => 'Profile picture must be an image file.',
            'profile_picture.mimes' => 'Profile picture must be in JPEG, PNG, or WEBP format.',
            'profile_picture.max' => 'Profile picture must be smaller than 5MB.',
            'id_document.required' => 'Please upload your ID document.',
            'id_document.file' => 'ID document must be a valid file.',
            'id_document.mimes' => 'ID document must be in PDF, JPEG, PNG, or JPG format.',
            'id_document.max' => 'ID document must be smaller than 20MB.',
            'company_name.required' => 'Company name is required for professional accounts.',
            'license_number.required' => 'License number is required for professional accounts.',
            'license_document.required' => 'Please upload your license document.',
            'license_document.file' => 'License document must be a valid file.',
            'license_document.mimes' => 'License document must be in PDF, JPEG, PNG, or JPG format.',
            'license_document.max' => 'License document must be smaller than 20MB.',
        ];

        $validated = $request->validate($rules, $messages);

        // Normalize and validate company website
        if (!empty($validated['company_website'])) {
            $website = trim($validated['company_website']);

            // Remove protocol if present
            $website = preg_replace('/^https?:\/\//i', '', $website);

            // Remove www. if present
            $website = preg_replace('/^www\./i', '', $website);

            // Validate domain format
            if (!preg_match('/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/', $website)) {
                return back()->withErrors([
                    'company_website' => 'Please enter a valid domain (e.g., example.com).'
                ])->withInput();
            }

            // Store normalized version (domain only)
            $validated['company_website'] = $website;
        }

        // Handle file uploads
        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture_path'] = StorageHelper::store(
                $request->file('profile_picture'),
                'property-managers/profile-pictures',
                'public'
            );
        }

        if ($request->hasFile('id_document')) {
            $validated['id_document_path'] = StorageHelper::store(
                $request->file('id_document'),
                'property-managers/id-documents',
                'private'
            );
            $validated['id_document_original_name'] = $request->file('id_document')->getClientOriginalName();
        }

        if ($request->hasFile('license_document')) {
            $validated['license_document_path'] = StorageHelper::store(
                $request->file('license_document'),
                'property-managers/license-documents',
                'private'
            );
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
        $propertyManager = Auth::user()->propertyManager;

        if (!$propertyManager) {
            return redirect()->route('property-manager.create');
        }

        $rules = [
            'type' => ['required', Rule::in(['individual', 'professional'])],
            'phone_country_code' => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,webp|max:5120',
        ];

        // Only require documents if they don't already exist
        if (!$propertyManager->id_document_path) {
            $rules['id_document'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
        } else {
            $rules['id_document'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
        }

        if ($request->input('type') === 'professional') {
            $rules['company_name'] = 'required|string|max:255';
            $rules['company_website'] = 'nullable|string|max:255';
            $rules['license_number'] = 'required|string|max:255';

            if (!$propertyManager->license_document_path) {
                $rules['license_document'] = 'required|file|mimes:pdf,jpeg,png,jpg|max:20480';
            } else {
                $rules['license_document'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
            }
        } else {
            $rules['company_name'] = 'nullable|string|max:255';
            $rules['company_website'] = 'nullable|string|max:255';
            $rules['license_number'] = 'nullable|string|max:255';
            $rules['license_document'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
        }

        $messages = [
            'phone_number.required' => 'Please enter your phone number.',
            'profile_picture.image' => 'Profile picture must be an image file.',
            'profile_picture.mimes' => 'Profile picture must be in JPEG, PNG, or WEBP format.',
            'profile_picture.max' => 'Profile picture must be smaller than 5MB.',
            'id_document.required' => 'Please upload your ID document.',
            'id_document.file' => 'ID document must be a valid file.',
            'id_document.mimes' => 'ID document must be in PDF, JPEG, PNG, or JPG format.',
            'id_document.max' => 'ID document must be smaller than 20MB.',
            'company_name.required' => 'Company name is required for professional accounts.',
            'license_number.required' => 'License number is required for professional accounts.',
            'license_document.required' => 'Please upload your license document.',
            'license_document.file' => 'License document must be a valid file.',
            'license_document.mimes' => 'License document must be in PDF, JPEG, PNG, or JPG format.',
            'license_document.max' => 'License document must be smaller than 20MB.',
        ];

        $validated = $request->validate($rules, $messages);

        // Normalize and validate company website
        if (!empty($validated['company_website'])) {
            $website = trim($validated['company_website']);

            // Remove protocol if present
            $website = preg_replace('/^https?:\/\//i', '', $website);

            // Remove www. if present
            $website = preg_replace('/^www\./i', '', $website);

            // Validate domain format
            if (!preg_match('/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/', $website)) {
                return back()->withErrors([
                    'company_website' => 'Please enter a valid domain (e.g., example.com).'
                ])->withInput();
            }

            // Store normalized version (domain only)
            $validated['company_website'] = $website;
        }

        // Handle profile picture upload/removal
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($propertyManager->profile_picture_path) {
                $oldDisk = StorageHelper::getDisk('public');
                if (Storage::disk($oldDisk)->exists($propertyManager->profile_picture_path)) {
                    Storage::disk($oldDisk)->delete($propertyManager->profile_picture_path);
                }
            }

            $validated['profile_picture_path'] = StorageHelper::store(
                $request->file('profile_picture'),
                'property-managers/profile-pictures',
                'public'
            );
        } elseif ($request->input('remove_profile_picture')) {
            // Delete the file from storage
            if ($propertyManager->profile_picture_path) {
                $disk = StorageHelper::getDisk('public');
                if (Storage::disk($disk)->exists($propertyManager->profile_picture_path)) {
                    Storage::disk($disk)->delete($propertyManager->profile_picture_path);
                }
            }

            $validated['profile_picture_path'] = null;
        }

        // Handle ID document upload (also delete old one if replacing)
        if ($request->hasFile('id_document')) {
            // Delete old document if exists
            if ($propertyManager->id_document_path) {
                $oldDisk = StorageHelper::getDisk('private');
                if (Storage::disk($oldDisk)->exists($propertyManager->id_document_path)) {
                    Storage::disk($oldDisk)->delete($propertyManager->id_document_path);
                }
            }

            $validated['id_document_path'] = StorageHelper::store(
                $request->file('id_document'),
                'property-managers/id-documents',
                'private'
            );
            $validated['id_document_original_name'] = $request->file('id_document')->getClientOriginalName();
        }

        // Handle license document upload (also delete old one if replacing)
        if ($request->hasFile('license_document')) {
            // Delete old document if exists
            if ($propertyManager->license_document_path) {
                $oldDisk = StorageHelper::getDisk('private');
                if (Storage::disk($oldDisk)->exists($propertyManager->license_document_path)) {
                    Storage::disk($oldDisk)->delete($propertyManager->license_document_path);
                }
            }

            $validated['license_document_path'] = StorageHelper::store(
                $request->file('license_document'),
                'property-managers/license-documents',
                'private'
            );
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
     * Serve documents for authenticated users.
     */
    public function serveDocument(Request $request, $type)
    {
        $user = Auth::user();
        $propertyManager = $user->propertyManager;

        if (!$propertyManager) {
            abort(404);
        }

        [$documentPath, $visibility] = match($type) {
            'id_document' => [$propertyManager->id_document_path, 'private'],
            'license_document' => [$propertyManager->license_document_path, 'private'],
            'profile_picture' => [$propertyManager->profile_picture_path, 'public'],
            default => [null, null]
        };

        if (!$documentPath) {
            abort(404);
        }

        // Generate URL using StorageHelper (automatically handles public vs private)
        $url = StorageHelper::url($documentPath, $visibility, 30);

        return redirect($url);
    }
}
