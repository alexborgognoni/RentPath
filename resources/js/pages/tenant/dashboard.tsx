import { Head, Link } from '@inertiajs/react';
import type { Application } from '@/types/dashboard';
import { Calendar, Home, MapPin } from 'lucide-react';
import { AppLayout } from '@/layouts/app-layout';

interface TenantDashboardProps {
    applications: Application[];
}

export default function TenantDashboard({ applications }: TenantDashboardProps) {
    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            visit_scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            visit_completed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            leased: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
            archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatStatus = (status: string) => {
        return status
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <AppLayout>
            <Head title="My Applications" />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-foreground">My Applications</h1>
                        <p className="text-muted-foreground">Track and manage your rental applications</p>
                    </div>
                    <Link
                        href="/properties"
                        className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                    >
                        Browse Properties
                    </Link>
                </div>

                {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                        <Home className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                        <h2 className="mb-2 text-xl font-semibold text-foreground">No Applications Yet</h2>
                        <p className="mb-6 max-w-md text-muted-foreground">
                            You haven't applied to any properties yet. Start browsing available properties to submit your first
                            application.
                        </p>
                        <Link
                            href="/properties"
                            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                        >
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {applications.map((application) => {
                            const property = application.property;
                            const mainImage = property?.images?.find((img) => img.is_main) || property?.images?.[0];

                            return (
                                <Link
                                    key={application.id}
                                    href={`/applications/${application.id}`}
                                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
                                >
                                    {/* Property Image */}
                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                        {mainImage ? (
                                            <img
                                                src={mainImage.image_url}
                                                alt={property?.title || 'Property'}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Home className="h-16 w-16 text-muted-foreground opacity-30" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute right-3 top-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(application.status)}`}
                                            >
                                                {formatStatus(application.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="p-5">
                                        <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-1">
                                            {property?.title || 'Property Title'}
                                        </h3>

                                        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                                <span className="line-clamp-1">
                                                    {property?.house_number} {property?.street_name}, {property?.city}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                                <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-border pt-4">
                                            <span className="text-xl font-bold text-foreground">{property?.formatted_rent}</span>
                                            <span className="text-sm font-medium text-primary">View Details →</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
