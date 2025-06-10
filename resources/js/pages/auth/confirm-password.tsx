// Components
import ***REMOVED*** Head, useForm ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** LoaderCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** FormEventHandler ***REMOVED*** from 'react';

import InputError from '@/components/input-error';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Label ***REMOVED*** from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() ***REMOVED***
    const ***REMOVED*** data, setData, post, processing, errors, reset ***REMOVED*** = useForm<Required<***REMOVED*** password: string ***REMOVED***>>(***REMOVED***
        password: '',
***REMOVED***);

    const submit: FormEventHandler = (e) => ***REMOVED***
        e.preventDefault();

        post(route('password.confirm'), ***REMOVED***
            onFinish: () => reset('password'),
    ***REMOVED***);
***REMOVED***;

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <form onSubmit=***REMOVED***submit***REMOVED***>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value=***REMOVED***data.password***REMOVED***
                            autoFocus
                            onChange=***REMOVED***(e) => setData('password', e.target.value)***REMOVED***
                        />

                        <InputError message=***REMOVED***errors.password***REMOVED*** />
                    </div>

                    <div className="flex items-center">
                        <Button className="w-full" disabled=***REMOVED***processing***REMOVED***>
                            ***REMOVED***processing && <LoaderCircle className="h-4 w-4 animate-spin" />***REMOVED***
                            Confirm password
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
***REMOVED***
