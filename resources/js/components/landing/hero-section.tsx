import { useIsMobile } from '@/hooks/use-mobile';
import type { SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export function HeroSection() {
    const page = usePage<SharedData>();
    const { translations } = page.props;
    const isMobile = useIsMobile();

    const Heading = isMobile ? 'h1' : motion.h1;
    const Subtitle = isMobile ? 'p' : motion.p;
    const CTAWrapper = isMobile ? 'div' : motion.div;
    const HighlightedText = isMobile ? 'span' : motion.span;

    return (
        <section className="relative overflow-hidden border-b bg-background py-8 xs:py-12 md:py-16 lg:py-20">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Mobile/Small screens - Single column */}
                <div className="lg:hidden">
                    {/* Heading */}
                    <Heading
                        {...(!isMobile && {
                            initial: { opacity: 0, y: 20 },
                            whileInView: { opacity: 1, y: 0 },
                            transition: { duration: 0.8 },
                            viewport: { once: true, amount: 0.6 },
                        })}
                        className="text-text-primary dark:text-text-primary mb-6 text-center text-4xl leading-tight font-bold xs:mb-8 xs:text-5xl"
                    >
                        {translate(translations, 'landing.hero.headingPrimary')}
                        <br />
                        <HighlightedText
                            {...(!isMobile && {
                                initial: { backgroundPosition: '200% 0' },
                                whileInView: { backgroundPosition: '0% 0' },
                                transition: { duration: 1.5, ease: 'easeOut' },
                                viewport: { once: true },
                            })}
                            className="inline-block bg-gradient-to-r from-primary to-secondary bg-[length:200%_100%] bg-clip-text text-transparent"
                        >
                            {translate(translations, 'landing.hero.headingHighlighted')}
                        </HighlightedText>
                    </Heading>

                    {/* Image */}
                    <div className="relative mb-6 h-full w-full xs:mb-8">
                        <img
                            src="/images/hero_section/hero_section_light.png"
                            alt="Hero section illustration"
                            className="h-full w-full object-contain drop-shadow-lg dark:hidden"
                        />
                        <img
                            src="/images/hero_section/hero_section_dark.png"
                            alt="Hero section illustration"
                            className="hidden h-full w-full object-contain drop-shadow-lg dark:block"
                        />
                    </div>

                    {/* Subtitle */}
                    <Subtitle
                        {...(!isMobile && {
                            initial: { opacity: 0 },
                            whileInView: { opacity: 1 },
                            transition: { delay: 0.3, duration: 1 },
                            viewport: { once: true, amount: 0.6 },
                        })}
                        className="mb-8 text-center text-lg text-muted-foreground xs:mb-12 xs:text-xl"
                    >
                        {translate(translations, 'landing.hero.subtitle')}
                    </Subtitle>

                    {/* CTAs */}
                    <CTAWrapper
                        {...(!isMobile && {
                            initial: { opacity: 0, scale: 0.95 },
                            whileInView: { opacity: 1, scale: 1 },
                            transition: { delay: 0.5, duration: 0.6 },
                            viewport: { once: true, amount: 0.6 },
                        })}
                        className="flex flex-col justify-center gap-4 xs:gap-6 sm:flex-row"
                    >
                        <a
                            href={route('register')}
                            className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center text-base font-semibold whitespace-nowrap shadow-lg xs:px-8 xs:py-4 xs:text-lg md:transition-all md:hover:scale-105"
                        >
                            {translate(translations, 'landing.hero.ctaPrimaryGuest')}
                        </a>
                        <a
                            href="#problems"
                            className="min-w-[200px] rounded-lg border border-border bg-surface px-6 py-3 text-center text-base font-semibold whitespace-nowrap text-foreground xs:px-8 xs:py-4 xs:text-lg md:transition-all md:hover:bg-surface/80"
                        >
                            {translate(translations, 'landing.hero.ctaSecondary')}
                        </a>
                    </CTAWrapper>
                </div>

                {/* Large screens - 2x2 Grid */}
                <div className="hidden lg:block">
                    {/* Row 1: 50/50 split */}
                    <div className="mb-6 grid grid-cols-2 gap-6 xl:mb-8 xl:gap-8">
                        {/* Row 1, Col 1: Primary heading */}
                        <Heading
                            {...(!isMobile && {
                                initial: { opacity: 0, y: 20 },
                                whileInView: { opacity: 1, y: 0 },
                                transition: { duration: 0.8 },
                                viewport: { once: true, amount: 0.6 },
                            })}
                            className="text-text-primary dark:text-text-primary flex items-center text-4xl leading-tight font-bold xs:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            {translate(translations, 'landing.hero.headingPrimary')}
                        </Heading>

                        {/* Row 1, Col 2: Image */}
                        <div className="relative h-full w-full lg:mx-auto lg:w-2/3 xl:w-full">
                            <img
                                src="/images/hero_section/hero_section_light.png"
                                alt="Hero section illustration"
                                className="h-full w-full object-contain drop-shadow-lg dark:hidden"
                            />
                            <img
                                src="/images/hero_section/hero_section_dark.png"
                                alt="Hero section illustration"
                                className="hidden h-full w-full object-contain drop-shadow-lg dark:block"
                            />
                        </div>
                    </div>

                    {/* Row 2: 2/5 and 3/5 split */}
                    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[2fr_3fr] xl:gap-8">
                        {/* Row 2, Col 1: Get Started button and Subtitle */}
                        <div className="flex flex-col gap-4 xl:gap-6">
                            <a
                                href={route('register')}
                                className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary text-center font-semibold whitespace-nowrap shadow-lg md:transition-all md:hover:scale-105 lg:px-5 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl"
                            >
                                {translate(translations, 'landing.hero.ctaPrimaryGuest')}
                            </a>

                            <Subtitle
                                {...(!isMobile && {
                                    initial: { opacity: 0 },
                                    whileInView: { opacity: 1 },
                                    transition: { delay: 0.3, duration: 1 },
                                    viewport: { once: true, amount: 0.6 },
                                })}
                                className="text-lg text-muted-foreground xs:text-xl lg:text-xl xl:text-2xl"
                            >
                                {translate(translations, 'landing.hero.subtitle')}
                            </Subtitle>
                        </div>

                        {/* Row 2, Col 2: Highlighted heading and See How it Works button */}
                        <div className="flex flex-col gap-4 xl:gap-6">
                            <HighlightedText
                                {...(!isMobile && {
                                    initial: { backgroundPosition: '200% 0' },
                                    whileInView: { backgroundPosition: '0% 0' },
                                    transition: { duration: 1.5, ease: 'easeOut' },
                                    viewport: { once: true },
                                })}
                                className="flex inline-block items-center justify-center bg-gradient-to-r from-primary to-secondary bg-[length:200%_100%] bg-clip-text text-3xl leading-tight font-bold text-transparent xs:text-4xl lg:text-5xl xl:text-6xl"
                            >
                                {translate(translations, 'landing.hero.headingHighlighted')}
                            </HighlightedText>

                            <a
                                href="#problems"
                                className="min-w-[200px] rounded-lg border border-border bg-surface text-center font-semibold whitespace-nowrap text-foreground md:transition-all md:hover:bg-surface/80 lg:px-5 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl"
                            >
                                {translate(translations, 'landing.hero.ctaSecondary')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
