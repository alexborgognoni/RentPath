<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Change year_built from YEAR type (1901-2155) to SMALLINT UNSIGNED
 * to support historic buildings built before 1901.
 *
 * Note: MySQL YEAR type only supports 1901-2155, but we need 1800+ for historic buildings.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the check constraint first (MySQL doesn't support IF EXISTS)
        try {
            DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_year_built');
        } catch (\Exception $e) {
            // Constraint may not exist, continue
        }

        // Change column type from YEAR to SMALLINT UNSIGNED
        Schema::table('properties', function (Blueprint $table) {
            $table->smallInteger('year_built')->unsigned()->nullable()->change();
        });

        // Re-add the check constraint
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_year_built CHECK (year_built IS NULL OR (year_built >= 1800 AND year_built <= 2100))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the check constraint (MySQL doesn't support IF EXISTS)
        try {
            DB::statement('ALTER TABLE properties DROP CONSTRAINT chk_year_built');
        } catch (\Exception $e) {
            // Constraint may not exist, continue
        }

        // Change back to YEAR type
        Schema::table('properties', function (Blueprint $table) {
            $table->year('year_built')->nullable()->change();
        });

        // Re-add the check constraint
        DB::statement('ALTER TABLE properties ADD CONSTRAINT chk_year_built CHECK (year_built IS NULL OR (year_built >= 1800 AND year_built <= 2100))');
    }
};
