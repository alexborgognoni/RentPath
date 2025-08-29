import { PropertiesSection } from '@/components/dashboard/properties-section';
import { AppLayout } from '@/layouts/app-layout';
import type { Property } from '@/types/dashboard';
import { Head } from '@inertiajs/react';

export default function Dashboard({ properties = [] }: { properties?: Property[] }) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <PropertiesSection properties={properties} onAddProperty={() => {}} onEditProperty={() => {}} />
        </AppLayout>
    );
}
