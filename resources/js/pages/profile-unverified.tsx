import { AppHeader } from '@/components/app-header';
import { ParallaxBackground } from '@/components/parallax-background';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Clock, RefreshCw, Shield, XCircle } from 'lucide-react';

interface ProfileUnverifiedProps {
    isRejected?: boolean;
    rejectionReason?: string;
}

export default function ProfileUnverified({ isRejected = false, rejectionReason }: ProfileUnverifiedProps) {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background lg:h-screen lg:overflow-hidden">
            <div className="absolute inset-0 min-h-full w-full lg:h-screen">
                <ParallaxBackground />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen lg:h-full">
                <AppHeader />
                <Head title="Profile Under Review" />

                <div className="flex-1 flex items-center justify-center p-4 py-8 lg:py-4">
                <div className="mx-auto max-w-md px-6 text-center">
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                        {isRejected ? (
                            <>
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                    <XCircle className="h-8 w-8 text-destructive" />
                                </div>

                                <h1 className="mb-4 text-2xl font-bold text-foreground">Profile Needs Updates</h1>

                                <p className="mb-6 text-muted-foreground">
                                    Your profile submission requires some updates. Please review the feedback below and resubmit.
                                </p>

                                {rejectionReason && (
                                    <div className="mb-6 rounded-lg border-l-4 border-destructive bg-destructive/10 p-4 text-left">
                                        <h3 className="mb-2 font-semibold text-foreground">Review Feedback:</h3>
                                        <p className="text-sm text-foreground">{rejectionReason}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                    <Clock className="text-primary h-8 w-8" />
                                </div>

                                <h1 className="mb-2 text-3xl font-bold text-foreground">Profile Under Review</h1>

                                <p className="mb-6 text-muted-foreground">
                                    Thank you for submitting your property manager profile. Our team is currently reviewing your information and
                                    documents.
                                </p>
                            </>
                        )}

                        <div className="mb-6 space-y-3 text-left">
                            <div className="flex items-start space-x-3 rounded-lg bg-muted/50 p-3">
                                <Shield className="mt-0.5 h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Identity Verification</h3>
                                    <p className="text-sm text-muted-foreground">We're verifying your identity documents</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 rounded-lg bg-muted/50 p-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 text-secondary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">License Review</h3>
                                    <p className="text-sm text-muted-foreground">Checking your professional credentials</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 rounded-lg border-l-4 border-primary bg-primary/10 p-4">
                            <p className="text-sm text-foreground">
                                <strong>Review Time:</strong> Typically 1-2 business days
                            </p>
                        </div>

                        <div className="space-y-3">
                            {isRejected ? (
                                <Link
                                    href="/profile/unverified?edit=true"
                                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 font-semibold text-white transition-all hover:scale-105"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Update & Resubmit Profile
                                </Link>
                            ) : (
                                <Link
                                    href="/profile/unverified?edit=true"
                                    className="block w-full rounded-lg border border-border bg-background px-4 py-2 font-semibold text-foreground transition-colors hover:bg-muted"
                                >
                                    Edit Profile Information
                                </Link>
                            )}

                            <Link
                                href="/"
                                className="block w-full rounded-lg border border-border bg-background px-4 py-2 font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
