import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Check, ChevronLeft, ChevronRight, Eye, Maximize2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function DemoCarouselSection() {
    const { translations } = usePage<SharedData>().props;
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const imageRowRef = useRef<HTMLDivElement | null>(null);

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
            imagePathLight: '/images/demo_features/light/demo_feature_1.png',
            imagePathDark: '/images/demo_features/dark/demo_feature_1.png',
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
            imagePathLight: '/images/demo_features/light/demo_feature_2.png',
            imagePathDark: '/images/demo_features/dark/demo_feature_2.png',
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
            imagePathLight: '/images/demo_features/light/demo_feature_3.png',
            imagePathDark: '/images/demo_features/dark/demo_feature_3.png',
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
            imagePathLight: '/images/demo_features/light/demo_feature_4.png',
            imagePathDark: '/images/demo_features/dark/demo_feature_4.png',
        },
    ];

    const NUM_SLIDES = 4;

    const [activeSlide, setActiveSlide] = useState(NUM_SLIDES); // Start from middle set
    const [isManuallyControlled, setIsManuallyControlled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Handle fullscreen modal
    useEffect(() => {
        if (fullscreenImage) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Handle Esc key
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setFullscreenImage(null);
                }
            };

            document.addEventListener('keydown', handleEscape);

            return () => {
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [fullscreenImage]);

    // Set image row height as CSS variable
    useEffect(() => {
        const updateImageRowHeight = () => {
            if (imageRowRef.current && carouselRef.current) {
                const imageRow = imageRowRef.current;
                const rowHeight = imageRow.offsetHeight;
                carouselRef.current.style.setProperty('--image-row-height', `${rowHeight}px`);
            }
        };

        updateImageRowHeight();
        window.addEventListener('resize', updateImageRowHeight);

        return () => {
            window.removeEventListener('resize', updateImageRowHeight);
        };
    }, [activeSlide]);

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Don't auto-slide when in fullscreen mode
        if (fullscreenImage) return;

        const delay = isManuallyControlled ? 15000 : 5000;
        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => prev + 1);
            setIsManuallyControlled(false);
        }, delay);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isManuallyControlled, fullscreenImage]);

    // Reset position without animation when reaching edges
    useEffect(() => {
        if (!isTransitioning) return;

        const handleTransitionEnd = () => {
            if (activeSlide >= NUM_SLIDES * 2) {
                setIsTransitioning(false);
                setActiveSlide(NUM_SLIDES);
            } else if (activeSlide < NUM_SLIDES) {
                setIsTransitioning(false);
                setActiveSlide(NUM_SLIDES + (activeSlide % NUM_SLIDES));
            }
        };

        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('transitionend', handleTransitionEnd);
            return () => carousel.removeEventListener('transitionend', handleTransitionEnd);
        }
    }, [activeSlide, isTransitioning]);

    useEffect(() => {
        if (!isTransitioning) {
            // Re-enable transitions after a frame
            requestAnimationFrame(() => {
                setIsTransitioning(true);
            });
        }
    }, [isTransitioning]);

    const nextSlide = () => {
        setActiveSlide((prev) => prev + 1);
        setIsManuallyControlled(true);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => prev - 1);
        setIsManuallyControlled(true);
    };

    const goToSlide = (index: number) => {
        setActiveSlide(NUM_SLIDES + index);
        setIsManuallyControlled(true);
    };

    // Touch/Mouse handlers for swipe
    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setDragStartX(clientX);
        setDragOffset(0);
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;
        const diff = clientX - dragStartX;
        setDragOffset(diff);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 50; // Minimum swipe distance
        if (Math.abs(dragOffset) > threshold) {
            if (dragOffset > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        setDragOffset(0);
    };

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        handleDragStart(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        handleDragMove(e.clientX);
    };

    const handleMouseUp = () => {
        handleDragEnd();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleDragEnd();
        }
    };

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleDragMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    return (
        <section id="problems" className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20">
            <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

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
                <div className="relative mb-12 md:mb-20 -mx-4 sm:mx-0">
                    <div className="relative overflow-hidden md:rounded-3xl md:border md:border-border md:bg-gradient-to-br md:from-card/80 md:to-surface/50 md:shadow-2xl">
                        <div
                            ref={carouselRef}
                            className="relative min-h-[650px] sm:min-h-[600px] md:h-[700px] overflow-hidden touch-pan-y select-none bg-surface md:bg-transparent"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div
                                className="grid h-full grid-flow-col"
                                style={{
                                    gridTemplateColumns: `repeat(${SLIDES.length * 3}, 100%)`,
                                    gridTemplateRows: 'min-content auto min-content',
                                    transform: `translateX(calc(-${activeSlide * 100}% + ${dragOffset}px))`,
                                    transition: isDragging || !isTransitioning ? 'none' : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                                    cursor: isDragging ? 'grabbing' : 'grab'
                                }}
                            >
                                {/* Render slides 3 times for infinite loop effect */}
                                {[...SLIDES, ...SLIDES, ...SLIDES].map((slide, idx) => (
                                    <div key={`${slide.id}-${idx}`} className="grid grid-rows-subgrid row-span-3">
                                        <div className="relative grid grid-rows-subgrid row-span-3">
                                            {/* Mobile Layout */}
                                            <div className="relative z-10 mx-auto max-w-5xl text-center contents lg:hidden">
                                                {/* Top Section - Demo Screenshot */}
                                                <div ref={idx === NUM_SLIDES ? imageRowRef : null} className="flex items-end justify-center bg-background pb-6" id="demo-card">
                                                    <div className="group relative w-full">
                                                        <div
                                                            className="mx-auto flex w-full items-end justify-center overflow-hidden relative cursor-pointer bg-background"
                                                            onClick={() => {
                                                                if (slide.imagePathLight || slide.imagePathDark) {
                                                                    const isDark = document.documentElement.classList.contains('dark');
                                                                    const imagePath = isDark ? slide.imagePathDark : slide.imagePathLight;
                                                                    if (imagePath) setFullscreenImage(imagePath);
                                                                }
                                                            }}
                                                        >
                                                            {slide.imagePathLight || slide.imagePathDark ? (
                                                                <>
                                                                    {slide.imagePathLight && (
                                                                        <img
                                                                            src={slide.imagePathLight}
                                                                            alt={slide.title}
                                                                            className="w-full object-contain object-bottom dark:hidden transition-all duration-300 group-hover:brightness-75 bg-background"
                                                                        />
                                                                    )}
                                                                    {slide.imagePathDark && (
                                                                        <img
                                                                            src={slide.imagePathDark}
                                                                            alt={slide.title}
                                                                            className="hidden w-full object-contain object-bottom dark:block transition-all duration-300 group-hover:brightness-75 bg-background"
                                                                        />
                                                                    )}
                                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                                                                            <Maximize2 className="h-8 w-8 text-white" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="absolute inset-0 sm:rounded-2xl bg-gradient-to-br sm:from-primary/20 sm:via-secondary/20 sm:to-accent/20 from-primary/10 via-secondary/10 to-accent/10"></div>
                                                                    <div className="relative">
                                                                        <div className="mx-auto mb-2 sm:mb-3 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                                                                            <Eye className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                                                                        </div>
                                                                        <span className="text-sm sm:text-base md:text-lg font-medium text-primary">
                                                                            {translate(translations, 'landing.demo_carousel.interactive_demo')}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Middle Section - Title and Description */}
                                                <div className="px-8 pt-8 sm:px-11 sm:pt-10 md:px-15 md:pt-12 border-r border-border/30">
                                                    <h3 className="mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-2xl sm:text-3xl md:text-4xl leading-tight font-bold text-transparent">
                                                        {slide.title}
                                                    </h3>
                                                    <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground px-1">
                                                        {slide.description}
                                                    </p>
                                                </div>

                                                {/* Bottom Section - Feature Boxes */}
                                                <div className="px-8 py-6 sm:px-11 sm:py-6 md:px-15 md:py-6 border-r border-border/30">
                                                    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:gap-2 md:gap-4 md:grid-cols-2">
                                                        {slide.features.map((feature, i) => (
                                                            <div
                                                                key={i}
                                                                className="group flex items-start space-x-3 sm:space-x-3 md:space-x-4 rounded-xl sm:rounded-lg md:rounded-xl border border-primary/20 bg-gradient-to-r from-surface/50 to-card/50 p-3.5 sm:p-3 md:p-4 md:transition-all md:duration-300 md:hover:border-primary/40 md:hover:shadow-lg md:hover:shadow-primary/10"
                                                            >
                                                                <div className="flex h-6 w-6 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-md md:rounded-lg bg-gradient-to-br from-primary to-secondary md:transition-transform md:duration-300 md:group-hover:scale-110">
                                                                    <Check className="h-3.5 w-3.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-white" />
                                                                </div>
                                                                <span className="text-left text-[15px] sm:text-sm md:text-base font-medium text-foreground leading-relaxed">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop Layout - Two Columns */}
                                            <div className="relative z-10 mx-auto w-full h-full hidden lg:flex flex-col">
                                                {/* Title and Description Above */}
                                                <div className="mt-8 mb-8 text-center px-12">
                                                    <h3 className="mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-4xl lg:text-5xl leading-tight font-bold text-transparent">
                                                        {slide.title}
                                                    </h3>
                                                    <p className="mx-auto max-w-4xl text-lg lg:text-xl leading-relaxed text-muted-foreground">
                                                        {slide.description}
                                                    </p>
                                                </div>

                                                {/* Two Column Layout */}
                                                <div className="flex-1 flex gap-4 items-center px-6">
                                                    {/* Left - Demo Screenshot (66%) */}
                                                    <div
                                                        className="group relative flex-shrink-0 w-[66%] aspect-video flex items-center justify-center cursor-pointer"
                                                        onClick={() => {
                                                            if (slide.imagePathLight || slide.imagePathDark) {
                                                                const isDark = document.documentElement.classList.contains('dark');
                                                                const imagePath = isDark ? slide.imagePathDark : slide.imagePathLight;
                                                                if (imagePath) setFullscreenImage(imagePath);
                                                            }
                                                        }}
                                                    >
                                                        {slide.imagePathLight || slide.imagePathDark ? (
                                                            <>
                                                                {slide.imagePathLight && (
                                                                    <img
                                                                        src={slide.imagePathLight}
                                                                        alt={slide.title}
                                                                        className="h-full w-auto object-contain dark:hidden transition-all duration-500 group-hover:brightness-75 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl shadow-primary/20"
                                                                    />
                                                                )}
                                                                {slide.imagePathDark && (
                                                                    <img
                                                                        src={slide.imagePathDark}
                                                                        alt={slide.title}
                                                                        className="hidden h-full w-auto object-contain dark:block transition-all duration-500 group-hover:brightness-75 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl shadow-primary/20"
                                                                    />
                                                                )}
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                                                                        <Maximize2 className="h-8 w-8 text-white" />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>
                                                                <div className="relative">
                                                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                                                                        <Eye className="h-8 w-8 text-white" />
                                                                    </div>
                                                                    <span className="text-lg font-medium text-primary">
                                                                        {translate(translations, 'landing.demo_carousel.interactive_demo')}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Right - Feature Boxes (33%) */}
                                                    <div className="flex-shrink-0 w-[33%] flex flex-col justify-center pr-6">
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {slide.features.map((feature, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="group flex items-start space-x-4 rounded-xl border border-primary/20 bg-gradient-to-r from-surface/50 to-card/50 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                                                                >
                                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                                                        <Check className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <span className="text-left text-base font-medium text-foreground leading-relaxed">{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Chevron Buttons - At center of image row */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 md:hidden group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner"
                                style={{
                                    top: 'calc(var(--image-row-height, 50%) / 2)'
                                }}
                            >
                                <ChevronLeft className="h-5 w-5 text-foreground/80" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 md:hidden group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner"
                                style={{
                                    top: 'calc(var(--image-row-height, 50%) / 2)'
                                }}
                            >
                                <ChevronRight className="h-5 w-5 text-foreground/80" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Dots - Below content for all sizes */}
                    <div className="mt-8 flex justify-center">
                        <div className="relative flex items-center rounded-full border border-border/30 bg-gradient-to-r from-primary/5 via-primary/4 via-secondary/4 to-secondary/5 px-6 py-3 shadow-lg">
                            {/* Desktop Chevrons */}
                            <button
                                onClick={prevSlide}
                                className="hidden md:flex group h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner transition-all duration-300 hover:scale-110 hover:from-primary/20 hover:to-secondary/20 mr-6"
                            >
                                <ChevronLeft className="h-5 w-5 text-foreground/80 transition-colors duration-300 group-hover:text-primary" />
                            </button>

                            <div className="flex space-x-3">
                                {SLIDES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`cursor-pointer transition-all duration-300 ${index === (activeSlide % NUM_SLIDES)
                                                ? 'h-3 w-8 rounded-full bg-gradient-to-r from-primary to-secondary shadow-sm'
                                                : 'h-3 w-3 rounded-full bg-muted-foreground/20 hover:scale-125 hover:bg-muted-foreground/40'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Desktop Chevrons */}
                            <button
                                onClick={nextSlide}
                                className="hidden md:flex group h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner transition-all duration-300 hover:scale-110 hover:from-primary/20 hover:to-secondary/20 ml-6"
                            >
                                <ChevronRight className="h-5 w-5 text-foreground/80 transition-colors duration-300 group-hover:text-primary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {fullscreenImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    onClick={() => setFullscreenImage(null)}
                >
                    <button
                        onClick={() => setFullscreenImage(null)}
                        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 cursor-pointer"
                    >
                        <X className="h-6 w-6 text-white" />
                    </button>
                    <img
                        src={fullscreenImage}
                        alt="Full screen view"
                        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
