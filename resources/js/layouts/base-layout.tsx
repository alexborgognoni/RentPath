import { AppHeader } from '@/components/app-header';
import { ParallaxBackground } from '@/components/parallax-background';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

interface BaseLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    showBackground?: boolean;
    variant?: 'app' | 'public';
}

export function BaseLayout({ children, breadcrumbs, title, showBackground = true, variant = 'app' }: BaseLayoutProps) {
    if (variant === 'public') {
        return (
            <div className="min-h-screen">
                {showBackground && (
                    <div className="absolute inset-0 min-h-full w-full">
                        <ParallaxBackground />
                    </div>
                )}
                <div className="relative z-10">
                    <AppHeader breadcrumbs={breadcrumbs} title={title} />
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background lg:h-screen lg:overflow-hidden">
            {showBackground && (
                <div className="absolute inset-0 min-h-full w-full lg:h-screen">
                    <ParallaxBackground />
                </div>
            )}
            <div className="relative z-10 flex flex-col min-h-screen lg:h-full">
                <AppHeader breadcrumbs={breadcrumbs} title={title} />
                {children}
            </div>
        </div>
    );
}