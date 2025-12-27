<?php

namespace App\Http\Controllers;

use App\Helpers\StorageHelper;
use App\Models\Application;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantDashboardController extends Controller
{
    /**
     * Display the tenant dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $tenantProfile = $user->tenantProfile;

        $stats = [
            'total_applications' => 0,
            'pending_review' => 0,
            'approved' => 0,
            'unread_messages' => 0,
            'profile_complete' => false,
        ];

        $recentApplications = [];

        if ($tenantProfile) {
            // Calculate application stats
            $stats['total_applications'] = Application::where('tenant_profile_id', $tenantProfile->id)
                ->active()
                ->count();

            $stats['pending_review'] = Application::where('tenant_profile_id', $tenantProfile->id)
                ->whereIn('status', ['submitted', 'under_review', 'visit_scheduled', 'visit_completed'])
                ->count();

            $stats['approved'] = Application::where('tenant_profile_id', $tenantProfile->id)
                ->where('status', 'approved')
                ->count();

            $stats['profile_complete'] = $this->isProfileComplete($tenantProfile);

            // Unread messages count
            // Note: For tenant conversations, participant_id is the user_id
            $stats['unread_messages'] = Conversation::where('participant_type', Conversation::PARTICIPANT_TYPE_TENANT)
                ->where('participant_id', $user->id)
                ->get()
                ->filter(fn ($c) => $c->hasUnreadForParticipant())
                ->count();

            // Recent 3 applications with property data (excluding archived/withdrawn)
            $recentApplications = Application::where('tenant_profile_id', $tenantProfile->id)
                ->with(['property.images'])
                ->whereNotIn('status', ['archived', 'withdrawn'])
                ->latest()
                ->take(3)
                ->get()
                ->map(fn ($app) => $this->formatApplication($app));
        }

        return Inertia::render('tenant/dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications,
            'hasProfile' => $tenantProfile !== null,
            'userName' => $user->name ?? $user->first_name ?? 'there',
        ]);
    }

    /**
     * Check if tenant profile has essential fields filled.
     */
    private function isProfileComplete($profile): bool
    {
        $essentialFields = [
            'date_of_birth',
            'nationality',
            'phone_number',
            'employment_status',
            'id_document_path',
        ];

        foreach ($essentialFields as $field) {
            if (empty($profile->$field)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Format an application for the frontend.
     *
     * @return array<string, mixed>
     */
    private function formatApplication(Application $application): array
    {
        $applicationArray = $application->toArray();
        $property = $application->property;

        if ($property && $property->images) {
            $applicationArray['property']['images'] = $property->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'image_url' => StorageHelper::url($image->image_path, 'private', 1440),
                    'image_path' => $image->image_path,
                    'is_main' => $image->is_main,
                    'sort_order' => $image->sort_order,
                ];
            })->sortBy('sort_order')->values()->toArray();
        }

        return $applicationArray;
    }
}
