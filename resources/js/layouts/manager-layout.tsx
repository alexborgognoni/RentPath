import { AppSidebar } from '@/components/app-sidebar';
import { LogoutConfirmationPopover } from '@/components/logout-confirmation-popover';
import type { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Home, Menu } from 'lucide-react';
import { useEffect, useState, type PropsWithChildren } from 'react';

interface ManagerLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export function ManagerLayout({ children, breadcrumbs }: ManagerLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        // Load initial state from localStorage
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const handleLogout = () => {
        setShowLogoutConfirmation(true);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AppSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                onLogout={handleLogout}
            />

            {/* Mobile overlay */}
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                            <Home size={20} className="text-white" />
                        </div>
                        <span className="text-lg font-bold text-foreground">RentPath</span>
                    </div>
                    <div className="w-6" /> {/* Spacer for centering */}
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
            </div>

            {/* Logout Confirmation */}
            <LogoutConfirmationPopover
                isOpen={showLogoutConfirmation}
                onClose={() => setShowLogoutConfirmation(false)}
                onConfirm={() => setShowLogoutConfirmation(false)}
            />
        </div>
    );
}
