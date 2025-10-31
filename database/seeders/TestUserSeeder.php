<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PropertyManager;
use App\Models\Property;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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

        $this->command->info('Creating test users...');

        // Create individual property manager user
        $this->createIndividualPropertyManager();

        // Create professional property manager user
        $this->createProfessionalPropertyManager();

        $this->command->info('✅ Test users created successfully!');
        $this->command->line('');
        $this->command->line('Individual Property Manager:');
        $this->command->line('  Email: individual@test.com');
        $this->command->line('  Password: password');
        $this->command->line('');
        $this->command->line('Professional Property Manager:');
        $this->command->line('  Email: professional@test.com');
        $this->command->line('  Password: password');
    }

    /**
     * Create an individual property manager
     */
    private function createIndividualPropertyManager(): void
    {
        // Check if user already exists
        $user = User::where('email', 'individual@test.com')->first();

        if ($user) {
            $this->command->warn('User individual@test.com already exists, skipping...');
            return;
        }

        // Create user
        $user = User::create([
            'first_name' => 'John',
            'last_name' => 'Individual',
            'email' => 'individual@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Create verified property manager profile
        PropertyManager::create([
            'user_id' => $user->id,
            'type' => 'individual',
            'phone_country_code' => '+41',
            'phone_number' => '791234567',
            'profile_picture_path' => null,
            'id_document_path' => 'test/id_document.pdf',
            'profile_verified_at' => now(),
        ]);

        // Create a sample property
        $property = Property::create([
            'property_manager_id' => $user->propertyManager->id,
            'title' => 'Beautiful 2BR Apartment in Zurich',
            'description' => 'Spacious and modern apartment in the heart of Zurich. Perfect for professionals or small families.',
            'house_number' => '42',
            'street_name' => 'Bahnhofstrasse',
            'city' => 'Zurich',
            'postal_code' => '8001',
            'country' => 'CH',
            'type' => 'apartment',
            'subtype' => 'duplex',
            'bedrooms' => 2,
            'bathrooms' => 1.5,
            'parking_spots_interior' => 1,
            'parking_spots_exterior' => 0,
            'size' => 85.5,
            'balcony_size' => 12.0,
            'floor_level' => 3,
            'has_elevator' => true,
            'year_built' => 2018,
            'energy_class' => 'A',
            'thermal_insulation_class' => 'B',
            'heating_type' => 'heat_pump',
            'kitchen_equipped' => true,
            'kitchen_separated' => true,
            'has_cellar' => true,
            'has_laundry' => true,
            'has_fireplace' => false,
            'has_air_conditioning' => true,
            'has_garden' => false,
            'has_rooftop' => true,
            'rent_amount' => 2500.00,
            'rent_currency' => 'chf',
            'available_date' => now()->addDays(30),
            'status' => 'available',
        ]);

        $this->command->info("Created user: {$user->email}");
        $this->command->info("Created property: {$property->title}");
    }

    /**
     * Create a professional property manager
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

        // Create sample properties
        $properties = [
            [
                'title' => 'Luxury Villa with Lake View',
                'description' => 'Stunning villa overlooking Lake Geneva. High-end finishes throughout.',
                'house_number' => '15',
                'street_name' => 'Route de Lausanne',
                'city' => 'Geneva',
                'postal_code' => '1202',
                'type' => 'house',
                'subtype' => 'villa',
                'bedrooms' => 5,
                'bathrooms' => 3.5,
                'size' => 250.0,
                'land_size' => 800.0,
                'rent_amount' => 8500.00,
                'status' => 'available',
            ],
            [
                'title' => 'Modern Office Space in City Center',
                'description' => 'Premium office space with modern amenities and excellent connectivity.',
                'house_number' => '88',
                'street_name' => 'Paradeplatz',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'type' => 'commercial',
                'subtype' => 'office',
                'bedrooms' => 0,
                'bathrooms' => 2,
                'size' => 180.0,
                'rent_amount' => 5200.00,
                'status' => 'available',
            ],
            [
                'title' => 'Cozy Student Room Near University',
                'description' => 'Perfect for students. Close to ETH and University of Zurich.',
                'house_number' => '23',
                'street_name' => 'Universitätstrasse',
                'city' => 'Zurich',
                'postal_code' => '8006',
                'type' => 'room',
                'subtype' => 'student_room',
                'bedrooms' => 1,
                'bathrooms' => 0.5,
                'size' => 18.0,
                'rent_amount' => 750.00,
                'status' => 'leased',
            ],
        ];

        foreach ($properties as $propertyData) {
            $property = Property::create([
                'property_manager_id' => $user->propertyManager->id,
                'title' => $propertyData['title'],
                'description' => $propertyData['description'],
                'house_number' => $propertyData['house_number'],
                'street_name' => $propertyData['street_name'],
                'city' => $propertyData['city'],
                'postal_code' => $propertyData['postal_code'],
                'country' => 'CH',
                'type' => $propertyData['type'],
                'subtype' => $propertyData['subtype'],
                'bedrooms' => $propertyData['bedrooms'],
                'bathrooms' => $propertyData['bathrooms'],
                'parking_spots_interior' => rand(0, 2),
                'parking_spots_exterior' => rand(0, 1),
                'size' => $propertyData['size'],
                'balcony_size' => $propertyData['type'] === 'house' ? null : rand(0, 15),
                'land_size' => $propertyData['land_size'] ?? null,
                'floor_level' => $propertyData['type'] === 'house' ? null : rand(1, 8),
                'has_elevator' => (bool) rand(0, 1),
                'year_built' => rand(1990, 2023),
                'energy_class' => ['A+', 'A', 'B', 'C'][array_rand(['A+', 'A', 'B', 'C'])],
                'thermal_insulation_class' => ['A', 'B', 'C'][array_rand(['A', 'B', 'C'])],
                'heating_type' => ['gas', 'electric', 'heat_pump'][array_rand(['gas', 'electric', 'heat_pump'])],
                'kitchen_equipped' => (bool) rand(0, 1),
                'kitchen_separated' => (bool) rand(0, 1),
                'has_cellar' => (bool) rand(0, 1),
                'has_laundry' => (bool) rand(0, 1),
                'has_fireplace' => (bool) rand(0, 1),
                'has_air_conditioning' => (bool) rand(0, 1),
                'has_garden' => $propertyData['type'] === 'house',
                'has_rooftop' => (bool) rand(0, 1),
                'rent_amount' => $propertyData['rent_amount'],
                'rent_currency' => 'chf',
                'available_date' => now()->addDays(rand(0, 60)),
                'status' => $propertyData['status'],
            ]);

            $this->command->info("Created property: {$property->title}");
        }

        $this->command->info("Created user: {$user->email}");
    }
}
