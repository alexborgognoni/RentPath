import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { Building2, LoaderCircle, User } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const [userType, setUserType] = useState<'tenant' | 'property-manager'>('tenant');

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {/* User Type Toggle */}
                        <div className="relative flex rounded-lg border border-border bg-background p-1">
                            {/* Sliding background */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-gradient-to-r ${userType === 'property-manager' ? 'from-secondary to-primary' : 'from-primary to-secondary'} shadow-sm transition-transform duration-400 ease-in-out ${userType === 'property-manager' ? 'translate-x-[calc(100%)]' : 'translate-x-0'
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() => setUserType('tenant')}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${userType === 'tenant' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <User className="h-4 w-4" />
                                Tenant
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('property-manager')}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${userType === 'property-manager' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <Building2 className="h-4 w-4" />
                                Property Manager
                            </button>
                        </div>

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First name</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="given-name"
                                    name="first_name"
                                    placeholder="First name"
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last name</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="family-name"
                                    name="last_name"
                                    placeholder="Last name"
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name">Middle name (optional)</Label>
                                <Input
                                    id="middle_name"
                                    type="text"
                                    tabIndex={3}
                                    autoComplete="additional-name"
                                    name="middle_name"
                                    placeholder="Middle name"
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={7}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-text-secondary text-center text-sm">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={8}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
