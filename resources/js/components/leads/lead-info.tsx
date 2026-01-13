import type { Lead, SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Link, router, usePage } from '@inertiajs/react';
import { Archive, Building2, CheckCircle, Eye, FileEdit, FileText, Mail, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';

interface LeadInfoProps {
    lead: Lead;
}

const statusConfig: Record<string, { labelKey: string; className: string; icon: React.ElementType }> = {
    invited: {
        labelKey: 'statusInvited',
        className: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
        icon: Send,
    },
    viewed: {
        labelKey: 'statusViewed',
        className: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
        icon: Eye,
    },
    drafting: {
        labelKey: 'statusDrafting',
        className: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
        icon: FileEdit,
    },
    applied: {
        labelKey: 'statusApplied',
        className: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
        icon: CheckCircle,
    },
    archived: {
        labelKey: 'statusArchived',
        className: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
        icon: Archive,
    },
};

export function LeadInfo({ lead }: LeadInfoProps) {
    const { translations, locale } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.manager.leads, key);

    const [notes, setNotes] = useState(lead.notes || '');
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    const statusCfg = statusConfig[lead.status] || statusConfig.invited;
    const StatusIcon = statusCfg.icon;

    const formatDate = (date: string | null | undefined) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSaveNotes = () => {
        setIsSavingNotes(true);
        router.put(
            route('manager.leads.update', { lead: lead.id }),
            { notes },
            {
                preserveScroll: true,
                onSuccess: () => setIsEditingNotes(false),
                onFinish: () => setIsSavingNotes(false),
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Contact Information */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <User className="h-5 w-5 text-primary" />
                    {t('contactInfo')}
                </h2>

                <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${statusCfg.className}`}>
                            <StatusIcon className="h-4 w-4" />
                            {t(statusCfg.labelKey)}
                        </span>
                    </div>

                    {/* Name */}
                    {(lead.first_name || lead.last_name) && (
                        <div>
                            <p className="text-sm text-muted-foreground">{t('columnName')}</p>
                            <p className="font-medium text-foreground">
                                {lead.first_name} {lead.last_name}
                            </p>
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('email')}</p>
                            <a href={`mailto:${lead.email}`} className="font-medium text-primary hover:underline">
                                {lead.email}
                            </a>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('phone')}</p>
                            {lead.phone ? (
                                <a href={`tel:${lead.phone}`} className="font-medium text-primary hover:underline">
                                    {lead.phone}
                                </a>
                            ) : (
                                <p className="text-muted-foreground">{t('notProvided')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Property */}
            {lead.property && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <Building2 className="h-5 w-5 text-primary" />
                        {t('columnProperty')}
                    </h2>

                    <Link
                        href={route('properties.show', { property: lead.property.id })}
                        className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                        <p className="font-medium text-foreground">{lead.property.title}</p>
                        <p className="text-sm text-muted-foreground">
                            {lead.property.street_name} {lead.property.house_number}, {lead.property.city}
                        </p>
                    </Link>
                </div>
            )}

            {/* Timeline */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">{t('timeline')}</h2>

                <div className="relative space-y-4">
                    {/* Invited */}
                    {lead.invited_at && (
                        <TimelineItem icon={<Send className="h-4 w-4" />} title={t('invitedAt')} date={formatDate(lead.invited_at)} active />
                    )}

                    {/* Viewed */}
                    <TimelineItem
                        icon={<Eye className="h-4 w-4" />}
                        title={t('viewedAt')}
                        date={formatDate(lead.viewed_at)}
                        active={!!lead.viewed_at}
                    />

                    {/* Drafting - show if status is drafting or applied */}
                    <TimelineItem
                        icon={<FileEdit className="h-4 w-4" />}
                        title={t('startedApplication')}
                        active={lead.status === 'drafting' || lead.status === 'applied'}
                    />

                    {/* Applied */}
                    <TimelineItem icon={<CheckCircle className="h-4 w-4" />} title={t('submitted')} active={lead.status === 'applied'} />
                </div>
            </div>

            {/* Linked Application */}
            {lead.application && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <FileText className="h-5 w-5 text-primary" />
                        {t('linkedApplication')}
                    </h2>

                    <Link
                        href={route('manager.applications.show', { application: lead.application.id })}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Eye className="h-4 w-4" />
                        {t('viewApplication')}
                    </Link>
                </div>
            )}

            {/* Notes */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">{t('notes')}</h2>

                {isEditingNotes ? (
                    <div className="space-y-3">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder={t('initialNotes')}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setNotes(lead.notes || '');
                                    setIsEditingNotes(false);
                                }}
                                className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSaveNotes}
                                disabled={isSavingNotes}
                                className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isSavingNotes ? '...' : t('saveNote')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {lead.notes ? (
                            <p className="text-sm whitespace-pre-wrap text-foreground">{lead.notes}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">{t('noNotes')}</p>
                        )}
                        <button
                            onClick={() => setIsEditingNotes(true)}
                            className="mt-3 cursor-pointer text-sm font-medium text-primary hover:underline"
                        >
                            {lead.notes ? t('addNote') : t('addNote')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface TimelineItemProps {
    icon: React.ReactNode;
    title: string;
    date?: string | null;
    active?: boolean;
}

function TimelineItem({ icon, title, date, active = false }: TimelineItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
            >
                {icon}
            </div>
            <div className="flex-1 pt-1">
                <p className={`text-sm font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</p>
                {date && <p className="text-xs text-muted-foreground">{date}</p>}
            </div>
        </div>
    );
}
