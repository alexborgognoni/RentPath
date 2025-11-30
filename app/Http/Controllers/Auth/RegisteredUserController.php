<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\RedirectHelper;
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

        // Check if there's a redirect URL from form data or query parameter
        $redirect = $request->input('redirect') ?? $request->query('redirect');
        $userTypePreference = $request->input('userType', 'tenant');

        // Resolve the redirect URL using helper
        $redirectUrl = RedirectHelper::resolveRedirectUrl($redirect, $userTypePreference);

        // For Inertia external redirects, return 409 with X-Inertia-Location header
        if ($request->header('X-Inertia')) {
            return ResponseFacade::make('', 409, [
                'X-Inertia-Location' => $redirectUrl,
            ]);
        }

        // Fallback for non-Inertia requests
        return ResponseFacade::make('', 302, [
            'Location' => $redirectUrl,
        ]);
    }
}
