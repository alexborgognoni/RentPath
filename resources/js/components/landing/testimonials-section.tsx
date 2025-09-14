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
    const HEADER_TITLE = 'Trusted by Property Professionals';
    const HEADER_DESCRIPTION = 'See why thousands of agents, property managers, and landlords choose RentPath to streamline rentals.';

    const REVIEWS: Review[] = [
        {
            id: 1,
            name: 'Amar Ramdedovic',
            role: 'Real Estate Agent',
            company: 'Valora',
            avatar: 'AR',
            avatarUrl: 'https://i1.static.athome.eu/images/annonces2/agent/21e564872da32ef502948911aa9589583d720136.jpg',
            rating: 5,
            content:
                'RentPath transformed our application process completely. We went from 3-week visit delays to same-day lease signing. The automated document collection is a game-changer.',
        },
        {
            id: 2,
            name: 'Alessandro Rossi',
            role: 'Landlord with 25+ Properties',
            avatar: 'AR',
            rating: 5,
            content:
                'Since switching to RentPath, I haven’t looked back. Tenant retention has improved noticeably, and managing my rentals has become far simpler and less stressful than I ever expected.',
        },
        {
            id: 3,
            name: 'Philippe Hengen',
            role: 'Agency Director',
            company: 'AXA',
            avatar: 'PH',
            avatarUrl:
                'https://media.licdn.com/dms/image/v2/C4E03AQEVIRE2F_cMfA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1650549914072?e=1760572800&v=beta&t=41c1UTxyqbx-4appS5xPil1sGV9IvGZ-28yt-KBFpHo',
            rating: 5,
            content:
                'RentPath makes owning multiple properties effortless. It’s helped reduce vacancies and quickly find tenants. I’d recommend it to anyone looking to optimize their time.',
        },
    ];

    const STATS = [
        { value: '4.9/5', label: 'Average Rating' },
        { value: '200+', label: 'Happy Customers' },
        { value: '500+', label: 'Properties Managed' },
    ];

    return (
        <section className="bg-surface py-24">
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
                            className="group relative rounded-2xl border border-border bg-card/50 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative">
                                {/* Rating */}
                                <div className="mb-4 flex space-x-1">{renderStars(review.rating)}</div>

                                {/* Content */}
                                <p className="mb-6 leading-relaxed text-foreground">"{review.content}"</p>

                                {/* Author */}
                                <div className="flex items-center space-x-4">
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
                                            {review.role} {review.company && `at ${review.company}`}
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
