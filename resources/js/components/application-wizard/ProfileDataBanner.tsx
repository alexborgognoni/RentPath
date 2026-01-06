import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import { Info } from 'lucide-react';

export function ProfileDataBanner() {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.profileDataBanner.${key}`);

    return (
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
                {t('message')}{' '}
                <Link href="/profile" className="font-medium text-primary hover:underline">
                    {t('manageProfile')} &rarr;
                </Link>
            </p>
        </div>
    );
}
