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
        // If user has a preferred locale in session, use it
        if ($locale = Session::get('locale')) {
            App::setLocale($locale);
        } else {
            // Otherwise use browser's preferred language
            $browserLocale = $request->getPreferredLanguage(['en', 'fr', 'de', 'nl']);
            App::setLocale($browserLocale ?? 'en');
        }

        return $next($request);
    }
}
