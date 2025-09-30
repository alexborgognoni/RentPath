import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function DemoCarouselSection() {
    const { translations } = usePage<SharedData>().props;

    const SLIDES = [
        {
            id: 1,
            title: translate(translations, `landing.demo_carousel.slides.real_time_dashboard.title` as const),
            description: translate(translations, `landing.demo_carousel.slides.real_time_dashboard.description` as const),
            features: [
                translate(translations, `landing.demo_carousel.slides.real_time_dashboard.features[0]` as const),
                translate(translations, `landing.demo_carousel.slides.real_time_dashboard.features[1]` as const),
                translate(translations, `landing.demo_carousel.slides.real_time_dashboard.features[2]` as const),
                translate(translations, `landing.demo_carousel.slides.real_time_dashboard.features[3]` as const),
            ],
        },
        {
            id: 2,
            title: translate(translations, `landing.demo_carousel.slides.guided_applications.title` as const),
            description: translate(translations, `landing.demo_carousel.slides.guided_applications.description` as const),
            features: [
                translate(translations, `landing.demo_carousel.slides.guided_applications.features[0]` as const),
                translate(translations, `landing.demo_carousel.slides.guided_applications.features[1]` as const),
                translate(translations, `landing.demo_carousel.slides.guided_applications.features[2]` as const),
                translate(translations, `landing.demo_carousel.slides.guided_applications.features[3]` as const),
            ],
        },
        {
            id: 3,
            title: translate(translations, `landing.demo_carousel.slides.automated_review.title` as const),
            description: translate(translations, `landing.demo_carousel.slides.automated_review.description` as const),
            features: [
                translate(translations, `landing.demo_carousel.slides.automated_review.features[0]` as const),
                translate(translations, `landing.demo_carousel.slides.automated_review.features[1]` as const),
                translate(translations, `landing.demo_carousel.slides.automated_review.features[2]` as const),
                translate(translations, `landing.demo_carousel.slides.automated_review.features[3]` as const),
            ],
        },
        {
            id: 4,
            title: translate(translations, `landing.demo_carousel.slides.progress_visibility.title` as const),
            description: translate(translations, `landing.demo_carousel.slides.progress_visibility.description` as const),
            features: [
                translate(translations, `landing.demo_carousel.slides.progress_visibility.features[0]` as const),
                translate(translations, `landing.demo_carousel.slides.progress_visibility.features[1]` as const),
                translate(translations, `landing.demo_carousel.slides.progress_visibility.features[2]` as const),
                translate(translations, `landing.demo_carousel.slides.progress_visibility.features[3]` as const),
            ],
        },
        {
            id: 5,
            title: translate(translations, `landing.demo_carousel.slides.smart_followup.title` as const),
            description: translate(translations, `landing.demo_carousel.slides.smart_followup.description` as const),
            features: [
                translate(translations, `landing.demo_carousel.slides.smart_followup.features[0]` as const),
                translate(translations, `landing.demo_carousel.slides.smart_followup.features[1]` as const),
                translate(translations, `landing.demo_carousel.slides.smart_followup.features[2]` as const),
                translate(translations, `landing.demo_carousel.slides.smart_followup.features[3]` as const),
            ],
        },
        {
            id: 6,
            title: translate(translations, `landing.demo_carousel.slides.digital_inspections.title` as const),
            description: translate(translations, `landing.demo_carousel.slides.digital_inspections.description` as const),
            features: [
                translate(translations, `landing.demo_carousel.slides.digital_inspections.features[0]` as const),
                translate(translations, `landing.demo_carousel.slides.digital_inspections.features[1]` as const),
                translate(translations, `landing.demo_carousel.slides.digital_inspections.features[2]` as const),
                translate(translations, `landing.demo_carousel.slides.digital_inspections.features[3]` as const),
            ],
        },
        {
            id: 7,
            title: translate(translations, `landing.demo_carousel.slides.landlord_reporting.title` as const),
            description: translate(translations, `landing.demo_carousel.slides.landlord_reporting.description` as const),
            features: [
                translate(translations, `landing.demo_carousel.slides.landlord_reporting.features[0]` as const),
                translate(translations, `landing.demo_carousel.slides.landlord_reporting.features[1]` as const),
                translate(translations, `landing.demo_carousel.slides.landlord_reporting.features[2]` as const),
                translate(translations, `landing.demo_carousel.slides.landlord_reporting.features[3]` as const),
            ],
        },
    ];

    const NUM_SLIDES = 7;

    const [activeSlide, setActiveSlide] = useState(0);
    const [isManuallyControlled, setIsManuallyControlled] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const delay = isManuallyControlled ? 15000 : 5000;
        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % NUM_SLIDES);
            setIsManuallyControlled(false);
        }, delay);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isManuallyControlled]);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % NUM_SLIDES);
        setIsManuallyControlled(true);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + NUM_SLIDES) % NUM_SLIDES);
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
                    <h2 className="mb-6 text-4xl font-bold text-foreground lg:text-6xl">
                        {translate(translations, 'landing.demo_carousel.heading')}
                    </h2>
                    <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-muted-foreground">
                        {translate(translations, 'landing.demo_carousel.subtitle')}
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative mb-20">
                    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/80 to-surface/50 shadow-2xl backdrop-blur-xl">
                        <div className="relative h-[700px] md:h-[700px] sm:h-[600px] overflow-hidden">
                            <div
                                className="flex h-full transition-transform duration-700 ease-out"
                                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                            >
                                {SLIDES.map((slide) => (
                                    <div key={slide.id} className="h-full w-full flex-shrink-0">
                                        <div className="relative flex h-full flex-col p-4 sm:p-8 md:p-12">
                                            <div className="relative z-10 mx-auto max-w-5xl text-center flex flex-col justify-between h-full">
                                                {/* Top Section - Demo Screenshot */}
                                                <div className="flex-shrink-0">
                                                    <div className="group relative mx-auto mb-4 sm:mb-6 md:mb-8">
                                                        <div className="mx-auto flex h-32 w-72 sm:h-40 sm:w-80 md:h-56 md:w-96 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-105">
                                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                                                            <div className="relative">
                                                                <div className="mx-auto mb-2 sm:mb-3 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                                                                    <Eye className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                                                                </div>
                                                                <span className="text-sm sm:text-base md:text-lg font-medium text-primary">
                                                                    {translate(translations, 'landing.demo_carousel.interactive_demo')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Glow Effect */}
                                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-75"></div>
                                                    </div>
                                                </div>

                                                {/* Middle Section - Title and Description (fixed height) */}
                                                <div className="flex-grow flex flex-col justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
                                                    <h3 className="mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-bold text-transparent line-clamp-3">
                                                        {slide.title}
                                                    </h3>
                                                    <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground px-4 line-clamp-4">
                                                        {slide.description}
                                                    </p>
                                                </div>

                                                {/* Bottom Section - Feature Boxes (fixed height) */}
                                                <div className="flex-shrink-0 min-h-[200px] sm:min-h-[220px] md:min-h-[240px] flex items-end">
                                                    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-1.5 sm:gap-2 md:gap-4 md:grid-cols-2">
                                                        {slide.features.map((feature, i) => (
                                                            <div
                                                                key={i}
                                                                className="group flex items-center space-x-2 sm:space-x-3 md:space-x-4 rounded-md sm:rounded-lg md:rounded-xl border border-primary/20 bg-gradient-to-r from-surface/50 to-card/50 p-2 sm:p-3 md:p-4 lg:p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                                                            >
                                                                <div className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-sm sm:rounded-md md:rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                                                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-white" />
                                                                </div>
                                                                <span className="text-left text-xs sm:text-sm md:text-base font-medium text-foreground line-clamp-2">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
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
                                        className={`cursor-pointer transition-all duration-300 ${index === activeSlide
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
