import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger ***REMOVED*** from '@/components/ui/dropdown-menu';
import ***REMOVED*** useAppearance ***REMOVED*** from '@/hooks/use-appearance';
import ***REMOVED*** Monitor, Moon, Sun ***REMOVED*** from 'lucide-react';
import ***REMOVED*** HTMLAttributes ***REMOVED*** from 'react';

export default function AppearanceToggleDropdown(***REMOVED*** className = '', ...props ***REMOVED***: HTMLAttributes<HTMLDivElement>) ***REMOVED***
    const ***REMOVED*** appearance, updateAppearance ***REMOVED*** = useAppearance();

    const getCurrentIcon = () => ***REMOVED***
        switch (appearance) ***REMOVED***
            case 'dark':
                return <Moon className="h-5 w-5" />;
            case 'light':
                return <Sun className="h-5 w-5" />;
            default:
                return <Monitor className="h-5 w-5" />;
    ***REMOVED***
***REMOVED***;

    return (
        <div className=***REMOVED***className***REMOVED*** ***REMOVED***...props***REMOVED***>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                        ***REMOVED***getCurrentIcon()***REMOVED***
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick=***REMOVED***() => updateAppearance('light')***REMOVED***>
                        <span className="flex items-center gap-2">
                            <Sun className="h-5 w-5" />
                            Light
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick=***REMOVED***() => updateAppearance('dark')***REMOVED***>
                        <span className="flex items-center gap-2">
                            <Moon className="h-5 w-5" />
                            Dark
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick=***REMOVED***() => updateAppearance('system')***REMOVED***>
                        <span className="flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            System
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
***REMOVED***
