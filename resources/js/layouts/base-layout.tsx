import { CookieBanner } from '@/components/cookie-banner';
import { AppHeader } from '@/components/layout/app-header';
import type { PropsWithChildren } from 'react';

interface BaseLayoutProps extends PropsWithChildren {
    variant?: 'app' | 'public';
}

export function BaseLayout({ children, variant = 'app' }: BaseLayoutProps) {
    if (variant === 'public') {
        return (
            <div className="min-h-screen">
                <div className="relative z-10">
                    <AppHeader />
                    {children}
                </div>
                <CookieBanner />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background">
            <div className="relative z-10 flex min-h-screen flex-col">
                <AppHeader />
                {children}
            </div>
            <CookieBanner />
        </div>
    );
}
