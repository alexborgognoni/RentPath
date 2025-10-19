import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export function HeroSection() {
    const page = usePage<SharedData>();
    const { auth, translations } = page.props;
    const isMobile = useIsMobile();

    return (
        <section className="relative overflow-hidden border-b bg-background py-8 xs:py-12 md:py-16 lg:py-20">
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                {/* Heading */}
                <motion.h1
                    initial={isMobile ? false : { opacity: 0, y: 20 }}
                    whileInView={isMobile ? false : { opacity: 1, y: 0 }}
                    transition={isMobile ? undefined : { duration: 0.8 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.6 }}
                    className="text-text-primary dark:text-text-primary mb-6 xs:mb-8 text-4xl xs:text-5xl leading-tight font-bold lg:text-7xl"
                >
                    {translate(translations, 'landing.hero.heading_primary')}
                    <br />
                    <motion.span
                        initial={isMobile ? false : { backgroundPosition: '200% 0' }}
                        whileInView={isMobile ? false : { backgroundPosition: '0% 0' }}
                        transition={isMobile ? undefined : { duration: 1.5, ease: 'easeOut' }}
                        viewport={isMobile ? undefined : { once: true }}
                        className="inline-block bg-gradient-to-r from-primary to-secondary bg-[length:200%_100%] bg-clip-text text-transparent"
                    >
                        {translate(translations, 'landing.hero.heading_highlighted')}
                    </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={isMobile ? false : { opacity: 0 }}
                    whileInView={isMobile ? false : { opacity: 1 }}
                    transition={isMobile ? undefined : { delay: 0.3, duration: 1 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.6 }}
                    className="mx-auto mb-8 xs:mb-12 max-w-3xl text-lg xs:text-xl text-muted-foreground lg:text-2xl"
                >
                    {translate(translations, 'landing.hero.subtitle')}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    whileInView={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                    transition={isMobile ? { duration: 0 } : { delay: 0.5, duration: 0.6 }}
                    viewport={{ once: true, amount: 0.6 }}
                    className="flex flex-col justify-center gap-4 xs:gap-6 sm:flex-row"
                >
                    <a
                        href="/register"
                        className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary px-6 xs:px-8 py-3 xs:py-4 text-center text-base xs:text-lg font-semibold whitespace-nowrap shadow-lg md:transition-all md:hover:scale-105"
                    >
                        {auth.user
                            ? translate(translations, 'landing.hero.cta_primary_auth')
                            : translate(translations, 'landing.hero.cta_primary_guest')}
                    </a>
                    <a
                        href="#problems"
                        className="min-w-[200px] rounded-lg border border-border bg-surface px-6 xs:px-8 py-3 xs:py-4 text-center text-base xs:text-lg font-semibold whitespace-nowrap text-foreground md:transition-all md:hover:bg-surface/80"
                    >
                        {translate(translations, 'landing.hero.cta_secondary')}
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
