import ***REMOVED*** SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem ***REMOVED*** from '@/components/ui/sidebar';
import ***REMOVED*** type NavItem ***REMOVED*** from '@/types';
import ***REMOVED*** Link, usePage ***REMOVED*** from '@inertiajs/react';

export function NavMain(***REMOVED*** items = [] ***REMOVED***: ***REMOVED*** items: NavItem[] ***REMOVED***) ***REMOVED***
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                ***REMOVED***items.map((item) => (
                    <SidebarMenuItem key=***REMOVED***item.title***REMOVED***>
                        <SidebarMenuButton asChild isActive=***REMOVED***page.url == item.href***REMOVED*** tooltip=***REMOVED******REMOVED*** children: item.title ***REMOVED******REMOVED***>
                            <Link href=***REMOVED***item.href***REMOVED*** prefetch>
                                ***REMOVED***item.icon && <item.icon />***REMOVED***
                                <span>***REMOVED***item.title***REMOVED***</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))***REMOVED***
            </SidebarMenu>
        </SidebarGroup>
    );
***REMOVED***
