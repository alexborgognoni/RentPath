import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AirVent, ChefHat, Fence, Flame, Package, Sunrise, UtensilsCrossed, WashingMachine } from 'lucide-react';
import { useMemo } from 'react';

interface AmenitiesStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
}

type AmenityKey = keyof Pick<
    PropertyWizardData,
    'kitchen_equipped' | 'kitchen_separated' | 'has_cellar' | 'has_laundry' | 'has_fireplace' | 'has_air_conditioning' | 'has_garden' | 'has_rooftop'
>;

interface AmenityOption {
    key: AmenityKey;
    label: string;
    icon: React.ElementType;
    category: 'kitchen' | 'building' | 'outdoor';
}

const AMENITY_KEYS: { key: AmenityKey; translationKey: string; icon: React.ElementType; category: 'kitchen' | 'building' | 'outdoor' }[] = [
    { key: 'kitchen_equipped', translationKey: 'equippedKitchen', icon: ChefHat, category: 'kitchen' },
    { key: 'kitchen_separated', translationKey: 'separateKitchen', icon: UtensilsCrossed, category: 'kitchen' },
    { key: 'has_cellar', translationKey: 'cellarStorage', icon: Package, category: 'building' },
    { key: 'has_laundry', translationKey: 'laundryRoom', icon: WashingMachine, category: 'building' },
    { key: 'has_fireplace', translationKey: 'fireplace', icon: Flame, category: 'building' },
    { key: 'has_air_conditioning', translationKey: 'airConditioning', icon: AirVent, category: 'building' },
    { key: 'has_garden', translationKey: 'gardenAccess', icon: Fence, category: 'outdoor' },
    { key: 'has_rooftop', translationKey: 'rooftopAccess', icon: Sunrise, category: 'outdoor' },
];

function useAmenities() {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);

    return useMemo(
        () =>
            AMENITY_KEYS.map((amenity) => ({
                key: amenity.key,
                label: t(`wizard.amenitiesStep.amenities.${amenity.translationKey}`),
                icon: amenity.icon,
                category: amenity.category,
            })),
        [translations],
    );
}

function useCategories() {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);

    return useMemo(
        () => [
            { id: 'kitchen' as const, label: t('wizard.amenitiesStep.categories.kitchen') },
            { id: 'building' as const, label: t('wizard.amenitiesStep.categories.building') },
            { id: 'outdoor' as const, label: t('wizard.amenitiesStep.categories.outdoor') },
        ],
        [translations],
    );
}

export function AmenitiesStep({ data, updateData }: AmenitiesStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const amenities = useAmenities();
    const categories = useCategories();
    const toggleAmenity = (key: AmenityOption['key']) => {
        updateData(key, !data[key]);
    };

    return (
        <StepContainer title={t('wizard.amenitiesStep.title')} description={t('wizard.amenitiesStep.description')}>
            <div className="mx-auto max-w-3xl">
                {categories.map((category, categoryIndex) => {
                    const categoryAmenities = amenities.filter((a) => a.category === category.id);
                    if (categoryAmenities.length === 0) return null;

                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                            className="mb-8"
                        >
                            <h3 className="mb-4 text-sm font-medium tracking-wider text-muted-foreground uppercase">{category.label}</h3>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {categoryAmenities.map((amenity, index) => {
                                    const Icon = amenity.icon;
                                    const isSelected = data[amenity.key] === true;

                                    return (
                                        <motion.button
                                            key={amenity.key}
                                            type="button"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: categoryIndex * 0.1 + index * 0.03 }}
                                            onClick={() => toggleAmenity(amenity.key)}
                                            className={cn(
                                                'group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200',
                                                isSelected
                                                    ? 'border-primary bg-primary/5 shadow-md'
                                                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50',
                                            )}
                                        >
                                            {/* Checkmark indicator */}
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </motion.div>
                                            )}

                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                                                )}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            {/* Label */}
                                            <span
                                                className={cn(
                                                    'text-center text-sm font-medium transition-colors',
                                                    isSelected ? 'text-primary' : 'text-foreground',
                                                )}
                                            >
                                                {amenity.label}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}

                {/* Helper text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-sm text-muted-foreground"
                >
                    {t('wizard.amenitiesStep.helperText')}
                </motion.p>
            </div>
        </StepContainer>
    );
}
