import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Building2, LoaderCircle, User } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [userType, setUserType] = useState<'tenant' | 'property-manager'>('tenant');

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        {/* User Type Toggle */}
                        <div className="relative flex rounded-lg border border-border bg-background p-1">
                            {/* Sliding background */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-gradient-to-r ${userType === 'property-manager' ? 'from-secondary to-primary' : 'from-primary to-secondary'} shadow-sm transition-transform duration-400 ease-in-out ${
                                    userType === 'property-manager' ? 'translate-x-[calc(100%)]' : 'translate-x-0'
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setUserType('tenant')}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                                    userType === 'tenant' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <User className="h-4 w-4" />
                                Tenant
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('property-manager')}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                                    userType === 'property-manager' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <Building2 className="h-4 w-4" />
                                Property Manager
                            </button>
                        </div>

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-text-secondary text-center text-sm">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="text-success mb-4 text-center text-sm font-medium">{status}</div>}
        </AuthLayout>
    );
}
