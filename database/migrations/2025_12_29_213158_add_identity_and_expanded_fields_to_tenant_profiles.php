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
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Identity & Legal - Personal Details
            $table->string('middle_name', 100)->nullable()->after('date_of_birth');

            // Identity & Legal - ID Document
            $table->enum('id_document_type', [
                'passport',
                'national_id',
                'drivers_license',
                'residence_permit',
            ])->nullable()->after('nationality');
            $table->text('id_number')->nullable()->after('id_document_type'); // Encrypted
            $table->string('id_issuing_country', 2)->nullable()->after('id_number'); // ISO-2
            $table->date('id_expiry_date')->nullable()->after('id_issuing_country');

            // Identity & Legal - Immigration Status
            $table->enum('immigration_status', [
                'citizen',
                'permanent_resident',
                'visa_holder',
                'refugee',
                'asylum_seeker',
                'other',
            ])->nullable()->after('id_expiry_date');
            $table->string('immigration_status_other', 100)->nullable()->after('immigration_status');
            $table->string('visa_type', 100)->nullable()->after('immigration_status_other');
            $table->date('visa_expiry_date')->nullable()->after('visa_type');
            $table->string('work_permit_number', 100)->nullable()->after('visa_expiry_date');

            // Identity & Legal - Regional Enhancements
            $table->string('right_to_rent_document_path')->nullable()->after('work_permit_number');
            $table->string('right_to_rent_document_original_name')->nullable()->after('right_to_rent_document_path');
            $table->string('right_to_rent_share_code', 50)->nullable()->after('right_to_rent_document_original_name'); // UK
            $table->enum('identity_verification_method', [
                'document_based',
                'points_based',
            ])->nullable()->after('right_to_rent_share_code'); // AU
            $table->json('identity_points_documents')->nullable()->after('identity_verification_method'); // AU
            $table->unsignedSmallInteger('identity_points_total')->nullable()->after('identity_points_documents'); // AU

            // Employment & Financial - Contract Details
            $table->enum('employment_contract_type', [
                'permanent',
                'fixed_term',
                'freelance',
                'casual',
            ])->nullable()->after('employment_type');
            $table->date('employment_end_date')->nullable()->after('employment_start_date');
            $table->date('probation_end_date')->nullable()->after('employment_end_date');
            $table->enum('pay_frequency', [
                'weekly',
                'fortnightly',
                'monthly',
                'annually',
            ])->nullable()->after('income_currency');

            // Employment & Financial - Net Income (rename existing to be clear, add gross optional)
            // Note: monthly_income already exists, we'll treat it as net
            $table->decimal('gross_annual_income', 12, 2)->nullable()->after('monthly_income');

            // Employment & Financial - Self-Employed Fields
            $table->string('business_name', 200)->nullable()->after('employer_name');
            $table->string('business_type', 100)->nullable()->after('business_name');
            $table->string('business_registration_number', 100)->nullable()->after('business_type');
            $table->decimal('gross_annual_revenue', 14, 2)->nullable()->after('gross_annual_income');

            // Employment & Financial - Document Paths (arrays)
            $table->json('tax_returns_paths')->nullable()->after('payslip_3_original_name');
            $table->json('bank_statements_paths')->nullable()->after('tax_returns_paths');
            $table->json('business_bank_statements_paths')->nullable()->after('bank_statements_paths');

            // Employment & Financial - Additional Income
            $table->boolean('has_additional_income')->default(false)->after('student_income_source');
            $table->json('additional_income_sources')->nullable()->after('has_additional_income');

            // Employer Contact Details
            $table->string('employer_address', 255)->nullable()->after('employer_contact_email');
            $table->string('employer_phone', 50)->nullable()->after('employer_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                // Identity
                'middle_name',
                'id_document_type',
                'id_number',
                'id_issuing_country',
                'id_expiry_date',
                'immigration_status',
                'immigration_status_other',
                'visa_type',
                'visa_expiry_date',
                'work_permit_number',
                'right_to_rent_document_path',
                'right_to_rent_document_original_name',
                'right_to_rent_share_code',
                'identity_verification_method',
                'identity_points_documents',
                'identity_points_total',
                // Employment expansions
                'employment_contract_type',
                'employment_end_date',
                'probation_end_date',
                'pay_frequency',
                'gross_annual_income',
                'business_name',
                'business_type',
                'business_registration_number',
                'gross_annual_revenue',
                'tax_returns_paths',
                'bank_statements_paths',
                'business_bank_statements_paths',
                'has_additional_income',
                'additional_income_sources',
                'employer_address',
                'employer_phone',
            ]);
        });
    }
};
