import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import type { Application, SharedData } from '@/types';
import { useReactiveCurrency } from '@/utils/currency-utils';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, Archive, Calendar, CheckCircle, Clock, FileCheck, FileText, Home, Settings, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ApplicationSidebarProps {
    application: Application;
    allowedTransitions: string[];
}

const statusConfig: Record<string, { labelKey: string; className: string; icon: React.ElementType }> = {
    submitted: {
        labelKey: 'statusSubmitted',
        className: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
        icon: Clock,
    },
    under_review: {
        labelKey: 'statusUnderReview',
        className: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
        icon: AlertCircle,
    },
    visit_scheduled: {
        labelKey: 'statusVisitScheduled',
        className: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
        icon: Calendar,
    },
    visit_completed: {
        labelKey: 'statusVisitCompleted',
        className: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
        icon: FileCheck,
    },
    approved: {
        labelKey: 'statusApproved',
        className: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
        icon: CheckCircle,
    },
    rejected: {
        labelKey: 'statusRejected',
        className: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
        icon: XCircle,
    },
    leased: {
        labelKey: 'statusLeased',
        className: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        icon: Home,
    },
    archived: {
        labelKey: 'statusArchived',
        className: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
        icon: Archive,
    },
};

const actionConfig: Record<string, { labelKey: string; titleKey: string; descKey: string; variant: 'default' | 'success' | 'danger' }> = {
    under_review: { labelKey: 'startReview', titleKey: 'approveTitle', descKey: 'approveDescription', variant: 'default' },
    visit_scheduled: { labelKey: 'scheduleVisit', titleKey: 'scheduleVisitTitle', descKey: 'scheduleVisitDescription', variant: 'default' },
    visit_completed: { labelKey: 'completeVisit', titleKey: 'completeVisitTitle', descKey: 'completeVisitDescription', variant: 'default' },
    approved: { labelKey: 'approve', titleKey: 'approveTitle', descKey: 'approveDescription', variant: 'success' },
    rejected: { labelKey: 'reject', titleKey: 'rejectTitle', descKey: 'rejectDescription', variant: 'danger' },
    leased: { labelKey: 'markLeased', titleKey: 'markLeasedTitle', descKey: 'markLeasedDescription', variant: 'success' },
    archived: { labelKey: 'archive', titleKey: 'archiveTitle', descKey: 'archiveDescription', variant: 'default' },
};

export function ApplicationSidebar({ application, allowedTransitions }: ApplicationSidebarProps) {
    const { translations, locale } = usePage<SharedData>().props;
    const { formatAmount } = useReactiveCurrency();
    const t = (key: string) => translate(translations.applications, key);

    const [actionDialog, setActionDialog] = useState<{ status: string; notes: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentStatusConfig = statusConfig[application.status] || statusConfig.submitted;
    const StatusIcon = currentStatusConfig.icon;

    const formatDate = (date: string | undefined) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleAction = (status: string) => {
        setActionDialog({ status, notes: '' });
    };

    const confirmAction = async () => {
        if (!actionDialog) return;

        setIsSubmitting(true);
        try {
            router.post(
                route('manager.applications.updateStatus', { application: application.id }),
                { status: actionDialog.status, notes: actionDialog.notes },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Application status updated');
                        setActionDialog(null);
                    },
                    onError: () => {
                        toast.error('Failed to update status');
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                },
            );
        } catch {
            setIsSubmitting(false);
            toast.error('Failed to update status');
        }
    };

    const getButtonClassName = (variant: 'default' | 'success' | 'danger') => {
        const base = 'w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-colors';
        switch (variant) {
            case 'success':
                return `${base} bg-green-600 text-white hover:bg-green-700`;
            case 'danger':
                return `${base} bg-red-600 text-white hover:bg-red-700`;
            default:
                return `${base} bg-primary text-primary-foreground hover:bg-primary/90`;
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <StatusIcon className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Status</h2>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${currentStatusConfig.className}`}>
                    <StatusIcon className="h-4 w-4" />
                    {t(currentStatusConfig.labelKey)}
                </div>
            </div>

            {/* Quick Stats Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{t('quickStats')}</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('columnSubmitted')}</span>
                        <span className="text-sm font-medium text-foreground">{formatDate(application.submitted_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('monthlyIncome')}</span>
                        <span className="text-sm font-medium text-foreground">
                            {application.snapshot_monthly_income
                                ? formatAmount(application.snapshot_monthly_income, application.snapshot_income_currency || 'eur')
                                : '-'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('desiredMoveIn')}</span>
                        <span className="text-sm font-medium text-foreground">{formatDate(application.desired_move_in_date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('leaseDuration')}</span>
                        <span className="text-sm font-medium text-foreground">
                            {application.lease_duration_months} {t('months')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions Card */}
            {allowedTransitions.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">{t('actions')}</h2>
                    </div>
                    <div className="space-y-2">
                        {allowedTransitions
                            .filter((status) => status !== 'archived') // Show archive separately
                            .map((status) => {
                                const config = actionConfig[status];
                                if (!config) return null;
                                return (
                                    <button key={status} onClick={() => handleAction(status)} className={getButtonClassName(config.variant)}>
                                        {t(config.labelKey)}
                                    </button>
                                );
                            })}

                        {/* Archive button (always at bottom if available) */}
                        {allowedTransitions.includes('archived') && (
                            <button
                                onClick={() => handleAction('archived')}
                                className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                {t('archive')}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Action Confirmation Dialog */}
            <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionDialog && t(actionConfig[actionDialog.status]?.titleKey || 'confirm')}</DialogTitle>
                        <DialogDescription>{actionDialog && t(actionConfig[actionDialog.status]?.descKey || '')}</DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <label className="block text-sm font-medium text-foreground">{t('notesLabel')}</label>
                        <textarea
                            value={actionDialog?.notes || ''}
                            onChange={(e) => setActionDialog((prev) => (prev ? { ...prev, notes: e.target.value } : null))}
                            placeholder={t('notesPlaceholder')}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => setActionDialog(null)}
                            disabled={isSubmitting}
                            className="cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={confirmAction}
                            disabled={isSubmitting}
                            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : t('confirm')}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
