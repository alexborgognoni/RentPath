<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyManager>
 */
class PropertyManagerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['individual', 'professional']);

        return [
            'type' => $type,
            'company_name' => $type === 'professional' ? fake()->company() : null,
            'company_website' => $type === 'professional' ? fake()->domainName() : null,
            'license_number' => $type === 'professional' ? fake()->numerify('LIC-####-####') : null,
            'phone_country_code' => '+41',
            'phone_number' => fake()->numerify('## ### ## ##'),
        ];
    }

    /**
     * Indicate that the property manager profile is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'profile_verified_at' => now(),
        ]);
    }

    /**
     * Indicate that the property manager is an individual.
     */
    public function individual(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'individual',
            'company_name' => null,
            'company_website' => null,
            'license_number' => null,
        ]);
    }

    /**
     * Indicate that the property manager is a professional.
     */
    public function professional(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'professional',
            'company_name' => fake()->company(),
            'company_website' => fake()->domainName(),
            'license_number' => fake()->numerify('LIC-####-####'),
        ]);
    }
}
