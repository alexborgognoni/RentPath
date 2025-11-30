import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toast';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

interface ManagerLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export function ManagerLayout({ children, breadcrumbs }: ManagerLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-2 border-b border-border bg-card px-4 md:hidden">
                    <SidebarTrigger />
                    <span className="text-sm font-semibold text-foreground">RentPath</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="h-full px-4 py-6 sm:px-6 lg:px-8">
                        {/* Breadcrumbs */}
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="mb-6 flex items-center space-x-2 text-sm">
                                {breadcrumbs.map((crumb, index) => (
                                    <div key={`breadcrumb-${index}`} className="flex items-center space-x-2">
                                        {index > 0 && <span className="text-muted-foreground">/</span>}
                                        {index === breadcrumbs.length - 1 || !crumb.href ? (
                                            <span className="font-semibold text-foreground">{crumb.title}</span>
                                        ) : (
                                            <Link href={crumb.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                                {crumb.title}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        )}
                        {children}
                    </div>
                </main>
            </SidebarInset>

            {/* Toast Notifications */}
            <Toaster />
        </SidebarProvider>
    );
}
