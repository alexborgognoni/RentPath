import ***REMOVED*** AppContent ***REMOVED*** from '@/components/app-content';
import ***REMOVED*** AppHeader ***REMOVED*** from '@/components/app-header';
import ***REMOVED*** AppShell ***REMOVED*** from '@/components/app-shell';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import type ***REMOVED*** PropsWithChildren ***REMOVED*** from 'react';

export default function AppHeaderLayout(***REMOVED*** children, breadcrumbs ***REMOVED***: PropsWithChildren<***REMOVED*** breadcrumbs?: BreadcrumbItem[] ***REMOVED***>) ***REMOVED***
    return (
        <AppShell>
            <AppHeader breadcrumbs=***REMOVED***breadcrumbs***REMOVED*** />
            <AppContent>***REMOVED***children***REMOVED***</AppContent>
        </AppShell>
    );
***REMOVED***
