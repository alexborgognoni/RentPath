import { ManagerLayout } from '@/layouts/manager-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { PropertyInfo } from '@/components/property/property-info';
import { PropertySidebar } from '@/components/property/property-sidebar';

interface PropertyPageProps extends SharedData {
    property: Property;
    propertyId: string;
}

export default function PropertyPage() {
    const page = usePage<PropertyPageProps>();
    const { property: initialProperty, translations } = page.props;

    const [property] = useState<Property | null>(initialProperty);
    const [error] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: translate(translations, 'properties.title'), href: route('manager.properties.index') },
        { title: property?.title || translate(translations, 'properties.property') },
    ];

    if (error || !property) {
        return (
            <ManagerLayout breadcrumbs={breadcrumbs}>
                <Head title={translate(translations, 'properties.propertyNotFound')} />
                <div className="mt-6 rounded-2xl border border-destructive/20 bg-card p-8 text-center shadow-sm">
                    <h2 className="mb-4 text-2xl font-bold text-destructive">{error || translate(translations, 'properties.propertyNotFound')}</h2>
                    <p className="mb-6 text-muted-foreground">The property you're looking for doesn't exist or you don't have access to it.</p>
                    <Link
                        href={route('manager.properties.index')}
                        className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
                    >
                        Back to Properties
                    </Link>
                </div>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout breadcrumbs={breadcrumbs}>
            <Head title={property.title} />
            <div className="mt-6 grid grid-cols-1 gap-8 pb-6 lg:grid-cols-3">
                {/* Left Column - Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    <PropertyInfo property={property} />
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-1">
                    <PropertySidebar property={property} tenantCount={property.tenant_count || 0} />
                </div>
            </div>
        </ManagerLayout>
    );
}
