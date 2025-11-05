export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string; // Optional - current page doesn't have a link
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    locale: string;
    translations: Translations;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    property_manager?: {
        id: number;
        profile_picture_path?: string;
        profile_picture_url?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown; // This allows for additional properties...
}
