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
        Schema::create('application_references', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();

            // Reference Type
            $table->enum('type', [
                'landlord',
                'employer',
                'personal',
                'professional',
            ]);

            // Basic Contact Info
            $table->string('name', 200);
            $table->string('company', 200)->nullable();
            $table->string('email', 255);
            $table->string('phone', 50);

            // Landlord-specific fields
            $table->string('property_address', 500)->nullable();
            $table->date('tenancy_start_date')->nullable();
            $table->date('tenancy_end_date')->nullable();
            $table->decimal('monthly_rent_paid', 10, 2)->nullable();

            // Employer-specific fields
            $table->string('job_title', 100)->nullable(); // Their job title (e.g., HR Manager)

            // Personal/Professional reference fields
            $table->enum('relationship', [
                'professional',
                'personal',
            ])->nullable();
            $table->unsignedTinyInteger('years_known')->nullable();

            // Consent
            $table->boolean('consent_to_contact')->default(false);

            $table->timestamps();

            // Indexes
            $table->index('application_id');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_references');
    }
};
