***REMOVED***

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
***REMOVED***
    // GET /properties
    public function index()
    ***REMOVED***
        $properties = Property::all();

        return Inertia::render('Dashboard/Properties/Index', [
            'properties' => $properties,
***REMOVED***
***REMOVED***

    // GET /properties/***REMOVED***id***REMOVED***
    public function show(Property $property)
    ***REMOVED***
        return $property;
***REMOVED***

    // POST /properties
    public function store(Request $request)
    ***REMOVED***
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'country' => 'required|string',
            'rent_amount' => 'required|numeric',
            'property_type' => 'required|string',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|integer',
            // Add all other fields you want to support
***REMOVED***

        return Property::create($data);
***REMOVED***

    // PUT /properties/***REMOVED***id***REMOVED***
    public function update(Request $request, Property $property)
    ***REMOVED***
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            // Add rules for fields you allow updating
***REMOVED***

        $property->update($data);

        return $property;
***REMOVED***

    // DELETE /properties/***REMOVED***id***REMOVED***
    public function destroy(Property $property)
    ***REMOVED***
        $property->delete();

        return response()->json(['message' => 'Deleted']);
***REMOVED***
***REMOVED***
