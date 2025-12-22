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
            $table->string('name')->nullable()
                ->comment('Optional name for the token (e.g., "Open House Link")');
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
            $table->integer('view_count')->default(0)
                ->comment('Number of times token link was viewed');

            // Expiration
            $table->timestamp('expires_at')->nullable()
                ->comment('When the token becomes invalid');

            $table->timestamps();

            // Indexes for performance
            $table->index('property_id');
            $table->index(['token', 'expires_at']);
            $table->index('email');
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
