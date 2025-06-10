import '../css/app.css';

import ***REMOVED*** createInertiaApp ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** resolvePageComponent ***REMOVED*** from 'laravel-vite-plugin/inertia-helpers';
import ***REMOVED*** createRoot ***REMOVED*** from 'react-dom/client';
import ***REMOVED*** initializeTheme ***REMOVED*** from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp(***REMOVED***
    title: (title) => `$***REMOVED***title***REMOVED*** - $***REMOVED***appName***REMOVED***`,
    resolve: (name) => resolvePageComponent(`./pages/$***REMOVED***name***REMOVED***.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup(***REMOVED*** el, App, props ***REMOVED***) ***REMOVED***
        const root = createRoot(el);

        root.render(<App ***REMOVED***...props***REMOVED*** />);
***REMOVED***,
    progress: ***REMOVED***
        color: '#4B5563',
***REMOVED***,
***REMOVED***);

// This will set light / dark mode on load...
initializeTheme();
