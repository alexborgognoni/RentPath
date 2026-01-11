import { StepContainer } from '@/components/property-wizard/components/step-container';
import type { PropertyWizardData } from '@/hooks/use-property-wizard';
import { cn } from '@/lib/utils';
import { PROPERTY_CONSTRAINTS } from '@/lib/validation/property-validation';
import type { SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, DoorOpen, Pause, Zap } from 'lucide-react';

interface PricingStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    onBlur?: (field: keyof PropertyWizardData, value: unknown) => void;
}

const currencies = [
    { value: 'eur', label: 'EUR', symbol: '€' },
    { value: 'chf', label: 'CHF', symbol: 'CHF' },
    { value: 'usd', label: 'USD', symbol: '$' },
    { value: 'gbp', label: 'GBP', symbol: '£' },
] as const;

export function PricingStep({ data, updateData, errors, onBlur }: PricingStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const selectedCurrency = currencies.find((c) => c.value === data.rent_currency) || currencies[0];

    const handleBlur = (field: keyof PropertyWizardData) => {
        if (onBlur) {
            onBlur(field, data[field]);
        }
    };

    return (
        <StepContainer title={t('wizard.pricingStep.title')} description={t('wizard.pricingStep.description')}>
            <div className="mx-auto max-w-2xl">
                {/* Main rent input - Hero style */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <div className="relative mx-auto max-w-md">
                        {/* Large currency symbol */}
                        <div className="absolute top-1/2 left-6 -translate-y-1/2">
                            <span className="text-4xl font-light text-muted-foreground">{selectedCurrency.symbol}</span>
                        </div>

                        {/* Main input */}
                        <input
                            type="number"
                            value={data.rent_amount || ''}
                            onChange={(e) => updateData('rent_amount', parseFloat(e.target.value) || 0)}
                            onBlur={() => handleBlur('rent_amount')}
                            className={cn(
                                'w-full rounded-2xl border-2 bg-background py-6 pr-6 text-center text-5xl font-bold text-foreground',
                                'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
                                '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                                errors.rent_amount ? 'border-destructive' : 'border-border',
                            )}
                            placeholder="0"
                            min={PROPERTY_CONSTRAINTS.rent_amount.min}
                            max={PROPERTY_CONSTRAINTS.rent_amount.max}
                            step="0.01"
                            style={{ paddingLeft: selectedCurrency.symbol.length > 1 ? '5rem' : '4rem' }}
                            aria-invalid={!!errors.rent_amount}
                            aria-describedby={errors.rent_amount ? 'rent_amount-error' : undefined}
                        />

                        {/* Per month label */}
                        <div className="absolute top-1/2 right-6 -translate-y-1/2">
                            <span className="text-lg text-muted-foreground">{t('wizard.pricingStep.perMonth')}</span>
                        </div>
                    </div>

                    {errors.rent_amount && (
                        <p id="rent_amount-error" className="mt-3 text-center text-sm text-destructive">
                            {errors.rent_amount}
                        </p>
                    )}

                    {/* Currency selector */}
                    <div className="mt-6 flex justify-center gap-2">
                        {currencies.map((currency) => (
                            <button
                                key={currency.value}
                                type="button"
                                onClick={() => updateData('rent_currency', currency.value as Property['rent_currency'])}
                                className={cn(
                                    'rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all',
                                    data.rent_currency === currency.value
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-card text-foreground hover:border-primary/50',
                                )}
                            >
                                {currency.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Availability date */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                        <Calendar className="h-5 w-5 text-primary" />
                        {t('wizard.pricingStep.whenAvailable')}
                    </h3>

                    <div className="mx-auto max-w-sm">
                        {/* Available immediately toggle */}
                        <button
                            type="button"
                            onClick={() => {
                                if (data.available_date) {
                                    updateData('available_date', undefined);
                                } else {
                                    // Set to today
                                    updateData('available_date', new Date().toISOString().split('T')[0]);
                                }
                            }}
                            className={cn(
                                'mb-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 font-medium transition-all',
                                !data.available_date
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card text-foreground hover:border-primary/50',
                            )}
                        >
                            <Zap className="h-4 w-4" />
                            {t('wizard.pricingStep.availableImmediately')}
                        </button>

                        {/* Or separator */}
                        <div className="mb-4 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-sm text-muted-foreground">{t('wizard.pricingStep.orChooseDate')}</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        {/* Date picker */}
                        <input
                            type="date"
                            value={data.available_date || ''}
                            onChange={(e) => updateData('available_date', e.target.value || undefined)}
                            onBlur={() => handleBlur('available_date')}
                            min={new Date().toISOString().split('T')[0]}
                            className={cn(
                                'w-full rounded-xl border-2 bg-background px-4 py-3 text-center text-foreground',
                                'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
                                errors.available_date ? 'border-destructive' : data.available_date ? 'border-primary' : 'border-border',
                            )}
                            aria-invalid={!!errors.available_date}
                            aria-describedby={errors.available_date ? 'available_date-error' : undefined}
                        />
                        {errors.available_date && (
                            <p id="available_date-error" className="mt-2 text-center text-sm text-destructive">
                                {errors.available_date}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Application status */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12">
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                        <DoorOpen className="h-5 w-5 text-primary" />
                        {t('wizard.pricingStep.acceptApplications')}
                    </h3>

                    <div className="mx-auto flex max-w-md gap-3">
                        <button
                            type="button"
                            onClick={() => updateData('is_active', true)}
                            className={cn(
                                'flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                                data.is_active
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border bg-card text-foreground hover:border-primary/50',
                            )}
                        >
                            <DoorOpen className="h-6 w-6" />
                            <span className="font-medium">{t('wizard.pricingStep.openForApplications')}</span>
                            <span className="text-xs text-muted-foreground">{t('wizard.pricingStep.startReceiving')}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => updateData('is_active', false)}
                            className={cn(
                                'flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                                !data.is_active
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border bg-card text-foreground hover:border-primary/50',
                            )}
                        >
                            <Pause className="h-6 w-6" />
                            <span className="font-medium">{t('wizard.pricingStep.notYet')}</span>
                            <span className="text-xs text-muted-foreground">{t('wizard.pricingStep.openLater')}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </StepContainer>
    );
}
