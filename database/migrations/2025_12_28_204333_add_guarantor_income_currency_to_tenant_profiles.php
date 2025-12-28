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
        // Add guarantor_income_currency to tenant_profiles
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->enum('guarantor_income_currency', ['eur', 'usd', 'gbp', 'chf'])
                ->nullable()
                ->after('guarantor_monthly_income');
        });

        // Add snapshot_guarantor_income_currency to applications
        Schema::table('applications', function (Blueprint $table) {
            $table->enum('snapshot_guarantor_income_currency', ['eur', 'usd', 'gbp', 'chf'])
                ->nullable()
                ->after('snapshot_guarantor_monthly_income');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn('guarantor_income_currency');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('snapshot_guarantor_income_currency');
        });
    }
};
