import { Footer } from '@/components/footer';
import { BaseLayout } from '@/layouts/base-layout';
import type { PropsWithChildren } from 'react';

export function PublicLayout({ children }: PropsWithChildren) {
    return (
        <BaseLayout variant="public">
            <main>{children}</main>
            <Footer />
        </BaseLayout>
    );
}