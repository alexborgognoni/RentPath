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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Basic property information
            $table->string('title');
            $table->text('address');
            $table->longText('description')->nullable();
            $table->string('image_url')->nullable();
            
            // Property type
            $table->enum('type', [
                'apartment', 'house', 'condo', 'townhouse', 'studio', 
                'loft', 'room', 'office', 'garage', 'storage', 
                'warehouse', 'retail', 'commercial'
            ]);
            
            // Property specifications
            $table->unsignedInteger('bedrooms')->default(0);
            $table->decimal('bathrooms', 3, 1)->default(0); // Allow .5 bathrooms
            $table->unsignedInteger('parking_spots')->default(0);
            $table->decimal('size', 10, 2)->nullable(); // Size in specified unit
            $table->enum('size_unit', ['square_meters', 'square_feet'])->default('square_meters');
            
            // Rental information
            $table->date('available_date')->nullable();
            $table->decimal('rent_amount', 10, 2);
            $table->enum('rent_currency', ['eur', 'usd', 'gbp', 'chf'])->default('eur');
            
            // Additional fields for application management
            $table->string('invite_token')->unique();
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'is_active']);
            $table->index('invite_token');
            $table->index('available_date');
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
