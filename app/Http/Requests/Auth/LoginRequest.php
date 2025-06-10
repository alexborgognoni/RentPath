***REMOVED***

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
***REMOVED***
***REMOVED***
     * Determine if the user is authorized to make this request.
***REMOVED***
    public function authorize(): bool
    ***REMOVED***
        return true;
***REMOVED***

***REMOVED***
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
***REMOVED***
    public function rules(): array
    ***REMOVED***
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
***REMOVED***

***REMOVED***
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
***REMOVED***
    public function authenticate(): void
    ***REMOVED***
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) ***REMOVED***
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
    ***REMOVED***
    ***REMOVED***

        RateLimiter::clear($this->throttleKey());
***REMOVED***

***REMOVED***
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
***REMOVED***
    public function ensureIsNotRateLimited(): void
    ***REMOVED***
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) ***REMOVED***
            return;
    ***REMOVED***

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
***REMOVED***
***REMOVED***

***REMOVED***
     * Get the rate limiting throttle key for the request.
***REMOVED***
    public function throttleKey(): string
    ***REMOVED***
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
***REMOVED***
***REMOVED***
