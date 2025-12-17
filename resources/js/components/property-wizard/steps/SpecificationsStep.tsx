import { NumberStepper } from '@/components/property-wizard/components/NumberStepper';
import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { PROPERTY_CONSTRAINTS } from '@/lib/validation/property-validation';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bath, Bed, Building2, Calendar, Car, Expand, Layers, TreePine } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SpecificationsStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    onBlur?: (field: keyof PropertyWizardData, value: unknown) => void;
}

export function SpecificationsStep({ data, updateData, errors, onBlur }: SpecificationsStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const propertyType = data.type;

    // Track display values for size inputs to allow natural typing
    const [sizeDisplay, setSizeDisplay] = useState<string>(() => (data.size != null && data.size > 0 ? String(data.size) : ''));
    const [balconySizeDisplay, setBalconySizeDisplay] = useState<string>(() =>
        data.balcony_size != null && data.balcony_size > 0 ? String(data.balcony_size) : '',
    );
    const [landSizeDisplay, setLandSizeDisplay] = useState<string>(() =>
        data.land_size != null && data.land_size > 0 ? String(data.land_size) : '',
    );

    // Sync display values when data changes externally (e.g., from autosave restore)
    useEffect(() => {
        setSizeDisplay(data.size != null && data.size > 0 ? String(data.size) : '');
    }, [data.size]);
    useEffect(() => {
        setBalconySizeDisplay(data.balcony_size != null && data.balcony_size > 0 ? String(data.balcony_size) : '');
    }, [data.balcony_size]);
    useEffect(() => {
        setLandSizeDisplay(data.land_size != null && data.land_size > 0 ? String(data.land_size) : '');
    }, [data.land_size]);

    // Prevent negative number input for size fields
    const handleSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
        }
    };

    // Handle size input change - update display value and parse for data
    const handleSizeInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'size' | 'balcony_size' | 'land_size',
        setDisplay: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        const inputValue = e.target.value;
        setDisplay(inputValue);

        // Parse and update data
        if (inputValue === '') {
            updateData(field, undefined);
        } else {
            const value = parseFloat(inputValue);
            if (!isNaN(value) && value >= 0) {
                updateData(field, value);
            }
        }
    };

    // Format on blur to show proper decimal places
    const handleSizeBlur = (field: 'size' | 'balcony_size' | 'land_size', setDisplay: React.Dispatch<React.SetStateAction<string>>) => {
        const value = data[field];
        if (value != null && value > 0) {
            setDisplay(value.toFixed(2));
        } else {
            setDisplay('');
        }
        if (onBlur) {
            onBlur(field, value);
        }
    };

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

    // Get display values for size inputs
    const getSizeDisplayValue = (field: 'size' | 'balcony_size' | 'land_size'): string => {
        if (field === 'size') return sizeDisplay;
        if (field === 'balcony_size') return balconySizeDisplay;
        return landSizeDisplay;
    };

    const getSizeDisplaySetter = (field: 'size' | 'balcony_size' | 'land_size'): React.Dispatch<React.SetStateAction<string>> => {
        if (field === 'size') return setSizeDisplay;
        if (field === 'balcony_size') return setBalconySizeDisplay;
        return setLandSizeDisplay;
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
        <StepContainer title={t('wizard.specificationsStep.title')} description={t('wizard.specificationsStep.description')}>
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
                            {t('wizard.specificationsStep.sections.rooms')}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            {showBedrooms && (
                                <NumberStepper
                                    value={data.bedrooms}
                                    onChange={(v) => updateData('bedrooms', v)}
                                    min={0}
                                    max={20}
                                    label={t('wizard.specificationsStep.fields.bedrooms')}
                                    icon={<Bed className="h-4 w-4" />}
                                    integerOnly
                                    error={errors.bedrooms}
                                />
                            )}
                            {showBathrooms && (
                                <NumberStepper
                                    value={data.bathrooms}
                                    onChange={(v) => updateData('bathrooms', v)}
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    label={t('wizard.specificationsStep.fields.bathrooms')}
                                    icon={<Bath className="h-4 w-4" />}
                                    error={errors.bathrooms}
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
                            {t('wizard.specificationsStep.sections.space')}
                        </h3>
                        <div className={cn('grid grid-cols-1 gap-4', spaceGridCols)}>
                            {showSize && (
                                <div>
                                    <label htmlFor="size" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Expand className="h-4 w-4 text-muted-foreground" />
                                        {t('wizard.specificationsStep.fields.livingSpace')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="size"
                                            value={getSizeDisplayValue('size')}
                                            onChange={(e) => handleSizeInputChange(e, 'size', getSizeDisplaySetter('size'))}
                                            onKeyDown={handleSizeKeyDown}
                                            onBlur={() => handleSizeBlur('size', getSizeDisplaySetter('size'))}
                                            className={inputClassName(!!errors.size)}
                                            placeholder="0.00"
                                            min={0}
                                            max={PROPERTY_CONSTRAINTS.size.max}
                                            step="0.01"
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
                                        {t('wizard.specificationsStep.fields.balconyTerrace')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="balcony_size"
                                            value={getSizeDisplayValue('balcony_size')}
                                            onChange={(e) => handleSizeInputChange(e, 'balcony_size', getSizeDisplaySetter('balcony_size'))}
                                            onKeyDown={handleSizeKeyDown}
                                            onBlur={() => handleSizeBlur('balcony_size', getSizeDisplaySetter('balcony_size'))}
                                            className={inputClassName(!!errors.balcony_size)}
                                            placeholder="0.00"
                                            min={0}
                                            max={PROPERTY_CONSTRAINTS.balcony_size.max}
                                            step="0.01"
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
                                        {t('wizard.specificationsStep.fields.landSize')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="land_size"
                                            value={getSizeDisplayValue('land_size')}
                                            onChange={(e) => handleSizeInputChange(e, 'land_size', getSizeDisplaySetter('land_size'))}
                                            onKeyDown={handleSizeKeyDown}
                                            onBlur={() => handleSizeBlur('land_size', getSizeDisplaySetter('land_size'))}
                                            className={inputClassName(!!errors.land_size)}
                                            placeholder="0.00"
                                            min={0}
                                            max={PROPERTY_CONSTRAINTS.land_size.max}
                                            step="0.01"
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
                            {t('wizard.specificationsStep.sections.parking')}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            <NumberStepper
                                value={data.parking_spots_interior}
                                onChange={(v) => updateData('parking_spots_interior', v)}
                                min={0}
                                max={10}
                                label={t('wizard.specificationsStep.fields.indoorSpots')}
                                icon={<Car className="h-4 w-4" />}
                                integerOnly
                                error={errors.parking_spots_interior}
                            />
                            <NumberStepper
                                value={data.parking_spots_exterior}
                                onChange={(v) => updateData('parking_spots_exterior', v)}
                                min={0}
                                max={10}
                                label={t('wizard.specificationsStep.fields.outdoorSpots')}
                                icon={<Car className="h-4 w-4" />}
                                integerOnly
                                error={errors.parking_spots_exterior}
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
                            {t('wizard.specificationsStep.sections.building')}
                        </h3>
                        <div className="flex flex-wrap items-end justify-center gap-6">
                            {showFloor && (
                                <div className="w-40">
                                    <label htmlFor="floor_level" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Layers className="h-4 w-4 text-muted-foreground" />
                                        {t('wizard.specificationsStep.fields.floorLevel')}
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
                                        {t('wizard.specificationsStep.fields.yearBuilt')}
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
                                    <span className="font-medium text-foreground">{t('wizard.specificationsStep.fields.hasElevator')}</span>
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
                            {t('wizard.specificationsStep.sections.space')}
                        </h3>
                        <div className="mx-auto max-w-xs">
                            <label htmlFor="parking_size" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                <Expand className="h-4 w-4 text-muted-foreground" />
                                {t('wizard.specificationsStep.fields.parkingSpaceSize')}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="parking_size"
                                    value={getSizeDisplayValue('size')}
                                    onChange={(e) => handleSizeInputChange(e, 'size', getSizeDisplaySetter('size'))}
                                    onKeyDown={handleSizeKeyDown}
                                    onBlur={() => handleSizeBlur('size', getSizeDisplaySetter('size'))}
                                    className={inputClassName()}
                                    placeholder="0.00"
                                    min={0}
                                    step="0.01"
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
