<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $availableLocales = config('app.available_locales', ['en']);
        $fallbackLocale = config('app.fallback_locale', 'en');

        // If user has a preferred locale in session, use it
        if ($locale = Session::get('locale')) {
            App::setLocale($locale);
        } else {
            // Otherwise use browser's preferred language
            $browserLocale = $request->getPreferredLanguage($availableLocales);
            App::setLocale($browserLocale ?? $fallbackLocale);
        }

        return $next($request);
    }
}
