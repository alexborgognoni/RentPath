import { TenantNavMobile } from '@/components/navigation/tenant-nav';
import { Button } from '@/components/ui/button';
import { LogoutConfirmationPopover } from '@/components/user/logout-confirmation-popover';
import { SharedData } from '@/types';
import { currencies, getCurrency, getCurrencyFromStorage, setCurrencyInStorage, type Currency, type CurrencyCode } from '@/utils/currency-utils';
import { isManagerSubdomain, route, settingsRoute } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Building2, ChevronDown, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

interface MobileMenuProps {
    getUserInitials: (user: { name?: string; email?: string }) => string;
}

export function MobileMenu({ getUserInitials }: MobileMenuProps) {
    const page = usePage<SharedData>();
    const { auth, translations, locale, subdomain, managerSubdomain, unreadMessages } = page.props;
    const isTenantPortal = !isManagerSubdomain(subdomain, managerSubdomain);
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('EUR');
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        setCurrentCurrency(getCurrencyFromStorage());

        const handleCurrencyChange = (event: CustomEvent<CurrencyCode>) => {
            setCurrentCurrency(event.detail);
        };

        window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
        return () => window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    }, []);

    const currentLang = languages.find((lang) => lang.code === locale);
    const currentCurrencyData: Currency | undefined = getCurrency(currentCurrency);

    const handleLogoutClick = () => {
        setIsOpen(false);
        setShowLogoutConfirmation(true);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutConfirmation(false);
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirmation(false);
    };

    const handleLanguageChange = async (langCode: string) => {
        try {
            await axios.post(route('locale.update'), { locale: langCode });
            window.location.reload();
        } catch (err) {
            console.error('Failed to change language', err);
        }
        setLanguageDropdownOpen(false);
    };

    const handleCurrencyChange = (currencyCode: CurrencyCode) => {
        setCurrencyInStorage(currencyCode);
        setCurrentCurrency(currencyCode);
        setCurrencyDropdownOpen(false);
        window.dispatchEvent(new CustomEvent<CurrencyCode>('currencyChange', { detail: currencyCode }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setLanguageDropdownOpen(false);
            }
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
                setCurrencyDropdownOpen(false);
            }
        };

        const handleScroll = () => {
            setIsOpen(false);
            setLanguageDropdownOpen(false);
            setCurrencyDropdownOpen(false);
        };

        if (isOpen || languageDropdownOpen || currencyDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', handleScroll, true);
        }

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
            document.body.style.overflow = '';
        };
    }, [isOpen, languageDropdownOpen, currencyDropdownOpen]);

    const menuContent = (
        <>
            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

            {/* Slide-in menu */}
            <div
                ref={menuRef}
                className={`fixed top-0 right-0 z-50 h-full w-72 border-l border-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-4">
                        <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-text-secondary hover:text-text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-background"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col overflow-y-auto p-4">
                        <div className="flex-1 space-y-6">
                            {/* User Profile Section */}
                            {auth.user && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-gradient-to-br from-primary to-secondary shadow-md">
                                            {auth.user.property_manager?.profile_picture_url || auth.user.avatar ? (
                                                <img
                                                    src={auth.user.property_manager?.profile_picture_url || auth.user.avatar}
                                                    alt={auth.user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-white">{getUserInitials(auth.user)}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            {auth.user.name && <p className="truncate text-sm font-medium text-foreground">{auth.user.name}</p>}
                                            <p className="truncate text-sm text-muted-foreground">{auth.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-border" />

                                    {/* Selectors */}
                                    <div className="space-y-4">
                                        <div ref={languageRef}>
                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">Language</label>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                                                    className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{currentLang?.flag}</span>
                                                        <span>{currentLang?.name}</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {languageDropdownOpen && (
                                                    <div className="absolute right-0 left-0 z-40 mt-2 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                                                        <div className="py-1">
                                                            {languages.map((lang) => (
                                                                <button
                                                                    key={lang.code}
                                                                    onClick={() => handleLanguageChange(lang.code)}
                                                                    className={`flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background ${
                                                                        locale === lang.code ? 'bg-background text-primary' : 'text-text-secondary'
                                                                    }`}
                                                                >
                                                                    <span>{lang.flag}</span>
                                                                    <span>{lang.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div ref={currencyRef}>
                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">Currency</label>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                                                    className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{currentCurrencyData?.flag}</span>
                                                        <span>
                                                            {currentCurrencyData?.code} - {currentCurrencyData?.name}
                                                        </span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${currencyDropdownOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {currencyDropdownOpen && (
                                                    <div className="absolute right-0 left-0 z-40 mt-2 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                                                        <div className="py-1">
                                                            {currencies.map((currency: Currency) => (
                                                                <button
                                                                    key={currency.code}
                                                                    onClick={() => handleCurrencyChange(currency.code)}
                                                                    className={`flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background ${
                                                                        currentCurrency === currency.code
                                                                            ? 'bg-background text-primary'
                                                                            : 'text-text-secondary'
                                                                    }`}
                                                                >
                                                                    <span className="text-base">{currency.flag}</span>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="font-medium">{currency.code}</span>
                                                                            <span className="text-xs opacity-75">{currency.symbol}</span>
                                                                        </div>
                                                                        <div className="text-xs opacity-60">{currency.name}</div>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Guest Navigation */}
                            {!auth.user && (
                                <>
                                    {/* Browse Properties - always visible for guests on tenant portal */}
                                    {isTenantPortal && (
                                        <Button variant="outline" className="h-11 w-full justify-start text-base" asChild>
                                            <a href={route('properties.index')} onClick={() => setIsOpen(false)}>
                                                <Building2 size={20} />
                                                <span>{t(translations, 'nav.properties') || 'Browse Properties'}</span>
                                            </a>
                                        </Button>
                                    )}

                                    <a
                                        href={route('login')}
                                        className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-base font-semibold text-white shadow-xs transition-all hover:scale-105"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {t(translations.header, 'login')}
                                    </a>

                                    <div className="border-t border-border" />

                                    <div className="space-y-4">
                                        <div ref={languageRef}>
                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">Language</label>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                                                    className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{currentLang?.flag}</span>
                                                        <span>{currentLang?.name}</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {languageDropdownOpen && (
                                                    <div className="absolute right-0 left-0 z-40 mt-2 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                                                        <div className="py-1">
                                                            {languages.map((lang) => (
                                                                <button
                                                                    key={lang.code}
                                                                    onClick={() => handleLanguageChange(lang.code)}
                                                                    className={`flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background ${
                                                                        locale === lang.code ? 'bg-background text-primary' : 'text-text-secondary'
                                                                    }`}
                                                                >
                                                                    <span>{lang.flag}</span>
                                                                    <span>{lang.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div ref={currencyRef}>
                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">Currency</label>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                                                    className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{currentCurrencyData?.flag}</span>
                                                        <span>
                                                            {currentCurrencyData?.code} - {currentCurrencyData?.name}
                                                        </span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${currencyDropdownOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {currencyDropdownOpen && (
                                                    <div className="absolute right-0 left-0 z-40 mt-2 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                                                        <div className="py-1">
                                                            {currencies.map((currency: Currency) => (
                                                                <button
                                                                    key={currency.code}
                                                                    onClick={() => handleCurrencyChange(currency.code)}
                                                                    className={`flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background ${
                                                                        currentCurrency === currency.code
                                                                            ? 'bg-background text-primary'
                                                                            : 'text-text-secondary'
                                                                    }`}
                                                                >
                                                                    <span className="text-base">{currency.flag}</span>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="font-medium">{currency.code}</span>
                                                                            <span className="text-xs opacity-75">{currency.symbol}</span>
                                                                        </div>
                                                                        <div className="text-xs opacity-60">{currency.name}</div>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Navigation & Settings Section - Bottom (logged in) */}
                        {auth.user && (
                            <div className="space-y-4 border-t border-border pt-4">
                                {/* Tenant Portal Navigation */}
                                {isTenantPortal && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                                {t(translations.header, 'nav.navigation') || 'Navigation'}
                                            </label>
                                            <TenantNavMobile unreadMessages={unreadMessages} onNavigate={() => setIsOpen(false)} />
                                        </div>
                                        <div className="border-t border-border" />
                                    </>
                                )}

                                {/* Profile & Settings */}
                                <div className="space-y-1">
                                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                        {t(translations.header, 'nav.account') || 'Account'}
                                    </label>
                                    {isTenantPortal && (
                                        <Button variant="ghost" className="h-11 w-full justify-start text-base" asChild>
                                            <a href={route('tenant.profile.show')} onClick={() => setIsOpen(false)}>
                                                <User size={20} />
                                                <span>{t(translations.header, 'nav.my_profile') || 'My Profile'}</span>
                                            </a>
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="h-11 w-full justify-start text-base" asChild>
                                        <a href={settingsRoute('profile', subdomain, managerSubdomain)} onClick={() => setIsOpen(false)}>
                                            <Settings size={20} />
                                            <span>{t(translations.header, 'settings')}</span>
                                        </a>
                                    </Button>
                                </div>

                                <div className="border-t border-border" />

                                {/* Logout */}
                                <Button variant="destructive" className="h-11 w-full justify-start text-base" onClick={handleLogoutClick}>
                                    <LogOut size={20} />
                                    <span>{t(translations.header, 'sign_out')}</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LogoutConfirmationPopover isOpen={showLogoutConfirmation} onClose={handleLogoutCancel} onConfirm={handleLogoutConfirm} />
        </>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-text-secondary hover:text-text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface transition-colors hover:bg-background"
                aria-label="Menu"
            >
                <Menu size={20} />
            </button>

            {mounted && createPortal(menuContent, document.body)}
        </>
    );
}
