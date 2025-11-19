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
        Schema::create('tenant_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // Personal information
            $table->date('date_of_birth')->nullable();
            $table->char('nationality', 2)->nullable()->comment('ISO 3166-1 alpha-2');
            $table->string('phone_country_code', 10)->nullable();
            $table->string('phone_number')->nullable();

            // Current address
            $table->string('current_house_number', 20)->nullable();
            $table->string('current_street_name')->nullable();
            $table->string('current_city', 100)->nullable();
            $table->string('current_postal_code', 20)->nullable();
            $table->char('current_country', 2)->nullable()->comment('ISO 3166-1 alpha-2');

            // Employment information
            $table->enum('employment_status', [
                'employed',
                'self_employed',
                'student',
                'unemployed',
                'retired'
            ])->nullable();
            $table->string('employer_name')->nullable();
            $table->string('job_title')->nullable();
            $table->date('employment_start_date')->nullable();
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'temporary'])->nullable();
            $table->decimal('monthly_income', 10, 2)->nullable();
            $table->enum('income_currency', ['eur', 'usd', 'gbp', 'chf'])->default('eur');

            // Employer contact (for verification)
            $table->string('employer_contact_name')->nullable();
            $table->string('employer_contact_phone')->nullable();
            $table->string('employer_contact_email')->nullable();

            // Student-specific information
            $table->string('university_name')->nullable();
            $table->string('program_of_study')->nullable();
            $table->date('expected_graduation_date')->nullable();
            $table->string('student_income_source')->nullable()->comment('e.g., parents, scholarship, part-time job');

            // Guarantor information (commonly needed for students)
            $table->boolean('has_guarantor')->default(false);
            $table->string('guarantor_name')->nullable();
            $table->string('guarantor_relationship')->nullable();
            $table->string('guarantor_phone')->nullable();
            $table->string('guarantor_email')->nullable();
            $table->string('guarantor_address')->nullable();
            $table->string('guarantor_employer')->nullable();
            $table->decimal('guarantor_monthly_income', 10, 2)->nullable();

            // Documents (private S3 storage)
            $table->string('id_document_path')->nullable();
            $table->string('id_document_original_name')->nullable();

            // Employment documents
            $table->string('employment_contract_path')->nullable();
            $table->string('employment_contract_original_name')->nullable();
            $table->string('payslip_1_path')->nullable();
            $table->string('payslip_1_original_name')->nullable();
            $table->string('payslip_2_path')->nullable();
            $table->string('payslip_2_original_name')->nullable();
            $table->string('payslip_3_path')->nullable();
            $table->string('payslip_3_original_name')->nullable();

            // Student documents
            $table->string('student_proof_path')->nullable();
            $table->string('student_proof_original_name')->nullable();

            // Guarantor documents
            $table->string('guarantor_id_path')->nullable();
            $table->string('guarantor_id_original_name')->nullable();
            $table->string('guarantor_proof_income_path')->nullable();
            $table->string('guarantor_proof_income_original_name')->nullable();

            // Additional documents
            $table->string('reference_letter_path')->nullable();
            $table->string('reference_letter_original_name')->nullable();

            // Profile picture (public S3)
            $table->string('profile_picture_path')->nullable();

            // Emergency contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();

            // Preferences (for matching)
            $table->integer('occupants_count')->default(1);
            $table->boolean('has_pets')->default(false);
            $table->string('pets_description')->nullable();
            $table->boolean('is_smoker')->default(false);

            // Verification (similar to property managers)
            $table->timestamp('profile_verified_at')->nullable();
            $table->text('verification_rejection_reason')->nullable();
            $table->json('verification_rejected_fields')->nullable();

            $table->timestamps();

            // Ensure one profile per user
            $table->unique('user_id');

            // Index for verification status
            $table->index('profile_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_profiles');
    }
};
