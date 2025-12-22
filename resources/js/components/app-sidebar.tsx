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
import { currencies, getCurrencyFromStorage, setCurrencyInStorage, type CurrencyCode } from '@/utils/currency-utils';
import { route } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Building2,
    ChevronsUpDown,
    CircleDollarSign,
    FileText,
    Globe,
    Home,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const { auth, translations, locale, subdomain, managerSubdomain } = usePage<SharedData>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentLang = languages.find((l) => l.code === locale) || languages[0];

    // Currency state
    const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => getCurrencyFromStorage());
    const currentCurrencyData = currencies.find((c) => c.code === currentCurrency) || currencies[0];

    useEffect(() => {
        const handleCurrencyChange = (event: Event) => {
            const customEvent = event as CustomEvent<CurrencyCode>;
            setCurrentCurrency(customEvent.detail);
        };

        window.addEventListener('currencyChange', handleCurrencyChange);
        return () => window.removeEventListener('currencyChange', handleCurrencyChange);
    }, []);

    const isPropertiesActive = currentPath.startsWith('/properties') || currentPath.startsWith('/property');
    const isApplicationsActive = currentPath.startsWith('/applications');
    const isLeadsActive = currentPath.startsWith('/leads');

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

    const handleCurrencyChange = (code: CurrencyCode) => {
        setCurrencyInStorage(code);
        setCurrentCurrency(code);
        window.dispatchEvent(new CustomEvent<CurrencyCode>('currencyChange', { detail: code }));
    };

    const handleLanguageChange = async (code: string) => {
        try {
            // Use correct route based on subdomain - all values from backend config
            const localeRoute = subdomain === managerSubdomain ? `${managerSubdomain}.locale.update` : 'locale.update';
            await axios.post(route(localeRoute), { locale: code });
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
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <PanelLeftOpen className="h-5 w-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{t(translations.sidebar, 'expandSidebar')}</TooltipContent>
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
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        <PanelLeftClose className="h-5 w-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">{t(translations.sidebar, 'collapseSidebar')}</TooltipContent>
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
                    <NavItem
                        href={route('manager.applications.index')}
                        icon={<FileText className="h-5 w-5" />}
                        label={t(translations.sidebar, 'applications')}
                        isActive={isApplicationsActive}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        href={route('manager.leads.index')}
                        icon={<Users className="h-5 w-5" />}
                        label={t(translations.sidebar, 'leads')}
                        isActive={isLeadsActive}
                        isCollapsed={isCollapsed}
                    />
                </nav>

                {/* Currency, Language & Settings Section */}
                <div className="space-y-1 border-t border-border px-3 py-4">
                    {/* Currency Selector */}
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex h-10 w-full cursor-pointer items-center rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground ${
                                            isCollapsed ? 'justify-center' : 'gap-3 px-3'
                                        }`}
                                    >
                                        <CircleDollarSign className="h-5 w-5 shrink-0" />
                                        {!isCollapsed && (
                                            <span>
                                                {currentCurrencyData.flag} {currentCurrencyData.code}
                                            </span>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">{t(translations.sidebar, 'currency')}</TooltipContent>}
                        </Tooltip>
                        <DropdownMenuContent side="right" align="start" className="w-48">
                            <DropdownMenuLabel>{t(translations.sidebar, 'selectCurrency')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {currencies.map((currency) => (
                                <DropdownMenuItem
                                    key={currency.code}
                                    onClick={() => handleCurrencyChange(currency.code)}
                                    className={currentCurrency === currency.code ? 'bg-accent' : ''}
                                >
                                    <span className="mr-2">{currency.flag}</span>
                                    <span>{currency.code}</span>
                                    <span className="ml-auto text-xs text-muted-foreground">{currency.symbol}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Language Selector */}
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex h-10 w-full cursor-pointer items-center rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground ${
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

                    {/* Settings button - placeholder for future implementation */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className={`flex h-10 w-full cursor-pointer items-center rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground ${
                                    isCollapsed ? 'justify-center' : 'gap-3 px-3'
                                }`}
                            >
                                <Settings className="h-5 w-5 shrink-0" />
                                {!isCollapsed && <span>{t(translations.sidebar, 'settings')}</span>}
                            </button>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">{t(translations.sidebar, 'settings')}</TooltipContent>}
                    </Tooltip>
                </div>

                {/* User Section */}
                <div className="border-t border-border p-3">
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`flex w-full cursor-pointer items-center rounded-lg text-sm hover:bg-muted ${
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
                                <DropdownMenuItem>
                                    <Settings className="h-4 w-4" />
                                    <span>{t(translations.sidebar, 'settings')}</span>
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
