import { AgentProfile } from '@/components/dashboard/agent-profile';
import { PropertiesSection } from '@/components/dashboard/properties-section';
import { PropertyForm } from '@/components/property/property-form';
import { AppLayout } from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import type { Property, PropertyManager } from '@/types/dashboard';
import { translate } from '@/utils/translate-utils';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
    initialManager?: PropertyManager | null;
}

export default function AgentProfilePage({ initialManager }: Props) {
    const { translations } = usePage<SharedData>().props;
    const [propertyManager, setPropertyManager] = useState<PropertyManager | null>(initialManager ?? null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPropertyForm, setShowPropertyForm] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: translate(translations, 'dashboard.title'), href: '/dashboard' },
        { title: translate(translations, 'profile.title'), href: '/setup-profile' },
    ];

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);

            const profileResponse = await fetch('/setup-profile', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });

            if (profileResponse.status === 404) {
                setPropertyManager(null);
                setProperties([]);
                setLoading(false);
                return;
            }

            if (!profileResponse.ok) throw new Error('Failed to fetch profile data');

            const profileData = await profileResponse.json();
            setPropertyManager(profileData.propertyManager);

            if (profileData.propertyManager) {
                const propertiesResponse = await fetch('/properties', {
                    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });

                if (propertiesResponse.ok) {
                    const propertiesData = await propertiesResponse.json();
                    setProperties(propertiesData);
                } else {
                    setProperties([]);
                }
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleEditProfile = () => {
        router.get('/edit-profile');
    };
    const handleSetupProfile = () => {
        router.get('/setup-profile');
    };
    const handleAddProperty = () => {
        if (!propertyManager) return router.get('/setup-profile');
        setShowPropertyForm(true);
    };

    if (loading)
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={translate(translations, 'profile.title')} />
            </AppLayout>
        );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translate(translations, 'profile.title')} />
            <div className="min-h-screen">
                {error && <div className="p-4 text-destructive">{error}</div>}

                {!propertyManager ? (
                    <div className="rounded-xl border p-8 text-center">
                        <h2 className="text-2xl font-bold">Setup Your Property Manager Profile</h2>
                        <p className="mb-4">Complete your property manager profile to start listing properties.</p>
                        <button onClick={handleSetupProfile} className="btn-primary">
                            Setup Profile
                        </button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                        <AgentProfile agent={propertyManager} onEdit={handleEditProfile} />
                        <PropertiesSection properties={properties} onAddProperty={handleAddProperty} onEditProperty={() => {}} />
                    </motion.div>
                )}

                {showPropertyForm && <PropertyForm isOpen={showPropertyForm} onClose={() => setShowPropertyForm(false)} />}
            </div>
        </AppLayout>
    );
}
