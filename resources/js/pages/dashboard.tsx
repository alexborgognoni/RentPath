import { PropertiesSection } from '@/components/dashboard/properties-section';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { Property } from '@/types/dashboard';
import { Head, router } from '@inertiajs/react';

export default function Dashboard({ properties = [] }: { properties?: Property[] }) {
    const handleAddProperty = () => {
        router.visit('/properties/create');
    };

    const handleEditProperty = (property: Property) => {
        router.visit(`/properties/${property.id}/edit`);
    };

    return (
        <ManagerLayout>
            <Head title="Dashboard" />
            <PropertiesSection
                properties={properties}
                onAddProperty={handleAddProperty}
                onEditProperty={handleEditProperty}
            />
        </ManagerLayout>
    );
}
