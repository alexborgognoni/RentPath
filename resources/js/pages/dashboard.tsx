import { PropertiesSection } from '@/components/dashboard/properties-section';
import { PropertyForm } from '@/components/property/property-form';
import { AppLayout } from '@/layouts/app-layout';
import type { Property } from '@/types/dashboard';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ properties = [] }: { properties?: Property[] }) {
    const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

    const handleAddProperty = () => {
        setShowAddPropertyModal(true);
    };

    const handleClosePropertyModal = () => {
        setShowAddPropertyModal(false);
    };

    const handleEditProperty = (property: Property) => {
        // TODO: Implement edit property functionality
        console.log('Edit property:', property);
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <PropertiesSection 
                properties={properties} 
                onAddProperty={handleAddProperty} 
                onEditProperty={handleEditProperty} 
            />
            
            {showAddPropertyModal && (
                <PropertyForm 
                    onClose={handleClosePropertyModal}
                    onSuccess={() => {
                        handleClosePropertyModal();
                        // The form already refreshes the page on success
                    }}
                />
            )}
        </AppLayout>
    );
}
