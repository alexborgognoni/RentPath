import { PropertyInfo } from '@/components/property/property-info';
import { PublicLayout } from '@/layouts/public-layout';
import type { Property } from '@/types/dashboard';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';

interface PropertyViewPageProps {
    property: Property;
    token?: string | null;
    canApply: boolean;
    tenantProfileStatus: {
        exists: boolean;
        verified: boolean;
        rejected: boolean;
    };
    applicationStatus: {
        hasApplication: boolean;
        hasDraft: boolean;
        status: string | null;
        applicationId?: number;
    };
    auth?: {
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function PropertyViewPage() {
    const { property, canApply, auth, tenantProfileStatus, applicationStatus, token } = usePage<PropertyViewPageProps>().props;

    const handleApply = () => {
        // Build apply URL with token if present
        const applyUrl = token ? `/properties/${property.id}/apply?token=${token}` : `/properties/${property.id}/apply`;

        window.location.href = applyUrl;
    };

    return (
        <PublicLayout>
            <Head title={property.title} />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <PropertyInfo property={property} />
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Apply Card */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="mb-4 text-xl font-bold text-foreground">Interested in this property?</h3>

                                <div className="mb-6 space-y-3">
                                    <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                                        <span className="text-sm text-muted-foreground">Monthly Rent</span>
                                        <span className="text-lg font-bold text-foreground">{property.formatted_rent}</span>
                                    </div>

                                    {property.available_date && (
                                        <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                                            <span className="text-sm text-muted-foreground">Available From</span>
                                            <span className="text-sm font-semibold text-foreground">
                                                {new Date(property.available_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {canApply || applicationStatus.hasDraft ? (
                                    <button
                                        onClick={handleApply}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105"
                                    >
                                        <Send size={20} />
                                        {applicationStatus.hasDraft ? 'Continue Application' : 'Apply for this Property'}
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        {!auth?.user ? (
                                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                                    Please sign in to apply for this property
                                                </p>
                                            </div>
                                        ) : !tenantProfileStatus.exists ? (
                                            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-center">
                                                <p className="mb-3 text-sm text-blue-600 dark:text-blue-400">
                                                    Create your tenant profile to apply for properties
                                                </p>
                                                <a
                                                    href="/profile/tenant/setup"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                                >
                                                    Create Profile
                                                </a>
                                            </div>
                                        ) : !tenantProfileStatus.verified ? (
                                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                                    {tenantProfileStatus.rejected
                                                        ? 'Your profile was rejected. Please update and resubmit.'
                                                        : 'Your profile is pending verification'}
                                                </p>
                                                <a
                                                    href="/profile/tenant/unverified"
                                                    className="mt-2 inline-block text-sm font-medium text-amber-700 hover:underline dark:text-amber-300"
                                                >
                                                    View Status
                                                </a>
                                            </div>
                                        ) : applicationStatus.hasApplication ? (
                                            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
                                                <p className="mb-2 text-sm text-green-600 dark:text-green-400">
                                                    You have already applied for this property
                                                </p>
                                                <a
                                                    href={`/applications/${applicationStatus.applicationId}`}
                                                    className="text-sm font-medium text-green-700 hover:underline dark:text-green-300"
                                                >
                                                    View Application
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                                                <p className="text-sm text-amber-600 dark:text-amber-400">Unable to apply at this time</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!auth?.user && (
                                    <div className="mt-4 space-y-2">
                                        <a
                                            href="/login"
                                            className="block w-full rounded-lg border border-border bg-background px-6 py-3 text-center font-medium text-foreground transition-all hover:bg-background/80"
                                        >
                                            Sign In
                                        </a>
                                        <p className="text-center text-xs text-muted-foreground">
                                            Don't have an account?{' '}
                                            <a href="/register" className="text-primary hover:underline">
                                                Register here
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Property Manager Card */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-foreground">Property Manager</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <span className="text-sm font-medium text-foreground capitalize">
                                            {property.property_manager?.type || 'N/A'}
                                        </span>
                                    </div>
                                    {property.property_manager?.company_name && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Company</span>
                                            <span className="text-sm font-medium text-foreground">{property.property_manager.company_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-foreground">Location</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>
                                        {property.house_number} {property.street_name}
                                    </p>
                                    {property.street_line2 && <p>{property.street_line2}</p>}
                                    <p>
                                        {property.city}, {property.postal_code}
                                    </p>
                                    {property.state && <p>{property.state}</p>}
                                    <p className="uppercase">{property.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
