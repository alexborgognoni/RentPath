<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update enum to include all immigration status options
        DB::statement("ALTER TABLE tenant_profiles MODIFY COLUMN immigration_status ENUM(
            'citizen',
            'permanent_resident',
            'temporary_resident',
            'visa_holder',
            'student',
            'work_permit',
            'family_reunification',
            'refugee_or_protected',
            'other'
        ) NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE tenant_profiles MODIFY COLUMN immigration_status ENUM(
            'citizen',
            'permanent_resident',
            'visa_holder',
            'refugee',
            'asylum_seeker',
            'other'
        ) NULL");
    }
};
