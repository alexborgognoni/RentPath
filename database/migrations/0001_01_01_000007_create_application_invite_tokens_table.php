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
        Schema::create('application_invite_tokens', function (Blueprint $table) {
            $table->id();

            // Property this token grants access to
            $table->foreignId('property_id')
                ->constrained()
                ->onDelete('cascade');

            // Token details
            $table->string('token', 64)->unique();

            // Token type
            $table->enum('type', ['private', 'invite'])->default('private')
                ->comment('private = shareable link, invite = email-restricted');

            // Email restriction (for invite type)
            $table->string('email')->nullable()
                ->comment('If type=invite, only this email can use the token');

            // Usage limits
            $table->integer('max_uses')->nullable()
                ->comment('Maximum allowed uses (null = unlimited)');
            $table->integer('used_count')->default(0)
                ->comment('Current number of uses');

            // Expiration
            $table->timestamp('expires_at')->nullable()
                ->comment('When the token becomes invalid');

            // Status
            $table->enum('status', ['active', 'revoked', 'expired'])->default('active');

            // Creator tracking
            $table->foreignId('created_by_user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->timestamps();

            // Indexes
            $table->index(['property_id', 'status'], 'idx_tokens_property_status');
            $table->index(['token', 'expires_at'], 'idx_tokens_token_lookup');
            $table->index('email', 'idx_tokens_email');
            $table->index('status', 'idx_tokens_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_invite_tokens');
    }
};
