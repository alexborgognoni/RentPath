import { translate as t } from '@/utils/translate-utils';
import { Home } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-surface py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <div className="mb-4 flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary">
                                <Home className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">RentPath</span>
                        </div>
                        <p className="max-w-md leading-relaxed text-muted-foreground">
                            Streamline your tenant application process from first contact to move-in. Say goodbye to incomplete applications, missing documents, and communication chaos.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-bold text-foreground">{t('product')}</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <a
                                    href="#features"
                                    className="transition-colors hover:text-primary"
                                >
                                    {t('features')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/register"
                                    className="transition-colors hover:text-primary"
                                >
                                    {t('pricing')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/register"
                                    className="transition-colors hover:text-primary"
                                >
                                    {t('freeTrial')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-bold text-foreground">{t('support')}</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <a href="/contact-us" className="transition-colors hover:text-primary">
                                    {t('contactUs')}
                                </a>
                            </li>
                            <li>
                                <a href="/privacy-policy" className="transition-colors hover:text-primary">
                                    {t('privacyPolicy')}
                                </a>
                            </li>
                            <li>
                                <a href="/terms-of-use" className="transition-colors hover:text-primary">
                                    Terms of Use
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8 text-center text-muted-foreground">
                    <p>&copy; 2025 RentPath. {t('allRightsReserved')}</p>
                </div>
            </div>
        </footer>
    );
}
