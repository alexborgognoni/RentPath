import { translate as t } from '@/utils/translate-utils';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Database, Euro, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BenefitsSection() {
    const HEADER_TITLE = 'Why Agents Choose RentPath';
    const BENEFITS = [
        {
            title: 'Faster Placements, Swifter Commissions',
            description: 'Automated follow-ups help place tenants faster. Know exactly when each property will be rented.',
            icon: Clock,
            gradient: 'bg-gradient-to-r from-primary to-secondary',
        },
        {
            title: 'All Tenant Data, Centralized',
            description: 'All tenant documents and application progress stored securely. No more searching through emails.',
            icon: Database,
            gradient: 'bg-gradient-to-r from-primary to-primary',
        },
        {
            title: 'Automated Landlord Updates',
            description: 'Automated updates and professional reporting strengthen your relationships with property owners.',
            icon: TrendingUp,
            gradient: 'bg-gradient-to-r from-secondary to-primary',
        },
        {
            title: 'Reduced Administrative Overhead',
            description: 'Less time on paperwork means more time for revenue-generating activities and client relationships.',
            icon: Euro,
            gradient: 'bg-gradient-to-r from-secondary to-accent',
        },
        {
            title: 'Higher Conversion Rates',
            description: 'Streamlined processes lead to better tenant experience and higher application completion rates.',
            icon: CheckCircle,
            gradient: 'bg-gradient-to-r from-primary to-secondary',
        },
    ];

    const METRICS = [
        { label: 'Application Completion Rate', value: '+85%', color: 'text-primary' },
        { label: 'Time to Placement', value: '-60%', color: 'text-secondary' },
        { label: 'Landlord Satisfaction', value: '+90%', color: 'text-primary' },
        { label: 'Administrative Time', value: '-75%', color: 'text-secondary' },
    ];

    const TRIAL_BENEFITS = ['Unlimited tenant applications.', 'Automated document collection.', 'Progress tracking & notifications.'];

    const PRICING = { price: '25', currency: 'per agent/month', icon: Euro };

    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 600);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="bg-surface py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* Left - Benefits */}
                    <div>
                        <h2 className="mb-8 text-4xl font-bold text-foreground lg:text-5xl">{HEADER_TITLE}</h2>
                        <div className="space-y-8">
                            {BENEFITS.map((benefit, idx) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={idx} className="flex items-center">
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
                                <h3 className="mb-6 text-2xl font-bold text-foreground">Key Metrics Improvement</h3>
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
                        <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-xl">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                            <div className="relative text-center">
                                <h3 className="mb-4 text-xl font-bold text-foreground">Start Your Free Trial</h3>

                                {/* Benefits */}
                                <div className="mb-4 space-y-3">
                                    {TRIAL_BENEFITS.map((text, idx) => (
                                        <div key={idx} className="flex items-center text-muted-foreground">
                                            <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="font-medium">{text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing */}
                                <div className="mb-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                                    <div className="text-center">
                                        <div className="mb-2 flex items-center justify-center">
                                            <PRICING.icon className="mr-2 h-6 w-6 text-primary" />
                                            <span className="text-3xl font-bold text-foreground">{PRICING.price}</span>
                                            <span className="ml-2 text-muted-foreground">{PRICING.currency}</span>
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
                                            <p className="font-semibold text-green-600">🎉 Get 3 months FREE when you sign up!</p>
                                        </motion.div>
                                    </div>
                                </div>

                                <a
                                    href="/register"
                                    className="block w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-4 text-center text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-primary hover:to-secondary"
                                >
                                    {t('getStarted')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
