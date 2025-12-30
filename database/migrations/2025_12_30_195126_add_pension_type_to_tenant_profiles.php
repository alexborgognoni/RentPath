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
        // First convert some varchar columns to text to free up row space
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->text('profile_picture_path')->nullable()->change();
            $table->text('other_income_proof_path')->nullable()->change();
            $table->text('other_income_proof_original_name')->nullable()->change();
            $table->text('guarantor_proof_income_path')->nullable()->change();
        });

        // Now add the new column
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->string('pension_type', 50)->nullable()->after('pension_provider');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn('pension_type');
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->string('profile_picture_path', 255)->nullable()->change();
            $table->string('other_income_proof_path', 255)->nullable()->change();
            $table->string('other_income_proof_original_name', 255)->nullable()->change();
            $table->string('guarantor_proof_income_path', 255)->nullable()->change();
        });
    }
};
