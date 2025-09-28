import { PublicLayout } from '@/layouts/public-layout';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';

export default function TermsOfUse() {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    // Company information constants
    const COMPANY_INFO = {
        name: 'RentPath',
        legalName: 'RentPath S.à r.l.',
        address: '4, rue de Drusenheim',
        city: 'L-3884 Schifflange',
        country: 'Luxembourg',
        email: 'contact@rent-path.com'
    };

    // Links constants
    const LINKS = {
        privacyPolicy: '/privacy-policy'
    };
    return (
        <PublicLayout>
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-neutral mx-auto max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{translate(translations, 'terms-of-use.page_title')}</h1>
                    <p className="text-sm text-muted-foreground mb-8">{translate(translations, 'terms-of-use.last_updated')}</p>

                    <div className="space-y-8 text-foreground">
                        <section>
                            <p className="text-lg leading-relaxed">
                                {translate(translations, 'terms-of-use.introduction')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.who_we_are.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.who_we_are.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.eligibility.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.eligibility.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.accounts.title')}</h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.accounts.items[0]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.accounts.items[1]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.accounts.items[2]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.accounts.items[3]')}</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.services_provided.title')}</h2>
                            <p className="mb-4">{translate(translations, 'terms-of-use.sections.services_provided.intro')}</p>
                            <p>{translate(translations, 'terms-of-use.sections.services_provided.note')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.acceptable_use.title')}</h2>
                            <p className="mb-4">{translate(translations, 'terms-of-use.sections.acceptable_use.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.acceptable_use.items[0]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.acceptable_use.items[1]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.acceptable_use.items[2]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.acceptable_use.items[3]')}</span></li>
                            </ul>
                            <p className="mt-4">{translate(translations, 'terms-of-use.sections.acceptable_use.note')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.payments.title')}</h2>
                            <p className="mb-4">{translate(translations, 'terms-of-use.sections.payments.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.payments.items[0]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.payments.items[1]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.payments.items[2]')}</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.intellectual_property.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.intellectual_property.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.data_privacy.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.data_privacy.content')} <a href={LINKS.privacyPolicy} className="text-primary hover:underline">{translate(translations, 'terms-of-use.sections.data_privacy.link_text')}</a>.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.disclaimer_warranties.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.disclaimer_warranties.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.limitation_liability.title')}</h2>
                            <p className="mb-4">{translate(translations, 'terms-of-use.sections.limitation_liability.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.limitation_liability.items[0]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'terms-of-use.sections.limitation_liability.items[1]')}</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.termination.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.termination.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.changes_terms.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.changes_terms.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.governing_law.title')}</h2>
                            <p>{translate(translations, 'terms-of-use.sections.governing_law.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'terms-of-use.sections.contact_us.title')}</h2>
                            <p className="mb-4">{translate(translations, 'terms-of-use.sections.contact_us.intro')}</p>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p>
                                    {COMPANY_INFO.name}<br />
                                    {COMPANY_INFO.legalName}<br />
                                    {COMPANY_INFO.address}, {COMPANY_INFO.city}, {COMPANY_INFO.country}<br />
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