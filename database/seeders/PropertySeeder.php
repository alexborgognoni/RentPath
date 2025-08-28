<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user if none exists
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'John Smith',
                'email' => 'john@example.com',
            ]);
        }

        // Create the three properties matching our mock data
        Property::create([
            'user_id' => $user->id,
            'title' => 'Modern Downtown Apartment',
            'address' => '123 Main Street, Amsterdam',
            'description' => "# Modern Living in the Heart of Amsterdam

This **stunning apartment** offers the perfect blend of contemporary design and urban convenience. Located in Amsterdam's vibrant downtown area, you'll be steps away from:

- World-class restaurants and cafes
- Cultural attractions and museums  
- Excellent public transportation
- Beautiful canals and parks

## Features & Amenities

- **High-speed internet** included
- Modern kitchen with *premium appliances*
- Spacious living area with large windows
- Secure building with elevator access
- Bike storage available

*Perfect for professionals or couples looking for a premium city experience.*",
            'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'type' => 'apartment',
            'bedrooms' => 2,
            'bathrooms' => 1,
            'parking_spots' => 0,
            'size' => 75,
            'size_unit' => 'square_meters',
            'available_date' => '2024-03-15',
            'rent_amount' => 1800,
            'rent_currency' => 'eur',
            'is_active' => true,
        ]);

        Property::create([
            'user_id' => $user->id,
            'title' => 'Cozy Studio Near Park',
            'address' => '456 Park Avenue, Rotterdam',
            'description' => "# Charming Studio Apartment

A **beautiful studio** apartment located near Rotterdam's most popular park. This cozy space is perfect for students or young professionals.

## What's Included

- Fully furnished living space
- Kitchen with modern appliances
- High-speed internet
- Utilities included in rent

*Quiet neighborhood with easy access to city center.*",
            'image_url' => 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            'type' => 'studio',
            'bedrooms' => 0,
            'bathrooms' => 1,
            'parking_spots' => 0,
            'size' => 45,
            'size_unit' => 'square_meters',
            'available_date' => '2024-04-01',
            'rent_amount' => 1200,
            'rent_currency' => 'eur',
            'is_active' => true,
        ]);

        Property::create([
            'user_id' => $user->id,
            'title' => 'Luxury Canal House',
            'address' => '789 Canal Street, Utrecht',
            'description' => "# Historic Canal House

Experience luxury living in this **beautifully restored** 17th-century canal house. This unique property combines historic charm with modern amenities.

## Historic Features

- Original wooden beams and floors
- Canal-front location with water views
- Traditional Dutch architecture
- Private garden courtyard

## Modern Amenities

- **Fully renovated** kitchen and bathrooms
- Central heating and air conditioning
- High-speed fiber internet
- Secure parking space included

*A rare opportunity to live in Utrecht's historic city center.*",
            'image_url' => 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
            'type' => 'house',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'parking_spots' => 1,
            'size' => 120,
            'size_unit' => 'square_meters',
            'available_date' => '2024-05-01',
            'rent_amount' => 2500,
            'rent_currency' => 'eur',
            'is_active' => true,
        ]);

        // Create additional random properties
        Property::factory(10)->forUser($user)->create();
    }
}
