import { AppHeader } from '@/components/app-header';
import { translate as t } from '@/utils/translate-utils';
import { ArrowRight, FileText, Home, Users } from 'lucide-react';

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-background dark:bg-background">
            <AppHeader />

            {/* Hero Section */}
            <section className="relative py-24 lg:py-32">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 blur-3xl dark:from-secondary/20 dark:to-primary/20" />
                    <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl dark:from-primary/20 dark:to-secondary/20" />
                    <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-secondary/5 to-primary/5 blur-3xl dark:from-secondary/10 dark:to-primary/10" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-text-primary dark:text-text-primary mb-8 text-5xl leading-tight font-bold lg:text-7xl">
                        {t('landingTitle')}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {' '}
                            {t('rentalPropertiesWorkflow')}
                        </span>
                        <br />
                        {t('singleAutomatedWorkflow')}
                    </h1>
                    <p className="text-text-secondary dark:text-text-secondary mx-auto mb-12 max-w-3xl text-xl lg:text-2xl">{t('landingSubtitle')}</p>
                    <div className="flex flex-col justify-center gap-6 sm:flex-row">
                        <a
                            href="/register"
                            className="text-text-primary rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold shadow-lg transition-all hover:scale-105"
                        >
                            {t('getStarted')}
                        </a>
                        <a
                            href="#features"
                            className="text-text-primary dark:text-text-primary hover:bg-surface dark:hover:bg-surface rounded-lg border border-border px-8 py-4 text-lg font-semibold transition-all dark:border-border"
                        >
                            {t('learnMore')}
                        </a>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="border-b border-border py-16 dark:border-border">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-text-secondary dark:text-text-secondary mb-8 text-sm">{t('trustedBy')}</p>
                    <div className="flex items-center justify-center space-x-12 opacity-50">
                        <div className="text-text-secondary dark:text-text-secondary text-lg font-bold">PropertyCorp</div>
                        <div className="text-text-secondary dark:text-text-secondary text-lg font-bold">RealEstate Plus</div>
                        <div className="text-text-secondary dark:text-text-secondary text-lg font-bold">HomeTech</div>
                        <div className="text-text-secondary dark:text-text-secondary text-lg font-bold">PropManage</div>
                    </div>
                </div>
            </section>

            {/* Features / Cards Section */}
            <section id="features" className="bg-background py-24 dark:bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-20 text-center">
                        <h2 className="text-text-primary dark:text-text-primary mb-6 text-4xl font-bold lg:text-5xl">{t('everythingYouNeed')}</h2>
                        <p className="text-text-secondary dark:text-text-secondary mx-auto max-w-3xl text-xl">{t('featuresSubtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="group bg-surface dark:bg-surface rounded-2xl border border-border p-8 transition-all hover:scale-105 hover:border-primary/50 dark:border-border">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary shadow-lg">
                                <Home className="text-text-primary h-8 w-8" />
                            </div>
                            <h3 className="text-text-primary dark:text-text-primary mb-4 text-center text-2xl font-bold">
                                {t('propertyManagement')}
                            </h3>
                            <p className="text-text-secondary dark:text-text-secondary text-center leading-relaxed">{t('propertyManagementDesc')}</p>
                        </div>

                        <div className="group bg-surface dark:bg-surface rounded-2xl border border-border p-8 transition-all hover:scale-105 hover:border-secondary/50 dark:border-border">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-secondary to-secondary shadow-lg">
                                <Users className="text-text-primary h-8 w-8" />
                            </div>
                            <h3 className="text-text-primary dark:text-text-primary mb-4 text-center text-2xl font-bold">
                                {t('tenantApplicationsFeature')}
                            </h3>
                            <p className="text-text-secondary dark:text-text-secondary text-center leading-relaxed">{t('tenantApplicationsDesc')}</p>
                        </div>

                        <div className="group bg-surface dark:bg-surface rounded-2xl border border-border p-8 transition-all hover:scale-105 hover:border-primary/50 dark:border-border">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary shadow-lg">
                                <FileText className="text-text-primary h-8 w-8" />
                            </div>
                            <h3 className="text-text-primary dark:text-text-primary mb-4 text-center text-2xl font-bold">
                                {t('documentManagement')}
                            </h3>
                            <p className="text-text-secondary dark:text-text-secondary text-center leading-relaxed">{t('documentManagementDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-surface py-24 text-center">
                <h2 className="text-text-primary mb-6 text-4xl font-bold lg:text-5xl">{t('readyToTransform')}</h2>
                <p className="text-text-secondary mx-auto mb-10 max-w-3xl text-xl">{t('ctaSubtitle')}</p>
                <a
                    href="/register"
                    className="text-text-primary inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-10 py-4 text-lg font-bold shadow-lg transition-all hover:scale-105 hover:from-primary hover:to-secondary"
                >
                    {t('startYourFreeTrial')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </a>
            </section>

            {/* Footer */}
            <footer className="bg-surface border-t border-border py-16 dark:border-border">
                <div className="text-text-secondary mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <h3 className="text-text-primary mb-4 text-xl font-bold">RentPath</h3>
                            <p className="leading-relaxed">{t('footerDescription')}</p>
                        </div>
                        <div>
                            <h3 className="text-text-primary mb-4 font-bold">{t('product')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#features" className="hover:text-primary">
                                        {t('features')}
                                    </a>
                                </li>
                                <li>
                                    <a href="/register" className="hover:text-primary">
                                        {t('pricing')}
                                    </a>
                                </li>
                                <li>
                                    <a href="/register" className="hover:text-primary">
                                        {t('freeTrial')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-text-primary mb-4 font-bold">{t('support')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        {t('helpCenter')}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        {t('contactUs')}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        {t('privacyPolicy')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-border pt-8 text-center">
                        <p>&copy; 2025 RentPath. {t('allRightsReserved')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
