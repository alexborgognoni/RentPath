import ***REMOVED*** SidebarProvider ***REMOVED*** from '@/components/ui/sidebar';
import ***REMOVED*** SharedData ***REMOVED*** from '@/types';
import ***REMOVED*** usePage ***REMOVED*** from '@inertiajs/react';

interface AppShellProps ***REMOVED***
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
***REMOVED***

export function AppShell(***REMOVED*** children, variant = 'header' ***REMOVED***: AppShellProps) ***REMOVED***
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') ***REMOVED***
        return <div className="flex min-h-screen w-full flex-col">***REMOVED***children***REMOVED***</div>;
***REMOVED***

    return <SidebarProvider defaultOpen=***REMOVED***isOpen***REMOVED***>***REMOVED***children***REMOVED***</SidebarProvider>;
***REMOVED***
