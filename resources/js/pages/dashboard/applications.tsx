import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
import {
    ArrowDown,
    ArrowUp,
    CheckCircle,
    ChevronsUpDown,
    Edit3,
    Eye,
    FileSignature,
    Filter,
    MoreHorizontal,
    PlusCircle,
    Send,
    UserX,
    X,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Applications',
        href: '/applications',
    },
];

type RentalApplicationStatus =
    | 'Submitted'
    | 'Under Review'
    | 'Awaiting Documents'
    | 'Approved'
    | 'Rejected'
    | 'Lease Sent'
    | 'Lease Signed'
    | 'Withdrawn';

interface RentalApplication {
    id: string;
    applicantName: string;
    applicantId: string;
    applicantEmail: string;
    applicantAvatar?: string;
    propertyAddress: string;
    propertyId: string;
    applicationDate: string;
    status: RentalApplicationStatus;
    lastUpdated: string;
}

const mockRentalApplications: RentalApplication[] = [
    {
        id: 'app1',
        applicantName: 'Lucy van Pelt',
        applicantId: 'tenant2',
        applicantEmail: 'lucy.vp@example.com',
        applicantAvatar: '',
        propertyAddress: '456 Oak Avenue',
        propertyId: 'prop2',
        applicationDate: '2024-05-20',
        status: 'Under Review',
        lastUpdated: '2024-05-21',
    },
    {
        id: 'app2',
        applicantName: 'Sally Brown',
        applicantId: 'tenant4',
        applicantEmail: 'sally.b@example.com',
        applicantAvatar: '',
        propertyAddress: '789 Pine Ln, Apt 12',
        propertyId: 'prop3',
        applicationDate: '2024-06-01',
        status: 'Awaiting Documents',
        lastUpdated: '2024-06-02',
    },
    {
        id: 'app3',
        applicantName: 'Schroeder Piano',
        applicantId: 'tenant_new1',
        applicantEmail: 'schroeder.p@example.com',
        applicantAvatar: '',
        propertyAddress: '123 Main St, Unit 4B',
        propertyId: 'prop1',
        applicationDate: '2024-05-15',
        status: 'Approved',
        lastUpdated: '2024-05-18',
    },
    {
        id: 'app4',
        applicantName: 'Marcie Carlin',
        applicantId: 'tenant_new2',
        applicantEmail: 'marcie.c@example.com',
        applicantAvatar: '',
        propertyAddress: '101 Maple Drive',
        propertyId: 'prop4',
        applicationDate: '2024-05-25',
        status: 'Rejected',
        lastUpdated: '2024-05-28',
    },
    {
        id: 'app5',
        applicantName: 'Charlie Brown',
        applicantId: 'tenant1',
        applicantEmail: 'charlie.brown@example.com',
        applicantAvatar: '',
        propertyAddress: '22 Sky High Tower, Apt 30C',
        propertyId: 'prop5',
        applicationDate: '2024-06-03',
        status: 'Submitted',
        lastUpdated: '2024-06-03',
    },
];

const applicationStatuses: RentalApplicationStatus[] = [
    'Submitted',
    'Under Review',
    'Awaiting Documents',
    'Approved',
    'Rejected',
    'Lease Sent',
    'Lease Signed',
    'Withdrawn',
];

const getRentalApplicationStatusBadgeVariant = (status: RentalApplicationStatus): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
        case 'Approved':
        case 'Lease Signed':
            return 'default';
        case 'Submitted':
        case 'Under Review':
        case 'Lease Sent':
            return 'secondary';
        case 'Awaiting Documents':
            return 'outline';
        case 'Rejected':
        case 'Withdrawn':
            return 'destructive';
        default:
            return 'outline';
    }
};

const RentalApplicationStatusIcon = ({ status }: { status: RentalApplicationStatus }) => {
    switch (status) {
        case 'Approved':
            return <CheckCircle className="mr-2 h-4 w-4 text-green-600" />;
        case 'Lease Signed':
            return <FileSignature className="mr-2 h-4 w-4 text-green-700" />;
        case 'Lease Sent':
            return <Send className="mr-2 h-4 w-4 text-blue-600" />;
        case 'Rejected':
            return <XCircle className="mr-2 h-4 w-4 text-red-600" />;
        case 'Withdrawn':
            return <UserX className="mr-2 h-4 w-4 text-red-700" />;
        default:
            return <FileSignature className="mr-2 h-4 w-4 text-gray-500" />;
    }
};

type SortableRentalApplicationKeys = keyof Pick<
    RentalApplication,
    'applicantName' | 'propertyAddress' | 'applicationDate' | 'status' | 'lastUpdated'
>;

interface SortConfig {
    key: SortableRentalApplicationKeys | null;
    direction: 'asc' | 'desc';
}

interface Filters {
    searchTerm: string; // Search by applicant name, email, or property address
    status: string; // "all" or specific status
}

export default function RentalApplicationsPage() {
    const [filters, setFilters] = useState<Filters>({ searchTerm: '', status: 'all' });
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    const handleFilterChange = (filterName: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({ searchTerm: '', status: 'all' });
    };

    const handleSort = (key: SortableRentalApplicationKeys) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredAndSortedRentalApplications = useMemo(() => {
        let items = [...mockRentalApplications];
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            items = items.filter(
                (app) =>
                    app.applicantName.toLowerCase().includes(term) ||
                    app.applicantEmail.toLowerCase().includes(term) ||
                    app.propertyAddress.toLowerCase().includes(term),
            );
        }
        if (filters.status !== 'all') {
            items = items.filter((app) => app.status === filters.status);
        }

        if (sortConfig.key) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];
                if (sortConfig.key === 'applicationDate' || sortConfig.key === 'lastUpdated') {
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
    }, [mockRentalApplications, filters, sortConfig]);

    const SortIcon = ({ columnKey }: { columnKey: SortableRentalApplicationKeys }) => {
        if (sortConfig.key !== columnKey) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
    };

    const handleManualAddRentalApplication = () => console.log('Open modal or navigate to add new application form');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications" />
            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Manage Rental Applications"
                    actionButton={{
                        label: 'Add Application',
                        onClick: handleManualAddRentalApplication,
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
                                    placeholder="Search applicant or property..."
                                    value={filters.searchTerm}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                />
                                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {applicationStatuses.map((status) => (
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
                                    <TableHead onClick={() => handleSort('applicantName')} className="w-[250px] cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Applicant <SortIcon columnKey="applicantName" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('propertyAddress')} className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Property <SortIcon columnKey="propertyAddress" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('applicationDate')}
                                        className="hidden cursor-pointer hover:bg-muted/50 md:table-cell"
                                    >
                                        <div className="flex items-center">
                                            Application Date <SortIcon columnKey="applicationDate" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('status')} className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Status <SortIcon columnKey="status" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('lastUpdated')}
                                        className="hidden cursor-pointer text-right hover:bg-muted/50 sm:table-cell"
                                    >
                                        <div className="flex items-center justify-end">
                                            Last Updated <SortIcon columnKey="lastUpdated" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedRentalApplications.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={app.applicantAvatar || '/placeholder.svg'} alt={app.applicantName} />
                                                    <AvatarFallback>
                                                        {app.applicantName
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Link href={`/dashboard/tenants/${app.applicantId}`} className="font-medium hover:underline">
                                                        {app.applicantName}
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">{app.applicantEmail}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/dashboard/properties/${app.propertyId}`} className="hover:underline">
                                                {app.propertyAddress}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{app.applicationDate}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRentalApplicationStatusBadgeVariant(app.status)} className="flex w-fit items-center">
                                                <RentalApplicationStatusIcon status={app.status} />
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden text-right sm:table-cell">{app.lastUpdated}</TableCell>
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
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" /> View Full RentalApplication
                                                    </DropdownMenuItem>
                                                    {app.status === 'Under Review' || app.status === 'Submitted' ? (
                                                        <>
                                                            <DropdownMenuItem>
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve RentalApplication
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <XCircle className="mr-2 h-4 w-4" /> Reject RentalApplication
                                                            </DropdownMenuItem>
                                                        </>
                                                    ) : null}
                                                    {app.status === 'Approved' && (
                                                        <DropdownMenuItem>
                                                            <Send className="mr-2 h-4 w-4" /> Send Lease Agreement
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Edit3 className="mr-2 h-4 w-4" /> Edit RentalApplication Notes
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredAndSortedRentalApplications.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-lg text-muted-foreground">No applications match your filters.</p>
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
