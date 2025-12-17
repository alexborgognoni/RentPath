import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

createInertiaApp({
    title: (title) => {
        // App name comes from Inertia props, set in setup() below
        const appName = (window as unknown as { appName?: string }).appName || 'RentPath';
        return title ? `${title} - ${appName}` : appName;
    },
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        // Make Ziggy config and app name available globally
        const pageProps = props.initialPage.props as { ziggy?: object; name?: string };
        if (pageProps.ziggy) {
            (window as unknown as { Ziggy: object }).Ziggy = pageProps.ziggy;
        }
        if (pageProps.name) {
            (window as unknown as { appName: string }).appName = pageProps.name;
        }

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
