import { PropertyFilters, type PropertyFilterState } from '@/components/dashboard/property-filters';
import { PropertyTable } from '@/components/dashboard/property-table';
import type { Property } from '@/types/dashboard';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Building, Filter, Home, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PropertiesSectionProps {
    properties: Property[];
    onAddProperty: () => void;
    onEditProperty: (property: Property) => void;
}

export function PropertiesSection({ properties = [], onAddProperty, onEditProperty }: PropertiesSectionProps) {
    const { translations } = usePage<SharedData>().props;
    const [filtersOpen, setFiltersOpen] = useState(true);
    const [filters, setFilters] = useState<PropertyFilterState>({
        search: '',
        bedrooms: '',
        bathrooms: '',
        minPrice: '',
        maxPrice: '',
        minSize: '',
        maxSize: '',
    });

    // Filter properties based on current filters
    const filteredProperties = useMemo(() => {
        return properties.filter((property) => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    property.title?.toLowerCase().includes(searchLower) ||
                    property.street_name?.toLowerCase().includes(searchLower) ||
                    property.city?.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Bedrooms filter
            if (filters.bedrooms) {
                const bedroomCount = parseInt(filters.bedrooms);
                if (bedroomCount === 5) {
                    // 5+ bedrooms
                    if ((property.bedrooms || 0) < 5) return false;
                } else {
                    if (property.bedrooms !== bedroomCount) return false;
                }
            }

            // Bathrooms filter
            if (filters.bathrooms) {
                const bathroomCount = parseInt(filters.bathrooms);
                if (bathroomCount === 4) {
                    // 4+ bathrooms
                    if ((property.bathrooms || 0) < 4) return false;
                } else {
                    if (property.bathrooms !== bathroomCount) return false;
                }
            }

            // Price range filter
            if (filters.minPrice) {
                const minPrice = parseInt(filters.minPrice);
                if (property.rent_amount < minPrice) return false;
            }
            if (filters.maxPrice) {
                const maxPrice = parseInt(filters.maxPrice);
                if (property.rent_amount > maxPrice) return false;
            }

            // Size range filter
            if (filters.minSize) {
                const minSize = parseInt(filters.minSize);
                if (!property.size || property.size < minSize) return false;
            }
            if (filters.maxSize) {
                const maxSize = parseInt(filters.maxSize);
                if (!property.size || property.size > maxSize) return false;
            }

            return true;
        });
    }, [properties, filters]);

    return (
        <div className="mt-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                    <Home className="text-primary" size={32} />
                    <span>
                        {translate(translations, 'dashboard.properties')} <span className="text-2xl">({filteredProperties.length})</span>
                    </span>
                </h1>
                <button
                    onClick={onAddProperty}
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                >
                    <Plus size={18} />
                    <span>{translate(translations, 'dashboard.addProperty')}</span>
                </button>
            </div>

            {/* Filters Card */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div
                    className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/30 ${filtersOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Filter
                            size={16}
                            className="transition-transform duration-300"
                            style={{ transform: filtersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                        <span>{translate(translations, 'dashboard.filters')}</span>
                    </div>
                </div>
                {filtersOpen && (
                    <div className="border-t border-border p-4">
                        <PropertyFilters onFilterChange={setFilters} />
                    </div>
                )}
            </div>

            {/* Content */}
            {properties.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card py-16 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                        <Building size={40} className="text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                        {translate(translations, 'dashboard.noPropertiesYet')}
                    </h3>
                    <p className="mx-auto max-w-md text-muted-foreground">
                        {translate(translations, 'dashboard.noPropertiesDesc')}
                    </p>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card py-16 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                        <Building size={40} className="text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">No properties match your filters</h3>
                    <p className="mx-auto max-w-md text-muted-foreground">
                        Try adjusting your search criteria to find more properties.
                    </p>
                </div>
            ) : (
                <PropertyTable properties={filteredProperties} onEditProperty={onEditProperty} />
            )}
        </div>
    );
}
