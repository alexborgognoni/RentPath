import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Building2, FileText, MessageCircle, User } from 'lucide-react';

interface NavItem {
    href: string;
    label: string;
    translationKey: string;
    icon: LucideIcon;
    badge?: number;
    matchPaths?: string[];
}

interface TenantNavProps {
    unreadMessages?: number;
    className?: string;
}

export function TenantNav({ unreadMessages = 0, className }: TenantNavProps) {
    const { auth, translations } = usePage<SharedData>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Don't show nav when not authenticated
    if (!auth?.user) {
        return null;
    }

    const t = (key: string) => translate(translations.tenant.common, key);

    const navItems: NavItem[] = [
        {
            href: route('applications.index'),
            label: 'Applications',
            translationKey: 'nav.applications',
            icon: FileText,
            matchPaths: ['/applications'],
        },
        {
            href: route('properties.index'),
            label: 'Properties',
            translationKey: 'nav.properties',
            icon: Building2,
            matchPaths: ['/properties'],
        },
        {
            href: route('tenant.messages.index'),
            label: 'Messages',
            translationKey: 'nav.messages',
            icon: MessageCircle,
            badge: unreadMessages,
            matchPaths: ['/messages'],
        },
        {
            href: route('tenant.profile.show'),
            label: 'Profile',
            translationKey: 'nav.profile',
            icon: User,
            matchPaths: ['/profile'],
        },
    ];

    const isActive = (item: NavItem): boolean => {
        if (!item.matchPaths) return false;
        return item.matchPaths.some((path) => currentPath.startsWith(path));
    };

    return (
        <nav className={cn('flex items-center gap-1', className)}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="hidden lg:inline">{t(item.translationKey) || item.label}</span>
                        {item.badge && item.badge > 0 ? (
                            <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5">
                                {item.badge > 99 ? '99+' : item.badge}
                            </Badge>
                        ) : null}
                    </Link>
                );
            })}
        </nav>
    );
}

// Variant for mobile menu - vertical layout with full labels
export function TenantNavMobile({ unreadMessages = 0, onNavigate }: TenantNavProps & { onNavigate?: () => void }) {
    const { auth, translations } = usePage<SharedData>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Don't show nav when not authenticated
    if (!auth?.user) {
        return null;
    }

    const t = (key: string) => translate(translations.tenant.common, key);

    const navItems: NavItem[] = [
        {
            href: route('applications.index'),
            label: 'Applications',
            translationKey: 'nav.applications',
            icon: FileText,
            matchPaths: ['/applications'],
        },
        {
            href: route('properties.index'),
            label: 'Properties',
            translationKey: 'nav.properties',
            icon: Building2,
            matchPaths: ['/properties'],
        },
        {
            href: route('tenant.messages.index'),
            label: 'Messages',
            translationKey: 'nav.messages',
            icon: MessageCircle,
            badge: unreadMessages,
            matchPaths: ['/messages'],
        },
        {
            href: route('tenant.profile.show'),
            label: 'Profile',
            translationKey: 'nav.profile',
            icon: User,
            matchPaths: ['/profile'],
        },
    ];

    const isActive = (item: NavItem): boolean => {
        if (!item.matchPaths) return false;
        return item.matchPaths.some((path) => currentPath.startsWith(path));
    };

    return (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                            active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1">{t(item.translationKey) || item.label}</span>
                        {item.badge && item.badge > 0 ? (
                            <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
                                {item.badge > 99 ? '99+' : item.badge}
                            </Badge>
                        ) : null}
                    </Link>
                );
            })}
        </nav>
    );
}
