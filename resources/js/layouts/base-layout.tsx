import { AppHeader } from '@/components/app-header';
import { CookieBanner } from '@/components/cookie-banner';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

interface BaseLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    showBackground?: boolean;
    variant?: 'app' | 'public';
}

export function BaseLayout({ children, breadcrumbs, title, variant = 'app' }: BaseLayoutProps) {
    if (variant === 'public') {
        return (
            <div className="min-h-screen">
                <div className="relative z-10">
                    <AppHeader breadcrumbs={breadcrumbs} title={title} />
                    {children}
                </div>
                <CookieBanner />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background">
            <div className="relative z-10 flex min-h-screen flex-col">
                <AppHeader breadcrumbs={breadcrumbs} title={title} />
                {children}
            </div>
            <CookieBanner />
        </div>
    );
}
