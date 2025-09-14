import { translate as t } from '@/utils/translate-utils';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
    const SECTION_TITLE = 'Ready to End Application Chaos?';
    const SECTION_DESCRIPTION =
        'Join property agents who have streamlined their tenant application process and improve their service quality with landlords and tenants alike.';
    const BUTTON_TEXT = t('startYourFreeTrial');
    const BUTTON_HREF = '/register';

    return (
        <section className="bg-background py-24">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-6 text-4xl font-bold text-foreground lg:text-5xl">{SECTION_TITLE}</h2>
                <p className="mx-auto mb-10 max-w-3xl text-xl text-muted-foreground">{SECTION_DESCRIPTION}</p>
                <a
                    href={BUTTON_HREF}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-primary hover:to-secondary"
                >
                    {BUTTON_TEXT}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </a>
            </div>
        </section>
    );
}
