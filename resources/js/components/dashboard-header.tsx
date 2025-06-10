import type React from 'react';

import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** SidebarTrigger ***REMOVED*** from '@/components/ui/sidebar'; // [^1]

interface DashboardHeaderProps ***REMOVED***
    title: string;
    actionButton?: ***REMOVED***
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
***REMOVED***;
***REMOVED***

export function DashboardHeader(***REMOVED*** title, actionButton ***REMOVED***: DashboardHeaderProps) ***REMOVED***
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" /> ***REMOVED***/* [^1] Mobile trigger */***REMOVED***
            ***REMOVED***/* The following SheetTrigger is an alternative way to handle mobile sidebar if SidebarTrigger doesn't work as expected or for more control */***REMOVED***
            ***REMOVED***/* <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet> */***REMOVED***
            <h1 className="text-xl font-semibold md:text-2xl">***REMOVED***title***REMOVED***</h1>
            ***REMOVED***actionButton && (
                <div className="ml-auto flex items-center gap-2">
                    <Button onClick=***REMOVED***actionButton.onClick***REMOVED***>
                        ***REMOVED***actionButton.icon && <span className="mr-2">***REMOVED***actionButton.icon***REMOVED***</span>***REMOVED***
                        ***REMOVED***actionButton.label***REMOVED***
                    </Button>
                </div>
            )***REMOVED***
        </header>
    );
***REMOVED***
