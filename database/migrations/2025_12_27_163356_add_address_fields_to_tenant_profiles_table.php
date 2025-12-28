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
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->string('current_address_line_2', 100)->nullable()->after('current_house_number');
            $table->string('current_state_province', 100)->nullable()->after('current_city');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->string('snapshot_current_address_line_2', 100)->nullable()->after('snapshot_current_house_number');
            $table->string('snapshot_current_state_province', 100)->nullable()->after('snapshot_current_city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn(['current_address_line_2', 'current_state_province']);
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['snapshot_current_address_line_2', 'snapshot_current_state_province']);
        });
    }
};
