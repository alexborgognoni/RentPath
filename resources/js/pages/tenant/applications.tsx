import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TenantLayout } from '@/layouts/tenant-layout';
import type { SharedData } from '@/types';
import type { Application } from '@/types/dashboard';
import { useReactiveCurrency } from '@/utils/currency-utils';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, FileText, Home, MapPin, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ApplicationsPageProps {
    applications: Application[];
    filters: {
        status: string;
        search: string;
    };
}

const statusOptions = [
    { value: 'all', labelKey: 'tenant.applications.filter.all', fallback: 'All Statuses' },
    { value: 'draft', labelKey: 'tenant.applications.filter.draft', fallback: 'Draft' },
    { value: 'submitted', labelKey: 'tenant.applications.filter.submitted', fallback: 'Submitted' },
    { value: 'under_review', labelKey: 'tenant.applications.filter.under_review', fallback: 'Under Review' },
    { value: 'visit_scheduled', labelKey: 'tenant.applications.filter.visit_scheduled', fallback: 'Visit Scheduled' },
    { value: 'visit_completed', labelKey: 'tenant.applications.filter.visit_completed', fallback: 'Visit Completed' },
    { value: 'approved', labelKey: 'tenant.applications.filter.approved', fallback: 'Approved' },
    { value: 'rejected', labelKey: 'tenant.applications.filter.rejected', fallback: 'Rejected' },
    { value: 'withdrawn', labelKey: 'tenant.applications.filter.withdrawn', fallback: 'Withdrawn' },
    { value: 'leased', labelKey: 'tenant.applications.filter.leased', fallback: 'Leased' },
];

export default function ApplicationsPage({ applications, filters }: ApplicationsPageProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const { formatRent } = useReactiveCurrency();

    const [searchValue, setSearchValue] = useState(filters.search);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        return (
            t(`tenant.dashboard.status.${status}`) ||
            status
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        // Remove empty values
        if (!value || value === 'all') {
            delete (newFilters as Record<string, string>)[key];
        }
        router.get(route('applications.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Debounced search effect
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Only trigger search if the value has actually changed from what's in filters
        if (searchValue !== filters.search) {
            debounceTimerRef.current = setTimeout(() => {
                handleFilterChange('search', searchValue);
            }, 300);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasActiveFilters = filters.search || (filters.status && filters.status !== 'all');

    return (
        <TenantLayout>
            <Head title={t('tenant.applications.title') || 'My Applications'} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{t('tenant.applications.title') || 'My Applications'}</h1>
                        <p className="text-muted-foreground">{t('tenant.applications.subtitle') || 'Track and manage your rental applications'}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('tenant.applications.filter.search') || 'Search properties...'}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={filters.status || 'all'}
                        onChange={(value) => handleFilterChange('status', value)}
                        options={statusOptions.map((opt) => ({
                            value: opt.value,
                            label: t(opt.labelKey) || opt.fallback,
                        }))}
                        placeholder={t('tenant.applications.filter.all') || 'All Statuses'}
                        className="w-full sm:w-[200px]"
                    />
                </div>

                {/* Applications Grid or Empty State */}
                {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                        <Home className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                        <h2 className="mb-2 text-xl font-semibold text-foreground">
                            {hasActiveFilters
                                ? t('tenant.applications.no_results') || 'No applications found'
                                : t('tenant.applications.empty.title') || 'No Applications Yet'}
                        </h2>
                        <p className="mb-6 max-w-md text-muted-foreground">
                            {hasActiveFilters
                                ? t('tenant.applications.no_results_description') || 'Try adjusting your filters.'
                                : t('tenant.applications.empty.description') || 'When you apply to properties, they will appear here.'}
                        </p>
                        {!hasActiveFilters && (
                            <Link
                                href={route('properties.index')}
                                className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                            >
                                {t('tenant.applications.empty.cta') || 'Browse Properties'}
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {applications.map((application) => {
                            const property = application.property;
                            const mainImage = property?.images?.find((img) => img.is_main) || property?.images?.[0];

                            return (
                                <Link
                                    key={application.id}
                                    href={route('applications.show', { application: application.id })}
                                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg"
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
                                                <Home className="h-12 w-12 text-muted-foreground opacity-50" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(application.status)}`}>
                                                {formatStatus(application.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="p-5">
                                        <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                                            {property?.title || 'Untitled Property'}
                                        </h3>

                                        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span className="truncate">
                                                    {property?.house_number} {property?.street_name}, {property?.city}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Applied {formatDate(application.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-border pt-4">
                                            <span className="text-lg font-bold text-foreground">
                                                {formatRent(property?.rent_amount || 0, property?.rent_currency)}
                                                <span className="text-sm font-normal text-muted-foreground">/mo</span>
                                            </span>
                                            <span className="text-sm font-medium text-primary group-hover:underline">
                                                {t('tenant.applications.view_details') || 'View Details'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </TenantLayout>
    );
}
