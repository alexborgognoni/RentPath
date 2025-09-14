import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
    const { translations } = usePage<SharedData>().props;

    const HEADING = translate(translations, 'landing.cta.heading');
    const SUBTITLE = translate(translations, 'landing.cta.subtitle');
    const CTA_BUTTON_TEXT = translate(translations, 'landing.cta.button_text');
    const CTA_BUTTON_HREF = '/register';

    return (
        <section className="bg-background py-24">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-6 text-4xl font-bold text-foreground lg:text-5xl">{HEADING}</h2>
                <p className="mx-auto mb-10 max-w-3xl text-xl text-muted-foreground">{SUBTITLE}</p>
                <a
                    href={CTA_BUTTON_HREF}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-primary hover:to-secondary"
                >
                    {CTA_BUTTON_TEXT}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </a>
            </div>
        </section>
    );
}
