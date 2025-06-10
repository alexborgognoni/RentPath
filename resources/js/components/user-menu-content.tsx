import ***REMOVED*** DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator ***REMOVED*** from '@/components/ui/dropdown-menu';
import ***REMOVED*** UserInfo ***REMOVED*** from '@/components/user-info';
import ***REMOVED*** useMobileNavigation ***REMOVED*** from '@/hooks/use-mobile-navigation';
import ***REMOVED*** type User ***REMOVED*** from '@/types';
import ***REMOVED*** Link, router ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** LogOut, Settings ***REMOVED*** from 'lucide-react';

interface UserMenuContentProps ***REMOVED***
    user: User;
***REMOVED***

export function UserMenuContent(***REMOVED*** user ***REMOVED***: UserMenuContentProps) ***REMOVED***
    const cleanup = useMobileNavigation();

    const handleLogout = () => ***REMOVED***
        cleanup();
        router.flushAll();
***REMOVED***;

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user=***REMOVED***user***REMOVED*** showEmail=***REMOVED***true***REMOVED*** />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href=***REMOVED***route('profile.edit')***REMOVED*** as="button" prefetch onClick=***REMOVED***cleanup***REMOVED***>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href=***REMOVED***route('logout')***REMOVED*** as="button" onClick=***REMOVED***handleLogout***REMOVED***>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
***REMOVED***
