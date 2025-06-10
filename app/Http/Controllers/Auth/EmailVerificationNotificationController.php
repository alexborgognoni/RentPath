***REMOVED***

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
***REMOVED***
***REMOVED***
     * Send a new email verification notification.
***REMOVED***
    public function store(Request $request): RedirectResponse
    ***REMOVED***
        if ($request->user()->hasVerifiedEmail()) ***REMOVED***
            return redirect()->intended(route('dashboard', absolute: false));
    ***REMOVED***

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
***REMOVED***
***REMOVED***
