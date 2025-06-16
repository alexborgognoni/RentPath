***REMOVED***

namespace Database\Factories;

use App\Models\Property;
***REMOVED***
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PropertyFactory extends Factory
***REMOVED***
    protected $model = Property::class;

    public function definition(): array
    ***REMOVED***
        $propertyTypes = [
            'House',
            'Detached House',
            'Semi-detached House',
            'Apartment',
            'Studio',
            'Penthouse',
            'Duplex',
            'Triplex',
            'Loft',
            'Garage',
            'Office'
        ];

        $occupancyStatuses = [
            'Vacant',
            'Occupied',
            'Under Maintenance'
        ];

        $heatingTypes = [
            'electric',
            'gas',
            'oil',
            'district_heating',
            'heat_pump',
            'wood',
            'pellet_stove',
            'solar',
            'hybrid'
        ];

        $energyClasses = ['A++', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

        return [
            'id' => Str::uuid(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(4),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->postcode(),
            'country' => 'Luxembourg',
            'latitude' => $this->faker->latitude(49.5, 50),
            'longitude' => $this->faker->longitude(5.7, 6.5),
            'occupancy_status' => $this->faker->randomElement($occupancyStatuses),
            'rent_amount' => $this->faker->randomFloat(2, 800, 3500),
            'security_deposit' => $this->faker->randomFloat(2, 1000, 7000),
            'available_from' => $this->faker->dateTimeBetween('now', '+3 months'),
            'lease_term_months' => $this->faker->randomElement([6, 12, 24, 36]),
            'property_type' => $this->faker->randomElement($propertyTypes),
            'bedrooms' => $this->faker->numberBetween(0, 5),
            'bathrooms' => $this->faker->numberBetween(1, 3),
            'square_meters' => $this->faker->numberBetween(35, 200),
            'floor_number' => $this->faker->numberBetween(0, 5),
            'total_floors' => $this->faker->numberBetween(1, 6),
            'year_built' => $this->faker->numberBetween(1950, 2023),
            'furnished' => $this->faker->boolean(),
            'pets_allowed' => $this->faker->boolean(70),
            'smoking_allowed' => $this->faker->boolean(30),
            'indoor_parking_spots' => $this->faker->numberBetween(0, 2),
            'outdoor_parking_spots' => $this->faker->numberBetween(0, 2),
            'heating_type' => $this->faker->randomElement($heatingTypes),
            'energy_class' => $this->faker->randomElement($energyClasses),
            'virtual_tour_url' => $this->faker->url(),
            'is_visible' => true,
            'is_active' => true,
            'is_invite_only' => false,
            'access_code' => null,
            'created_by' => User::inRandomOrder()->first()?->id ?? Str::uuid(),
            'updated_by' => User::inRandomOrder()->first()?->id ?? Str::uuid(),
        ];
***REMOVED***

    public function configure()
    ***REMOVED***
        return $this->afterMaking(function (Property $property) ***REMOVED***
            // This runs BEFORE creation
    ***REMOVED***)->afterCreating(function (Property $property) ***REMOVED***
            $this->seedMediaForProperty($property);
            // Refresh to ensure accessors see the media
            $property->refresh();
    ***REMOVED***);
***REMOVED***

    protected function seedMediaForProperty(Property $property)
    ***REMOVED***
        $type = strtolower(str_replace(' ', '_', $property->property_type));
        $imageDir = database_path("seeders/images/***REMOVED***$type***REMOVED***");

        // Add cover image if exists
        $coverPath = "***REMOVED***$imageDir***REMOVED***/***REMOVED***$type***REMOVED***_cover.jpg";
        if (file_exists($coverPath)) ***REMOVED***
            $property->addMedia($coverPath)
                ->preservingOriginal()
                ->toMediaCollection('cover');
    ***REMOVED***

        // Add gallery images
        $i = 1;
        while (file_exists("***REMOVED***$imageDir***REMOVED***/***REMOVED***$type***REMOVED***_***REMOVED***$i***REMOVED***.jpg")) ***REMOVED***
            $property->addMedia("***REMOVED***$imageDir***REMOVED***/***REMOVED***$type***REMOVED***_***REMOVED***$i***REMOVED***.jpg")
                ->preservingOriginal()
                ->toMediaCollection('gallery');
            $i++;
    ***REMOVED***
***REMOVED***
***REMOVED***
