<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response as ResponseFacade;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response|RedirectResponse
    {
        // If already authenticated, redirect to their dashboard
        if (Auth::check()) {
            return redirect()->away(userDefaultDashboard(Auth::user()));
        }

        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): HttpResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Check if there's an intended URL from query parameter
        $intended = $request->query('intended');

        // If no intended URL, determine redirect based on user type preference
        if (!$intended) {
            $userTypePreference = $request->input('userType', 'tenant');

            if ($userTypePreference === 'property-manager') {
                $managerUrl = config('app.env') === 'local'
                    ? 'http://manager.' . parse_url(config('app.url'), PHP_URL_HOST) . ':' . parse_url(config('app.url'), PHP_URL_PORT)
                    : 'https://manager.' . config('app.domain');
                $redirectUrl = $managerUrl . '/dashboard';
            } else {
                // Tenant selected - redirect to root domain dashboard
                $redirectUrl = config('app.url') . '/dashboard';
            }
        } else {
            $redirectUrl = $intended;
        }

        // For Inertia external redirects, return 409 with X-Inertia-Location header
        if ($request->header('X-Inertia')) {
            return ResponseFacade::make('', 409, [
                'X-Inertia-Location' => $redirectUrl
            ]);
        }

        // Fallback for non-Inertia requests
        return ResponseFacade::redirectTo($redirectUrl);
    }
}
