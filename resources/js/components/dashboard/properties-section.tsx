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
        status: '',
        type: '',
        minRent: '',
        maxRent: '',
        bedrooms: '',
        city: '',
        minSize: '',
        maxSize: '',
        floor: '',
        hasElevator: null,
        yearBuiltMin: '',
        yearBuiltMax: '',
        hasGarden: null,
        hasRooftop: null,
        hasAirConditioning: null,
        hasFireplace: null,
        hasLaundry: null,
        hasCellar: null,
        energyClass: '',
        heatingType: '',
        parkingInterior: '',
        parkingExterior: '',
        kitchenEquipped: null,
        kitchenSeparated: null,
        subtype: '',
        availableFrom: '',
    });

    // Extract unique cities from properties
    const cities = useMemo(() => {
        const uniqueCities = new Set<string>();
        properties.forEach(property => {
            if (property.city) {
                uniqueCities.add(property.city);
            }
        });
        return Array.from(uniqueCities).sort();
    }, [properties]);

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

            // Status filter
            if (filters.status && property.status !== filters.status) {
                return false;
            }

            // Type filter
            if (filters.type && property.type !== filters.type) {
                return false;
            }

            // City filter
            if (filters.city && property.city !== filters.city) {
                return false;
            }

            // Bedrooms filter (at least)
            if (filters.bedrooms) {
                const bedroomCount = parseInt(filters.bedrooms);
                if ((property.bedrooms || 0) < bedroomCount) return false;
            }

            // Rent range filter
            if (filters.minRent) {
                const minRent = parseFloat(filters.minRent);
                if (property.rent_amount < minRent) return false;
            }
            if (filters.maxRent) {
                const maxRent = parseFloat(filters.maxRent);
                if (property.rent_amount > maxRent) return false;
            }

            // Size range filter
            if (filters.minSize) {
                const minSize = parseFloat(filters.minSize);
                if (!property.size || property.size < minSize) return false;
            }
            if (filters.maxSize) {
                const maxSize = parseFloat(filters.maxSize);
                if (!property.size || property.size > maxSize) return false;
            }

            // Floor filter
            if (filters.floor) {
                const floor = parseInt(filters.floor);
                if (property.floor_level !== floor) return false;
            }

            // Elevator filter
            if (filters.hasElevator !== null && property.has_elevator !== filters.hasElevator) {
                return false;
            }

            // Year built filter
            if (filters.yearBuiltMin) {
                const yearMin = parseInt(filters.yearBuiltMin);
                if (!property.year_built || property.year_built < yearMin) return false;
            }
            if (filters.yearBuiltMax) {
                const yearMax = parseInt(filters.yearBuiltMax);
                if (!property.year_built || property.year_built > yearMax) return false;
            }

            // Amenities filters
            if (filters.hasGarden !== null && property.has_garden !== filters.hasGarden) return false;
            if (filters.hasRooftop !== null && property.has_rooftop !== filters.hasRooftop) return false;
            if (filters.hasAirConditioning !== null && property.has_air_conditioning !== filters.hasAirConditioning) return false;
            if (filters.hasFireplace !== null && property.has_fireplace !== filters.hasFireplace) return false;
            if (filters.hasLaundry !== null && property.has_laundry !== filters.hasLaundry) return false;
            if (filters.hasCellar !== null && property.has_cellar !== filters.hasCellar) return false;

            // Energy class filter
            if (filters.energyClass && property.energy_class !== filters.energyClass) {
                return false;
            }

            // Heating type filter
            if (filters.heatingType && property.heating_type !== filters.heatingType) {
                return false;
            }

            // Parking filters
            if (filters.parkingInterior) {
                const parkingInt = parseInt(filters.parkingInterior);
                if ((property.parking_spots_interior || 0) < parkingInt) return false;
            }
            if (filters.parkingExterior) {
                const parkingExt = parseInt(filters.parkingExterior);
                if ((property.parking_spots_exterior || 0) < parkingExt) return false;
            }

            // Kitchen filters
            if (filters.kitchenEquipped !== null && property.kitchen_equipped !== filters.kitchenEquipped) return false;
            if (filters.kitchenSeparated !== null && property.kitchen_separated !== filters.kitchenSeparated) return false;

            // Availability filter
            if (filters.availableFrom) {
                const filterDate = new Date(filters.availableFrom);
                const propertyDate = property.available_date ? new Date(property.available_date) : null;
                if (!propertyDate || propertyDate > filterDate) return false;
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
                        <PropertyFilters onFilterChange={setFilters} cities={cities} />
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
