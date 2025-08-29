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
        Schema::create('property_managers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->enum('type', ['individual', 'professional']);

            $table->string('company_name')->nullable();
            $table->string('company_website')->nullable();
            $table->string('license_number')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('profile_picture_path')->nullable();
            $table->string('id_document_path')->nullable();
            $table->string('license_document_path')->nullable();
            $table->boolean('is_verified')->default(true);

            $table->timestamps();

            // Indexes for performance and search
            $table->index(['type', 'is_verified']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_managers');
    }
};
