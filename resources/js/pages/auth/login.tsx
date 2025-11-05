import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, usePage, router } from '@inertiajs/react';
import { LoaderCircle, Building2, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    // Determine initial user type from localStorage or default to tenant
    const [userType, setUserType] = useState<'tenant' | 'property-manager'>(() => {
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
                        {/* User Type Toggle */}
                        <div className="relative flex rounded-lg border border-border bg-background p-1">
                            {/* Sliding background */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-gradient-to-r ${userType === 'property-manager' ? 'from-secondary to-primary' : 'from-primary to-secondary'} shadow-sm transition-transform duration-400 ease-in-out ${
                                    userType === 'property-manager' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => handleUserTypeChange('tenant')}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                                    userType === 'tenant' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <User className="h-4 w-4" />
                                {t(translations.auth, 'user_types.tenant')}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUserTypeChange('property-manager')}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                                    userType === 'property-manager' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <Building2 className="h-4 w-4" />
                                {t(translations.auth, 'user_types.property_manager')}
                            </button>
                        </div>

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
