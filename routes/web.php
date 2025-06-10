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
***REMOVED***);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
