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
        Schema::table('applications', function (Blueprint $table) {
            // Add split emergency contact fields
            $table->string('emergency_contact_first_name')->nullable()->after('emergency_contact_name');
            $table->string('emergency_contact_last_name')->nullable()->after('emergency_contact_first_name');
            $table->string('emergency_contact_relationship_other')->nullable()->after('emergency_contact_relationship');
            $table->string('emergency_contact_phone_country_code', 10)->nullable()->after('emergency_contact_relationship_other');
            $table->string('emergency_contact_phone_number', 20)->nullable()->after('emergency_contact_phone_country_code');
            $table->string('emergency_contact_email')->nullable()->after('emergency_contact_phone_number');

            // Add flexibility fields for rental intent
            // (these may already exist, so using ->change() is not appropriate here)
        });

        // Migrate existing data from combined name field to split fields
        // This is a best-effort migration - full name goes to first_name
        DB::table('applications')
            ->whereNotNull('emergency_contact_name')
            ->update([
                'emergency_contact_first_name' => DB::raw('emergency_contact_name'),
            ]);

        // Migrate existing phone to new phone_number field
        DB::table('applications')
            ->whereNotNull('emergency_contact_phone')
            ->update([
                'emergency_contact_phone_number' => DB::raw('emergency_contact_phone'),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'emergency_contact_first_name',
                'emergency_contact_last_name',
                'emergency_contact_relationship_other',
                'emergency_contact_phone_country_code',
                'emergency_contact_phone_number',
                'emergency_contact_email',
            ]);
        });
    }
};
