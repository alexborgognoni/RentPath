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
            // Update immigration_status enum to match frontend options
            // Note: We'll use string instead of enum to avoid migration issues with existing data
            $table->string('immigration_status', 50)->nullable()->change();

            // Add new immigration fields (matching TenantProfile)
            $table->string('immigration_status_other', 100)->nullable()->after('visa_expiry_date');
            $table->string('visa_type_other', 100)->nullable()->after('immigration_status_other');

            // Residence permit document (for visa holders)
            $table->string('residence_permit_document_path')->nullable()->after('visa_type_other');
            $table->string('residence_permit_document_original_name')->nullable()->after('residence_permit_document_path');

            // Right to Rent (UK/Ireland)
            $table->string('right_to_rent_share_code', 50)->nullable()->after('residence_permit_document_original_name');
            $table->string('right_to_rent_document_path')->nullable()->after('right_to_rent_share_code');
            $table->string('right_to_rent_document_original_name')->nullable()->after('right_to_rent_document_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_co_signers', function (Blueprint $table) {
            $table->dropColumn([
                'immigration_status_other',
                'visa_type_other',
                'residence_permit_document_path',
                'residence_permit_document_original_name',
                'right_to_rent_share_code',
                'right_to_rent_document_path',
                'right_to_rent_document_original_name',
            ]);
        });
    }
};
