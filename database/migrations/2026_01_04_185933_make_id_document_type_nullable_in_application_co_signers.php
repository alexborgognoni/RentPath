<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Makes id_document_type nullable to support draft saves where the user
     * hasn't filled in their ID document details yet.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE application_co_signers MODIFY COLUMN id_document_type ENUM('passport', 'national_id', 'drivers_license') NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE application_co_signers MODIFY COLUMN id_document_type ENUM('passport', 'national_id', 'drivers_license') NOT NULL");
    }
};
