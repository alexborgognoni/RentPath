import ***REMOVED*** Icon ***REMOVED*** from '@/components/icon';
import ***REMOVED*** SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem ***REMOVED*** from '@/components/ui/sidebar';
import ***REMOVED*** type NavItem ***REMOVED*** from '@/types';
import ***REMOVED*** type ComponentPropsWithoutRef ***REMOVED*** from 'react';

export function NavFooter(***REMOVED***
    items,
    className,
    ...props
***REMOVED***: ComponentPropsWithoutRef<typeof SidebarGroup> & ***REMOVED***
    items: NavItem[];
***REMOVED***) ***REMOVED***
    return (
        <SidebarGroup ***REMOVED***...props***REMOVED*** className=***REMOVED***`group-data-[collapsible=icon]:p-0 $***REMOVED***className || ''***REMOVED***`***REMOVED***>
            <SidebarGroupContent>
                <SidebarMenu>
                    ***REMOVED***items.map((item) => (
                        <SidebarMenuItem key=***REMOVED***item.title***REMOVED***>
                            <SidebarMenuButton
                                asChild
                                className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                <a href=***REMOVED***item.href***REMOVED*** target="_blank" rel="noopener noreferrer">
                                    ***REMOVED***item.icon && <Icon iconNode=***REMOVED***item.icon***REMOVED*** className="h-5 w-5" />***REMOVED***
                                    <span>***REMOVED***item.title***REMOVED***</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))***REMOVED***
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
***REMOVED***
