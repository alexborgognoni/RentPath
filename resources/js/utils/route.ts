import { route } from 'ziggy-js';
import { usePage } from '@inertiajs/react';

interface ZiggyConfig {
    url: string;
    port?: number;
    defaults?: Record<string, unknown>;
    routes: Record<string, { uri: string; methods: string[]; domain?: string; parameters?: string[] }>;
    location?: string;
}

// Re-export route function that uses Ziggy config from page props
function routeHelper(
    name: string,
    params?: Record<string, string | number | boolean> | string | number,
    absolute?: boolean
): string {
    // Get ziggy config from window (set by Inertia)
    const ziggy = (window as unknown as { Ziggy?: ZiggyConfig }).Ziggy;

    if (!ziggy) {
        console.warn('Ziggy config not found, falling back to name');
        return `/${name}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return route(name, params as any, absolute, ziggy as any) as unknown as string;
}

// Hook version for React components that need reactive route generation
export function useRoute() {
    const { ziggy } = usePage().props as { ziggy?: ZiggyConfig };

    return (
        name: string,
        params?: Record<string, string | number | boolean> | string | number,
        absolute?: boolean
    ): string => {
        if (!ziggy) {
            console.warn('Ziggy config not found in page props');
            return `/${name}`;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return route(name, params as any, absolute, ziggy as any) as unknown as string;
    };
}

export { routeHelper as route };

// Helper to check if we're on the manager subdomain
export function isManagerSubdomain(): boolean {
    if (typeof window === 'undefined') return false;
    return window.location.hostname.startsWith('manager.');
}

// Helper to get the correct settings route based on current subdomain
export function settingsRoute(
    name: 'profile' | 'password' | 'appearance' | 'profile.update' | 'profile.destroy' | 'password.update',
    params?: Record<string, string | number | boolean> | string | number,
    absolute?: boolean
): string {
    const prefix = isManagerSubdomain() ? 'manager.settings' : 'tenant.settings';
    return routeHelper(`${prefix}.${name}`, params, absolute);
}

// Export type for route names (will be auto-generated)
export type RouteName =
    | 'landing'
    | 'privacy.policy'
    | 'terms.of.use'
    | 'contact.us'
    | 'properties.index'
    | 'tenant.properties.show'
    | 'tenant.properties.images.show'
    | 'tenant.private.storage'
    | 'register'
    | 'login'
    | 'password.request'
    | 'password.email'
    | 'password.reset'
    | 'password.store'
    | 'verification.notice'
    | 'verification.verify'
    | 'verification.send'
    | 'password.confirm'
    | 'logout'
    | 'manager.properties.index'
    | 'profile'
    | 'profile.setup'
    | 'property-manager.store'
    | 'profile.unverified'
    | 'property-manager.edit'
    | 'property-manager.update'
    | 'property-manager.document'
    | 'properties.create'
    | 'properties.store'
    | 'properties.show'
    | 'properties.edit'
    | 'properties.update'
    | 'properties.destroy'
    | 'properties.findByToken'
    | 'properties.generateInviteToken'
    | 'properties.invalidateInviteToken'
    | 'properties.togglePublicAccess'
    | 'properties.regenerateDefaultToken'
    | 'properties.getInviteTokens'
    | 'properties.createCustomToken'
    | 'properties.updateCustomToken'
    | 'properties.deleteCustomToken'
    | 'images.upload'
    | 'images.delete'
    | 'private.storage'
    | 'manager.logout'
    | 'dashboard'
    | 'tenant.profile.edit'
    | 'tenant.profile.update'
    | 'tenant.profile.document'
    | 'applications.create'
    | 'applications.store'
    | 'applications.save-draft'
    | 'applications.show'
    | 'applications.update'
    | 'applications.destroy'
    | 'applications.withdraw'
    | 'manager.settings'
    | 'manager.settings.profile'
    | 'manager.settings.profile.update'
    | 'manager.settings.profile.destroy'
    | 'manager.settings.password'
    | 'manager.settings.password.update'
    | 'manager.settings.appearance'
    | 'tenant.settings'
    | 'tenant.settings.profile'
    | 'tenant.settings.profile.update'
    | 'tenant.settings.profile.destroy'
    | 'tenant.settings.password'
    | 'tenant.settings.password.update'
    | 'tenant.settings.appearance'
    | 'locale.update';
