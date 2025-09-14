import { AppHeader } from '@/components/app-header';
import { BenefitsSection } from '@/components/landing/benefits-section';
import { CtaSection } from '@/components/landing/cta-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { Footer } from '@/components/landing/footer';
import { ProblemSolutionSection } from '@/components/landing/problem-solution-section';
import { ReviewsSection } from '@/components/landing/reviews-section';
// import { TrustedBySection } from '@/components/landing/trusted-by-section';
import { ParallaxBackground } from '@/components/parallax-background';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function WelcomePage() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    return (
        <div className="min-h-screen">
            <AppHeader />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b py-24 lg:py-32">
                {/* Background blobs contained to this section */}
                <ParallaxBackground containToSection />

                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    {/* Animated headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.6 }}
                        className="text-text-primary dark:text-text-primary mb-8 text-5xl leading-tight font-bold lg:text-7xl"
                    >
                        Streamline Tenant Applications,
                        <br />
                        <motion.span
                            initial={{ backgroundPosition: '200% 0' }}
                            whileInView={{ backgroundPosition: '0% 0' }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            viewport={{ once: false }}
                            className="inline-block bg-gradient-to-r from-primary to-secondary bg-[length:200%_100%] bg-clip-text text-transparent"
                        >
                            Close Deals Faster.
                        </motion.span>
                    </motion.h1>

                    {/* Animated subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        viewport={{ once: false, amount: 0.6 }}
                        className="mx-auto mb-12 max-w-3xl text-xl text-muted-foreground lg:text-2xl"
                    >
                    No more incomplete applications or endless chasing. Invite, track, and follow up on leads instantly. All from one intelligent Dashboard.
                    </motion.p>

                    {/* Animated buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        viewport={{ once: false, amount: 0.6 }}
                        className="flex flex-col justify-center gap-6 sm:flex-row"
                    >
                        <a
                            href="/register"
                            className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-4 text-center text-lg font-semibold whitespace-nowrap shadow-lg transition-all hover:scale-105"
                        >
                            {auth.user ? t('dashboard') : t('getStarted')}
                        </a>
                        <a
                            href="#problems"
                            className="min-w-[200px] rounded-lg border border-border bg-surface px-8 py-4 text-center text-lg font-semibold whitespace-nowrap text-foreground transition-all hover:bg-surface/80"
                        >
                            See How It Works
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* <TrustedBySection /> */}
            <ProblemSolutionSection />
            <FeaturesSection />
            <ReviewsSection />
            <BenefitsSection />
            <CtaSection />
            <Footer />
        </div>
    );
}
