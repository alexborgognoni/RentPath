<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubdomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $expectedSubdomain): Response
    {
        // Get host without port
        $host = $request->getHost();
        $baseDomain = config('app.domain');

        // Build the expected domain based on the subdomain parameter
        if ($expectedSubdomain === '') {
            // Expecting main domain (no subdomain)
            $expectedHost = $baseDomain;
        } else {
            // Expecting a subdomain (e.g., manager.example.com or manager.app.example.com)
            $expectedHost = $expectedSubdomain . '.' . $baseDomain;
        }

        // Compare actual host against expected host (getHost() already strips port)
        if ($host !== $expectedHost) {
            abort(404);
        }

        return $next($request);
    }
}
