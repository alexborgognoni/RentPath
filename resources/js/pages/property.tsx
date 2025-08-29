import { AppLayout } from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Property, TenantApplication } from '@/types/dashboard';
import { translate as t } from '@/utils/translate-utils';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Components to be created
import { PropertyInfo } from '@/components/property/property-info';
import { PropertySidebar } from '@/components/property/property-sidebar';
import { TenantApplicationsTable } from '@/components/property/tenant-applications-table';
import { TenantDetailsModal } from '@/components/property/tenant-details-modal';

interface PropertyPageProps {
    property: Property;
    propertyId: string;
}

// This function is no longer needed as we'll use real data from Inertia props
const getMockProperty = (id: string): Property => {
    const properties = [
        {
            id: 1,
            user_id: 1,
            title: 'Modern Downtown Apartment',
            address: '123 Main Street, Amsterdam',
            description: `# Modern Living in the Heart of Amsterdam

This **stunning apartment** offers the perfect blend of contemporary design and urban convenience. Located in Amsterdam's vibrant downtown area, you'll be steps away from:

- World-class restaurants and cafes
- Cultural attractions and museums  
- Excellent public transportation
- Beautiful canals and parks

## Features & Amenities

- **High-speed internet** included
- Modern kitchen with *premium appliances*
- Spacious living area with large windows
- Secure building with elevator access
- Bike storage available

*Perfect for professionals or couples looking for a premium city experience.*`,
            image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            type: 'apartment' as const,
            bedrooms: 2,
            bathrooms: 1,
            parking_spots: 0,
            size: 75,
            size_unit: 'square_meters' as const,
            available_date: '2024-03-15',
            rent_amount: 1800,
            rent_currency: 'eur' as const,
            invite_token: 'abc123def',
            is_active: true,
            tenant_count: 2,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
        },
        {
            id: 2,
            user_id: 1,
            title: 'Cozy Studio Near Park',
            address: '456 Park Avenue, Rotterdam',
            description: `# Charming Studio Apartment

A **beautiful studio** apartment located near Rotterdam's most popular park. This cozy space is perfect for students or young professionals.

## What's Included

- Fully furnished living space
- Kitchen with modern appliances
- High-speed internet
- Utilities included in rent

*Quiet neighborhood with easy access to city center.*`,
            image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            type: 'studio' as const,
            bedrooms: 0,
            bathrooms: 1,
            parking_spots: 0,
            size: 45,
            size_unit: 'square_meters' as const,
            available_date: '2024-04-01',
            rent_amount: 1200,
            rent_currency: 'eur' as const,
            invite_token: 'def456ghi',
            is_active: true,
            tenant_count: 1,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
        },
        {
            id: 3,
            user_id: 1,
            title: 'Luxury Canal House',
            address: '789 Canal Street, Utrecht',
            description: `# Historic Canal House

Experience luxury living in this **beautifully restored** 17th-century canal house. This unique property combines historic charm with modern amenities.

## Historic Features

- Original wooden beams and floors
- Canal-front location with water views
- Traditional Dutch architecture
- Private garden courtyard

## Modern Amenities

- **Fully renovated** kitchen and bathrooms
- Central heating and air conditioning
- High-speed fiber internet
- Secure parking space included

*A rare opportunity to live in Utrecht's historic city center.*`,
            image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
            type: 'house' as const,
            bedrooms: 3,
            bathrooms: 2,
            parking_spots: 1,
            size: 120,
            size_unit: 'square_meters' as const,
            available_date: '2024-05-01',
            rent_amount: 2500,
            rent_currency: 'eur' as const,
            invite_token: 'ghi789jkl',
            is_active: true,
            tenant_count: 3,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
        },
    ];
    
    return properties.find(p => p.id === parseInt(id)) || properties[0];
};

// Mock tenant applications
const getMockTenantApplications = (propertyId: string): TenantApplication[] => {
    return [
        {
            id: 1,
            property_id: parseInt(propertyId),
            applicant_name: 'Sarah Johnson',
            applicant_email: 'sarah.johnson@email.com',
            applicant_phone: '+31 6 1234 5678',
            monthly_income: 5000,
            employment_status: 'Full-time',
            employer: 'Tech Solutions BV',
            move_in_date: '2024-03-01',
            application_status: 'pending',
            documents_uploaded: ['id', 'income', 'employment'],
            notes: 'Strong application with excellent references.',
            created_at: '2024-02-15T10:30:00Z',
            updated_at: '2024-02-15T10:30:00Z',
        },
        {
            id: 2,
            property_id: parseInt(propertyId),
            applicant_name: 'Michael Chen',
            applicant_email: 'michael.chen@email.com',
            applicant_phone: '+31 6 9876 5432',
            monthly_income: 4500,
            employment_status: 'Contract',
            employer: 'Creative Agency',
            move_in_date: '2024-03-15',
            application_status: 'approved',
            documents_uploaded: ['id', 'income', 'employment', 'references'],
            notes: 'Approved tenant with good credit history.',
            created_at: '2024-02-10T14:20:00Z',
            updated_at: '2024-02-20T09:15:00Z',
        },
    ];
};

export default function PropertyPage() {
    const page = usePage<PropertyPageProps>();
    const { property: initialProperty } = page.props;
    
    const [property] = useState<Property | null>(initialProperty);
    const [tenantApplications, setTenantApplications] = useState<TenantApplication[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<TenantApplication | null>(null);
    const [loading] = useState(false); // No loading needed since data comes from Inertia
    const [error, setError] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard'), href: '/dashboard' },
        { title: property?.title || t('property') },
    ];

    useEffect(() => {
        // For now, set empty tenant applications since that system isn't implemented yet
        setTenantApplications([]);
    }, []);

    const handleUpdateTenantStatus = async (tenantId: number, status: string, notes?: string) => {
        // Mock implementation
        setTenantApplications(prev => 
            prev.map(tenant => 
                tenant.id === tenantId 
                    ? { ...tenant, application_status: status, notes: notes || tenant.notes, updated_at: new Date().toISOString() }
                    : tenant
            )
        );
        
        // Update selected tenant if it was the one being updated
        if (selectedTenant?.id === tenantId) {
            setSelectedTenant(prev => prev ? { ...prev, application_status: status, notes: notes || prev.notes } : null);
        }
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('loadingProperty')} />
                <div className="min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="animate-pulse space-y-8">
                            <div className="h-96 rounded-2xl bg-muted"></div>
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="h-64 rounded-2xl bg-muted"></div>
                                    <div className="h-96 rounded-2xl bg-muted"></div>
                                </div>
                                <div className="h-96 rounded-2xl bg-muted"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error || !property) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('propertyNotFound')} />
                <div className="min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="rounded-2xl border border-destructive/20 bg-card p-8 text-center shadow-sm">
                            <h2 className="mb-4 text-2xl font-bold text-destructive">
                                {error || t('propertyNotFound')}
                            </h2>
                            <p className="mb-6 text-muted-foreground">
                                The property you're looking for doesn't exist or you don't have access to it.
                            </p>
                            <a
                                href="/dashboard"
                                className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
                            >
                                Back to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={property.title} />
            <div className="min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
                >
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <PropertyInfo property={property} />
                            <TenantApplicationsTable
                                tenantApplications={tenantApplications}
                                onTenantSelect={setSelectedTenant}
                            />
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                <PropertySidebar 
                                    property={property}
                                    tenantCount={tenantApplications.length}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tenant Details Modal */}
                    {selectedTenant && (
                        <TenantDetailsModal
                            tenant={selectedTenant}
                            onClose={() => setSelectedTenant(null)}
                            onUpdateStatus={handleUpdateTenantStatus}
                        />
                    )}
                </motion.div>
            </div>
        </AppLayout>
    );
}