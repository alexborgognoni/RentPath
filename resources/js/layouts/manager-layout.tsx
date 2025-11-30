import { AppSidebar } from '@/components/app-sidebar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toast';
import type { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';

interface ManagerLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

const SIDEBAR_WIDTH = 256; // px
const SIDEBAR_COLLAPSED_WIDTH = 64; // px

export function ManagerLayout({ children, breadcrumbs }: ManagerLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Load saved state from cookie
    useEffect(() => {
        const savedState = document.cookie
            .split('; ')
            .find((row) => row.startsWith('sidebar_collapsed='))
            ?.split('=')[1];
        if (savedState === 'true') {
            setIsCollapsed(true);
        }
    }, []);

    // Save state to cookie
    const saveState = useCallback((collapsed: boolean) => {
        document.cookie = `sidebar_collapsed=${collapsed}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }, []);

    const handleToggleCollapse = useCallback(() => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        saveState(newCollapsed);
    }, [isCollapsed, saveState]);

    return (
        <div className="flex h-screen w-full bg-background">
            {/* Desktop Layout */}
            <div className="hidden h-full w-full lg:flex">
                {/* Sidebar */}
                <div
                    className="h-full border-r border-border transition-[width] duration-200"
                    style={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
                >
                    <AppSidebar isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
                </div>

                {/* Main Content */}
                <main className="h-full flex-1 overflow-y-auto bg-background">
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
            </div>

            {/* Mobile Layout */}
            <div className="flex h-full w-full flex-col lg:hidden">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Menu size={20} />
                    </button>
                    <span className="text-sm font-semibold text-foreground">RentPath</span>
                </header>

                {/* Mobile Sheet */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side="left" className="w-72 p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Navigation</SheetTitle>
                            <SheetDescription>Main navigation menu</SheetDescription>
                        </SheetHeader>
                        <AppSidebar isCollapsed={false} onToggleCollapse={() => {}} />
                    </SheetContent>
                </Sheet>

                {/* Mobile Content */}
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="h-full px-4 py-6">
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
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
