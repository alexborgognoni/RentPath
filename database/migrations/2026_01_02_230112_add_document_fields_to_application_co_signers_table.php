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
            // Individual payslip fields (instead of JSON array)
            $table->string('payslip_1_path')->nullable()->after('employment_contract_original_name');
            $table->string('payslip_1_original_name')->nullable()->after('payslip_1_path');
            $table->string('payslip_2_path')->nullable()->after('payslip_1_original_name');
            $table->string('payslip_2_original_name')->nullable()->after('payslip_2_path');
            $table->string('payslip_3_path')->nullable()->after('payslip_2_original_name');
            $table->string('payslip_3_original_name')->nullable()->after('payslip_3_path');

            // Student proof (rename from enrollment_proof for consistency with frontend)
            $table->string('student_proof_path')->nullable()->after('university_name');
            $table->string('student_proof_original_name')->nullable()->after('student_proof_path');

            // Pension statement (for retired)
            $table->string('pension_statement_path')->nullable()->after('income_proof_original_name');
            $table->string('pension_statement_original_name')->nullable()->after('pension_statement_path');

            // Benefits statement (for unemployed with benefits)
            $table->string('benefits_statement_path')->nullable()->after('pension_statement_original_name');
            $table->string('benefits_statement_original_name')->nullable()->after('benefits_statement_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_co_signers', function (Blueprint $table) {
            $table->dropColumn([
                'payslip_1_path',
                'payslip_1_original_name',
                'payslip_2_path',
                'payslip_2_original_name',
                'payslip_3_path',
                'payslip_3_original_name',
                'student_proof_path',
                'student_proof_original_name',
                'pension_statement_path',
                'pension_statement_original_name',
                'benefits_statement_path',
                'benefits_statement_original_name',
            ]);
        });
    }
};
