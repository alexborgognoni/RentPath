<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
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
            'email' => fake()->unique()->safeEmail(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone' => fake()->optional()->phoneNumber(),
            'token' => Str::random(64),
            'source' => Lead::SOURCE_MANUAL,
            'status' => Lead::STATUS_INVITED,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the lead has viewed the property.
     */
    public function viewed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Lead::STATUS_VIEWED,
            'viewed_at' => now(),
        ]);
    }

    /**
     * Indicate that the lead is drafting an application.
     */
    public function drafting(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Lead::STATUS_DRAFTING,
            'source' => Lead::SOURCE_APPLICATION,
            'viewed_at' => now()->subDays(1),
        ]);
    }

    /**
     * Indicate that the lead has applied.
     */
    public function applied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Lead::STATUS_APPLIED,
            'viewed_at' => now()->subDays(3),
        ]);
    }

    /**
     * Indicate that the lead is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Lead::STATUS_ARCHIVED,
        ]);
    }

    /**
     * Indicate that the lead came from an invite.
     */
    public function fromInvite(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => Lead::SOURCE_INVITE,
            'invited_at' => now()->subDays(fake()->numberBetween(1, 14)),
        ]);
    }

    /**
     * Indicate that the lead came from a token signup.
     */
    public function fromTokenSignup(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => Lead::SOURCE_TOKEN_SIGNUP,
            'viewed_at' => now(),
        ]);
    }

    /**
     * Indicate that the lead came from an application.
     */
    public function fromApplication(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => Lead::SOURCE_APPLICATION,
        ]);
    }
}
