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
        Schema::table('application_co_signers', function (Blueprint $table) {
            // When non-null, indicates this co-signer was auto-created from occupant at this index
            // and should not be manually removable
            $table->tinyInteger('from_occupant_index')->nullable()->after('occupant_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_co_signers', function (Blueprint $table) {
            $table->dropColumn('from_occupant_index');
        });
    }
};
