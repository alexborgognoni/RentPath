***REMOVED***

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
***REMOVED***
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
***REMOVED***
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
***REMOVED***
***REMOVED***
     * Show the registration page.
***REMOVED***
    public function create(): Response
    ***REMOVED***
        return Inertia::render('auth/register');
***REMOVED***

***REMOVED***
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
***REMOVED***
    public function store(Request $request): RedirectResponse
    ***REMOVED***
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
***REMOVED***

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
***REMOVED***

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
***REMOVED***
***REMOVED***
