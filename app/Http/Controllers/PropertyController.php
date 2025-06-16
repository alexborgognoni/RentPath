***REMOVED***

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Property;

class PropertyController extends Controller
***REMOVED***
    public function create()
    ***REMOVED***
        return Inertia::render('dashboard/create_property');
***REMOVED***

    // Add the show method for property details
    public function show(Property $property)
    ***REMOVED***
        return Inertia::render('dashboard/property_details', [
            'property' => $property
***REMOVED***
***REMOVED***
***REMOVED***
