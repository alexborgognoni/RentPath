<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the leads table for tracking people interested in properties.
     *
     * A Lead is a person (identified by email) who:
     * - Has shown interest in a property (inbound), OR
     * - The manager wants to have interested in a property (outbound)
     *
     * Sources (MVP): manual, invite, token_signup, application, inquiry
     * Statuses: invited → viewed → drafting → applied → archived
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();

            // Property this lead is interested in
            $table->foreignId('property_id')
                ->constrained()
                ->onDelete('cascade');

            // Lead contact info
            $table->string('email')->index();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();

            // Unique token for personal invite link
            $table->string('token', 64)->unique();

            // Source tracking
            $table->enum('source', ['manual', 'invite', 'token_signup', 'application', 'inquiry'])
                ->default('manual');

            // Status: invited → viewed → drafting → applied → archived
            $table->enum('status', ['invited', 'viewed', 'drafting', 'applied', 'archived'])
                ->default('invited');

            // Linked user (when they sign up)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->onDelete('set null');

            // Linked application (when they apply)
            $table->foreignId('application_id')
                ->nullable()
                ->constrained()
                ->onDelete('set null');

            // If lead came from clicking an anonymous token link
            $table->foreignId('invite_token_id')
                ->nullable()
                ->constrained('application_invite_tokens')
                ->onDelete('set null');

            // Timestamps for lead lifecycle
            $table->timestamp('invited_at')->nullable();
            $table->timestamp('viewed_at')->nullable();

            // Manager's private notes
            $table->text('notes')->nullable();

            $table->timestamps();

            // One lead per email per property
            $table->unique(['property_id', 'email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
