import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { Building2, Car, Factory, Home, Hotel, Users } from 'lucide-react';

interface PropertyTypeStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
}

interface PropertyTypeOption {
    value: Property['type'];
    label: string;
    description: string;
    icon: React.ElementType;
    subtypes: { value: Property['subtype']; label: string }[];
}

const propertyTypes: PropertyTypeOption[] = [
    {
        value: 'apartment',
        label: 'Apartment',
        description: 'Flats, studios, penthouses',
        icon: Building2,
        subtypes: [
            { value: 'studio', label: 'Studio' },
            { value: 'loft', label: 'Loft' },
            { value: 'duplex', label: 'Duplex' },
            { value: 'triplex', label: 'Triplex' },
            { value: 'penthouse', label: 'Penthouse' },
            { value: 'serviced', label: 'Serviced Apartment' },
        ],
    },
    {
        value: 'house',
        label: 'House',
        description: 'Detached, villas, bungalows',
        icon: Home,
        subtypes: [
            { value: 'detached', label: 'Detached House' },
            { value: 'semi-detached', label: 'Semi-detached' },
            { value: 'villa', label: 'Villa' },
            { value: 'bungalow', label: 'Bungalow' },
        ],
    },
    {
        value: 'room',
        label: 'Room',
        description: 'Private rooms, co-living',
        icon: Users,
        subtypes: [
            { value: 'private_room', label: 'Private Room' },
            { value: 'student_room', label: 'Student Room' },
            { value: 'co-living', label: 'Co-living Space' },
        ],
    },
    {
        value: 'commercial',
        label: 'Commercial',
        description: 'Offices, retail spaces',
        icon: Hotel,
        subtypes: [
            { value: 'office', label: 'Office Space' },
            { value: 'retail', label: 'Retail Shop' },
        ],
    },
    {
        value: 'industrial',
        label: 'Industrial',
        description: 'Warehouses, factories',
        icon: Factory,
        subtypes: [
            { value: 'warehouse', label: 'Warehouse' },
            { value: 'factory', label: 'Factory' },
        ],
    },
    {
        value: 'parking',
        label: 'Parking',
        description: 'Garages, parking spots',
        icon: Car,
        subtypes: [
            { value: 'garage', label: 'Garage' },
            { value: 'indoor_spot', label: 'Indoor Parking Spot' },
            { value: 'outdoor_spot', label: 'Outdoor Parking Spot' },
        ],
    },
];

export function PropertyTypeStep({ data, updateData, errors }: PropertyTypeStepProps) {
    const selectedType = propertyTypes.find((t) => t.value === data.type);

    const handleTypeSelect = (type: Property['type']) => {
        updateData('type', type);
        // Auto-select first subtype when type changes
        const typeOption = propertyTypes.find((t) => t.value === type);
        if (typeOption && typeOption.subtypes.length > 0) {
            updateData('subtype', typeOption.subtypes[0].value);
        }
    };

    return (
        <StepContainer title="What type of property are you listing?" description="Choose the category that best describes your property">
            {/* Property Type Cards */}
            <div className="mx-auto max-w-4xl">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {propertyTypes.map((type, index) => {
                        const Icon = type.icon;
                        const isSelected = data.type === type.value;

                        return (
                            <motion.button
                                key={type.value}
                                type="button"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleTypeSelect(type.value)}
                                className={cn(
                                    'group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-200',
                                    isSelected
                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                        : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50',
                                )}
                            >
                                {/* Selection indicator */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="type-selection"
                                        className="absolute inset-0 rounded-2xl border-2 border-primary"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}

                                {/* Icon */}
                                <div
                                    className={cn(
                                        'flex h-14 w-14 items-center justify-center rounded-xl transition-colors',
                                        isSelected
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                                    )}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>

                                {/* Label */}
                                <div>
                                    <h3 className={cn('font-semibold transition-colors', isSelected ? 'text-primary' : 'text-foreground')}>
                                        {type.label}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">{type.description}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {errors.type && <p className="mt-4 text-center text-sm text-destructive">{errors.type}</p>}

                {/* Subtype Selection - Appears when type is selected */}
                {selectedType && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-8"
                    >
                        <h3 className="mb-4 text-center text-lg font-medium text-foreground">What kind of {selectedType.label.toLowerCase()}?</h3>

                        <div className="flex flex-wrap justify-center gap-3">
                            {selectedType.subtypes.map((subtype, index) => {
                                const isSubtypeSelected = data.subtype === subtype.value;

                                return (
                                    <motion.button
                                        key={subtype.value}
                                        type="button"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => updateData('subtype', subtype.value)}
                                        className={cn(
                                            'rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all duration-200',
                                            isSubtypeSelected
                                                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted',
                                        )}
                                    >
                                        {subtype.label}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {errors.subtype && <p className="mt-4 text-center text-sm text-destructive">{errors.subtype}</p>}
                    </motion.div>
                )}
            </div>
        </StepContainer>
    );
}
