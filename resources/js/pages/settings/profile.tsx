import ***REMOVED*** type BreadcrumbItem, type SharedData ***REMOVED*** from '@/types';
import ***REMOVED*** Transition ***REMOVED*** from '@headlessui/react';
import ***REMOVED*** Head, Link, useForm, usePage ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** FormEventHandler ***REMOVED*** from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Label ***REMOVED*** from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    ***REMOVED***
        title: 'Profile settings',
        href: '/settings/profile',
***REMOVED***,
];

type ProfileForm = ***REMOVED***
    name: string;
    email: string;
***REMOVED***;

export default function Profile(***REMOVED*** mustVerifyEmail, status ***REMOVED***: ***REMOVED*** mustVerifyEmail: boolean; status?: string ***REMOVED***) ***REMOVED***
    const ***REMOVED*** auth ***REMOVED*** = usePage<SharedData>().props;

    const ***REMOVED*** data, setData, patch, errors, processing, recentlySuccessful ***REMOVED*** = useForm<Required<ProfileForm>>(***REMOVED***
        name: auth.user.name,
        email: auth.user.email,
***REMOVED***);

    const submit: FormEventHandler = (e) => ***REMOVED***
        e.preventDefault();

        patch(route('profile.update'), ***REMOVED***
            preserveScroll: true,
    ***REMOVED***);
***REMOVED***;

    return (
        <AppLayout breadcrumbs=***REMOVED***breadcrumbs***REMOVED***>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit=***REMOVED***submit***REMOVED*** className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value=***REMOVED***data.name***REMOVED***
                                onChange=***REMOVED***(e) => setData('name', e.target.value)***REMOVED***
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message=***REMOVED***errors.name***REMOVED*** />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value=***REMOVED***data.email***REMOVED***
                                onChange=***REMOVED***(e) => setData('email', e.target.value)***REMOVED***
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message=***REMOVED***errors.email***REMOVED*** />
                        </div>

                        ***REMOVED***mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.***REMOVED***' '***REMOVED***
                                    <Link
                                        href=***REMOVED***route('verification.send')***REMOVED***
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                ***REMOVED***status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )***REMOVED***
                            </div>
                        )***REMOVED***

                        <div className="flex items-center gap-4">
                            <Button disabled=***REMOVED***processing***REMOVED***>Save</Button>

                            <Transition
                                show=***REMOVED***recentlySuccessful***REMOVED***
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
***REMOVED***
