import { DataTable } from '@/components/ui/data-table';
import type { Lead, SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Archive, CheckCircle, Eye, FileEdit, Send } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface LeadsTableProps {
    leads: Lead[];
    onRowClick: (lead: Lead) => void;
}

const columnHelper = createColumnHelper<Lead>();

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

const sourceConfig: Record<string, { labelKey: string; className: string }> = {
    manual: {
        labelKey: 'sourceManual',
        className: 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30',
    },
    invite: {
        labelKey: 'sourceInvite',
        className: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    },
    token_signup: {
        labelKey: 'sourceTokenSignup',
        className: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    },
    application: {
        labelKey: 'sourceApplication',
        className: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
    inquiry: {
        labelKey: 'sourceInquiry',
        className: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
    },
};

export function LeadsTable({ leads, onRowClick }: LeadsTableProps) {
    const { translations, locale } = usePage<SharedData>().props;
    const t = useCallback((key: string) => translate(translations.manager.leads, key), [translations.manager.leads]);

    const columns = useMemo(
        () => [
            // Name column
            columnHelper.display({
                id: 'name',
                header: () => t('columnName'),
                cell: ({ row }) => {
                    const lead = row.original;
                    const name = lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
                    return (
                        <div className="max-w-44">
                            <p className="truncate font-medium text-foreground">{name || '-'}</p>
                            <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                        </div>
                    );
                },
            }),

            // Property column
            columnHelper.accessor('property', {
                header: () => t('columnProperty'),
                cell: ({ row }) => {
                    const property = row.original.property;
                    return (
                        <div className="max-w-48">
                            <p className="truncate font-medium text-foreground">{property?.title || '-'}</p>
                            <p className="truncate text-xs text-muted-foreground">
                                {property?.street_name} {property?.house_number}, {property?.city}
                            </p>
                        </div>
                    );
                },
            }),

            // Status column
            columnHelper.accessor('status', {
                header: () => t('columnStatus'),
                cell: ({ getValue }) => {
                    const status = getValue();
                    const config = statusConfig[status] || statusConfig.invited;
                    const Icon = config.icon;
                    return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>
                            <Icon className="h-3 w-3" />
                            {t(config.labelKey)}
                        </span>
                    );
                },
            }),

            // Source column
            columnHelper.accessor('source', {
                header: () => t('columnSource'),
                cell: ({ getValue }) => {
                    const source = getValue();
                    const config = sourceConfig[source] || sourceConfig.manual;
                    return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>
                            {t(config.labelKey)}
                        </span>
                    );
                },
            }),

            // Invited date column
            columnHelper.accessor('invited_at', {
                header: () => t('columnInvited'),
                cell: ({ getValue }) => {
                    const date = getValue();
                    if (!date) return <span className="text-muted-foreground">-</span>;
                    return (
                        <span className="text-sm text-foreground">
                            {new Date(date).toLocaleDateString(locale, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    );
                },
            }),

            // Actions column
            columnHelper.display({
                id: 'actions',
                header: () => t('columnActions'),
                cell: ({ row }) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(row.original);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                        <Eye className="h-3 w-3" />
                        {t('viewDetails')}
                    </button>
                ),
            }),
        ],
        [locale, onRowClick, t],
    );

    return <DataTable columns={columns} data={leads} onRowClick={onRowClick} />;
}
