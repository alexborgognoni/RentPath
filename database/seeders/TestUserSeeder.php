<?php

namespace Database\Seeders;

use App\Models\PropertyManager;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only run in local environment
        if (! app()->environment('local')) {
            $this->command->warn('Skipping TestUserSeeder - only runs in local environment');

            return;
        }

        $this->command->info('Creating test users...');

        // Create professional property manager user
        $this->createProfessionalPropertyManager();

        // Create individual property manager user
        $this->createIndividualPropertyManager();

        // Create basic tenant user (no tenant profile)
        $this->createTenantUser();

        // Create verified tenant user (with complete tenant profile)
        $this->createVerifiedTenantUser();

        $this->command->info('✅ Test users created successfully!');
        $this->command->line('');
        $this->command->line('Test Accounts:');
        $this->command->line('  Professional PM: professional@test.com / password');
        $this->command->line('  Individual PM: individual@test.com / password');
        $this->command->line('  Tenant (basic): tenant@test.com / password');
        $this->command->line('  Tenant (verified): verified-tenant@test.com / password');
    }

    /**
     * Create a professional property manager (verified, ready to create properties).
     */
    private function createProfessionalPropertyManager(): void
    {
        // Check if user already exists
        if (User::where('email', 'professional@test.com')->exists()) {
            $this->command->warn('User professional@test.com already exists, skipping...');

            return;
        }

        // Create user
        $user = User::create([
            'first_name' => 'Sarah',
            'last_name' => 'Professional',
            'email' => 'professional@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Create verified property manager profile
        PropertyManager::create([
            'user_id' => $user->id,
            'type' => 'professional',
            'company_name' => 'Prime Properties AG',
            'company_website' => 'prime-properties.ch',
            'license_number' => 'PM-2024-001',
            'phone_country_code' => '+41',
            'phone_number' => '442345678',
            'profile_verified_at' => now(),
        ]);

        $this->command->info("Created professional PM: {$user->email}");
    }

    /**
     * Create an individual property manager (verified, ready to create properties).
     */
    private function createIndividualPropertyManager(): void
    {
        // Check if user already exists
        if (User::where('email', 'individual@test.com')->exists()) {
            $this->command->warn('User individual@test.com already exists, skipping...');

            return;
        }

        // Create user
        $user = User::create([
            'first_name' => 'John',
            'last_name' => 'Individual',
            'email' => 'individual@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Create verified property manager profile
        PropertyManager::create([
            'user_id' => $user->id,
            'type' => 'individual',
            'phone_country_code' => '+31',
            'phone_number' => '612345678',
            'profile_verified_at' => now(),
        ]);

        $this->command->info("Created individual PM: {$user->email}");
    }

    /**
     * Create a tenant user (no tenant profile).
     */
    private function createTenantUser(): void
    {
        // Check if user already exists
        if (User::where('email', 'tenant@test.com')->exists()) {
            $this->command->warn('User tenant@test.com already exists, skipping...');

            return;
        }

        // Create user
        $user = User::create([
            'first_name' => 'Emma',
            'last_name' => 'Tenant',
            'email' => 'tenant@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $this->command->info("Created tenant (no profile): {$user->email}");
    }

    /**
     * Create a verified tenant user (with complete tenant profile).
     */
    private function createVerifiedTenantUser(): void
    {
        // Check if user already exists
        if (User::where('email', 'verified-tenant@test.com')->exists()) {
            $this->command->warn('User verified-tenant@test.com already exists, skipping...');

            return;
        }

        // Create user
        $user = User::create([
            'first_name' => 'Michael',
            'last_name' => 'Johnson',
            'email' => 'verified-tenant@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Create verified tenant profile
        TenantProfile::create([
            'user_id' => $user->id,

            // Personal information
            'date_of_birth' => '1995-06-15',
            'nationality' => 'US',
            'phone_country_code' => '+1',
            'phone_number' => '5551234567',

            // Current address
            'current_house_number' => '123',
            'current_street_name' => 'Main Street',
            'current_city' => 'New York',
            'current_postal_code' => '10001',
            'current_country' => 'US',

            // Employment
            'employment_status' => 'employed',
            'employer_name' => 'Tech Solutions Inc.',
            'job_title' => 'Software Engineer',
            'employment_start_date' => '2021-03-01',
            'employment_type' => 'full_time',
            'monthly_income' => 6500.00,
            'income_currency' => 'eur',
            'employer_contact_name' => 'Sarah Williams',
            'employer_contact_phone' => '+1-555-9876543',
            'employer_contact_email' => 'hr@techsolutions.com',

            // Verification - VERIFIED
            'profile_verified_at' => now(),
        ]);

        $this->command->info("Created verified tenant: {$user->email}");
    }
}
