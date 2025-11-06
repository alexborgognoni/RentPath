import { CurrencySelector } from '@/components/currency-selector';
import { LanguageSelector } from '@/components/language-selector';
import { LogoHomeButton } from '@/components/logo-home-button';
import { LogoutConfirmationPopover } from '@/components/logout-confirmation-popover';
import { MobileMenu } from '@/components/mobile-menu';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface AppHeaderProps {
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ title, breadcrumbs }: AppHeaderProps) {
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
                    </div>
                </div>
            </div>
            <LogoutConfirmationPopover
                isOpen={showLogoutConfirmation}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
            />
        </header>
    );
}
