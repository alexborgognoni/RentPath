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
        Schema::table('property_managers', function (Blueprint $table) {
            $table->string('phone_country_code', 10)->after('license_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_managers', function (Blueprint $table) {
            $table->dropColumn('phone_country_code');
        });
    }
};
