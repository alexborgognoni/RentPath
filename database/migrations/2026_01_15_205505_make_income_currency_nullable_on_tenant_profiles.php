<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Make income_currency nullable for GDPR compliance.
 *
 * Users should be able to completely clear their profile data,
 * including currency preferences.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE tenant_profiles MODIFY income_currency ENUM('eur', 'usd', 'gbp', 'chf') NULL DEFAULT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set any NULL values to 'eur' before making non-nullable
        DB::statement("UPDATE tenant_profiles SET income_currency = 'eur' WHERE income_currency IS NULL");
        DB::statement("ALTER TABLE tenant_profiles MODIFY income_currency ENUM('eur', 'usd', 'gbp', 'chf') NOT NULL DEFAULT 'eur'");
    }
};
