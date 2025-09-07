import { ArrowRight, Bell, Camera, Eye, FileText, Mail, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
            
            // Easing function (ease out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentCount = Math.round(startCount + (target - startCount) * easeOut);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [target, duration, isInView]);

    return { count, setIsInView };
}

export function FeaturesSection() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    const { count: count1, setIsInView: setIsInView1 } = useCountAnimation(5);
    const { count: count2, setIsInView: setIsInView2 } = useCountAnimation(99.2);
    const { count: count3, setIsInView: setIsInView3 } = useCountAnimation(24);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            id: 1,
            title: 'Simple Tenant Invitation',
            description: 'Send professional invitation links with one click. Step-by-step forms ensure a seamless tenant experience.',
            icon: <Mail className="h-8 w-8 text-white" />,
            iconBg: 'bg-blue-600',
            stats: { percentage: '1-Click', label: 'Send Invites' },
        },
        {
            id: 2,
            title: 'Document Collection',
            description: 'Intelligent document collection that ensures 100% completion rates. No more chasing paperwork.',
            icon: <FileText className="h-8 w-8 text-white" />,
            iconBg: 'bg-purple-600',
            stats: { percentage: '100%', label: 'Complete Applications' },
        },
        {
            id: 3,
            title: 'Complete Visibility',
            description: 'See all properties and applications in one dashboard. Track progress in real time and manage tenants efficiently.',
            icon: <Eye className="h-8 w-8 text-white" />,
            iconBg: 'bg-green-600',
            stats: { percentage: 'Real-time', label: 'Progress Tracking' },
        },
        {
            id: 4,
            title: 'Secure Document Storage',
            description: 'Store tenant documents securely in the cloud with full audit trails. Access anytime, anywhere.',
            icon: <Shield className="h-8 w-8 text-white" />,
            iconBg: 'bg-teal-600',
            stats: { percentage: 'Bank-level', label: 'Security' },
        },
        {
            id: 5,
            title: 'Intelligent Notifications',
            description: 'Smart notifications that send the right message at the perfect time. Maximize engagement and response rates.',
            icon: <Bell className="h-8 w-8 text-white" />,
            iconBg: 'bg-orange-500',
            stats: { percentage: '24/7', label: 'Live Updates' },
        },
        {
            id: 6,
            title: 'Digital Inspection Features',
            description: 'Streamline inspections with photo documentation, automated reports, and complete move-in/move-out history.',
            icon: <Camera className="h-8 w-8 text-white" />,
            iconBg: 'bg-red-500',
            stats: { percentage: '60%', label: 'Time Saved' },
        },
    ];

    return (
        <section className="bg-background py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.6 }}
                        className="mb-8 text-5xl leading-tight font-bold text-foreground lg:text-7xl"
                    >
                        Next-Generation
                        <br />
                        <motion.span
                            initial={{ backgroundPosition: '200% 0' }}
                            whileInView={{ backgroundPosition: '0% 0' }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            viewport={{ once: false }}
                            className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_100%] bg-clip-text text-transparent"
                        >
                            Rental Deals
                        </motion.span>
                    </motion.h2>

                    <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-muted-foreground">
                        Experience the future of tenant placements with automated applications, real time insights, seamless tenant experiences and
                        professional landlord communications
                    </p>

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
                            className="mb-16 flex items-center space-x-12"
                        >
                            <div className="group text-center w-32">
                                <div className="mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110 min-h-[2.25rem] flex items-center justify-center">
                                    {count1}k+
                                </div>
                                <div className="text-sm text-muted-foreground">Applications Processed</div>
                            </div>
                            <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                            <div className="group text-center w-32">
                                <div className="mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-3xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110 min-h-[2.25rem] flex items-center justify-center">
                                    {count2}%
                                </div>
                                <div className="text-sm text-muted-foreground">Success Rate</div>
                            </div>
                            <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                            <div className="group text-center w-32">
                                <div className="mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-3xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110 min-h-[2.25rem] flex items-center justify-center">
                                    {count3}/7
                                </div>
                                <div className="text-sm text-muted-foreground">Support</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={feature.id} className="relative h-80 rounded-xl border border-border bg-card/50">
                            {/* Content */}
                            <div className="flex h-full flex-col p-8">
                                {/* Icon */}
                                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-lg ${feature.iconBg}`}>{feature.icon}</div>

                                {/* Title and Description - Flex grow to fill available space */}
                                <div className="flex-grow">
                                    <h3 className="mb-3 line-clamp-1 text-xl font-bold text-foreground">{feature.title}</h3>
                                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                                </div>

                                {/* Divider */}
                                <div className="my-4 h-px bg-border"></div>

                                {/* Stats at bottom - Always at bottom */}
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

                {/* Enhanced CTA Section */}
                <motion.div 
                    className="mt-24 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.6 }}
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-75 blur-xl"></div>
                        <motion.button 
                            className="relative transform cursor-pointer rounded-2xl bg-gradient-to-r from-primary to-secondary px-12 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary hover:to-secondary hover:shadow-2xl"
                            initial={{ scale: 1 }}
                            whileInView={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
                            viewport={{ once: false, amount: 0.6 }}
                        >
                            <span className="flex items-center space-x-3">
                                <span>Try Now</span>
                                <ArrowRight className="h-5 w-5" />
                            </span>
                        </motion.button>
                    </div>

                    <p className="mt-6 text-sm text-muted-foreground">Join thousands of property managers who've transformed their business.</p>
                </motion.div>
            </div>
        </section>
    );
}
