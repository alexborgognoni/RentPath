import { ApplicationInfo } from '@/components/applications/application-info';
import { ApplicationSidebar } from '@/components/applications/application-sidebar';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { Application, SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, usePage } from '@inertiajs/react';

interface ApplicationPageProps {
    application: Application;
    allowedTransitions: string[];
}

export default function ApplicationPage({ application, allowedTransitions = [] }: ApplicationPageProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.applications, key);

    const breadcrumbs = [
        { title: t('title'), href: route('manager.applications.index') },
        { title: application.property?.title || t('applicationDetails') },
    ];

    return (
        <ManagerLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('applicationDetails')} - ${application.property?.title || ''}`} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="space-y-6 lg:col-span-2">
                    <ApplicationInfo application={application} />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <ApplicationSidebar application={application} allowedTransitions={allowedTransitions} />
                </div>
            </div>
        </ManagerLayout>
    );
}
