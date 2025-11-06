<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if (!$request->expectsJson()) {
            // Always redirect to root domain login page, regardless of subdomain
            return config('app.url') . '/login?intended=' . urlencode($request->fullUrl());
        }

        return null;
    }
}
