import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { getWayfinderDomain, isManagerSubdomain } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { Transition } from '@headlessui/react';
import { Form, usePage } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { useRef } from 'react';

export default function PasswordContent() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { translations, subdomain, managerSubdomain, appDomain } = usePage<SharedData>().props;

    // Don't render on manager subdomain - settings handled differently there
    if (isManagerSubdomain(subdomain, managerSubdomain)) {
        return null;
    }

    const getPasswordRoute = () => {
        const domain = getWayfinderDomain(subdomain, managerSubdomain, appDomain);
        return `//${domain}/settings/password` as keyof typeof PasswordController.update;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 flex items-center text-3xl font-bold text-foreground">
                    <Lock className="mr-3 text-primary" size={32} />
                    {t(translations.settings, 'password.title')}
                </h1>
                <p className="text-muted-foreground">{t(translations.settings, 'password.description')}</p>
            </div>

            {/* Password Settings */}
            <div className="xs:rounded-2xl xs:border xs:border-border xs:bg-card xs:p-6 xs:shadow-sm">
                <Form
                    {...PasswordController.update[getPasswordRoute()].form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={['password', 'password_confirmation', 'current_password']}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6"
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="current_password" className="text-sm font-medium text-foreground">
                                    {t(translations.settings, 'password.current_password')}
                                </Label>
                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    type="password"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    autoComplete="current-password"
                                    placeholder={t(translations.settings, 'password.current_password_placeholder')}
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    {t(translations.settings, 'password.new_password')}
                                </Label>
                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    type="password"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    autoComplete="new-password"
                                    placeholder={t(translations.settings, 'password.new_password_placeholder')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
                                    {t(translations.settings, 'password.confirm_password')}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    autoComplete="new-password"
                                    placeholder={t(translations.settings, 'password.confirm_password_placeholder')}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {processing
                                        ? t(translations.settings, 'password.updating')
                                        : t(translations.settings, 'password.update_password')}
                                </button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-success text-sm font-medium">{t(translations.settings, 'password.password_updated')}</p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
