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
        $parts = explode('.', $host);

        // Determine current subdomain
        // For rentpath.test (2 parts) = no subdomain
        // For manager.rentpath.test (3 parts) = subdomain is 'manager'
        // For localhost (1 part) = no subdomain
        $currentSubdomain = '';
        if (count($parts) > 2 && $parts[0] !== 'www') {
            $currentSubdomain = $parts[0];
        }

        // Check if we're on the expected subdomain
        // Empty string means main domain (no subdomain)
        if ($currentSubdomain !== $expectedSubdomain) {
            abort(404);
        }

        return $next($request);
    }
}
