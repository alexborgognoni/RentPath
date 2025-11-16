<?php

namespace App\Http\Controllers;

use App\Helpers\StorageHelper;
use App\Models\Application;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PropertyViewController extends Controller
{
    /**
     * Display a property for tenant viewing.
     *
     * Access control logic:
     * - If requires_invite = false: Anyone can view (authenticated or not)
     * - If requires_invite = true: Must have valid token in URL
     * - Token type 'invite' will require authentication (to be implemented later)
     */
    public function show(Request $request, Property $property)
    {
        // Check access control
        $token = $request->query('token');

        // If property doesn't require invite, allow access
        if (!$property->requires_invite) {
            return $this->renderPropertyView($property);
        }

        // Property requires invite - check for token
        if (!$token) {
            abort(403, 'This property requires an invite token to view.');
        }

        // Find and validate the token
        $inviteToken = $property->inviteTokens()->where('token', $token)->first();

        if (!$inviteToken || !$inviteToken->canBeUsed()) {
            abort(403, 'Invalid or expired invite token.');
        }

        // Increment token usage count
        $inviteToken->increment('used_count');

        // Token is valid - render the view
        return $this->renderPropertyView($property, $token);
    }

    /**
     * Render the property view with all necessary data.
     */
    private function renderPropertyView(Property $property, ?string $token = null)
    {
        // Load property images
        $property->load(['images', 'propertyManager.user']);

        // Get image URLs using StorageHelper
        $images = $property->images->map(function ($image) {
            return [
                'id' => $image->id,
                'image_url' => StorageHelper::url($image->image_path, 'private', 1440), // 24 hours
                'is_main' => $image->is_main,
                'sort_order' => $image->sort_order,
            ];
        })->sortBy('sort_order')->values();

        // Determine if user can apply
        $canApply = $this->canUserApply($property);
        $tenantProfileStatus = $this->getTenantProfileStatus();
        $applicationStatus = $this->getApplicationStatus($property);

        return Inertia::render('tenant/property-view', [
            'property' => [
                'id' => $property->id,
                'title' => $property->title,
                'description' => $property->description,
                'type' => $property->type,
                'subtype' => $property->subtype,

                // Specifications
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
                'parking_spots_interior' => $property->parking_spots_interior,
                'parking_spots_exterior' => $property->parking_spots_exterior,
                'size' => $property->size,
                'balcony_size' => $property->balcony_size,
                'land_size' => $property->land_size,
                'floor_level' => $property->floor_level,
                'has_elevator' => $property->has_elevator,
                'year_built' => $property->year_built,

                // Energy/Building
                'energy_class' => $property->energy_class,
                'thermal_insulation_class' => $property->thermal_insulation_class,
                'heating_type' => $property->heating_type,

                // Kitchen
                'kitchen_equipped' => $property->kitchen_equipped,
                'kitchen_separated' => $property->kitchen_separated,

                // Amenities
                'has_cellar' => $property->has_cellar,
                'has_laundry' => $property->has_laundry,
                'has_fireplace' => $property->has_fireplace,
                'has_air_conditioning' => $property->has_air_conditioning,
                'has_garden' => $property->has_garden,
                'has_rooftop' => $property->has_rooftop,
                'extras' => $property->extras,

                // Rental info
                'available_date' => $property->available_date?->format('Y-m-d'),
                'rent_amount' => $property->rent_amount,
                'rent_currency' => $property->rent_currency,
                'formatted_rent' => $property->formatted_rent,
                'formatted_size' => $property->formatted_size,

                // Address
                'house_number' => $property->house_number,
                'street_name' => $property->street_name,
                'street_line2' => $property->street_line2,
                'city' => $property->city,
                'state' => $property->state,
                'postal_code' => $property->postal_code,
                'country' => $property->country,

                // Images
                'images' => $images,

                // Property manager info (limited)
                'property_manager' => [
                    'type' => $property->propertyManager->type,
                    'company_name' => $property->propertyManager->company_name,
                ],
            ],
            'token' => $token,
            'canApply' => $canApply,
            'tenantProfileStatus' => $tenantProfileStatus,
            'applicationStatus' => $applicationStatus,
        ]);
    }

    /**
     * Check if the current user can apply for the property.
     */
    private function canUserApply(Property $property): bool
    {
        // Must be authenticated
        if (!Auth::check()) {
            return false;
        }

        $user = Auth::user();
        $tenantProfile = $user->tenantProfile;

        // Must have a verified tenant profile
        if (!$tenantProfile || !$tenantProfile->isVerified()) {
            return false;
        }

        // Check if user already has an active application for this property (excluding drafts)
        $existingApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->whereNotIn('status', ['draft', 'withdrawn', 'archived', 'deleted'])
            ->exists();

        if ($existingApplication) {
            return false;
        }

        // Property must be accepting applications
        if (!in_array($property->status, ['available', 'application_received'])) {
            return false;
        }

        return true;
    }

    /**
     * Get the tenant profile status for the current user.
     */
    private function getTenantProfileStatus(): array
    {
        if (!Auth::check()) {
            return [
                'exists' => false,
                'verified' => false,
                'rejected' => false,
            ];
        }

        $tenantProfile = Auth::user()->tenantProfile;

        if (!$tenantProfile) {
            return [
                'exists' => false,
                'verified' => false,
                'rejected' => false,
            ];
        }

        return [
            'exists' => true,
            'verified' => $tenantProfile->isVerified(),
            'rejected' => $tenantProfile->isRejected(),
        ];
    }

    /**
     * Get the application status for the current user and property.
     */
    private function getApplicationStatus(Property $property): array
    {
        if (!Auth::check()) {
            return [
                'hasApplication' => false,
                'hasDraft' => false,
                'status' => null,
            ];
        }

        $tenantProfile = Auth::user()->tenantProfile;

        if (!$tenantProfile) {
            return [
                'hasApplication' => false,
                'hasDraft' => false,
                'status' => null,
            ];
        }

        // Check for draft
        $draftApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->first();

        if ($draftApplication) {
            return [
                'hasApplication' => true,
                'hasDraft' => true,
                'status' => 'draft',
                'applicationId' => $draftApplication->id,
            ];
        }

        // Check for submitted application
        $application = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->whereNotIn('status', ['draft', 'withdrawn', 'archived', 'deleted'])
            ->first();

        if ($application) {
            return [
                'hasApplication' => true,
                'hasDraft' => false,
                'status' => $application->status,
                'applicationId' => $application->id,
            ];
        }

        return [
            'hasApplication' => false,
            'hasDraft' => false,
            'status' => null,
        ];
    }

    /**
     * Serve property image with token validation.
     */
    public function showImage(Request $request, Property $property, $imageId)
    {
        // Check access control (same logic as show method)
        $token = $request->query('token');

        if ($property->requires_invite && !$property->canAccessWithToken($token)) {
            abort(403, 'Invalid or expired invite token.');
        }

        // Find the image
        $image = $property->images()->findOrFail($imageId);

        // Use StorageHelper to get the image
        $disk = StorageHelper::getDisk('private');

        if (!\Storage::disk($disk)->exists($image->image_path)) {
            abort(404, 'Image file not found');
        }

        $file = \Storage::disk($disk)->get($image->image_path);
        $mimeType = \Storage::disk($disk)->mimeType($image->image_path);

        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
