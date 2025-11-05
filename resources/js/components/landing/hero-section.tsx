import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SharedData } from '@/types';

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
                        className="text-text-primary dark:text-text-primary mb-6 xs:mb-8 text-center text-4xl xs:text-5xl leading-tight font-bold"
                    >
                        {translate(translations, 'landing.hero.heading_primary')}
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
                            {translate(translations, 'landing.hero.heading_highlighted')}
                        </HighlightedText>
                    </Heading>

                    {/* Image */}
                    <div className="relative w-full h-full mb-6 xs:mb-8">
                        <img
                            src="/images/hero_section/hero_section_light.png"
                            alt="Hero section illustration"
                            className="w-full h-full object-contain dark:hidden drop-shadow-lg"
                        />
                        <img
                            src="/images/hero_section/hero_section_dark.png"
                            alt="Hero section illustration"
                            className="w-full h-full object-contain hidden dark:block drop-shadow-lg"
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
                        className="text-center mb-8 xs:mb-12 text-lg xs:text-xl text-muted-foreground"
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
                            href="/register"
                            className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary px-6 xs:px-8 py-3 xs:py-4 text-center text-base xs:text-lg font-semibold whitespace-nowrap shadow-lg md:transition-all md:hover:scale-105"
                        >
                            {translate(translations, 'landing.hero.cta_primary_guest')}
                        </a>
                        <a
                            href="#problems"
                            className="min-w-[200px] rounded-lg border border-border bg-surface px-6 xs:px-8 py-3 xs:py-4 text-center text-base xs:text-lg font-semibold whitespace-nowrap text-foreground md:transition-all md:hover:bg-surface/80"
                        >
                            {translate(translations, 'landing.hero.cta_secondary')}
                        </a>
                    </CTAWrapper>
                </div>

                {/* Large screens - 2x2 Grid */}
                <div className="hidden lg:block">
                    {/* Row 1: 50/50 split */}
                    <div className="grid grid-cols-2 gap-6 xl:gap-8 mb-6 xl:mb-8">
                        {/* Row 1, Col 1: Primary heading */}
                        <Heading
                            {...(!isMobile && {
                                initial: { opacity: 0, y: 20 },
                                whileInView: { opacity: 1, y: 0 },
                                transition: { duration: 0.8 },
                                viewport: { once: true, amount: 0.6 },
                            })}
                            className="text-text-primary dark:text-text-primary text-4xl xs:text-5xl leading-tight font-bold lg:text-6xl xl:text-7xl flex items-center"
                        >
                            {translate(translations, 'landing.hero.heading_primary')}
                        </Heading>

                        {/* Row 1, Col 2: Image */}
                        <div className="relative w-full h-full lg:w-2/3 lg:mx-auto xl:w-full">
                            <img
                                src="/images/hero_section/hero_section_light.png"
                                alt="Hero section illustration"
                                className="w-full h-full object-contain dark:hidden drop-shadow-lg"
                            />
                            <img
                                src="/images/hero_section/hero_section_dark.png"
                                alt="Hero section illustration"
                                className="w-full h-full object-contain hidden dark:block drop-shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Row 2: 2/5 and 3/5 split */}
                    <div className="grid gap-6 xl:gap-8 lg:grid-cols-2 xl:grid-cols-[2fr_3fr]">
                        {/* Row 2, Col 1: Get Started button and Subtitle */}
                        <div className="flex flex-col gap-4 xl:gap-6">
                            <a
                                href="/register"
                                className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary lg:px-5 lg:py-3 xl:px-6 xl:py-3 text-center lg:text-lg xl:text-xl font-semibold whitespace-nowrap shadow-lg md:transition-all md:hover:scale-105"
                            >
                                {translate(translations, 'landing.hero.cta_primary_guest')}
                            </a>

                            <Subtitle
                                {...(!isMobile && {
                                    initial: { opacity: 0 },
                                    whileInView: { opacity: 1 },
                                    transition: { delay: 0.3, duration: 1 },
                                    viewport: { once: true, amount: 0.6 },
                                })}
                                className="text-lg xs:text-xl text-muted-foreground lg:text-xl xl:text-2xl"
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
                                className="inline-block bg-gradient-to-r from-primary to-secondary bg-[length:200%_100%] bg-clip-text text-transparent text-3xl xs:text-4xl leading-tight font-bold lg:text-5xl xl:text-6xl flex items-center justify-center"
                            >
                                {translate(translations, 'landing.hero.heading_highlighted')}
                            </HighlightedText>

                            <a
                                href="#problems"
                                className="min-w-[200px] rounded-lg border border-border bg-surface lg:px-5 lg:py-3 xl:px-6 xl:py-3 text-center lg:text-lg xl:text-xl font-semibold whitespace-nowrap text-foreground md:transition-all md:hover:bg-surface/80"
                            >
                                {translate(translations, 'landing.hero.cta_secondary')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
