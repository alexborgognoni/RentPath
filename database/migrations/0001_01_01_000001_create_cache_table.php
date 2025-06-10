***REMOVED***

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
***REMOVED***
***REMOVED***
     * Run the migrations.
***REMOVED***
    public function up(): void
    ***REMOVED***
        Schema::create('cache', function (Blueprint $table) ***REMOVED***
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
    ***REMOVED***);

        Schema::create('cache_locks', function (Blueprint $table) ***REMOVED***
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
    ***REMOVED***);
***REMOVED***

***REMOVED***
     * Reverse the migrations.
***REMOVED***
    public function down(): void
    ***REMOVED***
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
***REMOVED***
***REMOVED***;
