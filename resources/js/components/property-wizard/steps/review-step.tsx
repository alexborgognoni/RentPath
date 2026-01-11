import { StepContainer } from '@/components/property-wizard/components/step-container';
import type { PropertyWizardData, WizardStep } from '@/hooks/use-property-wizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AirVent,
    Bath,
    Bed,
    Building2,
    Calendar,
    Car,
    Check,
    ChefHat,
    Expand,
    Fence,
    Flame,
    Layers,
    Leaf,
    MapPin,
    Package,
    Pencil,
    Sunrise,
    Thermometer,
    TreePine,
    WashingMachine,
    Zap,
} from 'lucide-react';

interface ReviewStepProps {
    data: PropertyWizardData;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    onEditStep: (step: WizardStep) => void;
    isEditMode?: boolean;
}

const currencySymbols: Record<string, string> = {
    eur: '€',
    chf: 'CHF ',
    usd: '$',
    gbp: '£',
};

export function ReviewStep({ data, errors, onEditStep, isEditMode = false }: ReviewStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string, params?: Record<string, string | number>) => translate(translations, key, params);
    const hasErrors = Object.keys(errors).length > 0;

    // Find main image from unified images array
    const mainImage = data.images.find((img, idx) => {
        if (img.id !== null && data.mainImageId !== null) {
            return img.id === data.mainImageId;
        }
        return idx === data.mainImageIndex;
    });
    const mainImageSrc = mainImage?.image_url || (data.images.length > 0 ? data.images[0].image_url : null);

    const formatPrice = (amount: number, currency: string) => {
        const symbol = currencySymbols[currency] || currency.toUpperCase();
        return `${symbol}${new Intl.NumberFormat('en-US').format(amount)}`;
    };

    const formatAddress = () => {
        const parts = [
            data.house_number && data.street_name ? `${data.house_number} ${data.street_name}` : '',
            data.street_line2,
            data.city,
            data.state,
            data.postal_code,
            t(`wizard.locationStep.countries.${data.country}`),
        ].filter(Boolean);
        return parts.join(', ');
    };

    const getAmenities = () => {
        const amenities: { icon: React.ElementType; label: string }[] = [];
        if (data.kitchen_equipped) amenities.push({ icon: ChefHat, label: t('wizard.reviewStep.amenityLabels.equippedKitchen') });
        if (data.kitchen_separated) amenities.push({ icon: ChefHat, label: t('wizard.reviewStep.amenityLabels.separateKitchen') });
        if (data.has_cellar) amenities.push({ icon: Package, label: t('wizard.reviewStep.amenityLabels.cellar') });
        if (data.has_laundry) amenities.push({ icon: WashingMachine, label: t('wizard.reviewStep.amenityLabels.laundry') });
        if (data.has_fireplace) amenities.push({ icon: Flame, label: t('wizard.reviewStep.amenityLabels.fireplace') });
        if (data.has_air_conditioning) amenities.push({ icon: AirVent, label: t('wizard.reviewStep.amenityLabels.airConditioning') });
        if (data.has_garden) amenities.push({ icon: Fence, label: t('wizard.reviewStep.amenityLabels.garden') });
        if (data.has_rooftop) amenities.push({ icon: Sunrise, label: t('wizard.reviewStep.amenityLabels.rooftop') });
        return amenities;
    };

    const getPropertyTypeLabel = () => t(`wizard.propertyTypeStep.types.${data.type}`);
    const getSubtypeLabel = () => t(`wizard.propertyTypeStep.subtypes.${data.subtype}`);
    const getHeatingLabel = () => (data.heating_type ? t(`wizard.energyStep.heatingTypes.${data.heating_type}`) : '');

    const Section = ({ title, step, children, delay = 0 }: { title: string; step: WizardStep; children: React.ReactNode; delay?: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="rounded-2xl border border-border bg-card p-6"
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <button
                    type="button"
                    onClick={() => onEditStep(step)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    {t('wizard.reviewStep.edit')}
                </button>
            </div>
            {children}
        </motion.div>
    );

    return (
        <StepContainer
            title={isEditMode ? t('wizard.reviewStep.titleEdit') : t('wizard.reviewStep.title')}
            description={isEditMode ? t('wizard.reviewStep.descriptionEdit') : t('wizard.reviewStep.description')}
        >
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Error banner */}
                {hasErrors && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-destructive bg-destructive/10 p-4"
                    >
                        <p className="font-medium text-destructive">{t('wizard.reviewStep.fixIssues')}</p>
                        <ul className="mt-2 list-inside list-disc text-sm text-destructive">
                            {Object.entries(errors).map(([key, message]) => (
                                <li key={key}>{message}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Preview Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
                >
                    {/* Image preview */}
                    {mainImageSrc ? (
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            <img src={mainImageSrc} alt="Main property image" className="h-full w-full object-cover" />
                            {data.images.length > 1 && (
                                <div className="absolute right-4 bottom-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-medium text-white">
                                    {t('wizard.reviewStep.morePhotos', { count: data.images.length - 1 })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex aspect-video items-center justify-center bg-muted">
                            <div className="text-center text-muted-foreground">
                                <Building2 className="mx-auto mb-2 h-12 w-12" />
                                <p>{t('wizard.reviewStep.noPhotos')}</p>
                            </div>
                        </div>
                    )}

                    {/* Title and price */}
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{data.title || t('wizard.reviewStep.untitledProperty')}</h2>
                                <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {data.city || t('wizard.reviewStep.locationNotSet')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{formatPrice(data.rent_amount, data.rent_currency)}</p>
                                <p className="text-sm text-muted-foreground">{t('wizard.reviewStep.perMonth')}</p>
                            </div>
                        </div>

                        {/* Quick specs */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {getPropertyTypeLabel()} • {getSubtypeLabel()}
                            </span>
                            {data.bedrooms > 0 && (
                                <span className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    {data.bedrooms === 1
                                        ? t('wizard.reviewStep.labels.bedroom', { count: data.bedrooms })
                                        : t('wizard.reviewStep.labels.bedrooms', { count: data.bedrooms })}
                                </span>
                            )}
                            {data.bathrooms > 0 && (
                                <span className="flex items-center gap-1">
                                    <Bath className="h-4 w-4" />
                                    {data.bathrooms === 1
                                        ? t('wizard.reviewStep.labels.bathroom', { count: data.bathrooms })
                                        : t('wizard.reviewStep.labels.bathrooms', { count: data.bathrooms })}
                                </span>
                            )}
                            {data.size && (
                                <span className="flex items-center gap-1">
                                    <Expand className="h-4 w-4" />
                                    {t('wizard.reviewStep.labels.livingSpace', { size: data.size })}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Details sections */}
                <Section title={t('wizard.reviewStep.sections.propertyType')} step="property-type" delay={0.1}>
                    <p className="text-foreground">
                        {getPropertyTypeLabel()} — {getSubtypeLabel()}
                    </p>
                </Section>

                <Section title={t('wizard.reviewStep.sections.location')} step="location" delay={0.15}>
                    <p className="flex items-start gap-2 text-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        {formatAddress()}
                    </p>
                </Section>

                <Section title={t('wizard.reviewStep.sections.specifications')} step="specifications" delay={0.2}>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        {data.bedrooms > 0 && (
                            <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {data.bedrooms === 1
                                        ? t('wizard.reviewStep.labels.bedroom', { count: data.bedrooms })
                                        : t('wizard.reviewStep.labels.bedrooms', { count: data.bedrooms })}
                                </span>
                            </div>
                        )}
                        {data.bathrooms > 0 && (
                            <div className="flex items-center gap-2">
                                <Bath className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {data.bathrooms === 1
                                        ? t('wizard.reviewStep.labels.bathroom', { count: data.bathrooms })
                                        : t('wizard.reviewStep.labels.bathrooms', { count: data.bathrooms })}
                                </span>
                            </div>
                        )}
                        {data.size && (
                            <div className="flex items-center gap-2">
                                <Expand className="h-4 w-4 text-muted-foreground" />
                                <span>{t('wizard.reviewStep.labels.livingSpace', { size: data.size })}</span>
                            </div>
                        )}
                        {data.balcony_size && (
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span>{t('wizard.reviewStep.labels.balcony', { size: data.balcony_size })}</span>
                            </div>
                        )}
                        {data.land_size && (
                            <div className="flex items-center gap-2">
                                <TreePine className="h-4 w-4 text-muted-foreground" />
                                <span>{t('wizard.reviewStep.labels.land', { size: data.land_size })}</span>
                            </div>
                        )}
                        {(data.parking_spots_interior > 0 || data.parking_spots_exterior > 0) && (
                            <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {t('wizard.reviewStep.labels.parking', { count: data.parking_spots_interior + data.parking_spots_exterior })}
                                </span>
                            </div>
                        )}
                        {data.floor_level !== undefined && (
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span>{t('wizard.reviewStep.labels.floor', { level: data.floor_level })}</span>
                            </div>
                        )}
                        {data.has_elevator && (
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>{t('wizard.reviewStep.labels.elevator')}</span>
                            </div>
                        )}
                    </div>
                </Section>

                {getAmenities().length > 0 && (
                    <Section title={t('wizard.reviewStep.sections.amenities')} step="amenities" delay={0.25}>
                        <div className="flex flex-wrap gap-2">
                            {getAmenities().map(({ icon: Icon, label }) => (
                                <span key={label} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {(data.energy_class || data.thermal_insulation_class || data.heating_type) && (
                    <Section title={t('wizard.reviewStep.sections.energy')} step="energy" delay={0.3}>
                        <div className="flex flex-wrap gap-4 text-sm">
                            {data.energy_class && (
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {t('wizard.reviewStep.labels.energyClass')} <strong>{data.energy_class}</strong>
                                    </span>
                                </div>
                            )}
                            {data.thermal_insulation_class && (
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {t('wizard.reviewStep.labels.insulation')} <strong>{data.thermal_insulation_class}</strong>
                                    </span>
                                </div>
                            )}
                            {data.heating_type && (
                                <div className="flex items-center gap-2">
                                    <Leaf className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {t('wizard.reviewStep.labels.heating')} <strong>{getHeatingLabel()}</strong>
                                    </span>
                                </div>
                            )}
                        </div>
                    </Section>
                )}

                <Section title={t('wizard.reviewStep.sections.pricingAvailability')} step="pricing" delay={0.35}>
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">{t('wizard.reviewStep.labels.monthlyRent')}</p>
                            <p className="text-xl font-bold text-primary">{formatPrice(data.rent_amount, data.rent_currency)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t('wizard.reviewStep.labels.available')}</p>
                            <p className="flex items-center gap-1 font-medium text-foreground">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {data.available_date
                                    ? new Date(data.available_date).toLocaleDateString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : t('wizard.reviewStep.immediately')}
                            </p>
                        </div>
                    </div>
                </Section>

                {data.description && (
                    <Section title={t('wizard.reviewStep.sections.description')} step="media" delay={0.4}>
                        <p className="whitespace-pre-wrap text-foreground">{data.description}</p>
                    </Section>
                )}

                {/* Final note */}
                {!isEditMode && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-sm text-muted-foreground"
                    >
                        {t('wizard.reviewStep.finalNote')}
                    </motion.p>
                )}
            </div>
        </StepContainer>
    );
}
