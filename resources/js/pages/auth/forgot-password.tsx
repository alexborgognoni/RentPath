// Components
import ***REMOVED*** Head, useForm ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** LoaderCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** FormEventHandler ***REMOVED*** from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Label ***REMOVED*** from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword(***REMOVED*** status ***REMOVED***: ***REMOVED*** status?: string ***REMOVED***) ***REMOVED***
    const ***REMOVED*** data, setData, post, processing, errors ***REMOVED*** = useForm<Required<***REMOVED*** email: string ***REMOVED***>>(***REMOVED***
        email: '',
***REMOVED***);

    const submit: FormEventHandler = (e) => ***REMOVED***
        e.preventDefault();

        post(route('password.email'));
***REMOVED***;

    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
            <Head title="Forgot password" />

            ***REMOVED***status && <div className="mb-4 text-center text-sm font-medium text-green-600">***REMOVED***status***REMOVED***</div>***REMOVED***

            <div className="space-y-6">
                <form onSubmit=***REMOVED***submit***REMOVED***>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value=***REMOVED***data.email***REMOVED***
                            autoFocus
                            onChange=***REMOVED***(e) => setData('email', e.target.value)***REMOVED***
                            placeholder="email@example.com"
                        />

                        <InputError message=***REMOVED***errors.email***REMOVED*** />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled=***REMOVED***processing***REMOVED***>
                            ***REMOVED***processing && <LoaderCircle className="h-4 w-4 animate-spin" />***REMOVED***
                            Email password reset link
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href=***REMOVED***route('login')***REMOVED***>log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
***REMOVED***
