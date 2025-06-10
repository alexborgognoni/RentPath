***REMOVED***

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
***REMOVED***
***REMOVED***
     * Show the password reset link request page.
***REMOVED***
    public function create(Request $request): Response
    ***REMOVED***
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
***REMOVED***
***REMOVED***

***REMOVED***
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
***REMOVED***
    public function store(Request $request): RedirectResponse
    ***REMOVED***
        $request->validate([
            'email' => 'required|email',
***REMOVED***

        Password::sendResetLink(
            $request->only('email')
        );

        return back()->with('status', __('A reset link will be sent if the account exists.'));
***REMOVED***
***REMOVED***
