import { PublicLayout } from '@/layouts/public-layout';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';

export default function PrivacyPolicy() {
    const page = usePage<SharedData>();
    const { translations } = page.props;
    const t = (key: string) => translate(translations.public.privacyPolicy, key);

    // Company information constants
    const COMPANY_INFO = {
        name: 'RentPath',
        legalName: 'RentPath S.à r.l.',
        address: '4, rue de Drusenheim',
        city: 'L-3884 Schifflange',
        country: 'Luxembourg',
        email: 'contact@rentpath.app',
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
                            <p className="mb-4">{t('sections.whoWeAre.content')}</p>
                            <div className="rounded-lg bg-muted/30 p-4">
                                <p className="mb-2 font-semibold">{t('sections.whoWeAre.contactDetailsLabel')}</p>
                                <p>
                                    {COMPANY_INFO.name}
                                    <br />
                                    {COMPANY_INFO.legalName}
                                    <br />
                                    {COMPANY_INFO.address}, {COMPANY_INFO.city}, {COMPANY_INFO.country}
                                    <br />
                                </p>
                            </div>
                            <p className="mt-4">{t('sections.whoWeAre.contactNote')}</p>
                            <div className="mt-4 rounded-lg bg-muted/30 p-4">{COMPANY_INFO.email}</div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.informationWeCollect.title')}</h2>
                            <p className="mb-4">{t('sections.informationWeCollect.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.informationWeCollect.items.accountInformation')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.informationWeCollect.items.tenantApplicationData')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.informationWeCollect.items.propertyManagementData')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.informationWeCollect.items.communications')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.informationWeCollect.items.usageData')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.informationWeCollect.items.cookiesTrackingData')}</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.lawfulBases.title')}</h2>
                            <p className="mb-4">{t('sections.lawfulBases.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.lawfulBases.items.contract')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.lawfulBases.items.consent')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.lawfulBases.items.legalObligation')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.lawfulBases.items.legitimateInterests')}</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.howWeUseData.title')}</h2>
                            <p className="mb-4">{t('sections.howWeUseData.intro')}</p>
                            <ul className="space-y-3">
                                {(translations.public.privacyPolicy?.sections?.howWeUseData?.items || []).map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.sharingData.title')}</h2>
                            <p className="mb-4">{t('sections.sharingData.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.sharingData.items.landlordsPropertyManagers')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.sharingData.items.serviceProviders')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.sharingData.items.regulatoryAuthorities')}</span>
                                </li>
                            </ul>
                            <p className="mt-4">{t('sections.sharingData.note')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.internationalTransfers.title')}</h2>
                            <p className="mb-4">{t('sections.internationalTransfers.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.internationalTransfers.items.adequacyDecision')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.internationalTransfers.items.standardContractualClauses')}</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.dataRetention.title')}</h2>
                            <p>{t('sections.dataRetention.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.yourRights.title')}</h2>
                            <p className="mb-4">{t('sections.yourRights.intro')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightOfAccess')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightToRectification')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightToErasure')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightToRestrict')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightToPortability')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightToObject')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightToWithdraw')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                    <span>{t('sections.yourRights.items.rightToComplain')}</span>
                                </li>
                            </ul>
                            <p className="mt-4">{t('sections.yourRights.exerciseRights')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.cookiesTracking.title')}</h2>
                            <p className="mb-4">{t('sections.cookiesTracking.intro')}</p>
                            <ul className="space-y-3">
                                {(translations.public.privacyPolicy?.sections?.cookiesTracking?.items || []).map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4">{t('sections.cookiesTracking.note')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.security.title')}</h2>
                            <p>{t('sections.security.content')}</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t('sections.changes.title')}</h2>
                            <p>{t('sections.changes.content')}</p>
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
