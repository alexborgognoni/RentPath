import { AppHeader } from '@/components/app-header';
import { BenefitsSection } from '@/components/landing/benefits-section';
import { CtaSection } from '@/components/landing/cta-section';
import { DemoCarouselSection } from '@/components/landing/demo-carousel-section';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { TopFeaturesSection } from '@/components/landing/top-features-section';
// import { TrustedBySection } from '@/components/landing/trusted-by-section';
import { ValuePropositionSection } from '@/components/landing/value-proposition-section';

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <AppHeader />
            <HeroSection />
            {/* <TrustedBySection /> */}
            <TopFeaturesSection />
            <DemoCarouselSection />
            <ValuePropositionSection />
            <TestimonialsSection />
            <BenefitsSection />
            <CtaSection />
            <Footer />
        </div>
    );
}
