import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { SharedData } from '@/types';
import { route, settingsRoute } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Building2, ChevronsUpDown, Globe, Home, LogOut, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

interface AppSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
    const { auth, translations, locale } = usePage<SharedData>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentLang = languages.find((l) => l.code === locale) || languages[0];

    const isPropertiesActive = currentPath.startsWith('/properties') || currentPath.startsWith('/property');
    const isSettingsActive = currentPath.startsWith('/settings');

    const getUserInitials = () => {
        if (auth.user?.name) {
            return auth.user.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        }
        return auth.user?.email?.[0].toUpperCase() || 'U';
    };

    const handleLogout = () => router.post(route('manager.logout'));

    const handleLanguageChange = async (code: string) => {
        try {
            await axios.post(route('locale.update'), { locale: code });
            window.location.reload();
        } catch (err) {
            console.error('Failed to change language', err);
        }
    };

    return (
        <TooltipProvider delayDuration={0}>
            <aside className="flex h-full w-full flex-col bg-card">
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-center border-b border-border px-3">
                    {isCollapsed ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={onToggle}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <PanelLeftOpen className="h-5 w-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Expand sidebar</TooltipContent>
                        </Tooltip>
                    ) : (
                        <div className="flex w-full items-center justify-between">
                            <Link href={route('manager.properties.index')} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                                    <Home className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-foreground">RentPath</span>
                            </Link>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={onToggle}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        <PanelLeftClose className="h-5 w-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Collapse sidebar</TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    <NavItem
                        href={route('manager.properties.index')}
                        icon={<Building2 className="h-5 w-5" />}
                        label={t(translations.sidebar, 'properties')}
                        isActive={isPropertiesActive}
                        isCollapsed={isCollapsed}
                    />
                </nav>

                {/* Settings Section */}
                <div className="space-y-1 border-t border-border px-3 py-4">
                    <NavItem
                        href={settingsRoute('profile')}
                        icon={<Settings className="h-5 w-5" />}
                        label={t(translations.sidebar, 'settings')}
                        isActive={isSettingsActive}
                        isCollapsed={isCollapsed}
                    />

                    {/* Language Selector */}
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex h-10 w-full items-center rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground ${
                                            isCollapsed ? 'justify-center' : 'gap-3 px-3'
                                        }`}
                                    >
                                        <Globe className="h-5 w-5 shrink-0" />
                                        {!isCollapsed && (
                                            <span>
                                                {currentLang.flag} {currentLang.name}
                                            </span>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">{t(translations.sidebar, 'language')}</TooltipContent>}
                        </Tooltip>
                        <DropdownMenuContent side="right" align="start" className="w-48">
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
                </div>

                {/* User Section */}
                <div className="border-t border-border p-3">
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex w-full items-center rounded-lg text-sm hover:bg-muted ${
                                            isCollapsed ? 'h-10 justify-center' : 'h-12 gap-3 px-2'
                                        }`}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
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
                                        {!isCollapsed && (
                                            <>
                                                <div className="min-w-0 flex-1 text-left">
                                                    {auth.user?.name && (
                                                        <p className="truncate text-sm font-medium text-foreground">{auth.user.name}</p>
                                                    )}
                                                    <p className="truncate text-xs text-muted-foreground">{auth.user?.email}</p>
                                                </div>
                                                <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            </>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">{auth.user?.name || auth.user?.email}</TooltipContent>}
                        </Tooltip>
                        <DropdownMenuContent side="right" align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    {auth.user?.name && <span className="font-medium">{auth.user.name}</span>}
                                    <span className="text-xs font-normal text-muted-foreground">{auth.user?.email}</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href={settingsRoute('profile')}>
                                        <Settings className="h-4 w-4" />
                                        <span>{t(translations.sidebar, 'settings')}</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                <span>{t(translations.sidebar, 'signOut')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
        </TooltipProvider>
    );
}

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isCollapsed: boolean;
}

function NavItem({ href, icon, label, isActive, isCollapsed }: NavItemProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={href}
                    className={`flex h-10 items-center rounded-lg text-sm font-medium ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${isCollapsed ? 'justify-center' : 'gap-3 px-3'}`}
                >
                    <span className="shrink-0">{icon}</span>
                    {!isCollapsed && <span>{label}</span>}
                </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
    );
}
