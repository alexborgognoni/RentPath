import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building, ClipboardList, CreditCard, FileText, MessageSquare, PlusCircle, Users, Wrench } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Overview',
        href: '/dashboard',
    },
];

export default function DashboardOverview() {
    const handleAddNewProperty = () => {
        alert('Add new property clicked!');
    };

    // Updated overview stats
    const overviewStats = [
        {
            title: 'Total Properties',
            value: '12',
            icon: <Building className="h-6 w-6" />,
            bgColor: 'bg-sky-100 dark:bg-sky-900',
            iconColor: 'text-sky-600 dark:text-sky-400',
            href: '/dashboard/properties',
        },
        {
            title: 'Active Tenants',
            value: '28',
            icon: <Users className="h-6 w-6" />,
            bgColor: 'bg-amber-100 dark:bg-amber-900',
            iconColor: 'text-amber-600 dark:text-amber-400',
            href: '/dashboard/tenants',
        },
        {
            title: 'Pending Applications',
            value: '5',
            icon: <ClipboardList className="h-6 w-6" />,
            bgColor: 'bg-purple-100 dark:bg-purple-900',
            iconColor: 'text-purple-600 dark:text-purple-400',
            href: '/dashboard/applications',
        },
        {
            title: 'Open Maintenance',
            value: '3',
            icon: <Wrench className="h-6 w-6" />,
            bgColor: 'bg-orange-100 dark:bg-orange-900',
            iconColor: 'text-orange-600 dark:text-orange-400',
            href: '/dashboard/maintenance',
        },
    ];

    const financialStats = [
        {
            title: 'Occupancy Rate',
            value: '92%',
            icon: <FileText className="h-5 w-5 text-muted-foreground" />,
            description: 'Based on active leases',
        },
        {
            title: 'Pending Payments',
            value: '$3,450',
            icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
            description: 'Across all tenants',
            href: '/dashboard/payments',
        },
    ];

    const recentActivities = [
        {
            id: 'act1',
            description: 'New application received for 456 Oak Avenue from Lucy van Pelt.',
            time: '30 mins ago',
            href: '/dashboard/applications',
        },
        {
            id: 'act2',
            description: "Maintenance ticket #MNT-003 (AC Not Cooling) updated to 'In Progress'.",
            time: '1 hour ago',
            href: '/dashboard/maintenance',
        },
        {
            id: 'act3',
            description: 'Lease for 123 Main St, Unit 4B (Alice Johnson) due for renewal in 45 days.',
            time: 'Yesterday',
            href: '/dashboard/leases',
        },
        {
            id: 'act4',
            description: 'You have 2 new unread messages.',
            time: 'Just now',
            href: '/dashboard/chat',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col">
                <DashboardHeader
                    title="Dashboard Overview"
                    actionButton={{
                        label: 'Add New Property',
                        onClick: handleAddNewProperty,
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
                />
                <div className="flex-1 space-y-6 p-4 sm:p-6">
                    {/* Key Metric Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {overviewStats.map((stat) => (
                            <Card key={stat.title} className="transition-shadow hover:shadow-lg">
                                <Link href={stat.href || '#'}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                        <div className={`rounded-md p-2 ${stat.bgColor}`}>
                                            {React.cloneElement(stat.icon, { className: `h-5 w-5 ${stat.iconColor}` })}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">Click to view details</p>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Financial & Occupancy Summary */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Financial & Occupancy</CardTitle>
                                <CardDescription>Quick financial and occupancy snapshot.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {financialStats.map((stat) => (
                                    <div key={stat.title} className="flex items-center">
                                        <div className="mr-3 rounded-md bg-muted p-2">{stat.icon}</div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                            <p className="text-xl font-semibold">{stat.value}</p>
                                        </div>
                                        {stat.href && (
                                            <Button variant="ghost" size="sm" asChild className="ml-auto">
                                                <Link href={stat.href}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest updates across your properties and tenants.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <li key={activity.id} className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={activity.href}>View</Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                {recentActivities.length === 0 && <p className="text-sm text-muted-foreground">No recent activities to display.</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Links / Other Summaries */}
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
                                {/* Placeholder - In a real app, list a few upcoming renewals */}
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
}
