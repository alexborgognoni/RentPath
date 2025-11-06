import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import UserTypeToggle from '@/components/user-type-toggle';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    // Determine initial user type based on:
    // 1. If redirected from manager subdomain -> property-manager
    // 2. Otherwise use localStorage or default to tenant
    const [userType, setUserType] = useState<'tenant' | 'property-manager'>(() => {
        // Check if there's an intended URL in query params
        const urlParams = new URLSearchParams(window.location.search);
        const intended = urlParams.get('intended');

        // If intended URL contains manager subdomain, default to property-manager
        if (intended) {
            try {
                const intendedUrl = new URL(intended);
                const managerSubdomain = import.meta.env.VITE_MANAGER_SUBDOMAIN || 'manager';
                const baseDomain = import.meta.env.VITE_APP_DOMAIN || window.location.hostname;
                const managerDomain = `${managerSubdomain}.${baseDomain}`;

                if (intendedUrl.hostname === managerDomain) {
                    return 'property-manager';
                }
            } catch (e) {
                // Invalid URL, continue to localStorage check
            }
        }

        // Fall back to localStorage or default to tenant
        const saved = localStorage.getItem('userType');
        return (saved === 'property-manager' ? 'property-manager' : 'tenant') as 'tenant' | 'property-manager';
    });

    // Handle user type change by saving to localStorage
    const handleUserTypeChange = (newType: 'tenant' | 'property-manager') => {
        setUserType(newType);
        localStorage.setItem('userType', newType);
    };

    return (
        <AuthLayout title={t(translations.auth, 'login.title')} description={t(translations.auth, 'login.description')}>
            <Head title={t(translations.auth, 'login.head_title')} />

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6" data={{ userType } as any}>
                {({ processing, errors }) => (
                    <>
                        <UserTypeToggle userType={userType} onUserTypeChange={handleUserTypeChange} />

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t(translations.auth, 'login.email_label')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={t(translations.auth, 'login.email_placeholder')}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">{t(translations.auth, 'login.password_label')}</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            {t(translations.auth, 'login.forgot_password')}
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
                                    placeholder={t(translations.auth, 'login.password_placeholder')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">{t(translations.auth, 'login.remember_me')}</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full cursor-pointer" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {t(translations.auth, 'login.login_button')}
                            </Button>
                        </div>

                        <div className="text-text-secondary text-center text-sm">
                            {t(translations.auth, 'login.no_account')}{' '}
                            <TextLink href={register()} tabIndex={5}>
                                {t(translations.auth, 'login.sign_up_link')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="text-success mb-4 text-center text-sm font-medium">{status}</div>}
        </AuthLayout>
    );
}
