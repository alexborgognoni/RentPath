<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyManagerController;
use App\Http\Controllers\PropertyViewController;
use App\Http\Controllers\SchemaViewerController;

// Helper to check current subdomain
if (!function_exists('currentSubdomain')) {
    function currentSubdomain(): ?string {
        $host = request()->getHost();
        $baseDomain = config('app.domain');

        // Build expected domain for manager subdomain
        $managerDomain = env('MANAGER_SUBDOMAIN', 'manager') . '.' . $baseDomain;

        // Check against known subdomains
        if ($host === $managerDomain) {
            return env('MANAGER_SUBDOMAIN', 'manager');
        }

        // If host matches base domain, no subdomain
        if ($host === $baseDomain) {
            return '';
        }

        // Unknown host - return null to indicate invalid domain
        return null;
    }
}

// Helper to determine user's default redirect based on type
if (!function_exists('userDefaultDashboard')) {
    function userDefaultDashboard($user): string {
        if (!$user) {
            return config('app.url') . '/login';
        }

        // Check if user is a property manager
        if ($user->propertyManager) {
            $managerUrl = config('app.env') === 'local'
                ? 'http://manager.' . parse_url(config('app.url'), PHP_URL_HOST) . ':' . parse_url(config('app.url'), PHP_URL_PORT)
                : 'https://manager.' . config('app.domain');
            return $managerUrl . '/dashboard';
        }

        // Otherwise, user is a tenant - redirect to root domain dashboard
        return config('app.url') . '/dashboard';
    }
}

/*
|--------------------------------------------------------------------------
| Root Domain Routes - Public pages ONLY on root domain
|--------------------------------------------------------------------------
*/

Route::domain(config('app.domain'))->group(function () {
    // Landing page
    Route::get('/', function () {
        return Inertia::render('landing');
    })->name('landing');

    // Public pages
    Route::get('/privacy-policy', function () {
        return Inertia::render('privacy-policy');
    })->name('privacy.policy');

    Route::get('/terms-of-use', function () {
        return Inertia::render('terms-of-use');
    })->name('terms.of.use');

    Route::get('/contact-us', function () {
        return Inertia::render('contact-us');
    })->name('contact.us');

    // Browse all public properties
    Route::get('/properties', function () {
        // Fetch all properties that don't require invite
        $properties = \App\Models\Property::where('requires_invite', false)
            ->where('status', 'available')
            ->with(['images', 'propertyManager.user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($property) {
                $propertyArray = $property->toArray();

                // Add property image URLs
                if ($property->images) {
                    $propertyArray['images'] = $property->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_url' => \App\Helpers\StorageHelper::url($image->image_path, 'private', 1440),
                            'image_path' => $image->image_path,
                            'is_main' => $image->is_main,
                            'sort_order' => $image->sort_order,
                        ];
                    })->sortBy('sort_order')->values()->toArray();
                }

                return $propertyArray;
            });

        return Inertia::render('tenant/properties', [
            'properties' => $properties,
        ]);
    })->name('properties.index');

    // Property viewing (public or token-protected)
    Route::get('/properties/{property}', [PropertyViewController::class, 'show'])
        ->name('tenant.properties.show');

    Route::get('/properties/{property}/images/{imageId}', [PropertyViewController::class, 'showImage'])
        ->name('tenant.properties.images.show');

    // Private storage route for serving signed URLs (tenant side)
    Route::get('/private-storage/{path}', function ($path) {
        $disk = \App\Helpers\StorageHelper::getDisk('private');
        if (!Storage::disk($disk)->exists($path)) {
            abort(404);
        }
        return Storage::disk($disk)->response($path);
    })->where('path', '.*')->middleware('signed')->name('tenant.private.storage');

    // Locale switching
    Route::post('/locale', function (Request $request) {
        $locale = $request->input('locale');
        if (in_array($locale, ['en', 'fr', 'de', 'nl'])) {
            session(['locale' => $locale]);
        }
        return response()->json(['locale' => session('locale')]);
    });

    // Development tools (local only)
    if (config('app.env') === 'local') {
        Route::get('dev/schema', [SchemaViewerController::class, 'index'])
            ->name('dev.schema');
    }

    // Auth routes (login, register, password reset, email verification)
    require __DIR__ . '/auth.php';
});

/*
|--------------------------------------------------------------------------
| Manager Subdomain Routes
|--------------------------------------------------------------------------
*/

Route::domain('manager.' . config('app.domain'))->middleware('subdomain:manager')->group(function () {

    // Redirect root to dashboard
    Route::get('/', function () {
        return redirect('/dashboard');
    });

    // Dashboard
    Route::middleware(['auth'])->get('dashboard', function (Request $request) {
        \Log::info('Manager dashboard accessed', [
            'host' => $request->getHost(),
            'url' => $request->url(),
            'user_id' => $request->user()?->id,
            'has_property_manager' => (bool) $request->user()?->propertyManager,
        ]);

        $user = $request->user();
        $propertyManager = $user->propertyManager;

        if (!$propertyManager) {
            \Log::info('Redirecting to profile setup - no property manager');
            return redirect('/profile/setup');
        }

        if (!$propertyManager->isVerified()) {
            \Log::info('Redirecting to unverified - property manager not verified');
            return redirect('/profile/unverified');
        }

        $properties = $user->properties()
            ->with('images')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($property) {
                $propertyArray = $property->toArray();

                // Transform images to include URLs
                if ($property->images) {
                    $propertyArray['images'] = $property->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_url' => \App\Helpers\StorageHelper::url($image->image_path, 'private', 1440),
                            'image_path' => $image->image_path,
                            'is_main' => $image->is_main,
                            'sort_order' => $image->sort_order,
                        ];
                    })->sortBy('sort_order')->values()->toArray();
                }

                return $propertyArray;
            });

        \Log::info('Rendering manager dashboard');
        return Inertia::render('dashboard', [
            'properties' => $properties
        ]);
    })->name('manager.dashboard');

    // All manager routes require authentication
    Route::middleware(['auth'])->group(function () {
        // Profile routes
        Route::get('profile', function (Request $request) {
            $user = $request->user();
            $propertyManager = $user->propertyManager;

            if (!$propertyManager) {
                return redirect('/profile/setup');
            }

            if ($propertyManager->isVerified()) {
                return redirect('/dashboard');
            }

            return redirect('/profile/unverified');
        })->name('profile');

        Route::get('profile/setup', [PropertyManagerController::class, 'create'])
            ->name('profile.setup');

        Route::post('profile/setup', [PropertyManagerController::class, 'store'])
            ->name('property-manager.store');

        Route::get('profile/unverified', function (Request $request) {
            $user = $request->user();
            $propertyManager = $user->propertyManager;

            if (!$propertyManager) {
                return redirect('/profile/setup');
            }

            if ($propertyManager->isVerified()) {
                return redirect('/dashboard');
            }

            if ($request->get('edit')) {
                return Inertia::render('profile-setup', [
                    'propertyManager' => $propertyManager,
                    'user' => $user,
                    'isEditing' => true,
                    'rejectionReason' => $propertyManager->rejection_reason,
                    'rejectedFields' => $propertyManager->rejected_fields ?? [],
                ]);
            }

            return Inertia::render('profile-unverified', [
                'isRejected' => $propertyManager ? $propertyManager->isRejected() : false,
                'rejectionReason' => $propertyManager ? $propertyManager->rejection_reason : null,
            ]);
        })->name('profile.unverified');

        Route::get('edit-profile', [PropertyManagerController::class, 'edit'])
            ->name('property-manager.edit');

        Route::post('edit-profile', [PropertyManagerController::class, 'update'])
            ->name('property-manager.update');

        Route::get('property-manager/document/{type}', [PropertyManagerController::class, 'serveDocument'])
            ->name('property-manager.document');

        // Property CRUD
        Route::get('properties', [PropertyController::class, 'index'])
            ->name('manager.properties.index');

        Route::get('properties/create', [PropertyController::class, 'create'])
            ->name('properties.create');

        Route::post('properties', [PropertyController::class, 'store'])
            ->name('properties.store');

        Route::get('properties/{property}', [PropertyController::class, 'show'])
            ->name('properties.show');

        Route::get('properties/{property}/edit', [PropertyController::class, 'edit'])
            ->name('properties.edit');

        Route::put('properties/{property}', [PropertyController::class, 'update'])
            ->name('properties.update');

        Route::delete('properties/{property}', [PropertyController::class, 'destroy'])
            ->name('properties.destroy');

        // Property API routes
        Route::get('api/properties/token/{token}', [PropertyController::class, 'findByToken'])
            ->name('properties.findByToken');

        Route::post('properties/{property}/invite-token', [PropertyController::class, 'generateInviteToken'])
            ->name('properties.generateInviteToken');

        Route::delete('properties/{property}/invite-token', [PropertyController::class, 'invalidateInviteToken'])
            ->name('properties.invalidateInviteToken');

        Route::post('properties/{property}/toggle-public-access', [PropertyController::class, 'togglePublicAccess'])
            ->name('properties.togglePublicAccess');

        // Invite token management
        Route::post('properties/{property}/regenerate-default-token', [PropertyController::class, 'regenerateDefaultToken'])
            ->name('properties.regenerateDefaultToken');

        Route::get('properties/{property}/invite-tokens', [PropertyController::class, 'getInviteTokens'])
            ->name('properties.getInviteTokens');

        Route::post('properties/{property}/invite-tokens', [PropertyController::class, 'createCustomToken'])
            ->name('properties.createCustomToken');

        Route::put('properties/{property}/invite-tokens/{tokenId}', [PropertyController::class, 'updateCustomToken'])
            ->name('properties.updateCustomToken');

        Route::delete('properties/{property}/invite-tokens/{tokenId}', [PropertyController::class, 'deleteCustomToken'])
            ->name('properties.deleteCustomToken');

        // Image upload/delete routes (legacy - not currently used)
        Route::post('api/images/upload', [ImageUploadController::class, 'upload'])
            ->name('images.upload');

        Route::delete('api/images/delete', [ImageUploadController::class, 'delete'])
            ->name('images.delete');

        Route::get('/private-storage/{path}', function ($path) {
            $disk = \App\Helpers\StorageHelper::getDisk('private');
            if (!Storage::disk($disk)->exists($path)) {
                abort(404);
            }
            return Storage::disk($disk)->response($path);
        })->where('path', '.*')->middleware('signed')->name('private.storage');
    });

    // Manager logout
    Route::middleware('auth')->post('logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
        ->name('manager.logout');

    // Settings routes
    Route::middleware('auth')->group(function () {
        if (file_exists(__DIR__ . '/settings.php')) {
            require __DIR__ . '/settings.php';
        }
    });

    // Catch-all route for manager subdomain - redirects to login if not authenticated
    Route::any('{any}', function () {
        if (!auth()->check()) {
            return redirect()->away(config('app.url') . '/login?redirect=' . urlencode(request()->fullUrl()));
        }
        abort(404);
    })->where('any', '[^/]+');
});

/*
|--------------------------------------------------------------------------
| Tenant Routes (Root Domain)
|--------------------------------------------------------------------------
*/

// Tenant authenticated routes
/*
|--------------------------------------------------------------------------
| Root Domain - Tenant Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::domain(config('app.domain'))->middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();
        $tenantProfile = $user->tenantProfile;

        // If no tenant profile, show empty state
        if (!$tenantProfile) {
            return Inertia::render('tenant/dashboard', [
                'applications' => [],
            ]);
        }

        // Fetch all applications for this tenant with property details
        $applications = \App\Models\Application::where('tenant_profile_id', $tenantProfile->id)
            ->with(['property' => function ($query) {
                $query->with('images');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($application) {
                $applicationArray = $application->toArray();

                // Add property image URLs
                if ($application->property && $application->property->images) {
                    $applicationArray['property']['images'] = $application->property->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_url' => \App\Helpers\StorageHelper::url($image->image_path, 'private', 1440),
                            'image_path' => $image->image_path,
                            'is_main' => $image->is_main,
                            'sort_order' => $image->sort_order,
                        ];
                    })->sortBy('sort_order')->values()->toArray();
                }

                return $applicationArray;
            });

        return Inertia::render('tenant/dashboard', [
            'applications' => $applications,
        ]);
    })->name('dashboard');

    // Tenant Profile routes
    // Note: Setup/unverified routes removed - profiles are now auto-created on first application
    // Users can edit their profile after submitting their first application
    Route::get('profile/tenant/edit', [\App\Http\Controllers\TenantProfileController::class, 'edit'])
        ->name('tenant.profile.edit');

    Route::post('profile/tenant/edit', [\App\Http\Controllers\TenantProfileController::class, 'update'])
        ->name('tenant.profile.update');

    Route::get('tenant-profile/document/{type}', [\App\Http\Controllers\TenantProfileController::class, 'serveDocument'])
        ->name('tenant.profile.document');

    // Application routes
    Route::get('properties/{property}/apply', [\App\Http\Controllers\ApplicationController::class, 'create'])
        ->name('applications.create');

    Route::post('properties/{property}/apply', [\App\Http\Controllers\ApplicationController::class, 'store'])
        ->name('applications.store');

    Route::post('properties/{property}/apply/draft', [\App\Http\Controllers\ApplicationController::class, 'saveDraft'])
        ->name('applications.save-draft');

    Route::get('applications/{application}', [\App\Http\Controllers\ApplicationController::class, 'show'])
        ->name('applications.show');

    Route::put('applications/{application}', [\App\Http\Controllers\ApplicationController::class, 'update'])
        ->name('applications.update');

    Route::delete('applications/{application}', [\App\Http\Controllers\ApplicationController::class, 'destroy'])
        ->name('applications.destroy');

    Route::post('applications/{application}/withdraw', [\App\Http\Controllers\ApplicationController::class, 'withdraw'])
        ->name('applications.withdraw');

    // Settings routes (same paths as manager, different views)
    if (file_exists(__DIR__ . '/settings.php')) {
        require __DIR__ . '/settings.php';
    }
});
