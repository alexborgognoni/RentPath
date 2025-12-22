import { DataTable } from '@/components/ui/data-table';
import type { Application, SharedData } from '@/types';
import { useReactiveCurrency } from '@/utils/currency-utils';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { AlertCircle, Calendar, CheckCircle, Clock, Eye, FileCheck, FileText, Home, XCircle } from 'lucide-react';
import { useMemo } from 'react';

interface ApplicationsTableProps {
    applications: Application[];
    onRowClick: (application: Application) => void;
}

const columnHelper = createColumnHelper<Application>();

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
    withdrawn: {
        labelKey: 'statusWithdrawn',
        className: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
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
        icon: FileText,
    },
};

export function ApplicationsTable({ applications, onRowClick }: ApplicationsTableProps) {
    const { translations, locale } = usePage<SharedData>().props;
    const { formatAmount } = useReactiveCurrency();
    const t = (key: string) => translate(translations.applications, key);

    const columns = useMemo(
        (): ColumnDef<Application, unknown>[] => [
            // Property column
            columnHelper.accessor('property', {
                header: () => t('columnProperty'),
                cell: ({ row }) => {
                    const property = row.original.property;
                    return (
                        <div className="max-w-[200px]">
                            <p className="truncate font-medium text-foreground">{property?.title || '-'}</p>
                            <p className="truncate text-xs text-muted-foreground">
                                {property?.street_name} {property?.house_number}, {property?.city}
                            </p>
                        </div>
                    );
                },
            }),

            // Applicant column
            columnHelper.display({
                id: 'applicant',
                header: () => t('columnApplicant'),
                cell: ({ row }) => {
                    const user = row.original.tenant_profile?.user;
                    const name = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '-';
                    return (
                        <div className="max-w-[180px]">
                            <p className="truncate font-medium text-foreground">{name || '-'}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email || '-'}</p>
                        </div>
                    );
                },
            }),

            // Status column
            columnHelper.accessor('status', {
                header: () => t('columnStatus'),
                cell: ({ getValue }) => {
                    const status = getValue();
                    const config = statusConfig[status] || statusConfig.submitted;
                    const Icon = config.icon;
                    return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>
                            <Icon className="h-3 w-3" />
                            {t(config.labelKey)}
                        </span>
                    );
                },
            }),

            // Submitted date column
            columnHelper.accessor('submitted_at', {
                header: () => t('columnSubmitted'),
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

            // Move-in date column
            columnHelper.accessor('desired_move_in_date', {
                header: () => t('columnMoveIn'),
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

            // Income column
            columnHelper.accessor('snapshot_monthly_income', {
                header: () => t('columnIncome'),
                cell: ({ row }) => {
                    const income = row.original.snapshot_monthly_income;
                    const currency = row.original.snapshot_income_currency || 'eur';
                    if (!income) return <span className="text-muted-foreground">-</span>;
                    return <span className="text-sm font-medium text-foreground">{formatAmount(income, currency)}</span>;
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
        [translations, locale, formatAmount, onRowClick, t],
    );

    return <DataTable columns={columns} data={applications} onRowClick={onRowClick} />;
}
