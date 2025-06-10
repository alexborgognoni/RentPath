import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import ***REMOVED*** resolve ***REMOVED*** from 'node:path';
import ***REMOVED*** defineConfig ***REMOVED*** from 'vite';

export default defineConfig(***REMOVED***
    plugins: [
        laravel(***REMOVED***
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
    ***REMOVED***),
        react(),
        tailwindcss(),
    ],
    esbuild: ***REMOVED***
        jsx: 'automatic',
***REMOVED***,
    resolve: ***REMOVED***
        alias: ***REMOVED***
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
    ***REMOVED***,
***REMOVED***,
***REMOVED***);
