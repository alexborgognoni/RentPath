import ***REMOVED*** DashboardHeader ***REMOVED*** from '@/components/dashboard-header';
import ***REMOVED*** Badge ***REMOVED*** from '@/components/ui/badge';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Card, CardContent, CardHeader, CardTitle ***REMOVED*** from '@/components/ui/card';
import ***REMOVED***
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
***REMOVED*** from '@/components/ui/dropdown-menu';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Select, SelectContent, SelectItem, SelectTrigger, SelectValue ***REMOVED*** from '@/components/ui/select';
import ***REMOVED*** Table, TableBody, TableCell, TableHead, TableHeader, TableRow ***REMOVED*** from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** OccupancyStatus, Property, PropertyType ***REMOVED*** from '@/types/property';
import ***REMOVED*** PageProps as InertiaPageProps ***REMOVED*** from '@inertiajs/core';
import ***REMOVED*** Head, usePage ***REMOVED*** from '@inertiajs/react';
import ***REMOVED***
    ArrowDown,
    ArrowUp,
    Building,
    Car,
    ChevronsUpDown,
    Edit3,
    Eye,
    Filter,
    Home,
    MapPin,
    MoreHorizontal,
    PlusCircle,
    Trash2,
    X,
***REMOVED*** from 'lucide-react';
import ***REMOVED*** useMemo, useState ***REMOVED*** from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    ***REMOVED***
        title: 'Properties',
        href: '/dashboard/properties',
***REMOVED***,
];

interface PageProps extends InertiaPageProps ***REMOVED***
    properties: Property[];
***REMOVED***

const getOccupancyStatusBadgeVariant = (status: OccupancyStatus) => ***REMOVED***
    switch (status) ***REMOVED***
        case 'Occupied':
            return 'default';
        case 'Vacant':
            return 'secondary';
        case 'Under Maintenance':
            return 'destructive';
        default:
            return 'outline';
***REMOVED***
***REMOVED***;

const PropertyTypeIcon = (***REMOVED*** type ***REMOVED***: ***REMOVED*** type: PropertyType ***REMOVED***) => ***REMOVED***
    switch (type) ***REMOVED***
        case 'Apartment':
            return <Building className="mr-2 h-4 w-4 text-muted-foreground" />;
        case 'House':
            return <Home className="mr-2 h-4 w-4 text-muted-foreground" />;
        default:
            return <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />;
***REMOVED***
***REMOVED***;

type SortablePropertyKeys = keyof Pick<Property, 'address' | 'property_type' | 'size_sqm' | 'rent_amount' | 'occupancy_status'>;

interface SortConfig ***REMOVED***
    key: SortablePropertyKeys | null;
    direction: 'asc' | 'desc';
***REMOVED***

interface Filters ***REMOVED***
    searchTerm: string;
    propertyType: string; // "all" or specific type
    occupancyStatus: string; // "all" or specific status
***REMOVED***

export default function PropertiesPage() ***REMOVED***
    const ***REMOVED*** properties ***REMOVED*** = usePage<PageProps>().props;

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

    const [filters, setFilters] = useState<Filters>(***REMOVED***
        searchTerm: '',
        propertyType: 'all',
        occupancyStatus: 'all',
***REMOVED***);
    const [sortConfig, setSortConfig] = useState<SortConfig>(***REMOVED*** key: null, direction: 'asc' ***REMOVED***);

    const handleFilterChange = (filterName: keyof Filters, value: string) => ***REMOVED***
        setFilters((prev) => (***REMOVED*** ...prev, [filterName]: value ***REMOVED***));
***REMOVED***;

    const clearFilters = () => ***REMOVED***
        setFilters(***REMOVED*** searchTerm: '', propertyType: 'all', occupancyStatus: 'all' ***REMOVED***);
***REMOVED***;

    const handleSort = (key: SortablePropertyKeys) => ***REMOVED***
        setSortConfig((prev) => (***REMOVED***
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    ***REMOVED***));
***REMOVED***;

    const filteredAndSortedProperties = useMemo(() => ***REMOVED***
        let items = [...properties];

        // Filtering
        if (filters.searchTerm) ***REMOVED***
            items = items.filter(
                (prop) =>
                    prop.address.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    prop.city.toLowerCase().includes(filters.searchTerm.toLowerCase()),
            );
    ***REMOVED***
        if (filters.propertyType !== 'all') ***REMOVED***
            items = items.filter((prop) => prop.propertyType === filters.propertyType);
    ***REMOVED***
        if (filters.occupancyStatus !== 'all') ***REMOVED***
            items = items.filter((prop) => prop.occupancyStatus === filters.occupancyStatus);
    ***REMOVED***

        // Sorting
        if (sortConfig.key) ***REMOVED***
            items.sort((a, b) => ***REMOVED***
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (typeof aValue === 'number' && typeof bValue === 'number') ***REMOVED***
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            ***REMOVED***
                if (typeof aValue === 'string' && typeof bValue === 'string') ***REMOVED***
                    return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            ***REMOVED***
                return 0;
        ***REMOVED***);
    ***REMOVED***
        return items;
***REMOVED***, [properties, filters, sortConfig]);

    const SortIcon = (***REMOVED*** columnKey ***REMOVED***: ***REMOVED*** columnKey: SortablePropertyKeys ***REMOVED***) => ***REMOVED***
        if (sortConfig.key !== columnKey) ***REMOVED***
            return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    ***REMOVED***
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
***REMOVED***;

    const handleAddNewProperty = () => console.log('Navigate to add new property page');

    return (
        <AppLayout breadcrumbs=***REMOVED***breadcrumbs***REMOVED***>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Manage Properties"
                    actionButton=***REMOVED******REMOVED***
                        label: 'Add New Property',
                        onClick: handleAddNewProperty,
                        icon: <PlusCircle className="h-4 w-4" />,
                ***REMOVED******REMOVED***
                />
                <div className="flex-1 space-y-6 p-4 sm:p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Filter className="mr-2 h-5 w-5" /> Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Input
                                    placeholder="Search by address or city..."
                                    value=***REMOVED***filters.searchTerm***REMOVED***
                                    onChange=***REMOVED***(e) => handleFilterChange('searchTerm', e.target.value)***REMOVED***
                                />
                                <Select value=***REMOVED***filters.propertyType***REMOVED*** onValueChange=***REMOVED***(value) => handleFilterChange('propertyType', value)***REMOVED***>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        ***REMOVED***propertyTypes.map((type) => (
                                            <SelectItem key=***REMOVED***type***REMOVED*** value=***REMOVED***type***REMOVED***>
                                                ***REMOVED***type***REMOVED***
                                            </SelectItem>
                                        ))***REMOVED***
                                    </SelectContent>
                                </Select>
                                <Select value=***REMOVED***filters.occupancyStatus***REMOVED*** onValueChange=***REMOVED***(value) => handleFilterChange('occupancyStatus', value)***REMOVED***>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        ***REMOVED***occupancyStatuses.map((status) => (
                                            <SelectItem key=***REMOVED***status***REMOVED*** value=***REMOVED***status***REMOVED***>
                                                ***REMOVED***status***REMOVED***
                                            </SelectItem>
                                        ))***REMOVED***
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick=***REMOVED***clearFilters***REMOVED*** variant="outline" size="sm">
                                <X className="mr-2 h-4 w-4" /> Clear Filters
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead onClick=***REMOVED***() => handleSort('address')***REMOVED*** className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Property Details <SortIcon columnKey="address" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick=***REMOVED***() => handleSort('property_type')***REMOVED***
                                        className="hidden cursor-pointer hover:bg-muted/50 md:table-cell"
                                    >
                                        <div className="flex items-center">
                                            Type <SortIcon columnKey="property_type" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick=***REMOVED***() => handleSort('size_sqm')***REMOVED*** className="cursor-pointer text-right hover:bg-muted/50">
                                        <div className="flex items-center justify-end">
                                            Size (sqm) <SortIcon columnKey="size_sqm" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick=***REMOVED***() => handleSort('rent_amount')***REMOVED*** className="cursor-pointer text-right hover:bg-muted/50">
                                        <div className="flex items-center justify-end">
                                            Rent <SortIcon columnKey="rent_amount" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick=***REMOVED***() => handleSort('occupancy_status')***REMOVED***
                                        className="cursor-pointer text-center hover:bg-muted/50"
                                    >
                                        <div className="flex items-center justify-center">
                                            Status <SortIcon columnKey="occupancy_status" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden text-center md:table-cell">Maintenance</TableHead>
                                    <TableHead className="hidden lg:table-cell">Tenant</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                ***REMOVED***filteredAndSortedProperties.map((property) => (
                                    <TableRow key=***REMOVED***property.id***REMOVED***>
                                        <TableCell>
                                            <img
                                                src=***REMOVED***property.cover_image_url || ''***REMOVED***
                                                alt=***REMOVED***property.address***REMOVED***
                                                width=***REMOVED***100***REMOVED***
                                                height=***REMOVED***70***REMOVED***
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">***REMOVED***property.address***REMOVED***</div>
                                            <div className="text-sm text-muted-foreground">***REMOVED***property.city***REMOVED***</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center">
                                                <PropertyTypeIcon type=***REMOVED***property.property_type***REMOVED*** />
                                                ***REMOVED***property.property_type***REMOVED***
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                ***REMOVED***property.bedrooms***REMOVED*** bed / ***REMOVED***property.bathrooms***REMOVED*** bath
                                            </div>
                                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                                <Car className="mr-1 h-3 w-3" /> ***REMOVED***property.indoor_parking_spots + property.outdoor_parking_spots***REMOVED***
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">***REMOVED***property.square_meters***REMOVED***</TableCell>
                                        <TableCell className="text-right">***REMOVED***property.rent_amount.toLocaleString()***REMOVED***</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant=***REMOVED***getOccupancyStatusBadgeVariant(property.occupancy_status)***REMOVED***>
                                                ***REMOVED***property.occupancy_status***REMOVED***
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden text-center md:table-cell">
                                            <span className="text-xs text-muted-foreground">-</span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <span className="text-muted-foreground">-</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit3 className="mr-2 h-4 w-4" /> Edit Property
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Property
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))***REMOVED***
                            </TableBody>
                        </Table>
                    </div>
                    ***REMOVED***filteredAndSortedProperties.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-lg text-muted-foreground">No properties match your filters.</p>
                            <Button onClick=***REMOVED***clearFilters***REMOVED*** variant="link">
                                Clear all filters
                            </Button>
                        </div>
                    )***REMOVED***
                </div>
            </div>
        </AppLayout>
    );
***REMOVED***
