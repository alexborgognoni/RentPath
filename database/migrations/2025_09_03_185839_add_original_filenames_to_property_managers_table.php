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
        Schema::table('property_managers', function (Blueprint $table) {
            $table->string('id_document_original_name')->nullable()->after('id_document_path');
            $table->string('license_document_original_name')->nullable()->after('license_document_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_managers', function (Blueprint $table) {
            $table->dropColumn(['id_document_original_name', 'license_document_original_name']);
        });
    }
};
