<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyManagerController;

// Helper to check current subdomain
if (!function_exists('currentSubdomain')) {
    function currentSubdomain(): string {
        $host = request()->getHost();
        $parts = explode('.', $host);
        // For rentpath.test (2 parts) = no subdomain
        // For manager.rentpath.test (3 parts) = subdomain is 'manager'
        // For localhost (1 part) = no subdomain
        if (count($parts) > 2 && $parts[0] !== 'www') {
            return $parts[0];
        }
        return '';
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
                : 'https://manager.' . config('app.domain', 'rentpath.app');
            return $managerUrl . '/dashboard';
        }

        // Otherwise, user is a tenant - redirect to root domain dashboard
        return config('app.url') . '/dashboard';
    }
}

/*
|--------------------------------------------------------------------------
| Root Route - handles all subdomains
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $subdomain = currentSubdomain();

    // Manager subdomain
    if ($subdomain === 'manager') {
        if (!auth()->check()) {
            return redirect()->away(config('app.url') . '/login?intended=' . urlencode(request()->fullUrl()));
        }
        return redirect('/dashboard');
    }

    // Main domain - landing page
    if ($subdomain === '') {
        return Inertia::render('landing');
    }

    // Unknown subdomain
    abort(404);
})->name('landing');

/*
|--------------------------------------------------------------------------
| Main Domain Routes (NO subdomain) - Public and Auth pages
|--------------------------------------------------------------------------
*/

Route::middleware('subdomain:')->group(function () {

    // Test cookie sharing
    Route::get('/test-cookie', function (Request $request) {
        $request->session()->put('test', 'value_from_main');

        // Also set a manual cookie to test domain
        $response = response()->json([
            'message' => 'Cookie set on main domain',
            'session_id' => $request->session()->getId(),
            'session_name' => config('session.cookie'),
            'test_value' => $request->session()->get('test'),
            'configured_domain' => config('session.domain'),
        ]);

        // Set a test cookie with explicit domain
        $response->cookie('manual_test', 'manual_value', 120, '/', '.localhost', false, true, false, 'lax');

        return $response;
    });

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

    Route::post('/locale', function (Request $request) {
        $locale = $request->input('locale');
        if (in_array($locale, ['en', 'fr', 'de', 'nl'])) {
            session(['locale' => $locale]);
        }
        return response()->json(['locale' => session('locale')]);
    });

    // Auth routes
    require __DIR__ . '/auth.php';
});

/*
|--------------------------------------------------------------------------
| Manager Subdomain Routes
|--------------------------------------------------------------------------
*/

Route::domain('manager.' . env('APP_DOMAIN', 'rentpath.test'))->middleware('subdomain:manager')->group(function () {

    // Dashboard
    Route::middleware(['auth'])->get('dashboard', function (Request $request) {
        $user = $request->user();
        $propertyManager = $user->propertyManager;

        if (!$propertyManager) {
            return redirect()->route('profile.setup');
        }

        if (!$propertyManager->isVerified()) {
            return redirect()->route('profile.unverified');
        }

        $properties = $user->properties()
            ->with('images')
            ->orderBy('created_at', 'desc')
            ->get();

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
                return redirect()->route('profile.setup');
            }

            if ($propertyManager->isVerified()) {
                return redirect()->route('dashboard');
            }

            return redirect()->route('profile.unverified');
        })->name('profile');

        Route::get('profile/setup', [PropertyManagerController::class, 'create'])
            ->name('profile.setup');

        Route::post('profile/setup', [PropertyManagerController::class, 'store'])
            ->name('property-manager.store');

        Route::get('profile/unverified', function (Request $request) {
            $user = $request->user();
            $propertyManager = $user->propertyManager;

            if (!$propertyManager) {
                return redirect()->route('profile.setup');
            }

            if ($propertyManager->isVerified()) {
                return redirect()->route('dashboard');
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

        Route::get('property/{property}', [PropertyController::class, 'show'])
            ->name('property.show');

        // Property CRUD
        Route::get('properties', [PropertyController::class, 'index'])
            ->name('properties.index');

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

        Route::patch('properties/{property}', [PropertyController::class, 'update']);

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

        // Image routes
        Route::get('properties/{property}/image', [PropertyController::class, 'showImage'])
            ->name('properties.image');

        Route::get('properties/{property}/image/signed', [PropertyController::class, 'showImageSigned'])
            ->name('properties.image.signed');

        Route::get('properties/{property}/images/{propertyImage}', [PropertyController::class, 'showPropertyImage'])
            ->name('properties.images.show');

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
});

/*
|--------------------------------------------------------------------------
| Tenant Routes (Root Domain)
|--------------------------------------------------------------------------
*/

Route::middleware('subdomain:')->group(function () {
    // Tenant authenticated routes
    Route::middleware(['auth', 'verified'])->group(function () {
        // Dashboard
        Route::get('dashboard', function () {
            return Inertia::render('tenant/dashboard');
        })->name('dashboard');

        // Future tenant routes: applications, profile, settings, etc.
    });
});
