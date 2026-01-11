import { CreateLeadModal } from '@/components/leads/create-lead-modal';
import { LeadsTable } from '@/components/leads/leads-table';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { Lead, SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, router, usePage } from '@inertiajs/react';
import { Filter, Plus, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

interface LeadsPageProps {
    leads: Lead[];
    properties: Array<{ id: number; title: string }>;
    filters: {
        property: string | null;
        status: string | null;
        source: string | null;
        search: string | null;
    };
}

export default function LeadsPage({ leads = [], properties = [], filters: initialFilters }: LeadsPageProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.leads, key);

    const [filtersOpen, setFiltersOpen] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: initialFilters?.search || '',
        propertyId: initialFilters?.property || '',
        status: initialFilters?.status || '',
        source: initialFilters?.source || '',
    });

    // Filter leads client-side for immediate feedback
    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            // Property filter
            if (filters.propertyId && lead.property_id.toString() !== filters.propertyId) {
                return false;
            }

            // Status filter
            if (filters.status && lead.status !== filters.status) {
                return false;
            }

            // Source filter
            if (filters.source && lead.source !== filters.source) {
                return false;
            }

            // Search filter (name or email)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const name = `${lead.first_name || ''} ${lead.last_name || ''}`.toLowerCase();
                const email = lead.email.toLowerCase();
                if (!name.includes(searchLower) && !email.includes(searchLower)) {
                    return false;
                }
            }

            return true;
        });
    }, [leads, filters]);

    const handleViewLead = (lead: Lead) => {
        router.visit(route('manager.leads.show', { lead: lead.id }));
    };

    const handlePropertyFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, propertyId: value }));
        // Update URL with query param
        const params: Record<string, string> = {};
        if (value) params.property = value;
        if (filters.status) params.status = filters.status;
        if (filters.source) params.source = filters.source;
        if (filters.search) params.search = filters.search;
        router.get(route('manager.leads.index'), params, { preserveState: true, replace: true });
    };

    const handleStatusFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, status: value }));
        const params: Record<string, string> = {};
        if (filters.propertyId) params.property = filters.propertyId;
        if (value) params.status = value;
        if (filters.source) params.source = filters.source;
        if (filters.search) params.search = filters.search;
        router.get(route('manager.leads.index'), params, { preserveState: true, replace: true });
    };

    const handleSourceFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, source: value }));
        const params: Record<string, string> = {};
        if (filters.propertyId) params.property = filters.propertyId;
        if (filters.status) params.status = filters.status;
        if (value) params.source = value;
        if (filters.search) params.search = filters.search;
        router.get(route('manager.leads.index'), params, { preserveState: true, replace: true });
    };

    const statusSelectOptions = [
        { value: 'invited', label: t('statusInvited') },
        { value: 'viewed', label: t('statusViewed') },
        { value: 'drafting', label: t('statusDrafting') },
        { value: 'applied', label: t('statusApplied') },
        { value: 'archived', label: t('statusArchived') },
    ];

    const sourceSelectOptions = [
        { value: 'manual', label: t('sourceManual') },
        { value: 'invite', label: t('sourceInvite') },
        { value: 'token_signup', label: t('sourceTokenSignup') },
        { value: 'application', label: t('sourceApplication') },
        { value: 'inquiry', label: t('sourceInquiry') },
    ];

    return (
        <ManagerLayout>
            <Head title={t('title')} />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                        <Users className="h-7 w-7 text-primary" />
                        <span>
                            {t('title')} ({filteredLeads.length})
                        </span>
                    </h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        {t('createLead')}
                    </button>
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">{t('allStatuses')}</option>
                                    {statusSelectOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Source Filter */}
                                <select
                                    value={filters.source}
                                    onChange={(e) => handleSourceFilterChange(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">{t('allSources')}</option>
                                    {sourceSelectOptions.map((option) => (
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
                {leads.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card py-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <Users size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">{t('noLeads')}</h3>
                        <p className="mx-auto max-w-md text-muted-foreground">{t('noLeadsDesc')}</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            {t('createLead')}
                        </button>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card py-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <Search size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">{t('noResults')}</h3>
                        <p className="mx-auto max-w-md text-muted-foreground">{t('noResultsDesc')}</p>
                    </div>
                ) : (
                    <LeadsTable leads={filteredLeads} onRowClick={handleViewLead} />
                )}
            </div>

            {/* Create Lead Modal */}
            <CreateLeadModal properties={properties} isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </ManagerLayout>
    );
}
