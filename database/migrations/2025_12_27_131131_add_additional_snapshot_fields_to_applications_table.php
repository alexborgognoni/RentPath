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
            // Personal info snapshot (new fields)
            $table->date('snapshot_date_of_birth')->nullable()->after('additional_documents');
            $table->string('snapshot_nationality', 100)->nullable()->after('snapshot_date_of_birth');
            $table->string('snapshot_phone_country_code', 5)->nullable()->after('snapshot_nationality');
            $table->string('snapshot_phone_number', 20)->nullable()->after('snapshot_phone_country_code');

            // Student info (additional field)
            $table->string('snapshot_student_income_source')->nullable()->after('snapshot_expected_graduation_date');

            // Guarantor info (additional fields)
            $table->string('snapshot_guarantor_phone', 20)->nullable()->after('snapshot_guarantor_relationship');
            $table->string('snapshot_guarantor_email')->nullable()->after('snapshot_guarantor_phone');
            $table->text('snapshot_guarantor_address')->nullable()->after('snapshot_guarantor_email');
            $table->string('snapshot_guarantor_employer')->nullable()->after('snapshot_guarantor_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'snapshot_date_of_birth',
                'snapshot_nationality',
                'snapshot_phone_country_code',
                'snapshot_phone_number',
                'snapshot_student_income_source',
                'snapshot_guarantor_phone',
                'snapshot_guarantor_email',
                'snapshot_guarantor_address',
                'snapshot_guarantor_employer',
            ]);
        });
    }
};
