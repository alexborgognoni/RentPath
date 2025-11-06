import type { SharedData } from '@/types';
import { convertAndRoundUpPrice, getCurrencyFromStorage } from '@/utils/currency-utils';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Banknote, CheckCircle, Clock, Database, DollarSign, Euro, PoundSterling, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BenefitsSection() {
    const { translations } = usePage<SharedData>().props;

    const HEADING = translate(translations, 'landing.benefits.heading');

    const FASTER_PLACEMENTS_TITLE = translate(translations, 'landing.benefits.benefits.faster_placements.title');
    const FASTER_PLACEMENTS_DESCRIPTION = translate(translations, 'landing.benefits.benefits.faster_placements.description');
    const CENTRALIZED_DATA_TITLE = translate(translations, 'landing.benefits.benefits.centralized_data.title');
    const CENTRALIZED_DATA_DESCRIPTION = translate(translations, 'landing.benefits.benefits.centralized_data.description');
    const AUTOMATED_UPDATES_TITLE = translate(translations, 'landing.benefits.benefits.automated_updates.title');
    const AUTOMATED_UPDATES_DESCRIPTION = translate(translations, 'landing.benefits.benefits.automated_updates.description');
    const REDUCED_OVERHEAD_TITLE = translate(translations, 'landing.benefits.benefits.reduced_overhead.title');
    const REDUCED_OVERHEAD_DESCRIPTION = translate(translations, 'landing.benefits.benefits.reduced_overhead.description');
    const HIGHER_CONVERSION_TITLE = translate(translations, 'landing.benefits.benefits.higher_conversion.title');
    const HIGHER_CONVERSION_DESCRIPTION = translate(translations, 'landing.benefits.benefits.higher_conversion.description');

    const BENEFITS = [
        {
            title: FASTER_PLACEMENTS_TITLE,
            description: FASTER_PLACEMENTS_DESCRIPTION,
            icon: Clock,
            gradient: 'bg-gradient-to-r from-primary to-secondary',
        },
        {
            title: CENTRALIZED_DATA_TITLE,
            description: CENTRALIZED_DATA_DESCRIPTION,
            icon: Database,
            gradient: 'bg-gradient-to-r from-primary to-primary',
        },
        {
            title: AUTOMATED_UPDATES_TITLE,
            description: AUTOMATED_UPDATES_DESCRIPTION,
            icon: TrendingUp,
            gradient: 'bg-gradient-to-r from-secondary to-primary',
        },
        {
            title: REDUCED_OVERHEAD_TITLE,
            description: REDUCED_OVERHEAD_DESCRIPTION,
            icon: Euro,
            gradient: 'bg-gradient-to-r from-secondary to-accent',
        },
        {
            title: HIGHER_CONVERSION_TITLE,
            description: HIGHER_CONVERSION_DESCRIPTION,
            icon: CheckCircle,
            gradient: 'bg-gradient-to-r from-primary to-secondary',
        },
    ];

    const COMPLETION_RATE_LABEL = translate(translations, 'landing.benefits.metrics.completion_rate_label');
    const TIME_TO_PLACEMENT_LABEL = translate(translations, 'landing.benefits.metrics.time_to_placement_label');
    const LANDLORD_SATISFACTION_LABEL = translate(translations, 'landing.benefits.metrics.landlord_satisfaction_label');
    const ADMIN_TIME_LABEL = translate(translations, 'landing.benefits.metrics.admin_time_label');

    const METRICS = [
        { label: COMPLETION_RATE_LABEL, value: '+85%', color: 'text-primary' },
        { label: TIME_TO_PLACEMENT_LABEL, value: '-60%', color: 'text-secondary' },
        { label: LANDLORD_SATISFACTION_LABEL, value: '+90%', color: 'text-primary' },
        { label: ADMIN_TIME_LABEL, value: '-75%', color: 'text-secondary' },
    ];

    const TRIAL_HEADING = translate(translations, 'landing.benefits.trial.heading');
    const PRICING_UNIT = translate(translations, 'landing.benefits.trial.pricing.unit');
    const PRICING_OFFER = translate(translations, 'landing.benefits.trial.pricing.offer');
    const GET_STARTED_BUTTON = translate(translations, 'landing.benefits.trial.get_started_button');

    const TRIAL_BENEFITS = [
        translate(translations, 'landing.benefits.trial.benefits.0'),
        translate(translations, 'landing.benefits.trial.benefits.1'),
        translate(translations, 'landing.benefits.trial.benefits.2'),
    ];

    // Dynamic pricing based on selected currency
    const [currentCurrency, setCurrentCurrency] = useState(getCurrencyFromStorage());
    const [displayPrice, setDisplayPrice] = useState('25');

    const BASE_PRICE_EUR = 50; // Base price in EUR

    useEffect(() => {
        const updatePrice = () => {
            const currency = getCurrencyFromStorage();
            setCurrentCurrency(currency);

            const convertedPrice = convertAndRoundUpPrice(BASE_PRICE_EUR, 'EUR', currency);
            setDisplayPrice(convertedPrice.toString());
        };

        // Update price on currency change
        const handleCurrencyChange = () => updatePrice();
        window.addEventListener('currencyChange', handleCurrencyChange);

        // Initial price update
        updatePrice();

        return () => window.removeEventListener('currencyChange', handleCurrencyChange);
    }, []);

    // Get appropriate currency icon
    const getCurrencyIcon = () => {
        switch (currentCurrency) {
            case 'USD':
                return DollarSign;
            case 'GBP':
                return PoundSterling;
            case 'CHF':
                return Banknote; // Use Banknote icon for CHF
            case 'EUR':
            default:
                return Euro;
        }
    };

    const PRICING = {
        price: displayPrice,
        currency: PRICING_UNIT, // Always show "per agent/month"
        icon: getCurrencyIcon(),
    };

    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 600);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="bg-surface pt-0 pb-12 xs:pt-0 xs:pb-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* Left - Benefits */}
                    <div>
                        <h2 className="mb-8 text-4xl font-bold text-foreground lg:text-5xl">{HEADING}</h2>
                        <div className="space-y-8">
                            {BENEFITS.map((benefit, idx) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={idx} className="flex items-start">
                                        <div
                                            className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${benefit.gradient}`}
                                        >
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-bold text-foreground">{benefit.title}</h3>
                                            <p className="leading-relaxed text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right - Metrics & Trial Box */}
                    <div className="relative">
                        {/* Metrics */}
                        <div className="relative mb-8 rounded-2xl border border-border bg-card p-8 shadow-xl">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                            <div className="relative">
                                <h3 className="mb-6 text-2xl font-bold text-foreground">
                                    {translate(translations, 'landing.benefits.metrics.heading')}
                                </h3>
                                <div className="space-y-6">
                                    {METRICS.map((metric, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-muted-foreground">{metric.label}</span>
                                            <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Free Trial Box */}
                        <div className="text-center sm:relative sm:rounded-2xl sm:border sm:border-primary/20 sm:bg-gradient-to-br sm:from-primary/10 sm:to-secondary/10 sm:p-8 sm:shadow-xl">
                            <div className="absolute inset-0 hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 sm:block"></div>
                            <div className="sm:relative">
                                <h3 className="mb-4 text-xl font-bold text-foreground">{TRIAL_HEADING}</h3>

                                {/* Benefits */}
                                <div className="mb-4 space-y-3">
                                    {TRIAL_BENEFITS.map((text, idx) => (
                                        <div key={idx} className="flex items-center text-left text-muted-foreground">
                                            <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="font-medium">{text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing */}
                                <div className="mb-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                                    <div className="text-center">
                                        <div className="mb-2 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-foreground">{PRICING.price}</span>
                                            {currentCurrency === 'CHF' ? (
                                                <span className="mr-2 ml-1 text-2xl font-bold text-primary">CHF</span>
                                            ) : (
                                                <PRICING.icon className="h-8 w-8 pb-1 text-primary" />
                                            )}
                                            <span className="text-base text-muted-foreground">{PRICING.currency}</span>
                                        </div>
                                        <motion.div
                                            animate={
                                                shouldShake
                                                    ? {
                                                          y: [0, -4, 4, -4, 4, -2, 2, 0],
                                                          rotate: [0, -2, 2, -2, 2, -1, 1, 0],
                                                      }
                                                    : { y: 0, rotate: 0 }
                                            }
                                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                                            style={{ transformOrigin: 'center center' }}
                                            className="rounded-lg border border-green-500/20 bg-green-500/10 p-3"
                                        >
                                            <p className="font-semibold text-green-600">{PRICING_OFFER}</p>
                                        </motion.div>
                                    </div>
                                </div>

                                <a
                                    href="/register"
                                    className="block w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-4 text-center text-lg font-bold text-white shadow-lg md:transition-all md:hover:scale-105 md:hover:from-primary md:hover:to-secondary"
                                >
                                    {GET_STARTED_BUTTON}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
