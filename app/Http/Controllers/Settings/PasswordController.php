***REMOVED***

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
***REMOVED***
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
***REMOVED***
***REMOVED***
     * Show the user's password settings page.
***REMOVED***
    public function edit(): Response
    ***REMOVED***
        return Inertia::render('settings/password');
***REMOVED***

***REMOVED***
     * Update the user's password.
***REMOVED***
    public function update(Request $request): RedirectResponse
    ***REMOVED***
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
***REMOVED***

        $request->user()->update([
            'password' => Hash::make($validated['password']),
***REMOVED***

        return back();
***REMOVED***
***REMOVED***
