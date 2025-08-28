import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs, title }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; title?: string }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} title={title} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
