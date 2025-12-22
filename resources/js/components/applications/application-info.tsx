import type { Application, SharedData } from '@/types';
import { useReactiveCurrency } from '@/utils/currency-utils';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building,
    Calendar,
    Clock,
    Dog,
    ExternalLink,
    Eye,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Shield,
    User,
    Users,
} from 'lucide-react';

interface ApplicationInfoProps {
    application: Application;
}

export function ApplicationInfo({ application }: ApplicationInfoProps) {
    const { translations, locale } = usePage<SharedData>().props;
    const { formatAmount } = useReactiveCurrency();
    const t = (key: string) => translate(translations.applications, key);

    const formatDate = (date: string | undefined) => {
        if (!date) return t('notProvided');
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const user = application.tenant_profile?.user;
    const applicantName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : t('notProvided');

    return (
        <div className="space-y-6">
            {/* Property Info Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">{t('propertyInfo')}</h2>
                    </div>
                    {application.property && (
                        <Link
                            href={route('properties.show', { property: application.property.id })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            <Eye className="h-3 w-3" />
                            {translate(translations.properties, 'viewProperty')}
                        </Link>
                    )}
                </div>
                <div className="flex items-start gap-4">
                    {application.property?.images?.[0] && (
                        <img
                            src={application.property.images[0].image_url}
                            alt={application.property?.title}
                            className="h-24 w-32 rounded-lg object-cover"
                        />
                    )}
                    <div>
                        <h3 className="text-lg font-medium text-foreground">{application.property?.title}</h3>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {application.property?.street_name} {application.property?.house_number}, {application.property?.city}
                        </p>
                    </div>
                </div>
            </div>

            {/* Applicant Info Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{t('applicantInfo')}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('name')}</p>
                            <p className="font-medium text-foreground">{applicantName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('email')}</p>
                            <p className="font-medium text-foreground">{user?.email || t('notProvided')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('phone')}</p>
                            <p className="font-medium text-foreground">{application.tenant_profile?.phone_number || t('notProvided')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('currentAddress')}</p>
                            <p className="font-medium text-foreground">
                                {application.snapshot_current_street_name
                                    ? `${application.snapshot_current_street_name} ${application.snapshot_current_house_number}, ${application.snapshot_current_postal_code} ${application.snapshot_current_city}`
                                    : t('notProvided')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Details Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{t('applicationDetails')}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('desiredMoveIn')}</p>
                            <p className="font-medium text-foreground">{formatDate(application.desired_move_in_date)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('leaseDuration')}</p>
                            <p className="font-medium text-foreground">
                                {application.lease_duration_months} {t('months')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('additionalOccupants')}</p>
                            <p className="font-medium text-foreground">{application.additional_occupants || 0}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dog className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t('hasPets')}</p>
                            <p className="font-medium text-foreground">{application.has_pets ? t('yes') : t('no')}</p>
                        </div>
                    </div>
                </div>

                {application.message_to_landlord && (
                    <div className="mt-4 border-t border-border pt-4">
                        <div className="flex items-start gap-3">
                            <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">{t('messageToLandlord')}</p>
                                <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">{application.message_to_landlord}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Employment Info Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{t('employmentInfo')}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-xs text-muted-foreground">{t('employmentStatus')}</p>
                        <p className="font-medium text-foreground capitalize">
                            {application.snapshot_employment_status?.replace('_', ' ') || t('notProvided')}
                        </p>
                    </div>
                    {application.snapshot_employer_name && (
                        <div>
                            <p className="text-xs text-muted-foreground">{t('employer')}</p>
                            <p className="font-medium text-foreground">{application.snapshot_employer_name}</p>
                        </div>
                    )}
                    {application.snapshot_job_title && (
                        <div>
                            <p className="text-xs text-muted-foreground">{t('jobTitle')}</p>
                            <p className="font-medium text-foreground">{application.snapshot_job_title}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-muted-foreground">{t('monthlyIncome')}</p>
                        <p className="font-medium text-foreground">
                            {application.snapshot_monthly_income
                                ? formatAmount(application.snapshot_monthly_income, application.snapshot_income_currency || 'eur')
                                : t('notProvided')}
                        </p>
                    </div>
                    {application.snapshot_employment_type && (
                        <div>
                            <p className="text-xs text-muted-foreground">{t('employmentType')}</p>
                            <p className="font-medium text-foreground capitalize">{application.snapshot_employment_type.replace('_', ' ')}</p>
                        </div>
                    )}
                </div>

                {/* Student info if applicable */}
                {application.snapshot_employment_status === 'student' && application.snapshot_university_name && (
                    <div className="mt-4 border-t border-border pt-4">
                        <div className="mb-2 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Student Information</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground">University</p>
                                <p className="font-medium text-foreground">{application.snapshot_university_name}</p>
                            </div>
                            {application.snapshot_program_of_study && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Program</p>
                                    <p className="font-medium text-foreground">{application.snapshot_program_of_study}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Guarantor info if applicable */}
                {application.snapshot_has_guarantor && (
                    <div className="mt-4 border-t border-border pt-4">
                        <div className="mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Guarantor Information</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {application.snapshot_guarantor_name && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="font-medium text-foreground">{application.snapshot_guarantor_name}</p>
                                </div>
                            )}
                            {application.snapshot_guarantor_relationship && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Relationship</p>
                                    <p className="font-medium text-foreground">{application.snapshot_guarantor_relationship}</p>
                                </div>
                            )}
                            {application.snapshot_guarantor_monthly_income && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Monthly Income</p>
                                    <p className="font-medium text-foreground">
                                        {formatAmount(application.snapshot_guarantor_monthly_income, application.snapshot_income_currency || 'eur')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Documents Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{t('documents')}</h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DocumentLink url={application.snapshot_id_document_url} label={t('idDocument')} noDocLabel={t('noDocument')} />
                    <DocumentLink url={application.snapshot_employment_contract_url} label={t('employmentContract')} noDocLabel={t('noDocument')} />
                    <DocumentLink
                        url={application.snapshot_payslip_1_url || application.snapshot_payslip_2_url || application.snapshot_payslip_3_url}
                        label={t('payslips')}
                        noDocLabel={t('noDocument')}
                    />
                    <DocumentLink url={application.application_proof_of_income_url} label={t('proofOfIncome')} noDocLabel={t('noDocument')} />
                    <DocumentLink url={application.application_reference_letter_url} label={t('referenceLetter')} noDocLabel={t('noDocument')} />
                </div>
            </div>
        </div>
    );
}

function DocumentLink({ url, label, noDocLabel }: { url?: string; label: string; noDocLabel: string }) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.applications, key);

    if (!url) {
        return (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <span className="text-sm text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{noDocLabel}</span>
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
                <span>{t('viewDocument')}</span>
                <ExternalLink className="h-3 w-3" />
            </div>
        </a>
    );
}
