<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $propertyTypes = [
            'apartment', 'house', 'condo', 'townhouse', 'studio',
            'loft', 'room', 'office', 'garage', 'storage',
            'warehouse', 'retail', 'commercial'
        ];

        $currencies = ['eur', 'usd', 'gbp', 'chf'];
        $sizeUnits = ['square_meters', 'square_feet'];
        
        // Property type influences other characteristics
        $type = fake()->randomElement($propertyTypes);
        
        // Set realistic defaults based on property type
        [$minBedrooms, $maxBedrooms, $minSize, $maxSize, $minRent, $maxRent] = match($type) {
            'studio' => [0, 0, 25, 60, 800, 1500],
            'room' => [1, 1, 12, 25, 400, 800],
            'apartment' => [1, 4, 40, 150, 1000, 3000],
            'house' => [2, 6, 80, 300, 1500, 5000],
            'condo' => [1, 3, 50, 120, 1200, 2800],
            'townhouse' => [2, 4, 100, 200, 1800, 4000],
            'loft' => [1, 2, 60, 120, 1400, 2500],
            'office' => [0, 2, 30, 200, 800, 3000],
            'garage' => [0, 0, 15, 40, 150, 400],
            'storage' => [0, 0, 10, 100, 50, 300],
            'warehouse' => [0, 0, 200, 2000, 1000, 8000],
            'retail' => [0, 1, 50, 300, 1500, 6000],
            'commercial' => [0, 3, 100, 500, 2000, 10000],
            default => [1, 3, 50, 150, 1000, 2500]
        };

        $bedrooms = fake()->numberBetween($minBedrooms, $maxBedrooms);
        
        // Bathrooms logic: usually 1-2 for small properties, can be 0.5 increments
        $bathrooms = match($type) {
            'garage', 'storage', 'warehouse' => 0,
            'room' => fake()->randomFloat(1, 0.5, 1),
            'studio' => 1,
            default => fake()->randomFloat(1, 1, max(1, min($bedrooms + 1, 3)))
        };

        $descriptions = [
            'apartment' => "Beautiful apartment in prime location with modern amenities. Features include:\n\n• Spacious living area with large windows\n• Modern kitchen with **premium appliances**\n• High-speed internet ready\n• Close to public transportation\n\n*Perfect for professionals or small families.*",
            'house' => "Charming house offering comfort and privacy. This property includes:\n\n• Private garden and outdoor space\n• Multiple bedrooms and bathrooms  \n• **Parking space** included\n• Quiet residential neighborhood\n\n*Ideal for families seeking a peaceful home.*",
            'studio' => "Cozy studio apartment perfect for singles or couples. Features:\n\n• Efficient layout maximizing space\n• Modern kitchenette\n• **All utilities included**\n• Great location with easy access to city center\n\n*Perfect for young professionals.*",
            default => "Excellent property in desirable location. Well-maintained and ready for immediate occupancy.\n\n• Modern facilities and amenities\n• **Great value** for the area\n• Convenient access to shops and transport\n\n*Don't miss this opportunity.*"
        ];

        return [
            'user_id' => User::factory(),
            'title' => fake()->randomElement([
                'Modern ' . ucfirst($type) . ' in ' . fake()->city(),
                'Beautiful ' . ucfirst($type) . ' near ' . fake()->streetName(),
                'Spacious ' . ucfirst($type) . ' with Great Views',
                'Cozy ' . ucfirst($type) . ' in Prime Location',
                'Luxury ' . ucfirst($type) . ' Downtown',
                'Renovated ' . ucfirst($type) . ' Ready to Move',
            ]),
            'address' => fake()->streetAddress() . ', ' . fake()->city(),
            'description' => $descriptions[$type] ?? $descriptions['default'],
            'image_url' => fake()->randomElement([
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
            ]),
            'type' => $type,
            'bedrooms' => $bedrooms,
            'bathrooms' => $bathrooms,
            'parking_spots' => fake()->numberBetween(0, $type === 'house' ? 2 : 1),
            'size' => fake()->numberBetween($minSize, $maxSize),
            'size_unit' => fake()->randomElement($sizeUnits),
            'available_date' => fake()->dateTimeBetween('now', '+6 months'),
            'rent_amount' => fake()->numberBetween($minRent, $maxRent),
            'rent_currency' => fake()->randomElement($currencies),
            'is_active' => fake()->boolean(90), // 90% active
        ];
    }

    /**
     * Create a property for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Create an apartment.
     */
    public function apartment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'apartment',
            'bedrooms' => fake()->numberBetween(1, 3),
            'bathrooms' => fake()->randomFloat(1, 1, 2),
            'size' => fake()->numberBetween(40, 120),
            'rent_amount' => fake()->numberBetween(1000, 2500),
        ]);
    }

    /**
     * Create a house.
     */
    public function house(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'house',
            'bedrooms' => fake()->numberBetween(2, 5),
            'bathrooms' => fake()->randomFloat(1, 1.5, 3),
            'size' => fake()->numberBetween(100, 250),
            'parking_spots' => fake()->numberBetween(1, 2),
            'rent_amount' => fake()->numberBetween(1800, 4500),
        ]);
    }

    /**
     * Create a studio.
     */
    public function studio(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'studio',
            'bedrooms' => 0,
            'bathrooms' => 1,
            'size' => fake()->numberBetween(25, 50),
            'parking_spots' => 0,
            'rent_amount' => fake()->numberBetween(800, 1400),
        ]);
    }

    /**
     * Create an active property.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Create an inactive property.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a property available now.
     */
    public function availableNow(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_date' => now(),
        ]);
    }
}
