import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/components/ui/toast';
import type { SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { copyToClipboard } from '@/utils/clipboard';
import { formatAddress } from '@/utils/country-utils';
import { useReactiveCurrency } from '@/utils/currency-utils';
import { getRootDomainUrl, route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Bath, Bed, Car, ChevronRight, Link as LinkIcon, Users } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface PropertyTableProps {
    properties: Property[];
    onEditProperty: (property: Property) => void;
}

const columnHelper = createColumnHelper<Property>();

// Status badge configuration for simplified lifecycle statuses
const statusConfig: Record<string, { labelKey: string; className: string }> = {
    draft: {
        labelKey: 'statusDraft',
        className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    vacant: {
        labelKey: 'statusVacant',
        className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    leased: {
        labelKey: 'statusLeased',
        className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    maintenance: {
        labelKey: 'statusMaintenance',
        className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    archived: {
        labelKey: 'statusArchived',
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

export function PropertyTable({ properties, onEditProperty }: PropertyTableProps) {
    const { translations, appUrlScheme, appDomain, appPort } = usePage<SharedData>().props;
    const { formatRent } = useReactiveCurrency();

    const handleInvite = useCallback(
        async (e: React.MouseEvent, property: Property) => {
            e.stopPropagation();
            const rootDomain = getRootDomainUrl(appUrlScheme, appDomain, appPort);
            const applicationUrl = property.default_token
                ? `${rootDomain}/properties/${property.id}?token=${property.default_token.token}`
                : `${rootDomain}/properties/${property.id}`;

            const success = await copyToClipboard(applicationUrl);
            if (success) {
                toast.success(translate(translations.manager.properties, 'linkCopied'));
            } else {
                toast.error(translate(translations.manager.properties, 'linkCopyFailed'));
            }
        },
        [appUrlScheme, appDomain, appPort, translations],
    );

    const handleEdit = useCallback(
        (e: React.MouseEvent, property: Property) => {
            e.stopPropagation();
            onEditProperty(property);
        },
        [onEditProperty],
    );

    const handleRowClick = useCallback((property: Property) => {
        window.location.href = route('properties.show', { property: property.id });
    }, []);

    const columns = useMemo(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (): ColumnDef<Property, any>[] => [
            // Image column
            columnHelper.display({
                id: 'image',
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
                            <span className="text-xs text-muted-foreground">{translate(translations.manager.properties, 'noImage')}</span>
                        </div>
                    );
                },
            }),

            // Property column (title + address)
            columnHelper.accessor('title', {
                header: () => translate(translations.manager.properties, 'columnProperty'),
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
                header: () => translate(translations.manager.properties, 'columnPrice'),
                cell: ({ row }) => {
                    const property = row.original;
                    return (
                        <div className="flex flex-col items-center">
                            <div className="font-bold text-foreground">{formatRent(property.rent_amount, property.rent_currency)}</div>
                            <div className="text-sm text-muted-foreground">{translate(translations.manager.properties, 'perMonth')}</div>
                        </div>
                    );
                },
            }),

            // Size column
            columnHelper.accessor('size', {
                header: () => translate(translations.manager.properties, 'columnSize'),
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
                header: () => translate(translations.manager.properties, 'columnStatus'),
                cell: ({ getValue }) => {
                    const status = getValue() || 'vacant';
                    const config = statusConfig[status] || statusConfig.vacant;
                    return (
                        <div className="flex justify-center">
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.className}`}>
                                {translate(translations.manager.properties, config.labelKey)}
                            </span>
                        </div>
                    );
                },
            }),

            // Beds column
            columnHelper.accessor('bedrooms', {
                header: () => translate(translations.manager.properties, 'columnBeds'),
                cell: ({ getValue }) => (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Bed size={14} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">{formatNumber(getValue())}</span>
                    </div>
                ),
            }),

            // Baths column
            columnHelper.accessor('bathrooms', {
                header: () => translate(translations.manager.properties, 'columnBaths'),
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
                header: () => translate(translations.manager.properties, 'columnParking'),
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
                header: () => translate(translations.manager.properties, 'columnApplicants'),
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
                header: () => translate(translations.manager.properties, 'columnActions'),
                cell: ({ row }) => {
                    const property = row.original;
                    return (
                        <div className="flex items-center gap-1 whitespace-nowrap">
                            <button
                                onClick={(e) => handleInvite(e, property)}
                                title={translate(translations.manager.properties, 'invite')}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                            >
                                <LinkIcon size={14} />
                            </button>
                            <button
                                onClick={(e) => handleEdit(e, property)}
                                className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                                {translate(translations.manager.properties, 'edit')}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(property);
                                }}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    );
                },
            }),
        ],
        [translations, formatRent, handleInvite, handleEdit, handleRowClick],
    );

    return <DataTable columns={columns} data={properties} onRowClick={handleRowClick} />;
}
