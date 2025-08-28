import type { Property } from '@/types/dashboard';
import { translate as t } from '@/utils/translate-utils';
import { Copy, ExternalLink, Users } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
    onEdit?: (property: Property) => void;
}

export function PropertyCard({ property, onEdit }: PropertyCardProps) {
    // Mock currency formatting for now (since backend doesn't exist yet)
    const formatCurrency = (amount: number) => `€${amount.toLocaleString()}`;

    const applicationUrl = `${window.location.origin}/invite/${property.invite_token}`;

    const copyApplicationLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(applicationUrl);
        // TODO: Add toast notification here when toast system is available
    };

    const handleCardClick = () => {
        // Navigate to property detail page
        window.location.href = `/property/${property.id}`;
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(property);
        }
    };

    return (
        <div
            className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg"
            onClick={handleCardClick}
        >
            {/* Property Image */}
            {property.image_url && (
                <div className="mb-4 overflow-hidden rounded-xl border border-border">
                    <img src={property.image_url} alt={property.title} className="h-48 w-full object-cover" />
                </div>
            )}

            <h3 className="mb-2 text-xl font-bold text-foreground">{property.title}</h3>
            <p className="mb-3 text-muted-foreground">
                {property.address}
            </p>
            <p className="mb-4 text-lg font-bold text-primary">
                {formatCurrency(property.rent_amount)}/{t('month')}
            </p>

            <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex flex-col space-y-1">
                    <span className="font-medium">
                        {property.bedrooms || 'N/A'} {t('bedrooms')} • {property.bathrooms || 'N/A'} {t('bathrooms')}
                    </span>
                    {property.size && (
                        <span className="font-medium text-muted-foreground/70">
                            {property.size} {property.size_unit === 'square_meters' ? 'm²' : 'ft²'}
                        </span>
                    )}
                </div>
                <span className="flex items-center rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground">
                    <Users size={16} className="mr-1" />
                    {property.tenant_count || 0}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={copyApplicationLink}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-xl border border-border bg-muted py-3 font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-muted/80"
                    >
                        <Copy size={16} />
                        <span>{t('copyApplicationLink')}</span>
                    </button>
                    {onEdit && (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center justify-center rounded-xl border border-border bg-muted p-3 text-muted-foreground transition-all hover:border-primary/50 hover:bg-muted/80"
                            title="Edit Property"
                        >
                            <ExternalLink size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
