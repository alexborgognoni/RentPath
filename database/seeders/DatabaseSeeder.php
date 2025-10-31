<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only seed test data in local environment
        if (app()->environment('local')) {
            $this->call([
                TestUserSeeder::class,
            ]);
        }
    }
}
