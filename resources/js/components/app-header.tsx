import ***REMOVED*** Breadcrumbs ***REMOVED*** from '@/components/breadcrumbs';
import ***REMOVED*** Icon ***REMOVED*** from '@/components/icon';
import ***REMOVED*** Avatar, AvatarFallback, AvatarImage ***REMOVED*** from '@/components/ui/avatar';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** DropdownMenu, DropdownMenuContent, DropdownMenuTrigger ***REMOVED*** from '@/components/ui/dropdown-menu';
import ***REMOVED*** NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle ***REMOVED*** from '@/components/ui/navigation-menu';
import ***REMOVED*** Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger ***REMOVED*** from '@/components/ui/sheet';
import ***REMOVED*** Tooltip, TooltipContent, TooltipProvider, TooltipTrigger ***REMOVED*** from '@/components/ui/tooltip';
import ***REMOVED*** UserMenuContent ***REMOVED*** from '@/components/user-menu-content';
import ***REMOVED*** useInitials ***REMOVED*** from '@/hooks/use-initials';
import ***REMOVED*** cn ***REMOVED*** from '@/lib/utils';
import ***REMOVED*** type BreadcrumbItem, type NavItem, type SharedData ***REMOVED*** from '@/types';
import ***REMOVED*** Link, usePage ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** BookOpen, Folder, LayoutGrid, Menu, Search ***REMOVED*** from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    ***REMOVED***
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
***REMOVED***,
];

const rightNavItems: NavItem[] = [
    ***REMOVED***
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
***REMOVED***,
    ***REMOVED***
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
***REMOVED***,
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps ***REMOVED***
    breadcrumbs?: BreadcrumbItem[];
***REMOVED***

export function AppHeader(***REMOVED*** breadcrumbs = [] ***REMOVED***: AppHeaderProps) ***REMOVED***
    const page = usePage<SharedData>();
    const ***REMOVED*** auth ***REMOVED*** = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    ***REMOVED***/* Mobile Menu */***REMOVED***
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            ***REMOVED***mainNavItems.map((item) => (
                                                <Link key=***REMOVED***item.title***REMOVED*** href=***REMOVED***item.href***REMOVED*** className="flex items-center space-x-2 font-medium">
                                                    ***REMOVED***item.icon && <Icon iconNode=***REMOVED***item.icon***REMOVED*** className="h-5 w-5" />***REMOVED***
                                                    <span>***REMOVED***item.title***REMOVED***</span>
                                                </Link>
                                            ))***REMOVED***
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            ***REMOVED***rightNavItems.map((item) => (
                                                <a
                                                    key=***REMOVED***item.title***REMOVED***
                                                    href=***REMOVED***item.href***REMOVED***
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    ***REMOVED***item.icon && <Icon iconNode=***REMOVED***item.icon***REMOVED*** className="h-5 w-5" />***REMOVED***
                                                    <span>***REMOVED***item.title***REMOVED***</span>
                                                </a>
                                            ))***REMOVED***
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/dashboard" prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    ***REMOVED***/* Desktop Navigation */***REMOVED***
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                ***REMOVED***mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key=***REMOVED***index***REMOVED*** className="relative flex h-full items-center">
                                        <Link
                                            href=***REMOVED***item.href***REMOVED***
                                            className=***REMOVED***cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )***REMOVED***
                                        >
                                            ***REMOVED***item.icon && <Icon iconNode=***REMOVED***item.icon***REMOVED*** className="mr-2 h-4 w-4" />***REMOVED***
                                            ***REMOVED***item.title***REMOVED***
                                        </Link>
                                        ***REMOVED***page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )***REMOVED***
                                    </NavigationMenuItem>
                                ))***REMOVED***
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                            <div className="hidden lg:flex">
                                ***REMOVED***rightNavItems.map((item) => (
                                    <TooltipProvider key=***REMOVED***item.title***REMOVED*** delayDuration=***REMOVED***0***REMOVED***>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <a
                                                    href=***REMOVED***item.href***REMOVED***
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                >
                                                    <span className="sr-only">***REMOVED***item.title***REMOVED***</span>
                                                    ***REMOVED***item.icon && <Icon iconNode=***REMOVED***item.icon***REMOVED*** className="size-5 opacity-80 group-hover:opacity-100" />***REMOVED***
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>***REMOVED***item.title***REMOVED***</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))***REMOVED***
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src=***REMOVED***auth.user.avatar***REMOVED*** alt=***REMOVED***auth.user.name***REMOVED*** />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            ***REMOVED***getInitials(auth.user.name)***REMOVED***
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user=***REMOVED***auth.user***REMOVED*** />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            ***REMOVED***breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs=***REMOVED***breadcrumbs***REMOVED*** />
                    </div>
                </div>
            )***REMOVED***
        </>
    );
***REMOVED***
