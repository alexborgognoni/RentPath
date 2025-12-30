<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds text fields for specifying "other" income sources when user selects "other" option.
     */
    public function up(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Student: when student_income_source_type = 'other' (using TEXT to avoid row size limit)
            $table->text('student_income_source_other')->nullable()->after('student_income_source_type');

            // Unemployed: when unemployed_income_source = 'other'
            $table->text('unemployed_income_source_other')->nullable()->after('unemployed_income_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'student_income_source_other',
                'unemployed_income_source_other',
            ]);
        });
    }
};
