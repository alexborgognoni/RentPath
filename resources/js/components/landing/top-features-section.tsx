import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ArrowRight, Clock, Zap } from 'lucide-react';

export function TopFeaturesSection() {
    const { translations } = usePage<SharedData>().props;

    const HEADING = translate(translations, 'landing.top_features.heading');
    const SUBTITLE = translate(translations, 'landing.top_features.subtitle');

    const FEATURES = [
        {
            icon: Zap,
            title: translate(translations, 'landing.top_features.complete_applications.title'),
            description: translate(translations, 'landing.top_features.complete_applications.description'),
        },
        {
            icon: ArrowRight,
            title: translate(translations, 'landing.top_features.streamlined_leasing.title'),
            description: translate(translations, 'landing.top_features.streamlined_leasing.description'),
        },
        {
            icon: Clock,
            title: translate(translations, 'landing.top_features.occupancy_overview.title'),
            description: translate(translations, 'landing.top_features.occupancy_overview.description'),
        },
    ];

    return (
        <section className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20">
            {/* Background Effects */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

            <div className="relative z-10 mx-auto max-w-7xl xs:px-4 sm:px-6 lg:px-8">
                {/* ROI Callout */}
                <div className="mb-20">
                    {/* Heading and Subtitle */}
                    <div className="text-center px-4 sm:px-0 mb-8 sm:mb-12">
                        <h3 className="mb-4 sm:mb-6 text-3xl sm:text-4xl leading-tight font-bold text-foreground lg:text-5xl">
                            {HEADING}
                        </h3>
                        <p className="mx-auto max-w-3xl text-lg sm:text-xl leading-relaxed text-muted-foreground">
                            {SUBTITLE}
                        </p>
                    </div>

                    {/* Desktop Card Wrapper */}
                    <div className="hidden xs:block relative rounded-3xl border border-border bg-card/50 p-8 md:p-12 shadow-2xl">
                        <div className="hidden md:block absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {FEATURES.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:transition-all md:duration-500 md:hover:scale-105 md:hover:border-primary/40 md:hover:shadow-2xl md:hover:shadow-primary/20"
                                    >
                                        <div className="hidden md:block absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
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
                    <div className="xs:hidden grid grid-cols-1 gap-6 px-4">
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
