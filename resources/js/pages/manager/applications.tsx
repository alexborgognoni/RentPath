import { ApplicationsTable } from '@/components/applications/applications-table';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { Application, SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, router, usePage } from '@inertiajs/react';
import { FileText, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ApplicationsPageProps {
    applications: Application[];
    properties: Array<{ id: number; title: string }>;
    selectedPropertyId: number | null;
}

export default function ApplicationsPage({ applications = [], properties = [], selectedPropertyId }: ApplicationsPageProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.applications, key);

    const [filtersOpen, setFiltersOpen] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        propertyId: selectedPropertyId?.toString() || '',
        status: '',
    });

    // Filter applications
    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            // Property filter
            if (filters.propertyId && app.property_id.toString() !== filters.propertyId) {
                return false;
            }

            // Status filter
            if (filters.status && app.status !== filters.status) {
                return false;
            }

            // Search filter (applicant name or email)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const applicantName = `${app.tenant_profile?.user?.first_name || ''} ${app.tenant_profile?.user?.last_name || ''}`.toLowerCase();
                const applicantEmail = (app.tenant_profile?.user?.email || '').toLowerCase();
                if (!applicantName.includes(searchLower) && !applicantEmail.includes(searchLower)) {
                    return false;
                }
            }

            return true;
        });
    }, [applications, filters]);

    const handleViewApplication = (application: Application) => {
        router.visit(route('manager.applications.show', { application: application.id }));
    };

    const handlePropertyFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, propertyId: value }));
        // Update URL with query param
        if (value) {
            router.get(route('manager.applications.index'), { property: value }, { preserveState: true, replace: true });
        } else {
            router.get(route('manager.applications.index'), {}, { preserveState: true, replace: true });
        }
    };

    const statusOptions = [
        { value: 'submitted', label: t('statusSubmitted') },
        { value: 'under_review', label: t('statusUnderReview') },
        { value: 'visit_scheduled', label: t('statusVisitScheduled') },
        { value: 'visit_completed', label: t('statusVisitCompleted') },
        { value: 'approved', label: t('statusApproved') },
        { value: 'rejected', label: t('statusRejected') },
        { value: 'leased', label: t('statusLeased') },
    ];

    return (
        <ManagerLayout>
            <Head title={t('title')} />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                        <FileText className="h-7 w-7 text-primary" />
                        <span>
                            {t('title')} ({filteredApplications.length})
                        </span>
                    </h1>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left ${filtersOpen ? 'rounded-t-xl border-b border-border' : 'rounded-xl'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{t('filters')}</span>
                        </div>
                    </button>
                    {filtersOpen && (
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        value={filters.search}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                                        className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                </div>

                                {/* Property Filter */}
                                <select
                                    value={filters.propertyId}
                                    onChange={(e) => handlePropertyFilterChange(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">{t('allProperties')}</option>
                                    {properties.map((property) => (
                                        <option key={property.id} value={property.id}>
                                            {property.title}
                                        </option>
                                    ))}
                                </select>

                                {/* Status Filter */}
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">{t('allStatuses')}</option>
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                {applications.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card py-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <FileText size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">{t('noApplications')}</h3>
                        <p className="mx-auto max-w-md text-muted-foreground">{t('noApplicationsDesc')}</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card py-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <Search size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">{t('noResults')}</h3>
                        <p className="mx-auto max-w-md text-muted-foreground">{t('noResultsDesc')}</p>
                    </div>
                ) : (
                    <ApplicationsTable applications={filteredApplications} onRowClick={handleViewApplication} />
                )}
            </div>
        </ManagerLayout>
    );
}
