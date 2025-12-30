<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Completes the guarantor expansion by:
     * 1. Adding expanded guarantor fields (first/last name, employer details, ID docs)
     * 2. Adding income proof document columns
     * 3. Dropping old/legacy columns that are replaced by expanded fields
     */
    public function up(): void
    {
        // First, add the expanded guarantor fields
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Split name into first/last
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_first_name')) {
                $table->string('guarantor_first_name', 100)->nullable()->after('has_guarantor');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_last_name')) {
                $table->string('guarantor_last_name', 100)->nullable()->after('guarantor_first_name');
            }

            // Employment expansion
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_employment_status')) {
                $table->enum('guarantor_employment_status', [
                    'employed',
                    'self_employed',
                    'student',
                    'unemployed',
                    'retired',
                ])->nullable()->after('guarantor_country');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_employer_name')) {
                $table->string('guarantor_employer_name')->nullable()->after('guarantor_employment_status');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_job_title')) {
                $table->string('guarantor_job_title')->nullable()->after('guarantor_employer_name');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_student_income_source')) {
                $table->string('guarantor_student_income_source')->nullable()->after('guarantor_job_title');
            }

            // ID document expansion (front/back)
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_id_front_path')) {
                $table->string('guarantor_id_front_path')->nullable()->after('guarantor_proof_income_original_name');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_id_front_original_name')) {
                $table->string('guarantor_id_front_original_name')->nullable()->after('guarantor_id_front_path');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_id_back_path')) {
                $table->string('guarantor_id_back_path')->nullable()->after('guarantor_id_front_original_name');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_id_back_original_name')) {
                $table->string('guarantor_id_back_original_name')->nullable()->after('guarantor_id_back_path');
            }

            // Income proof document columns for different employment types
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_student_proof_path')) {
                $table->text('guarantor_student_proof_path')->nullable()->after('guarantor_id_back_original_name');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_student_proof_original_name')) {
                $table->string('guarantor_student_proof_original_name')->nullable()->after('guarantor_student_proof_path');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_other_income_proof_path')) {
                $table->text('guarantor_other_income_proof_path')->nullable()->after('guarantor_student_proof_original_name');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_other_income_proof_original_name')) {
                $table->string('guarantor_other_income_proof_original_name')->nullable()->after('guarantor_other_income_proof_path');
            }
        });

        // Drop old/legacy columns that are now replaced
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('tenant_profiles', 'guarantor_name')) {
                $columnsToDrop[] = 'guarantor_name';
            }
            if (Schema::hasColumn('tenant_profiles', 'guarantor_employer')) {
                $columnsToDrop[] = 'guarantor_employer';
            }
            if (Schema::hasColumn('tenant_profiles', 'guarantor_id_path')) {
                $columnsToDrop[] = 'guarantor_id_path';
            }
            if (Schema::hasColumn('tenant_profiles', 'guarantor_id_original_name')) {
                $columnsToDrop[] = 'guarantor_id_original_name';
            }
            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore old columns
        Schema::table('tenant_profiles', function (Blueprint $table) {
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_name')) {
                $table->string('guarantor_name')->nullable()->after('has_guarantor');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_employer')) {
                $table->string('guarantor_employer')->nullable()->after('guarantor_monthly_income');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_id_path')) {
                $table->string('guarantor_id_path')->nullable()->after('guarantor_proof_income_original_name');
            }
            if (! Schema::hasColumn('tenant_profiles', 'guarantor_id_original_name')) {
                $table->string('guarantor_id_original_name')->nullable()->after('guarantor_id_path');
            }
        });

        // Drop new columns
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $columnsToDrop = [
                'guarantor_first_name',
                'guarantor_last_name',
                'guarantor_employment_status',
                'guarantor_employer_name',
                'guarantor_job_title',
                'guarantor_student_income_source',
                'guarantor_id_front_path',
                'guarantor_id_front_original_name',
                'guarantor_id_back_path',
                'guarantor_id_back_original_name',
                'guarantor_student_proof_path',
                'guarantor_student_proof_original_name',
                'guarantor_other_income_proof_path',
                'guarantor_other_income_proof_original_name',
            ];
            $existingColumns = [];
            foreach ($columnsToDrop as $col) {
                if (Schema::hasColumn('tenant_profiles', $col)) {
                    $existingColumns[] = $col;
                }
            }
            if (! empty($existingColumns)) {
                $table->dropColumn($existingColumns);
            }
        });
    }
};
