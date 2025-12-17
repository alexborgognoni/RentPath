<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Determine current subdomain from request
        $host = $request->getHost();
        $baseDomain = config('app.domain');
        $subdomain = str_ends_with($host, $baseDomain) && $host !== $baseDomain
            ? str_replace('.'.$baseDomain, '', $host)
            : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user()?->load('propertyManager'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'subdomain' => $subdomain,
            'managerSubdomain' => config('app.manager_subdomain'),
            'appUrlScheme' => config('app.url_scheme'),
            'appDomain' => config('app.domain'),
            'appPort' => config('app.port'),
            'locale' => app()->getLocale(),
            'translations' => [
                'cookie-banner' => trans('cookie-banner'),
                'auth' => trans('auth'),
                'header' => trans('header'),
                'profile' => trans('profile'),
                'settings' => trans('settings'),
                'landing' => trans('landing'),
                'contact-us' => trans('contact-us'),
                'privacy-policy' => trans('privacy-policy'),
                'terms-of-use' => trans('terms-of-use'),
                'properties' => trans('properties'),
                'tenant' => trans('tenant'),
                'sidebar' => trans('sidebar'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
