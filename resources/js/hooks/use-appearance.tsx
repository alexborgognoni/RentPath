import ***REMOVED*** useCallback, useEffect, useState ***REMOVED*** from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => ***REMOVED***
    if (typeof window === 'undefined') ***REMOVED***
        return false;
***REMOVED***

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
***REMOVED***;

const setCookie = (name: string, value: string, days = 365) => ***REMOVED***
    if (typeof document === 'undefined') ***REMOVED***
        return;
***REMOVED***

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `$***REMOVED***name***REMOVED***=$***REMOVED***value***REMOVED***;path=/;max-age=$***REMOVED***maxAge***REMOVED***;SameSite=Lax`;
***REMOVED***;

const applyTheme = (appearance: Appearance) => ***REMOVED***
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
***REMOVED***;

const mediaQuery = () => ***REMOVED***
    if (typeof window === 'undefined') ***REMOVED***
        return null;
***REMOVED***

    return window.matchMedia('(prefers-color-scheme: dark)');
***REMOVED***;

const handleSystemThemeChange = () => ***REMOVED***
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
***REMOVED***;

export function initializeTheme() ***REMOVED***
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';

    applyTheme(savedAppearance);

    // Add the event listener for system theme changes...
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
***REMOVED***

export function useAppearance() ***REMOVED***
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = useCallback((mode: Appearance) => ***REMOVED***
        setAppearance(mode);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
***REMOVED***, []);

    useEffect(() => ***REMOVED***
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');

        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
***REMOVED***, [updateAppearance]);

    return ***REMOVED*** appearance, updateAppearance ***REMOVED*** as const;
***REMOVED***
