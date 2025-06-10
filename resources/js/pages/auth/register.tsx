import ***REMOVED*** Head, useForm ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** LoaderCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** FormEventHandler ***REMOVED*** from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Label ***REMOVED*** from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = ***REMOVED***
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
***REMOVED***;

export default function Register() ***REMOVED***
    const ***REMOVED*** data, setData, post, processing, errors, reset ***REMOVED*** = useForm<Required<RegisterForm>>(***REMOVED***
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
***REMOVED***);

    const submit: FormEventHandler = (e) => ***REMOVED***
        e.preventDefault();
        post(route('register'), ***REMOVED***
            onFinish: () => reset('password', 'password_confirmation'),
    ***REMOVED***);
***REMOVED***;

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit=***REMOVED***submit***REMOVED***>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex=***REMOVED***1***REMOVED***
                            autoComplete="name"
                            value=***REMOVED***data.name***REMOVED***
                            onChange=***REMOVED***(e) => setData('name', e.target.value)***REMOVED***
                            disabled=***REMOVED***processing***REMOVED***
                            placeholder="Full name"
                        />
                        <InputError message=***REMOVED***errors.name***REMOVED*** className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex=***REMOVED***2***REMOVED***
                            autoComplete="email"
                            value=***REMOVED***data.email***REMOVED***
                            onChange=***REMOVED***(e) => setData('email', e.target.value)***REMOVED***
                            disabled=***REMOVED***processing***REMOVED***
                            placeholder="email@example.com"
                        />
                        <InputError message=***REMOVED***errors.email***REMOVED*** />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex=***REMOVED***3***REMOVED***
                            autoComplete="new-password"
                            value=***REMOVED***data.password***REMOVED***
                            onChange=***REMOVED***(e) => setData('password', e.target.value)***REMOVED***
                            disabled=***REMOVED***processing***REMOVED***
                            placeholder="Password"
                        />
                        <InputError message=***REMOVED***errors.password***REMOVED*** />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex=***REMOVED***4***REMOVED***
                            autoComplete="new-password"
                            value=***REMOVED***data.password_confirmation***REMOVED***
                            onChange=***REMOVED***(e) => setData('password_confirmation', e.target.value)***REMOVED***
                            disabled=***REMOVED***processing***REMOVED***
                            placeholder="Confirm password"
                        />
                        <InputError message=***REMOVED***errors.password_confirmation***REMOVED*** />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex=***REMOVED***5***REMOVED*** disabled=***REMOVED***processing***REMOVED***>
                        ***REMOVED***processing && <LoaderCircle className="h-4 w-4 animate-spin" />***REMOVED***
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?***REMOVED***' '***REMOVED***
                    <TextLink href=***REMOVED***route('login')***REMOVED*** tabIndex=***REMOVED***6***REMOVED***>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
***REMOVED***
