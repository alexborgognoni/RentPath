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
            $table->text('rejection_reason')->nullable();
            $table->json('rejected_fields')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_managers', function (Blueprint $table) {
            $table->dropColumn(['rejection_reason', 'rejected_fields']);
        });
    }
};
