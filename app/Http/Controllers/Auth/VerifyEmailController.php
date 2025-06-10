***REMOVED***

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
***REMOVED***
***REMOVED***
     * Mark the authenticated user's email address as verified.
***REMOVED***
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    ***REMOVED***
        if ($request->user()->hasVerifiedEmail()) ***REMOVED***
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    ***REMOVED***

        if ($request->user()->markEmailAsVerified()) ***REMOVED***
        ***REMOVED*** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
    ***REMOVED***

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
***REMOVED***
***REMOVED***
