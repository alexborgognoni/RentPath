import { NumberStepper } from '@/components/property-wizard/components/NumberStepper';
import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Bath, Bed, Calendar, Car, Expand, Layers, TreePine } from 'lucide-react';

interface SpecificationsStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
}

export function SpecificationsStep({ data, updateData }: SpecificationsStepProps) {
    const propertyType = data.type;

    // Determine which fields to show based on property type
    const showBedrooms = ['apartment', 'house', 'room'].includes(propertyType);
    const showBathrooms = ['apartment', 'house', 'room', 'commercial'].includes(propertyType);
    const showParking = ['apartment', 'house', 'commercial', 'industrial'].includes(propertyType);
    const showSize = propertyType !== 'parking';
    const showBalcony = ['apartment', 'house'].includes(propertyType);
    const showLandSize = propertyType === 'house';
    const showFloor = ['apartment', 'room', 'commercial'].includes(propertyType);
    const showElevator = ['apartment', 'commercial'].includes(propertyType);
    const showYearBuilt = ['apartment', 'house', 'commercial', 'industrial'].includes(propertyType);

    const inputClassName = cn(
        'w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground shadow-sm transition-all',
        'placeholder:text-muted-foreground/60',
        'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
        'border-border hover:border-primary/30',
        '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    );

    return (
        <StepContainer title="Tell us about the space" description="These details help tenants find the perfect match">
            <div className="mx-auto max-w-3xl">
                {/* Primary specs: Bedrooms & Bathrooms */}
                {(showBedrooms || showBathrooms) && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <h3 className="mb-6 text-center text-lg font-medium text-foreground">Rooms</h3>
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

                {/* Size Fields */}
                {showSize && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
                        <h3 className="mb-6 text-center text-lg font-medium text-foreground">Size</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                                        className={inputClassName}
                                        placeholder="0"
                                        min="0"
                                    />
                                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
                                        m²
                                    </span>
                                </div>
                            </div>

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
                                            className={inputClassName}
                                            placeholder="0"
                                            min="0"
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
                                            m²
                                        </span>
                                    </div>
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
                                            className={inputClassName}
                                            placeholder="0"
                                            min="0"
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
                                            m²
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Parking */}
                {showParking && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
                        <h3 className="mb-6 text-center text-lg font-medium text-foreground">Parking</h3>
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

                {/* Building Details */}
                {(showFloor || showYearBuilt || showElevator) && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
                        <h3 className="mb-6 text-center text-lg font-medium text-foreground">Building</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {showFloor && (
                                <div>
                                    <label htmlFor="floor_level" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Layers className="h-4 w-4 text-muted-foreground" />
                                        Floor Level
                                    </label>
                                    <input
                                        type="number"
                                        id="floor_level"
                                        value={data.floor_level ?? ''}
                                        onChange={(e) => updateData('floor_level', parseInt(e.target.value) || undefined)}
                                        className={inputClassName}
                                        placeholder="0"
                                    />
                                </div>
                            )}

                            {showYearBuilt && (
                                <div>
                                    <label htmlFor="year_built" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Year Built
                                    </label>
                                    <input
                                        type="number"
                                        id="year_built"
                                        value={data.year_built || ''}
                                        onChange={(e) => updateData('year_built', parseInt(e.target.value) || undefined)}
                                        className={inputClassName}
                                        placeholder="2020"
                                        min="1800"
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                            )}

                            {showElevator && (
                                <div className="flex items-end">
                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-3 transition-all hover:border-primary/50">
                                        <input
                                            type="checkbox"
                                            checked={data.has_elevator}
                                            onChange={(e) => updateData('has_elevator', e.target.checked)}
                                            className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20"
                                        />
                                        <span className="font-medium text-foreground">Has Elevator</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Parking-specific options */}
                {propertyType === 'parking' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mx-auto max-w-md">
                            <label htmlFor="size" className="mb-2 block text-sm font-medium text-foreground">
                                Parking Space Size (optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="size"
                                    value={data.size || ''}
                                    onChange={(e) => updateData('size', parseFloat(e.target.value) || undefined)}
                                    className={inputClassName}
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
