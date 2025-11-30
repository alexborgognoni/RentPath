<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\RedirectHelper;
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

        // Check if there's a redirect URL from form data or query parameter
        $redirect = $request->input('redirect') ?? $request->query('redirect');
        $userTypePreference = $request->input('userType', 'tenant');

        // Resolve the redirect URL using helper
        $redirectUrl = RedirectHelper::resolveRedirectUrl($redirect, $userTypePreference);

        \Log::info('Login redirect URL: '.$redirectUrl);
        \Log::info('Session ID: '.$request->session()->getId());

        $sessionName = config('session.cookie');
        $sessionId = $request->session()->getId();

        // For Inertia external redirects, return 409 with X-Inertia-Location header
        if ($request->header('X-Inertia')) {
            $response = ResponseFacade::make('', 409, [
                'X-Inertia-Location' => $redirectUrl,
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
        return ResponseFacade::make('', 302, [
            'Location' => $redirectUrl,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse|HttpResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $redirectUrl = config('app.url');

        // For Inertia requests (from manager subdomain), return 409 with X-Inertia-Location
        if ($request->header('X-Inertia')) {
            return ResponseFacade::make('', 409, [
                'X-Inertia-Location' => $redirectUrl,
            ]);
        }

        // For regular requests, use standard redirect
        return redirect()->away($redirectUrl);
    }
}
