import ***REMOVED*** Head, useForm ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** LoaderCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** FormEventHandler ***REMOVED*** from 'react';

import InputError from '@/components/input-error';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Label ***REMOVED*** from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps ***REMOVED***
    token: string;
    email: string;
***REMOVED***

type ResetPasswordForm = ***REMOVED***
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
***REMOVED***;

export default function ResetPassword(***REMOVED*** token, email ***REMOVED***: ResetPasswordProps) ***REMOVED***
    const ***REMOVED*** data, setData, post, processing, errors, reset ***REMOVED*** = useForm<Required<ResetPasswordForm>>(***REMOVED***
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
***REMOVED***);

    const submit: FormEventHandler = (e) => ***REMOVED***
        e.preventDefault();
        post(route('password.store'), ***REMOVED***
            onFinish: () => reset('password', 'password_confirmation'),
    ***REMOVED***);
***REMOVED***;

    return (
        <AuthLayout title="Reset password" description="Please enter your new password below">
            <Head title="Reset password" />

            <form onSubmit=***REMOVED***submit***REMOVED***>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value=***REMOVED***data.email***REMOVED***
                            className="mt-1 block w-full"
                            readOnly
                            onChange=***REMOVED***(e) => setData('email', e.target.value)***REMOVED***
                        />
                        <InputError message=***REMOVED***errors.email***REMOVED*** className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value=***REMOVED***data.password***REMOVED***
                            className="mt-1 block w-full"
                            autoFocus
                            onChange=***REMOVED***(e) => setData('password', e.target.value)***REMOVED***
                            placeholder="Password"
                        />
                        <InputError message=***REMOVED***errors.password***REMOVED*** />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            value=***REMOVED***data.password_confirmation***REMOVED***
                            className="mt-1 block w-full"
                            onChange=***REMOVED***(e) => setData('password_confirmation', e.target.value)***REMOVED***
                            placeholder="Confirm password"
                        />
                        <InputError message=***REMOVED***errors.password_confirmation***REMOVED*** className="mt-2" />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled=***REMOVED***processing***REMOVED***>
                        ***REMOVED***processing && <LoaderCircle className="h-4 w-4 animate-spin" />***REMOVED***
                        Reset password
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
***REMOVED***
