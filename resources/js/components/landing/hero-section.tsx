import { ParallaxBackground } from '@/components/parallax-background';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

function HeroHeading() {
    const [HERO_HEADING_PRIMARY, HERO_HEADING_HIGHLIGHTED] = ['Streamline Tenant Applications,', 'Close Deals Faster.'];
    return (
        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.6 }}
            className="text-text-primary dark:text-text-primary mb-8 text-5xl leading-tight font-bold lg:text-7xl"
        >
            {HERO_HEADING_PRIMARY}
            <br />
            <motion.span
                initial={{ backgroundPosition: '200% 0' }}
                whileInView={{ backgroundPosition: '0% 0' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                viewport={{ once: false }}
                className="inline-block bg-gradient-to-r from-primary to-secondary bg-[length:200%_100%] bg-clip-text text-transparent"
            >
                {HERO_HEADING_HIGHLIGHTED}
            </motion.span>
        </motion.h1>
    );
}

function HeroSubtitle() {
    const HERO_SUBTITLE =
        'No more incomplete applications or endless chasing. Invite, track, and follow up on leads instantly. All from one intelligent Dashboard.';

    return (
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            className="mx-auto mb-12 max-w-3xl text-xl text-muted-foreground lg:text-2xl"
        >
            {HERO_SUBTITLE}
        </motion.p>
    );
}

function HeroCTAs({ auth }: { auth: SharedData['auth'] }) {
    const HERO_CTA_PRIMARY = { textAuth: t('dashboard'), textGuest: t('getStarted'), href: '/register' };
    const HERO_CTA_SECONDARY = { text: 'See How It Works', href: '#problems' };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: false, amount: 0.6 }}
            className="flex flex-col justify-center gap-6 sm:flex-row"
        >
            <a
                href={HERO_CTA_PRIMARY.href}
                className="text-text-primary min-w-[200px] rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-4 text-center text-lg font-semibold whitespace-nowrap shadow-lg transition-all hover:scale-105"
            >
                {auth.user ? HERO_CTA_PRIMARY.textAuth : HERO_CTA_PRIMARY.textGuest}
            </a>
            <a
                href={HERO_CTA_SECONDARY.href}
                className="min-w-[200px] rounded-lg border border-border bg-surface px-8 py-4 text-center text-lg font-semibold whitespace-nowrap text-foreground transition-all hover:bg-surface/80"
            >
                {HERO_CTA_SECONDARY.text}
            </a>
        </motion.div>
    );
}

export function HeroSection() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    return (
        <section className="relative overflow-hidden border-b py-24 lg:py-32">
            <ParallaxBackground containToSection />
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <HeroHeading />
                <HeroSubtitle />
                <HeroCTAs auth={auth} />
            </div>
        </section>
    );
}
