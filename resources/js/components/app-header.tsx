import { CurrencySelector } from '@/components/currency-selector';
import { LanguageSelector } from '@/components/language-selector';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Home, LogOut, Moon, Sun, User } from 'lucide-react';
import { useRef, useState } from 'react';

interface AppHeaderProps {
    title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const containerRef = useRef(null);

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

    const handleLogoClick = () => {
        window.location.href = '/';
    };

    return (
        <header className="bg-surface/90 dark:bg-surface/90 sticky top-0 z-40 border-b border-border backdrop-blur-md">
            <div ref={containerRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Logo + Title */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleLogoClick}
                        className="hover:bg-surface dark:bg-surface flex items-center space-x-2 rounded-lg border border-border bg-background px-3 py-2 transition-all duration-200 dark:border-border dark:hover:bg-background"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary">
                            <Home className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-text-primary dark:text-text-primary text-lg font-bold">RentPath</span>
                    </button>

                    {title && (
                        <>
                            <div className="hidden h-6 w-px bg-border sm:block dark:bg-border" />
                            <h1 className="text-text-primary dark:text-text-primary hidden text-xl font-semibold sm:block">{title}</h1>
                        </>
                    )}
                </div>

                {/* Right: Theme toggle + Currency + Language + User */}
                <div className="flex items-center space-x-4">
                    {/* Theme toggle */}
                    <button
                        className="hover:bg-surface dark:hover:bg-surface rounded-lg p-2 transition-colors"
                        onClick={() => document.documentElement.classList.toggle('dark')}
                        title="Toggle dark mode"
                    >
                        {document.documentElement.classList.contains('dark') ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <CurrencySelector />
                    <LanguageSelector />

                    {/* User Menu */}
                    {auth.user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="hover:bg-surface dark:bg-surface flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-background dark:border-border dark:hover:bg-background"
                            >
                                {auth.user.avatar ? (
                                    <img src={auth.user.avatar} alt={auth.user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-text-primary dark:text-text-primary text-sm font-medium">{getUserInitials(auth.user)}</span>
                                )}
                            </button>

                            {showUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                                    <div className="bg-surface dark:bg-surface absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-lg border border-border shadow-lg dark:border-border">
                                        <div className="flex items-center space-x-3 border-b border-border px-4 py-3 dark:border-border">
                                            {auth.user.avatar ? (
                                                <img src={auth.user.avatar} alt={auth.user.name} className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <User size={14} className="text-text-secondary dark:text-text-secondary" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                {auth.user.name && (
                                                    <p className="text-text-primary dark:text-text-primary truncate text-sm font-medium">
                                                        {auth.user.name}
                                                    </p>
                                                )}
                                                <p className="text-text-secondary dark:text-text-secondary truncate text-xs">{auth.user.email}</p>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <a
                                                href="/account/logout"
                                                className="text-error hover:bg-error/10 dark:text-error dark:hover:bg-error/20 flex w-full items-center space-x-3 px-4 py-3 text-left text-sm transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span className="font-medium">{t('signOut')}</span>
                                            </a>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
