import { LeadInfo } from '@/components/leads/lead-info';
import { LeadSidebar } from '@/components/leads/lead-sidebar';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { Lead, SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, usePage } from '@inertiajs/react';

interface LeadPageProps {
    lead: Lead;
}

export default function LeadPage({ lead }: LeadPageProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.manager.leads, key);

    const leadName = lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || lead.email;

    const breadcrumbs = [{ title: t('title'), href: route('manager.leads.index') }, { title: leadName }];

    return (
        <ManagerLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('leadDetails')} - ${leadName}`} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="space-y-6 lg:col-span-2">
                    <LeadInfo lead={lead} />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <LeadSidebar lead={lead} />
                </div>
            </div>
        </ManagerLayout>
    );
}
