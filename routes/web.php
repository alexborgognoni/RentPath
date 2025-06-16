***REMOVED***

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () ***REMOVED***
    return Inertia::render('welcome');
***REMOVED***)->name('home');

Route::middleware(['auth', 'verified'])->group(function () ***REMOVED***
    Route::prefix('dashboard')->group(function () ***REMOVED***
        Route::get('/', [DashboardController::class, 'index'])->name("dashboard");
        Route::prefix('properties')->group(function () ***REMOVED***
            Route::get('/', [DashboardController::class, 'properties']);
            Route::post('/', [PropertyController::class, 'store']);
            Route::get('/create', [PropertyController::class, 'create']);
            Route::get('/***REMOVED***property***REMOVED***', [PropertyController::class, 'show'])->name('properties.show');
    ***REMOVED***);
        Route::get('/applications', [DashboardController::class, 'applications']);
        Route::get('/tenants', [DashboardController::class, 'tenants']);
***REMOVED***);
***REMOVED***);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
