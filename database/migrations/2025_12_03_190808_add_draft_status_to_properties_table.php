<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds 'draft' as the first status option for properties.
     * Draft properties are incomplete and being edited in the wizard.
     *
     * Note: This migration is skipped if the new simplified schema already exists.
     */
    public function up(): void
    {
        // Skip if new schema already exists (has 'vacant' status and 'visibility' column)
        if (Schema::hasColumn('properties', 'visibility')) {
            return;
        }

        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM(
            'draft',
            'inactive',
            'available',
            'application_received',
            'under_review',
            'visit_scheduled',
            'approved',
            'leased',
            'maintenance',
            'archived'
        ) NOT NULL DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Skip if new schema exists
        if (Schema::hasColumn('properties', 'visibility')) {
            return;
        }

        // Update any draft properties to inactive before removing the status
        DB::table('properties')->where('status', 'draft')->update(['status' => 'inactive']);

        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM(
            'inactive',
            'available',
            'application_received',
            'under_review',
            'visit_scheduled',
            'approved',
            'leased',
            'maintenance',
            'archived'
        ) NOT NULL DEFAULT 'inactive'");
    }
};
