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
        Schema::table('applications', function (Blueprint $table) {
            // Employment snapshot (at time of application submission)
            $table->enum('snapshot_employment_status', [
                'employed',
                'self_employed',
                'student',
                'unemployed',
                'retired'
            ])->nullable()->after('internal_notes');
            $table->string('snapshot_employer_name')->nullable()->after('snapshot_employment_status');
            $table->string('snapshot_job_title')->nullable()->after('snapshot_employer_name');
            $table->date('snapshot_employment_start_date')->nullable()->after('snapshot_job_title');
            $table->enum('snapshot_employment_type', ['full_time', 'part_time', 'contract', 'temporary'])->nullable()->after('snapshot_employment_start_date');
            $table->decimal('snapshot_monthly_income', 10, 2)->nullable()->after('snapshot_employment_type');
            $table->enum('snapshot_income_currency', ['eur', 'usd', 'gbp', 'chf'])->nullable()->after('snapshot_monthly_income');

            // Current address snapshot
            $table->string('snapshot_current_house_number', 20)->nullable()->after('snapshot_income_currency');
            $table->string('snapshot_current_street_name')->nullable()->after('snapshot_current_house_number');
            $table->string('snapshot_current_city', 100)->nullable()->after('snapshot_current_street_name');
            $table->string('snapshot_current_postal_code', 20)->nullable()->after('snapshot_current_city');
            $table->char('snapshot_current_country', 2)->nullable()->after('snapshot_current_postal_code');

            // Student snapshot
            $table->string('snapshot_university_name')->nullable()->after('snapshot_current_country');
            $table->string('snapshot_program_of_study')->nullable()->after('snapshot_university_name');
            $table->date('snapshot_expected_graduation_date')->nullable()->after('snapshot_program_of_study');

            // Guarantor snapshot
            $table->boolean('snapshot_has_guarantor')->default(false)->after('snapshot_expected_graduation_date');
            $table->string('snapshot_guarantor_name')->nullable()->after('snapshot_has_guarantor');
            $table->string('snapshot_guarantor_relationship')->nullable()->after('snapshot_guarantor_name');
            $table->decimal('snapshot_guarantor_monthly_income', 10, 2)->nullable()->after('snapshot_guarantor_relationship');

            // Document paths snapshot (what was in profile at submission time)
            $table->string('snapshot_id_document_path')->nullable()->after('snapshot_guarantor_monthly_income');
            $table->string('snapshot_employment_contract_path')->nullable()->after('snapshot_id_document_path');
            $table->string('snapshot_payslip_1_path')->nullable()->after('snapshot_employment_contract_path');
            $table->string('snapshot_payslip_2_path')->nullable()->after('snapshot_payslip_1_path');
            $table->string('snapshot_payslip_3_path')->nullable()->after('snapshot_payslip_2_path');
            $table->string('snapshot_student_proof_path')->nullable()->after('snapshot_payslip_3_path');
            $table->string('snapshot_guarantor_id_path')->nullable()->after('snapshot_student_proof_path');
            $table->string('snapshot_guarantor_proof_income_path')->nullable()->after('snapshot_guarantor_id_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'snapshot_employment_status',
                'snapshot_employer_name',
                'snapshot_job_title',
                'snapshot_employment_start_date',
                'snapshot_employment_type',
                'snapshot_monthly_income',
                'snapshot_income_currency',
                'snapshot_current_house_number',
                'snapshot_current_street_name',
                'snapshot_current_city',
                'snapshot_current_postal_code',
                'snapshot_current_country',
                'snapshot_university_name',
                'snapshot_program_of_study',
                'snapshot_expected_graduation_date',
                'snapshot_has_guarantor',
                'snapshot_guarantor_name',
                'snapshot_guarantor_relationship',
                'snapshot_guarantor_monthly_income',
                'snapshot_id_document_path',
                'snapshot_employment_contract_path',
                'snapshot_payslip_1_path',
                'snapshot_payslip_2_path',
                'snapshot_payslip_3_path',
                'snapshot_student_proof_path',
                'snapshot_guarantor_id_path',
                'snapshot_guarantor_proof_income_path',
            ]);
        });
    }
};
