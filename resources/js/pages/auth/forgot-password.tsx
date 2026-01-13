// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { TextLink } from '@/components/ui/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';

export default function ForgotPassword({ status }: { status?: string }) {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    return (
        <AuthLayout title={t(translations.auth.forgotPassword, 'title')} description={t(translations.auth.forgotPassword, 'description')}>
            <Head title={t(translations.auth.forgotPassword, 'headTitle')} />

            {status && <div className="mb-4 text-center text-sm font-medium text-success">{status}</div>}

            <div className="space-y-6">
                <Form {...PasswordResetLinkController.store.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t(translations.auth.forgotPassword, 'emailLabel')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder={t(translations.auth.forgotPassword, 'emailPlaceholder')}
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button className="w-full cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {t(translations.auth.forgotPassword, 'sendResetLinkButton')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>{t(translations.auth.forgotPassword, 'returnToLoginText')}</span>
                    <TextLink href={login()}>{t(translations.auth.forgotPassword, 'returnToLoginLink')}</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
