import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { Building2, LoaderCircle, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';

export default function Register() {
    // const [userType, setUserType] = useState<'tenant' | 'property-manager'>('tenant');
    const page = usePage<SharedData>();
    const { translations } = page.props;

    return (
        <AuthLayout title={t(translations.auth, 'register.title')} description={t(translations.auth, 'register.description')}>
            <Head title={t(translations.auth, 'register.head_title')} />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {/* User Type Toggle */}
                        {/* <div className="relative flex rounded-lg border border-border bg-background p-1"> */}
                            {/* Sliding background */}
                        {/*     <div */}
                        {/*         className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-gradient-to-r ${userType === 'property-manager' ? 'from-secondary to-primary' : 'from-primary to-secondary'} shadow-sm transition-transform duration-400 ease-in-out ${userType === 'property-manager' ? 'translate-x-[calc(100%)]' : 'translate-x-0' */}
                        {/*             }`} */}
                        {/*     /> */}
                        {/**/}
                        {/*     <button */}
                        {/*         type="button" */}
                        {/*         onClick={() => setUserType('tenant')} */}
                        {/*         className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${userType === 'tenant' ? 'text-white' : 'text-text-secondary hover:text-text-primary' */}
                        {/*             }`} */}
                        {/*     > */}
                        {/*         <User className="h-4 w-4" /> */}
                        {/*         {t(translations.auth, 'user_types.tenant')} */}
                        {/*     </button> */}
                        {/*     <button */}
                        {/*         type="button" */}
                        {/*         onClick={() => setUserType('property-manager')} */}
                        {/*         className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${userType === 'property-manager' ? 'text-white' : 'text-text-secondary hover:text-text-primary' */}
                        {/*             }`} */}
                        {/*     > */}
                        {/*         <Building2 className="h-4 w-4" /> */}
                        {/*         {t(translations.auth, 'user_types.property_manager')} */}
                        {/*     </button> */}
                        {/* </div> */}

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
                                    className="absolute opacity-0 pointer-events-none"
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
                                    className="absolute opacity-0 pointer-events-none"
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
