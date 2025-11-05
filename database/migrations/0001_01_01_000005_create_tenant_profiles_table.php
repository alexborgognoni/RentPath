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
            $table->decimal('monthly_income', 10, 2)->nullable();
            $table->enum('income_currency', ['eur', 'usd', 'gbp', 'chf'])->default('eur');

            // Documents (private S3 storage)
            $table->string('id_document_path')->nullable();
            $table->string('id_document_original_name')->nullable();
            $table->string('proof_of_income_path')->nullable();
            $table->string('proof_of_income_original_name')->nullable();
            $table->string('reference_letter_path')->nullable();
            $table->string('reference_letter_original_name')->nullable();

            // Profile picture (public S3)
            $table->string('profile_picture_path')->nullable();

            // Emergency contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();

            // Preferences (for matching)
            $table->date('preferred_move_in_date')->nullable();
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
