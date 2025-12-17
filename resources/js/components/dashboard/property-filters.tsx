import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PropertyFiltersProps {
    onFilterChange: (filters: PropertyFilterState) => void;
    cities: string[];
}

export interface PropertyFilterState {
    // Quick filters
    search: string;
    status: string;
    type: string;
    minRent: string;
    maxRent: string;
    bedrooms: string;
    city: string;

    // More filters
    minSize: string;
    maxSize: string;
    floor: string;
    hasElevator: boolean | null;
    yearBuiltMin: string;
    yearBuiltMax: string;
    hasGarden: boolean | null;
    hasRooftop: boolean | null;
    hasAirConditioning: boolean | null;
    hasFireplace: boolean | null;
    hasLaundry: boolean | null;
    hasCellar: boolean | null;
    energyClass: string;
    heatingType: string;
    parkingInterior: string;
    parkingExterior: string;
    kitchenEquipped: boolean | null;
    kitchenSeparated: boolean | null;
    subtype: string;
    availableFrom: string;
}

export function PropertyFilters({ onFilterChange, cities }: PropertyFiltersProps) {
    const { translations } = usePage<SharedData>().props;
    const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
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

    const handleFilterChange = useCallback(
        (key: keyof PropertyFilterState, value: string | boolean | null) => {
            const newFilters = { ...filters, [key]: value };
            setFilters(newFilters);
            onFilterChange(newFilters);
        },
        [filters, onFilterChange],
    );

    // Debounced search
    const [searchValue, setSearchValue] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilterChange('search', searchValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue, handleFilterChange]);

    const clearMoreFilters = () => {
        const clearedFilters = {
            ...filters,
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
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const hasActiveMoreFilters =
        filters.minSize ||
        filters.maxSize ||
        filters.floor ||
        filters.hasElevator !== null ||
        filters.yearBuiltMin ||
        filters.yearBuiltMax ||
        filters.hasGarden !== null ||
        filters.hasRooftop !== null ||
        filters.hasAirConditioning !== null ||
        filters.hasFireplace !== null ||
        filters.hasLaundry !== null ||
        filters.hasCellar !== null ||
        filters.energyClass ||
        filters.heatingType ||
        filters.parkingInterior ||
        filters.parkingExterior ||
        filters.kitchenEquipped !== null ||
        filters.kitchenSeparated !== null ||
        filters.subtype ||
        filters.availableFrom;

    return (
        <div className="space-y-4">
            {/* Quick Filters - Always Visible */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
                {/* Search */}
                <div className="lg:col-span-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder={translate(translations, 'properties.searchPlaceholder')}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                        <option value="">{translate(translations, 'properties.allStatuses')}</option>
                        <option value="available">{translate(translations, 'properties.statusAvailable')}</option>
                        <option value="leased">{translate(translations, 'properties.statusLeased')}</option>
                        <option value="maintenance">{translate(translations, 'properties.statusMaintenance')}</option>
                        <option value="under_review">{translate(translations, 'properties.statusUnderReview')}</option>
                        <option value="archived">{translate(translations, 'properties.statusArchived')}</option>
                    </select>
                </div>

                {/* Type */}
                <div>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                        <option value="">{translate(translations, 'properties.allTypes')}</option>
                        <option value="apartment">{translate(translations, 'properties.types.apartment')}</option>
                        <option value="house">{translate(translations, 'properties.types.house')}</option>
                        <option value="room">{translate(translations, 'properties.types.room')}</option>
                        <option value="commercial">{translate(translations, 'properties.types.commercial')}</option>
                        <option value="industrial">{translate(translations, 'properties.types.industrial')}</option>
                        <option value="parking">{translate(translations, 'properties.types.parking')}</option>
                    </select>
                </div>

                {/* Bedrooms */}
                <div>
                    <select
                        value={filters.bedrooms}
                        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                        <option value="">{translate(translations, 'properties.anyBeds')}</option>
                        <option value="1">{translate(translations, 'properties.atLeastBed', { count: 1 })}</option>
                        <option value="2">{translate(translations, 'properties.atLeastBeds', { count: 2 })}</option>
                        <option value="3">{translate(translations, 'properties.atLeastBeds', { count: 3 })}</option>
                        <option value="4">{translate(translations, 'properties.atLeastBeds', { count: 4 })}</option>
                        <option value="5">{translate(translations, 'properties.atLeastBeds', { count: 5 })}</option>
                    </select>
                </div>

                {/* City */}
                <div>
                    <select
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                        <option value="">{translate(translations, 'properties.allCities')}</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Rent Range */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">{translate(translations, 'properties.rent')}</span>
                <input
                    type="number"
                    placeholder={translate(translations, 'properties.min')}
                    value={filters.minRent}
                    onChange={(e) => handleFilterChange('minRent', e.target.value)}
                    className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="text-sm text-muted-foreground">{translate(translations, 'properties.to')}</span>
                <input
                    type="number"
                    placeholder={translate(translations, 'properties.max')}
                    value={filters.maxRent}
                    onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                    className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="text-sm text-muted-foreground">{translate(translations, 'properties.euroPerMonth')}</span>
            </div>

            {/* More Filters Button */}
            <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                    onClick={() => setMoreFiltersOpen(!moreFiltersOpen)}
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <SlidersHorizontal size={16} />
                    {translate(translations, 'properties.moreFilters')}
                    {hasActiveMoreFilters && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{translate(translations, 'properties.active')}</span>
                    )}
                    <ChevronDown size={16} className={`transition-transform ${moreFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                {hasActiveMoreFilters && (
                    <button
                        onClick={clearMoreFilters}
                        className="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X size={14} />
                        {translate(translations, 'properties.clearAdvancedFilters')}
                    </button>
                )}
            </div>

            {/* More Filters Section */}
            {moreFiltersOpen && (
                <div className="space-y-6 rounded-lg border border-border bg-muted/30 p-6">
                    {/* Building Details */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            {translate(translations, 'properties.filterSections.buildingDetails')}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.minSize')}
                                </label>
                                <input
                                    type="number"
                                    value={filters.minSize}
                                    onChange={(e) => handleFilterChange('minSize', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.maxSize')}
                                </label>
                                <input
                                    type="number"
                                    value={filters.maxSize}
                                    onChange={(e) => handleFilterChange('maxSize', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.floorLevel')}
                                </label>
                                <input
                                    type="number"
                                    value={filters.floor}
                                    onChange={(e) => handleFilterChange('floor', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.hasElevator')}
                                </label>
                                <select
                                    value={filters.hasElevator === null ? '' : filters.hasElevator.toString()}
                                    onChange={(e) => handleFilterChange('hasElevator', e.target.value === '' ? null : e.target.value === 'true')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">{translate(translations, 'properties.filterSections.any')}</option>
                                    <option value="true">{translate(translations, 'properties.filterSections.yes')}</option>
                                    <option value="false">{translate(translations, 'properties.filterSections.no')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.yearBuiltMin')}
                                </label>
                                <input
                                    type="number"
                                    value={filters.yearBuiltMin}
                                    onChange={(e) => handleFilterChange('yearBuiltMin', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.yearBuiltMax')}
                                </label>
                                <input
                                    type="number"
                                    value={filters.yearBuiltMax}
                                    onChange={(e) => handleFilterChange('yearBuiltMax', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">{translate(translations, 'properties.filterSections.amenities')}</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                            {[
                                { key: 'hasGarden', labelKey: 'properties.filterSections.garden' },
                                { key: 'hasRooftop', labelKey: 'properties.filterSections.rooftop' },
                                { key: 'hasAirConditioning', labelKey: 'properties.filterSections.airConditioning' },
                                { key: 'hasFireplace', labelKey: 'properties.filterSections.fireplace' },
                                { key: 'hasLaundry', labelKey: 'properties.filterSections.laundry' },
                                { key: 'hasCellar', labelKey: 'properties.filterSections.cellar' },
                            ].map(({ key, labelKey }) => (
                                <label key={key} className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters[key as keyof PropertyFilterState] === true}
                                        onChange={(e) => handleFilterChange(key as keyof PropertyFilterState, e.target.checked ? true : null)}
                                        className="rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-foreground">{translate(translations, labelKey)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Energy & Heating */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            {translate(translations, 'properties.filterSections.energyHeating')}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.energyClass')}
                                </label>
                                <select
                                    value={filters.energyClass}
                                    onChange={(e) => handleFilterChange('energyClass', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">{translate(translations, 'properties.filterSections.any')}</option>
                                    <option value="A+">A+</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="G">G</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.heatingType')}
                                </label>
                                <select
                                    value={filters.heatingType}
                                    onChange={(e) => handleFilterChange('heatingType', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">{translate(translations, 'properties.filterSections.any')}</option>
                                    <option value="gas">{translate(translations, 'properties.heatingTypes.gas')}</option>
                                    <option value="electric">{translate(translations, 'properties.heatingTypes.electric')}</option>
                                    <option value="district">{translate(translations, 'properties.heatingTypes.district')}</option>
                                    <option value="wood">{translate(translations, 'properties.heatingTypes.wood')}</option>
                                    <option value="heat_pump">{translate(translations, 'properties.heatingTypes.heat_pump')}</option>
                                    <option value="other">{translate(translations, 'properties.heatingTypes.other')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Parking */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">{translate(translations, 'properties.filterSections.parking')}</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.interiorSpots')}
                                </label>
                                <input
                                    type="number"
                                    value={filters.parkingInterior}
                                    onChange={(e) => handleFilterChange('parkingInterior', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-muted-foreground">
                                    {translate(translations, 'properties.filterSections.exteriorSpots')}
                                </label>
                                <input
                                    type="number"
                                    value={filters.parkingExterior}
                                    onChange={(e) => handleFilterChange('parkingExterior', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kitchen */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">{translate(translations, 'properties.filterSections.kitchen')}</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.kitchenEquipped === true}
                                    onChange={(e) => handleFilterChange('kitchenEquipped', e.target.checked ? true : null)}
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">{translate(translations, 'properties.filterSections.equipped')}</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.kitchenSeparated === true}
                                    onChange={(e) => handleFilterChange('kitchenSeparated', e.target.checked ? true : null)}
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">{translate(translations, 'properties.filterSections.separated')}</span>
                            </label>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">{translate(translations, 'properties.filterSections.availability')}</h3>
                        <div>
                            <label className="mb-1 block text-xs text-muted-foreground">
                                {translate(translations, 'properties.filterSections.availableFrom')}
                            </label>
                            <input
                                type="date"
                                value={filters.availableFrom}
                                onChange={(e) => handleFilterChange('availableFrom', e.target.value)}
                                className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
