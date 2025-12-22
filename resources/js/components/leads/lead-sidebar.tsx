import type { Lead, SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { Archive, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface LeadSidebarProps {
    lead: Lead;
}

export function LeadSidebar({ lead }: LeadSidebarProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.leads, key);

    const [isResending, setIsResending] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleResendInvite = () => {
        setIsResending(true);
        router.post(
            route('manager.leads.resend', { lead: lead.id }),
            {},
            {
                onFinish: () => setIsResending(false),
            },
        );
    };

    const handleArchive = () => {
        setIsArchiving(true);
        router.post(
            route('manager.leads.archive', { lead: lead.id }),
            {},
            {
                onFinish: () => setIsArchiving(false),
            },
        );
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('manager.leads.destroy', { lead: lead.id }), {
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="space-y-6">
            {/* Actions Card */}
            <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">{t('actions')}</h3>

                <div className="space-y-3">
                    {/* Resend Invite */}
                    {lead.status !== 'archived' && lead.status !== 'applied' && (
                        <button
                            onClick={handleResendInvite}
                            disabled={isResending}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
                        >
                            <Send className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{t('resendInvite')}</p>
                                <p className="text-xs text-muted-foreground">{t('resendInviteDesc')}</p>
                            </div>
                        </button>
                    )}

                    {/* Archive */}
                    {lead.status !== 'archived' && (
                        <button
                            onClick={handleArchive}
                            disabled={isArchiving}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
                        >
                            <Archive className="h-5 w-5 text-amber-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{t('archiveLead')}</p>
                                <p className="text-xs text-muted-foreground">{t('archiveLeadDesc')}</p>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                <h3 className="mb-4 font-semibold text-destructive">{t('dangerZone')}</h3>

                {showDeleteConfirm ? (
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{t('deleteLeadConfirm')}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 cursor-pointer rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                            >
                                {isDeleting ? '...' : t('deleteLead')}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-destructive/30 p-3 text-left transition-colors hover:bg-destructive/10"
                    >
                        <Trash2 className="h-5 w-5 text-destructive" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-destructive">{t('deleteLead')}</p>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}
