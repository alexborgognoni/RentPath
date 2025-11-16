<?php

namespace Database\Factories;

use App\Models\PropertyManager;
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
        $type = fake()->randomElement(['apartment', 'house', 'room']);

        $subtypes = [
            'apartment' => ['studio', 'loft', 'duplex', 'penthouse'],
            'house' => ['detached', 'semi-detached', 'villa'],
            'room' => ['private_room', 'student_room', 'co-living'],
        ];

        return [
            'property_manager_id' => PropertyManager::factory(),
            'title' => fake()->words(3, true),
            'description' => fake()->paragraphs(3, true),
            'type' => $type,
            'subtype' => fake()->randomElement($subtypes[$type]),
            'status' => 'available',
            'house_number' => fake()->buildingNumber(),
            'street_name' => fake()->streetName(),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'country' => 'CH',
            'bedrooms' => fake()->numberBetween(1, 5),
            'bathrooms' => fake()->randomFloat(1, 1, 3),
            'size' => fake()->randomFloat(2, 30, 200),
            'rent_amount' => fake()->randomFloat(2, 800, 3000),
            'rent_currency' => 'chf',
            'available_date' => now()->addDays(7),
            'requires_invite' => false,
        ];
    }

    /**
     * Indicate that the property is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    /**
     * Indicate that the property requires an invite.
     */
    public function requiresInvite(): static
    {
        return $this->state(fn (array $attributes) => [
            'requires_invite' => true,
        ]);
    }
}
