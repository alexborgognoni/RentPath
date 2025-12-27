import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface ZiggyConfig {
    url: string;
    port?: number;
    defaults?: Record<string, unknown>;
    routes: Record<string, { uri: string; methods: string[]; domain?: string; parameters?: string[] }>;
    location?: string;
}

// Re-export route function that uses Ziggy config from page props
function routeHelper(name: string, params?: Record<string, string | number | boolean> | string | number, absolute?: boolean): string {
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

    return (name: string, params?: Record<string, string | number | boolean> | string | number, absolute?: boolean): string => {
        if (!ziggy) {
            console.warn('Ziggy config not found in page props');
            return `/${name}`;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return route(name, params as any, absolute, ziggy as any) as unknown as string;
    };
}

export { routeHelper as route };

/**
 * Check if we're on the manager subdomain
 * @param subdomain - Current subdomain from Inertia props (props.subdomain)
 * @param managerSubdomain - Manager subdomain prefix from Inertia props (props.managerSubdomain)
 */
export function isManagerSubdomain(subdomain: string | null, managerSubdomain: string): boolean {
    return subdomain === managerSubdomain;
}

/**
 * Build a full URL from components (all from backend config via Inertia props)
 * @param scheme - http or https (from props.appUrlScheme) - for URL generation only
 * @param domain - base domain (from props.appDomain)
 * @param port - optional port (from props.appPort)
 */
export function buildUrl(scheme: string, domain: string, port: string | null): string {
    const portSuffix = port ? `:${port}` : '';
    return `${scheme}://${domain}${portSuffix}`;
}

/**
 * Get the root domain URL (without subdomain) - for navigation/links
 * Uses backend config values for consistency across environments
 */
export function getRootDomainUrl(appUrlScheme: string, appDomain: string, appPort: string | null): string {
    return buildUrl(appUrlScheme, appDomain, appPort);
}

/**
 * Get domain string for Wayfinder key lookup (never includes port)
 * Wayfinder generates keys without ports, so lookups must match
 * @param subdomain - Current subdomain from Inertia props
 * @param managerSubdomain - Manager subdomain prefix from Inertia props
 * @param appDomain - Base domain from Inertia props
 */
export function getWayfinderDomain(subdomain: string | null, managerSubdomain: string, appDomain: string): string {
    return isManagerSubdomain(subdomain, managerSubdomain) ? `${managerSubdomain}.${appDomain}` : appDomain;
}

/**
 * Get the correct settings route based on current subdomain
 * @param name - Settings route name
 * @param subdomain - Current subdomain from Inertia props
 * @param managerSubdomain - Manager subdomain prefix from Inertia props
 * @param params - Route parameters
 * @param absolute - Whether to return absolute URL
 */
export function settingsRoute(
    name: 'profile' | 'password' | 'appearance' | 'profile.update' | 'profile.destroy' | 'password.update',
    subdomain: string | null,
    managerSubdomain: string,
    params?: Record<string, string | number | boolean> | string | number,
    absolute?: boolean,
): string {
    const prefix = isManagerSubdomain(subdomain, managerSubdomain) ? `${managerSubdomain}.settings` : 'tenant.settings';
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
    | 'tenant.profile.show'
    | 'tenant.profile.edit'
    | 'tenant.profile.update'
    | 'tenant.profile.document'
    | 'applications.index'
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
