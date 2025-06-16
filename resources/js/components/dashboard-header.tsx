import type React from 'react';

import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';

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
            <h1 className="text-xl font-semibold md:text-2xl">***REMOVED***title***REMOVED***</h1>
            ***REMOVED***actionButton && (
                <div className="ml-auto flex items-center gap-2">
                    <Button className="cursor-pointer" onClick=***REMOVED***actionButton.onClick***REMOVED***>
                        ***REMOVED***actionButton.icon && <span className="mr-2">***REMOVED***actionButton.icon***REMOVED***</span>***REMOVED***
                        ***REMOVED***actionButton.label***REMOVED***
                    </Button>
                </div>
            )***REMOVED***
        </header>
    );
***REMOVED***
