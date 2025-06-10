import ***REMOVED*** Head, useForm ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** LoaderCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** FormEventHandler ***REMOVED*** from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Checkbox ***REMOVED*** from '@/components/ui/checkbox';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Label ***REMOVED*** from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = ***REMOVED***
    email: string;
    password: string;
    remember: boolean;
***REMOVED***;

interface LoginProps ***REMOVED***
    status?: string;
    canResetPassword: boolean;
***REMOVED***

export default function Login(***REMOVED*** status, canResetPassword ***REMOVED***: LoginProps) ***REMOVED***
    const ***REMOVED*** data, setData, post, processing, errors, reset ***REMOVED*** = useForm<Required<LoginForm>>(***REMOVED***
        email: '',
        password: '',
        remember: false,
***REMOVED***);

    const submit: FormEventHandler = (e) => ***REMOVED***
        e.preventDefault();
        post(route('login'), ***REMOVED***
            onFinish: () => reset('password'),
    ***REMOVED***);
***REMOVED***;

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit=***REMOVED***submit***REMOVED***>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex=***REMOVED***1***REMOVED***
                            autoComplete="email"
                            value=***REMOVED***data.email***REMOVED***
                            onChange=***REMOVED***(e) => setData('email', e.target.value)***REMOVED***
                            placeholder="email@example.com"
                        />
                        <InputError message=***REMOVED***errors.email***REMOVED*** />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            ***REMOVED***canResetPassword && (
                                <TextLink href=***REMOVED***route('password.request')***REMOVED*** className="ml-auto text-sm" tabIndex=***REMOVED***5***REMOVED***>
                                    Forgot password?
                                </TextLink>
                            )***REMOVED***
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex=***REMOVED***2***REMOVED***
                            autoComplete="current-password"
                            value=***REMOVED***data.password***REMOVED***
                            onChange=***REMOVED***(e) => setData('password', e.target.value)***REMOVED***
                            placeholder="Password"
                        />
                        <InputError message=***REMOVED***errors.password***REMOVED*** />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked=***REMOVED***data.remember***REMOVED***
                            onClick=***REMOVED***() => setData('remember', !data.remember)***REMOVED***
                            tabIndex=***REMOVED***3***REMOVED***
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex=***REMOVED***4***REMOVED*** disabled=***REMOVED***processing***REMOVED***>
                        ***REMOVED***processing && <LoaderCircle className="h-4 w-4 animate-spin" />***REMOVED***
                        Log in
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?***REMOVED***' '***REMOVED***
                    <TextLink href=***REMOVED***route('register')***REMOVED*** tabIndex=***REMOVED***5***REMOVED***>
                        Sign up
                    </TextLink>
                </div>
            </form>

            ***REMOVED***status && <div className="mb-4 text-center text-sm font-medium text-green-600">***REMOVED***status***REMOVED***</div>***REMOVED***
        </AuthLayout>
    );
***REMOVED***
