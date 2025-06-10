***REMOVED***

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
***REMOVED***
***REMOVED***
     * Show the user's profile settings page.
***REMOVED***
    public function edit(Request $request): Response
    ***REMOVED***
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
***REMOVED***
***REMOVED***

***REMOVED***
     * Update the user's profile settings.
***REMOVED***
    public function update(ProfileUpdateRequest $request): RedirectResponse
    ***REMOVED***
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) ***REMOVED***
            $request->user()->email_verified_at = null;
    ***REMOVED***

        $request->user()->save();

        return to_route('profile.edit');
***REMOVED***

***REMOVED***
     * Delete the user's account.
***REMOVED***
    public function destroy(Request $request): RedirectResponse
    ***REMOVED***
        $request->validate([
            'password' => ['required', 'current_password'],
***REMOVED***

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
***REMOVED***
***REMOVED***
