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
        Schema::create('users', function (Blueprint $table) ***REMOVED***
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
    ***REMOVED***);

        Schema::create('password_reset_tokens', function (Blueprint $table) ***REMOVED***
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
    ***REMOVED***);

        Schema::create('sessions', function (Blueprint $table) ***REMOVED***
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
    ***REMOVED***);
***REMOVED***

***REMOVED***
     * Reverse the migrations.
***REMOVED***
    public function down(): void
    ***REMOVED***
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
***REMOVED***
***REMOVED***;
