import { motion } from 'framer-motion';
import { ArrowRight, Bell, Camera, Eye, FileText, Mail, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';

function useCountAnimation(target: number, duration: number = 2000) {
    const [count, setCount] = useState(0);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!isInView) {
            setCount(0);
            return;
        }

        const startTime = Date.now();
        const startCount = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(startCount + (target - startCount) * easeOut));

            if (progress < 1) requestAnimationFrame(animate);
        };

        animate();
    }, [target, duration, isInView]);

    return { count, setIsInView };
}

export function ValuePropositionSection() {
    const { translations } = usePage<SharedData>().props;

    const HEADER_TITLE = translate(translations, 'landing.value_proposition.heading_primary');
    const HEADER_HIGHLIGHT = translate(translations, 'landing.value_proposition.heading_highlighted');
    const HEADER_DESCRIPTION = translate(translations, 'landing.value_proposition.subtitle');

    const STATS = [
        { id: 1, value: 5, suffix: ',000+', label: translate(translations, 'landing.value_proposition.stats.applications') },
        { id: 2, value: 97, suffix: '%', label: translate(translations, 'landing.value_proposition.stats.conversion_rate') },
        { id: 3, value: 24, suffix: '/7', label: translate(translations, 'landing.value_proposition.stats.support') },
    ];

    const FEATURES = [
        {
            id: 1,
            title: translate(translations, 'landing.value_proposition.features.simple_tenant_invitation.title'),
            description: translate(translations, 'landing.value_proposition.features.simple_tenant_invitation.description'),
            icon: <Mail className="h-8 w-8 text-white" />,
            iconBg: 'bg-blue-600',
            stats: { percentage: '1-Click', label: translate(translations, 'landing.value_proposition.features.simple_tenant_invitation.stats_label') },
        },
        {
            id: 2,
            title: translate(translations, 'landing.value_proposition.features.document_collection.title'),
            description: translate(translations, 'landing.value_proposition.features.document_collection.description'),
            icon: <FileText className="h-8 w-8 text-white" />,
            iconBg: 'bg-purple-600',
            stats: { percentage: '100%', label: translate(translations, 'landing.value_proposition.features.document_collection.stats_label') },
        },
        {
            id: 3,
            title: translate(translations, 'landing.value_proposition.features.complete_visibility.title'),
            description: translate(translations, 'landing.value_proposition.features.complete_visibility.description'),
            icon: <Eye className="h-8 w-8 text-white" />,
            iconBg: 'bg-green-600',
            stats: { percentage: translate(translations, 'landing.value_proposition.stats_percentages.real_time'), label: translate(translations, 'landing.value_proposition.features.complete_visibility.stats_label') },
        },
        {
            id: 4,
            title: translate(translations, 'landing.value_proposition.features.secure_document_storage.title'),
            description: translate(translations, 'landing.value_proposition.features.secure_document_storage.description'),
            icon: <Shield className="h-8 w-8 text-white" />,
            iconBg: 'bg-teal-600',
            stats: { percentage: translate(translations, 'landing.value_proposition.stats_percentages.bank_level'), label: translate(translations, 'landing.value_proposition.features.secure_document_storage.stats_label') },
        },
        {
            id: 5,
            title: translate(translations, 'landing.value_proposition.features.intelligent_notifications.title'),
            description: translate(translations, 'landing.value_proposition.features.intelligent_notifications.description'),
            icon: <Bell className="h-8 w-8 text-white" />,
            iconBg: 'bg-orange-500',
            stats: { percentage: '24/7', label: translate(translations, 'landing.value_proposition.features.intelligent_notifications.stats_label') },
        },
        {
            id: 6,
            title: translate(translations, 'landing.value_proposition.features.digital_inspection_features.title'),
            description: translate(translations, 'landing.value_proposition.features.digital_inspection_features.description'),
            icon: <Camera className="h-8 w-8 text-white" />,
            iconBg: 'bg-red-500',
            stats: { percentage: '60%', label: translate(translations, 'landing.value_proposition.features.digital_inspection_features.stats_label') },
        },
    ];

    const { count: count1, setIsInView: setIsInView1 } = useCountAnimation(STATS[0].value);
    const { count: count2, setIsInView: setIsInView2 } = useCountAnimation(STATS[1].value);
    const { count: count3, setIsInView: setIsInView3 } = useCountAnimation(STATS[2].value);

    return (
        <section className="bg-background pt-0 pb-12 xs:pt-0 xs:pb-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-0 xs:mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.6 }}
                        className="mb-8 text-5xl leading-tight font-bold text-foreground lg:text-7xl"
                    >
                        {HEADER_TITLE}
                        <br />
                        <motion.span
                            initial={{ backgroundPosition: '200% 0' }}
                            whileInView={{ backgroundPosition: '0% 0' }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            viewport={{ once: false }}
                            className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_100%] bg-clip-text text-transparent"
                        >
                            {HEADER_HIGHLIGHT}
                        </motion.span>
                    </motion.h2>

                    <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-muted-foreground">{HEADER_DESCRIPTION}</p>

                    {/* Floating Stats */}
                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            viewport={{ once: false, amount: 0.6 }}
                            onViewportEnter={() => {
                                setIsInView1(true);
                                setIsInView2(true);
                                setIsInView3(true);
                            }}
                            onViewportLeave={() => {
                                setIsInView1(false);
                                setIsInView2(false);
                                setIsInView3(false);
                            }}
                            className="mb-16 flex flex-col items-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-0"
                        >
                            {STATS.map((stat, i) => (
                                <React.Fragment key={stat.id}>
                                    <div className="group w-32 text-center">
                                        <div className="mb-2 flex min-h-[2.25rem] items-center justify-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110">
                                            {i === 0 ? count1 : i === 1 ? count2 : count3}
                                            {stat.suffix}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </div>
                                    {i < STATS.length - 1 && (
                                        <>
                                            {/* Vertical divider for desktop */}
                                            <div className="mx-12 hidden h-16 w-px bg-border sm:block"></div>
                                            {/* Horizontal divider for mobile */}
                                            <div className="h-px w-24 bg-border sm:hidden"></div>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
                    {FEATURES.map((feature) => (
                        <div key={feature.id} className="relative rounded-xl border border-border bg-card/50">
                            <div className="grid h-full grid-rows-[auto_1fr_auto_auto] p-8">
                                {/* Icon */}
                                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-lg ${feature.iconBg}`}>{feature.icon}</div>
                                {/* Title and Description */}
                                <div>
                                    <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                                </div>
                                {/* Divider */}
                                <div className="my-4 h-px bg-border"></div>
                                {/* Stats */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-lg font-bold text-transparent">
                                            {feature.stats.percentage}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{feature.stats.label}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    className="mt-24 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    viewport={{ once: false, amount: 0.6 }}
                >
                    <div className="relative inline-block">
                        <motion.button className="relative transform cursor-pointer rounded-2xl bg-gradient-to-r from-primary to-secondary px-12 py-4 font-bold text-white shadow-lg md:transition-all md:duration-300 md:hover:scale-105 md:hover:from-primary md:hover:to-secondary md:hover:shadow-2xl">
                            <span className="flex items-center space-x-3">
                                <span>{translate(translations, 'landing.cta.button_text')}</span>
                                <ArrowRight className="h-5 w-5" />
                            </span>
                        </motion.button>
                    </div>

                    <p className="mt-6 text-sm text-muted-foreground">{translate(translations, 'landing.value_proposition.cta_subtitle')}</p>
                </motion.div>
            </div>
        </section>
    );
}