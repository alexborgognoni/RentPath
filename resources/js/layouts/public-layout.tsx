import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/footer';
import { ParallaxBackground } from '@/components/parallax-background';
import type { PropsWithChildren } from 'react';

export function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen">
            <div className="absolute inset-0 min-h-full w-full">
                <ParallaxBackground />
            </div>
            <div className="relative z-10">
                <AppHeader />
                <main>{children}</main>
                <Footer />
            </div>
        </div>
    );
}