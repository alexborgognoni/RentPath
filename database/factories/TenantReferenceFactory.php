<?php

namespace Database\Factories;

use App\Models\TenantProfile;
use App\Models\TenantReference;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TenantReference>
 */
class TenantReferenceFactory extends Factory
{
    protected $model = TenantReference::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tenant_profile_id' => TenantProfile::factory(),
            'type' => fake()->randomElement([
                TenantReference::TYPE_LANDLORD,
                TenantReference::TYPE_PERSONAL,
                TenantReference::TYPE_PROFESSIONAL,
            ]),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'relationship' => fake()->randomElement(['Landlord', 'Employer', 'Friend', 'Colleague', 'Mentor']),
            'years_known' => fake()->numberBetween(1, 10),
            'reference_document_path' => null,
            'reference_document_original_name' => null,
        ];
    }

    /**
     * Create a landlord reference.
     */
    public function landlord(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TenantReference::TYPE_LANDLORD,
            'relationship' => 'Previous Landlord',
            'years_known' => fake()->numberBetween(1, 5),
        ]);
    }

    /**
     * Create a personal reference.
     */
    public function personal(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TenantReference::TYPE_PERSONAL,
            'relationship' => fake()->randomElement(['Friend', 'Family Friend', 'Neighbor']),
            'years_known' => fake()->numberBetween(3, 15),
        ]);
    }

    /**
     * Create a professional reference.
     */
    public function professional(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TenantReference::TYPE_PROFESSIONAL,
            'relationship' => fake()->randomElement(['Employer', 'Manager', 'Colleague', 'Business Partner']),
            'years_known' => fake()->numberBetween(1, 10),
        ]);
    }

    /**
     * Add a reference document.
     */
    public function withDocument(): static
    {
        return $this->state(fn (array $attributes) => [
            'reference_document_path' => 'profiles/references/'.fake()->uuid().'.pdf',
            'reference_document_original_name' => 'reference_letter.pdf',
        ]);
    }
}
