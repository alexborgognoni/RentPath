import { translate as t } from '@/utils/translate-utils';

export function TrustedBySection() {
    const companies = [
        'PropertyCorp',
        'RealEstate Plus',
        'Hometech',
        'PropManage',
        'UrbanLiving',
        'CityRents',
        'MetroHomes'
    ];

    return (
        <section className="border-b border-border bg-background py-16 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="mb-8 text-sm text-muted-foreground">
                        Trusted by property agents across Europe.
                    </p>
                    
                    {/* Infinite scroll container */}
                    <div className="relative overflow-hidden">
                        {/* Fade overlays at content edges */}
                        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
                        
                        <div className="flex animate-scroll space-x-8">
                            {/* First set of companies */}
                            {companies.map((company, index) => (
                                <div 
                                    key={`first-${index}`}
                                    className="flex-shrink-0 rounded-md border border-border bg-surface px-6 py-3 text-lg font-bold text-muted-foreground whitespace-nowrap opacity-50"
                                >
                                    {company}
                                </div>
                            ))}
                            {/* Duplicate set for seamless loop */}
                            {companies.map((company, index) => (
                                <div 
                                    key={`second-${index}`}
                                    className="flex-shrink-0 rounded-md border border-border bg-surface px-6 py-3 text-lg font-bold text-muted-foreground whitespace-nowrap opacity-50"
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