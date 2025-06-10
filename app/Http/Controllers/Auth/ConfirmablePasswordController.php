***REMOVED***

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
***REMOVED***
***REMOVED***
     * Show the confirm password page.
***REMOVED***
    public function show(): Response
    ***REMOVED***
        return Inertia::render('auth/confirm-password');
***REMOVED***

***REMOVED***
     * Confirm the user's password.
***REMOVED***
    public function store(Request $request): RedirectResponse
    ***REMOVED***
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) ***REMOVED***
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
    ***REMOVED***
    ***REMOVED***

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('dashboard', absolute: false));
***REMOVED***
***REMOVED***
