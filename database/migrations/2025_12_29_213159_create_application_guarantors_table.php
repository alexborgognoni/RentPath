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
        Schema::create('application_guarantors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();

            // Link to signer (primary applicant or co-signer)
            $table->enum('for_signer_type', ['primary', 'co_signer']);
            $table->foreignId('for_co_signer_id')
                ->nullable()
                ->constrained('application_co_signers')
                ->cascadeOnDelete();

            // Identity - Basic (aligned with TenantProfile)
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->date('date_of_birth');
            $table->string('nationality', 2); // ISO-2
            $table->string('email', 255);
            $table->string('phone_country_code', 10);
            $table->string('phone_number', 30);

            // Relationship
            $table->enum('relationship', [
                'parent',
                'grandparent',
                'sibling',
                'spouse',
                'partner',
                'employer',
                'other',
            ]);
            $table->string('relationship_other', 100)->nullable();

            // Identity - ID Document (aligned with TenantProfile)
            $table->enum('id_document_type', [
                'passport',
                'national_id',
                'drivers_license',
            ]);
            $table->text('id_number')->nullable(); // Encrypted
            $table->string('id_issuing_country', 2)->nullable(); // ISO-2
            $table->date('id_expiry_date')->nullable();
            $table->string('id_document_front_path')->nullable();
            $table->string('id_document_front_original_name')->nullable();
            $table->string('id_document_back_path')->nullable();
            $table->string('id_document_back_original_name')->nullable();

            // Address
            $table->string('street_address', 255);
            $table->string('city', 100);
            $table->string('state_province', 100)->nullable();
            $table->string('postal_code', 20);
            $table->string('country', 2); // ISO-2
            $table->unsignedTinyInteger('years_at_address')->nullable();
            $table->string('proof_of_residence_path')->nullable();
            $table->string('proof_of_residence_original_name')->nullable();

            // Employment (simplified for guarantors - no student path)
            $table->enum('employment_status', [
                'employed',
                'self_employed',
                'retired',
                'other',
            ]);
            $table->string('employer_name', 200)->nullable();
            $table->string('job_title', 100)->nullable();

            // Financial (aligned with TenantProfile)
            $table->decimal('net_monthly_income', 12, 2);
            $table->string('income_currency', 3);

            // Documents
            $table->string('proof_of_income_path')->nullable();
            $table->string('proof_of_income_original_name')->nullable();
            $table->string('credit_report_path')->nullable();
            $table->string('credit_report_original_name')->nullable();

            // Consent & Legal
            $table->boolean('consent_to_credit_check')->default(false);
            $table->boolean('consent_to_contact')->default(false);
            $table->boolean('guarantee_consent_signed')->default(false);
            $table->timestamp('guarantee_consent_timestamp')->nullable();
            $table->string('guarantee_consent_ip', 45)->nullable(); // IPv6 max length

            $table->timestamps();

            // Indexes
            $table->index('application_id');
            $table->index('for_signer_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_guarantors');
    }
};
