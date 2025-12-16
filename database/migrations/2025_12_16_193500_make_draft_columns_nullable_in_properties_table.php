<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ensure all draft-related columns are nullable for draft properties.
 *
 * Draft properties are created with minimal data and filled in progressively
 * through the wizard. These columns must allow NULL values.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Address fields - nullable for drafts
            $table->string('house_number', 20)->nullable()->change();
            $table->string('street_name', 255)->nullable()->change();
            $table->string('city', 100)->nullable()->change();
            $table->string('postal_code', 20)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't reverse - these should stay nullable for drafts
    }
};
