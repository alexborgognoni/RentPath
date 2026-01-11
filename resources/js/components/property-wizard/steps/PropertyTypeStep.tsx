import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Car, Factory, Home, Hotel, Users } from 'lucide-react';
import { useCallback, useMemo } from 'react';

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

function usePropertyTypes(): PropertyTypeOption[] {
    const { translations } = usePage<SharedData>().props;
    const t = useCallback((key: string) => translate(translations, key), [translations]);

    return useMemo(
        () => [
            {
                value: 'apartment',
                label: t('wizard.propertyTypeStep.types.apartment'),
                description: t('wizard.propertyTypeStep.types.apartmentDesc'),
                icon: Building2,
                subtypes: [
                    { value: 'studio', label: t('wizard.propertyTypeStep.subtypes.studio') },
                    { value: 'loft', label: t('wizard.propertyTypeStep.subtypes.loft') },
                    { value: 'duplex', label: t('wizard.propertyTypeStep.subtypes.duplex') },
                    { value: 'triplex', label: t('wizard.propertyTypeStep.subtypes.triplex') },
                    { value: 'penthouse', label: t('wizard.propertyTypeStep.subtypes.penthouse') },
                    { value: 'serviced', label: t('wizard.propertyTypeStep.subtypes.serviced') },
                ],
            },
            {
                value: 'house',
                label: t('wizard.propertyTypeStep.types.house'),
                description: t('wizard.propertyTypeStep.types.houseDesc'),
                icon: Home,
                subtypes: [
                    { value: 'detached', label: t('wizard.propertyTypeStep.subtypes.detached') },
                    { value: 'semi-detached', label: t('wizard.propertyTypeStep.subtypes.semi-detached') },
                    { value: 'villa', label: t('wizard.propertyTypeStep.subtypes.villa') },
                    { value: 'bungalow', label: t('wizard.propertyTypeStep.subtypes.bungalow') },
                ],
            },
            {
                value: 'room',
                label: t('wizard.propertyTypeStep.types.room'),
                description: t('wizard.propertyTypeStep.types.roomDesc'),
                icon: Users,
                subtypes: [
                    { value: 'private_room', label: t('wizard.propertyTypeStep.subtypes.private_room') },
                    { value: 'student_room', label: t('wizard.propertyTypeStep.subtypes.student_room') },
                    { value: 'co-living', label: t('wizard.propertyTypeStep.subtypes.co-living') },
                ],
            },
            {
                value: 'commercial',
                label: t('wizard.propertyTypeStep.types.commercial'),
                description: t('wizard.propertyTypeStep.types.commercialDesc'),
                icon: Hotel,
                subtypes: [
                    { value: 'office', label: t('wizard.propertyTypeStep.subtypes.office') },
                    { value: 'retail', label: t('wizard.propertyTypeStep.subtypes.retail') },
                ],
            },
            {
                value: 'industrial',
                label: t('wizard.propertyTypeStep.types.industrial'),
                description: t('wizard.propertyTypeStep.types.industrialDesc'),
                icon: Factory,
                subtypes: [
                    { value: 'warehouse', label: t('wizard.propertyTypeStep.subtypes.warehouse') },
                    { value: 'factory', label: t('wizard.propertyTypeStep.subtypes.factory') },
                ],
            },
            {
                value: 'parking',
                label: t('wizard.propertyTypeStep.types.parking'),
                description: t('wizard.propertyTypeStep.types.parkingDesc'),
                icon: Car,
                subtypes: [
                    { value: 'garage', label: t('wizard.propertyTypeStep.subtypes.garage') },
                    { value: 'indoor_spot', label: t('wizard.propertyTypeStep.subtypes.indoor_spot') },
                    { value: 'outdoor_spot', label: t('wizard.propertyTypeStep.subtypes.outdoor_spot') },
                ],
            },
        ],
        [t],
    );
}

export function PropertyTypeStep({ data, updateData, errors }: PropertyTypeStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string, params?: Record<string, string | number>) => translate(translations, key, params);
    const propertyTypes = usePropertyTypes();
    const selectedType = propertyTypes.find((pt) => pt.value === data.type);

    const handleTypeSelect = (type: Property['type']) => {
        updateData('type', type);
        // Auto-select first subtype when type changes
        const typeOption = propertyTypes.find((pt) => pt.value === type);
        if (typeOption && typeOption.subtypes.length > 0) {
            updateData('subtype', typeOption.subtypes[0].value);
        }
    };

    return (
        <StepContainer title={t('wizard.propertyTypeStep.title')} description={t('wizard.propertyTypeStep.description')}>
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
                                    'group relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-200',
                                    isSelected
                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                        : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50',
                                )}
                            >
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
                        <h3 className="mb-4 text-center text-lg font-medium text-foreground">
                            {t('wizard.propertyTypeStep.whatKind', { type: selectedType.label.toLowerCase() })}
                        </h3>

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
                                            'cursor-pointer rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all duration-200',
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
