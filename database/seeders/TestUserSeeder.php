<?php

namespace Database\Seeders;

use App\Models\PropertyManager;
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
        if (!app()->environment('local')) {
            $this->command->warn('Skipping TestUserSeeder - only runs in local environment');

            return;
        }

        $this->command->info('Creating test users...');

        // Create professional property manager user
        $this->createProfessionalPropertyManager();

        // Create individual property manager user
        $this->createIndividualPropertyManager();

        // Create tenant user (no properties)
        $this->createTenantUser();

        $this->command->info('✅ Test users created successfully!');
        $this->command->line('');
        $this->command->line('Test Accounts:');
        $this->command->line('  Professional PM: professional@test.com / password');
        $this->command->line('  Individual PM: individual@test.com / password');
        $this->command->line('  Tenant: tenant@test.com / password');
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
     * Create a tenant user (no property manager profile).
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

        $this->command->info("Created tenant: {$user->email}");
    }
}
