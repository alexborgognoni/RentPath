import { BenefitsSection } from '@/components/landing/benefits-section';
import { CtaSection } from '@/components/landing/cta-section';
import { DemoCarouselSection } from '@/components/landing/demo-carousel-section';
import { HeroSection } from '@/components/landing/hero-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { TopFeaturesSection } from '@/components/landing/top-features-section';
// import { TrustedBySection } from '@/components/landing/trusted-by-section';
import { ValuePropositionSection } from '@/components/landing/value-proposition-section';
import { PublicLayout } from '@/layouts/public-layout';

export default function LandingPage() {
    return (
        <PublicLayout>
            <HeroSection />
            {/* <TrustedBySection /> */}
            <TopFeaturesSection />
            <DemoCarouselSection />
            <ValuePropositionSection />
            <TestimonialsSection />
            <BenefitsSection />
            <CtaSection />
        </PublicLayout>
    );
}
