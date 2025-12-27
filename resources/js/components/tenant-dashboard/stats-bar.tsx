import type { SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, MessageCircle } from 'lucide-react';

interface StatsBarProps {
    totalApplications: number;
    pendingReview: number;
    approved: number;
    unreadMessages: number;
}

export function StatsBar({ totalApplications, pendingReview, approved, unreadMessages }: StatsBarProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);

    const stats = [
        {
            label: t('tenant.dashboard.stats.active_apps') || 'Active Applications',
            value: totalApplications,
            icon: FileText,
            href: route('applications.index'),
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            label: t('tenant.dashboard.stats.pending_review') || 'Pending Review',
            value: pendingReview,
            icon: Clock,
            href: route('applications.index') + '?status=pending',
            color: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        },
        {
            label: t('tenant.dashboard.stats.approved') || 'Approved',
            value: approved,
            icon: CheckCircle,
            href: route('applications.index') + '?status=approved',
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            label: t('tenant.dashboard.stats.unread_messages') || 'Unread Messages',
            value: unreadMessages,
            icon: MessageCircle,
            href: route('tenant.messages.index'),
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-100 dark:bg-purple-900/30',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
                <Link
                    key={stat.label}
                    href={stat.href}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                    <div className={`rounded-lg p-3 ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
