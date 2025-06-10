***REMOVED***

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
***REMOVED***
***REMOVED***
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
***REMOVED***
    public function handle(Request $request, Closure $next): Response
    ***REMOVED***
        View::share('appearance', $request->cookie('appearance') ?? 'system');

        return $next($request);
***REMOVED***
***REMOVED***
