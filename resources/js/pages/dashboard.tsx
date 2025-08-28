import { AgentProfile } from '@/components/dashboard/agent-profile';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { PropertiesSection } from '@/components/dashboard/properties-section';
import { AppLayout } from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import type { Agent, Property } from '@/types/dashboard';
import { translate as t } from '@/utils/translate-utils';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Breadcrumbs will be defined inside the component

// Mock data for development since backend controllers don't exist yet
const mockAgent: Agent = {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 234 567 8900',
    user_role: 'agent',
    company: 'Premium Property Management',
    national_agency_id_number: '12345-ABC',
    agency_website: 'https://premiumproperty.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
};

const mockProperties: Property[] = [
    {
        id: 1,
        title: 'Modern Downtown Apartment',
        address: '123 Main Street',
        city: 'Amsterdam',
        rent_amount: 1800,
        bedrooms: 2,
        bathrooms: 1,
        square_meters: 75,
        apartment_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        invite_token: 'abc123def',
        tenant_count: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        title: 'Cozy Studio Near Park',
        address: '456 Park Avenue',
        city: 'Rotterdam',
        rent_amount: 1200,
        bedrooms: 1,
        bathrooms: 1,
        square_meters: 45,
        apartment_image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
        invite_token: 'def456ghi',
        tenant_count: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 3,
        title: 'Luxury Canal House',
        address: '789 Canal Street',
        city: 'Utrecht',
        rent_amount: 2500,
        bedrooms: 3,
        bathrooms: 2,
        square_meters: 120,
        apartment_image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
        invite_token: 'ghi789jkl',
        tenant_count: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
];

export default function Dashboard() {
    const [agent, setAgent] = useState<Agent | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPropertyForm, setShowPropertyForm] = useState(false);
    const [showEditAgentForm, setShowEditAgentForm] = useState(false);
    const [showEditPropertyForm, setShowEditPropertyForm] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: dashboard().url,
        },
    ];

    useEffect(() => {
        // Simulate API call with mocked data
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Set mock data
                setAgent(mockAgent);
                setProperties(mockProperties);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAddProperty = () => {
        setShowPropertyForm(true);
        // TODO: Implement property form modal
        console.log('Add property form would open here');
    };

    const handleEditAgent = () => {
        setShowEditAgentForm(true);
        // TODO: Implement agent edit form modal
        console.log('Edit agent form would open here');
    };

    const handleEditProperty = (property: Property) => {
        setSelectedProperty(property);
        setShowEditPropertyForm(true);
        // TODO: Implement property edit form modal
        console.log('Edit property form would open here for:', property.title);
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('dashboard')} />
                <DashboardSkeleton />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard')} />
            <div className="min-h-screen bg-background">
                {/* Background blobs similar to home page */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 blur-3xl dark:from-secondary/20 dark:to-primary/20" />
                    <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl dark:from-primary/20 dark:to-secondary/20" />
                    <div className="absolute top-1/3 left-1/3 h-32 w-32 rounded-full bg-gradient-to-br from-secondary/5 to-primary/5 blur-2xl dark:from-secondary/10 dark:to-primary/10" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {error && (
                        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                            <p>{error}</p>
                            <button onClick={() => setError(null)} className="mt-2 text-sm underline hover:no-underline">
                                Dismiss
                            </button>
                        </div>
                    )}

                    {!agent ? (
                        <div className="mx-auto max-w-2xl">
                            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                                <h2 className="mb-4 text-2xl font-bold text-foreground">{t('setupAgentProfile')}</h2>
                                <p className="mb-6 text-muted-foreground">{t('welcomeToDashboard')}</p>
                                <button className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105">
                                    {t('setupAgentProfile')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            {/* Agent Profile */}
                            <AgentProfile agent={agent} onEdit={handleEditAgent} />

                            {/* Properties Section */}
                            <PropertiesSection properties={properties} onAddProperty={handleAddProperty} onEditProperty={handleEditProperty} />
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
