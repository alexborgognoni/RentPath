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
        Schema::table('properties', function (Blueprint $table) {
            // Public access control
            $table->boolean('public_apply_url_enabled')->default(false)->after('status');

            // Invite token fields
            $table->string('invite_token', 64)->unique()->nullable()->after('public_apply_url_enabled');
            $table->timestamp('invite_token_expires_at')->nullable()->after('invite_token');

            // Index for token lookups
            $table->index(['invite_token', 'invite_token_expires_at'], 'idx_invite_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex('idx_invite_token');
            $table->dropColumn(['public_apply_url_enabled', 'invite_token', 'invite_token_expires_at']);
        });
    }
};
