import AppLayout from '@/layouts/app-layout';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** Head, Link ***REMOVED*** from '@inertiajs/react';

import ***REMOVED*** DashboardHeader ***REMOVED*** from '@/components/dashboard-header';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Card, CardContent, CardDescription, CardHeader, CardTitle ***REMOVED*** from '@/components/ui/card';
import ***REMOVED*** ArrowRight, Building, ClipboardList, CreditCard, FileText, MessageSquare, PlusCircle, Users, Wrench ***REMOVED*** from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    ***REMOVED***
        title: 'Overview',
        href: '/dashboard',
***REMOVED***,
];

export default function DashboardOverview() ***REMOVED***
    const handleAddNewProperty = () => ***REMOVED***
        alert('Add new property clicked!');
***REMOVED***;

    // Updated overview stats
    const overviewStats = [
        ***REMOVED***
            title: 'Total Properties',
            value: '12',
            icon: <Building className="h-6 w-6" />,
            bgColor: 'bg-sky-100 dark:bg-sky-900',
            iconColor: 'text-sky-600 dark:text-sky-400',
            href: '/dashboard/properties',
    ***REMOVED***,
        ***REMOVED***
            title: 'Active Tenants',
            value: '28',
            icon: <Users className="h-6 w-6" />,
            bgColor: 'bg-amber-100 dark:bg-amber-900',
            iconColor: 'text-amber-600 dark:text-amber-400',
            href: '/dashboard/tenants',
    ***REMOVED***,
        ***REMOVED***
            title: 'Pending Applications',
            value: '5',
            icon: <ClipboardList className="h-6 w-6" />,
            bgColor: 'bg-purple-100 dark:bg-purple-900',
            iconColor: 'text-purple-600 dark:text-purple-400',
            href: '/dashboard/applications',
    ***REMOVED***,
        ***REMOVED***
            title: 'Open Maintenance',
            value: '3',
            icon: <Wrench className="h-6 w-6" />,
            bgColor: 'bg-orange-100 dark:bg-orange-900',
            iconColor: 'text-orange-600 dark:text-orange-400',
            href: '/dashboard/maintenance',
    ***REMOVED***,
    ];

    const financialStats = [
        ***REMOVED***
            title: 'Occupancy Rate',
            value: '92%',
            icon: <FileText className="h-5 w-5 text-muted-foreground" />,
            description: 'Based on active leases',
    ***REMOVED***,
        ***REMOVED***
            title: 'Pending Payments',
            value: '$3,450',
            icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
            description: 'Across all tenants',
            href: '/dashboard/payments',
    ***REMOVED***,
    ];

    const recentActivities = [
        ***REMOVED***
            id: 'act1',
            description: 'New application received for 456 Oak Avenue from Lucy van Pelt.',
            time: '30 mins ago',
            href: '/dashboard/applications',
    ***REMOVED***,
        ***REMOVED***
            id: 'act2',
            description: "Maintenance ticket #MNT-003 (AC Not Cooling) updated to 'In Progress'.",
            time: '1 hour ago',
            href: '/dashboard/maintenance',
    ***REMOVED***,
        ***REMOVED***
            id: 'act3',
            description: 'Lease for 123 Main St, Unit 4B (Alice Johnson) due for renewal in 45 days.',
            time: 'Yesterday',
            href: '/dashboard/leases',
    ***REMOVED***,
        ***REMOVED***
            id: 'act4',
            description: 'You have 2 new unread messages.',
            time: 'Just now',
            href: '/dashboard/chat',
    ***REMOVED***,
    ];

    return (
        <AppLayout breadcrumbs=***REMOVED***breadcrumbs***REMOVED***>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Dashboard Overview"
                    actionButton=***REMOVED******REMOVED***
                        label: 'Add New Property',
                        onClick: handleAddNewProperty,
                        icon: <PlusCircle className="h-4 w-4" />,
                ***REMOVED******REMOVED***
                />
                <div className="flex-1 space-y-6 p-4 sm:p-6">
                    ***REMOVED***/* Key Metric Cards */***REMOVED***
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        ***REMOVED***overviewStats.map((stat) => (
                            <Card key=***REMOVED***stat.title***REMOVED*** className="transition-shadow hover:shadow-lg">
                                <Link href=***REMOVED***stat.href || '#'***REMOVED***>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">***REMOVED***stat.title***REMOVED***</CardTitle>
                                        <div className=***REMOVED***`rounded-md p-2 $***REMOVED***stat.bgColor***REMOVED***`***REMOVED***>
                                            ***REMOVED***React.cloneElement(stat.icon, ***REMOVED*** className: `h-5 w-5 $***REMOVED***stat.iconColor***REMOVED***` ***REMOVED***)***REMOVED***
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">***REMOVED***stat.value***REMOVED***</div>
                                        <p className="text-xs text-muted-foreground">Click to view details</p>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))***REMOVED***
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        ***REMOVED***/* Financial & Occupancy Summary */***REMOVED***
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Financial & Occupancy</CardTitle>
                                <CardDescription>Quick financial and occupancy snapshot.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                ***REMOVED***financialStats.map((stat) => (
                                    <div key=***REMOVED***stat.title***REMOVED*** className="flex items-center">
                                        <div className="mr-3 rounded-md bg-muted p-2">***REMOVED***stat.icon***REMOVED***</div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">***REMOVED***stat.title***REMOVED***</p>
                                            <p className="text-xl font-semibold">***REMOVED***stat.value***REMOVED***</p>
                                        </div>
                                        ***REMOVED***stat.href && (
                                            <Button variant="ghost" size="sm" asChild className="ml-auto">
                                                <Link href=***REMOVED***stat.href***REMOVED***>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )***REMOVED***
                                    </div>
                                ))***REMOVED***
                            </CardContent>
                        </Card>

                        ***REMOVED***/* Recent Activity */***REMOVED***
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest updates across your properties and tenants.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    ***REMOVED***recentActivities.map((activity) => (
                                        <li key=***REMOVED***activity.id***REMOVED*** className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm">***REMOVED***activity.description***REMOVED***</p>
                                                <p className="text-xs text-muted-foreground">***REMOVED***activity.time***REMOVED***</p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href=***REMOVED***activity.href***REMOVED***>View</Link>
                                            </Button>
                                        </li>
                                    ))***REMOVED***
                                </ul>
                                ***REMOVED***recentActivities.length === 0 && <p className="text-sm text-muted-foreground">No recent activities to display.</p>***REMOVED***
                            </CardContent>
                        </Card>
                    </div>

                    ***REMOVED***/* Quick Links / Other Summaries */***REMOVED***
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                                    Unread Messages
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">5</p>
                                <p className="mb-4 text-xs text-muted-foreground">New messages from tenants</p>
                                <Button asChild>
                                    <Link href="/dashboard/chat">Go to Chat</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Lease Renewals</CardTitle>
                                <CardDescription>Leases nearing their renewal date in the next 60 days.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                ***REMOVED***/* Placeholder - In a real app, list a few upcoming renewals */***REMOVED***
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Link href="#" className="hover:underline">
                                            123 Main St, Unit 4B - Alice Johnson (45 days)
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:underline">
                                            101 Maple Drive - Bob Williams (58 days)
                                        </Link>
                                    </li>
                                </ul>
                                <Button variant="outline" size="sm" asChild className="mt-4">
                                    <Link href="/dashboard/leases?filter=upcoming_renewals">View All Renewals</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col space-y-2">
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/properties/new">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/tenants/new">
                                        <Users className="mr-2 h-4 w-4" /> Add New Tenant
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/maintenance/new">
                                        <Wrench className="mr-2 h-4 w-4" /> Log Maintenance
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
***REMOVED***
