<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        // If already authenticated, redirect to their dashboard
        if (Auth::check()) {
            return redirect()->away(userDefaultDashboard(Auth::user()));
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): HttpResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Explicitly save session to database before redirect
        $request->session()->save();

        // Check if there's an intended URL from query parameter
        $intended = $request->query('intended');

        // If no intended URL, determine redirect based on user type preference
        if (!$intended) {
            $userTypePreference = $request->input('userType', 'tenant');
            $user = $request->user();

            // If they selected property-manager but don't have a property manager profile,
            // still redirect to manager subdomain (they'll be prompted to create profile)
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

        \Log::info('Login redirect URL: ' . $redirectUrl);
        \Log::info('Session ID: ' . $request->session()->getId());

        $sessionName = config('session.cookie');
        $sessionId = $request->session()->getId();

        // For Inertia external redirects, return 409 with X-Inertia-Location header
        if ($request->header('X-Inertia')) {
            $response = ResponseFacade::make('', 409, [
                'X-Inertia-Location' => $redirectUrl
            ]);

            // Manually set session cookie with explicit domain from config
            $response->withCookie(cookie(
                $sessionName,
                $sessionId,
                config('session.lifetime'),
                config('session.path'),
                config('session.domain'),
                config('session.secure'),
                config('session.http_only'),
                false,
                config('session.same_site')
            ));

            return $response;
        }

        // Fallback for non-Inertia requests
        return ResponseFacade::redirectTo($redirectUrl);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect to main domain landing page
        return redirect(config('app.url'));
    }
}
