<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\RedirectHelper;
use App\Http\Controllers\Controller;
use App\Models\Lead;
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

        // Create a lead if user came from an invite token
        $this->createLeadFromSession($request, $user);

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

    /**
     * Create a Lead from session data if user came from an invite token.
     */
    private function createLeadFromSession(Request $request, User $user): void
    {
        $inviteTokenData = $request->session()->get('invite_token');

        if (! $inviteTokenData) {
            return;
        }

        // Check if lead already exists for this email + property
        $existingLead = Lead::where('property_id', $inviteTokenData['property_id'])
            ->where('email', $user->email)
            ->first();

        if ($existingLead) {
            // Link the existing lead to this user
            $existingLead->update([
                'user_id' => $user->id,
                'status' => Lead::STATUS_VIEWED,
                'viewed_at' => now(),
            ]);
        } else {
            // Create a new lead
            Lead::create([
                'property_id' => $inviteTokenData['property_id'],
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'token' => Lead::generateToken(),
                'source' => Lead::SOURCE_TOKEN_SIGNUP,
                'status' => Lead::STATUS_VIEWED,
                'user_id' => $user->id,
                'invite_token_id' => $inviteTokenData['token_id'],
                'viewed_at' => now(),
            ]);
        }

        // Clear the session data
        $request->session()->forget('invite_token');
    }
}
