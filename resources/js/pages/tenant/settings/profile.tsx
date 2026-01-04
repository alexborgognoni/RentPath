import { TenantLayout } from '@/layouts/tenant-layout';
import Settings from '@/pages/settings';

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({ mustVerifyEmail, status }: ProfileProps) {
    return (
        <TenantLayout>
            <Settings mustVerifyEmail={mustVerifyEmail} status={status} />
        </TenantLayout>
    );
}
