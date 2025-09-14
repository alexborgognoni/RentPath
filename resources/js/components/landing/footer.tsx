import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Home } from 'lucide-react';

export function Footer() {
    const { translations } = usePage<SharedData>().props;

    const BRAND_NAME = 'RentPath';
    const BRAND_DESCRIPTION = translate(translations, 'landing.footer.description');
    const PRODUCT_HEADING = translate(translations, 'landing.footer.product');
    const SUPPORT_HEADING = translate(translations, 'landing.footer.support');

    const PRODUCT_LINKS = [
        { href: '#features', label: translate(translations, 'landing.footer.links.features') },
        { href: '/register', label: translate(translations, 'landing.footer.links.pricing') },
        { href: '/register', label: translate(translations, 'landing.footer.links.free_trial') },
    ];

    const SUPPORT_LINKS = [
        { href: '/contact-us', label: translate(translations, 'landing.footer.links.contact_us') },
        { href: '/privacy-policy', label: translate(translations, 'landing.footer.links.privacy_policy') },
        { href: '/terms-of-use', label: 'Terms of Use' },
    ];

    const COPYRIGHT_TEXT = `© 2025 ${BRAND_NAME}. ${translate(translations, 'landing.footer.all_rights_reserved')}`;

    return (
        <footer className="border-t border-border bg-surface py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <div className="mb-4 flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary">
                                <Home className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">{BRAND_NAME}</span>
                        </div>
                        <p className="max-w-md leading-relaxed text-muted-foreground">{BRAND_DESCRIPTION}</p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-bold text-foreground">{PRODUCT_HEADING}</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            {PRODUCT_LINKS.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="transition-colors hover:text-primary">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-bold text-foreground">{SUPPORT_HEADING}</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            {SUPPORT_LINKS.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="transition-colors hover:text-primary">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8 text-center text-muted-foreground">
                    <p>{COPYRIGHT_TEXT}</p>
                </div>
            </div>
        </footer>
    );
}
