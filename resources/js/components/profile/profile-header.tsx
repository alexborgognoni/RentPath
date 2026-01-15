import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TenantProfileTranslations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';
import { AlertCircle, CheckCircle, Clock, User } from 'lucide-react';

interface ProfileHeaderProps {
    user: {
        first_name?: string;
        last_name?: string;
        email: string;
    };
    profilePictureUrl?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected' | null;
    rejectionReason?: string;
    translations: TenantProfileTranslations;
    className?: string;
}

export function ProfileHeader({ user, profilePictureUrl, verificationStatus, rejectionReason, translations, className }: ProfileHeaderProps) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || translate(translations, 'header.unnamed_user');

    const statusConfig = {
        verified: {
            icon: CheckCircle,
            label: translate(translations, 'header.status.verified'),
            className: 'bg-green-100 text-green-700 border-green-200',
        },
        pending: {
            icon: Clock,
            label: translate(translations, 'header.status.pending'),
            className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        },
        rejected: {
            icon: AlertCircle,
            label: translate(translations, 'header.status.needs_attention'),
            className: 'bg-red-100 text-red-700 border-red-200',
        },
    };

    const status = verificationStatus ? statusConfig[verificationStatus] : null;

    return (
        <div className={cn('flex items-start gap-4', className)}>
            {/* Avatar */}
            <div className="relative">
                {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt={fullName} className="h-16 w-16 rounded-full object-cover ring-2 ring-border" />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted ring-2 ring-border">
                        <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{fullName}</h1>
                    {status && (
                        <Badge variant="outline" className={cn('gap-1', status.className)}>
                            <status.icon className="h-3 w-3" />
                            {status.label}
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>

                {/* Rejection reason */}
                {verificationStatus === 'rejected' && rejectionReason && (
                    <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        <strong>{translate(translations, 'header.rejection_reason')}</strong> {rejectionReason}
                    </div>
                )}
            </div>
        </div>
    );
}
