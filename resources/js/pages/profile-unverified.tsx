import { BaseLayout } from '@/layouts/base-layout';
import { type SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, Clock, RefreshCw, Shield, XCircle } from 'lucide-react';

interface ProfileUnverifiedProps {
    isRejected?: boolean;
    rejectionReason?: string;
}

export default function ProfileUnverified({ isRejected = false, rejectionReason }: ProfileUnverifiedProps) {
    const { translations } = usePage<SharedData>().props;

    return (
        <BaseLayout>
            <Head title={isRejected ? t(translations.profile, 'unverified.rejected_title') : t(translations.profile, 'unverified.title')} />
            <div className="flex flex-1 items-center justify-center p-4 py-8 lg:py-4">
                <div className="mx-auto max-w-md px-6 text-center">
                    <div className="xs:rounded-2xl xs:border xs:border-border xs:bg-card xs:p-8 xs:shadow-lg">
                        {isRejected ? (
                            <>
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                    <XCircle className="h-8 w-8 text-destructive" />
                                </div>

                                <h1 className="mb-4 text-2xl font-bold text-foreground">{t(translations.profile, 'unverified.rejected_title')}</h1>

                                <p className="mb-6 text-muted-foreground">{t(translations.profile, 'unverified.rejected_description')}</p>

                                {rejectionReason && (
                                    <div className="mb-6 rounded-lg border-l-4 border-destructive bg-destructive/10 p-4 text-left">
                                        <h3 className="mb-2 font-semibold text-foreground">
                                            {t(translations.profile, 'unverified.review_feedback')}
                                        </h3>
                                        <p className="text-sm text-foreground">{rejectionReason}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Clock className="h-8 w-8 text-primary" />
                                </div>

                                <h1 className="mb-2 text-3xl font-bold text-foreground">{t(translations.profile, 'unverified.title')}</h1>

                                <p className="mb-6 text-muted-foreground">{t(translations.profile, 'unverified.thank_you_message')}</p>
                            </>
                        )}

                        <div className="mb-6 space-y-3 text-left">
                            <div className="flex items-start space-x-3 rounded-lg bg-muted/50 p-3">
                                <Shield className="mt-0.5 h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">{t(translations.profile, 'unverified.identity_verification')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(translations.profile, 'unverified.identity_verification_desc')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 rounded-lg bg-muted/50 p-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 text-secondary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">{t(translations.profile, 'unverified.license_review')}</h3>
                                    <p className="text-sm text-muted-foreground">{t(translations.profile, 'unverified.license_review_desc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 rounded-lg border-l-4 border-primary bg-primary/10 p-4">
                            <p className="text-sm text-foreground">
                                <strong>{t(translations.profile, 'unverified.review_time')}</strong>{' '}
                                {t(translations.profile, 'unverified.review_time_desc')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {isRejected ? (
                                <Link
                                    href={route('profile.unverified', { edit: 'true' })}
                                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 font-semibold text-white transition-all hover:scale-105"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    {t(translations.profile, 'unverified.update_resubmit')}
                                </Link>
                            ) : (
                                <Link
                                    href={route('profile.unverified', { edit: 'true' })}
                                    className="block w-full rounded-lg border border-border bg-background px-4 py-2 font-semibold text-foreground transition-colors hover:bg-muted"
                                >
                                    {t(translations.profile, 'unverified.edit_profile_info')}
                                </Link>
                            )}

                            <Link
                                href="/"
                                className="block w-full rounded-lg border border-border bg-background px-4 py-2 font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                                {t(translations.profile, 'unverified.return_home')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
}
