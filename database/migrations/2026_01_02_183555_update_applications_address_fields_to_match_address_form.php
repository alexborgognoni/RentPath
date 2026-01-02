<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration updates the applications table to use consistent address field naming
     * that matches the AddressForm component structure:
     * - street_name, house_number, address_line_2, city, state_province, postal_code, country
     *
     * It also updates the previous_addresses JSON structure to use the same field naming.
     */
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            // Add new current address fields matching AddressForm structure
            // These are added after current_living_situation
            $table->string('current_address_street_name', 255)->nullable()->after('current_living_situation');
            $table->string('current_address_house_number', 20)->nullable()->after('current_address_street_name');
            $table->string('current_address_address_line_2', 100)->nullable()->after('current_address_house_number');
            $table->string('current_address_city', 100)->nullable()->after('current_address_address_line_2');
            $table->string('current_address_postal_code', 20)->nullable()->after('current_address_city');
            $table->char('current_address_country', 2)->nullable()->after('current_address_postal_code');
        });

        // Migrate data from current_address_unit to current_address_address_line_2 if it exists
        DB::statement("UPDATE applications SET current_address_address_line_2 = current_address_unit WHERE current_address_unit IS NOT NULL AND current_address_unit != ''");

        // Drop the old column after migration
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('current_address_unit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add the old column
        Schema::table('applications', function (Blueprint $table) {
            $table->string('current_address_unit', 50)->nullable()->after('current_living_situation');
        });

        // Migrate data back
        DB::statement("UPDATE applications SET current_address_unit = current_address_address_line_2 WHERE current_address_address_line_2 IS NOT NULL AND current_address_address_line_2 != ''");

        // Drop the new columns
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'current_address_street_name',
                'current_address_house_number',
                'current_address_address_line_2',
                'current_address_city',
                'current_address_postal_code',
                'current_address_country',
            ]);
        });
    }
};
