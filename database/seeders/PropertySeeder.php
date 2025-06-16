***REMOVED***

***REMOVED***

use App\Models\Property;
***REMOVED***

class PropertySeeder extends Seeder
***REMOVED***
    public function run()
    ***REMOVED***
        // Clear existing media if reseeding
        Property::all()->each->clearMediaCollection();

        // Create properties using factory
        Property::factory()
            ->count(20)
            ->create();
***REMOVED***
***REMOVED***
