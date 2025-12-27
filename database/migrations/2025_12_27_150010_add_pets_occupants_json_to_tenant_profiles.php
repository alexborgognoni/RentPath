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
            // Add JSON arrays for pets and occupants details
            $table->json('pets_details')->nullable()->after('pets_description');
            $table->json('occupants_details')->nullable()->after('occupants_count');

            // Add other income proof for unemployed/retired
            $table->string('other_income_proof_path')->nullable()->after('student_proof_original_name');
            $table->string('other_income_proof_original_name')->nullable()->after('other_income_proof_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'pets_details',
                'occupants_details',
                'other_income_proof_path',
                'other_income_proof_original_name',
            ]);
        });
    }
};
