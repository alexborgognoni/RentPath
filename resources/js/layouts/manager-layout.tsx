import { AppSidebar } from '@/components/app-sidebar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toast';
import type { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useCallback, useState, type PropsWithChildren } from 'react';

interface ManagerLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

const SIDEBAR_EXPANDED = 256;
const SIDEBAR_COLLAPSED = 64;

function getInitialCollapsedState(): boolean {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes('sidebar_collapsed=true');
}

export function ManagerLayout({ children, breadcrumbs }: ManagerLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setIsCollapsed((prev) => {
            const next = !prev;
            document.cookie = `sidebar_collapsed=${next}; path=/; max-age=31536000`;
            return next;
        });
    }, []);

    return (
        <div className="flex h-screen w-full bg-background">
            {/* Desktop */}
            <div className="hidden h-full w-full lg:flex">
                <div
                    className="h-full shrink-0 border-r border-border bg-card"
                    style={{
                        width: isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
                        transition: 'width 150ms ease-out',
                    }}
                >
                    <AppSidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
                </div>

                <main className="h-full flex-1 overflow-y-auto">
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="mb-4 flex items-center gap-2 text-sm">
                                {breadcrumbs.map((crumb, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        {i > 0 && <span className="text-muted-foreground">/</span>}
                                        {i === breadcrumbs.length - 1 || !crumb.href ? (
                                            <span className="font-semibold text-foreground">{crumb.title}</span>
                                        ) : (
                                            <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
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

            {/* Mobile */}
            <div className="flex h-full w-full flex-col lg:hidden">
                <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">RentPath</span>
                </header>

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side="left" className="w-72 p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Navigation</SheetTitle>
                            <SheetDescription>Main navigation menu</SheetDescription>
                        </SheetHeader>
                        <AppSidebar isCollapsed={false} onToggle={() => setMobileOpen(false)} />
                    </SheetContent>
                </Sheet>

                <main className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6">
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="mb-4 flex items-center gap-2 text-sm">
                                {breadcrumbs.map((crumb, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        {i > 0 && <span className="text-muted-foreground">/</span>}
                                        {i === breadcrumbs.length - 1 || !crumb.href ? (
                                            <span className="font-semibold text-foreground">{crumb.title}</span>
                                        ) : (
                                            <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
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

            <Toaster />
        </div>
    );
}
