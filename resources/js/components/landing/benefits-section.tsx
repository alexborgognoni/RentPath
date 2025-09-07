import { translate as t } from '@/utils/translate-utils';
import { CheckCircle, Shield, Clock, TrendingUp, Euro } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BenefitsSection() {
    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 600); // Shake for 600ms
        }, 5000); // Every 5 seconds

        return () => clearInterval(interval);
    }, []);
    return (
        <section className="bg-surface py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-8 text-4xl font-bold text-foreground lg:text-5xl">
                            Why Agents Choose RentPath
                        </h2>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">
                                        Faster Placements, Swifter Commissions
                                    </h3>
                                    <p className="leading-relaxed text-muted-foreground">
                                        Automated follow-ups mean faster tenant placements. Know exactly when each property will be rented.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-secondary to-accent">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">
                                        Everything in One Place
                                    </h3>
                                    <p className="leading-relaxed text-muted-foreground">
                                        All tenant documents and application progress stored securely. No more searching through emails.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">
                                        Professional Landlord Relations
                                    </h3>
                                    <p className="leading-relaxed text-muted-foreground">
                                        Automated updates and professional reporting strengthen your relationships with property owners.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-secondary to-secondary">
                                    <Euro className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">
                                        Reduced Administrative Overhead
                                    </h3>
                                    <p className="leading-relaxed text-muted-foreground">
                                        Less time on paperwork means more time for revenue-generating activities and client relationships.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">
                                        Higher Conversion Rates
                                    </h3>
                                    <p className="leading-relaxed text-muted-foreground">
                                        Streamlined processes lead to better tenant experience and higher application completion rates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right side - Metrics and Trial Box */}
                    <div className="relative">
                        <div className="relative rounded-2xl border border-border bg-card p-8 shadow-xl mb-8">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                            <div className="relative">
                                <h3 className="mb-6 text-2xl font-bold text-foreground">
                                    Key Metrics Improvement
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Application Completion Rate</span>
                                        <span className="text-2xl font-bold text-primary">+85%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Time to Placement</span>
                                        <span className="text-2xl font-bold text-secondary">-60%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Administrative Time</span>
                                        <span className="text-2xl font-bold text-primary">-75%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Landlord Satisfaction</span>
                                        <span className="text-2xl font-bold text-secondary">+90%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Free Trial Box */}
                        <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-xl">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                            <div className="relative text-center">
                                <h3 className="mb-4 text-xl font-bold text-foreground">
                                    Start Your Free Trial
                                </h3>
                                
                                <div className="mb-4 space-y-3">
                                    <div className="flex items-center text-muted-foreground">
                                        <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="font-medium">
                                            Unlimited tenant applications.
                                        </span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="font-medium">
                                            Automated document collection.
                                        </span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="font-medium">
                                            Progress tracking & notifications.
                                        </span>
                                    </div>
                                </div>

                                {/* Pricing Section */}
                                <div className="mb-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                                    <div className="text-center">
                                        <div className="mb-2 flex items-center justify-center">
                                            <Euro className="mr-2 h-6 w-6 text-primary" />
                                            <span className="text-3xl font-bold text-foreground">25</span>
                                            <span className="ml-2 text-muted-foreground">per agent/month</span>
                                        </div>
                                        <motion.div
                                            animate={shouldShake ? { 
                                                y: [0, -4, 4, -4, 4, -2, 2, 0],
                                                rotate: [0, -2, 2, -2, 2, -1, 1, 0]
                                            } : { y: 0, rotate: 0 }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                            style={{ transformOrigin: "center center" }}
                                            className="rounded-lg border border-green-500/20 bg-green-500/10 p-3"
                                        >
                                            <p className="font-semibold text-green-600">
                                                🎉 Get 3 months FREE when you sign up!
                                            </p>
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