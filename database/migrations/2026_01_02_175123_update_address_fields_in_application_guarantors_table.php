<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('application_guarantors', function (Blueprint $table) {
            // Rename street_address to street_name for AddressForm compatibility
            $table->renameColumn('street_address', 'street_name');
        });

        Schema::table('application_guarantors', function (Blueprint $table) {
            // Add house_number and address_line_2 fields
            $table->string('house_number', 50)->nullable()->after('street_name');
            $table->string('address_line_2', 255)->nullable()->after('house_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_guarantors', function (Blueprint $table) {
            $table->dropColumn(['house_number', 'address_line_2']);
        });

        Schema::table('application_guarantors', function (Blueprint $table) {
            $table->renameColumn('street_name', 'street_address');
        });
    }
};
