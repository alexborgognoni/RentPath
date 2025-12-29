<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Refactors guarantor fields to match personal info structure:
     * - Phone: Split into phone_country_code and phone_number
     * - Address: Split into individual components (street, city, etc.)
     */
    public function up(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // New phone fields (after guarantor_relationship)
            $table->string('guarantor_phone_country_code', 5)->nullable()->after('guarantor_relationship');
            $table->string('guarantor_phone_number', 20)->nullable()->after('guarantor_phone_country_code');

            // New address fields (after guarantor_email)
            $table->string('guarantor_street_name')->nullable()->after('guarantor_email');
            $table->string('guarantor_house_number', 20)->nullable()->after('guarantor_street_name');
            $table->string('guarantor_address_line_2', 100)->nullable()->after('guarantor_house_number');
            $table->string('guarantor_city', 100)->nullable()->after('guarantor_address_line_2');
            $table->string('guarantor_state_province', 100)->nullable()->after('guarantor_city');
            $table->string('guarantor_postal_code', 20)->nullable()->after('guarantor_state_province');
            $table->string('guarantor_country', 2)->nullable()->after('guarantor_postal_code');

            // Drop old fields
            $table->dropColumn(['guarantor_phone', 'guarantor_address']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Restore old fields
            $table->string('guarantor_phone')->nullable()->after('guarantor_relationship');
            $table->string('guarantor_address')->nullable()->after('guarantor_email');

            // Drop new fields
            $table->dropColumn([
                'guarantor_phone_country_code',
                'guarantor_phone_number',
                'guarantor_street_name',
                'guarantor_house_number',
                'guarantor_address_line_2',
                'guarantor_city',
                'guarantor_state_province',
                'guarantor_postal_code',
                'guarantor_country',
            ]);
        });
    }
};
