import ***REMOVED*** SidebarInset ***REMOVED*** from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> ***REMOVED***
    variant?: 'header' | 'sidebar';
***REMOVED***

export function AppContent(***REMOVED*** variant = 'header', children, ...props ***REMOVED***: AppContentProps) ***REMOVED***
    if (variant === 'sidebar') ***REMOVED***
        return <SidebarInset ***REMOVED***...props***REMOVED***>***REMOVED***children***REMOVED***</SidebarInset>;
***REMOVED***

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" ***REMOVED***...props***REMOVED***>
            ***REMOVED***children***REMOVED***
        </main>
    );
***REMOVED***
