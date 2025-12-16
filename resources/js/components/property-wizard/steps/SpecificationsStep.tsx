import { NumberStepper } from '@/components/property-wizard/components/NumberStepper';
import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { PROPERTY_CONSTRAINTS } from '@/lib/validation/property-validation';
import { motion } from 'framer-motion';
import { Bath, Bed, Building2, Calendar, Car, Expand, Layers, TreePine } from 'lucide-react';

interface SpecificationsStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    onBlur?: (field: keyof PropertyWizardData, value: unknown) => void;
}

export function SpecificationsStep({ data, updateData, errors, onBlur }: SpecificationsStepProps) {
    const propertyType = data.type;

    // Determine which fields to show based on property type
    const showBedrooms = ['apartment', 'house'].includes(propertyType); // Room IS the bedroom
    const showBathrooms = ['apartment', 'house', 'room', 'commercial', 'industrial'].includes(propertyType);
    const showParking = ['apartment', 'house', 'commercial', 'industrial'].includes(propertyType);
    const showSize = propertyType !== 'parking';
    const showBalcony = ['apartment', 'house', 'room'].includes(propertyType); // Rooms can have balcony access
    const showLandSize = propertyType === 'house';
    const showFloor = ['apartment', 'room', 'commercial', 'parking'].includes(propertyType); // Parking garages have levels
    const showElevator = ['apartment', 'house', 'room', 'commercial', 'parking'].includes(propertyType); // Multi-story buildings/garages
    const showYearBuilt = ['apartment', 'house', 'commercial', 'industrial'].includes(propertyType);

    // Determine which sections to show
    const showRoomsSection = showBedrooms || showBathrooms;
    const showSpaceSection = showSize || showBalcony || showLandSize;
    const showParkingSection = showParking;
    const showBuildingSection = showFloor || showYearBuilt || showElevator;

    const handleBlur = (field: keyof PropertyWizardData) => {
        if (onBlur) {
            onBlur(field, data[field]);
        }
    };

    const inputClassName = (hasError?: boolean) =>
        cn(
            'w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground shadow-sm transition-all',
            'placeholder:text-muted-foreground/60',
            'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            hasError ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary/30',
        );

    // Calculate grid columns for space section
    const spaceFieldCount = [showSize, showBalcony, showLandSize].filter(Boolean).length;
    const spaceGridCols = spaceFieldCount === 3 ? 'md:grid-cols-3' : spaceFieldCount === 2 ? 'md:grid-cols-2' : '';

    let sectionIndex = 0;

    return (
        <StepContainer title="Tell us about the space" description="These details help tenants find the perfect match">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Section 1: Rooms */}
                {showRoomsSection && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex++ * 0.1 }}
                        className="rounded-2xl border border-border/50 bg-card/30 p-6"
                    >
                        <h3 className="mb-6 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                            <Bed className="h-5 w-5 text-primary" />
                            Rooms
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            {showBedrooms && (
                                <NumberStepper
                                    value={data.bedrooms}
                                    onChange={(v) => updateData('bedrooms', v)}
                                    min={0}
                                    max={20}
                                    label="Bedrooms"
                                    icon={<Bed className="h-4 w-4" />}
                                />
                            )}
                            {showBathrooms && (
                                <NumberStepper
                                    value={data.bathrooms}
                                    onChange={(v) => updateData('bathrooms', v)}
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    label="Bathrooms"
                                    icon={<Bath className="h-4 w-4" />}
                                />
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Section 2: Space */}
                {showSpaceSection && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex++ * 0.1 }}
                        className="rounded-2xl border border-border/50 bg-card/30 p-6"
                    >
                        <h3 className="mb-6 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                            <Expand className="h-5 w-5 text-primary" />
                            Space
                        </h3>
                        <div className={cn('grid grid-cols-1 gap-4', spaceGridCols)}>
                            {showSize && (
                                <div>
                                    <label htmlFor="size" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Expand className="h-4 w-4 text-muted-foreground" />
                                        Living Space
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="size"
                                            value={data.size || ''}
                                            onChange={(e) => updateData('size', parseFloat(e.target.value) || undefined)}
                                            onBlur={() => handleBlur('size')}
                                            className={inputClassName(!!errors.size)}
                                            placeholder="0"
                                            min={PROPERTY_CONSTRAINTS.size.min}
                                            max={PROPERTY_CONSTRAINTS.size.max}
                                            aria-invalid={!!errors.size}
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
                                            m²
                                        </span>
                                    </div>
                                    {errors.size && <p className="mt-1.5 text-sm text-destructive">{errors.size}</p>}
                                </div>
                            )}

                            {showBalcony && (
                                <div>
                                    <label htmlFor="balcony_size" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Layers className="h-4 w-4 text-muted-foreground" />
                                        Balcony/Terrace
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="balcony_size"
                                            value={data.balcony_size || ''}
                                            onChange={(e) => updateData('balcony_size', parseFloat(e.target.value) || undefined)}
                                            onBlur={() => handleBlur('balcony_size')}
                                            className={inputClassName(!!errors.balcony_size)}
                                            placeholder="0"
                                            min={PROPERTY_CONSTRAINTS.balcony_size.min}
                                            max={PROPERTY_CONSTRAINTS.balcony_size.max}
                                            aria-invalid={!!errors.balcony_size}
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
                                            m²
                                        </span>
                                    </div>
                                    {errors.balcony_size && <p className="mt-1.5 text-sm text-destructive">{errors.balcony_size}</p>}
                                </div>
                            )}

                            {showLandSize && (
                                <div>
                                    <label htmlFor="land_size" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <TreePine className="h-4 w-4 text-muted-foreground" />
                                        Land Size
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="land_size"
                                            value={data.land_size || ''}
                                            onChange={(e) => updateData('land_size', parseFloat(e.target.value) || undefined)}
                                            onBlur={() => handleBlur('land_size')}
                                            className={inputClassName(!!errors.land_size)}
                                            placeholder="0"
                                            min={PROPERTY_CONSTRAINTS.land_size.min}
                                            max={PROPERTY_CONSTRAINTS.land_size.max}
                                            aria-invalid={!!errors.land_size}
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
                                            m²
                                        </span>
                                    </div>
                                    {errors.land_size && <p className="mt-1.5 text-sm text-destructive">{errors.land_size}</p>}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Section 3: Parking */}
                {showParkingSection && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex++ * 0.1 }}
                        className="rounded-2xl border border-border/50 bg-card/30 p-6"
                    >
                        <h3 className="mb-6 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                            <Car className="h-5 w-5 text-primary" />
                            Parking
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            <NumberStepper
                                value={data.parking_spots_interior}
                                onChange={(v) => updateData('parking_spots_interior', v)}
                                min={0}
                                max={10}
                                label="Indoor Spots"
                                icon={<Car className="h-4 w-4" />}
                            />
                            <NumberStepper
                                value={data.parking_spots_exterior}
                                onChange={(v) => updateData('parking_spots_exterior', v)}
                                min={0}
                                max={10}
                                label="Outdoor Spots"
                                icon={<Car className="h-4 w-4" />}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Section 4: Building */}
                {showBuildingSection && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex++ * 0.1 }}
                        className="rounded-2xl border border-border/50 bg-card/30 p-6"
                    >
                        <h3 className="mb-6 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                            <Building2 className="h-5 w-5 text-primary" />
                            Building
                        </h3>
                        <div className="flex flex-wrap items-end justify-center gap-6">
                            {showFloor && (
                                <div className="w-40">
                                    <label htmlFor="floor_level" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Layers className="h-4 w-4 text-muted-foreground" />
                                        Floor Level
                                    </label>
                                    <input
                                        type="number"
                                        id="floor_level"
                                        value={data.floor_level ?? ''}
                                        onChange={(e) => updateData('floor_level', parseInt(e.target.value) || undefined)}
                                        onBlur={() => handleBlur('floor_level')}
                                        className={inputClassName(!!errors.floor_level)}
                                        placeholder="0"
                                        min={PROPERTY_CONSTRAINTS.floor_level.min}
                                        max={PROPERTY_CONSTRAINTS.floor_level.max}
                                        aria-invalid={!!errors.floor_level}
                                    />
                                    {errors.floor_level && <p className="mt-1.5 text-sm text-destructive">{errors.floor_level}</p>}
                                </div>
                            )}

                            {showYearBuilt && (
                                <div className="w-40">
                                    <label htmlFor="year_built" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Year Built
                                    </label>
                                    <input
                                        type="number"
                                        id="year_built"
                                        value={data.year_built || ''}
                                        onChange={(e) => updateData('year_built', parseInt(e.target.value) || undefined)}
                                        onBlur={() => handleBlur('year_built')}
                                        className={inputClassName(!!errors.year_built)}
                                        placeholder="2020"
                                        min={PROPERTY_CONSTRAINTS.year_built.min}
                                        max={new Date().getFullYear()}
                                        aria-invalid={!!errors.year_built}
                                    />
                                    {errors.year_built && <p className="mt-1.5 text-sm text-destructive">{errors.year_built}</p>}
                                </div>
                            )}

                            {showElevator && (
                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-3 transition-all hover:border-primary/50">
                                    <input
                                        type="checkbox"
                                        checked={data.has_elevator}
                                        onChange={(e) => updateData('has_elevator', e.target.checked)}
                                        className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20"
                                    />
                                    <span className="font-medium text-foreground">Has Elevator</span>
                                </label>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Parking-specific size field */}
                {propertyType === 'parking' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex++ * 0.1 }}
                        className="rounded-2xl border border-border/50 bg-card/30 p-6"
                    >
                        <h3 className="mb-6 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                            <Expand className="h-5 w-5 text-primary" />
                            Space
                        </h3>
                        <div className="mx-auto max-w-xs">
                            <label htmlFor="parking_size" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                <Expand className="h-4 w-4 text-muted-foreground" />
                                Parking Space Size
                                <span className="text-xs text-muted-foreground">(optional)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="parking_size"
                                    value={data.size || ''}
                                    onChange={(e) => updateData('size', parseFloat(e.target.value) || undefined)}
                                    className={inputClassName()}
                                    placeholder="0"
                                    min="0"
                                />
                                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
                                    m²
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </StepContainer>
    );
}
