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
            $table->dropColumn([
                'immigration_status',
                'immigration_status_other',
                'visa_type',
                'visa_type_other',
                'visa_expiry_date',
                'residence_permit_document_path',
                'residence_permit_document_original_name',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_co_signers', function (Blueprint $table) {
            $table->string('immigration_status')->nullable()->after('id_document_back_original_name');
            $table->string('visa_type')->nullable()->after('immigration_status');
            $table->date('visa_expiry_date')->nullable()->after('visa_type');
            $table->string('immigration_status_other')->nullable()->after('visa_expiry_date');
            $table->string('visa_type_other')->nullable()->after('immigration_status_other');
            $table->string('residence_permit_document_path')->nullable()->after('visa_type_other');
            $table->string('residence_permit_document_original_name')->nullable()->after('residence_permit_document_path');
        });
    }
};
