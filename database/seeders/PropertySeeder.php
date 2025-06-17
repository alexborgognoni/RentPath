<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run()
    {
        // Clear existing media if reseeding
        Property::all()->each->clearMediaCollection();

        // Create properties using factory
        Property::factory()
            ->count(20)
            ->create();
    }
}
