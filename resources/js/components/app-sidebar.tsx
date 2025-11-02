import { LanguageSelector } from '@/components/language-selector';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import { Building2, ChevronLeft, ChevronRight, ChevronsUpDown, Home, LogOut, Settings, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AppSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    onLogout: () => void;
}

export function AppSidebar({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, onLogout }: AppSidebarProps) {
    const page = usePage<SharedData>();
    const { auth, translations } = page.props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const getUserInitials = () => {
        if (auth.user?.name) {
            return auth.user.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        }
        if (auth.user?.email) return auth.user.email[0].toUpperCase();
        return 'U';
    };

    const handleLogout = () => {
        setShowUserMenu(false);
        onLogout();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        const handleScroll = () => {
            setShowUserMenu(false);
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [showUserMenu]);

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 transform bg-card border-r border-border transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
        >
            <div className="flex h-full flex-col">
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                            <Home size={20} className="text-white" />
                        </div>
                        {!sidebarCollapsed && <span className="text-lg font-bold text-foreground">RentPath</span>}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-muted-foreground hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden lg:block text-muted-foreground hover:text-foreground"
                    >
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    <a
                        href="/dashboard"
                        className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            window.location.pathname === '/dashboard' ||
                            window.location.pathname.startsWith('/properties') ||
                            window.location.pathname.startsWith('/property')
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        } ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title={sidebarCollapsed ? 'Properties' : ''}
                    >
                        <Building2 size={18} />
                        {!sidebarCollapsed && <span>Properties</span>}
                    </a>
                </nav>

                {/* User Section */}
                <div className="border-t border-border p-4">
                    {/* Language Selector */}
                    {!sidebarCollapsed && (
                        <div className="mb-3 pb-3 border-b border-border">
                            <LanguageSelector />
                        </div>
                    )}

                    <div ref={userMenuRef} className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${sidebarCollapsed ? 'justify-center' : ''}`}
                        >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
                                {auth.user?.property_manager?.profile_picture_url ? (
                                    <img
                                        src={auth.user.property_manager.profile_picture_url}
                                        alt={auth.user?.name || auth.user?.email}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-white">{getUserInitials()}</span>
                                )}
                            </div>
                            {!sidebarCollapsed && (
                                <>
                                    <div className="flex-1 text-left">
                                        {auth.user?.name && (
                                            <p className="truncate text-sm font-medium text-foreground">{auth.user.name}</p>
                                        )}
                                        <p className="truncate text-xs text-muted-foreground">{auth.user?.email}</p>
                                    </div>
                                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                                </>
                            )}
                        </button>

                        {showUserMenu && (
                            <div className={`absolute z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-surface shadow-xl ${sidebarCollapsed ? 'left-full ml-2 bottom-0' : 'bottom-full mb-2 left-0'}`}>
                                <div className="border-b border-border px-4 py-3">
                                    <div className="min-w-0">
                                        {auth.user?.name && <p className="truncate text-sm font-medium text-foreground">{auth.user.name}</p>}
                                        <p className="truncate text-xs text-muted-foreground">{auth.user?.email}</p>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/settings"
                                        className="text-text-secondary flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background cursor-pointer"
                                    >
                                        <Settings size={16} />
                                        <span>{t(translations.header, 'settings')}</span>
                                    </Link>
                                    <div className="mb-1 border-t border-border"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center space-x-3 px-4 py-2 text-left text-sm text-destructive transition-colors duration-150 hover:bg-destructive/10 cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        <span>{t(translations.header, 'sign_out')}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
