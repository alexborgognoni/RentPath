import type { SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import { Building2, FileText, MessageCircle, User } from 'lucide-react';

interface QuickActionsProps {
    unreadMessages: number;
    profileComplete: boolean;
}

export function QuickActions({ unreadMessages, profileComplete }: QuickActionsProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);

    const actions = [
        {
            href: route('properties.index'),
            icon: Building2,
            title: t('tenant.dashboard.quick_actions.browse') || 'Browse Properties',
            description: t('tenant.dashboard.quick_actions.browse_desc') || 'Find your next home',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            href: route('applications.index'),
            icon: FileText,
            title: t('tenant.dashboard.quick_actions.applications') || 'My Applications',
            description: t('tenant.dashboard.quick_actions.applications_desc') || 'Track your applications',
            gradient: 'from-violet-500 to-purple-500',
        },
        {
            href: route('tenant.messages.index'),
            icon: MessageCircle,
            title: t('tenant.dashboard.quick_actions.messages') || 'Messages',
            description: t('tenant.dashboard.quick_actions.messages_desc') || 'Chat with landlords',
            badge: unreadMessages > 0 ? unreadMessages : undefined,
            gradient: 'from-pink-500 to-rose-500',
        },
        {
            href: route('tenant.profile.show'),
            icon: User,
            title: t('tenant.dashboard.quick_actions.profile') || 'My Profile',
            description: t('tenant.dashboard.quick_actions.profile_desc') || 'Update your information',
            alert: !profileComplete,
            gradient: 'from-amber-500 to-orange-500',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {actions.map((action) => (
                <Link
                    key={action.href}
                    href={action.href}
                    className="group relative flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                    <div className={`rounded-xl bg-gradient-to-br ${action.gradient} p-3 shadow-lg transition-transform group-hover:scale-110`}>
                        <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="flex items-center gap-2 font-semibold text-foreground group-hover:text-primary">
                            {action.title}
                            {action.badge && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                                    {action.badge}
                                </span>
                            )}
                            {action.alert && <span className="flex h-2 w-2 rounded-full bg-amber-500" title="Profile incomplete" />}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>
            ))}
        </div>
    );
}
