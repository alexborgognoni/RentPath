<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Remove application-specific fields from tenant_profiles table.
 *
 * These fields were incorrectly placed on tenant_profiles but should
 * live on the applications table or related tables (application_guarantors):
 *
 * 1. GUARANTOR fields - application-specific, now stored in application_guarantors table
 * 2. HOUSEHOLD fields - application-specific, already exist on applications table
 * 3. EMERGENCY CONTACT fields - application-specific, already exist on applications table
 *
 * The tenant_profiles table should only contain REUSABLE profile data:
 * - Identity (personal info, ID documents, immigration)
 * - Employment/Financial status
 * - Rental History (previous addresses, references, credit checks)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Basic Info
            // These fields are application-specific and should be in application_guarantors
            $table->dropColumn([
                'has_guarantor',
                'guarantor_first_name',
                'guarantor_last_name',
                'guarantor_relationship',
                'guarantor_phone_country_code',
                'guarantor_phone_number',
                'guarantor_email',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Address
            $table->dropColumn([
                'guarantor_street_name',
                'guarantor_house_number',
                'guarantor_address_line_2',
                'guarantor_city',
                'guarantor_state_province',
                'guarantor_postal_code',
                'guarantor_country',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Employment
            $table->dropColumn([
                'guarantor_employment_status',
                'guarantor_employer_name',
                'guarantor_job_title',
                'guarantor_monthly_income',
                'guarantor_income_currency',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Student Info
            $table->dropColumn([
                'guarantor_student_income_source',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Documents
            $table->dropColumn([
                'guarantor_id_front_path',
                'guarantor_id_front_original_name',
                'guarantor_id_back_path',
                'guarantor_id_back_original_name',
                'guarantor_proof_income_path',
                'guarantor_proof_income_original_name',
                'guarantor_student_proof_path',
                'guarantor_student_proof_original_name',
                'guarantor_other_income_proof_path',
                'guarantor_other_income_proof_original_name',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // HOUSEHOLD - These already exist on applications table
            $table->dropColumn([
                'occupants_count',
                'occupants_details',
                'has_pets',
                'pets_description',
                'pets_details',
                'is_smoker',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // EMERGENCY CONTACT - These already exist on applications table
            $table->dropColumn([
                'emergency_contact_name',
                'emergency_contact_phone',
                'emergency_contact_relationship',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // EMERGENCY CONTACT
            $table->string('emergency_contact_name', 255)->nullable();
            $table->string('emergency_contact_phone', 50)->nullable();
            $table->string('emergency_contact_relationship', 100)->nullable();
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // HOUSEHOLD
            $table->integer('occupants_count')->default(1);
            $table->json('occupants_details')->nullable();
            $table->boolean('has_pets')->default(false);
            $table->string('pets_description', 500)->nullable();
            $table->json('pets_details')->nullable();
            $table->boolean('is_smoker')->default(false);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Documents
            $table->string('guarantor_id_front_path', 500)->nullable();
            $table->string('guarantor_id_front_original_name', 255)->nullable();
            $table->string('guarantor_id_back_path', 500)->nullable();
            $table->string('guarantor_id_back_original_name', 255)->nullable();
            $table->text('guarantor_proof_income_path')->nullable();
            $table->string('guarantor_proof_income_original_name', 255)->nullable();
            $table->text('guarantor_student_proof_path')->nullable();
            $table->string('guarantor_student_proof_original_name', 255)->nullable();
            $table->text('guarantor_other_income_proof_path')->nullable();
            $table->string('guarantor_other_income_proof_original_name', 255)->nullable();
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Student Info
            $table->string('guarantor_student_income_source', 255)->nullable();
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Employment
            $table->enum('guarantor_employment_status', ['employed', 'self_employed', 'student', 'unemployed', 'retired'])->nullable();
            $table->string('guarantor_employer_name', 255)->nullable();
            $table->string('guarantor_job_title', 100)->nullable();
            $table->decimal('guarantor_monthly_income', 10, 2)->nullable();
            $table->enum('guarantor_income_currency', ['eur', 'usd', 'gbp', 'chf'])->nullable();
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Address
            $table->string('guarantor_street_name', 255)->nullable();
            $table->string('guarantor_house_number', 20)->nullable();
            $table->string('guarantor_address_line_2', 100)->nullable();
            $table->string('guarantor_city', 100)->nullable();
            $table->string('guarantor_state_province', 100)->nullable();
            $table->string('guarantor_postal_code', 20)->nullable();
            $table->string('guarantor_country', 2)->nullable();
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // GUARANTOR - Basic Info
            $table->boolean('has_guarantor')->default(false);
            $table->string('guarantor_first_name', 100)->nullable();
            $table->string('guarantor_last_name', 100)->nullable();
            $table->string('guarantor_relationship', 100)->nullable();
            $table->string('guarantor_phone_country_code', 10)->nullable();
            $table->string('guarantor_phone_number', 50)->nullable();
            $table->string('guarantor_email', 255)->nullable();
        });
    }
};
