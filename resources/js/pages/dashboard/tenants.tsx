import ***REMOVED*** DashboardHeader ***REMOVED*** from '@/components/dashboard-header';
import ***REMOVED*** Avatar, AvatarFallback, AvatarImage ***REMOVED*** from '@/components/ui/avatar';
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
import ***REMOVED*** BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** Head ***REMOVED*** from '@inertiajs/react';
import ***REMOVED***
    AlertCircle,
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Edit3,
    Eye,
    FileClock,
    Filter,
    HelpCircle,
    Mail,
    MoreHorizontal,
    Phone,
    PlusCircle,
    Trash2,
    UserCheck,
    X,
***REMOVED*** from 'lucide-react';
import ***REMOVED*** useMemo, useState ***REMOVED*** from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    ***REMOVED***
        title: 'Tenants',
        href: '/tenants',
***REMOVED***,
];

type TenantAccountStatus = 'Incomplete' | 'Under Review' | 'Verified' | 'Needs Info';

interface Tenant ***REMOVED***
    id: string;
    name: string;
    email: string;
    phone: string;
    accountStatus: TenantAccountStatus;
    profileImageUrl?: string;
    accountRegisteredDate: string;
    lastActivityDate: string;
    activeLeasesCount: number;
    pendingApplicationsCount: number;
***REMOVED***

const mockTenants: Tenant[] = [
    ***REMOVED***
        id: 'tenant1',
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        phone: '(555) 123-4567',
        accountStatus: 'Verified',
        profileImageUrl: '/placeholder.svg?width=40&height=40&text=CB',
        accountRegisteredDate: '2023-10-15',
        lastActivityDate: '2024-05-28',
        activeLeasesCount: 1,
        pendingApplicationsCount: 0,
***REMOVED***,
    ***REMOVED***
        id: 'tenant2',
        name: 'Lucy van Pelt',
        email: 'lucy.vp@example.com',
        phone: '(555) 234-5678',
        accountStatus: 'Under Review',
        profileImageUrl: '/placeholder.svg?width=40&height=40&text=LP',
        accountRegisteredDate: '2024-05-20',
        lastActivityDate: '2024-06-01',
        activeLeasesCount: 0,
        pendingApplicationsCount: 1,
***REMOVED***,
    ***REMOVED***
        id: 'tenant3',
        name: 'Linus van Pelt',
        email: 'linus.vp@example.com',
        phone: '(555) 345-6789',
        accountStatus: 'Incomplete',
        profileImageUrl: '/placeholder.svg?width=40&height=40&text=LV',
        accountRegisteredDate: '2024-06-01',
        lastActivityDate: '2024-06-01',
        activeLeasesCount: 0,
        pendingApplicationsCount: 0,
***REMOVED***,
    ***REMOVED***
        id: 'tenant4',
        name: 'Sally Brown',
        email: 'sally.b@example.com',
        phone: '(555) 456-7890',
        accountStatus: 'Verified',
        profileImageUrl: '/placeholder.svg?width=40&height=40&text=SB',
        accountRegisteredDate: '2023-07-10',
        lastActivityDate: '2024-05-15',
        activeLeasesCount: 1,
        pendingApplicationsCount: 1,
***REMOVED***,
    ***REMOVED***
        id: 'tenant5',
        name: 'Peppermint Patty',
        email: 'peppermint.p@example.com',
        phone: '(555) 567-8901',
        accountStatus: 'Needs Info',
        profileImageUrl: '/placeholder.svg?width=40&height=40&text=PP',
        accountRegisteredDate: '2024-04-10',
        lastActivityDate: '2024-05-25',
        activeLeasesCount: 0,
        pendingApplicationsCount: 1,
***REMOVED***,
];

const tenantAccountStatuses: TenantAccountStatus[] = ['Incomplete', 'Under Review', 'Verified', 'Needs Info'];

const getTenantStatusBadgeVariant = (status: TenantAccountStatus): 'default' | 'secondary' | 'outline' | 'destructive' => ***REMOVED***
    switch (status) ***REMOVED***
        case 'Verified':
            return 'default';
        case 'Under Review':
            return 'secondary';
        case 'Incomplete':
            return 'outline';
        case 'Needs Info':
            return 'destructive'; // Using destructive for Needs Info for visibility
        default:
            return 'outline';
***REMOVED***
***REMOVED***;

const TenantStatusIcon = (***REMOVED*** status ***REMOVED***: ***REMOVED*** status: TenantAccountStatus ***REMOVED***) => ***REMOVED***
    switch (status) ***REMOVED***
        case 'Verified':
            return <UserCheck className="mr-2 h-4 w-4 text-green-600" />;
        case 'Under Review':
            return <FileClock className="mr-2 h-4 w-4 text-blue-600" />;
        case 'Incomplete':
            return <HelpCircle className="mr-2 h-4 w-4 text-gray-500" />;
        case 'Needs Info':
            return <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />;
        default:
            return null;
***REMOVED***
***REMOVED***;

type SortableTenantKeys = keyof Pick<Tenant, 'name' | 'email' | 'accountStatus' | 'accountRegisteredDate' | 'lastActivityDate'>;

interface SortConfig ***REMOVED***
    key: SortableTenantKeys | null;
    direction: 'asc' | 'desc';
***REMOVED***

interface Filters ***REMOVED***
    searchTerm: string;
    accountStatus: string; // "all" or specific status
***REMOVED***

export default function TenantsPage() ***REMOVED***
    const [filters, setFilters] = useState<Filters>(***REMOVED*** searchTerm: '', accountStatus: 'all' ***REMOVED***);
    const [sortConfig, setSortConfig] = useState<SortConfig>(***REMOVED*** key: null, direction: 'asc' ***REMOVED***);

    const handleFilterChange = (filterName: keyof Filters, value: string) => ***REMOVED***
        setFilters((prev) => (***REMOVED*** ...prev, [filterName]: value ***REMOVED***));
***REMOVED***;

    const clearFilters = () => ***REMOVED***
        setFilters(***REMOVED*** searchTerm: '', accountStatus: 'all' ***REMOVED***);
***REMOVED***;

    const handleSort = (key: SortableTenantKeys) => ***REMOVED***
        setSortConfig((prev) => (***REMOVED***
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    ***REMOVED***));
***REMOVED***;

    const filteredAndSortedTenants = useMemo(() => ***REMOVED***
        let items = [...mockTenants];
        if (filters.searchTerm) ***REMOVED***
            items = items.filter(
                (tenant) =>
                    tenant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    tenant.email.toLowerCase().includes(filters.searchTerm.toLowerCase()),
            );
    ***REMOVED***
        if (filters.accountStatus !== 'all') ***REMOVED***
            items = items.filter((tenant) => tenant.accountStatus === filters.accountStatus);
    ***REMOVED***

        if (sortConfig.key) ***REMOVED***
            items.sort((a, b) => ***REMOVED***
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];
                // For dates, convert to timestamp or compare directly if formatted consistently (YYYY-MM-DD)
                if (sortConfig.key === 'accountRegisteredDate' || sortConfig.key === 'lastActivityDate') ***REMOVED***
                    return sortConfig.direction === 'asc'
                        ? new Date(aValue).getTime() - new Date(bValue).getTime()
                        : new Date(bValue).getTime() - new Date(aValue).getTime();
            ***REMOVED***
                if (typeof aValue === 'string' && typeof bValue === 'string') ***REMOVED***
                    return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            ***REMOVED***
                return 0;
        ***REMOVED***);
    ***REMOVED***
        return items;
***REMOVED***, [mockTenants, filters, sortConfig]);

    const SortIcon = (***REMOVED*** columnKey ***REMOVED***: ***REMOVED*** columnKey: SortableTenantKeys ***REMOVED***) => ***REMOVED***
        if (sortConfig.key !== columnKey) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
***REMOVED***;

    const handleAddNewTenant = () => console.log('Navigate to add new tenant page or open modal');

    return (
        <AppLayout breadcrumbs=***REMOVED***breadcrumbs***REMOVED***>
            <Head title="Applications" />
            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Manage Tenants"
                    actionButton=***REMOVED******REMOVED***
                        label: 'Add New Tenant',
                        onClick: handleAddNewTenant,
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    placeholder="Search by name or email..."
                                    value=***REMOVED***filters.searchTerm***REMOVED***
                                    onChange=***REMOVED***(e) => handleFilterChange('searchTerm', e.target.value)***REMOVED***
                                />
                                <Select value=***REMOVED***filters.accountStatus***REMOVED*** onValueChange=***REMOVED***(value) => handleFilterChange('accountStatus', value)***REMOVED***>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Account Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        ***REMOVED***tenantAccountStatuses.map((status) => (
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
                                    <TableHead onClick=***REMOVED***() => handleSort('name')***REMOVED*** className="w-[250px] cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Tenant <SortIcon columnKey="name" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick=***REMOVED***() => handleSort('email')***REMOVED*** className="hidden cursor-pointer hover:bg-muted/50 md:table-cell">
                                        <div className="flex items-center">
                                            Contact <SortIcon columnKey="email" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick=***REMOVED***() => handleSort('accountStatus')***REMOVED*** className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Status <SortIcon columnKey="accountStatus" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden text-center lg:table-cell">Activity</TableHead>
                                    <TableHead
                                        onClick=***REMOVED***() => handleSort('accountRegisteredDate')***REMOVED***
                                        className="hidden cursor-pointer text-right hover:bg-muted/50 sm:table-cell"
                                    >
                                        <div className="flex items-center justify-end">
                                            Registered <SortIcon columnKey="accountRegisteredDate" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                ***REMOVED***filteredAndSortedTenants.map((tenant) => (
                                    <TableRow key=***REMOVED***tenant.id***REMOVED***>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src=***REMOVED***tenant.profileImageUrl || '/placeholder.svg'***REMOVED*** alt=***REMOVED***tenant.name***REMOVED*** />
                                                    <AvatarFallback>
                                                        ***REMOVED***tenant.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')***REMOVED***
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">***REMOVED***tenant.name***REMOVED***</div>
                                                    <div className="text-xs text-muted-foreground md:hidden">***REMOVED***tenant.email***REMOVED***</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div>
                                                <div className="flex items-center text-sm">
                                                    <Mail className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> ***REMOVED***tenant.email***REMOVED***
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Phone className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> ***REMOVED***tenant.phone***REMOVED***
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant=***REMOVED***getTenantStatusBadgeVariant(tenant.accountStatus)***REMOVED*** className="flex w-fit items-center">
                                                <TenantStatusIcon status=***REMOVED***tenant.accountStatus***REMOVED*** />
                                                ***REMOVED***tenant.accountStatus***REMOVED***
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden text-center lg:table-cell">
                                            <div className="text-xs">
                                                ***REMOVED***tenant.activeLeasesCount > 0 && <div>***REMOVED***tenant.activeLeasesCount***REMOVED*** Active Lease(s)</div>***REMOVED***
                                                ***REMOVED***tenant.pendingApplicationsCount > 0 && <div>***REMOVED***tenant.pendingApplicationsCount***REMOVED*** Pending App(s)</div>***REMOVED***
                                                ***REMOVED***tenant.activeLeasesCount === 0 && tenant.pendingApplicationsCount === 0 && (
                                                    <span className="text-muted-foreground">No recent activity</span>
                                                )***REMOVED***
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden text-right sm:table-cell">
                                            <div>***REMOVED***tenant.accountRegisteredDate***REMOVED***</div>
                                            <div className="text-xs text-muted-foreground" onClick=***REMOVED***() => handleSort('lastActivityDate')***REMOVED***>
                                                Last active: ***REMOVED***tenant.lastActivityDate***REMOVED***
                                                ***REMOVED***/* Simple sort on click for this sub-element, or make the whole cell sort by lastActivityDate */***REMOVED***
                                            </div>
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
                                                    <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" /> View Full Profile
                                                    </DropdownMenuItem>
                                                    ***REMOVED***tenant.accountStatus === 'Under Review' && (
                                                        <>
                                                            <DropdownMenuItem onClick=***REMOVED***() => alert(`Verify account $***REMOVED***tenant.id***REMOVED***`)***REMOVED***>
                                                                <UserCheck className="mr-2 h-4 w-4" /> Verify Account
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick=***REMOVED***() => alert(`Request info for $***REMOVED***tenant.id***REMOVED***`)***REMOVED***>
                                                                <AlertCircle className="mr-2 h-4 w-4" /> Request More Info
                                                            </DropdownMenuItem>
                                                        </>
                                                    )***REMOVED***
                                                    ***REMOVED***tenant.accountStatus === 'Incomplete' && (
                                                        <DropdownMenuItem onClick=***REMOVED***() => alert(`Send completion reminder to $***REMOVED***tenant.id***REMOVED***`)***REMOVED***>
                                                            <Mail className="mr-2 h-4 w-4" /> Send Completion Reminder
                                                        </DropdownMenuItem>
                                                    )***REMOVED***
                                                    ***REMOVED***tenant.accountStatus === 'Needs Info' && (
                                                        <DropdownMenuItem onClick=***REMOVED***() => alert(`Review submitted info for $***REMOVED***tenant.id***REMOVED***`)***REMOVED***>
                                                            <FileClock className="mr-2 h-4 w-4" /> Review Submitted Info
                                                        </DropdownMenuItem>
                                                    )***REMOVED***
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Edit3 className="mr-2 h-4 w-4" /> Edit Tenant Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))***REMOVED***
                            </TableBody>
                        </Table>
                    </div>
                    ***REMOVED***filteredAndSortedTenants.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-lg text-muted-foreground">No tenants match your filters.</p>
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
