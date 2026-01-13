<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
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
                'common' => trans('common'),
                'statuses' => trans('statuses'),
                'settings' => trans('settings'),
                'auth' => [
                    'common' => trans('auth/common'),
                    'login' => trans('auth/login'),
                    'register' => trans('auth/register'),
                    'forgotPassword' => trans('auth/forgot-password'),
                ],
                'manager' => [
                    'properties' => trans('manager/properties'),
                    'applications' => trans('manager/applications'),
                    'leads' => trans('manager/leads'),
                    'profile' => trans('manager/profile'),
                ],
                'tenant' => [
                    'common' => trans('tenant/common'),
                    'dashboard' => trans('tenant/dashboard'),
                    'applications' => trans('tenant/applications'),
                    'profile' => trans('tenant/profile'),
                    'properties' => trans('tenant/properties'),
                ],
                'public' => [
                    'landing' => trans('public/landing'),
                    'contactUs' => trans('public/contact-us'),
                    'privacyPolicy' => trans('public/privacy-policy'),
                    'termsOfUse' => trans('public/terms-of-use'),
                ],
                'layout' => [
                    'header' => trans('layout/header'),
                    'sidebar' => trans('layout/sidebar'),
                    'cookieBanner' => trans('layout/cookie-banner'),
                ],
                'wizard' => [
                    'common' => trans('wizard/common'),
                    'property' => trans('wizard/property'),
                    'application' => trans('wizard/application'),
                ],
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'unreadMessages' => fn () => $request->user()
                ? Conversation::where('participant_type', 'tenant')
                    ->where('participant_id', $request->user()->id)
                    ->whereNotNull('last_message_at')
                    ->where(function ($q) {
                        $q->whereNull('participant_last_read_at')
                            ->orWhereColumn('last_message_at', '>', 'participant_last_read_at');
                    })
                    ->count()
                : 0,
        ];
    }
}
