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

            // Property type and subtype
            $table->enum('type', ['apartment', 'house', 'room', 'commercial', 'industrial', 'parking']);
            $table->enum('subtype', [
                // Apartment subtypes
                'studio', 'loft', 'duplex', 'triplex', 'penthouse', 'serviced',
                // House subtypes
                'detached', 'semi-detached', 'villa', 'bungalow',
                // Room subtypes
                'private_room', 'student_room', 'co-living',
                // Commercial subtypes
                'office', 'retail',
                // Industrial subtypes
                'warehouse', 'factory',
                // Parking subtypes
                'garage', 'indoor_spot', 'outdoor_spot'
            ]);

            // Property specifications
            $table->unsignedInteger('bedrooms')->default(0);
            $table->decimal('bathrooms', 3, 1)->default(0);
            $table->unsignedInteger('parking_spots_interior')->default(0);
            $table->unsignedInteger('parking_spots_exterior')->default(0);
            $table->decimal('size', 10, 2)->nullable()->comment('in square meters');
            $table->decimal('balcony_size', 10, 2)->nullable();
            $table->decimal('land_size', 10, 2)->nullable()->comment('only for houses');
            $table->integer('floor_level')->nullable();
            $table->boolean('has_elevator')->default(false);
            $table->year('year_built')->nullable();

            // Energy / building
            $table->enum('energy_class', ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'])->nullable();
            $table->enum('thermal_insulation_class', ['A', 'B', 'C', 'D', 'E', 'F', 'G'])->nullable();
            $table->enum('heating_type', ['gas', 'electric', 'district', 'wood', 'heat_pump', 'other'])->nullable();

            // Kitchen
            $table->boolean('kitchen_equipped')->default(false);
            $table->boolean('kitchen_separated')->default(false);

            // Extras / amenities
            $table->boolean('has_cellar')->default(false);
            $table->boolean('has_laundry')->default(false);
            $table->boolean('has_fireplace')->default(false);
            $table->boolean('has_air_conditioning')->default(false);
            $table->boolean('has_garden')->default(false);
            $table->boolean('has_rooftop')->default(false);
            $table->json('extras')->nullable()->comment('for uncommon features like sauna, home_office, etc.');

            // Rental information
            $table->date('available_date')->nullable();
            $table->decimal('rent_amount', 10, 2);
            $table->enum('rent_currency', ['eur', 'usd', 'gbp', 'chf'])->default('eur');

            // Property status
            $table->enum('status', [
                'inactive',
                'available',
                'application_received',
                'under_review',
                'visit_scheduled',
                'approved',
                'leased',
                'maintenance',
                'archived'
            ])->default('inactive');

            // Address fields
            $table->string('house_number', 20);
            $table->string('street_name', 255);
            $table->string('street_line2', 255)->nullable();
            $table->string('city', 100);
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20);
            $table->char('country', 2); // ISO 3166-1 alpha-2

            $table->timestamps();

            // Indexes
            $table->index(['property_manager_id', 'status'], 'idx_property_manager_status');
            $table->index(['city', 'postal_code'], 'idx_city_postal');
            $table->index(['type', 'subtype'], 'idx_type_subtype');
            $table->index('available_date', 'idx_available_date');
            $table->index('rent_amount', 'idx_rent_amount');
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
