import { ParallaxBackground } from '@/components/parallax-background';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="relative flex min-h-screen w-full flex-col bg-background lg:h-screen lg:overflow-hidden">
                <div className="absolute inset-0 min-h-full w-full lg:h-screen">
                    <ParallaxBackground />
                </div>
                <div className="relative z-10">{children}</div>
            </div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
