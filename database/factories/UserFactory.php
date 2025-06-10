***REMOVED***

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
***REMOVED***
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
***REMOVED***
***REMOVED***
     * The current password being used by the factory.
***REMOVED***
    protected static ?string $password;

***REMOVED***
     * Define the model's default state.
     *
     * @return array<string, mixed>
***REMOVED***
    public function definition(): array
    ***REMOVED***
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
***REMOVED***

***REMOVED***
     * Indicate that the model's email address should be unverified.
***REMOVED***
    public function unverified(): static
    ***REMOVED***
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
***REMOVED***
***REMOVED***
***REMOVED***
