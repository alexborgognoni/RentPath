import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ChevronRight, Link as LinkIcon, Pencil, Users } from 'lucide-react';
import type { Property } from '@/types/dashboard';

interface PropertyTableProps {
    properties: Property[];
    onEditProperty: (property: Property) => void;
}

export function PropertyTable({ properties, onEditProperty }: PropertyTableProps) {
    const { translations } = usePage<SharedData>().props;

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
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const formatAddress = (property: Property): string => {
        const parts = [
            property.house_number,
            property.street_name,
            property.city,
        ].filter(Boolean);
        return parts.join(', ');
    };

    const handleInvite = (e: React.MouseEvent, property: Property) => {
        e.stopPropagation();
        const applicationUrl = `${window.location.origin}/invite/${property.invite_token}`;
        navigator.clipboard.writeText(applicationUrl);
        // TODO: Add toast notification
    };

    const handleEdit = (e: React.MouseEvent, property: Property) => {
        e.stopPropagation();
        onEditProperty(property);
    };

    const handleRowClick = (property: Property) => {
        window.location.href = `/property/${property.id}`;
    };

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_0.8fr_1fr_1.2fr] gap-4 border-b border-border bg-muted/50 px-6 py-4">
                <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {translate(translations, 'dashboard.columnProperty')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {translate(translations, 'dashboard.columnPrice')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {translate(translations, 'dashboard.columnStatus')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {translate(translations, 'dashboard.columnBeds')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {translate(translations, 'dashboard.columnApplicants')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {translate(translations, 'dashboard.columnActions')}
                </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
                {properties.map((property) => (
                    <div
                        key={property.id}
                        onClick={() => handleRowClick(property)}
                        className="grid cursor-pointer grid-cols-[2fr_1fr_1fr_0.8fr_1fr_1.2fr] gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
                    >
                        {/* Property */}
                        <div className="flex items-center gap-4">
                            {(property.image_path || property.image_url) && (
                                <img
                                    src={property.image_path ? `/properties/${property.id}/image` : property.image_url}
                                    alt={property.title}
                                    className="h-12 w-12 rounded-lg border border-border object-cover"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="truncate font-semibold text-foreground">{property.title}</div>
                                <div className="truncate text-sm text-muted-foreground">
                                    {formatAddress(property)}
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col justify-center">
                            <div className="font-bold text-foreground">
                                €{property.rent_amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {translate(translations, 'dashboard.perMonth')}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center">
                            {getStatusBadge(property.status || 'available')}
                        </div>

                        {/* Beds */}
                        <div className="flex flex-col justify-center">
                            <div className="font-bold text-foreground">{property.bedrooms || 0}</div>
                            <div className="text-sm text-muted-foreground">
                                {translate(translations, 'dashboard.beds')}
                            </div>
                        </div>

                        {/* Applicants */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <Users size={16} className="text-muted-foreground" />
                            </div>
                            <span className="font-semibold text-foreground">{property.tenant_count || 0}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => handleInvite(e, property)}
                                className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                            >
                                <LinkIcon size={16} />
                                <span>{translate(translations, 'dashboard.invite')}</span>
                            </button>
                            <button
                                onClick={(e) => handleEdit(e, property)}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                                <span>{translate(translations, 'dashboard.edit')}</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(property);
                                }}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
