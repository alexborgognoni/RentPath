<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds 'draft' as the first status option for properties.
     * Draft properties are incomplete and being edited in the wizard.
     */
    public function up(): void
    {
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
