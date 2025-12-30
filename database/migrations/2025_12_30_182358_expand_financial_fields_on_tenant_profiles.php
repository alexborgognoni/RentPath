<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Expands financial fields on tenant_profiles to comprehensively capture
     * any person's financial and employment situation. Supports:
     * - Employed (gross annual + net monthly)
     * - Self-employed (gross revenue + net monthly)
     * - Student (structured income source)
     * - Retired (pension + other income)
     * - Unemployed (benefits + other income)
     * - Other (parental leave, disability, sabbatical, etc.)
     */
    public function up(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Net monthly income - explicit field (migrating from ambiguous monthly_income)
            $table->decimal('net_monthly_income', 12, 2)->nullable()->after('monthly_income');

            // Self-employed: business start date
            $table->date('business_start_date')->nullable()->after('business_registration_number');

            // Student: structured income source
            $table->enum('student_income_source_type', [
                'scholarship',
                'stipend',
                'part_time_job',
                'parental_support',
                'student_loan',
                'savings',
                'other',
            ])->nullable()->after('student_income_source');
            $table->decimal('student_monthly_income', 12, 2)->nullable()->after('student_income_source_type');

            // Retired fields
            $table->decimal('pension_monthly_income', 12, 2)->nullable()->after('student_monthly_income');
            $table->string('pension_provider', 200)->nullable()->after('pension_monthly_income');
            $table->decimal('retirement_other_income', 12, 2)->nullable()->after('pension_provider');

            // Unemployed fields
            $table->boolean('receiving_unemployment_benefits')->default(false)->after('retirement_other_income');
            $table->decimal('unemployment_benefits_amount', 12, 2)->nullable()->after('receiving_unemployment_benefits');
            $table->enum('unemployed_income_source', [
                'unemployment_benefits',
                'savings',
                'family_support',
                'other',
            ])->nullable()->after('unemployment_benefits_amount');

            // Other status fields
            $table->enum('other_employment_situation', [
                'parental_leave',
                'disability',
                'sabbatical',
                'other',
            ])->nullable()->after('unemployed_income_source');
            $table->string('other_employment_situation_details', 200)->nullable()->after('other_employment_situation');
            $table->date('expected_return_to_work')->nullable()->after('other_employment_situation_details');
            $table->decimal('other_situation_monthly_income', 12, 2)->nullable()->after('expected_return_to_work');
            $table->string('other_situation_income_source', 200)->nullable()->after('other_situation_monthly_income');

            // Document paths for new statuses (using TEXT to avoid row size limit)
            $table->text('pension_statement_path')->nullable()->after('student_proof_original_name');
            $table->text('pension_statement_original_name')->nullable()->after('pension_statement_path');
            $table->text('benefits_statement_path')->nullable()->after('pension_statement_original_name');
            $table->text('benefits_statement_original_name')->nullable()->after('benefits_statement_path');
        });

        // Expand employment_status enum to include 'other'
        DB::statement("ALTER TABLE tenant_profiles MODIFY employment_status ENUM('employed', 'self_employed', 'student', 'unemployed', 'retired', 'other') NULL");

        // Migrate existing monthly_income to net_monthly_income where net is null
        DB::statement('UPDATE tenant_profiles SET net_monthly_income = monthly_income WHERE net_monthly_income IS NULL AND monthly_income IS NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert employment_status enum
        DB::statement("ALTER TABLE tenant_profiles MODIFY employment_status ENUM('employed', 'self_employed', 'student', 'unemployed', 'retired') NULL");

        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                // Income fields
                'net_monthly_income',
                'business_start_date',

                // Student fields
                'student_income_source_type',
                'student_monthly_income',

                // Retired fields
                'pension_monthly_income',
                'pension_provider',
                'retirement_other_income',

                // Unemployed fields
                'receiving_unemployment_benefits',
                'unemployment_benefits_amount',
                'unemployed_income_source',

                // Other status fields
                'other_employment_situation',
                'other_employment_situation_details',
                'expected_return_to_work',
                'other_situation_monthly_income',
                'other_situation_income_source',

                // Document paths
                'pension_statement_path',
                'pension_statement_original_name',
                'benefits_statement_path',
                'benefits_statement_original_name',
            ]);
        });
    }
};
