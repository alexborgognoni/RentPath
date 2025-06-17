<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Dev User',
            'email' => 'dev@user.com',
            'password' => Hash::make('password123')
        ]);

        $this->call([
            PropertySeeder::class,
        ]);
    }
}
