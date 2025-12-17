<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application, which will be used when the
    | framework needs to place the application's name in a notification or
    | other UI elements where an application name needs to be displayed.
    |
    */

    'name' => env('APP_NAME', 'RentPath'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | URL Components
    |--------------------------------------------------------------------------
    |
    | Instead of a single APP_URL, we use separate components for consistent
    | URL generation across backend and frontend:
    | - url_scheme: http or https (for URL generation only, not actual encryption)
    | - domain: base domain (e.g., rentpath.app or rentpath.test)
    | - port: optional, only needed for local development (e.g., 8000)
    |
    | Note: APP_URL_SCHEME only affects generated URLs. Actual SSL/TLS encryption
    | is handled by your web server (nginx/Apache) or load balancer, not Laravel.
    |
    */

    'url_scheme' => env('APP_URL_SCHEME', 'https'),
    'domain' => env('APP_DOMAIN', 'localhost'),
    'port' => env('APP_PORT'),

    // Computed full URL for Laravel's internal use (Artisan commands, etc.)
    'url' => env('APP_URL_SCHEME', 'https').'://'.env('APP_DOMAIN', 'localhost').(env('APP_PORT') ? ':'.env('APP_PORT') : ''),

    /*
    |--------------------------------------------------------------------------
    | Manager Portal Subdomain
    |--------------------------------------------------------------------------
    |
    | The subdomain prefix for the property manager portal.
    | Full manager URL is computed from: {manager_subdomain}.{domain}:{port}
    |
    */

    'manager_subdomain' => env('MANAGER_SUBDOMAIN', 'manager'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. The timezone
    | is set to "UTC" by default as it is suitable for most use cases.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by Laravel's translation / localization methods. This option can be
    | set to any locale for which you plan to have translation strings.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    'available_locales' => ['en', 'fr', 'de', 'nl'],

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
