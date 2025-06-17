import { DashboardHeader } from '@/components/dashboard-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
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
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenants',
        href: '/tenants',
    },
];

type TenantAccountStatus = 'Incomplete' | 'Under Review' | 'Verified' | 'Needs Info';

interface Tenant {
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
}

const mockTenants: Tenant[] = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
];

const tenantAccountStatuses: TenantAccountStatus[] = ['Incomplete', 'Under Review', 'Verified', 'Needs Info'];

const getTenantStatusBadgeVariant = (status: TenantAccountStatus): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
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
    }
};

const TenantStatusIcon = ({ status }: { status: TenantAccountStatus }) => {
    switch (status) {
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
    }
};

type SortableTenantKeys = keyof Pick<Tenant, 'name' | 'email' | 'accountStatus' | 'accountRegisteredDate' | 'lastActivityDate'>;

interface SortConfig {
    key: SortableTenantKeys | null;
    direction: 'asc' | 'desc';
}

interface Filters {
    searchTerm: string;
    accountStatus: string; // "all" or specific status
}

export default function TenantsPage() {
    const [filters, setFilters] = useState<Filters>({ searchTerm: '', accountStatus: 'all' });
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    const handleFilterChange = (filterName: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({ searchTerm: '', accountStatus: 'all' });
    };

    const handleSort = (key: SortableTenantKeys) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredAndSortedTenants = useMemo(() => {
        let items = [...mockTenants];
        if (filters.searchTerm) {
            items = items.filter(
                (tenant) =>
                    tenant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    tenant.email.toLowerCase().includes(filters.searchTerm.toLowerCase()),
            );
        }
        if (filters.accountStatus !== 'all') {
            items = items.filter((tenant) => tenant.accountStatus === filters.accountStatus);
        }

        if (sortConfig.key) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];
                // For dates, convert to timestamp or compare directly if formatted consistently (YYYY-MM-DD)
                if (sortConfig.key === 'accountRegisteredDate' || sortConfig.key === 'lastActivityDate') {
                    return sortConfig.direction === 'asc'
                        ? new Date(aValue).getTime() - new Date(bValue).getTime()
                        : new Date(bValue).getTime() - new Date(aValue).getTime();
                }
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return 0;
            });
        }
        return items;
    }, [mockTenants, filters, sortConfig]);

    const SortIcon = ({ columnKey }: { columnKey: SortableTenantKeys }) => {
        if (sortConfig.key !== columnKey) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
    };

    const handleAddNewTenant = () => console.log('Navigate to add new tenant page or open modal');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications" />
            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Manage Tenants"
                    actionButton={{
                        label: 'Add New Tenant',
                        onClick: handleAddNewTenant,
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
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
                                    value={filters.searchTerm}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                />
                                <Select value={filters.accountStatus} onValueChange={(value) => handleFilterChange('accountStatus', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Account Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {tenantAccountStatuses.map((status) => (
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
                    </Card>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead onClick={() => handleSort('name')} className="w-[250px] cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Tenant <SortIcon columnKey="name" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('email')} className="hidden cursor-pointer hover:bg-muted/50 md:table-cell">
                                        <div className="flex items-center">
                                            Contact <SortIcon columnKey="email" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('accountStatus')} className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Status <SortIcon columnKey="accountStatus" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden text-center lg:table-cell">Activity</TableHead>
                                    <TableHead
                                        onClick={() => handleSort('accountRegisteredDate')}
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
                                {filteredAndSortedTenants.map((tenant) => (
                                    <TableRow key={tenant.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={tenant.profileImageUrl || '/placeholder.svg'} alt={tenant.name} />
                                                    <AvatarFallback>
                                                        {tenant.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{tenant.name}</div>
                                                    <div className="text-xs text-muted-foreground md:hidden">{tenant.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div>
                                                <div className="flex items-center text-sm">
                                                    <Mail className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> {tenant.email}
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Phone className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> {tenant.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getTenantStatusBadgeVariant(tenant.accountStatus)} className="flex w-fit items-center">
                                                <TenantStatusIcon status={tenant.accountStatus} />
                                                {tenant.accountStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden text-center lg:table-cell">
                                            <div className="text-xs">
                                                {tenant.activeLeasesCount > 0 && <div>{tenant.activeLeasesCount} Active Lease(s)</div>}
                                                {tenant.pendingApplicationsCount > 0 && <div>{tenant.pendingApplicationsCount} Pending App(s)</div>}
                                                {tenant.activeLeasesCount === 0 && tenant.pendingApplicationsCount === 0 && (
                                                    <span className="text-muted-foreground">No recent activity</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden text-right sm:table-cell">
                                            <div>{tenant.accountRegisteredDate}</div>
                                            <div className="text-xs text-muted-foreground" onClick={() => handleSort('lastActivityDate')}>
                                                Last active: {tenant.lastActivityDate}
                                                {/* Simple sort on click for this sub-element, or make the whole cell sort by lastActivityDate */}
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
                                                    {tenant.accountStatus === 'Under Review' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => alert(`Verify account ${tenant.id}`)}>
                                                                <UserCheck className="mr-2 h-4 w-4" /> Verify Account
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => alert(`Request info for ${tenant.id}`)}>
                                                                <AlertCircle className="mr-2 h-4 w-4" /> Request More Info
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {tenant.accountStatus === 'Incomplete' && (
                                                        <DropdownMenuItem onClick={() => alert(`Send completion reminder to ${tenant.id}`)}>
                                                            <Mail className="mr-2 h-4 w-4" /> Send Completion Reminder
                                                        </DropdownMenuItem>
                                                    )}
                                                    {tenant.accountStatus === 'Needs Info' && (
                                                        <DropdownMenuItem onClick={() => alert(`Review submitted info for ${tenant.id}`)}>
                                                            <FileClock className="mr-2 h-4 w-4" /> Review Submitted Info
                                                        </DropdownMenuItem>
                                                    )}
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredAndSortedTenants.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-lg text-muted-foreground">No tenants match your filters.</p>
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
