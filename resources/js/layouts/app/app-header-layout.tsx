import { AppContent } from '@/components/app-content';
import { BaseLayout } from '@/layouts/base-layout';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs, title }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; title?: string }>) {
    return (
        <BaseLayout breadcrumbs={breadcrumbs} title={title}>
            <AppContent>{children}</AppContent>
        </BaseLayout>
    );
}
