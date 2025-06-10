import ***REMOVED*** Avatar, AvatarFallback, AvatarImage ***REMOVED*** from '@/components/ui/avatar';
import ***REMOVED*** useInitials ***REMOVED*** from '@/hooks/use-initials';
import ***REMOVED*** type User ***REMOVED*** from '@/types';

export function UserInfo(***REMOVED*** user, showEmail = false ***REMOVED***: ***REMOVED*** user: User; showEmail?: boolean ***REMOVED***) ***REMOVED***
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src=***REMOVED***user.avatar***REMOVED*** alt=***REMOVED***user.name***REMOVED*** />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    ***REMOVED***getInitials(user.name)***REMOVED***
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">***REMOVED***user.name***REMOVED***</span>
                ***REMOVED***showEmail && <span className="truncate text-xs text-muted-foreground">***REMOVED***user.email***REMOVED***</span>***REMOVED***
            </div>
        </>
    );
***REMOVED***
