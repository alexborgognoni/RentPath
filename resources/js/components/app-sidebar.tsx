import ***REMOVED*** NavFooter ***REMOVED*** from '@/components/nav-footer';
import ***REMOVED*** NavMain ***REMOVED*** from '@/components/nav-main';
import ***REMOVED*** NavUser ***REMOVED*** from '@/components/nav-user';
import ***REMOVED*** Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem ***REMOVED*** from '@/components/ui/sidebar';
import ***REMOVED*** type NavItem ***REMOVED*** from '@/types';
import ***REMOVED*** Link ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** ClipboardPen, House, LayoutGrid, Users ***REMOVED*** from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    ***REMOVED***
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutGrid,
***REMOVED***,
    ***REMOVED***
        title: 'Properties',
        href: '/dashboard/properties',
        icon: House,
***REMOVED***,
    ***REMOVED***
        title: 'Applications',
        href: '/dashboard/applications',
        icon: ClipboardPen,
***REMOVED***,
    ***REMOVED***
        title: 'Tenants',
        href: '/dashboard/tenants',
        icon: Users,
***REMOVED***,
];

const footerNavItems: NavItem[] = [
    // ***REMOVED***
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // ***REMOVED***,
    // ***REMOVED***
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // ***REMOVED***,
];

export function AppSidebar() ***REMOVED***
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items=***REMOVED***mainNavItems***REMOVED*** />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items=***REMOVED***footerNavItems***REMOVED*** className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
***REMOVED***
