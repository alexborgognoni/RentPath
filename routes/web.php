***REMOVED***

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () ***REMOVED***
    return Inertia::render('welcome');
***REMOVED***)->name('home');

Route::middleware(['auth', 'verified'])->group(function () ***REMOVED***
    Route::get('dashboard', function () ***REMOVED***
        return Inertia::render('dashboard');
***REMOVED***)->name('dashboard');

    Route::prefix('dashboard')->group(function () ***REMOVED***
        // Properties
        Route::get('/properties', function () ***REMOVED***
            return Inertia::render('dashboard/properties');
    ***REMOVED***)->name('properties');

        // Rental Applications
        Route::get('/applications', function () ***REMOVED***
            return Inertia::render('dashboard/rental-applications');
    ***REMOVED***)->name('applications');

        // Tenants
        Route::get('/tenants', function () ***REMOVED***
            return Inertia::render('dashboard/tenants');
    ***REMOVED***)->name('tenants');
***REMOVED***);
***REMOVED***);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
