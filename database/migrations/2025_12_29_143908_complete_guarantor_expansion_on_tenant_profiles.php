<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add remaining document columns (the previous partial run added guarantor_student_proof_path)
        Schema::table('tenant_profiles', function (Blueprint $table) {
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

        // Migrate existing data from old columns to new columns
        DB::statement("
            UPDATE tenant_profiles SET
                guarantor_first_name = COALESCE(guarantor_first_name, SUBSTRING_INDEX(guarantor_name, ' ', 1)),
                guarantor_last_name = COALESCE(guarantor_last_name, NULLIF(TRIM(SUBSTRING(guarantor_name, LENGTH(SUBSTRING_INDEX(guarantor_name, ' ', 1)) + 2)), '')),
                guarantor_id_front_path = COALESCE(guarantor_id_front_path, guarantor_id_path),
                guarantor_id_front_original_name = COALESCE(guarantor_id_front_original_name, guarantor_id_original_name),
                guarantor_employer_name = COALESCE(guarantor_employer_name, guarantor_employer),
                guarantor_employment_status = COALESCE(guarantor_employment_status,
                    CASE
                        WHEN guarantor_employer IS NOT NULL AND guarantor_employer != '' THEN 'employed'
                        ELSE NULL
                    END
                )
            WHERE guarantor_name IS NOT NULL OR guarantor_employer IS NOT NULL
        ");

        // Drop old columns
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
            $table->string('guarantor_name')->nullable()->after('has_guarantor');
            $table->string('guarantor_employer')->nullable()->after('guarantor_student_income_source');
            $table->string('guarantor_id_path')->nullable()->after('guarantor_proof_income_original_name');
            $table->string('guarantor_id_original_name')->nullable()->after('guarantor_id_path');
        });

        // Migrate data back
        DB::statement("
            UPDATE tenant_profiles SET
                guarantor_name = TRIM(CONCAT(COALESCE(guarantor_first_name, ''), ' ', COALESCE(guarantor_last_name, ''))),
                guarantor_employer = guarantor_employer_name,
                guarantor_id_path = guarantor_id_front_path,
                guarantor_id_original_name = guarantor_id_front_original_name
            WHERE guarantor_first_name IS NOT NULL OR guarantor_employer_name IS NOT NULL
        ");

        // Drop new columns
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'guarantor_student_proof_original_name',
                'guarantor_other_income_proof_path',
                'guarantor_other_income_proof_original_name',
            ]);
        });
    }
};
