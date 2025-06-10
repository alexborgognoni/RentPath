import ***REMOVED*** Appearance, useAppearance ***REMOVED*** from '@/hooks/use-appearance';
import ***REMOVED*** cn ***REMOVED*** from '@/lib/utils';
import ***REMOVED*** LucideIcon, Monitor, Moon, Sun ***REMOVED*** from 'lucide-react';
import ***REMOVED*** HTMLAttributes ***REMOVED*** from 'react';

export default function AppearanceToggleTab(***REMOVED*** className = '', ...props ***REMOVED***: HTMLAttributes<HTMLDivElement>) ***REMOVED***
    const ***REMOVED*** appearance, updateAppearance ***REMOVED*** = useAppearance();

    const tabs: ***REMOVED*** value: Appearance; icon: LucideIcon; label: string ***REMOVED***[] = [
        ***REMOVED*** value: 'light', icon: Sun, label: 'Light' ***REMOVED***,
        ***REMOVED*** value: 'dark', icon: Moon, label: 'Dark' ***REMOVED***,
        ***REMOVED*** value: 'system', icon: Monitor, label: 'System' ***REMOVED***,
    ];

    return (
        <div className=***REMOVED***cn('inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)***REMOVED*** ***REMOVED***...props***REMOVED***>
            ***REMOVED***tabs.map((***REMOVED*** value, icon: Icon, label ***REMOVED***) => (
                <button
                    key=***REMOVED***value***REMOVED***
                    onClick=***REMOVED***() => updateAppearance(value)***REMOVED***
                    className=***REMOVED***cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )***REMOVED***
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">***REMOVED***label***REMOVED***</span>
                </button>
            ))***REMOVED***
        </div>
    );
***REMOVED***
