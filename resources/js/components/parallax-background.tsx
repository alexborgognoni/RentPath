import { useEffect, useRef } from 'react';

interface ParallaxBackgroundProps {
    containToSection?: boolean;
}

export function ParallaxBackground({ containToSection = false }: ParallaxBackgroundProps) {
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (backgroundRef.current) {
                const scrollY = window.scrollY;
                const parallaxSpeed = 0.5; // Move at 50% speed of scroll
                backgroundRef.current.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div 
            ref={backgroundRef} 
            className={`pointer-events-none absolute inset-0 ${containToSection ? 'overflow-hidden' : ''}`}
        >
            <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 blur-3xl dark:from-secondary/20 dark:to-primary/20" />
            <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl dark:from-primary/20 dark:to-secondary/20" />
            <div className="absolute top-1/3 left-1/3 h-32 w-32 rounded-full bg-gradient-to-br from-secondary/5 to-primary/5 blur-2xl dark:from-secondary/10 dark:to-primary/10" />
        </div>
    );
}