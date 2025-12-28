import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantLayout } from '@/layouts/tenant-layout';
import { type Application, type SharedData } from '@/types';
import { useReactiveCurrency } from '@/utils/currency-utils';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Briefcase,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Dog,
    ExternalLink,
    FileText,
    GraduationCap,
    Home,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Shield,
    User,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface ApplicationViewProps extends SharedData {
    application: Application;
}

export default function ApplicationView() {
    const { application, translations, locale } = usePage<ApplicationViewProps>().props;
    const [isStartingChat, setIsStartingChat] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const { formatAmount } = useReactiveCurrency();

    const t = (key: string) => translate(translations, key);

    const handleMessageLandlord = () => {
        setIsStartingChat(true);
        router.get(route('tenant.messages.index'));
    };

    const handleWithdraw = () => {
        if (
            !confirm(t('tenant.application.withdraw_confirm') || 'Are you sure you want to withdraw this application? This action cannot be undone.')
        ) {
            return;
        }
        setIsWithdrawing(true);
        router.post(
            route('applications.withdraw', { application: application.id }),
            {},
            {
                onFinish: () => setIsWithdrawing(false),
            },
        );
    };

    const formatDate = (date: string | undefined) => {
        if (!date) return t('tenant.application.not_provided') || 'Not provided';
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (date: string | undefined) => {
        if (!date) return t('tenant.application.not_provided') || 'Not provided';
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusConfig = () => {
        const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType; text: string }> = {
            draft: {
                color: 'text-gray-700 dark:text-gray-300',
                bgColor: 'bg-gray-100 dark:bg-gray-800',
                icon: FileText,
                text: t('tenant.dashboard.status.draft') || 'Draft',
            },
            submitted: {
                color: 'text-blue-700 dark:text-blue-400',
                bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                icon: Clock,
                text: t('tenant.dashboard.status.submitted') || 'Submitted',
            },
            under_review: {
                color: 'text-purple-700 dark:text-purple-400',
                bgColor: 'bg-purple-100 dark:bg-purple-900/30',
                icon: AlertCircle,
                text: t('tenant.dashboard.status.under_review') || 'Under Review',
            },
            visit_scheduled: {
                color: 'text-cyan-700 dark:text-cyan-400',
                bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
                icon: Calendar,
                text: t('tenant.dashboard.status.visit_scheduled') || 'Visit Scheduled',
            },
            visit_completed: {
                color: 'text-indigo-700 dark:text-indigo-400',
                bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
                icon: CheckCircle,
                text: t('tenant.dashboard.status.visit_completed') || 'Visit Completed',
            },
            approved: {
                color: 'text-green-700 dark:text-green-400',
                bgColor: 'bg-green-100 dark:bg-green-900/30',
                icon: CheckCircle,
                text: t('tenant.dashboard.status.approved') || 'Approved',
            },
            rejected: {
                color: 'text-red-700 dark:text-red-400',
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                icon: XCircle,
                text: t('tenant.dashboard.status.rejected') || 'Rejected',
            },
            withdrawn: {
                color: 'text-gray-700 dark:text-gray-300',
                bgColor: 'bg-gray-100 dark:bg-gray-800',
                icon: XCircle,
                text: t('tenant.dashboard.status.withdrawn') || 'Withdrawn',
            },
            leased: {
                color: 'text-emerald-700 dark:text-emerald-400',
                bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
                icon: Home,
                text: t('tenant.dashboard.status.leased') || 'Leased',
            },
            archived: {
                color: 'text-gray-700 dark:text-gray-300',
                bgColor: 'bg-gray-100 dark:bg-gray-800',
                icon: FileText,
                text: t('tenant.dashboard.status.archived') || 'Archived',
            },
        };

        return statusConfig[application.status] || statusConfig.draft;
    };

    const getTimeline = () => {
        const events = [];

        if (application.submitted_at) {
            events.push({
                label: t('tenant.application.timeline.submitted') || 'Application Submitted',
                date: application.submitted_at,
                completed: true,
            });
        }

        if (application.reviewed_at) {
            events.push({ label: t('tenant.application.timeline.under_review') || 'Under Review', date: application.reviewed_at, completed: true });
        }

        if (application.visit_scheduled_at) {
            events.push({
                label: t('tenant.application.timeline.visit_scheduled') || 'Visit Scheduled',
                date: application.visit_scheduled_at,
                completed: true,
            });
        }

        if (application.visit_completed_at) {
            events.push({
                label: t('tenant.application.timeline.visit_completed') || 'Visit Completed',
                date: application.visit_completed_at,
                completed: true,
            });
        }

        if (application.approved_at) {
            events.push({
                label: t('tenant.application.timeline.approved') || 'Application Approved',
                date: application.approved_at,
                completed: true,
            });
        }

        if (application.status === 'rejected' && application.reviewed_at) {
            events.push({
                label: t('tenant.application.timeline.rejected') || 'Application Rejected',
                date: application.reviewed_at,
                completed: true,
            });
        }

        if (application.lease_signed_at) {
            events.push({
                label: t('tenant.application.timeline.lease_signed') || 'Lease Signed',
                date: application.lease_signed_at,
                completed: true,
            });
        }

        return events;
    };

    const canWithdraw = ['submitted', 'under_review', 'visit_scheduled', 'visit_completed'].includes(application.status);
    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;
    const mainImage = application.property?.images?.find((img) => img.is_main) || application.property?.images?.[0];

    return (
        <TenantLayout>
            <Head title={`${t('tenant.application.page_title') || 'Application'} - ${application.property?.title}`} />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Button & Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={route('applications.index')}
                        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('tenant.application.back_to_applications') || 'Back to Applications'}
                    </Link>

                    <div
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                        <StatusIcon size={16} />
                        {statusConfig.text}
                    </div>
                </div>

                {/* Status Messages */}
                {application.status === 'rejected' && application.rejection_reason && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-900/20">
                        <div className="flex gap-4">
                            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                            <div className="flex-1">
                                <p className="font-semibold text-red-700 dark:text-red-400">
                                    {t('tenant.application.rejected_title') || 'Application Not Approved'}
                                </p>
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{application.rejection_reason}</p>
                                {application.rejection_details && Object.keys(application.rejection_details).length > 0 && (
                                    <div className="mt-3 space-y-1">
                                        <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                            {t('tenant.application.rejection_details') || 'Details:'}
                                        </p>
                                        <ul className="list-inside list-disc space-y-0.5 text-sm text-red-600 dark:text-red-400">
                                            {Object.entries(application.rejection_details as Record<string, string>).map(([field, message]) => (
                                                <li key={field}>{message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {application.status === 'approved' && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-900/20">
                        <div className="flex gap-4">
                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                            <div className="flex-1">
                                <p className="font-semibold text-green-700 dark:text-green-400">
                                    {t('tenant.application.approved_title') || 'Congratulations! Your Application is Approved'}
                                </p>
                                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                                    {t('tenant.application.approved_message') ||
                                        'The property manager will contact you soon to finalize the lease agreement.'}
                                </p>
                                {application.approval_notes && (
                                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                        <span className="font-medium">{t('tenant.application.notes') || 'Notes'}:</span> {application.approval_notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Property Info Card */}
                        <Card>
                            <CardHeader className="flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-primary" />
                                    <CardTitle>{t('tenant.application.property_info') || 'Property'}</CardTitle>
                                </div>
                                {application.property && (
                                    <Link
                                        href={route('tenant.properties.show', { property: application.property.id })}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        {t('tenant.application.view_property') || 'View Property'}
                                    </Link>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    {mainImage ? (
                                        <img
                                            src={mainImage.image_url}
                                            alt={application.property?.title}
                                            className="h-24 w-32 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-32 items-center justify-center rounded-lg bg-muted">
                                            <Home className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground">{application.property?.title}</h3>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            {application.property?.house_number} {application.property?.street_name}, {application.property?.city}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Application Details Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle>{t('tenant.application.application_details') || 'Application Details'}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t('tenant.application.desired_move_in') || 'Desired Move-In Date'}
                                            </p>
                                            <p className="font-medium text-foreground">{formatDate(application.desired_move_in_date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t('tenant.application.lease_duration') || 'Lease Duration'}
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {application.lease_duration_months} {t('tenant.application.months') || 'months'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t('tenant.application.total_occupants') || 'Total Occupants'}
                                            </p>
                                            <p className="font-medium text-foreground">{(application.additional_occupants || 0) + 1}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Dog className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">{t('tenant.application.pets') || 'Pets'}</p>
                                            <p className="font-medium text-foreground">
                                                {application.has_pets
                                                    ? `${t('tenant.application.yes') || 'Yes'} (${application.pets_details?.length || 0})`
                                                    : t('tenant.application.no') || 'No'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {application.message_to_landlord && (
                                    <div className="mt-4 border-t border-border pt-4">
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            {t('tenant.application.message_to_landlord') || 'Your Message'}
                                        </p>
                                        <p className="text-sm whitespace-pre-wrap text-foreground">{application.message_to_landlord}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Employment & Income Card */}
                        {application.snapshot_employment_status && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('tenant.application.employment_info') || 'Employment & Income'}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t('tenant.application.employment_status') || 'Employment Status'}
                                            </p>
                                            <p className="font-medium text-foreground capitalize">
                                                {application.snapshot_employment_status?.replace('_', ' ')}
                                            </p>
                                        </div>
                                        {application.snapshot_employer_name && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">{t('tenant.application.employer') || 'Employer'}</p>
                                                <p className="font-medium text-foreground">{application.snapshot_employer_name}</p>
                                            </div>
                                        )}
                                        {application.snapshot_job_title && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">{t('tenant.application.job_title') || 'Job Title'}</p>
                                                <p className="font-medium text-foreground">{application.snapshot_job_title}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t('tenant.application.monthly_income') || 'Monthly Income'}
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {application.snapshot_monthly_income
                                                    ? formatAmount(application.snapshot_monthly_income, application.snapshot_income_currency || 'eur')
                                                    : t('tenant.application.not_provided') || 'Not provided'}
                                            </p>
                                        </div>
                                        {application.snapshot_employment_type && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('tenant.application.employment_type') || 'Employment Type'}
                                                </p>
                                                <p className="font-medium text-foreground capitalize">
                                                    {application.snapshot_employment_type?.replace('_', ' ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Student Info */}
                                    {application.snapshot_employment_status === 'student' && application.snapshot_university_name && (
                                        <div className="mt-4 border-t border-border pt-4">
                                            <div className="mb-2 flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-foreground">
                                                    {t('tenant.application.student_info') || 'Student Information'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t('tenant.application.university') || 'University'}
                                                    </p>
                                                    <p className="font-medium text-foreground">{application.snapshot_university_name}</p>
                                                </div>
                                                {application.snapshot_program_of_study && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {t('tenant.application.program') || 'Program'}
                                                        </p>
                                                        <p className="font-medium text-foreground">{application.snapshot_program_of_study}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Guarantor Info */}
                                    {application.snapshot_has_guarantor && (
                                        <div className="mt-4 border-t border-border pt-4">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-foreground">
                                                    {t('tenant.application.guarantor_info') || 'Guarantor Information'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {application.snapshot_guarantor_name && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {t('tenant.application.guarantor_name') || 'Name'}
                                                        </p>
                                                        <p className="font-medium text-foreground">{application.snapshot_guarantor_name}</p>
                                                    </div>
                                                )}
                                                {application.snapshot_guarantor_relationship && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {t('tenant.application.relationship') || 'Relationship'}
                                                        </p>
                                                        <p className="font-medium text-foreground">{application.snapshot_guarantor_relationship}</p>
                                                    </div>
                                                )}
                                                {application.snapshot_guarantor_monthly_income && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {t('tenant.application.monthly_income') || 'Monthly Income'}
                                                        </p>
                                                        <p className="font-medium text-foreground">
                                                            {formatAmount(
                                                                application.snapshot_guarantor_monthly_income,
                                                                application.snapshot_income_currency || 'eur',
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Documents Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle>{t('tenant.application.documents') || 'Submitted Documents'}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <DocumentLink
                                        url={application.snapshot_id_document_front_url}
                                        label={(t('tenant.application.id_document') || 'ID Document') + ' (Front)'}
                                    />
                                    <DocumentLink
                                        url={application.snapshot_id_document_back_url}
                                        label={(t('tenant.application.id_document') || 'ID Document') + ' (Back)'}
                                    />
                                    <DocumentLink
                                        url={application.snapshot_employment_contract_url}
                                        label={t('tenant.application.employment_contract') || 'Employment Contract'}
                                    />
                                    <DocumentLink
                                        url={
                                            application.snapshot_payslip_1_url ||
                                            application.snapshot_payslip_2_url ||
                                            application.snapshot_payslip_3_url
                                        }
                                        label={t('tenant.application.payslips') || 'Payslips'}
                                    />
                                    <DocumentLink
                                        url={application.application_proof_of_income_url}
                                        label={t('tenant.application.proof_of_income') || 'Proof of Income'}
                                    />
                                    <DocumentLink
                                        url={application.application_reference_letter_url}
                                        label={t('tenant.application.reference_letter') || 'Reference Letter'}
                                    />
                                    {application.snapshot_student_proof_url && (
                                        <DocumentLink
                                            url={application.snapshot_student_proof_url}
                                            label={t('tenant.application.student_proof') || 'Student Proof'}
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visit Information */}
                        {application.visit_scheduled_at && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('tenant.application.property_visit') || 'Property Visit'}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t('tenant.application.scheduled_date') || 'Scheduled Date & Time'}
                                            </p>
                                            <p className="font-medium text-foreground">{formatDateTime(application.visit_scheduled_at)}</p>
                                        </div>
                                    </div>
                                    {application.visit_notes && (
                                        <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                            <p className="text-sm text-blue-700 dark:text-blue-400">{application.visit_notes}</p>
                                        </div>
                                    )}
                                    {application.visit_completed_at && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <CheckCircle className="h-4 w-4" />
                                            {t('tenant.application.visit_completed_on') || 'Visit completed on'}{' '}
                                            {formatDateTime(application.visit_completed_at)}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Property Manager Contact (for approved applications) */}
                        {application.status === 'approved' && application.property?.property_manager && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('tenant.application.manager_contact') || 'Property Manager Contact'}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {application.property.property_manager.company_name && (
                                            <div className="flex items-center gap-3">
                                                <Building className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{t('tenant.application.company') || 'Company'}</p>
                                                    <p className="font-medium text-foreground">
                                                        {application.property.property_manager.company_name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {application.property.property_manager.user?.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{t('tenant.application.email') || 'Email'}</p>
                                                    <a
                                                        href={`mailto:${application.property.property_manager.user.email}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {application.property.property_manager.user.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {application.property.property_manager.phone_number && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{t('tenant.application.phone') || 'Phone'}</p>
                                                    <a
                                                        href={`tel:${application.property.property_manager.phone_country_code || ''}${application.property.property_manager.phone_number}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {application.property.property_manager.phone_country_code}{' '}
                                                        {application.property.property_manager.phone_number}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Timeline Card */}
                        {getTimeline().length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('tenant.application.timeline_title') || 'Timeline'}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {getTimeline().map((event, index) => (
                                            <div key={index} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                                        <CheckCircle size={12} className="text-white" />
                                                    </div>
                                                    {index < getTimeline().length - 1 && (
                                                        <div className="h-full min-h-6 w-0.5 flex-1 bg-green-300 dark:bg-green-700"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-2">
                                                    <p className="text-sm font-medium text-foreground">{event.label}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDateTime(event.date)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('tenant.application.quick_info') || 'Quick Info'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('tenant.application.applied_on') || 'Applied On'}</span>
                                        <span className="font-medium text-foreground">
                                            {formatDate(application.submitted_at || application.created_at)}
                                        </span>
                                    </div>
                                    {application.snapshot_monthly_income && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{t('tenant.application.income') || 'Income'}</span>
                                            <span className="font-medium text-foreground">
                                                {formatAmount(application.snapshot_monthly_income, application.snapshot_income_currency || 'eur')}/mo
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('tenant.application.move_in') || 'Move-In'}</span>
                                        <span className="font-medium text-foreground">{formatDate(application.desired_move_in_date)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('tenant.application.lease') || 'Lease'}</span>
                                        <span className="font-medium text-foreground">
                                            {application.lease_duration_months} {t('tenant.application.months') || 'months'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('tenant.application.actions') || 'Actions'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button onClick={handleMessageLandlord} disabled={isStartingChat} className="w-full">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    {t('tenant.application.message_landlord') || 'Message Landlord'}
                                </Button>

                                {canWithdraw && (
                                    <Button
                                        onClick={handleWithdraw}
                                        disabled={isWithdrawing}
                                        variant="outline"
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        {isWithdrawing
                                            ? t('tenant.application.withdrawing') || 'Withdrawing...'
                                            : t('tenant.application.withdraw') || 'Withdraw Application'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}

function DocumentLink({ url, label }: { url?: string; label: string }) {
    if (!url) {
        return (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <span className="text-sm text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">Not provided</span>
            </div>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:bg-muted"
        >
            <span className="text-sm font-medium text-foreground">{label}</span>
            <div className="flex items-center gap-1 text-xs text-primary">
                <span>View</span>
                <ExternalLink className="h-3 w-3" />
            </div>
        </a>
    );
}
