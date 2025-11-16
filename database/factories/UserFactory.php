<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user has a tenant profile.
     */
    public function withTenantProfile(bool $verified = false): static
    {
        return $this->afterCreating(function ($user) use ($verified) {
            \App\Models\TenantProfile::factory()
                ->for($user)
                ->when($verified, fn($factory) => $factory->verified())
                ->create();
        });
    }

    /**
     * Indicate that the user has a property manager profile.
     */
    public function withPropertyManager(string $type = 'individual', bool $verified = false): static
    {
        return $this->afterCreating(function ($user) use ($type, $verified) {
            \App\Models\PropertyManager::factory()
                ->for($user)
                ->state([
                    'type' => $type,
                    'profile_verified_at' => $verified ? now() : null,
                ])
                ->create();
        });
    }
}
