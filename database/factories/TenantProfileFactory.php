<?php

namespace Database\Factories;

use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TenantProfile>
 */
class TenantProfileFactory extends Factory
{
    protected $model = TenantProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $employmentStatus = fake()->randomElement(['employed', 'self_employed', 'student', 'unemployed', 'retired']);
        $isEmployed = in_array($employmentStatus, ['employed', 'self_employed']);
        $isStudent = $employmentStatus === 'student';

        return [
            'user_id' => User::factory(),

            // Personal information
            'date_of_birth' => fake()->date('Y-m-d', '-25 years'),
            'nationality' => fake()->randomElement(['US', 'GB', 'DE', 'FR', 'NL', 'BE']),
            'phone_country_code' => fake()->randomElement(['+1', '+44', '+49', '+33', '+31', '+32']),
            'phone_number' => fake()->numerify('##########'),

            // Current address
            'current_house_number' => fake()->buildingNumber(),
            'current_street_name' => fake()->streetName(),
            'current_city' => fake()->city(),
            'current_postal_code' => fake()->postcode(),
            'current_country' => fake()->randomElement(['US', 'GB', 'DE', 'FR', 'NL', 'BE']),

            // Employment
            'employment_status' => $employmentStatus,
            'employer_name' => $isEmployed ? fake()->company() : null,
            'job_title' => $isEmployed ? fake()->jobTitle() : null,
            'employment_start_date' => $isEmployed ? fake()->date('Y-m-d', '-2 years') : null,
            'employment_type' => $isEmployed ? fake()->randomElement(['full_time', 'part_time', 'contract', 'temporary']) : null,
            'monthly_income' => fake()->numberBetween(2000, 8000),
            'income_currency' => 'eur',
            'employer_contact_name' => $isEmployed ? fake()->name() : null,
            'employer_contact_phone' => $isEmployed ? fake()->phoneNumber() : null,
            'employer_contact_email' => $isEmployed ? fake()->safeEmail() : null,

            // Student info
            'university_name' => $isStudent ? fake()->company().' University' : null,
            'program_of_study' => $isStudent ? fake()->randomElement(['Computer Science', 'Business Administration', 'Engineering', 'Medicine']) : null,
            'expected_graduation_date' => $isStudent ? fake()->date('Y-m-d', '+2 years') : null,
            'student_income_source' => $isStudent ? fake()->randomElement(['Parents', 'Scholarship', 'Part-time job', 'Student loan']) : null,

            // Guarantor (30% chance)
            'has_guarantor' => false,

            // Emergency contact
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->phoneNumber(),
            'emergency_contact_relationship' => fake()->randomElement(['Parent', 'Sibling', 'Friend', 'Spouse']),

            // Preferences
            'occupants_count' => fake()->numberBetween(1, 3),
            'has_pets' => fake()->boolean(30),
            'pets_description' => fake()->boolean(30) ? fake()->randomElement(['1 cat', '1 dog (small breed)', '2 cats']) : null,
            'is_smoker' => fake()->boolean(10),

            // Verification - not verified by default
            'profile_verified_at' => null,
            'verification_rejection_reason' => null,
            'verification_rejected_fields' => null,
        ];
    }

    /**
     * Indicate that the tenant profile should be verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'profile_verified_at' => now(),
        ]);
    }

    /**
     * Indicate that the tenant profile should be rejected.
     */
    public function rejected(string $reason = 'Documents are not clear enough'): static
    {
        return $this->state(fn (array $attributes) => [
            'profile_verified_at' => null,
            'verification_rejection_reason' => $reason,
            'verification_rejected_fields' => ['id_document_front_path', 'id_document_back_path'],
        ]);
    }

    /**
     * Create an employed tenant profile.
     */
    public function employed(): static
    {
        return $this->state(fn (array $attributes) => [
            'employment_status' => 'employed',
            'employer_name' => fake()->company(),
            'job_title' => fake()->jobTitle(),
            'employment_start_date' => fake()->date('Y-m-d', '-2 years'),
            'employment_type' => 'full_time',
            'monthly_income' => fake()->numberBetween(3000, 8000),
            'employer_contact_name' => fake()->name(),
            'employer_contact_phone' => fake()->phoneNumber(),
            'employer_contact_email' => fake()->safeEmail(),
            'university_name' => null,
            'program_of_study' => null,
            'expected_graduation_date' => null,
            'student_income_source' => null,
        ]);
    }

    /**
     * Create a student tenant profile.
     */
    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'employment_status' => 'student',
            'employer_name' => null,
            'job_title' => null,
            'employment_start_date' => null,
            'employment_type' => null,
            'monthly_income' => fake()->numberBetween(800, 2000),
            'employer_contact_name' => null,
            'employer_contact_phone' => null,
            'employer_contact_email' => null,
            'university_name' => fake()->company().' University',
            'program_of_study' => fake()->randomElement(['Computer Science', 'Business Administration', 'Engineering', 'Medicine']),
            'expected_graduation_date' => fake()->date('Y-m-d', '+2 years'),
            'student_income_source' => fake()->randomElement(['Parents', 'Scholarship', 'Part-time job']),
        ]);
    }

    /**
     * Create a tenant profile with a guarantor.
     */
    public function withGuarantor(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_guarantor' => true,
            'guarantor_name' => fake()->name(),
            'guarantor_relationship' => fake()->randomElement(['Parent', 'Sibling', 'Friend', 'Relative']),
            'guarantor_phone' => fake()->phoneNumber(),
            'guarantor_email' => fake()->safeEmail(),
            'guarantor_address' => fake()->address(),
            'guarantor_employer' => fake()->company(),
            'guarantor_monthly_income' => fake()->numberBetween(4000, 10000),
        ]);
    }
}
