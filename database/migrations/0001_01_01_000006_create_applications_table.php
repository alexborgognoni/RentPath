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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('property_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('tenant_profile_id')
                ->constrained()
                ->onDelete('cascade');

            // Application status
            $table->enum('status', [
                'draft',              // Started but not submitted
                'submitted',          // Submitted and awaiting review
                'under_review',       // Being reviewed by PM
                'visit_scheduled',    // Visit date/time agreed
                'visit_completed',    // Visit took place
                'approved',           // Approved, awaiting lease
                'rejected',           // Declined by PM/owner
                'withdrawn',          // Tenant withdrew
                'leased',             // Lease signed
                'archived',           // Closed for records
                'deleted'             // Draft cleanup
            ])->default('draft');

            // Application-specific details
            $table->date('desired_move_in_date')->nullable();
            $table->integer('lease_duration_months')->nullable()->comment('Preferred lease length');
            $table->text('message_to_landlord')->nullable()->comment('Cover letter');

            // Additional occupants
            $table->integer('additional_occupants')->default(0);
            $table->json('occupants_details')->nullable()->comment('Array of {name, age, relationship}');

            // Pet information (can override profile)
            $table->boolean('has_pets')->default(false);
            $table->json('pets_details')->nullable()->comment('Array of {type, breed, age, weight}');

            // References
            $table->json('references')->nullable()->comment('Array of {name, phone, email, relationship, years_known}');

            // Previous landlord references
            $table->string('previous_landlord_name')->nullable();
            $table->string('previous_landlord_phone')->nullable();
            $table->string('previous_landlord_email')->nullable();

            // Emergency contact (can override profile)
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();

            // Application-specific documents (private S3)
            $table->string('application_id_document_path')->nullable();
            $table->string('application_id_document_original_name')->nullable();
            $table->string('application_proof_of_income_path')->nullable();
            $table->string('application_proof_of_income_original_name')->nullable();
            $table->string('application_reference_letter_path')->nullable();
            $table->string('application_reference_letter_original_name')->nullable();
            $table->json('additional_documents')->nullable()->comment('Array of {path, original_name, type, description}');

            // Review & decision
            $table->text('rejection_reason')->nullable();
            $table->json('rejection_details')->nullable()->comment('Structured feedback');
            $table->foreignId('reviewed_by_user_id')->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();

            // Visit information
            $table->timestamp('visit_scheduled_at')->nullable();
            $table->text('visit_notes')->nullable();
            $table->timestamp('visit_completed_at')->nullable();

            // Approval information
            $table->foreignId('approved_by_user_id')->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();

            // Lease information (when status = 'leased')
            $table->date('lease_start_date')->nullable();
            $table->date('lease_end_date')->nullable();
            $table->decimal('agreed_rent_amount', 10, 2)->nullable();
            $table->decimal('deposit_amount', 10, 2)->nullable();
            $table->string('lease_document_path')->nullable();
            $table->string('lease_document_original_name')->nullable();
            $table->timestamp('lease_signed_at')->nullable();

            // Timestamps for status changes (audit trail)
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('withdrawn_at')->nullable();
            $table->timestamp('archived_at')->nullable();

            // Invited via token tracking
            $table->string('invited_via_token', 64)->nullable()
                ->comment('The invite token used to access the property');

            // Internal notes (only visible to PM)
            $table->text('internal_notes')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index(['property_id', 'status'], 'idx_applications_property_status');
            $table->index(['tenant_profile_id', 'status'], 'idx_applications_tenant_status');
            $table->index('status', 'idx_applications_status');
            $table->index('submitted_at', 'idx_applications_submitted_at');
            $table->index('visit_scheduled_at', 'idx_applications_visit_scheduled');

            // Unique constraint: one active application per tenant per property
            // Note: MySQL doesn't support partial indexes, so we enforce in application code
            $table->index(['property_id', 'tenant_profile_id', 'status'], 'idx_unique_active_check');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
