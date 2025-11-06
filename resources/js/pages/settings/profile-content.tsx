import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { Transition } from '@headlessui/react';
import { Form, Link, usePage } from '@inertiajs/react';
import { User, Trash2 } from 'lucide-react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';

interface ProfileContentProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function ProfileContent({ mustVerifyEmail, status }: ProfileContentProps) {
    const { auth, translations } = usePage<SharedData>().props;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 flex items-center text-3xl font-bold text-foreground">
                    <User className="mr-3 text-primary" size={32} />
                    {t(translations.settings, 'account.title')}
                </h1>
                <p className="text-muted-foreground">{t(translations.settings, 'account.description')}</p>
            </div>

            {/* Email Address Card */}
            <div className="xs:rounded-2xl xs:border xs:border-border xs:bg-card xs:p-6 xs:shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-foreground">{t(translations.settings, 'account.email_address')}</h2>

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
                                <Input
                                    id="email"
                                    type="email"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder={t(translations.settings, 'account.email_placeholder')}
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-lg border border-warning/20 bg-warning/10 p-4">
                                    <p className="text-sm text-warning">
                                        {t(translations.settings, 'account.email_unverified')}{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="font-medium underline hover:no-underline"
                                        >
                                            {t(translations.settings, 'account.resend_verification')}
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-success">
                                            {t(translations.settings, 'account.verification_sent')}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {processing ? t(translations.settings, 'account.saving') : t(translations.settings, 'account.save_changes')}
                                </button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm font-medium text-success">{t(translations.settings, 'account.saved_successfully')}</p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* Delete Account Card */}
            <div className="xs:rounded-2xl xs:border xs:border-destructive/20 xs:bg-card xs:p-6 xs:shadow-sm">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-destructive">
                    <Trash2 className="mr-3" size={24} />
                    {t(translations.settings, 'account.delete_account')}
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    {t(translations.settings, 'account.delete_account_description')}
                </p>

                <button className="rounded-xl border border-destructive bg-destructive/10 px-6 py-3 font-medium text-destructive transition-all hover:bg-destructive/20 cursor-pointer">
                    {t(translations.settings, 'account.delete_account_button')}
                </button>
            </div>
        </div>
    );
}