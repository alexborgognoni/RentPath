// Components
import ***REMOVED*** Head, useForm ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** LoaderCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** FormEventHandler ***REMOVED*** from 'react';

import TextLink from '@/components/text-link';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail(***REMOVED*** status ***REMOVED***: ***REMOVED*** status?: string ***REMOVED***) ***REMOVED***
    const ***REMOVED*** post, processing ***REMOVED*** = useForm(***REMOVED******REMOVED***);

    const submit: FormEventHandler = (e) => ***REMOVED***
        e.preventDefault();

        post(route('verification.send'));
***REMOVED***;

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            ***REMOVED***status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )***REMOVED***

            <form onSubmit=***REMOVED***submit***REMOVED*** className="space-y-6 text-center">
                <Button disabled=***REMOVED***processing***REMOVED*** variant="secondary">
                    ***REMOVED***processing && <LoaderCircle className="h-4 w-4 animate-spin" />***REMOVED***
                    Resend verification email
                </Button>

                <TextLink href=***REMOVED***route('logout')***REMOVED*** method="post" className="mx-auto block text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
***REMOVED***
