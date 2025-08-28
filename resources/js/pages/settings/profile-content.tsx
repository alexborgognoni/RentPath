import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Link, usePage } from '@inertiajs/react';
import { User, Trash2 } from 'lucide-react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileContentProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function ProfileContent({ mustVerifyEmail, status }: ProfileContentProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 flex items-center text-3xl font-bold text-foreground">
                    <User className="mr-3 text-primary" size={32} />
                    Profile
                </h1>
                <p className="text-muted-foreground">Manage your account information and public profile</p>
            </div>

            {/* Personal Information Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Personal Information</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    Update your personal details and profile information.
                </p>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Enter your email address"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-lg border border-warning/20 bg-warning/10 p-4">
                                    <p className="text-sm text-warning">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="font-medium underline hover:no-underline"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-success">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4">
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm font-medium text-success">Saved successfully</p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* Delete Account Card */}
            <div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-destructive">
                    <Trash2 className="mr-3" size={24} />
                    Delete Account
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                </p>

                <button className="rounded-xl border border-destructive bg-destructive/10 px-6 py-3 font-medium text-destructive transition-all hover:bg-destructive/20 cursor-pointer">
                    Delete Account
                </button>
            </div>
        </div>
    );
}