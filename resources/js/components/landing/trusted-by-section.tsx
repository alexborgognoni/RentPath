export function TrustedBySection() {
    const COMPANIES = ['PropertyCorp', 'RealEstate Plus', 'Hometech', 'PropManage', 'UrbanLiving', 'CityRents', 'MetroHomes'];
    const TRUSTED_BY_TEXT = 'Trusted by property agents across Europe.';

    return (
        <section className="overflow-hidden border-b border-border bg-background py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="mb-8 text-sm text-muted-foreground">{TRUSTED_BY_TEXT}</p>

                    {/* Infinite scroll container */}
                    <div className="relative overflow-hidden">
                        {/* Fade overlays at content edges */}
                        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent"></div>
                        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent"></div>

                        <div className="animate-scroll flex space-x-8">
                            {/* First set of companies */}
                            {COMPANIES.map((company, index) => (
                                <div
                                    key={`first-${index}`}
                                    className="flex-shrink-0 rounded-md border border-border bg-surface px-6 py-3 text-lg font-bold whitespace-nowrap text-muted-foreground opacity-50"
                                >
                                    {company}
                                </div>
                            ))}
                            {/* Duplicate set for seamless loop */}
                            {COMPANIES.map((company, index) => (
                                <div
                                    key={`second-${index}`}
                                    className="flex-shrink-0 rounded-md border border-border bg-surface px-6 py-3 text-lg font-bold whitespace-nowrap text-muted-foreground opacity-50"
                                >
                                    {company}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
