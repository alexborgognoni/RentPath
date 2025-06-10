***REMOVED***

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
***REMOVED***
***REMOVED***
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
***REMOVED***
    protected $rootView = 'app';

***REMOVED***
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
***REMOVED***
    public function version(Request $request): ?string
    ***REMOVED***
        return parent::version($request);
***REMOVED***

***REMOVED***
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
***REMOVED***
    public function share(Request $request): array
    ***REMOVED***
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
***REMOVED***
***REMOVED***
