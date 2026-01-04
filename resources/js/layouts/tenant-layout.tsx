import { BaseLayout } from '@/layouts/base-layout';
import type { PropsWithChildren } from 'react';

/**
 * TenantLayout - Layout for all tenant portal pages
 *
 * Uses BaseLayout which includes AppHeader. The header shows tenant navigation
 * (Applications, Properties, Messages, Profile) when on the tenant portal.
 *
 * This layout provides:
 * - Consistent navigation for tenant portal
 * - Proper content container with max-width
 * - Responsive padding
 */
export function TenantLayout({ children }: PropsWithChildren) {
    return (
        <BaseLayout>
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
            </main>
        </BaseLayout>
    );
}

export default TenantLayout;
