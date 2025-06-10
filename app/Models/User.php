***REMOVED***

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
***REMOVED***
***REMOVED*** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

***REMOVED***
     * The attributes that are mass assignable.
     *
     * @var list<string>
***REMOVED***
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

***REMOVED***
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
***REMOVED***
    protected $hidden = [
        'password',
        'remember_token',
    ];

***REMOVED***
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
***REMOVED***
    protected function casts(): array
    ***REMOVED***
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
***REMOVED***
***REMOVED***
