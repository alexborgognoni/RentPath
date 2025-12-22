<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\TenantProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'tenant_profile_id' => TenantProfile::factory(),
            'status' => 'draft',
            'current_step' => 0,
            'desired_move_in_date' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'lease_duration_months' => fake()->randomElement([6, 12, 24, 36]),
            'message_to_landlord' => fake()->optional()->paragraph(),
            'additional_occupants' => fake()->numberBetween(0, 3),
            'occupants_details' => [],
            'has_pets' => fake()->boolean(20),
            'pets_details' => [],
            'previous_landlord_name' => fake()->optional()->name(),
            'previous_landlord_phone' => fake()->optional()->phoneNumber(),
            'previous_landlord_email' => fake()->optional()->safeEmail(),
        ];
    }

    /**
     * Indicate that the application has been submitted.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
            'current_step' => 4,
            'submitted_at' => now(),
        ]);
    }

    /**
     * Indicate that the application is under review.
     */
    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'under_review',
            'current_step' => 4,
            'submitted_at' => now()->subDays(2),
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Indicate that a visit has been scheduled.
     */
    public function visitScheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'visit_scheduled',
            'current_step' => 4,
            'submitted_at' => now()->subDays(5),
            'reviewed_at' => now()->subDays(3),
            'visit_scheduled_at' => now()->addDays(3),
        ]);
    }

    /**
     * Indicate that the application has been approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'current_step' => 4,
            'submitted_at' => now()->subDays(10),
            'reviewed_at' => now()->subDays(8),
            'approved_at' => now(),
        ]);
    }

    /**
     * Indicate that the application has been rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'current_step' => 4,
            'submitted_at' => now()->subDays(10),
            'reviewed_at' => now()->subDays(8),
            'rejection_reason' => fake()->sentence(),
        ]);
    }
}
