<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add rental history fields to tenant_profiles.
 *
 * These fields support Step 5 (History) of the application wizard,
 * allowing tenants to reuse their credit/rental history across applications.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Credit & Background Authorization
            $table->boolean('authorize_credit_check')->default(false)->after('income_currency');
            $table->boolean('authorize_background_check')->default(false)->after('authorize_credit_check');
            $table->enum('credit_check_provider_preference', ['experian', 'equifax', 'transunion', 'illion_au', 'no_preference'])->nullable()->after('authorize_background_check');
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Credit & Background Self-Disclosure
            $table->boolean('has_ccjs_or_bankruptcies')->default(false)->after('credit_check_provider_preference');
            $table->text('ccj_bankruptcy_details')->nullable()->after('has_ccjs_or_bankruptcies');
            $table->boolean('has_eviction_history')->default(false)->after('ccj_bankruptcy_details');
            $table->text('eviction_details')->nullable()->after('has_eviction_history');
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Current Living Situation
            $table->enum('current_living_situation', ['owner', 'renting', 'living_with_family', 'student_housing', 'other'])->nullable()->after('eviction_details');
            $table->date('current_address_move_in_date')->nullable()->after('current_living_situation');
            $table->decimal('current_monthly_rent', 10, 2)->nullable()->after('current_address_move_in_date');
            $table->string('current_rent_currency', 3)->nullable()->after('current_monthly_rent');
            $table->string('current_landlord_name', 200)->nullable()->after('current_rent_currency');
            $table->string('current_landlord_contact', 200)->nullable()->after('current_landlord_name');
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Reason for Moving
            $table->enum('reason_for_moving', ['relocation_work', 'relocation_study', 'more_space', 'less_space', 'closer_to_work', 'closer_to_family', 'end_of_lease', 'landlord_selling', 'relationship_change', 'financial', 'safety', 'quality', 'neighborhood', 'other'])->nullable()->after('current_landlord_contact');
            $table->string('reason_for_moving_other', 200)->nullable()->after('reason_for_moving');
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            // Previous Addresses & References (JSON)
            $table->json('previous_addresses')->nullable()->after('reason_for_moving_other');
            $table->json('landlord_references')->nullable()->after('previous_addresses');
            $table->json('other_references')->nullable()->after('landlord_references');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'authorize_credit_check',
                'authorize_background_check',
                'credit_check_provider_preference',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'has_ccjs_or_bankruptcies',
                'ccj_bankruptcy_details',
                'has_eviction_history',
                'eviction_details',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'current_living_situation',
                'current_address_move_in_date',
                'current_monthly_rent',
                'current_rent_currency',
                'current_landlord_name',
                'current_landlord_contact',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'reason_for_moving',
                'reason_for_moving_other',
            ]);
        });

        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'previous_addresses',
                'landlord_references',
                'other_references',
            ]);
        });
    }
};
