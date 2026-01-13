import { PublicLayout } from '@/layouts/public-layout';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';

export default function TermsOfUse() {
    const page = usePage<SharedData>();
    const { translations } = page.props;
    const t = (key: string) => translate(translations.public.termsOfUse, key);

    // Company information constants
    const COMPANY_INFO = {
        name: 'RentPath',
        legalName: 'RentPath S.à r.l.',
        address: '4, rue de Drusenheim',
        city: 'L-3884 Schifflange',
        country: 'Luxembourg',
        email: 'contact@rentpath.app',
    };

    // Links constants
    const LINKS = {
        privacyPolicy: '/privacy-policy',
    };
    return (
        <PublicLayout>
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-neutral dark:prose-invert mx-auto max-w-none">
                    <h1 className="mb-4 text-4xl font-bold text-foreground">{t('pageTitle')}</h1>
                    <p className="mb-8 text-sm text-muted-foreground">{t('lastUpdated')}</p>

                    <div className="space-y-8 text-foreground">
                        <section>
                            <p className="text-lg leading-relaxed">{t('introduction')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.whoWeAre.title')}</h2>
                            <p>{t('sections.whoWeAre.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.eligibility.title')}</h2>
                            <p>{t('sections.eligibility.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.accounts.title')}</h2>
                            <ul className="space-y-3">
                                {(translations.public.termsOfUse?.sections?.accounts?.items || []).map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.servicesProvided.title')}</h2>
                            <p className="mb-4">{t('sections.servicesProvided.intro')}</p>
                            <p>{t('sections.servicesProvided.note')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.acceptableUse.title')}</h2>
                            <p className="mb-4">{t('sections.acceptableUse.intro')}</p>
                            <ul className="space-y-3">
                                {(translations.public.termsOfUse?.sections?.acceptableUse?.items || []).map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4">{t('sections.acceptableUse.note')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.payments.title')}</h2>
                            <p className="mb-4">{t('sections.payments.intro')}</p>
                            <ul className="space-y-3">
                                {(translations.public.termsOfUse?.sections?.payments?.items || []).map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.intellectualProperty.title')}</h2>
                            <p>{t('sections.intellectualProperty.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.dataPrivacy.title')}</h2>
                            <p>
                                {t('sections.dataPrivacy.content')}{' '}
                                <a href={LINKS.privacyPolicy} className="text-primary hover:underline">
                                    {t('sections.dataPrivacy.linkText')}
                                </a>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.disclaimerWarranties.title')}</h2>
                            <p>{t('sections.disclaimerWarranties.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.limitationLiability.title')}</h2>
                            <p className="mb-4">{t('sections.limitationLiability.intro')}</p>
                            <ul className="space-y-3">
                                {(translations.public.termsOfUse?.sections?.limitationLiability?.items || []).map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.termination.title')}</h2>
                            <p>{t('sections.termination.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.changesTerms.title')}</h2>
                            <p>{t('sections.changesTerms.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.governingLaw.title')}</h2>
                            <p>{t('sections.governingLaw.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.contactUs.title')}</h2>
                            <p className="mb-4">{t('sections.contactUs.intro')}</p>
                            <div className="rounded-lg bg-muted/30 p-4">
                                <p>
                                    {COMPANY_INFO.name}
                                    <br />
                                    {COMPANY_INFO.legalName}
                                    <br />
                                    {COMPANY_INFO.address}, {COMPANY_INFO.city}, {COMPANY_INFO.country}
                                    <br />
                                    Email: {COMPANY_INFO.email}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
