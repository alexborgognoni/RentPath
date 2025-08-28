import Settings from '@/pages/settings';

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({ mustVerifyEmail, status }: ProfileProps) {
    return <Settings mustVerifyEmail={mustVerifyEmail} status={status} />;
}
