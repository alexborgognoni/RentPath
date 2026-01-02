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
        Schema::table('application_co_signers', function (Blueprint $table) {
            // Relationship fields
            $table->string('relationship', 50)->nullable()->after('phone_number');
            $table->string('relationship_other', 100)->nullable()->after('relationship');

            // Address fields (matching AddressForm component)
            $table->string('street_name', 255)->nullable()->after('relationship_other');
            $table->string('house_number', 50)->nullable()->after('street_name');
            $table->string('address_line_2', 255)->nullable()->after('house_number');
            $table->string('city', 100)->nullable()->after('address_line_2');
            $table->string('state_province', 100)->nullable()->after('city');
            $table->string('postal_code', 20)->nullable()->after('state_province');
            $table->string('country', 2)->nullable()->after('postal_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_co_signers', function (Blueprint $table) {
            $table->dropColumn([
                'relationship',
                'relationship_other',
                'street_name',
                'house_number',
                'address_line_2',
                'city',
                'state_province',
                'postal_code',
                'country',
            ]);
        });
    }
};
