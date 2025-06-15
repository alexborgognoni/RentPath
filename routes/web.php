***REMOVED***

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () ***REMOVED***
    return Inertia::render('welcome');
***REMOVED***)->name('home');

Route::middleware(['auth', 'verified'])->group(function () ***REMOVED***
    Route::prefix('dashboard')->group(function () ***REMOVED***
        Route::get('/', [DashboardController::class, 'index'])->name("dashboard");
        Route::get('/properties', [DashboardController::class, 'properties']);
        Route::get('/applications', [DashboardController::class, 'applications']);
        Route::get('/tenants', [DashboardController::class, 'tenants']);
***REMOVED***);
***REMOVED***);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
