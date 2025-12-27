import type { SharedData } from '@/types';
import type { Application, PropertyImage } from '@/types/dashboard';
import { useReactiveCurrency } from '@/utils/currency-utils';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Calendar, Home, MapPin } from 'lucide-react';

interface RecentApplicationsProps {
    applications: Application[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const { formatRent } = useReactiveCurrency();

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            visit_scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            visit_completed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            leased: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
            archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatStatus = (status: string) => {
        return (
            t(`tenant.dashboard.status.${status}`) ||
            status
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return t('tenant.common.today') || 'Today';
        } else if (diffDays === 1) {
            return t('tenant.common.yesterday') || 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} ${t('tenant.common.days_ago') || 'days ago'}`;
        } else {
            return date.toLocaleDateString();
        }
    };

    if (applications.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">{t('tenant.dashboard.recent_applications') || 'Recent Applications'}</h2>
                <Link href={route('applications.index')} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {t('tenant.dashboard.view_all') || 'View All'}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="space-y-3">
                {applications.map((application) => {
                    const property = application.property;
                    const mainImage = property?.images?.find((img: PropertyImage) => img.is_main) || property?.images?.[0];

                    return (
                        <Link
                            key={application.id}
                            href={route('applications.show', { application: application.id })}
                            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                        >
                            {/* Property Image */}
                            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                {mainImage ? (
                                    <img
                                        src={mainImage.image_url}
                                        alt={property?.title || 'Property'}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Home className="h-6 w-6 text-muted-foreground opacity-50" />
                                    </div>
                                )}
                            </div>

                            {/* Property Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="truncate font-medium text-foreground group-hover:text-primary">{property?.title || 'Property'}</h3>
                                    <span
                                        className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(application.status)}`}
                                    >
                                        {formatStatus(application.status)}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1 truncate">
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                        {property?.city}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(application.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex-shrink-0 text-right">
                                <span className="font-semibold text-foreground">
                                    {formatRent(property?.rent_amount || 0, property?.rent_currency)}
                                </span>
                                <span className="text-sm text-muted-foreground">/mo</span>
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
