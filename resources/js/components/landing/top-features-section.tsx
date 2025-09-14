import { ArrowRight, Clock, Zap } from 'lucide-react';

export function TopFeaturesSection() {
    const SECTION_TITLE = 'Built for Modern Rental Applications';
    const SECTION_DESCRIPTION = 'Transform your tenant placements with real-time insights, document management, and automated landlord updates.';

    const FEATURES = [
        {
            icon: Zap,
            title: 'Complete Applications',
            description: 'No more chasing IDs, contracts, or references — invite tenants and collect applications in one place.',
        },
        {
            icon: ArrowRight,
            title: 'Streamlined Leasing',
            description: 'Seamlessly guide applicants to move-in — cutting time-to-fill and reducing vacancies.',
        },
        {
            icon: Clock,
            title: 'Occupancy Overview',
            description: 'See which units are vacant, occupied, or have leads — and never lose sight of your portfolio.',
        },
    ];

    return (
        <section className="relative overflow-hidden bg-background py-24">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ROI Callout */}
                <div className="relative mx-auto mb-20 max-w-7xl rounded-3xl border border-border bg-card/50 p-12 text-center shadow-2xl backdrop-blur-xl">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                    <div className="relative z-10">
                        <h3 className="mb-6 text-4xl leading-tight font-bold text-foreground lg:text-5xl">{SECTION_TITLE}</h3>
                        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground">{SECTION_DESCRIPTION}</p>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {FEATURES.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20"
                                    >
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                        <div className="relative z-10">
                                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110">
                                                {feature.title}
                                            </div>
                                            <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
