import { QuickActions, RecentApplications, StatsBar } from '@/components/tenant-dashboard';
import { TenantLayout } from '@/layouts/tenant-layout';
import type { SharedData } from '@/types';
import type { Application } from '@/types/dashboard';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Sparkles } from 'lucide-react';

interface DashboardStats {
    total_applications: number;
    pending_review: number;
    approved: number;
    unread_messages: number;
    profile_complete: boolean;
}

interface TenantDashboardProps {
    stats: DashboardStats;
    recentApplications: Application[];
    hasProfile: boolean;
    userName: string;
}

export default function TenantDashboard({ stats, recentApplications, userName }: TenantDashboardProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);

    // Empty state for new users (no applications yet)
    const showEmptyState = stats.total_applications === 0;

    return (
        <TenantLayout>
            <Head title={t('tenant.dashboard.title') || 'Dashboard'} />

            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                            {t('tenant.dashboard.welcome') || 'Welcome back'}, {userName?.split(' ')[0] || 'there'}!
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {t('tenant.dashboard.subtitle') || 'Manage your rental applications and messages'}
                        </p>
                    </div>
                    <Link
                        href={route('properties.index')}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                    >
                        <Building2 className="h-4 w-4" />
                        {t('tenant.dashboard.browse_properties') || 'Browse Properties'}
                    </Link>
                </div>

                {showEmptyState ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-gradient-to-b from-card to-card/50 px-6 py-16 text-center">
                        <div className="mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-6">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="mb-3 text-2xl font-bold text-foreground">
                            {t('tenant.dashboard.empty.title') || 'Start Your Rental Journey'}
                        </h2>
                        <p className="mb-8 max-w-md text-muted-foreground">
                            {t('tenant.dashboard.empty.description') ||
                                'Browse available properties and submit your first application. Your applications and messages will appear here.'}
                        </p>
                        <Link
                            href={route('properties.index')}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                        >
                            <Building2 className="h-5 w-5" />
                            {t('tenant.dashboard.empty.cta') || 'Browse Properties'}
                        </Link>
                    </div>
                ) : (
                    /* Dashboard Content */
                    <>
                        {/* Stats Bar */}
                        <StatsBar
                            totalApplications={stats.total_applications}
                            pendingReview={stats.pending_review}
                            approved={stats.approved}
                            unreadMessages={stats.unread_messages}
                        />

                        {/* Quick Actions */}
                        <QuickActions unreadMessages={stats.unread_messages} profileComplete={stats.profile_complete} />

                        {/* Recent Applications */}
                        <RecentApplications applications={recentApplications} />
                    </>
                )}
            </div>
        </TenantLayout>
    );
}
