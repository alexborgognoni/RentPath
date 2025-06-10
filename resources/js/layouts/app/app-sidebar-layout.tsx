import ***REMOVED*** AppContent ***REMOVED*** from '@/components/app-content';
import ***REMOVED*** AppShell ***REMOVED*** from '@/components/app-shell';
import ***REMOVED*** AppSidebar ***REMOVED*** from '@/components/app-sidebar';
import ***REMOVED*** AppSidebarHeader ***REMOVED*** from '@/components/app-sidebar-header';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** type PropsWithChildren ***REMOVED*** from 'react';

export default function AppSidebarLayout(***REMOVED*** children, breadcrumbs = [] ***REMOVED***: PropsWithChildren<***REMOVED*** breadcrumbs?: BreadcrumbItem[] ***REMOVED***>) ***REMOVED***
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs=***REMOVED***breadcrumbs***REMOVED*** />
                ***REMOVED***children***REMOVED***
            </AppContent>
        </AppShell>
    );
***REMOVED***
