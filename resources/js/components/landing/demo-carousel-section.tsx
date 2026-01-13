import type { SharedData } from '@/types';
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
            title: translate(translations.public.landing, `demoCarousel.slides.realTimeDashboard.title` as const),
            description: translate(translations.public.landing, `demoCarousel.slides.realTimeDashboard.description` as const),
            features: [
                translate(translations.public.landing, `demoCarousel.slides.realTimeDashboard.features[0]` as const),
                translate(translations.public.landing, `demoCarousel.slides.realTimeDashboard.features[1]` as const),
                translate(translations.public.landing, `demoCarousel.slides.realTimeDashboard.features[2]` as const),
                translate(translations.public.landing, `demoCarousel.slides.realTimeDashboard.features[3]` as const),
            ],
            imagePathLight: '/images/demo_features/light/demo_feature_1.png',
            imagePathDark: '/images/demo_features/dark/demo_feature_1.png',
        },
        {
            id: 2,
            title: translate(translations.public.landing, `demoCarousel.slides.guidedApplications.title` as const),
            description: translate(translations.public.landing, `demoCarousel.slides.guidedApplications.description` as const),
            features: [
                translate(translations.public.landing, `demoCarousel.slides.guidedApplications.features[0]` as const),
                translate(translations.public.landing, `demoCarousel.slides.guidedApplications.features[1]` as const),
                translate(translations.public.landing, `demoCarousel.slides.guidedApplications.features[2]` as const),
                translate(translations.public.landing, `demoCarousel.slides.guidedApplications.features[3]` as const),
            ],
            imagePathLight: '/images/demo_features/light/demo_feature_2.png',
            imagePathDark: '/images/demo_features/dark/demo_feature_2.png',
        },
        {
            id: 3,
            title: translate(translations.public.landing, `demoCarousel.slides.automatedReview.title` as const),
            description: translate(translations.public.landing, `demoCarousel.slides.automatedReview.description` as const),
            features: [
                translate(translations.public.landing, `demoCarousel.slides.automatedReview.features[0]` as const),
                translate(translations.public.landing, `demoCarousel.slides.automatedReview.features[1]` as const),
                translate(translations.public.landing, `demoCarousel.slides.automatedReview.features[2]` as const),
                translate(translations.public.landing, `demoCarousel.slides.automatedReview.features[3]` as const),
            ],
            imagePathLight: '/images/demo_features/light/demo_feature_3.png',
            imagePathDark: '/images/demo_features/dark/demo_feature_3.png',
        },
        {
            id: 4,
            title: translate(translations.public.landing, `demoCarousel.slides.progressVisibility.title` as const),
            description: translate(translations.public.landing, `demoCarousel.slides.progressVisibility.description` as const),
            features: [
                translate(translations.public.landing, `demoCarousel.slides.progressVisibility.features[0]` as const),
                translate(translations.public.landing, `demoCarousel.slides.progressVisibility.features[1]` as const),
                translate(translations.public.landing, `demoCarousel.slides.progressVisibility.features[2]` as const),
                translate(translations.public.landing, `demoCarousel.slides.progressVisibility.features[3]` as const),
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
                    setIsManuallyControlled(true);
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

        // Don't auto-slide when in fullscreen mode or dragging
        if (fullscreenImage || isDragging) return;

        const delay = isManuallyControlled ? 15000 : 5000;
        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => prev + 1);
            setIsManuallyControlled(false);
        }, delay);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isManuallyControlled, fullscreenImage, isDragging]);

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
            <div className="absolute inset-0 hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 md:block"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-0 text-center xs:mb-20">
                    <h2 className="mb-6 text-4xl font-bold text-foreground lg:text-6xl">
                        {translate(translations.public.landing, 'demoCarousel.heading')}
                    </h2>
                    <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-muted-foreground">
                        {translate(translations.public.landing, 'demoCarousel.subtitle')}
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative -mx-4 mb-0 xs:mb-20 md:mx-0">
                    <div className="relative overflow-hidden md:rounded-3xl md:border md:border-border md:bg-gradient-to-br md:from-card/80 md:to-surface/50 md:shadow-2xl">
                        <div
                            ref={carouselRef}
                            className="relative min-h-[650px] touch-pan-y overflow-hidden bg-surface select-none sm:min-h-[600px] lg:h-[700px] lg:bg-transparent"
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
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                }}
                            >
                                {/* Render slides 3 times for infinite loop effect */}
                                {[...SLIDES, ...SLIDES, ...SLIDES].map((slide, idx) => (
                                    <div key={`${slide.id}-${idx}`} className="row-span-3 grid grid-rows-subgrid">
                                        <div className="relative row-span-3 grid grid-rows-subgrid">
                                            {/* Mobile Layout */}
                                            <div className="relative z-10 mx-auto contents max-w-5xl text-center lg:hidden">
                                                {/* Top Section - Demo Screenshot */}
                                                <div
                                                    ref={idx === NUM_SLIDES ? imageRowRef : null}
                                                    className="flex items-end justify-center bg-background pb-6"
                                                    id="demo-card"
                                                >
                                                    <div className="group relative w-full">
                                                        <div className="relative mx-auto flex w-full items-end justify-center overflow-hidden bg-background">
                                                            {slide.imagePathLight || slide.imagePathDark ? (
                                                                <>
                                                                    {slide.imagePathLight && (
                                                                        <img
                                                                            src={slide.imagePathLight}
                                                                            alt={slide.title}
                                                                            className="w-full bg-background object-contain object-bottom transition-all duration-300 group-hover:brightness-75 dark:hidden"
                                                                        />
                                                                    )}
                                                                    {slide.imagePathDark && (
                                                                        <img
                                                                            src={slide.imagePathDark}
                                                                            alt={slide.title}
                                                                            className="hidden w-full bg-background object-contain object-bottom transition-all duration-300 group-hover:brightness-75 dark:block"
                                                                        />
                                                                    )}
                                                                    {/* Mobile: Always visible maximize icon */}
                                                                    <div
                                                                        className="absolute right-4 bottom-4 flex md:hidden"
                                                                        onClick={() => {
                                                                            if (slide.imagePathLight || slide.imagePathDark) {
                                                                                const isDark = document.documentElement.classList.contains('dark');
                                                                                const imagePath = isDark ? slide.imagePathDark : slide.imagePathLight;
                                                                                if (imagePath) setFullscreenImage(imagePath);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-gradient-to-r from-background/80 to-background/80 shadow-inner backdrop-blur-md">
                                                                            <Maximize2 className="h-5 w-5 text-foreground/80" />
                                                                        </div>
                                                                    </div>
                                                                    {/* Desktop: Hover to show maximize icon */}
                                                                    <div className="absolute inset-0 hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
                                                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                                                                            <Maximize2 className="h-8 w-8 text-white" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 sm:rounded-2xl sm:from-primary/20 sm:via-secondary/20 sm:to-accent/20"></div>
                                                                    <div className="relative">
                                                                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary sm:mb-3 sm:h-14 sm:w-14 md:h-16 md:w-16">
                                                                            <Eye className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                                                                        </div>
                                                                        <span className="text-sm font-medium text-primary sm:text-base md:text-lg">
                                                                            {translate(translations.public.landing, 'demoCarousel.interactiveDemo')}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Middle Section - Title and Description */}
                                                <div className="border-r border-border/30 px-8 pt-8 sm:px-11 sm:pt-10 md:px-15 md:pt-12">
                                                    <h3 className="mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-2xl leading-tight font-bold text-transparent sm:mb-4 sm:text-3xl md:mb-6 md:text-4xl">
                                                        {slide.title}
                                                    </h3>
                                                    <p className="mx-auto max-w-3xl px-1 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                                                        {slide.description}
                                                    </p>
                                                </div>

                                                {/* Bottom Section - Feature Boxes */}
                                                <div className="border-r border-border/30 px-8 py-6 sm:px-11 sm:py-6 md:px-15 md:py-6">
                                                    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-2 md:gap-4">
                                                        {slide.features.map((feature, i) => (
                                                            <div
                                                                key={i}
                                                                className="group flex items-center space-x-3 rounded-xl border border-primary/20 bg-gradient-to-r from-surface/50 to-card/50 p-3.5 sm:space-x-3.5 sm:p-3.5 md:space-x-4 md:p-4 md:transition-all md:duration-300 md:hover:border-primary/40 md:hover:shadow-lg md:hover:shadow-primary/10"
                                                            >
                                                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary sm:h-6 sm:w-6 md:h-7 md:w-7 md:transition-transform md:duration-300 md:group-hover:scale-110">
                                                                    <Check className="h-3.5 w-3.5 text-white sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                                                                </div>
                                                                <span className="text-left text-[15px] leading-relaxed font-medium text-foreground sm:text-[15px] md:text-base">
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop Layout - Two Columns */}
                                            <div className="relative z-10 mx-auto hidden h-full w-full flex-col lg:flex">
                                                {/* Title and Description Above */}
                                                <div className="mt-8 mb-8 px-12 text-center">
                                                    <h3 className="mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-4xl leading-tight font-bold text-transparent lg:text-5xl">
                                                        {slide.title}
                                                    </h3>
                                                    <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                                                        {slide.description}
                                                    </p>
                                                </div>

                                                {/* Two Column Layout */}
                                                <div className="flex flex-1 items-center gap-4 px-6">
                                                    {/* Left - Demo Screenshot (66%) */}
                                                    <div
                                                        className="group relative flex aspect-video w-[66%] flex-shrink-0 cursor-pointer items-center justify-center"
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
                                                                        className="h-full w-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 object-contain shadow-2xl shadow-primary/20 transition-all duration-500 group-hover:brightness-75 dark:hidden"
                                                                    />
                                                                )}
                                                                {slide.imagePathDark && (
                                                                    <img
                                                                        src={slide.imagePathDark}
                                                                        alt={slide.title}
                                                                        className="hidden h-full w-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 object-contain shadow-2xl shadow-primary/20 transition-all duration-500 group-hover:brightness-75 dark:block"
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
                                                                        {translate(translations.public.landing, 'demoCarousel.interactiveDemo')}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Right - Feature Boxes (33%) */}
                                                    <div className="flex w-[33%] flex-shrink-0 flex-col justify-center pr-6">
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {slide.features.map((feature, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="group flex items-start space-x-4 rounded-xl border border-primary/20 bg-gradient-to-r from-surface/50 to-card/50 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                                                                >
                                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                                                        <Check className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <span className="text-left text-base leading-relaxed font-medium text-foreground">
                                                                        {feature}
                                                                    </span>
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
                                className="group absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-gradient-to-r from-background/80 to-background/80 shadow-inner backdrop-blur-md lg:hidden"
                                style={{
                                    top: 'calc(var(--image-row-height, 50%) / 2)',
                                }}
                            >
                                <ChevronLeft className="h-5 w-5 text-foreground/80" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="group absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-gradient-to-r from-background/80 to-background/80 shadow-inner backdrop-blur-md lg:hidden"
                                style={{
                                    top: 'calc(var(--image-row-height, 50%) / 2)',
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
                                className="group mr-6 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:from-primary/20 hover:to-secondary/20 lg:flex"
                            >
                                <ChevronLeft className="h-5 w-5 text-foreground/80 transition-colors duration-300 group-hover:text-primary" />
                            </button>

                            <div className="flex space-x-3">
                                {SLIDES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`cursor-pointer transition-all duration-300 ${
                                            index === activeSlide % NUM_SLIDES
                                                ? 'h-3 w-8 rounded-full bg-gradient-to-r from-primary to-secondary shadow-sm'
                                                : 'h-3 w-3 rounded-full bg-muted-foreground/20 hover:scale-125 hover:bg-muted-foreground/40'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Desktop Chevrons */}
                            <button
                                onClick={nextSlide}
                                className="group ml-6 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-inner backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:from-primary/20 hover:to-secondary/20 lg:flex"
                            >
                                <ChevronRight className="h-5 w-5 text-foreground/80 transition-colors duration-300 group-hover:text-primary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {fullscreenImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                    <button
                        onClick={() => {
                            setFullscreenImage(null);
                            setIsManuallyControlled(true);
                        }}
                        className="absolute top-4 right-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80"
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
