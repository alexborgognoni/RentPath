import { PublicLayout } from '@/layouts/public-layout';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';

export default function PrivacyPolicy() {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    // Company information constants
    const COMPANY_INFO = {
        name: 'RentPath',
        legalName: 'RentPath S.à r.l.',
        address: '4, rue de Drusenheim',
        city: 'L-3884 Schifflange',
        country: 'Luxembourg',
        email: 'contact@rentpath.app'
    };
    return (
        <PublicLayout>
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-neutral mx-auto max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{translate(translations, 'privacy-policy.page_title')}</h1>
                    <p className="text-sm text-muted-foreground mb-8">{translate(translations, 'privacy-policy.last_updated')}</p>

                    <div className="space-y-8 text-foreground">
                        <section>
                            <p className="text-lg leading-relaxed">
                                {translate(translations, 'privacy-policy.introduction')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.who_we_are.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.who_we_are.content')}</p>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p className="font-semibold mb-2">{translate(translations, 'privacy-policy.sections.who_we_are.contact_details_label')}</p>
                                <p>
                                    {COMPANY_INFO.name}<br />
                                    {COMPANY_INFO.legalName}<br />
                                    {COMPANY_INFO.address}, {COMPANY_INFO.city}, {COMPANY_INFO.country}<br />
                                </p>
                            </div>
                            <p className="mt-4">{translate(translations, 'privacy-policy.sections.who_we_are.contact_note')}</p>
                            <div className="mt-4 bg-muted/30 p-4 rounded-lg">
                                {COMPANY_INFO.email}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.information_we_collect.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.information_we_collect.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.information_we_collect.items.account_information')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.information_we_collect.items.tenant_application_data')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.information_we_collect.items.property_management_data')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.information_we_collect.items.communications')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.information_we_collect.items.usage_data')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.information_we_collect.items.cookies_tracking_data')}</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.lawful_bases.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.lawful_bases.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.lawful_bases.items.contract')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.lawful_bases.items.consent')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.lawful_bases.items.legal_obligation')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.lawful_bases.items.legitimate_interests')}</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.how_we_use_data.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.how_we_use_data.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.how_we_use_data.items[0]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.how_we_use_data.items[1]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.how_we_use_data.items[2]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.how_we_use_data.items[3]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.how_we_use_data.items[4]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.how_we_use_data.items[5]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.how_we_use_data.items[6]')}</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.sharing_data.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.sharing_data.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.sharing_data.items.landlords_property_managers')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.sharing_data.items.service_providers')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.sharing_data.items.regulatory_authorities')}</span></li>
                            </ul>
                            <p className="mt-4">{translate(translations, 'privacy-policy.sections.sharing_data.note')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.international_transfers.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.international_transfers.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.international_transfers.items.adequacy_decision')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.international_transfers.items.standard_contractual_clauses')}</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.data_retention.title')}</h2>
                            <p>{translate(translations, 'privacy-policy.sections.data_retention.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.your_rights.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.your_rights.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_of_access')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_to_rectification')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_to_erasure')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_to_restrict')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_to_portability')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_to_object')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_to_withdraw')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.your_rights.items.right_to_complain')}</span></li>
                            </ul>
                            <p className="mt-4">{translate(translations, 'privacy-policy.sections.your_rights.exercise_rights')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.cookies_tracking.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.cookies_tracking.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.cookies_tracking.items[0]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.cookies_tracking.items[1]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.cookies_tracking.items[2]')}</span></li>
                                <li className="flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>{translate(translations, 'privacy-policy.sections.cookies_tracking.items[3]')}</span></li>
                            </ul>
                            <p className="mt-4">{translate(translations, 'privacy-policy.sections.cookies_tracking.note')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.security.title')}</h2>
                            <p>{translate(translations, 'privacy-policy.sections.security.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.changes.title')}</h2>
                            <p>{translate(translations, 'privacy-policy.sections.changes.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">{translate(translations, 'privacy-policy.sections.contact_us.title')}</h2>
                            <p className="mb-4">{translate(translations, 'privacy-policy.sections.contact_us.intro')}</p>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p>
                                    {COMPANY_INFO.name}<br />
                                    {COMPANY_INFO.legalName}<br />
                                    {COMPANY_INFO.address}, {COMPANY_INFO.city}, {COMPANY_INFO.country}<br />
                                    {COMPANY_INFO.email}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
