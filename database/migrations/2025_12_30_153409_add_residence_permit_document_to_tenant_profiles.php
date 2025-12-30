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
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->string('residence_permit_document_path')->nullable()->after('right_to_rent_share_code');
            $table->string('residence_permit_document_original_name')->nullable()->after('residence_permit_document_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn(['residence_permit_document_path', 'residence_permit_document_original_name']);
        });
    }
};
