<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * These columns were never used in the UI. Additional documents
     * for applications should use the `additional_documents` JSON
     * field on the applications table instead.
     */
    public function up(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'tax_returns_paths',
                'bank_statements_paths',
                'business_bank_statements_paths',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->json('tax_returns_paths')->nullable();
            $table->json('bank_statements_paths')->nullable();
            $table->json('business_bank_statements_paths')->nullable();
        });
    }
};
