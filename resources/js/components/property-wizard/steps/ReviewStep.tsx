import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData, WizardStep } from '@/hooks/usePropertyWizard';
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

const propertyTypeLabels: Record<string, string> = {
    apartment: 'Apartment',
    house: 'House',
    room: 'Room',
    commercial: 'Commercial',
    industrial: 'Industrial',
    parking: 'Parking',
};

const subtypeLabels: Record<string, string> = {
    studio: 'Studio',
    loft: 'Loft',
    duplex: 'Duplex',
    triplex: 'Triplex',
    penthouse: 'Penthouse',
    serviced: 'Serviced Apartment',
    detached: 'Detached House',
    'semi-detached': 'Semi-detached',
    villa: 'Villa',
    bungalow: 'Bungalow',
    private_room: 'Private Room',
    student_room: 'Student Room',
    'co-living': 'Co-living Space',
    office: 'Office Space',
    retail: 'Retail Shop',
    warehouse: 'Warehouse',
    factory: 'Factory',
    garage: 'Garage',
    indoor_spot: 'Indoor Parking Spot',
    outdoor_spot: 'Outdoor Parking Spot',
};

const currencySymbols: Record<string, string> = {
    eur: '€',
    chf: 'CHF ',
    usd: '$',
    gbp: '£',
};

const countryLabels: Record<string, string> = {
    CH: 'Switzerland',
    DE: 'Germany',
    FR: 'France',
    AT: 'Austria',
    IT: 'Italy',
    US: 'United States',
    GB: 'United Kingdom',
    NL: 'Netherlands',
    BE: 'Belgium',
    ES: 'Spain',
};

const heatingLabels: Record<string, string> = {
    gas: 'Gas',
    electric: 'Electric',
    district: 'District Heating',
    heat_pump: 'Heat Pump',
    wood: 'Wood',
    other: 'Other',
};

export function ReviewStep({ data, errors, onEditStep, isEditMode = false }: ReviewStepProps) {
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
            countryLabels[data.country] || data.country,
        ].filter(Boolean);
        return parts.join(', ');
    };

    const getAmenities = () => {
        const amenities: { icon: React.ElementType; label: string }[] = [];
        if (data.kitchen_equipped) amenities.push({ icon: ChefHat, label: 'Equipped Kitchen' });
        if (data.kitchen_separated) amenities.push({ icon: ChefHat, label: 'Separate Kitchen' });
        if (data.has_cellar) amenities.push({ icon: Package, label: 'Cellar' });
        if (data.has_laundry) amenities.push({ icon: WashingMachine, label: 'Laundry' });
        if (data.has_fireplace) amenities.push({ icon: Flame, label: 'Fireplace' });
        if (data.has_air_conditioning) amenities.push({ icon: AirVent, label: 'A/C' });
        if (data.has_garden) amenities.push({ icon: Fence, label: 'Garden' });
        if (data.has_rooftop) amenities.push({ icon: Sunrise, label: 'Rooftop' });
        return amenities;
    };

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
                    Edit
                </button>
            </div>
            {children}
        </motion.div>
    );

    return (
        <StepContainer
            title={isEditMode ? 'Your Property Listing' : 'Review your listing'}
            description={isEditMode ? 'Click Edit on any section to make changes' : 'Make sure everything looks good before publishing'}
        >
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Error banner */}
                {hasErrors && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-destructive bg-destructive/10 p-4"
                    >
                        <p className="font-medium text-destructive">Please fix the following issues:</p>
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
                                    +{data.images.length - 1} more photos
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex aspect-video items-center justify-center bg-muted">
                            <div className="text-center text-muted-foreground">
                                <Building2 className="mx-auto mb-2 h-12 w-12" />
                                <p>No photos added</p>
                            </div>
                        </div>
                    )}

                    {/* Title and price */}
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{data.title || 'Untitled Property'}</h2>
                                <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {data.city || 'Location not set'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{formatPrice(data.rent_amount, data.rent_currency)}</p>
                                <p className="text-sm text-muted-foreground">/month</p>
                            </div>
                        </div>

                        {/* Quick specs */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {propertyTypeLabels[data.type]} • {subtypeLabels[data.subtype]}
                            </span>
                            {data.bedrooms > 0 && (
                                <span className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    {data.bedrooms} bed{data.bedrooms !== 1 ? 's' : ''}
                                </span>
                            )}
                            {data.bathrooms > 0 && (
                                <span className="flex items-center gap-1">
                                    <Bath className="h-4 w-4" />
                                    {data.bathrooms} bath{data.bathrooms !== 1 ? 's' : ''}
                                </span>
                            )}
                            {data.size && (
                                <span className="flex items-center gap-1">
                                    <Expand className="h-4 w-4" />
                                    {data.size} m²
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Details sections */}
                <Section title="Property Type" step="property-type" delay={0.1}>
                    <p className="text-foreground">
                        {propertyTypeLabels[data.type]} — {subtypeLabels[data.subtype]}
                    </p>
                </Section>

                <Section title="Location" step="location" delay={0.15}>
                    <p className="flex items-start gap-2 text-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        {formatAddress()}
                    </p>
                </Section>

                <Section title="Specifications" step="specifications" delay={0.2}>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        {data.bedrooms > 0 && (
                            <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-muted-foreground" />
                                <span>{data.bedrooms} Bedrooms</span>
                            </div>
                        )}
                        {data.bathrooms > 0 && (
                            <div className="flex items-center gap-2">
                                <Bath className="h-4 w-4 text-muted-foreground" />
                                <span>{data.bathrooms} Bathrooms</span>
                            </div>
                        )}
                        {data.size && (
                            <div className="flex items-center gap-2">
                                <Expand className="h-4 w-4 text-muted-foreground" />
                                <span>{data.size} m² living</span>
                            </div>
                        )}
                        {data.balcony_size && (
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span>{data.balcony_size} m² balcony</span>
                            </div>
                        )}
                        {data.land_size && (
                            <div className="flex items-center gap-2">
                                <TreePine className="h-4 w-4 text-muted-foreground" />
                                <span>{data.land_size} m² land</span>
                            </div>
                        )}
                        {(data.parking_spots_interior > 0 || data.parking_spots_exterior > 0) && (
                            <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <span>{data.parking_spots_interior + data.parking_spots_exterior} parking</span>
                            </div>
                        )}
                        {data.floor_level !== undefined && (
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span>Floor {data.floor_level}</span>
                            </div>
                        )}
                        {data.has_elevator && (
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Elevator</span>
                            </div>
                        )}
                    </div>
                </Section>

                {getAmenities().length > 0 && (
                    <Section title="Amenities" step="amenities" delay={0.25}>
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
                    <Section title="Energy" step="energy" delay={0.3}>
                        <div className="flex flex-wrap gap-4 text-sm">
                            {data.energy_class && (
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Energy Class: <strong>{data.energy_class}</strong>
                                    </span>
                                </div>
                            )}
                            {data.thermal_insulation_class && (
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Insulation: <strong>{data.thermal_insulation_class}</strong>
                                    </span>
                                </div>
                            )}
                            {data.heating_type && (
                                <div className="flex items-center gap-2">
                                    <Leaf className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Heating: <strong>{heatingLabels[data.heating_type]}</strong>
                                    </span>
                                </div>
                            )}
                        </div>
                    </Section>
                )}

                <Section title="Pricing & Availability" step="pricing" delay={0.35}>
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Monthly Rent</p>
                            <p className="text-xl font-bold text-primary">{formatPrice(data.rent_amount, data.rent_currency)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Available</p>
                            <p className="flex items-center gap-1 font-medium text-foreground">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {data.available_date
                                    ? new Date(data.available_date).toLocaleDateString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : 'Immediately'}
                            </p>
                        </div>
                    </div>
                </Section>

                {data.description && (
                    <Section title="Description" step="media" delay={0.4}>
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
                        By publishing, you confirm that the information above is accurate and complete.
                    </motion.p>
                )}
            </div>
        </StepContainer>
    );
}
