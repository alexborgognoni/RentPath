<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Transitions from old property schema to new simplified schema:
     * - Simplifies status enum (draft, vacant, leased, maintenance, archived)
     * - Adds visibility, accepting_applications, application_access columns
     * - Removes requires_invite, invite_token, invite_token_expires_at columns
     * - Adds view_count to application_invite_tokens
     */
    public function up(): void
    {
        // Skip if new schema already exists (fresh install)
        if (Schema::hasColumn('properties', 'visibility')) {
            // Just ensure view_count exists on invite tokens
            if (! Schema::hasColumn('application_invite_tokens', 'view_count')) {
                Schema::table('application_invite_tokens', function (Blueprint $table) {
                    $table->integer('view_count')->default(0)->after('used_count');
                });
            }

            return;
        }

        // Step 1: Add new columns
        Schema::table('properties', function (Blueprint $table) {
            $table->enum('visibility', ['public', 'unlisted', 'private'])
                ->default('unlisted')
                ->after('status');
            $table->boolean('accepting_applications')
                ->default(false)
                ->after('visibility');
            $table->enum('application_access', ['open', 'link_required', 'invite_only'])
                ->default('link_required')
                ->after('accepting_applications');
        });

        // Step 2: Migrate data - map old statuses to new statuses and set visibility
        // Old statuses: draft, inactive, available, application_received, under_review, visit_scheduled, approved, leased, maintenance, archived
        // New statuses: draft, vacant, leased, maintenance, archived

        // First add 'vacant' to the enum
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM(
            'draft',
            'inactive',
            'available',
            'application_received',
            'under_review',
            'visit_scheduled',
            'approved',
            'leased',
            'maintenance',
            'archived',
            'vacant'
        ) NOT NULL DEFAULT 'draft'");

        // Migrate data based on old requires_invite field
        DB::table('properties')
            ->where('requires_invite', true)
            ->update([
                'application_access' => 'link_required',
                'visibility' => 'unlisted',
            ]);

        DB::table('properties')
            ->where('requires_invite', false)
            ->update([
                'application_access' => 'open',
                'visibility' => 'unlisted',
            ]);

        // Set accepting_applications based on old status
        DB::table('properties')
            ->whereIn('status', ['available', 'application_received', 'under_review', 'visit_scheduled', 'approved'])
            ->update(['accepting_applications' => true]);

        // Migrate status values
        DB::table('properties')->where('status', 'inactive')->update(['status' => 'vacant', 'visibility' => 'private']);
        DB::table('properties')->where('status', 'available')->update(['status' => 'vacant']);
        DB::table('properties')->where('status', 'application_received')->update(['status' => 'vacant']);
        DB::table('properties')->where('status', 'under_review')->update(['status' => 'vacant']);
        DB::table('properties')->where('status', 'visit_scheduled')->update(['status' => 'vacant']);
        DB::table('properties')->where('status', 'approved')->update(['status' => 'vacant']);
        // leased, maintenance, archived, draft stay the same

        // Step 3: Change enum to only have new values
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM(
            'draft',
            'vacant',
            'leased',
            'maintenance',
            'archived'
        ) NOT NULL DEFAULT 'draft'");

        // Step 4: Remove old columns
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex('idx_invite_token');
            $table->dropColumn(['requires_invite', 'invite_token', 'invite_token_expires_at']);
        });

        // Step 5: Add index for new columns
        Schema::table('properties', function (Blueprint $table) {
            $table->index(['visibility', 'accepting_applications'], 'idx_visibility_applications');
        });

        // Step 6: Add view_count to invite tokens if not exists
        if (! Schema::hasColumn('application_invite_tokens', 'view_count')) {
            Schema::table('application_invite_tokens', function (Blueprint $table) {
                $table->integer('view_count')->default(0)->after('used_count');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Skip if old schema doesn't exist (nothing to reverse)
        if (! Schema::hasColumn('properties', 'visibility')) {
            return;
        }

        // Remove view_count from invite tokens
        if (Schema::hasColumn('application_invite_tokens', 'view_count')) {
            Schema::table('application_invite_tokens', function (Blueprint $table) {
                $table->dropColumn('view_count');
            });
        }

        // Add back old columns
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex('idx_visibility_applications');
        });

        Schema::table('properties', function (Blueprint $table) {
            $table->boolean('requires_invite')->default(true)->after('status');
            $table->string('invite_token', 64)->unique()->nullable()->after('requires_invite');
            $table->timestamp('invite_token_expires_at')->nullable()->after('invite_token');
        });

        // Add back old enum values first
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM(
            'draft',
            'inactive',
            'available',
            'application_received',
            'under_review',
            'visit_scheduled',
            'approved',
            'leased',
            'maintenance',
            'archived',
            'vacant'
        ) NOT NULL DEFAULT 'draft'");

        // Migrate status back - vacant becomes available
        DB::table('properties')->where('status', 'vacant')->update(['status' => 'available']);

        // Migrate requires_invite back
        DB::table('properties')->where('application_access', 'open')->update(['requires_invite' => false]);
        DB::table('properties')->whereIn('application_access', ['link_required', 'invite_only'])->update(['requires_invite' => true]);

        // Remove new enum value
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM(
            'draft',
            'inactive',
            'available',
            'application_received',
            'under_review',
            'visit_scheduled',
            'approved',
            'leased',
            'maintenance',
            'archived'
        ) NOT NULL DEFAULT 'draft'");

        // Remove new columns
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['visibility', 'accepting_applications', 'application_access']);
        });

        // Add back old index
        Schema::table('properties', function (Blueprint $table) {
            $table->index(['invite_token', 'invite_token_expires_at'], 'idx_invite_token');
        });
    }
};
