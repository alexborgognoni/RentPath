import { DashboardHeader } from '@/components/dashboard-header';
import { PropertyTypeIcon } from '@/components/property-type-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { OccupancyStatus, Property, PropertyType } from '@/types/property';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Bath, BedDouble, Car, ChevronsUpDown, Filter, PanelTopClose, PanelTopOpen, PlusCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Properties',
        href: '/dashboard/properties',
    },
];

interface PageProps extends InertiaPageProps {
    properties: Property[];
}

const getOccupancyStatusBadgeVariant = (status: OccupancyStatus) => {
    switch (status) {
        case 'Occupied':
            return 'default';
        case 'Vacant':
            return 'secondary';
        case 'Under Maintenance':
            return 'destructive';
        default:
            return 'outline';
    }
};

type SortablePropertyKeys = keyof Pick<Property, 'address' | 'property_type' | 'size_sqm' | 'rent_amount' | 'occupancy_status'>;

interface SortConfig {
    key: SortablePropertyKeys | null;
    direction: 'asc' | 'desc';
}

interface Filters {
    searchTerm: string;
    propertyType: 'all' | PropertyType;
    occupancyStatus: 'all' | OccupancyStatus;
}

export default function PropertiesPage() {
    const { properties } = usePage<PageProps>().props;
    console.log(properties);

    const occupancyStatuses: OccupancyStatus[] = ['Occupied', 'Vacant', 'Under Maintenance'];

    const propertyTypes: PropertyType[] = [
        'House',
        'Detached House',
        'Semi‑detached House',
        'Apartment',
        'Studio',
        'Penthouse',
        'Duplex',
        'Triplex',
        'Loft',
        'Garage',
        'Office',
    ] as const;

    const [filters, setFilters] = useState<Filters>({
        searchTerm: '',
        propertyType: 'all',
        occupancyStatus: 'all',
    });
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    const handleFilterChange = (filterName: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({ searchTerm: '', propertyType: 'all', occupancyStatus: 'all' });
    };

    const handleSort = (key: SortablePropertyKeys) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const [isFiltersOpen, setIsFiltersOpen] = useState(true);

    const filteredAndSortedProperties = useMemo(() => {
        let items = [...properties];

        // Filtering
        if (filters.searchTerm) {
            items = items.filter(
                (prop) =>
                    prop.address.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    prop.city.toLowerCase().includes(filters.searchTerm.toLowerCase()),
            );
        }
        if (filters.propertyType !== 'all') {
            items = items.filter((prop) => prop.propertyType === filters.propertyType);
        }
        if (filters.occupancyStatus !== 'all') {
            items = items.filter((prop) => prop.occupancyStatus === filters.occupancyStatus);
        }

        // Sorting
        if (sortConfig.key) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return 0;
            });
        }
        return items;
    }, [properties, filters, sortConfig]);

    const SortIcon = ({ columnKey }: { columnKey: SortablePropertyKeys }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronsUpDown className="ml-2 h-4 w-4" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Manage Properties"
                    actionButton={{
                        label: 'Add New Property',
                        onClick: () => router.visit('/dashboard/properties/create'),
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
                />
                <div className="flex-1 space-y-6 p-4 sm:p-6">
                    <Card>
                        <CardHeader className="cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                </div>
                                {isFiltersOpen ? (
                                    <PanelTopClose className={'h-4 w-4 transition-transform'} />
                                ) : (
                                    <PanelTopOpen className={'h-4 w-4 transition-transform'} />
                                )}
                            </CardTitle>
                        </CardHeader>

                        {isFiltersOpen && (
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <Input
                                        placeholder="Search by address or city..."
                                        value={filters.searchTerm}
                                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                    />
                                    <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            {propertyTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={filters.occupancyStatus} onValueChange={(value) => handleFilterChange('occupancyStatus', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {occupancyStatuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={clearFilters} variant="outline" size="sm">
                                    <X className="mr-2 h-4 w-4" /> Clear Filters
                                </Button>
                            </CardContent>
                        )}
                    </Card>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead onClick={() => handleSort('address')} className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Address <SortIcon columnKey="address" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('property_type')}
                                        className="hidden cursor-pointer hover:bg-muted/50 md:table-cell"
                                    >
                                        <div className="flex items-center">
                                            Type <SortIcon columnKey="property_type" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('size_sqm')} className="cursor-pointer text-right hover:bg-muted/50">
                                        <div className="flex items-center justify-end">
                                            Size (m²) <SortIcon columnKey="size_sqm" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('rent_amount')} className="cursor-pointer text-right hover:bg-muted/50">
                                        <div className="flex items-center justify-end">
                                            Rent <SortIcon columnKey="rent_amount" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('occupancy_status')}
                                        className="cursor-pointer text-center hover:bg-muted/50"
                                    >
                                        <div className="flex items-center justify-center">
                                            Status <SortIcon columnKey="occupancy_status" />
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedProperties.map((property) => (
                                    <TableRow
                                        key={property.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => router.visit(`/dashboard/properties/${property.id}`)}
                                    >
                                        <TableCell>
                                            <img
                                                src={property.cover_image_url || ''}
                                                alt="Property"
                                                width={100}
                                                height={70}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{property.address}</div>
                                            <div className="text-sm text-muted-foreground">{property.city}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center">
                                                <PropertyTypeIcon type={property.property_type} />
                                                {property.property_type}
                                            </div>
                                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                                <BedDouble className="mr-1 h-3 w-3" /> {property.bedrooms}
                                                <Bath className="mr-1 ml-1 h-3 w-3" /> {property.bathrooms}
                                                <Car className="mr-1 ml-1 h-4 w-4" /> {property.indoor_parking_spots + property.outdoor_parking_spots}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{property.square_meters}</TableCell>
                                        <TableCell className="text-right">{property.rent_amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getOccupancyStatusBadgeVariant(property.occupancy_status)}>
                                                {property.occupancy_status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredAndSortedProperties.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-lg text-muted-foreground">No properties match your filters.</p>
                            <Button onClick={clearFilters} variant="link">
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
