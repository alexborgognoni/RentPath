<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the messages table for individual messages within conversations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('conversation_id')
                ->constrained()
                ->onDelete('cascade');

            // Who sent the message
            $table->enum('sender_role', ['manager', 'participant']);

            // Message content
            $table->text('body');

            // Only created_at needed - messages are immutable
            $table->timestamp('created_at')->useCurrent();

            // Index for fetching messages in order
            $table->index(['conversation_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
