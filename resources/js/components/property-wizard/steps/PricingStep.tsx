import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Zap } from 'lucide-react';

interface PricingStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
}

const currencies = [
    { value: 'eur', label: 'EUR', symbol: '€' },
    { value: 'chf', label: 'CHF', symbol: 'CHF' },
    { value: 'usd', label: 'USD', symbol: '$' },
    { value: 'gbp', label: 'GBP', symbol: '£' },
] as const;

export function PricingStep({ data, updateData, errors }: PricingStepProps) {
    const selectedCurrency = currencies.find((c) => c.value === data.rent_currency) || currencies[0];

    const formatRentDisplay = (amount: number): string => {
        if (!amount) return '0';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <StepContainer title="Set your pricing" description="How much will you charge for rent?">
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
                            className={cn(
                                'w-full rounded-2xl border-2 bg-background py-6 pr-6 text-center text-5xl font-bold text-foreground',
                                'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
                                '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                                errors.rent_amount ? 'border-destructive' : 'border-border',
                            )}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            style={{ paddingLeft: selectedCurrency.symbol.length > 1 ? '5rem' : '4rem' }}
                        />

                        {/* Per month label */}
                        <div className="absolute top-1/2 right-6 -translate-y-1/2">
                            <span className="text-lg text-muted-foreground">/month</span>
                        </div>
                    </div>

                    {errors.rent_amount && <p className="mt-3 text-center text-sm text-destructive">{errors.rent_amount}</p>}

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

                {/* Price preview */}
                {data.rent_amount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-10 rounded-2xl border border-border bg-muted/30 p-6"
                    >
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <DollarSign className="h-5 w-5" />
                            <span>Your listing will show:</span>
                        </div>
                        <p className="mt-2 text-center text-2xl font-bold text-foreground">
                            {selectedCurrency.symbol}
                            {formatRentDisplay(data.rent_amount)} <span className="text-lg font-normal text-muted-foreground">per month</span>
                        </p>
                    </motion.div>
                )}

                {/* Availability date */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                        <Calendar className="h-5 w-5 text-primary" />
                        When is it available?
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
                            Available Immediately
                        </button>

                        {/* Or separator */}
                        <div className="mb-4 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-sm text-muted-foreground">or choose a date</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        {/* Date picker */}
                        <input
                            type="date"
                            value={data.available_date || ''}
                            onChange={(e) => updateData('available_date', e.target.value || undefined)}
                            min={new Date().toISOString().split('T')[0]}
                            className={cn(
                                'w-full rounded-xl border-2 bg-background px-4 py-3 text-center text-foreground',
                                'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
                                data.available_date ? 'border-primary' : 'border-border',
                            )}
                        />
                    </div>
                </motion.div>
            </div>
        </StepContainer>
    );
}
