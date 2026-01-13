import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ArrowRight, Clock, Zap } from 'lucide-react';

export function TopFeaturesSection() {
    const { translations } = usePage<SharedData>().props;

    const HEADING = translate(translations, 'landing.topFeatures.heading');
    const SUBTITLE = translate(translations, 'landing.topFeatures.subtitle');

    const FEATURES = [
        {
            icon: Zap,
            title: translate(translations, 'landing.topFeatures.completeApplications.title'),
            description: translate(translations, 'landing.topFeatures.completeApplications.description'),
        },
        {
            icon: ArrowRight,
            title: translate(translations, 'landing.topFeatures.streamlinedLeasing.title'),
            description: translate(translations, 'landing.topFeatures.streamlinedLeasing.description'),
        },
        {
            icon: Clock,
            title: translate(translations, 'landing.topFeatures.occupancyOverview.title'),
            description: translate(translations, 'landing.topFeatures.occupancyOverview.description'),
        },
    ];

    return (
        <section className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20">
            {/* Background Effects */}
            <div className="absolute inset-0 hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 md:block"></div>

            <div className="relative z-10 mx-auto max-w-7xl xs:px-4 sm:px-6 lg:px-8">
                {/* ROI Callout */}
                <div className="mb-0 xs:mb-20">
                    {/* Heading and Subtitle */}
                    <div className="mb-8 px-4 text-center sm:mb-12 sm:px-0">
                        <h3 className="mb-4 text-3xl leading-tight font-bold text-foreground sm:mb-6 sm:text-4xl lg:text-5xl">{HEADING}</h3>
                        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{SUBTITLE}</p>
                    </div>

                    {/* Desktop Card Wrapper */}
                    <div className="relative hidden rounded-3xl border border-border bg-card/50 p-8 shadow-2xl xs:block md:p-12">
                        <div className="absolute inset-0 hidden rounded-3xl bg-gradient-to-r from-primary/5 to-secondary/5 md:block"></div>
                        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {FEATURES.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:transition-all md:duration-500 md:hover:scale-105 md:hover:border-primary/40 md:hover:shadow-2xl md:hover:shadow-primary/20"
                                    >
                                        <div className="absolute inset-0 hidden rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"></div>
                                        <div className="relative z-10">
                                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary md:transition-transform md:duration-300 md:group-hover:scale-110">
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-3xl font-bold text-transparent md:transition-transform md:duration-300 md:group-hover:scale-110">
                                                {feature.title}
                                            </div>
                                            <p className="text-base leading-relaxed text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Feature Cards - Full Width */}
                    <div className="grid grid-cols-1 gap-6 px-4 xs:hidden">
                        {FEATURES.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-6"
                                >
                                    <div className="relative z-10">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <div className="mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-2xl font-bold text-transparent">
                                            {feature.title}
                                        </div>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
