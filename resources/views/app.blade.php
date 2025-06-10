<!DOCTYPE html>
<html lang="***REMOVED******REMOVED*** str_replace('_', '-', app()->getLocale()) ***REMOVED******REMOVED***" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        ***REMOVED******REMOVED***-- Inline script to detect system dark mode preference and apply it immediately --***REMOVED******REMOVED***
        <script>
            (function() ***REMOVED***
                const appearance = '***REMOVED******REMOVED*** $appearance ?? "system" ***REMOVED******REMOVED***';

                if (appearance === 'system') ***REMOVED***
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) ***REMOVED***
                        document.documentElement.classList.add('dark');
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***)();
        </script>

        ***REMOVED******REMOVED***-- Inline style to set the HTML background color based on our theme in app.css --***REMOVED******REMOVED***
        <style>
            html ***REMOVED***
                background-color: oklch(1 0 0);
        ***REMOVED***

            html.dark ***REMOVED***
                background-color: oklch(0.145 0 0);
        ***REMOVED***
        </style>

        <title inertia>***REMOVED******REMOVED*** config('app.name', 'Laravel') ***REMOVED******REMOVED***</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/***REMOVED***$page['component']***REMOVED***.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
