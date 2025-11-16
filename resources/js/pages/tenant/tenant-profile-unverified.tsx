import { BaseLayout } from '@/layouts/base-layout';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TenantProfileUnverifiedProps extends SharedData {
    isRejected: boolean;
    rejectionReason?: string;
}

export default function TenantProfileUnverified() {
    const { isRejected, rejectionReason } = usePage<TenantProfileUnverifiedProps>().props;

    return (
        <BaseLayout>
            <Head title="Profile Verification Status" />

            <div className="mx-auto max-w-2xl px-4 py-12">
                <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
                    {isRejected ? (
                        <>
                            <div className="mb-6 flex justify-center">
                                <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                                    <XCircle size={48} className="text-red-600 dark:text-red-400" />
                                </div>
                            </div>

                            <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">Profile Rejected</h1>

                            <p className="mb-6 text-muted-foreground">
                                Your tenant profile was reviewed and requires changes before it can be approved.
                            </p>

                            {rejectionReason && (
                                <div className="mb-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-left">
                                    <p className="mb-2 font-semibold text-red-600 dark:text-red-400">Reason for Rejection:</p>
                                    <p className="text-sm text-red-600 dark:text-red-400">{rejectionReason}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <a
                                    href="/profile/tenant/edit"
                                    className="inline-block w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
                                >
                                    Edit and Resubmit Profile
                                </a>

                                <a
                                    href="/dashboard"
                                    className="inline-block w-full rounded-lg border border-border px-6 py-3 font-medium hover:bg-muted"
                                >
                                    Back to Dashboard
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-6 flex justify-center">
                                <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900/20">
                                    <Clock size={48} className="text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>

                            <h1 className="mb-4 text-2xl font-bold">Profile Under Review</h1>

                            <p className="mb-8 text-muted-foreground">
                                Thank you for submitting your tenant profile! Our team is currently reviewing your information. This usually takes 1-2
                                business days.
                            </p>

                            <div className="mb-8 space-y-4 text-left">
                                <h2 className="font-semibold">What happens next?</h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle size={20} className="text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Profile Submission</p>
                                            <p className="text-sm text-muted-foreground">Your profile has been successfully submitted</p>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <Clock size={20} className="text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Under Review</p>
                                            <p className="text-sm text-muted-foreground">Our team is verifying your documents and information</p>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <AlertCircle size={20} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Notification</p>
                                            <p className="text-sm text-muted-foreground">
                                                You'll receive an email once your profile is verified or if changes are needed
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle size={20} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Start Applying</p>
                                            <p className="text-sm text-muted-foreground">Once verified, you can start applying to properties</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    <strong>Need to make changes?</strong> If you notice any errors in your submission, you can contact support at{' '}
                                    <a href="mailto:support@rentpath.app" className="underline">
                                        support@rentpath.app
                                    </a>
                                </p>
                            </div>

                            <div className="mt-8">
                                <a href="/dashboard" className="inline-block rounded-lg border border-border px-6 py-3 font-medium hover:bg-muted">
                                    Back to Dashboard
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </BaseLayout>
    );
}
