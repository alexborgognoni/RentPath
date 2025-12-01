import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface LocationStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
}

const countries = [
    { value: 'CH', label: 'Switzerland' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'AT', label: 'Austria' },
    { value: 'IT', label: 'Italy' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'BE', label: 'Belgium' },
    { value: 'ES', label: 'Spain' },
];

export function LocationStep({ data, updateData, errors }: LocationStepProps) {
    const inputClassName = (fieldName: keyof PropertyWizardData) =>
        cn(
            'w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground shadow-sm transition-all',
            'placeholder:text-muted-foreground/60',
            'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
            errors[fieldName] ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary/30',
        );

    return (
        <StepContainer title="Where is your property located?" description="Enter the address where tenants will live">
            <div className="mx-auto max-w-2xl">
                {/* Location icon decoration */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                >
                    <MapPin className="h-8 w-8 text-primary" />
                </motion.div>

                <div className="space-y-6">
                    {/* Street Address Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-3 gap-4"
                    >
                        <div>
                            <label htmlFor="house_number" className="mb-2 block text-sm font-medium text-foreground">
                                Number <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="house_number"
                                value={data.house_number}
                                onChange={(e) => updateData('house_number', e.target.value)}
                                className={inputClassName('house_number')}
                                placeholder="123"
                            />
                            {errors.house_number && <p className="mt-1.5 text-sm text-destructive">{errors.house_number}</p>}
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="street_name" className="mb-2 block text-sm font-medium text-foreground">
                                Street Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="street_name"
                                value={data.street_name}
                                onChange={(e) => updateData('street_name', e.target.value)}
                                className={inputClassName('street_name')}
                                placeholder="Main Street"
                            />
                            {errors.street_name && <p className="mt-1.5 text-sm text-destructive">{errors.street_name}</p>}
                        </div>
                    </motion.div>

                    {/* Address Line 2 */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <label htmlFor="street_line2" className="mb-2 block text-sm font-medium text-foreground">
                            Apartment, Suite, Unit <span className="text-xs text-muted-foreground">(optional)</span>
                        </label>
                        <input
                            type="text"
                            id="street_line2"
                            value={data.street_line2 || ''}
                            onChange={(e) => updateData('street_line2', e.target.value)}
                            className={inputClassName('street_line2')}
                            placeholder="Apt 4B, Floor 2, etc."
                        />
                    </motion.div>

                    {/* City and Postal Code Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <label htmlFor="city" className="mb-2 block text-sm font-medium text-foreground">
                                City <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={data.city}
                                onChange={(e) => updateData('city', e.target.value)}
                                className={inputClassName('city')}
                                placeholder="Zurich"
                            />
                            {errors.city && <p className="mt-1.5 text-sm text-destructive">{errors.city}</p>}
                        </div>

                        <div>
                            <label htmlFor="postal_code" className="mb-2 block text-sm font-medium text-foreground">
                                Postal Code <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="postal_code"
                                value={data.postal_code}
                                onChange={(e) => updateData('postal_code', e.target.value)}
                                className={inputClassName('postal_code')}
                                placeholder="8001"
                            />
                            {errors.postal_code && <p className="mt-1.5 text-sm text-destructive">{errors.postal_code}</p>}
                        </div>
                    </motion.div>

                    {/* State and Country Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <label htmlFor="state" className="mb-2 block text-sm font-medium text-foreground">
                                State/Region <span className="text-xs text-muted-foreground">(optional)</span>
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={data.state || ''}
                                onChange={(e) => updateData('state', e.target.value)}
                                className={inputClassName('state')}
                                placeholder="Canton, State, etc."
                            />
                        </div>

                        <div>
                            <label htmlFor="country" className="mb-2 block text-sm font-medium text-foreground">
                                Country <span className="text-destructive">*</span>
                            </label>
                            <select
                                id="country"
                                value={data.country}
                                onChange={(e) => updateData('country', e.target.value)}
                                className={inputClassName('country')}
                            >
                                {countries.map((country) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </select>
                            {errors.country && <p className="mt-1.5 text-sm text-destructive">{errors.country}</p>}
                        </div>
                    </motion.div>

                    {/* Privacy note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center text-sm text-muted-foreground"
                    >
                        Your exact address will only be shared with approved applicants
                    </motion.p>
                </div>
            </div>
        </StepContainer>
    );
}
