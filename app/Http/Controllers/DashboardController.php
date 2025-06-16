***REMOVED***

namespace App\Http\Controllers;

use App\Models\Property;
use Inertia\Inertia;

class DashboardController extends Controller
***REMOVED***
    public function index()
    ***REMOVED***
        return Inertia::render('dashboard/index');
***REMOVED***

    public function properties()
    ***REMOVED***
        return Inertia::render('dashboard/properties', [
            'properties' => \App\Http\Resources\PropertyResource::collection(
                dd(Property::with('media')->first()->toArray())
            ),
***REMOVED***
***REMOVED***

    public function applications()
    ***REMOVED***
        return Inertia::render('dashboard/applications');
***REMOVED***

    public function tenants()
    ***REMOVED***
        return Inertia::render('dashboard/tenants');
***REMOVED***
***REMOVED***
