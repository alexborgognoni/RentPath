<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the conversations table for 1:1 messaging between
     * property managers and leads/tenants.
     */
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();

            // The property manager in this conversation
            $table->foreignId('property_manager_id')
                ->constrained()
                ->onDelete('cascade');

            // The other participant (lead or tenant)
            $table->enum('participant_type', ['lead', 'tenant']);
            $table->unsignedBigInteger('participant_id');

            // For sorting conversations by most recent activity
            $table->timestamp('last_message_at')->nullable();

            // Read tracking for unread indicators
            $table->timestamp('manager_last_read_at')->nullable();
            $table->timestamp('participant_last_read_at')->nullable();

            $table->timestamps();

            // One conversation per manager-participant pair
            $table->unique(['property_manager_id', 'participant_type', 'participant_id'], 'conversations_unique_pair');

            // Index for participant queries (tenant inbox)
            $table->index(['participant_type', 'participant_id'], 'conversations_participant_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
