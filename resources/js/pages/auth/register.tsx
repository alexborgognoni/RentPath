import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserTypeToggle from '@/components/user-type-toggle';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';

export default function Register() {
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
            } catch {
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
        <AuthLayout title={t(translations.auth, 'register.title')} description={t(translations.auth, 'register.description')}>
            <Head title={t(translations.auth, 'register.head_title')} />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
                data={{ userType }}
            >
                {({ processing, errors }) => (
                    <>
                        <UserTypeToggle userType={userType} onUserTypeChange={handleUserTypeChange} />

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">{t(translations.auth, 'register.first_name_label')}</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="given-name"
                                    name="first_name"
                                    placeholder={t(translations.auth, 'register.first_name_placeholder')}
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">{t(translations.auth, 'register.last_name_label')}</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="family-name"
                                    name="last_name"
                                    placeholder={t(translations.auth, 'register.last_name_placeholder')}
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{t(translations.auth, 'register.email_label')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={t(translations.auth, 'register.email_placeholder')}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t(translations.auth, 'register.password_label')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={t(translations.auth, 'register.password_placeholder')}
                                />
                                <input
                                    type="password"
                                    name="fake_password_remembered"
                                    autoComplete="new-password"
                                    // className="absolute opacity-0 h-0 w-0 border-0 p-0 m-0"
                                    className="pointer-events-none absolute opacity-0"
                                    readOnly
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t(translations.auth, 'register.password_confirmation_label')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={t(translations.auth, 'register.password_confirmation_placeholder')}
                                />
                                <input
                                    type="password"
                                    name="fake_password_confirmation"
                                    autoComplete="new-password"
                                    // className="absolute opacity-0 h-0 w-0 border-0 p-0 m-0"
                                    className="pointer-events-none absolute opacity-0"
                                    readOnly
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full cursor-pointer" tabIndex={6}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {t(translations.auth, 'register.create_account_button')}
                            </Button>
                        </div>

                        <div className="text-text-secondary text-center text-sm">
                            {t(translations.auth, 'register.already_have_account')}{' '}
                            <TextLink href={login()} tabIndex={7}>
                                {t(translations.auth, 'register.log_in_link')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
