<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Make columns nullable for draft saving support.
     * Co-signers and guarantors need partial data during wizard flow.
     */
    public function up(): void
    {
        // Fix application_co_signers
        Schema::table('application_co_signers', function (Blueprint $table) {
            // Identity - Basic
            $table->string('first_name', 100)->nullable()->change();
            $table->string('last_name', 100)->nullable()->change();
            $table->date('date_of_birth')->nullable()->change();
            $table->string('nationality', 2)->nullable()->change();
            $table->string('email', 255)->nullable()->change();
            $table->string('phone_country_code', 10)->nullable()->change();
            $table->string('phone_number', 30)->nullable()->change();

            // ID Document - convert ENUM to nullable string (MySQL doesn't allow nullable ENUM change easily)
            $table->string('id_document_type', 50)->nullable()->change();
            $table->text('id_number')->nullable()->change();
            $table->string('id_issuing_country', 2)->nullable()->change();
            $table->date('id_expiry_date')->nullable()->change();

            // Employment status - convert to nullable string
            $table->string('employment_status', 50)->nullable()->change();
        });

        // Fix application_guarantors
        Schema::table('application_guarantors', function (Blueprint $table) {
            // Identity - Basic
            $table->string('first_name', 100)->nullable()->change();
            $table->string('last_name', 100)->nullable()->change();
            $table->date('date_of_birth')->nullable()->change();
            $table->string('nationality', 2)->nullable()->change();
            $table->string('email', 255)->nullable()->change();
            $table->string('phone_country_code', 10)->nullable()->change();
            $table->string('phone_number', 30)->nullable()->change();

            // Relationship
            $table->string('relationship', 50)->nullable()->change();

            // ID Document
            $table->string('id_document_type', 50)->nullable()->change();

            // Address
            $table->string('street_address', 255)->nullable()->change();
            $table->string('city', 100)->nullable()->change();
            $table->string('postal_code', 20)->nullable()->change();
            $table->string('country', 2)->nullable()->change();

            // Employment
            $table->string('employment_status', 50)->nullable()->change();

            // Financial
            $table->decimal('net_monthly_income', 12, 2)->nullable()->change();
            $table->string('income_currency', 3)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left empty - reversing could fail with null data
    }
};
