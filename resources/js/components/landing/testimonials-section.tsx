import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
    id: number;
    name: string;
    role: string;
    company?: string;
    avatar: string;
    avatarUrl?: string;
    rating: number;
    content: string;
}

const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
    ));

export function TestimonialsSection() {
    const { translations } = usePage<SharedData>().props;

    const HEADER_TITLE = translate(translations.public.landing, 'testimonials.heading');
    const HEADER_DESCRIPTION = translate(translations.public.landing, 'testimonials.subtitle');

    const REVIEWS: Review[] = [
        {
            id: 1,
            name: 'Amar Ramdedovic',
            role: translate(translations.public.landing, 'testimonials.testimonials.amarRamdedovic.role'),
            company: 'Valora',
            avatar: 'AR',
            avatarUrl: '/images/reviews/reviews_1.jpg',
            rating: 5,
            content: translate(translations.public.landing, 'testimonials.testimonials.amarRamdedovic.content'),
        },
        {
            id: 2,
            name: 'Alessandro Rossi',
            role: translate(translations.public.landing, 'testimonials.testimonials.alessandroRossi.role'),
            avatar: 'AR',
            rating: 5,
            content: translate(translations.public.landing, 'testimonials.testimonials.alessandroRossi.content'),
        },
        {
            id: 3,
            name: 'Philippe Hengen',
            role: translate(translations.public.landing, 'testimonials.testimonials.philippeHengen.role'),
            company: 'AXA',
            avatar: 'PH',
            avatarUrl: '/images/reviews/reviews_3.jpeg',
            rating: 5,
            content: translate(translations.public.landing, 'testimonials.testimonials.philippeHengen.content'),
        },
    ];

    const STATS = [
        { value: '4.9/5', label: translate(translations.public.landing, 'testimonials.stats.ratingLabel') },
        { value: '200+', label: translate(translations.public.landing, 'testimonials.stats.customersLabel') },
        { value: '500+', label: translate(translations.public.landing, 'testimonials.stats.propertiesLabel') },
    ];

    return (
        <section className="bg-surface py-12 md:py-16 lg:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.6 }}
                        className="mb-4 text-4xl font-bold text-foreground lg:text-5xl"
                    >
                        {HEADER_TITLE}
                    </motion.h2>
                    <p className="mx-auto max-w-3xl text-xl text-muted-foreground">{HEADER_DESCRIPTION}</p>
                </div>

                {/* Reviews */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {REVIEWS.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: false, amount: 0.3 }}
                            className="group relative rounded-2xl border border-border bg-card/50 p-8 shadow-lg md:transition-all md:duration-300 md:hover:shadow-xl md:hover:shadow-primary/10 lg:h-full"
                        >
                            <div className="absolute inset-0 hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block" />

                            <div className="relative flex h-full flex-col">
                                {/* Rating */}
                                <div className="mb-4 flex space-x-1">{renderStars(review.rating)}</div>

                                {/* Content */}
                                <p className="mb-6 flex-grow leading-relaxed text-foreground">"{review.content}"</p>

                                {/* Author */}
                                <div className="mt-auto flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary font-semibold text-white">
                                        {review.avatarUrl ? (
                                            <img src={review.avatarUrl} alt={review.name} className="h-full w-full object-cover" />
                                        ) : (
                                            review.avatar
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">{review.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {review.role}{' '}
                                            {review.company &&
                                                ` ${translate(translations.public.landing, 'testimonials.atKeyword')} ${review.company}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: false, amount: 0.6 }}
                    className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8"
                >
                    <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
                        {STATS.map((stat, idx) => (
                            <div key={idx}>
                                <div className="mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
