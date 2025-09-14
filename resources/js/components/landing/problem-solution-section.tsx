import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Zap, Eye, Clock, Check, Workflow, Sliders, ArrowRight } from 'lucide-react';

export function ProblemSolutionSection() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isManuallyControlled, setIsManuallyControlled] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const slides = [
        {
            id: 1,
            title: "Real-time Dashboard",
            description: "Visibility across all your properties, tracking applications, inspections, leases, and marketing efforts — instantly.",
            features: [
                "Live application pipeline",
                "Lease & marketing calendar",  
                "User-friendly inspection tools",
                "Swift landlord reporting",
            ],
        },
        {
            id: 2,
            title: "Guided Tenant Applications",
            description: "Invite leads to a step-by-step application flow that ensures all necessary documents are collected. Complete applications, every time.",
            features: [
                "Application invite links",
                "Progress validation at each step", 
                "Required documents checklists",
                "Professional application experience",
            ],
        },
        {
            id: 3,
            title: "Automated Application Review",
            description: "Validate tenant information and documents instantly. No more digging through emails or paper.",
            features: [
                "Missing information alerts",
                "Authenticity and identity validation",
                "Instant document verification", 
                "Complete contract management",
            ],
        },
        {
            id: 4,
            title: "Full Progress Visibility",
            description: "Monitor each applicant and lease stage in one view to spot bottlenecks and accelerate leasing.",
            features: [
                "Real-time application status",
                "Progress indicators per applicant",
                "Property lease tracking",
                "Bottleneck identification",
            ],
        },
        {
            id: 5,
            title: "Smart Follow-up System",
            description: "Automated reminders and follow-ups keep applicants moving, reducing vacant days.",
            features: [
                "Automated reminder emails",
                "Application recovery for stalled submissions",
                "Follow-up scheduling",
                "Conversion optimization",
            ],
        },
        {
            id: 6,
            title: "Digital Property Inspections",
            description: "Capture move-in/move-out conditions digitally, with photos, notes, and full history for transparency and efficiency.",
            features: [
                "Photo-documented inspections",
                "Complete inspection history",
                "Digital report generation",
                "Move-in & move-out tracking",
            ],
        },
        {
            id: 7,
            title: "Professional Landlord Reporting",
            description: "Keep landlords informed with automated updates, tenant validation, and professional reports.",
            features: [
                "Automated report generation",
                "Automated tenant validation",
                "Professional progress updates",
                "Live client communication",
            ],
        },
    ];

    // Auto-advance carousel with timer reset logic
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const delay = isManuallyControlled ? 15000 : 5000; // 15s after manual, 5s normally
        
        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
            setIsManuallyControlled(false); // Reset to normal timing after first auto-advance
        }, delay);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [slides.length, isManuallyControlled]);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        setIsManuallyControlled(true);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsManuallyControlled(true);
    };

    const goToSlide = (index: number) => {
        setActiveSlide(index);
        setIsManuallyControlled(true);
    };

    return (
        <section id="problems" className="relative overflow-hidden bg-background py-24">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
            
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ROI Callout */}
                <div className="relative mb-20 mx-auto max-w-7xl rounded-3xl border border-border bg-card/50 p-12 text-center backdrop-blur-xl shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="mb-6 text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                            Built for Modern Rental Applications
                        </h3>
                        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                            Transform your tenant placements with real-time insights, document management, and automated landlord updates.
                        </p>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <div className="relative z-10">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                        <Zap className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="mb-4 text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-110">
                                        Complete Applications
                                    </div>
                                    <p className="leading-relaxed text-muted-foreground">
                                        No more chasing IDs, contracts, or references — invite tenants and collect applications in one place.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <div className="relative z-10">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                        <ArrowRight className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="mb-4 text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-110">
                                        Streamlined Leasing
                                    </div>
                                    <p className="leading-relaxed text-muted-foreground">
                                        Seamlessly guide applicants to move-in — cutting time-to-fill and reducing vacancies.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <div className="relative z-10">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                        <Clock className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="mb-4 text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-110">
                                        Occupancy Overview
                                    </div>
                                    <p className="leading-relaxed text-muted-foreground">
                                        See which units are vacant, occupied, or have leads — and never lose sight of your portfolio.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="mb-20 text-center">
                    <h2 className="mb-6 text-4xl font-bold text-foreground lg:text-6xl">
                        Streamlined from First Interest to Move-In
                    </h2>
                    <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-muted-foreground">
                        Manual reviews, missed applications, messy communication - rentals are inefficient. Our platform streamlines the tenant journey.
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative mb-20">
                    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/80 to-surface/50 shadow-2xl backdrop-blur-xl">
                        {/* Enhanced Background Pattern */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute h-full w-full bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
                            <svg
                                className="absolute inset-0 h-full w-full"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient
                                        id="grid-gradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="rgba(6, 182, 212, 0.1)" />
                                        <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,0 L100,0 L100,100 L0,100 Z"
                                    fill="url(#grid-gradient)"
                                />
                            </svg>
                        </div>

                        <div className="relative h-[700px] overflow-hidden">
                            <div 
                                className="flex h-full transition-transform duration-700 ease-out"
                                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                            >
                                {slides.map((slide, index) => (
                                    <div key={slide.id} className="h-full w-full flex-shrink-0">
                                        <div className="relative flex h-full flex-col justify-center p-12">
                                            <div className="relative z-10 mx-auto max-w-5xl text-center">
                                                {/* Enhanced Screenshot Placeholder */}
                                                <div className="group relative mx-auto mb-12">
                                                    <div className="mx-auto flex h-56 w-96 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-105">
                                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                                                        <div className="relative">
                                                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                                                                <Eye className="h-8 w-8 text-white" />
                                                            </div>
                                                            <span className="text-lg font-medium text-primary">
                                                                Interactive Demo
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Glow Effect */}
                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
                                                </div>

                                                <h3 className="mb-6 text-4xl font-bold leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent lg:text-5xl">
                                                    {slide.title}
                                                </h3>

                                                <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                                                    {slide.description}
                                                </p>

                                                {/* Enhanced Feature Grid */}
                                                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
                                                    {slide.features.map((feature, featureIndex) => (
                                                        <div
                                                            key={featureIndex}
                                                            className="group flex items-center space-x-4 rounded-xl border border-primary/20 bg-gradient-to-r from-surface/50 to-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-110">
                                                                <Check className="h-4 w-4 text-white" />
                                                            </div>
                                                            <span className="text-left font-medium text-foreground">
                                                                {feature}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Navigation - Below the carousel */}
                    <div className="mt-8 flex justify-center">
                        <div className="relative flex items-center space-x-6 bg-gradient-to-r from-primary/5 via-primary/4 via-secondary/4 to-secondary/5 backdrop-blur-xl rounded-full px-6 py-3 border border-border/30 shadow-lg">
                            <button
                                onClick={prevSlide}
                                className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-lg border border-border/20 rounded-full flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 hover:scale-110 transition-all duration-300 group cursor-pointer shadow-inner"
                            >
                                <ChevronLeft className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                            </button>
                            
                            <div className="flex space-x-3">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`transition-all duration-300 cursor-pointer ${
                                            index === activeSlide 
                                                ? 'w-8 h-3 bg-gradient-to-r from-primary to-secondary rounded-full shadow-sm' 
                                                : 'w-3 h-3 bg-muted/40 hover:bg-muted/60 rounded-full hover:scale-125 backdrop-blur-sm'
                                        }`}
                                    />
                                ))}
                            </div>
                            
                            <button
                                onClick={nextSlide}
                                className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-lg border border-border/20 rounded-full flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 hover:scale-110 transition-all duration-300 group cursor-pointer shadow-inner"
                            >
                                <ChevronRight className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
