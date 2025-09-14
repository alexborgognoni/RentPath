import { Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function DemoCarouselSection() {
    const SECTION_TITLE = 'Streamlined from First Interest to Move-In';
    const SECTION_DESCRIPTION =
        'Manual reviews, missed applications, messy communication - rentals are inefficient. Our platform streamlines the tenant journey.';

    const SLIDES = [
        {
            id: 1,
            title: 'Real-time Dashboard',
            description: 'Visibility across all your properties, tracking applications, inspections, leases, and marketing efforts — instantly.',
            features: ['Live application pipeline', 'Lease & marketing calendar', 'User-friendly inspection tools', 'Swift landlord reporting'],
        },
        {
            id: 2,
            title: 'Guided Tenant Applications',
            description:
                'Invite leads to a step-by-step application flow that ensures all necessary documents are collected. Complete applications, every time.',
            features: [
                'Application invite links',
                'Progress validation at each step',
                'Required documents checklists',
                'Professional application experience',
            ],
        },
        {
            id: 3,
            title: 'Automated Application Review',
            description: 'Validate tenant information and documents instantly. No more digging through emails or paper.',
            features: [
                'Missing information alerts',
                'Authenticity and identity validation',
                'Instant document verification',
                'Complete contract management',
            ],
        },
        {
            id: 4,
            title: 'Full Progress Visibility',
            description: 'Monitor each applicant and lease stage in one view to spot bottlenecks and accelerate leasing.',
            features: ['Real-time application status', 'Progress indicators per applicant', 'Property lease tracking', 'Bottleneck identification'],
        },
        {
            id: 5,
            title: 'Smart Follow-up System',
            description: 'Automated reminders and follow-ups keep applicants moving, reducing vacant days.',
            features: [
                'Automated reminder emails',
                'Application recovery for stalled submissions',
                'Follow-up scheduling',
                'Conversion optimization',
            ],
        },
        {
            id: 6,
            title: 'Digital Property Inspections',
            description: 'Capture move-in/move-out conditions digitally, with photos, notes, and full history for transparency and efficiency.',
            features: ['Photo-documented inspections', 'Complete inspection history', 'Digital report generation', 'Move-in & move-out tracking'],
        },
        {
            id: 7,
            title: 'Professional Landlord Reporting',
            description: 'Keep landlords informed with automated updates, tenant validation, and professional reports.',
            features: ['Automated report generation', 'Automated tenant validation', 'Professional progress updates', 'Live client communication'],
        },
    ];

    const [activeSlide, setActiveSlide] = useState(0);
    const [isManuallyControlled, setIsManuallyControlled] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const delay = isManuallyControlled ? 15000 : 5000;
        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % SLIDES.length);
            setIsManuallyControlled(false);
        }, delay);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isManuallyControlled]);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % SLIDES.length);
        setIsManuallyControlled(true);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
        setIsManuallyControlled(true);
    };

    const goToSlide = (index: number) => {
        setActiveSlide(index);
        setIsManuallyControlled(true);
    };

    return (
        <section id="problems" className="relative overflow-hidden bg-background py-24">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-20 text-center">
                    <h2 className="mb-6 text-4xl font-bold text-foreground lg:text-6xl">{SECTION_TITLE}</h2>
                    <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-muted-foreground">{SECTION_DESCRIPTION}</p>
                </div>

                {/* Carousel */}
                <div className="relative mb-20">
                    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/80 to-surface/50 shadow-2xl backdrop-blur-xl">
                        <div className="relative h-[700px] overflow-hidden">
                            <div
                                className="flex h-full transition-transform duration-700 ease-out"
                                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                            >
                                {SLIDES.map((slide) => (
                                    <div key={slide.id} className="h-full w-full flex-shrink-0">
                                        <div className="relative flex h-full flex-col justify-center p-12">
                                            <div className="relative z-10 mx-auto max-w-5xl text-center">
                                                {/* Enhanced Screenshot Placeholder */}
                                                <div className="group relative mx-auto mb-12">
                                                    <div className="mx-auto flex h-56 w-96 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-105">
                                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                                                        <div className="relative">
                                                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                                                                <Eye className="h-8 w-8 text-white" />
                                                            </div>
                                                            <span className="text-lg font-medium text-primary">Interactive Demo</span>
                                                        </div>
                                                    </div>
                                                    {/* Glow Effect */}
                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-75"></div>
                                                </div>

                                                <h3 className="mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-4xl leading-tight font-bold text-transparent lg:text-5xl">
                                                    {slide.title}
                                                </h3>
                                                <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                                                    {slide.description}
                                                </p>
                                                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
                                                    {slide.features.map((feature, i) => (
                                                        <div
                                                            key={i}
                                                            className="group flex items-center space-x-4 rounded-xl border border-primary/20 bg-gradient-to-r from-surface/50 to-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                                                <Check className="h-4 w-4 text-white" />
                                                            </div>
                                                            <span className="text-left font-medium text-foreground">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-center">
                        <div className="relative flex items-center space-x-6 rounded-full border border-border/30 bg-gradient-to-r from-primary/5 via-primary/4 via-secondary/4 to-secondary/5 px-6 py-3 shadow-lg backdrop-blur-xl">
                            <button
                                onClick={prevSlide}
                                className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:from-primary/20 hover:to-secondary/20"
                            >
                                <ChevronLeft className="h-5 w-5 text-foreground/80 transition-colors duration-300 group-hover:text-primary" />
                            </button>

                            <div className="flex space-x-3">
                                {SLIDES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`cursor-pointer transition-all duration-300 ${
                                            index === activeSlide
                                                ? 'h-3 w-8 rounded-full bg-gradient-to-r from-primary to-secondary shadow-sm'
                                                : 'h-3 w-3 rounded-full bg-muted/40 backdrop-blur-sm hover:scale-125 hover:bg-muted/60'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:from-primary/20 hover:to-secondary/20"
                            >
                                <ChevronRight className="h-5 w-5 text-foreground/80 transition-colors duration-300 group-hover:text-primary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
