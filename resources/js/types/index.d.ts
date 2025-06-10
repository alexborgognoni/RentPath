import ***REMOVED*** LucideIcon ***REMOVED*** from 'lucide-react';
import type ***REMOVED*** Config ***REMOVED*** from 'ziggy-js';

export interface Auth ***REMOVED***
    user: User;
***REMOVED***

export interface BreadcrumbItem ***REMOVED***
    title: string;
    href: string;
***REMOVED***

export interface NavGroup ***REMOVED***
    title: string;
    items: NavItem[];
***REMOVED***

export interface NavItem ***REMOVED***
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
***REMOVED***

export interface SharedData ***REMOVED***
    name: string;
    quote: ***REMOVED*** message: string; author: string ***REMOVED***;
    auth: Auth;
    ziggy: Config & ***REMOVED*** location: string ***REMOVED***;
    sidebarOpen: boolean;
    [key: string]: unknown;
***REMOVED***

export interface User ***REMOVED***
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
***REMOVED***
