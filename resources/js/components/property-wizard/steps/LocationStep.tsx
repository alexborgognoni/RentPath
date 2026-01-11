import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { PROPERTY_CONSTRAINTS } from '@/lib/validation/property-validation';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface LocationStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    onBlur?: (field: keyof PropertyWizardData, value: unknown) => void;
}

const COUNTRY_CODES = ['CH', 'DE', 'FR', 'AT', 'IT', 'US', 'GB', 'NL', 'BE', 'ES'] as const;

function useCountries() {
    const { translations } = usePage<SharedData>().props;
    const t = useCallback((key: string) => translate(translations, key), [translations]);

    return useMemo(
        () =>
            COUNTRY_CODES.map((code) => ({
                value: code,
                label: t(`wizard.locationStep.countries.${code}`),
            })),
        [t],
    );
}

export function LocationStep({ data, updateData, errors, onBlur }: LocationStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const countries = useCountries();

    const inputClassName = (fieldName: keyof PropertyWizardData) =>
        cn(
            'w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground shadow-sm transition-all',
            'placeholder:text-muted-foreground/60',
            'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
            errors[fieldName] ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary/30',
        );

    const handleBlur = (field: keyof PropertyWizardData) => {
        if (onBlur) {
            onBlur(field, data[field]);
        }
    };

    return (
        <StepContainer title={t('wizard.locationStep.title')} description={t('wizard.locationStep.description')}>
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
                                {t('wizard.locationStep.number')} <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="house_number"
                                value={data.house_number}
                                onChange={(e) => updateData('house_number', e.target.value)}
                                onBlur={() => handleBlur('house_number')}
                                maxLength={PROPERTY_CONSTRAINTS.house_number.maxLength}
                                className={inputClassName('house_number')}
                                placeholder={t('wizard.locationStep.placeholders.number')}
                                aria-invalid={!!errors.house_number}
                                aria-describedby={errors.house_number ? 'house_number-error' : undefined}
                            />
                            {errors.house_number && (
                                <p id="house_number-error" className="mt-1.5 text-sm text-destructive">
                                    {errors.house_number}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="street_name" className="mb-2 block text-sm font-medium text-foreground">
                                {t('wizard.locationStep.streetName')} <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="street_name"
                                value={data.street_name}
                                onChange={(e) => updateData('street_name', e.target.value)}
                                onBlur={() => handleBlur('street_name')}
                                maxLength={PROPERTY_CONSTRAINTS.street_name.maxLength}
                                className={inputClassName('street_name')}
                                placeholder={t('wizard.locationStep.placeholders.streetName')}
                                aria-invalid={!!errors.street_name}
                                aria-describedby={errors.street_name ? 'street_name-error' : undefined}
                            />
                            {errors.street_name && (
                                <p id="street_name-error" className="mt-1.5 text-sm text-destructive">
                                    {errors.street_name}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Address Line 2 */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <label htmlFor="street_line2" className="mb-2 block text-sm font-medium text-foreground">
                            {t('wizard.locationStep.apartmentSuite')}{' '}
                            <span className="text-xs text-muted-foreground">({t('wizard.locationStep.optional')})</span>
                        </label>
                        <input
                            type="text"
                            id="street_line2"
                            value={data.street_line2 || ''}
                            onChange={(e) => updateData('street_line2', e.target.value)}
                            onBlur={() => handleBlur('street_line2')}
                            maxLength={PROPERTY_CONSTRAINTS.street_line2.maxLength}
                            className={inputClassName('street_line2')}
                            placeholder={t('wizard.locationStep.placeholders.apartmentSuite')}
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
                                {t('wizard.locationStep.city')} <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={data.city}
                                onChange={(e) => updateData('city', e.target.value)}
                                onBlur={() => handleBlur('city')}
                                maxLength={PROPERTY_CONSTRAINTS.city.maxLength}
                                className={inputClassName('city')}
                                placeholder={t('wizard.locationStep.placeholders.city')}
                                aria-invalid={!!errors.city}
                                aria-describedby={errors.city ? 'city-error' : undefined}
                            />
                            {errors.city && (
                                <p id="city-error" className="mt-1.5 text-sm text-destructive">
                                    {errors.city}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="postal_code" className="mb-2 block text-sm font-medium text-foreground">
                                {t('wizard.locationStep.postalCode')} <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="postal_code"
                                value={data.postal_code}
                                onChange={(e) => updateData('postal_code', e.target.value)}
                                onBlur={() => handleBlur('postal_code')}
                                maxLength={PROPERTY_CONSTRAINTS.postal_code.maxLength}
                                className={inputClassName('postal_code')}
                                placeholder={t('wizard.locationStep.placeholders.postalCode')}
                                aria-invalid={!!errors.postal_code}
                                aria-describedby={errors.postal_code ? 'postal_code-error' : undefined}
                            />
                            {errors.postal_code && (
                                <p id="postal_code-error" className="mt-1.5 text-sm text-destructive">
                                    {errors.postal_code}
                                </p>
                            )}
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
                                {t('wizard.locationStep.stateRegion')}{' '}
                                <span className="text-xs text-muted-foreground">({t('wizard.locationStep.optional')})</span>
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={data.state || ''}
                                onChange={(e) => updateData('state', e.target.value)}
                                onBlur={() => handleBlur('state')}
                                maxLength={PROPERTY_CONSTRAINTS.state.maxLength}
                                className={inputClassName('state')}
                                placeholder={t('wizard.locationStep.placeholders.stateRegion')}
                            />
                        </div>

                        <div>
                            <label htmlFor="country" className="mb-2 block text-sm font-medium text-foreground">
                                {t('wizard.locationStep.country')} <span className="text-destructive">*</span>
                            </label>
                            <select
                                id="country"
                                value={data.country}
                                onChange={(e) => updateData('country', e.target.value)}
                                onBlur={() => handleBlur('country')}
                                className={inputClassName('country')}
                                aria-invalid={!!errors.country}
                                aria-describedby={errors.country ? 'country-error' : undefined}
                            >
                                {countries.map((country) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </select>
                            {errors.country && (
                                <p id="country-error" className="mt-1.5 text-sm text-destructive">
                                    {errors.country}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Privacy note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center text-sm text-muted-foreground"
                    >
                        {t('wizard.locationStep.privacyNote')}
                    </motion.p>
                </div>
            </div>
        </StepContainer>
    );
}
