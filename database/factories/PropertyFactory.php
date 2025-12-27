<?php

namespace Database\Factories;

use App\Models\Property;
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
            'status' => Property::STATUS_VACANT,
            'visibility' => Property::VISIBILITY_PUBLIC,
            'accepting_applications' => true,
            'application_access' => Property::ACCESS_OPEN,
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
        ];
    }

    /**
     * Indicate that the property is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Property::STATUS_DRAFT,
            'visibility' => Property::VISIBILITY_PRIVATE,
            'accepting_applications' => false,
        ]);
    }

    /**
     * Indicate that the property is vacant.
     */
    public function vacant(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Property::STATUS_VACANT,
        ]);
    }

    /**
     * Indicate that the property is leased.
     */
    public function leased(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Property::STATUS_LEASED,
            'accepting_applications' => false,
        ]);
    }

    /**
     * Indicate that the property is publicly visible.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => Property::VISIBILITY_PUBLIC,
        ]);
    }

    /**
     * Indicate that the property is unlisted (accessible via link only).
     */
    public function unlisted(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => Property::VISIBILITY_UNLISTED,
        ]);
    }

    /**
     * Indicate that the property is private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => Property::VISIBILITY_PRIVATE,
        ]);
    }

    /**
     * Indicate that the property requires a token link to apply.
     */
    public function requiresToken(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_access' => Property::ACCESS_LINK_REQUIRED,
        ]);
    }

    /**
     * Indicate that the property is invite-only for applications.
     */
    public function inviteOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_access' => Property::ACCESS_INVITE_ONLY,
        ]);
    }

    /**
     * Indicate that the property is not accepting applications.
     */
    public function notAcceptingApplications(): static
    {
        return $this->state(fn (array $attributes) => [
            'accepting_applications' => false,
        ]);
    }
}
