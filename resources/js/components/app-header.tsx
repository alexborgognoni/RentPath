import { CurrencySelector } from '@/components/currency-selector';
import { LanguageSelector } from '@/components/language-selector';
import { LogoHomeButton } from '@/components/logo-home-button';
import { LogoutConfirmationPopover } from '@/components/logout-confirmation-popover';
import { MobileMenu } from '@/components/mobile-menu';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { route, settingsRoute } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, MessageCircle, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AppHeaderProps {
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ title, breadcrumbs }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth, translations, subdomain, managerSubdomain } = page.props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    const getUserInitials = (user: { name?: string; email?: string }) => {
        if (user?.name) {
            return user.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        }
        if (user?.email) return user.email[0].toUpperCase();
        return 'U';
    };

    const handleLogoutConfirm = () => {
        setShowLogoutConfirmation(false);
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirmation(false);
    };

    const handleLogout = () => {
        setShowUserMenu(false);
        setShowLogoutConfirmation(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        const handleScroll = () => {
            setShowUserMenu(false);
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [showUserMenu]);

    // Hide/show header on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header when at top
            if (currentScrollY < 10) {
                setIsHeaderVisible(true);
            }
            // Show when scrolling up
            else if (currentScrollY < lastScrollY.current) {
                setIsHeaderVisible(true);
            }
            // Hide when scrolling down
            else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsHeaderVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ease-in-out ${
                isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div ref={containerRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Logo + Title */}
                <div className="flex items-center space-x-3">
                    <LogoHomeButton />

                    {(breadcrumbs?.length || title) && (
                        <>
                            <div className="hidden h-6 w-px bg-border sm:block dark:bg-border" />
                            {breadcrumbs?.length ? (
                                <nav className="hidden items-center space-x-2 text-sm sm:flex">
                                    {breadcrumbs.map((crumb, index) => (
                                        <div key={crumb.href} className="flex items-center space-x-2">
                                            {index > 0 && <span className="text-muted-foreground">/</span>}
                                            {index === breadcrumbs.length - 1 ? (
                                                <span className="font-semibold text-foreground">{crumb.title}</span>
                                            ) : (
                                                <a href={crumb.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                                    {crumb.title}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            ) : (
                                <h1 className="hidden text-xl font-semibold text-foreground sm:block">{title}</h1>
                            )}
                        </>
                    )}
                </div>

                {/* Right: Currency + Language + User (Desktop) / Mobile Menu */}
                <div className="flex items-center">
                    {/* Mobile Menu - only visible on mobile */}
                    <div className="md:hidden">
                        <MobileMenu getUserInitials={getUserInitials} />
                    </div>

                    {/* Desktop Controls - only visible on desktop */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <CurrencySelector />
                        <LanguageSelector />

                        {/* Auth Buttons or User Menu */}
                        {auth?.user ? (
                            <>
                                <Link
                                    href={route('tenant.messages.index')}
                                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {t(translations?.header, 'messages') || 'Messages'}
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                                >
                                    {t(translations?.header, 'dashboard') || 'Dashboard'}
                                </Link>
                                <div ref={userMenuRef} className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-muted"
                                    >
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
                                            {auth.user?.property_manager?.profile_picture_url ? (
                                                <img
                                                    src={auth.user.property_manager.profile_picture_url}
                                                    alt={auth.user?.name || auth.user?.email}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-semibold text-white">{getUserInitials(auth.user)}</span>
                                            )}
                                        </div>
                                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                                            <div className="border-b border-border px-4 py-3">
                                                <div className="min-w-0">
                                                    {auth.user?.name && (
                                                        <p className="truncate text-sm font-medium text-foreground">{auth.user.name}</p>
                                                    )}
                                                    <p className="truncate text-xs text-muted-foreground">{auth.user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    href={settingsRoute('profile', subdomain, managerSubdomain)}
                                                    className="text-text-secondary flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background"
                                                >
                                                    <Settings size={16} />
                                                    <span>{t(translations?.header, 'settings')}</span>
                                                </Link>
                                                <div className="mb-1 border-t border-border"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-left text-sm text-destructive transition-colors duration-150 hover:bg-destructive/10"
                                                >
                                                    <LogOut size={16} />
                                                    <span>{t(translations?.header, 'sign_out')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                            >
                                {t(translations?.header, 'login') || 'Log In'}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <LogoutConfirmationPopover isOpen={showLogoutConfirmation} onClose={handleLogoutCancel} onConfirm={handleLogoutConfirm} />
        </header>
    );
}
