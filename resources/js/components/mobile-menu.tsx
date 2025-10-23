import { LogoutConfirmationPopover } from '@/components/logout-confirmation-popover';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { currencies, getCurrency, getCurrencyFromStorage, setCurrencyInStorage, type Currency, type CurrencyCode } from '@/utils/currency-utils';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';
import { Menu, X, LogOut, Settings, ChevronDown } from 'lucide-react';
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
    const { auth, translations, locale } = page.props;
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
            await axios.post('/locale', { locale: langCode });
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
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            )}

            {/* Slide-in menu */}
            <div
                ref={menuRef}
                className={`fixed right-0 top-0 z-50 h-full w-72 bg-surface border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-4">
                        <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background hover:text-text-primary cursor-pointer"
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
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary border border-border shadow-md">
                                            {(auth.user.property_manager?.profile_picture_url || auth.user.avatar) ? (
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
                                        className="bg-surface text-text-secondary hover:text-text-primary flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>{currentLang?.flag}</span>
                                            <span>{currentLang?.name}</span>
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {languageDropdownOpen && (
                                        <div className="bg-surface absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-lg border border-border shadow-xl">
                                            <div className="py-1">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => handleLanguageChange(lang.code)}
                                                        className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background cursor-pointer ${
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
                                        className="bg-surface text-text-secondary hover:text-text-primary flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>{currentCurrencyData?.flag}</span>
                                            <span>{currentCurrencyData?.code} - {currentCurrencyData?.name}</span>
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {currencyDropdownOpen && (
                                        <div className="bg-surface absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-lg border border-border shadow-xl">
                                            <div className="py-1">
                                                {currencies.map((currency: Currency) => (
                                                    <button
                                                        key={currency.code}
                                                        onClick={() => handleCurrencyChange(currency.code)}
                                                        className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background cursor-pointer ${
                                                            currentCurrency === currency.code ? 'bg-background text-primary' : 'text-text-secondary'
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

                            {/* Login Button for logged out users */}
                            {!auth.user && (
                                <>
                                    <a
                                        href="/login"
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
                                                    className="bg-surface text-text-secondary hover:text-text-primary flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{currentLang?.flag}</span>
                                                        <span>{currentLang?.name}</span>
                                                    </div>
                                                    <ChevronDown size={16} className={`transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {languageDropdownOpen && (
                                                    <div className="bg-surface absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-lg border border-border shadow-xl">
                                                        <div className="py-1">
                                                            {languages.map((lang) => (
                                                                <button
                                                                    key={lang.code}
                                                                    onClick={() => handleLanguageChange(lang.code)}
                                                                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background cursor-pointer ${
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
                                                    className="bg-surface text-text-secondary hover:text-text-primary flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{currentCurrencyData?.flag}</span>
                                                        <span>{currentCurrencyData?.code} - {currentCurrencyData?.name}</span>
                                                    </div>
                                                    <ChevronDown size={16} className={`transition-transform duration-200 ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {currencyDropdownOpen && (
                                                    <div className="bg-surface absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-lg border border-border shadow-xl">
                                                        <div className="py-1">
                                                            {currencies.map((currency: Currency) => (
                                                                <button
                                                                    key={currency.code}
                                                                    onClick={() => handleCurrencyChange(currency.code)}
                                                                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background cursor-pointer ${
                                                                        currentCurrency === currency.code ? 'bg-background text-primary' : 'text-text-secondary'
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

                        {/* Settings/Sign Out Section - Bottom (logged in) */}
                        {auth.user && (
                            <div className="space-y-2 pt-4">
                                <Button variant="outline" className="w-full justify-start h-11 text-base" asChild>
                                    <a href="/settings" onClick={() => setIsOpen(false)}>
                                        <Settings size={20} />
                                        <span>{t(translations.header, 'settings')}</span>
                                    </a>
                                </Button>
                                <Button variant="destructive" className="w-full justify-start h-11 text-base" onClick={handleLogoutClick}>
                                    <LogOut size={20} />
                                    <span>{t(translations.header, 'sign_out')}</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LogoutConfirmationPopover
                isOpen={showLogoutConfirmation}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:bg-background hover:text-text-primary cursor-pointer"
                aria-label="Menu"
            >
                <Menu size={20} />
            </button>

            {mounted && createPortal(menuContent, document.body)}
        </>
    );
}
