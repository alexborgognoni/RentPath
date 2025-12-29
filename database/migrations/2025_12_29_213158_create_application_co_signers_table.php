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
        Schema::create('application_co_signers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('occupant_index'); // Reference to occupants_details array index

            // Identity - Basic (aligned with TenantProfile)
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->date('date_of_birth');
            $table->string('nationality', 2); // ISO-2
            $table->string('email', 255);
            $table->string('phone_country_code', 10);
            $table->string('phone_number', 30);

            // Identity - ID Document (aligned with TenantProfile)
            $table->enum('id_document_type', [
                'passport',
                'national_id',
                'drivers_license',
                'residence_permit',
            ]);
            $table->text('id_number'); // Encrypted
            $table->string('id_issuing_country', 2); // ISO-2
            $table->date('id_expiry_date');
            $table->string('id_document_front_path')->nullable();
            $table->string('id_document_front_original_name')->nullable();
            $table->string('id_document_back_path')->nullable();
            $table->string('id_document_back_original_name')->nullable();

            // Identity - Immigration (optional, aligned with TenantProfile)
            $table->enum('immigration_status', [
                'citizen',
                'permanent_resident',
                'visa_holder',
                'refugee',
                'asylum_seeker',
                'other',
            ])->nullable();
            $table->string('visa_type', 100)->nullable();
            $table->date('visa_expiry_date')->nullable();

            // Employment - Status (aligned with TenantProfile)
            $table->enum('employment_status', [
                'employed',
                'self_employed',
                'student',
                'unemployed',
                'retired',
                'other',
            ]);
            $table->string('employment_status_other', 100)->nullable();

            // Employment - If Employed/Self-Employed (aligned with TenantProfile)
            $table->string('employer_name', 200)->nullable();
            $table->string('job_title', 100)->nullable();
            $table->enum('employment_type', [
                'full_time',
                'part_time',
                'contract',
                'temporary',
                'zero_hours',
            ])->nullable();
            $table->enum('employment_contract_type', [
                'permanent',
                'fixed_term',
                'freelance',
                'casual',
            ])->nullable();
            $table->date('employment_start_date')->nullable();

            // Financial (aligned with TenantProfile)
            $table->decimal('net_monthly_income', 12, 2)->nullable();
            $table->string('income_currency', 3)->nullable();

            // Documents - Employment
            $table->string('employment_contract_path')->nullable();
            $table->string('employment_contract_original_name')->nullable();
            $table->json('payslips_paths')->nullable(); // Array of paths

            // Employment - If Student (aligned with TenantProfile)
            $table->string('university_name', 200)->nullable();
            $table->string('enrollment_proof_path')->nullable();
            $table->string('enrollment_proof_original_name')->nullable();
            $table->enum('student_income_source', [
                'loan',
                'grant',
                'parental_support',
                'part_time_work',
                'savings',
                'other',
            ])->nullable();
            $table->decimal('student_monthly_income', 10, 2)->nullable();

            // Employment - If Unemployed/Retired/Other
            $table->string('income_source', 200)->nullable();
            $table->string('income_proof_path')->nullable();
            $table->string('income_proof_original_name')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['application_id', 'occupant_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_co_signers');
    }
};
