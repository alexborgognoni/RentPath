import type { SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { copyToClipboard } from '@/utils/clipboard';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Bath, Bed, Car, ChevronRight, Link as LinkIcon, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface PropertyTableProps {
    properties: Property[];
    onEditProperty: (property: Property) => void;
}

type SortColumn = 'title' | 'rent_amount' | 'status' | 'bedrooms' | 'bathrooms' | 'parking' | 'tenant_count' | 'size' | null;
type SortDirection = 'asc' | 'desc';

export function PropertyTable({ properties, onEditProperty }: PropertyTableProps) {
    const { translations } = usePage<SharedData>().props;
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [columnWidths, setColumnWidths] = useState({
        image: 0.8,
        property: 2.5,
        price: 1.2,
        size: 0.8,
        status: 1.2,
        beds: 0.6,
        baths: 0.6,
        parking: 0.6,
        applicants: 1,
        actions: 1.5,
    });
    const [resizing, setResizing] = useState<string | null>(null);
    const [resizeStart, setResizeStart] = useState({ x: 0, width: 0 });

    const formatNumber = (num: number | string | undefined): string => {
        if (!num) return '0';
        // Convert to number if it's a string
        const numValue = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(numValue)) return '0';
        // Remove unnecessary decimals
        const formatted = numValue.toFixed(2);
        // Remove .00
        if (formatted.endsWith('.00')) {
            return formatted.slice(0, -3);
        }
        // Remove trailing 0 (e.g., .90 -> .9)
        if (formatted.endsWith('0') && !formatted.endsWith('.00')) {
            return formatted.slice(0, -1);
        }
        return formatted;
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            available: {
                label: translate(translations, 'dashboard.statusAvailable'),
                className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            },
            leased: {
                label: translate(translations, 'dashboard.statusLeased'),
                className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            },
            maintenance: {
                label: translate(translations, 'dashboard.statusMaintenance'),
                className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            },
            under_review: {
                label: translate(translations, 'dashboard.statusUnderReview'),
                className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            },
            reserved: {
                label: translate(translations, 'dashboard.statusReserved'),
                className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            },
        };

        const config = statusConfig[status] || statusConfig.available;
        return (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.className}`}>{config.label}</span>
        );
    };

    const getCountryName = (countryCode: string | undefined): string => {
        if (!countryCode) return '';

        const countryNames: Record<string, string> = {
            CH: 'Switzerland',
            US: 'United States',
            GB: 'United Kingdom',
            DE: 'Germany',
            FR: 'France',
            IT: 'Italy',
            AT: 'Austria',
            BE: 'Belgium',
            NL: 'Netherlands',
            ES: 'Spain',
            PT: 'Portugal',
            SE: 'Sweden',
            NO: 'Norway',
            DK: 'Denmark',
            FI: 'Finland',
            PL: 'Poland',
            CZ: 'Czech Republic',
            HU: 'Hungary',
            RO: 'Romania',
            BG: 'Bulgaria',
            GR: 'Greece',
            IE: 'Ireland',
            LU: 'Luxembourg',
            CA: 'Canada',
            AU: 'Australia',
            NZ: 'New Zealand',
            JP: 'Japan',
            CN: 'China',
            KR: 'South Korea',
            IN: 'India',
            BR: 'Brazil',
            MX: 'Mexico',
            AR: 'Argentina',
            CL: 'Chile',
            ZA: 'South Africa',
            EG: 'Egypt',
            NG: 'Nigeria',
            KE: 'Kenya',
            SG: 'Singapore',
            TH: 'Thailand',
            MY: 'Malaysia',
            ID: 'Indonesia',
            PH: 'Philippines',
            VN: 'Vietnam',
            AE: 'United Arab Emirates',
            SA: 'Saudi Arabia',
            IL: 'Israel',
            TR: 'Turkey',
            RU: 'Russia',
            UA: 'Ukraine',
        };

        return countryNames[countryCode.toUpperCase()] || countryCode;
    };

    const formatAddress = (property: Property): string => {
        const parts = [property.house_number, property.street_name, property.city, getCountryName(property.country)].filter(Boolean);
        return parts.join(', ');
    };

    const handleInvite = async (e: React.MouseEvent, property: Property) => {
        e.stopPropagation();
        const rootDomain = window.location.origin.replace('manager.', '');
        const applicationUrl = property.default_token
            ? `${rootDomain}/properties/${property.id}?token=${property.default_token.token}`
            : `${rootDomain}/properties/${property.id}`;
        await copyToClipboard(applicationUrl);
        // TODO: Add toast notification
    };

    const handleEdit = (e: React.MouseEvent, property: Property) => {
        e.stopPropagation();
        onEditProperty(property);
    };

    const handleRowClick = (property: Property) => {
        window.location.href = `/properties/${property.id}`;
    };

    const handleResizeStart = (e: React.MouseEvent, column: string) => {
        e.preventDefault();
        e.stopPropagation();
        setResizing(column);
        setResizeStart({
            x: e.clientX,
            width: columnWidths[column as keyof typeof columnWidths],
        });
    };

    // Add event listeners for resize
    useEffect(() => {
        if (!resizing) return;

        const handleResizeMove = (e: MouseEvent) => {
            const diff = e.clientX - resizeStart.x;
            // Convert pixel difference to fr units (roughly 100px = 1fr)
            const frDiff = diff / 100;
            const newWidth = Math.max(0.3, resizeStart.width + frDiff);
            setColumnWidths((prev) => ({
                ...prev,
                [resizing]: newWidth,
            }));
        };

        const handleResizeEnd = () => {
            setResizing(null);
        };

        window.addEventListener('mousemove', handleResizeMove);
        window.addEventListener('mouseup', handleResizeEnd);

        return () => {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [resizing, resizeStart]);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            // Toggle direction if same column
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New column, default to ascending
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) {
            return <ArrowUpDown size={14} className="opacity-50" />;
        }
        return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    // Sort properties
    const sortedProperties = useMemo(() => {
        if (!sortColumn) return properties;

        return [...properties].sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortColumn) {
                case 'title':
                    aValue = a.title?.toLowerCase() || '';
                    bValue = b.title?.toLowerCase() || '';
                    break;
                case 'rent_amount':
                    aValue = a.rent_amount || 0;
                    bValue = b.rent_amount || 0;
                    break;
                case 'status':
                    aValue = a.status || '';
                    bValue = b.status || '';
                    break;
                case 'bedrooms':
                    aValue = a.bedrooms || 0;
                    bValue = b.bedrooms || 0;
                    break;
                case 'bathrooms':
                    aValue = a.bathrooms || 0;
                    bValue = b.bathrooms || 0;
                    break;
                case 'parking':
                    aValue = (a.parking_spots_interior || 0) + (a.parking_spots_exterior || 0);
                    bValue = (b.parking_spots_interior || 0) + (b.parking_spots_exterior || 0);
                    break;
                case 'tenant_count':
                    aValue = a.tenant_count || 0;
                    bValue = b.tenant_count || 0;
                    break;
                case 'size':
                    aValue = a.size || 0;
                    bValue = b.size || 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [properties, sortColumn, sortDirection]);

    const gridTemplateColumns = `${columnWidths.image}fr ${columnWidths.property}fr ${columnWidths.price}fr ${columnWidths.size}fr ${columnWidths.status}fr ${columnWidths.beds}fr ${columnWidths.baths}fr ${columnWidths.parking}fr ${columnWidths.applicants}fr ${columnWidths.actions}fr`;

    return (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card">
            {/* Column Dividers - Full Height */}
            <div className="pointer-events-none absolute top-0 bottom-0 left-6" style={{ width: `calc(100% - 48px)` }}>
                <div className="relative h-full" style={{ display: 'grid', gridTemplateColumns, gap: 0 }}>
                    {/* Image divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Property divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Price divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Size divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Status divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Beds divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Baths divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Parking divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                    {/* Applicants divider */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/50" />
                    </div>
                </div>
            </div>

            {/* Table Header */}
            <div className="relative z-10 grid border-b border-border bg-muted/50 px-6 py-4" style={{ gridTemplateColumns, gap: 0 }}>
                {/* Image column - no label */}
                <div className="relative px-2">
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'image')}
                    />
                </div>

                {/* Property */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('title')}
                    >
                        <span>{translate(translations, 'dashboard.columnProperty')}</span>
                        {getSortIcon('title')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'property')}
                    />
                </div>

                {/* Price */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('rent_amount')}
                    >
                        <span>Price</span>
                        {getSortIcon('rent_amount')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'price')}
                    />
                </div>

                {/* Size */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('size')}
                    >
                        <span>Size</span>
                        {getSortIcon('size')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'size')}
                    />
                </div>

                {/* Status */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('status')}
                    >
                        <span>{translate(translations, 'dashboard.columnStatus')}</span>
                        {getSortIcon('status')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'status')}
                    />
                </div>

                {/* Beds */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('bedrooms')}
                    >
                        <span>Beds</span>
                        {getSortIcon('bedrooms')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'beds')}
                    />
                </div>

                {/* Baths */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('bathrooms')}
                    >
                        <span>Baths</span>
                        {getSortIcon('bathrooms')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'baths')}
                    />
                </div>

                {/* Parking */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('parking')}
                    >
                        <span>Parking</span>
                        {getSortIcon('parking')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'parking')}
                    />
                </div>

                {/* Applicants */}
                <div className="relative px-2">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                        onClick={() => handleSort('tenant_count')}
                    >
                        <span>{translate(translations, 'dashboard.columnApplicants')}</span>
                        {getSortIcon('tenant_count')}
                    </div>
                    <div
                        className="pointer-events-auto absolute top-0 right-0 bottom-0 z-10 -mr-1 w-2 cursor-col-resize transition-colors hover:bg-primary/30"
                        onMouseDown={(e) => handleResizeStart(e, 'applicants')}
                    />
                </div>

                {/* Actions */}
                <div className="px-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    {translate(translations, 'dashboard.columnActions')}
                </div>
            </div>

            {/* Table Body */}
            <div className="relative z-10 divide-y divide-border">
                {sortedProperties.map((property) => {
                    // Find the main image
                    const mainImage = property.images?.find((img) => img.is_main) || property.images?.[0];

                    const totalParkingSpots = (property.parking_spots_interior || 0) + (property.parking_spots_exterior || 0);

                    return (
                        <div
                            key={property.id}
                            onClick={() => handleRowClick(property)}
                            className="grid cursor-pointer px-6 py-4 transition-colors hover:bg-muted/30"
                            style={{ gridTemplateColumns, gap: 0 }}
                        >
                            {/* Image */}
                            <div className="flex items-center px-2">
                                {mainImage ? (
                                    <img
                                        src={mainImage.image_url || ''}
                                        alt={property.title}
                                        className="h-16 w-full rounded-lg border border-border object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-full items-center justify-center rounded-lg border border-border bg-muted">
                                        <span className="text-xs text-muted-foreground">No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Property */}
                            <div className="flex min-w-0 flex-col justify-center px-2">
                                <div className="truncate font-semibold text-foreground">{property.title}</div>
                                <div className="truncate text-sm text-muted-foreground">{formatAddress(property)}</div>
                            </div>

                            {/* Price */}
                            <div className="flex flex-col items-center justify-center px-2">
                                <div className="font-bold text-foreground">€{formatNumber(property.rent_amount)}</div>
                                <div className="text-sm text-muted-foreground">{translate(translations, 'dashboard.perMonth')}</div>
                            </div>

                            {/* Size */}
                            <div className="flex flex-col items-center justify-center px-2">
                                <div className="font-bold text-foreground">{property.size ? formatNumber(property.size) : 'N/A'}</div>
                                <div className="text-sm text-muted-foreground">m²</div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-center px-2">{getStatusBadge(property.status || 'available')}</div>

                            {/* Beds */}
                            <div className="flex items-center justify-center gap-2 px-2 text-sm">
                                <Bed size={14} className="text-muted-foreground" />
                                <span className="font-medium text-foreground">{formatNumber(property.bedrooms)}</span>
                            </div>

                            {/* Baths */}
                            <div className="flex items-center justify-center gap-2 px-2 text-sm">
                                <Bath size={14} className="text-muted-foreground" />
                                <span className="font-medium text-foreground">{formatNumber(property.bathrooms)}</span>
                            </div>

                            {/* Parking */}
                            <div className="flex items-center justify-center gap-2 px-2 text-sm">
                                {totalParkingSpots > 0 ? (
                                    <>
                                        <Car size={14} className="text-muted-foreground" />
                                        <span className="font-medium text-foreground">{totalParkingSpots}</span>
                                    </>
                                ) : (
                                    <span className="font-medium text-muted-foreground">-</span>
                                )}
                            </div>

                            {/* Applicants */}
                            <div className="flex items-center justify-center gap-2 px-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                    <Users size={16} className="text-muted-foreground" />
                                </div>
                                <span className="font-semibold text-foreground">{property.tenant_count || 0}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 px-2">
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
