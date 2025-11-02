<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PropertyManager;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only run in local environment
        if (!app()->environment('local')) {
            $this->command->warn('Skipping TestUserSeeder - only runs in local environment');
            return;
        }

        $this->command->info('Creating test users and properties...');

        // Create professional property manager user
        $this->createProfessionalPropertyManager();

        $this->command->info('✅ Test users and properties created successfully!');
        $this->command->line('');
        $this->command->line('Professional Property Manager:');
        $this->command->line('  Email: professional@test.com');
        $this->command->line('  Password: password');
    }

    /**
     * Create a professional property manager with comprehensive property examples
     */
    private function createProfessionalPropertyManager(): void
    {
        // Check if user already exists
        $user = User::where('email', 'professional@test.com')->first();

        if ($user) {
            $this->command->warn('User professional@test.com already exists, skipping...');
            return;
        }

        // Create user
        $user = User::create([
            'first_name' => 'Sarah',
            'last_name' => 'Professional',
            'email' => 'professional@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Create verified property manager profile
        PropertyManager::create([
            'user_id' => $user->id,
            'type' => 'professional',
            'company_name' => 'Prime Properties AG',
            'company_website' => 'prime-properties.ch',
            'license_number' => 'PM-2024-001',
            'phone_country_code' => '+41',
            'phone_number' => '442345678',
            'profile_picture_path' => null,
            'license_document_path' => 'test/license_document.pdf',
            'profile_verified_at' => now(),
        ]);

        $this->command->info("Created user: {$user->email}");

        // Create comprehensive property examples with images
        $this->createProperties($user->propertyManager->id);
    }

    /**
     * Create properties for each type/subtype combination
     */
    private function createProperties(int $propertyManagerId): void
    {
        $properties = [
            // APARTMENT TYPES
            [
                'title' => 'Modern Studio Apartment in Zurich Center',
                'description' => 'Compact and efficient studio apartment in the heart of Zurich. Perfect for young professionals or students. Features modern appliances, high-speed internet, and excellent public transport connections.',
                'type' => 'apartment',
                'subtype' => 'studio',
                'address' => ['42', 'Bahnhofstrasse', 'Zurich', '8001'],
                'bedrooms' => 0,
                'bathrooms' => 1,
                'size' => 35.0,
                'rent_amount' => 1800.00,
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
                ],
            ],
            [
                'title' => 'Industrial Loft Apartment with High Ceilings',
                'description' => 'Stunning converted industrial loft with exposed brick walls, high ceilings, and large windows. Open-plan living space perfect for creative professionals. Located in trendy Zurich West district.',
                'type' => 'apartment',
                'subtype' => 'loft',
                'address' => ['88', 'Hardstrasse', 'Zurich', '8005'],
                'bedrooms' => 1,
                'bathrooms' => 1.5,
                'size' => 95.0,
                'rent_amount' => 3200.00,
                'images' => [
                    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200',
                    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200',
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
                ],
            ],
            [
                'title' => 'Spacious 2-Level Duplex Apartment',
                'description' => 'Beautiful duplex apartment spread over two floors. Features separate living and sleeping areas, modern kitchen, and private balcony. Quiet residential neighborhood with excellent schools nearby.',
                'type' => 'apartment',
                'subtype' => 'duplex',
                'address' => ['15', 'Seestrasse', 'Zurich', '8002'],
                'bedrooms' => 2,
                'bathrooms' => 2,
                'size' => 110.0,
                'rent_amount' => 3500.00,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
                ],
            ],
            [
                'title' => 'Unique 3-Level Triplex with Garden Access',
                'description' => 'Rare triplex apartment spanning three floors. Each level thoughtfully designed with modern finishes. Direct access to shared garden. Perfect for families seeking space and comfort.',
                'type' => 'apartment',
                'subtype' => 'triplex',
                'address' => ['23', 'Zürichbergstrasse', 'Zurich', '8032'],
                'bedrooms' => 3,
                'bathrooms' => 2.5,
                'size' => 145.0,
                'rent_amount' => 4200.00,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200',
                    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200',
                    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
                ],
            ],
            [
                'title' => 'Luxury Penthouse with Panoramic City Views',
                'description' => 'Exclusive penthouse apartment on the top floor with breathtaking 360° views of Zurich and the Alps. Features premium finishes, smart home technology, private rooftop terrace, and concierge service.',
                'type' => 'apartment',
                'subtype' => 'penthouse',
                'address' => ['100', 'Bellevueplatz', 'Zurich', '8001'],
                'bedrooms' => 4,
                'bathrooms' => 3.5,
                'size' => 250.0,
                'rent_amount' => 12000.00,
                'images' => [
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
                    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200',
                    'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200',
                ],
            ],
            [
                'title' => 'Fully Serviced Apartment with Hotel Amenities',
                'description' => 'Premium serviced apartment with weekly housekeeping, 24/7 reception, gym access, and on-site restaurant. All utilities and WiFi included. Perfect for business travelers or temporary stays.',
                'type' => 'apartment',
                'subtype' => 'serviced',
                'address' => ['45', 'Talstrasse', 'Zurich', '8001'],
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 55.0,
                'rent_amount' => 2800.00,
                'images' => [
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200',
                    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200',
                    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200',
                ],
            ],

            // HOUSE TYPES
            [
                'title' => 'Modern Detached Family House with Garden',
                'description' => 'Beautiful detached house in quiet suburban area. Features 4 bedrooms, modern kitchen, spacious living areas, and large private garden. Perfect for families. Close to international schools.',
                'type' => 'house',
                'subtype' => 'detached',
                'address' => ['12', 'Bergstrasse', 'Zollikon', '8702'],
                'bedrooms' => 4,
                'bathrooms' => 3,
                'size' => 180.0,
                'land_size' => 500.0,
                'rent_amount' => 5500.00,
                'images' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
                    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200',
                ],
            ],
            [
                'title' => 'Charming Semi-Detached House',
                'description' => 'Well-maintained semi-detached house with private entrance and garden. Three bedrooms, modern bathrooms, and fully equipped kitchen. Quiet neighborhood with excellent transport links.',
                'type' => 'house',
                'subtype' => 'semi-detached',
                'address' => ['34', 'Hauptstrasse', 'Adliswil', '8134'],
                'bedrooms' => 3,
                'bathrooms' => 2.5,
                'size' => 140.0,
                'land_size' => 250.0,
                'rent_amount' => 4200.00,
                'images' => [
                    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
                    'https://images.unsplash.com/photo-1600563438938-a650a5f2cda4?w=1200',
                    'https://images.unsplash.com/photo-1600566752229-250ed79470f6?w=1200',
                ],
            ],
            [
                'title' => 'Luxurious Villa with Lake Views',
                'description' => 'Stunning contemporary villa overlooking Lake Zurich. Premium finishes throughout, infinity pool, home cinema, wine cellar, and landscaped gardens. Ultimate luxury living with privacy and tranquility.',
                'type' => 'house',
                'subtype' => 'villa',
                'address' => ['15', 'Seestrasse', 'Küsnacht', '8700'],
                'bedrooms' => 6,
                'bathrooms' => 5,
                'size' => 450.0,
                'land_size' => 1200.0,
                'rent_amount' => 15000.00,
                'images' => [
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
                ],
            ],
            [
                'title' => 'Cozy Bungalow with Mountain Views',
                'description' => 'Single-story bungalow perfect for retirees or those seeking accessibility. All rooms on one level, wheelchair accessible, private garden, and stunning mountain views. Peaceful location.',
                'type' => 'house',
                'subtype' => 'bungalow',
                'address' => ['67', 'Waldweg', 'Uetliberg', '8143'],
                'bedrooms' => 2,
                'bathrooms' => 2,
                'size' => 95.0,
                'land_size' => 350.0,
                'rent_amount' => 3200.00,
                'images' => [
                    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200',
                    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200',
                    'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200',
                ],
            ],

            // ROOM TYPES
            [
                'title' => 'Private Room in Shared Apartment',
                'description' => 'Comfortable private room in friendly shared apartment. Includes access to shared kitchen, living room, and bathroom. Great community atmosphere. All utilities included in rent.',
                'type' => 'room',
                'subtype' => 'private_room',
                'address' => ['78', 'Langstrasse', 'Zurich', '8004'],
                'bedrooms' => 1,
                'bathrooms' => 0.5,
                'size' => 22.0,
                'rent_amount' => 950.00,
                'images' => [
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200',
                    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200',
                    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200',
                ],
            ],
            [
                'title' => 'Student Room Near ETH Zurich',
                'description' => 'Affordable student room within walking distance to ETH and University of Zurich. Furnished room with desk, bed, and wardrobe. Shared kitchen and bathroom. Fast internet included. Perfect for students.',
                'type' => 'room',
                'subtype' => 'student_room',
                'address' => ['56', 'Universitätstrasse', 'Zurich', '8006'],
                'bedrooms' => 1,
                'bathrooms' => 0.5,
                'size' => 18.0,
                'rent_amount' => 850.00,
                'images' => [
                    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200',
                    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200',
                    'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200',
                ],
            ],
            [
                'title' => 'Co-Living Space with Community Events',
                'description' => 'Modern co-living room in vibrant community. Private bedroom with shared living spaces, coworking area, gym, and rooftop terrace. Regular community events and networking opportunities. All-inclusive pricing.',
                'type' => 'room',
                'subtype' => 'co-living',
                'address' => ['120', 'Europaallee', 'Zurich', '8004'],
                'bedrooms' => 1,
                'bathrooms' => 0.5,
                'size' => 25.0,
                'rent_amount' => 1200.00,
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200',
                    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
                ],
            ],

            // COMMERCIAL TYPES
            [
                'title' => 'Modern Office Space in Business District',
                'description' => 'Premium office space in prime business location. Open-plan layout with meeting rooms, kitchenette, and fiber internet. Air-conditioned with 24/7 access. Underground parking available.',
                'type' => 'commercial',
                'subtype' => 'office',
                'address' => ['88', 'Paradeplatz', 'Zurich', '8001'],
                'bedrooms' => 0,
                'bathrooms' => 2,
                'size' => 180.0,
                'rent_amount' => 5500.00,
                'images' => [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
                    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200',
                    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200',
                ],
            ],
            [
                'title' => 'High-Street Retail Shop with Display Windows',
                'description' => 'Prime retail space on busy shopping street. Large display windows, open sales floor, storage room, and customer WC. High foot traffic location. Perfect for fashion, electronics, or specialty retail.',
                'type' => 'commercial',
                'subtype' => 'retail',
                'address' => ['45', 'Bahnhofstrasse', 'Zurich', '8001'],
                'bedrooms' => 0,
                'bathrooms' => 1,
                'size' => 120.0,
                'rent_amount' => 8500.00,
                'images' => [
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
                    'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200',
                    'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1200',
                ],
            ],

            // INDUSTRIAL TYPES
            [
                'title' => 'Large Warehouse with Loading Dock',
                'description' => 'Spacious warehouse facility with high ceilings, loading dock, and ample parking. Features office area, multiple storage zones, and 24/7 access. Ideal for distribution, storage, or light manufacturing.',
                'type' => 'industrial',
                'subtype' => 'warehouse',
                'address' => ['200', 'Industriestrasse', 'Zurich', '8005'],
                'bedrooms' => 0,
                'bathrooms' => 2,
                'size' => 800.0,
                'rent_amount' => 6500.00,
                'images' => [
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
                    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200',
                    'https://images.unsplash.com/photo-1565884017541-8209f71d58f3?w=1200',
                ],
            ],
            [
                'title' => 'Industrial Factory Unit with Heavy Power',
                'description' => 'Purpose-built factory unit with heavy-duty power supply, overhead cranes, and industrial ventilation. Includes office space, workshop area, and ample parking. Perfect for manufacturing operations.',
                'type' => 'industrial',
                'subtype' => 'factory',
                'address' => ['150', 'Fabrikweg', 'Winterthur', '8400'],
                'bedrooms' => 0,
                'bathrooms' => 3,
                'size' => 1200.0,
                'rent_amount' => 9500.00,
                'images' => [
                    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
                    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200',
                    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200',
                ],
            ],

            // PARKING TYPES
            [
                'title' => 'Secure Underground Garage',
                'description' => 'Individual garage unit in secure underground parking facility. 24/7 access with electronic gate, CCTV monitoring, and ample space for one vehicle plus storage. Close to city center.',
                'type' => 'parking',
                'subtype' => 'garage',
                'address' => ['33', 'Parkstrasse', 'Zurich', '8002'],
                'bedrooms' => 0,
                'bathrooms' => 0,
                'size' => 18.0,
                'rent_amount' => 250.00,
                'images' => [
                    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200',
                    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200',
                    'https://images.unsplash.com/photo-1580988588655-e5f7c8e76ccf?w=1200',
                ],
            ],
            [
                'title' => 'Covered Indoor Parking Spot',
                'description' => 'Covered parking spot in secure indoor facility. Convenient location near public transport. Perfect for protecting your vehicle from weather. Monthly rental available.',
                'type' => 'parking',
                'subtype' => 'indoor_spot',
                'address' => ['88', 'Hauptbahnhof', 'Zurich', '8001'],
                'bedrooms' => 0,
                'bathrooms' => 0,
                'size' => 12.0,
                'rent_amount' => 200.00,
                'images' => [
                    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200',
                    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200',
                    'https://images.unsplash.com/photo-1580988588655-e5f7c8e76ccf?w=1200',
                ],
            ],
            [
                'title' => 'Outdoor Parking Spot Near Station',
                'description' => 'Open-air parking spot in gated lot. Convenient location next to train station. Video surveillance and regular security patrols. Affordable monthly parking solution.',
                'type' => 'parking',
                'subtype' => 'outdoor_spot',
                'address' => ['12', 'Bahnhofplatz', 'Zurich', '8001'],
                'bedrooms' => 0,
                'bathrooms' => 0,
                'size' => 12.0,
                'rent_amount' => 150.00,
                'images' => [
                    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200',
                    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200',
                    'https://images.unsplash.com/photo-1580988588655-e5f7c8e76ccf?w=1200',
                ],
            ],
        ];

        foreach ($properties as $propertyData) {
            $this->createProperty($propertyManagerId, $propertyData);
        }
    }

    /**
     * Create a single property with images
     */
    private function createProperty(int $propertyManagerId, array $data): void
    {
        // Create property
        $property = Property::create([
            'property_manager_id' => $propertyManagerId,
            'title' => $data['title'],
            'description' => $data['description'],
            'house_number' => $data['address'][0],
            'street_name' => $data['address'][1],
            'city' => $data['address'][2],
            'postal_code' => $data['address'][3],
            'country' => 'CH',
            'type' => $data['type'],
            'subtype' => $data['subtype'],
            'bedrooms' => $data['bedrooms'],
            'bathrooms' => $data['bathrooms'],
            'parking_spots_interior' => rand(0, 2),
            'parking_spots_exterior' => rand(0, 1),
            'size' => $data['size'],
            'balcony_size' => isset($data['balcony_size']) ? $data['balcony_size'] : ($data['type'] === 'apartment' ? rand(5, 15) : null),
            'land_size' => $data['land_size'] ?? null,
            'floor_level' => in_array($data['type'], ['apartment', 'commercial']) ? rand(1, 8) : null,
            'has_elevator' => in_array($data['type'], ['apartment', 'commercial']) && rand(0, 1),
            'year_built' => rand(1990, 2023),
            'energy_class' => ['A+', 'A', 'B', 'C'][array_rand(['A+', 'A', 'B', 'C'])],
            'thermal_insulation_class' => ['A', 'B', 'C'][array_rand(['A', 'B', 'C'])],
            'heating_type' => ['gas', 'electric', 'heat_pump'][array_rand(['gas', 'electric', 'heat_pump'])],
            'kitchen_equipped' => in_array($data['type'], ['apartment', 'house', 'room']),
            'kitchen_separated' => (bool) rand(0, 1),
            'has_cellar' => (bool) rand(0, 1),
            'has_laundry' => (bool) rand(0, 1),
            'has_fireplace' => $data['type'] === 'house' && rand(0, 1),
            'has_air_conditioning' => (bool) rand(0, 1),
            'has_garden' => in_array($data['type'], ['house']) || (isset($data['land_size']) && $data['land_size'] > 0),
            'has_rooftop' => $data['subtype'] === 'penthouse' || rand(0, 10) > 8,
            'rent_amount' => $data['rent_amount'],
            'rent_currency' => 'chf',
            'available_date' => now()->addDays(rand(0, 60)),
            'status' => 'available',
        ]);

        // Download and save images
        if (isset($data['images'])) {
            foreach ($data['images'] as $index => $imageUrl) {
                $this->downloadAndSaveImage($property, $imageUrl, $index);
            }
        }

        $this->command->info("Created property: {$property->title}");
    }

    /**
     * Download an image from URL and save it to storage
     */
    private function downloadAndSaveImage(Property $property, string $url, int $index): void
    {
        try {
            // Download image
            $response = Http::timeout(30)->get($url);

            if ($response->successful()) {
                // Generate filename
                $extension = 'jpg';
                $filename = "property_{$property->id}_image_{$index}.{$extension}";
                $path = "properties/{$property->id}/{$filename}";

                // Save to storage
                Storage::disk('properties')->put($path, $response->body());

                // Create PropertyImage record
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $path,
                    'sort_order' => $index,
                    'is_main' => $index === 0, // First image is main
                ]);

                $this->command->info("  Downloaded image " . ($index + 1) . " for property {$property->id}");
            } else {
                $this->command->warn("  Failed to download image from: {$url}");
            }
        } catch (\Exception $e) {
            $this->command->warn("  Error downloading image: {$e->getMessage()}");
        }
    }
}
