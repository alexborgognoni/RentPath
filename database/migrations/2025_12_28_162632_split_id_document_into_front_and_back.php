<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add new front/back columns to tenant_profiles
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->string('id_document_front_path')->nullable()->after('guarantor_monthly_income');
            $table->string('id_document_front_original_name')->nullable()->after('id_document_front_path');
            $table->string('id_document_back_path')->nullable()->after('id_document_front_original_name');
            $table->string('id_document_back_original_name')->nullable()->after('id_document_back_path');
        });

        // Migrate existing id_document data to front side (assuming single-sided uploads were front)
        DB::table('tenant_profiles')
            ->whereNotNull('id_document_path')
            ->update([
                'id_document_front_path' => DB::raw('id_document_path'),
                'id_document_front_original_name' => DB::raw('id_document_original_name'),
            ]);

        // Drop old columns
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn(['id_document_path', 'id_document_original_name']);
        });

        // Add new front/back columns to applications (snapshot fields)
        Schema::table('applications', function (Blueprint $table) {
            $table->string('snapshot_id_document_front_path')->nullable()->after('snapshot_guarantor_monthly_income');
            $table->string('snapshot_id_document_back_path')->nullable()->after('snapshot_id_document_front_path');
        });

        // Migrate existing snapshot data
        DB::table('applications')
            ->whereNotNull('snapshot_id_document_path')
            ->update([
                'snapshot_id_document_front_path' => DB::raw('snapshot_id_document_path'),
            ]);

        // Drop old snapshot column
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('snapshot_id_document_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore old columns to tenant_profiles
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->string('id_document_path')->nullable()->after('guarantor_monthly_income');
            $table->string('id_document_original_name')->nullable()->after('id_document_path');
        });

        // Migrate front data back to single column
        DB::table('tenant_profiles')
            ->whereNotNull('id_document_front_path')
            ->update([
                'id_document_path' => DB::raw('id_document_front_path'),
                'id_document_original_name' => DB::raw('id_document_front_original_name'),
            ]);

        // Drop new columns
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'id_document_front_path',
                'id_document_front_original_name',
                'id_document_back_path',
                'id_document_back_original_name',
            ]);
        });

        // Restore old snapshot column to applications
        Schema::table('applications', function (Blueprint $table) {
            $table->string('snapshot_id_document_path')->nullable()->after('snapshot_guarantor_monthly_income');
        });

        // Migrate back
        DB::table('applications')
            ->whereNotNull('snapshot_id_document_front_path')
            ->update([
                'snapshot_id_document_path' => DB::raw('snapshot_id_document_front_path'),
            ]);

        // Drop new snapshot columns
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['snapshot_id_document_front_path', 'snapshot_id_document_back_path']);
        });
    }
};
