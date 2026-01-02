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
            $table->dropColumn([
                'right_to_rent_share_code',
                'right_to_rent_document_path',
                'right_to_rent_document_original_name',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_co_signers', function (Blueprint $table) {
            $table->string('right_to_rent_share_code')->nullable()->after('id_document_back_original_name');
            $table->string('right_to_rent_document_path')->nullable()->after('right_to_rent_share_code');
            $table->string('right_to_rent_document_original_name')->nullable()->after('right_to_rent_document_path');
        });
    }
};
