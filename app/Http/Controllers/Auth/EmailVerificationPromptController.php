***REMOVED***

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
***REMOVED***
***REMOVED***
     * Show the email verification prompt page.
***REMOVED***
    public function __invoke(Request $request): Response|RedirectResponse
    ***REMOVED***
        return $request->user()->hasVerifiedEmail()
                    ? redirect()->intended(route('dashboard', absolute: false))
                    : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
***REMOVED***
***REMOVED***
