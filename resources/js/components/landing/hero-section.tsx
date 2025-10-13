import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export function HeroSection() {
    const page = usePage<SharedData>();
    const { auth, translations } = page.props;
    const isMobile = useIsMobile();

    return (
        <section className="relative overflow-hidden border-b py-12 md:py-16 lg:py-20">
            {/* Blurred texture background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 -right-40 h-96 w-[500px] rotate-12 rounded-[40%_60%_70%_30%] bg-secondary/10 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-40 h-[400px] w-[600px] -rotate-12 rounded-[60%_40%_30%_70%] bg-primary/10 blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 h-64 w-80 rotate-45 rounded-[50%_50%_40%_60%] bg-secondary/8 blur-3xl"></div>
            </div>
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                {/* Heading */}
                <motion.h1
                    initial={isMobile ? false : { opacity: 0, y: 20 }}
                    whileInView={isMobile ? false : { opacity: 1, y: 0 }}
                    transition={isMobile ? undefined : { duration: 0.8 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.6 }}
                    className="text-text-primary dark:text-text-primary mb-8 text-5xl leading-tight font-bold lg:text-7xl"
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
                    className="mx-auto mb-12 max-w-3xl text-xl text-muted-foreground lg:text-2xl"
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
                    className="flex flex-col justify-center gap-6 sm:flex-row"
                >
                    <a
                        href="/register"
                        className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-4 text-center text-lg font-semibold whitespace-nowrap shadow-lg md:transition-all md:hover:scale-105"
                    >
                        {auth.user
                            ? translate(translations, 'landing.hero.cta_primary_auth')
                            : translate(translations, 'landing.hero.cta_primary_guest')}
                    </a>
                    <a
                        href="#problems"
                        className="min-w-[200px] rounded-lg border border-border bg-surface px-8 py-4 text-center text-lg font-semibold whitespace-nowrap text-foreground md:transition-all md:hover:bg-surface/80"
                    >
                        {translate(translations, 'landing.hero.cta_secondary')}
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
