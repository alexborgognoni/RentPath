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
        Schema::create('jobs', function (Blueprint $table) ***REMOVED***
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
    ***REMOVED***);

        Schema::create('job_batches', function (Blueprint $table) ***REMOVED***
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
    ***REMOVED***);

        Schema::create('failed_jobs', function (Blueprint $table) ***REMOVED***
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
    ***REMOVED***);
***REMOVED***

***REMOVED***
     * Reverse the migrations.
***REMOVED***
    public function down(): void
    ***REMOVED***
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
***REMOVED***
***REMOVED***;
