import { PropertiesSection } from '@/components/dashboard/properties-section';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { Property } from '@/types/dashboard';
import { route } from '@/utils/route';
import { Head, router } from '@inertiajs/react';

export default function Dashboard({ properties = [] }: { properties?: Property[] }) {
    const handleAddProperty = () => {
        router.visit(route('properties.create'));
    };

    const handleEditProperty = (property: Property) => {
        router.visit(route('properties.edit', { property: property.id }));
    };

    return (
        <ManagerLayout>
            <Head title="Dashboard" />
            <PropertiesSection properties={properties} onAddProperty={handleAddProperty} onEditProperty={handleEditProperty} />
        </ManagerLayout>
    );
}
