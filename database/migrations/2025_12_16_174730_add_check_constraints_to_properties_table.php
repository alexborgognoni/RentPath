<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Add CHECK constraints to properties table for data integrity.
 *
 * These constraints match the validation rules in:
 * - Frontend: property-validation.ts (PROPERTY_CONSTRAINTS)
 * - Backend: PropertyValidationRules.php ($constraints)
 *
 * Note: MySQL 8.0.16+ enforces CHECK constraints.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_bedrooms CHECK (bedrooms >= 0 AND bedrooms <= 20)');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_bathrooms CHECK (bathrooms >= 0 AND bathrooms <= 10)');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_size CHECK (size IS NULL OR (size >= 1 AND size <= 100000))');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_floor_level CHECK (floor_level IS NULL OR (floor_level >= -10 AND floor_level <= 200))');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_year_built CHECK (year_built IS NULL OR (year_built >= 1800 AND year_built <= 2100))');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_parking_interior CHECK (parking_spots_interior >= 0 AND parking_spots_interior <= 20)');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_parking_exterior CHECK (parking_spots_exterior >= 0 AND parking_spots_exterior <= 20)');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_balcony_size CHECK (balcony_size IS NULL OR (balcony_size >= 0 AND balcony_size <= 10000))');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_land_size CHECK (land_size IS NULL OR (land_size >= 0 AND land_size <= 1000000))');
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_rent_amount CHECK (rent_amount >= 0 AND rent_amount <= 999999.99)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_bedrooms');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_bathrooms');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_size');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_floor_level');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_year_built');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_parking_interior');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_parking_exterior');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_balcony_size');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_land_size');
        DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_rent_amount');
    }
};
