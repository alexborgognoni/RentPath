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
     *
     * SQLite stores enums as TEXT so no migration needed there.
     * MySQL requires modifying the enum column.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
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
        // SQLite: enum values are stored as TEXT, validation happens at app level
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        // Update any draft properties to inactive before removing the status
        DB::table('properties')->where('status', 'draft')->update(['status' => 'inactive']);

        if ($driver === 'mysql') {
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
    }
};
