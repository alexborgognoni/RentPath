***REMOVED***

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration ***REMOVED***
    public function up(): void
    ***REMOVED***
        Schema::create('properties', function (Blueprint $table) ***REMOVED***
            $table->uuid('id')->primary();

            // Core Info
            $table->string('title');
            $table->text('description');
            $table->string('address');
            $table->string('city');
            $table->string('postal_code');
            $table->string('country');

            // Location
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Rent & Availability
            $table->enum('occupancy_status', ['Occupied', 'Vacant', 'Under Maintenance'])->default('Vacant');
            $table->decimal('rent_amount', 10, 2);
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->date('available_from');
            $table->integer('lease_term_months')->nullable();

            // Property Details
            $table->enum('property_type', ['House', 'Detached House', 'Semi-detached House', 'Apartment', 'Studio', 'Penthouse', 'Duplex', 'Triplex', 'Loft', 'Garage', 'Office']);
            $table->integer('bedrooms')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->integer('square_meters');
            $table->integer('floor_number')->nullable();
            $table->integer('total_floors')->nullable();
            $table->integer('year_built')->nullable();
            $table->boolean('furnished')->default(false);
            $table->boolean('pets_allowed')->default(false);
            $table->boolean('smoking_allowed')->default(false);
            $table->integer('indoor_parking_spots')->default(0);
            $table->integer('outdoor_parking_spots')->default(0);
            $table->string('heating_type');
            $table->string('energy_class');

            // Media
            $table->string('cover_image_url')->nullable();
            $table->json('photo_gallery')->nullable();
            $table->string('virtual_tour_url')->nullable();

            // Visibility & Access
            $table->boolean('is_visible')->default(true);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_invite_only')->default(false);
            $table->string('access_code')->nullable();

            // Timestamps & Auditing
            $table->timestamps();
            $table->softDeletes();
            $table->uuid('created_by');
            $table->uuid('updated_by');

            // $table->foreign('created_by')->references('id')->on('users');
            // $table->foreign('updated_by')->references('id')->on('users');
    ***REMOVED***);
***REMOVED***

    public function down(): void
    ***REMOVED***
        Schema::dropIfExists('properties');
***REMOVED***
***REMOVED***;
