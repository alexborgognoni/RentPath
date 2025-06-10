import AppLayout from '@/layouts/app-layout';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** Head, Link ***REMOVED*** from '@inertiajs/react';

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
import ***REMOVED***
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
***REMOVED*** from 'lucide-react';
import ***REMOVED*** useMemo, useState ***REMOVED*** from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    ***REMOVED***
        title: 'Applications',
        href: '/applications',
***REMOVED***,
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

interface RentalApplication ***REMOVED***
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
***REMOVED***

const mockRentalApplications: RentalApplication[] = [
    ***REMOVED***
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
***REMOVED***,
    ***REMOVED***
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
***REMOVED***,
    ***REMOVED***
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
***REMOVED***,
    ***REMOVED***
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
***REMOVED***,
    ***REMOVED***
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
***REMOVED***,
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

const getRentalApplicationStatusBadgeVariant = (status: RentalApplicationStatus): 'default' | 'secondary' | 'outline' | 'destructive' => ***REMOVED***
    switch (status) ***REMOVED***
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
***REMOVED***
***REMOVED***;

const RentalApplicationStatusIcon = (***REMOVED*** status ***REMOVED***: ***REMOVED*** status: RentalApplicationStatus ***REMOVED***) => ***REMOVED***
    switch (status) ***REMOVED***
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
***REMOVED***
***REMOVED***;

type SortableRentalApplicationKeys = keyof Pick<
    RentalApplication,
    'applicantName' | 'propertyAddress' | 'applicationDate' | 'status' | 'lastUpdated'
>;

interface SortConfig ***REMOVED***
    key: SortableRentalApplicationKeys | null;
    direction: 'asc' | 'desc';
***REMOVED***

interface Filters ***REMOVED***
    searchTerm: string; // Search by applicant name, email, or property address
    status: string; // "all" or specific status
***REMOVED***

export default function RentalApplicationsPage() ***REMOVED***
    const [filters, setFilters] = useState<Filters>(***REMOVED*** searchTerm: '', status: 'all' ***REMOVED***);
    const [sortConfig, setSortConfig] = useState<SortConfig>(***REMOVED*** key: null, direction: 'asc' ***REMOVED***);

    const handleFilterChange = (filterName: keyof Filters, value: string) => ***REMOVED***
        setFilters((prev) => (***REMOVED*** ...prev, [filterName]: value ***REMOVED***));
***REMOVED***;

    const clearFilters = () => ***REMOVED***
        setFilters(***REMOVED*** searchTerm: '', status: 'all' ***REMOVED***);
***REMOVED***;

    const handleSort = (key: SortableRentalApplicationKeys) => ***REMOVED***
        setSortConfig((prev) => (***REMOVED***
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    ***REMOVED***));
***REMOVED***;

    const filteredAndSortedRentalApplications = useMemo(() => ***REMOVED***
        let items = [...mockRentalApplications];
        if (filters.searchTerm) ***REMOVED***
            const term = filters.searchTerm.toLowerCase();
            items = items.filter(
                (app) =>
                    app.applicantName.toLowerCase().includes(term) ||
                    app.applicantEmail.toLowerCase().includes(term) ||
                    app.propertyAddress.toLowerCase().includes(term),
            );
    ***REMOVED***
        if (filters.status !== 'all') ***REMOVED***
            items = items.filter((app) => app.status === filters.status);
    ***REMOVED***

        if (sortConfig.key) ***REMOVED***
            items.sort((a, b) => ***REMOVED***
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];
                if (sortConfig.key === 'applicationDate' || sortConfig.key === 'lastUpdated') ***REMOVED***
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
***REMOVED***, [mockRentalApplications, filters, sortConfig]);

    const SortIcon = (***REMOVED*** columnKey ***REMOVED***: ***REMOVED*** columnKey: SortableRentalApplicationKeys ***REMOVED***) => ***REMOVED***
        if (sortConfig.key !== columnKey) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
***REMOVED***;

    const handleManualAddRentalApplication = () => console.log('Open modal or navigate to add new application form');

    return (
        <AppLayout breadcrumbs=***REMOVED***breadcrumbs***REMOVED***>
            <Head title="Applications" />
            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Manage Rental Applications"
                    actionButton=***REMOVED******REMOVED***
                        label: 'Add Application',
                        onClick: handleManualAddRentalApplication,
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
                                    placeholder="Search applicant or property..."
                                    value=***REMOVED***filters.searchTerm***REMOVED***
                                    onChange=***REMOVED***(e) => handleFilterChange('searchTerm', e.target.value)***REMOVED***
                                />
                                <Select value=***REMOVED***filters.status***REMOVED*** onValueChange=***REMOVED***(value) => handleFilterChange('status', value)***REMOVED***>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        ***REMOVED***applicationStatuses.map((status) => (
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
                                    <TableHead onClick=***REMOVED***() => handleSort('applicantName')***REMOVED*** className="w-[250px] cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Applicant <SortIcon columnKey="applicantName" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick=***REMOVED***() => handleSort('propertyAddress')***REMOVED*** className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Property <SortIcon columnKey="propertyAddress" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick=***REMOVED***() => handleSort('applicationDate')***REMOVED***
                                        className="hidden cursor-pointer hover:bg-muted/50 md:table-cell"
                                    >
                                        <div className="flex items-center">
                                            Application Date <SortIcon columnKey="applicationDate" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick=***REMOVED***() => handleSort('status')***REMOVED*** className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center">
                                            Status <SortIcon columnKey="status" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick=***REMOVED***() => handleSort('lastUpdated')***REMOVED***
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
                                ***REMOVED***filteredAndSortedRentalApplications.map((app) => (
                                    <TableRow key=***REMOVED***app.id***REMOVED***>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src=***REMOVED***app.applicantAvatar || '/placeholder.svg'***REMOVED*** alt=***REMOVED***app.applicantName***REMOVED*** />
                                                    <AvatarFallback>
                                                        ***REMOVED***app.applicantName
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')***REMOVED***
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Link href=***REMOVED***`/dashboard/tenants/$***REMOVED***app.applicantId***REMOVED***`***REMOVED*** className="font-medium hover:underline">
                                                        ***REMOVED***app.applicantName***REMOVED***
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">***REMOVED***app.applicantEmail***REMOVED***</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Link href=***REMOVED***`/dashboard/properties/$***REMOVED***app.propertyId***REMOVED***`***REMOVED*** className="hover:underline">
                                                ***REMOVED***app.propertyAddress***REMOVED***
                                            </Link>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">***REMOVED***app.applicationDate***REMOVED***</TableCell>
                                        <TableCell>
                                            <Badge variant=***REMOVED***getRentalApplicationStatusBadgeVariant(app.status)***REMOVED*** className="flex w-fit items-center">
                                                <RentalApplicationStatusIcon status=***REMOVED***app.status***REMOVED*** />
                                                ***REMOVED***app.status***REMOVED***
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden text-right sm:table-cell">***REMOVED***app.lastUpdated***REMOVED***</TableCell>
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
                                                    ***REMOVED***app.status === 'Under Review' || app.status === 'Submitted' ? (
                                                        <>
                                                            <DropdownMenuItem>
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve RentalApplication
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <XCircle className="mr-2 h-4 w-4" /> Reject RentalApplication
                                                            </DropdownMenuItem>
                                                        </>
                                                    ) : null***REMOVED***
                                                    ***REMOVED***app.status === 'Approved' && (
                                                        <DropdownMenuItem>
                                                            <Send className="mr-2 h-4 w-4" /> Send Lease Agreement
                                                        </DropdownMenuItem>
                                                    )***REMOVED***
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Edit3 className="mr-2 h-4 w-4" /> Edit RentalApplication Notes
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))***REMOVED***
                            </TableBody>
                        </Table>
                    </div>
                    ***REMOVED***filteredAndSortedRentalApplications.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-lg text-muted-foreground">No applications match your filters.</p>
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
