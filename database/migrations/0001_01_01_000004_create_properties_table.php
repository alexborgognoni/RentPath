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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_manager_id')->constrained()->onDelete('cascade');

            // Basic property information
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('image_path')->nullable();

            // Property type
            $table->enum('type', [
                'apartment',
                'house',
                'condo',
                'townhouse',
                'studio',
                'loft',
                'room',
                'office',
                'garage',
                'storage',
                'warehouse',
                'retail',
                'commercial'
            ]);

            // Property specifications
            $table->unsignedInteger('bedrooms')->default(0);
            $table->decimal('bathrooms', 3, 1)->default(0);
            $table->unsignedInteger('parking_spots')->default(0);
            $table->decimal('size', 10, 2)->nullable();
            $table->enum('size_unit', ['square_meters', 'square_feet'])->default('square_meters');

            // Rental information
            $table->date('available_date')->nullable();
            $table->decimal('rent_amount', 10, 2);
            $table->enum('rent_currency', ['eur', 'usd', 'gbp', 'chf'])->default('eur');

            // Address fields
            $table->string('house_number', 20);
            $table->string('street_name', 255);
            $table->string('street_line2', 255)->nullable();
            $table->string('city', 100);
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20);
            $table->char('country', 2); // ISO 3166-1 alpha-2

            // Additional fields
            $table->string('invite_token')->unique();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Indexes
            $table->index(['property_manager_id', 'is_active']);
            $table->index('invite_token');
            $table->index('available_date');
            $table->index(['city', 'postal_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
