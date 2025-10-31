import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface PropertyFiltersProps {
    onFilterChange: (filters: PropertyFilterState) => void;
}

export interface PropertyFilterState {
    search: string;
    bedrooms: string;
    bathrooms: string;
    minPrice: string;
    maxPrice: string;
    minSize: string;
    maxSize: string;
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
    const { translations } = usePage<SharedData>().props;
    const [filters, setFilters] = useState<PropertyFilterState>({
        search: '',
        bedrooms: '',
        bathrooms: '',
        minPrice: '',
        maxPrice: '',
        minSize: '',
        maxSize: '',
    });

    const handleFilterChange = (key: keyof PropertyFilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div>
            {/* Filter Controls */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
                {/* Search */}
                <div className="lg:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder={translate(translations, 'dashboard.searchPlaceholder')}
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Bedrooms */}
                <div>
                    <select
                        value={filters.bedrooms}
                        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">{translate(translations, 'dashboard.anyBeds')}</option>
                        <option value="1">1 {translate(translations, 'dashboard.bed')}</option>
                        <option value="2">2 {translate(translations, 'dashboard.beds')}</option>
                        <option value="3">3 {translate(translations, 'dashboard.beds')}</option>
                        <option value="4">4 {translate(translations, 'dashboard.beds')}</option>
                        <option value="5">5+ {translate(translations, 'dashboard.beds')}</option>
                    </select>
                </div>

                {/* Bathrooms */}
                <div>
                    <select
                        value={filters.bathrooms}
                        onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">{translate(translations, 'dashboard.anyBaths')}</option>
                        <option value="1">1 {translate(translations, 'dashboard.bath')}</option>
                        <option value="2">2 {translate(translations, 'dashboard.baths')}</option>
                        <option value="3">3 {translate(translations, 'dashboard.baths')}</option>
                        <option value="4">4+ {translate(translations, 'dashboard.baths')}</option>
                    </select>
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        placeholder={translate(translations, 'dashboard.minPrice')}
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder={translate(translations, 'dashboard.maxPrice')}
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* Size Range */}
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        placeholder={translate(translations, 'dashboard.minSize')}
                        value={filters.minSize}
                        onChange={(e) => handleFilterChange('minSize', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder={translate(translations, 'dashboard.maxSize')}
                        value={filters.maxSize}
                        onChange={(e) => handleFilterChange('maxSize', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
        </div>
    );
}
