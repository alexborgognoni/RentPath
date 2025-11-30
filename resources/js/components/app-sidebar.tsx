import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import type { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Building2, ChevronsUpDown, Globe, Home, LogOut, Settings } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { auth, translations, locale } = page.props;
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

    const isPropertiesActive = currentPath === '/dashboard' || currentPath.startsWith('/properties') || currentPath.startsWith('/property');

    const getUserInitials = () => {
        if (auth.user?.name) {
            return auth.user.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        }
        if (auth.user?.email) return auth.user.email[0].toUpperCase();
        return 'U';
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleLanguageChange = async (langCode: string) => {
        try {
            await axios.post('/locale', { locale: langCode });
            window.location.reload();
        } catch (err) {
            console.error('Failed to change language', err);
        }
    };

    return (
        <Sidebar collapsible="icon">
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                                    <Home size={18} className="text-white" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">RentPath</span>
                                    <span className="text-xs text-muted-foreground">{t(translations.sidebar, 'managerPortal')}</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t(translations.sidebar, 'navigation')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isPropertiesActive} tooltip={t(translations.sidebar, 'properties')}>
                                    <Link href="/dashboard">
                                        <Building2 />
                                        <span>{t(translations.sidebar, 'properties')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Settings Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>{t(translations.sidebar, 'preferences')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={currentPath.startsWith('/settings')} tooltip={t(translations.sidebar, 'settings')}>
                                    <Link href="/settings">
                                        <Settings />
                                        <span>{t(translations.sidebar, 'settings')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Language Selector */}
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton tooltip={t(translations.sidebar, 'language')}>
                                            <Globe />
                                            <span>
                                                {currentLang.flag} {currentLang.name}
                                            </span>
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side={isCollapsed ? 'right' : 'top'} align="start" className="w-48">
                                        <DropdownMenuLabel>{t(translations.sidebar, 'selectLanguage')}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {languages.map((lang) => (
                                            <DropdownMenuItem
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={locale === lang.code ? 'bg-accent' : ''}
                                            >
                                                <span className="mr-2">{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* User Footer */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    tooltip={auth.user?.name || auth.user?.email || t(translations.sidebar, 'account')}
                                >
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
                                        {auth.user?.property_manager?.profile_picture_url ? (
                                            <img
                                                src={auth.user.property_manager.profile_picture_url}
                                                alt={auth.user?.name || auth.user?.email}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-white">{getUserInitials()}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-0.5 leading-none text-left">
                                        {auth.user?.name && <span className="font-medium truncate">{auth.user.name}</span>}
                                        <span className="text-xs text-muted-foreground truncate">{auth.user?.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side={isCollapsed ? 'right' : 'top'} align="start" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        {auth.user?.name && <span className="font-medium">{auth.user.name}</span>}
                                        <span className="text-xs text-muted-foreground font-normal">{auth.user?.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings">
                                            <Settings />
                                            <span>{t(translations.sidebar, 'settings')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                                    <LogOut />
                                    <span>{t(translations.sidebar, 'signOut')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
