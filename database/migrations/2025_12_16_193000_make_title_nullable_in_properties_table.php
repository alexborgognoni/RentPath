<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ensure title column is nullable for draft properties.
 *
 * This migration ensures consistency across all environments.
 * The original migration already has ->nullable() but this
 * ensures production databases that may have been created
 * differently are updated.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('title')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't reverse - title should stay nullable for drafts
    }
};
