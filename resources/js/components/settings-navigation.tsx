import { Lock, Palette, User } from 'lucide-react';

interface SettingsNavigationProps {
    currentPage: 'profile' | 'password' | 'appearance';
    onNavigate?: (page: 'profile' | 'password' | 'appearance') => void;
}

export function SettingsNavigation({ currentPage, onNavigate }: SettingsNavigationProps) {
    const navItems = [
        {
            key: 'profile' as const,
            title: 'Profile',
            href: '/settings/profile',
            icon: User,
        },
        {
            key: 'password' as const,
            title: 'Password',
            href: '/settings/password',
            icon: Lock,
        },
        {
            key: 'appearance' as const,
            title: 'Appearance',
            href: '/settings/appearance',
            icon: Palette,
        },
    ];

    return (
        <nav className="lg:w-64 lg:flex-shrink-0">
            {/* Mobile: Vertical menu at top */}
            <div className="lg:hidden mb-8">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentPage === item.key;
                        
                        return (
                            <button
                                key={item.key}
                                onClick={() => onNavigate?.(item.key)}
                                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                                        : 'text-text-secondary hover:text-foreground hover:bg-background'
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
                                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                                        : 'text-text-secondary hover:text-foreground hover:bg-background'
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