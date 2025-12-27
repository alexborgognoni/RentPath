import { BaseLayout } from '@/layouts/base-layout';
import type { BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

interface TenantLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

/**
 * TenantLayout - Layout for all tenant portal pages
 *
 * Uses BaseLayout which includes AppHeader. The header is modified to show
 * tenant navigation (Dashboard, Properties, Applications, Messages) when
 * on the tenant portal (non-manager subdomain).
 *
 * This layout provides:
 * - Consistent navigation for tenant portal
 * - Proper content container with max-width
 * - Responsive padding
 */
export function TenantLayout({ children, breadcrumbs, title }: TenantLayoutProps) {
    return (
        <BaseLayout breadcrumbs={breadcrumbs} title={title}>
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
            </main>
        </BaseLayout>
    );
}

export default TenantLayout;
