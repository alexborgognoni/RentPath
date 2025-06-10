import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** type ReactNode ***REMOVED*** from 'react';

interface AppLayoutProps ***REMOVED***
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
***REMOVED***

export default (***REMOVED*** children, breadcrumbs, ...props ***REMOVED***: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs=***REMOVED***breadcrumbs***REMOVED*** ***REMOVED***...props***REMOVED***>
        ***REMOVED***children***REMOVED***
    </AppLayoutTemplate>
);
