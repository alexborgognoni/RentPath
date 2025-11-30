<?php

namespace App\Helpers;

class RedirectHelper
{
    /**
     * Resolve a redirect URL into a full redirect URL.
     *
     * Handles both relative paths and full URLs. For relative paths,
     * prepends the appropriate domain based on the user type.
     *
     * @param  string|null  $redirectPath  The redirect URL (relative path or full URL)
     * @param  string  $userType  The user type ('tenant' or 'property-manager')
     * @param  string|null  $fallbackPath  The fallback path if no redirect URL (default: '/dashboard')
     * @return string The full redirect URL
     */
    public static function resolveRedirectUrl(?string $redirectPath, string $userType, ?string $fallbackPath = '/dashboard'): string
    {
        // If no redirect URL, return default dashboard based on user type
        if (! $redirectPath) {
            return self::buildUrl($fallbackPath, $userType);
        }

        // If it's already a full URL, use as is
        if (filter_var($redirectPath, FILTER_VALIDATE_URL)) {
            return $redirectPath;
        }

        // It's a relative path - build full URL with appropriate domain
        return self::buildUrl($redirectPath, $userType);
    }

    /**
     * Build a full URL for the given path and user type.
     *
     * @param  string  $path  The relative path (must start with /)
     * @param  string  $userType  The user type ('tenant' or 'property-manager')
     * @return string The full URL
     */
    private static function buildUrl(string $path, string $userType): string
    {
        if ($userType === 'property-manager') {
            // Manager subdomain URL
            $managerUrl = config('app.env') === 'local'
                ? 'http://manager.'.parse_url(config('app.url'), PHP_URL_HOST).':'.parse_url(config('app.url'), PHP_URL_PORT)
                : 'https://manager.'.config('app.domain');

            return $managerUrl.$path;
        }

        // Tenant - use root domain
        return config('app.url').$path;
    }
}
