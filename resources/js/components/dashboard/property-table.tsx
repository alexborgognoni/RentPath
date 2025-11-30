import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/components/ui/toast';
import type { SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { copyToClipboard } from '@/utils/clipboard';
import { formatAddress } from '@/utils/country-utils';
import { getCurrency } from '@/utils/currency-utils';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Bath, Bed, Car, ChevronRight, Link as LinkIcon, Users } from 'lucide-react';
import { useMemo } from 'react';

interface PropertyTableProps {
    properties: Property[];
    onEditProperty: (property: Property) => void;
}

const columnHelper = createColumnHelper<Property>();

// Status badge configuration for all 9 statuses
const statusConfig: Record<string, { labelKey: string; className: string }> = {
    inactive: {
        labelKey: 'dashboard.statusInactive',
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    },
    available: {
        labelKey: 'dashboard.statusAvailable',
        className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    application_received: {
        labelKey: 'dashboard.statusApplicationReceived',
        className: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    },
    under_review: {
        labelKey: 'dashboard.statusUnderReview',
        className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    visit_scheduled: {
        labelKey: 'dashboard.statusVisitScheduled',
        className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    approved: {
        labelKey: 'dashboard.statusApproved',
        className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    leased: {
        labelKey: 'dashboard.statusLeased',
        className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    maintenance: {
        labelKey: 'dashboard.statusMaintenance',
        className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    archived: {
        labelKey: 'dashboard.statusArchived',
        className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    },
};

function formatNumber(num: number | string | undefined): string {
    if (!num) return '0';
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '0';

    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat('en', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    }).format(numValue);
}

function formatPrice(amount: number | undefined, currencyCode: string = 'eur'): string {
    if (!amount) return '€0';
    const currency = getCurrency(currencyCode.toUpperCase() as 'EUR' | 'USD' | 'GBP' | 'CHF');
    return `${currency.symbol}${formatNumber(amount)}`;
}

export function PropertyTable({ properties, onEditProperty }: PropertyTableProps) {
    const { translations } = usePage<SharedData>().props;

    const handleInvite = async (e: React.MouseEvent, property: Property) => {
        e.stopPropagation();
        const rootDomain = window.location.origin.replace('manager.', '');
        const applicationUrl = property.default_token
            ? `${rootDomain}/properties/${property.id}?token=${property.default_token.token}`
            : `${rootDomain}/properties/${property.id}`;

        const success = await copyToClipboard(applicationUrl);
        if (success) {
            toast.success(translate(translations, 'dashboard.linkCopied'));
        } else {
            toast.error(translate(translations, 'dashboard.linkCopyFailed'));
        }
    };

    const handleEdit = (e: React.MouseEvent, property: Property) => {
        e.stopPropagation();
        onEditProperty(property);
    };

    const handleRowClick = (property: Property) => {
        window.location.href = `/properties/${property.id}`;
    };

    const columns = useMemo(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (): ColumnDef<Property, any>[] => [
            // Image column
            columnHelper.display({
                id: 'image',
                size: 80,
                cell: ({ row }) => {
                    const property = row.original;
                    const mainImage = property.images?.find((img) => img.is_main) || property.images?.[0];

                    if (mainImage) {
                        return (
                            <img
                                src={mainImage.image_url || ''}
                                alt={property.title}
                                className="h-16 w-20 rounded-lg border border-border object-cover"
                            />
                        );
                    }

                    return (
                        <div className="flex h-16 w-20 items-center justify-center rounded-lg border border-border bg-muted">
                            <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                    );
                },
            }),

            // Property column (title + address)
            columnHelper.accessor('title', {
                header: () => translate(translations, 'dashboard.columnProperty'),
                size: 250,
                cell: ({ row }) => {
                    const property = row.original;
                    return (
                        <div className="flex min-w-0 flex-col">
                            <div className="truncate font-semibold text-foreground">{property.title}</div>
                            <div className="truncate text-sm text-muted-foreground">{formatAddress(property)}</div>
                        </div>
                    );
                },
            }),

            // Price column
            columnHelper.accessor('rent_amount', {
                header: () => translate(translations, 'dashboard.columnPrice'),
                size: 120,
                cell: ({ row }) => {
                    const property = row.original;
                    return (
                        <div className="flex flex-col items-center">
                            <div className="font-bold text-foreground">{formatPrice(property.rent_amount, property.rent_currency)}</div>
                            <div className="text-sm text-muted-foreground">{translate(translations, 'dashboard.perMonth')}</div>
                        </div>
                    );
                },
            }),

            // Size column
            columnHelper.accessor('size', {
                header: 'Size',
                size: 80,
                cell: ({ getValue }) => {
                    const size = getValue();
                    return (
                        <div className="flex flex-col items-center">
                            <div className="font-bold text-foreground">{size ? formatNumber(size) : 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">m²</div>
                        </div>
                    );
                },
            }),

            // Status column
            columnHelper.accessor('status', {
                header: () => translate(translations, 'dashboard.columnStatus'),
                size: 140,
                cell: ({ getValue }) => {
                    const status = getValue() || 'available';
                    const config = statusConfig[status] || statusConfig.available;
                    return (
                        <div className="flex justify-center">
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.className}`}>
                                {translate(translations, config.labelKey)}
                            </span>
                        </div>
                    );
                },
            }),

            // Beds column
            columnHelper.accessor('bedrooms', {
                header: 'Beds',
                size: 70,
                cell: ({ getValue }) => (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Bed size={14} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">{formatNumber(getValue())}</span>
                    </div>
                ),
            }),

            // Baths column
            columnHelper.accessor('bathrooms', {
                header: 'Baths',
                size: 70,
                cell: ({ getValue }) => (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Bath size={14} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">{formatNumber(getValue())}</span>
                    </div>
                ),
            }),

            // Parking column
            columnHelper.display({
                id: 'parking',
                header: 'Parking',
                size: 70,
                cell: ({ row }) => {
                    const property = row.original;
                    const totalParkingSpots = (property.parking_spots_interior || 0) + (property.parking_spots_exterior || 0);

                    if (totalParkingSpots > 0) {
                        return (
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <Car size={14} className="text-muted-foreground" />
                                <span className="font-medium text-foreground">{totalParkingSpots}</span>
                            </div>
                        );
                    }

                    return <div className="text-center font-medium text-muted-foreground">-</div>;
                },
            }),

            // Applicants column
            columnHelper.accessor('tenant_count', {
                header: () => translate(translations, 'dashboard.columnApplicants'),
                size: 100,
                cell: ({ getValue }) => (
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Users size={16} className="text-muted-foreground" />
                        </div>
                        <span className="font-semibold text-foreground">{getValue() || 0}</span>
                    </div>
                ),
            }),

            // Actions column
            columnHelper.display({
                id: 'actions',
                header: () => translate(translations, 'dashboard.columnActions'),
                size: 150,
                cell: ({ row }) => {
                    const property = row.original;
                    return (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => handleInvite(e, property)}
                                className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                            >
                                <LinkIcon size={14} />
                                <span>{translate(translations, 'dashboard.invite')}</span>
                            </button>
                            <button
                                onClick={(e) => handleEdit(e, property)}
                                className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                                <span>{translate(translations, 'dashboard.edit')}</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(property);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    );
                },
            }),
        ],
        [translations],
    );

    return <DataTable columns={columns} data={properties} onRowClick={handleRowClick} />;
}
