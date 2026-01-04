<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Removes 'residence_permit' from id_document_type enum in tenant_profiles and application_co_signers.
     * Residence permit is an immigration document, not a primary ID document.
     * Users should provide passport/national_id/drivers_license as ID, and upload residence permit
     * separately in the Immigration Status section.
     */
    public function up(): void
    {
        // First, update any existing records that have 'residence_permit' to 'passport' as a safe default
        DB::table('tenant_profiles')
            ->where('id_document_type', 'residence_permit')
            ->update(['id_document_type' => 'passport']);

        DB::table('application_co_signers')
            ->where('id_document_type', 'residence_permit')
            ->update(['id_document_type' => 'passport']);

        // Modify the enum to remove 'residence_permit'
        DB::statement("ALTER TABLE tenant_profiles MODIFY COLUMN id_document_type ENUM('passport', 'national_id', 'drivers_license') NULL");
        DB::statement("ALTER TABLE application_co_signers MODIFY COLUMN id_document_type ENUM('passport', 'national_id', 'drivers_license') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back 'residence_permit' to the enum
        DB::statement("ALTER TABLE tenant_profiles MODIFY COLUMN id_document_type ENUM('passport', 'national_id', 'drivers_license', 'residence_permit') NULL");
        DB::statement("ALTER TABLE application_co_signers MODIFY COLUMN id_document_type ENUM('passport', 'national_id', 'drivers_license', 'residence_permit') NOT NULL");
    }
};
