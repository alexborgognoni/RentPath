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
            // Rental Intent (Step 2)
            $table->boolean('is_flexible_on_move_in')->default(false)->after('lease_duration_months');
            $table->boolean('is_flexible_on_duration')->default(false)->after('is_flexible_on_move_in');

            // Credit & Background Authorization (Step 5)
            $table->boolean('authorize_credit_check')->default(false)->after('message_to_landlord');
            $table->boolean('authorize_background_check')->default(false)->after('authorize_credit_check');
            $table->enum('credit_check_provider_preference', [
                'experian',
                'equifax',
                'transunion',
                'illion_au',
                'no_preference',
            ])->nullable()->after('authorize_background_check');

            // Credit & Background Self-Disclosure (Step 5)
            $table->boolean('has_ccjs_or_bankruptcies')->default(false)->after('credit_check_provider_preference');
            $table->text('ccj_bankruptcy_details')->nullable()->after('has_ccjs_or_bankruptcies');
            $table->boolean('has_eviction_history')->default(false)->after('ccj_bankruptcy_details');
            $table->text('eviction_details')->nullable()->after('has_eviction_history');
            $table->unsignedSmallInteger('self_reported_credit_score')->nullable()->after('eviction_details');
            $table->string('credit_report_path')->nullable()->after('self_reported_credit_score');
            $table->string('credit_report_original_name')->nullable()->after('credit_report_path');

            // Current Address - Living Situation (Step 5)
            $table->enum('current_living_situation', [
                'renting',
                'owner',
                'living_with_family',
                'student_housing',
                'employer_provided',
                'other',
            ])->nullable()->after('credit_report_original_name');
            $table->string('current_address_unit', 50)->nullable()->after('current_living_situation');
            $table->string('current_address_state_province', 100)->nullable()->after('current_address_unit');
            $table->date('current_address_move_in_date')->nullable()->after('current_address_state_province');
            $table->decimal('current_monthly_rent', 10, 2)->nullable()->after('current_address_move_in_date');
            $table->string('current_rent_currency', 3)->nullable()->after('current_monthly_rent');
            $table->string('current_landlord_name', 200)->nullable()->after('current_rent_currency');
            $table->string('current_landlord_contact', 200)->nullable()->after('current_landlord_name');

            // Reason for Moving (Step 5)
            $table->enum('reason_for_moving', [
                'relocation_work',
                'relocation_personal',
                'upsizing',
                'downsizing',
                'end_of_lease',
                'buying_property',
                'relationship_change',
                'closer_to_family',
                'better_location',
                'cost',
                'first_time_renter',
                'other',
            ])->nullable()->after('current_landlord_contact');
            $table->string('reason_for_moving_other', 200)->nullable()->after('reason_for_moving');

            // Previous Addresses (Step 5)
            $table->json('previous_addresses')->nullable()->after('reason_for_moving_other');

            // Rent Guarantee Insurance (Step 4)
            $table->enum('interested_in_rent_insurance', [
                'yes',
                'no',
                'already_have',
            ])->nullable()->after('previous_addresses');
            $table->string('existing_insurance_provider', 200)->nullable()->after('interested_in_rent_insurance');
            $table->string('existing_insurance_policy_number', 100)->nullable()->after('existing_insurance_provider');

            // Additional Information (Step 6)
            $table->text('additional_information')->nullable()->after('existing_insurance_policy_number');
            // additional_documents JSON already exists

            // Declarations & Consent Timestamps (Step 7)
            $table->timestamp('declaration_accuracy_at')->nullable()->after('additional_information');
            $table->timestamp('consent_screening_at')->nullable()->after('declaration_accuracy_at');
            $table->timestamp('consent_data_processing_at')->nullable()->after('consent_screening_at');
            $table->timestamp('consent_reference_contact_at')->nullable()->after('consent_data_processing_at');
            $table->timestamp('consent_data_sharing_at')->nullable()->after('consent_reference_contact_at');
            $table->timestamp('consent_marketing_at')->nullable()->after('consent_data_sharing_at');

            // Digital Signature (Step 7)
            $table->string('digital_signature', 200)->nullable()->after('consent_marketing_at');
            $table->string('signature_ip_address', 45)->nullable()->after('digital_signature'); // IPv6 max length
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                // Rental Intent
                'is_flexible_on_move_in',
                'is_flexible_on_duration',
                // Credit & Background
                'authorize_credit_check',
                'authorize_background_check',
                'credit_check_provider_preference',
                'has_ccjs_or_bankruptcies',
                'ccj_bankruptcy_details',
                'has_eviction_history',
                'eviction_details',
                'self_reported_credit_score',
                'credit_report_path',
                'credit_report_original_name',
                // Current Address
                'current_living_situation',
                'current_address_unit',
                'current_address_state_province',
                'current_address_move_in_date',
                'current_monthly_rent',
                'current_rent_currency',
                'current_landlord_name',
                'current_landlord_contact',
                'reason_for_moving',
                'reason_for_moving_other',
                'previous_addresses',
                // Insurance
                'interested_in_rent_insurance',
                'existing_insurance_provider',
                'existing_insurance_policy_number',
                // Additional
                'additional_information',
                // Consent
                'declaration_accuracy_at',
                'consent_screening_at',
                'consent_data_processing_at',
                'consent_reference_contact_at',
                'consent_data_sharing_at',
                'consent_marketing_at',
                'digital_signature',
                'signature_ip_address',
            ]);
        });
    }
};
