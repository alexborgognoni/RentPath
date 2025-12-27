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
        Schema::create('tenant_references', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_profile_id')
                ->constrained()
                ->onDelete('cascade');

            // Reference type
            $table->enum('type', ['landlord', 'personal', 'professional']);

            // Contact details
            $table->string('name');
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('relationship', 100)->nullable();
            $table->integer('years_known')->unsigned()->nullable();

            // Document attachment (one per reference)
            $table->string('reference_document_path')->nullable();
            $table->string('reference_document_original_name')->nullable();

            $table->timestamps();

            $table->index(['tenant_profile_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_references');
    }
};
