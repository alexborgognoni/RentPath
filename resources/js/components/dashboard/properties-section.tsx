import { PropertyCard } from '@/components/dashboard/property-card';
import type { Property } from '@/types/dashboard';
import { translate as t } from '@/utils/translate-utils';
import { Building, Home, HousePlus } from 'lucide-react';

interface PropertiesSectionProps {
    properties: Property[];
    onAddProperty: () => void;
    onEditProperty: (property: Property) => void;
}

export function PropertiesSection({ properties = [], onAddProperty, onEditProperty }: PropertiesSectionProps) {
    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-8">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center text-2xl font-bold text-foreground">
                        <Home className="mr-3 text-primary" size={28} />
                        {t('properties')} ({properties.length})
                    </h2>
                    <button
                        onClick={onAddProperty}
                        className="flex cursor-pointer items-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
                    >
                        <HousePlus size={20} />
                        <span>{t('addProperty')}</span>
                    </button>
                </div>
            </div>

            <div className="p-8">
                {properties.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <Building size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">{t('noPropertiesYet')}</h3>
                        <p className="mx-auto max-w-md text-muted-foreground">{t('noPropertiesDesc')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} onEdit={onEditProperty} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
