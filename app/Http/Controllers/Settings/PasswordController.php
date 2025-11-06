<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(Request $request): Response
    {
        // Determine which settings view to render based on subdomain
        $subdomain = $this->getCurrentSubdomain($request);
        $view = $subdomain === 'manager' ? 'settings/password' : 'tenant/settings/password';

        return Inertia::render($view);
    }

    /**
     * Get current subdomain from request
     */
    private function getCurrentSubdomain(Request $request): string
    {
        $host = $request->getHost();
        $baseDomain = config('app.domain');
        $managerDomain = env('MANAGER_SUBDOMAIN', 'manager') . '.' . $baseDomain;

        if ($host === $managerDomain) {
            return 'manager';
        }

        return 'tenant';
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
