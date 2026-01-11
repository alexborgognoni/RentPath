import { StepContainer } from '@/components/property-wizard/components/step-container';
import type { PropertyWizardData } from '@/hooks/use-property-wizard';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Flame, Leaf, Thermometer, Zap } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface EnergyStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
}

const energyClasses = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
const thermalClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

const HEATING_ICONS = {
    gas: Flame,
    electric: Zap,
    district: Thermometer,
    heat_pump: Leaf,
    wood: Flame,
    other: Thermometer,
} as const;

function useHeatingTypes() {
    const { translations } = usePage<SharedData>().props;
    const t = useCallback((key: string) => translate(translations, key), [translations]);

    return useMemo(
        () => [
            { value: 'gas' as const, label: t('wizard.energyStep.heatingTypes.gas'), icon: HEATING_ICONS.gas },
            { value: 'electric' as const, label: t('wizard.energyStep.heatingTypes.electric'), icon: HEATING_ICONS.electric },
            { value: 'district' as const, label: t('wizard.energyStep.heatingTypes.district'), icon: HEATING_ICONS.district },
            { value: 'heat_pump' as const, label: t('wizard.energyStep.heatingTypes.heat_pump'), icon: HEATING_ICONS.heat_pump },
            { value: 'wood' as const, label: t('wizard.energyStep.heatingTypes.wood'), icon: HEATING_ICONS.wood },
            { value: 'other' as const, label: t('wizard.energyStep.heatingTypes.other'), icon: HEATING_ICONS.other },
        ],
        [t],
    );
}

const getEnergyColor = (rating: string): string => {
    const colors: Record<string, string> = {
        'A+': 'bg-green-500',
        A: 'bg-green-400',
        B: 'bg-lime-400',
        C: 'bg-yellow-400',
        D: 'bg-amber-400',
        E: 'bg-orange-400',
        F: 'bg-orange-500',
        G: 'bg-red-500',
    };
    return colors[rating] || 'bg-muted';
};

export function EnergyStep({ data, updateData }: EnergyStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const heatingTypes = useHeatingTypes();

    return (
        <StepContainer title={t('wizard.energyStep.title')} description={t('wizard.energyStep.description')}>
            <div className="mx-auto max-w-3xl">
                {/* Optional step indicator */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                        <Leaf className="h-4 w-4" />
                        <span>{t('wizard.energyStep.optionalNote')}</span>
                    </div>
                </motion.div>

                {/* Energy Class */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                        <Zap className="h-5 w-5 text-primary" />
                        {t('wizard.energyStep.energyPerformance')}
                    </h3>

                    <div className="flex flex-wrap justify-center gap-2">
                        {energyClasses.map((rating, index) => {
                            const isSelected = data.energy_class === rating;

                            return (
                                <motion.button
                                    key={rating}
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 + index * 0.03 }}
                                    onClick={() => updateData('energy_class', isSelected ? undefined : rating)}
                                    className={cn(
                                        'relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-2 font-bold transition-all',
                                        isSelected
                                            ? 'border-foreground text-white shadow-lg ' + getEnergyColor(rating)
                                            : 'border-border bg-card text-foreground hover:border-primary/50',
                                    )}
                                >
                                    {rating}
                                    {isSelected && (
                                        <motion.div
                                            layoutId="energy-selection"
                                            className="absolute inset-0 rounded-xl ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">{t('wizard.energyStep.energyHelp')}</p>
                </motion.div>

                {/* Thermal Insulation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                        <Thermometer className="h-5 w-5 text-primary" />
                        {t('wizard.energyStep.thermalInsulation')}
                    </h3>

                    <div className="flex flex-wrap justify-center gap-2">
                        {thermalClasses.map((rating, index) => {
                            const isSelected = data.thermal_insulation_class === rating;

                            return (
                                <motion.button
                                    key={rating}
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.03 }}
                                    onClick={() => updateData('thermal_insulation_class', isSelected ? undefined : rating)}
                                    className={cn(
                                        'relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-2 font-bold transition-all',
                                        isSelected
                                            ? 'border-foreground text-white shadow-lg ' + getEnergyColor(rating)
                                            : 'border-border bg-card text-foreground hover:border-primary/50',
                                    )}
                                >
                                    {rating}
                                    {isSelected && (
                                        <motion.div
                                            layoutId="thermal-selection"
                                            className="absolute inset-0 rounded-xl ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Heating Type */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                        <Flame className="h-5 w-5 text-primary" />
                        {t('wizard.energyStep.heatingSystem')}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {heatingTypes.map((heating, index) => {
                            const Icon = heating.icon;
                            const isSelected = data.heating_type === heating.value;

                            return (
                                <motion.button
                                    key={heating.value}
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.03 }}
                                    onClick={() => updateData('heating_type', isSelected ? undefined : heating.value)}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all',
                                        isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/40',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded-lg',
                                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className={cn('font-medium', isSelected ? 'text-primary' : 'text-foreground')}>{heating.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </StepContainer>
    );
}
