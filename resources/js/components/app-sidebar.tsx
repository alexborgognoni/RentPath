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
    onToggleCollapse: () => void;
}

export function AppSidebar({ isCollapsed, onToggleCollapse }: AppSidebarProps) {
    const page = usePage<SharedData>();
    const { auth, translations, locale } = page.props;

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

    const isPropertiesActive = currentPath.startsWith('/properties') || currentPath.startsWith('/property');

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
        <TooltipProvider delayDuration={0}>
            <aside className="flex h-full flex-col bg-card">
                {/* Header */}
                <div className="flex h-16 items-center justify-center border-b border-border px-4">
                    {isCollapsed ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={onToggleCollapse}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <PanelLeftOpen size={20} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Expand sidebar</TooltipContent>
                        </Tooltip>
                    ) : (
                        <div className="flex w-full items-center justify-between">
                            <Link href="/properties" className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                                    <Home size={18} className="text-white" />
                                </div>
                                <span className="text-lg font-bold text-foreground">RentPath</span>
                            </Link>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={onToggleCollapse}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                        <PanelLeftClose size={18} />
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
                        href="/properties"
                        icon={<Building2 size={18} />}
                        label={t(translations.sidebar, 'properties')}
                        isActive={isPropertiesActive}
                        isCollapsed={isCollapsed}
                    />
                </nav>

                {/* Settings Section */}
                <div className="border-t border-border px-3 py-4 space-y-1">
                    <NavItem
                        href="/settings"
                        icon={<Settings size={18} />}
                        label={t(translations.sidebar, 'settings')}
                        isActive={currentPath.startsWith('/settings')}
                        isCollapsed={isCollapsed}
                    />

                    {/* Language Selector */}
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                                    >
                                        <Globe size={18} />
                                        {!isCollapsed && (
                                            <span>
                                                {currentLang.flag} {currentLang.name}
                                            </span>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right">{t(translations.sidebar, 'language')}</TooltipContent>
                            )}
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
                <div className="border-t border-border p-4">
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${isCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
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
                                                <div className="flex-1 text-left">
                                                    {auth.user?.name && (
                                                        <p className="truncate text-sm font-medium text-foreground">{auth.user.name}</p>
                                                    )}
                                                    <p className="truncate text-xs text-muted-foreground">{auth.user?.email}</p>
                                                </div>
                                                <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                                            </>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right">
                                    {auth.user?.name || auth.user?.email}
                                </TooltipContent>
                            )}
                        </Tooltip>
                        <DropdownMenuContent side="right" align="end" className="w-56">
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
                                        <Settings size={16} />
                                        <span>{t(translations.sidebar, 'settings')}</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                                <LogOut size={16} />
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
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                >
                    {icon}
                    {!isCollapsed && <span>{label}</span>}
                </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
    );
}
