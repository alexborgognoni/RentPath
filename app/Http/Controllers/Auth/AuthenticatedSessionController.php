***REMOVED***

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
***REMOVED***
***REMOVED***
     * Show the login page.
***REMOVED***
    public function create(Request $request): Response
    ***REMOVED***
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
***REMOVED***
***REMOVED***

***REMOVED***
     * Handle an incoming authentication request.
***REMOVED***
    public function store(LoginRequest $request): RedirectResponse
    ***REMOVED***
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
***REMOVED***

***REMOVED***
     * Destroy an authenticated session.
***REMOVED***
    public function destroy(Request $request): RedirectResponse
    ***REMOVED***
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
***REMOVED***
***REMOVED***
