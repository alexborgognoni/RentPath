import { type SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Lock, Palette, User } from 'lucide-react';

interface SettingsNavigationProps {
    currentPage: 'account' | 'password' | 'appearance';
    onNavigate?: (page: 'account' | 'password' | 'appearance') => void;
}

export function SettingsNavigation({ currentPage, onNavigate }: SettingsNavigationProps) {
    const { translations } = usePage<SharedData>().props;

    const navItems = [
        {
            key: 'account' as const,
            title: t(translations.settings, 'menu.account'),
            href: '/settings/account',
            icon: User,
        },
        {
            key: 'password' as const,
            title: t(translations.settings, 'menu.password'),
            href: '/settings/password',
            icon: Lock,
        },
        {
            key: 'appearance' as const,
            title: t(translations.settings, 'menu.appearance'),
            href: '/settings/appearance',
            icon: Palette,
        },
    ];

    return (
        <nav className="lg:w-64 lg:flex-shrink-0">
            {/* Mobile: Vertical menu at top */}
            <div className="mb-8 lg:hidden">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentPage === item.key;

                        return (
                            <button
                                key={item.key}
                                onClick={() => onNavigate?.(item.key)}
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                                        : 'text-text-secondary hover:bg-background hover:text-foreground'
                                }`}
                            >
                                <IconComponent className="h-5 w-5" />
                                {item.title}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Desktop: Vertical menu on left */}
            <div className="hidden lg:block lg:pr-8">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentPage === item.key;

                        return (
                            <button
                                key={item.key}
                                onClick={() => onNavigate?.(item.key)}
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                                        : 'text-text-secondary hover:bg-background hover:text-foreground'
                                }`}
                            >
                                <IconComponent className="h-5 w-5" />
                                {item.title}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
