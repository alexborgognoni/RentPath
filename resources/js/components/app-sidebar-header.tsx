import ***REMOVED*** Breadcrumbs ***REMOVED*** from '@/components/breadcrumbs';
import ***REMOVED*** SidebarTrigger ***REMOVED*** from '@/components/ui/sidebar';
import ***REMOVED*** type BreadcrumbItem as BreadcrumbItemType ***REMOVED*** from '@/types';

export function AppSidebarHeader(***REMOVED*** breadcrumbs = [] ***REMOVED***: ***REMOVED*** breadcrumbs?: BreadcrumbItemType[] ***REMOVED***) ***REMOVED***
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs=***REMOVED***breadcrumbs***REMOVED*** />
            </div>
        </header>
    );
***REMOVED***
