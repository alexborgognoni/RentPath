import { Button } from '@/components/ui/button';
import { TenantLayout } from '@/layouts/tenant-layout';
import type { SharedData, TenantProfile } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, CheckCircle, Circle, FileText, Home, Pencil, User } from 'lucide-react';

interface ProfilePageProps {
    profile: TenantProfile | null;
    hasProfile: boolean;
    completeness: number;
    documents: {
        id_document: boolean;
        proof_of_income: boolean;
        reference_letter: boolean;
    };
}

export default function ProfilePage({ profile, hasProfile, completeness, documents }: ProfilePageProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);

    const formatEmploymentStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            employed: t('tenant.profile.employment_types.employed') || 'Employed',
            self_employed: t('tenant.profile.employment_types.self_employed') || 'Self Employed',
            student: t('tenant.profile.employment_types.student') || 'Student',
            unemployed: t('tenant.profile.employment_types.unemployed') || 'Unemployed',
            retired: t('tenant.profile.employment_types.retired') || 'Retired',
        };
        return statusMap[status] || status;
    };

    if (!hasProfile) {
        return (
            <TenantLayout>
                <Head title={t('tenant.profile.title') || 'My Profile'} />

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                    <User className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                    <h2 className="mb-2 text-xl font-semibold text-foreground">{t('tenant.profile.empty.title') || 'No Profile Yet'}</h2>
                    <p className="mb-6 max-w-md text-muted-foreground">
                        {t('tenant.profile.empty.description') ||
                            'Your tenant profile will be created when you submit your first application. The information you provide will be reused for future applications.'}
                    </p>
                    <Link
                        href={route('properties.index')}
                        className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                    >
                        {t('tenant.profile.empty.cta') || 'Browse Properties'}
                    </Link>
                </div>
            </TenantLayout>
        );
    }

    return (
        <TenantLayout>
            <Head title={t('tenant.profile.title') || 'My Profile'} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{t('tenant.profile.title') || 'My Profile'}</h1>
                            <p className="text-muted-foreground">
                                {t('tenant.profile.subtitle') || 'Your tenant information for rental applications'}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={route('tenant.profile.edit')}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('tenant.profile.edit') || 'Edit Profile'}
                        </Link>
                    </Button>
                </div>

                {/* Completeness Bar */}
                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{t('tenant.profile.completeness') || 'Profile Completeness'}</span>
                        <span className="text-sm font-semibold text-primary">{completeness}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                            style={{ width: `${completeness}%` }}
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Personal Information */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                            <User className="h-5 w-5 text-primary" />
                            {t('tenant.profile.personal_info') || 'Personal Information'}
                        </h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">{t('tenant.profile.date_of_birth') || 'Date of Birth'}</dt>
                                <dd className="font-medium text-foreground">
                                    {profile?.date_of_birth
                                        ? new Date(profile.date_of_birth).toLocaleDateString()
                                        : t('tenant.profile.not_provided') || 'Not provided'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">{t('tenant.profile.nationality') || 'Nationality'}</dt>
                                <dd className="font-medium text-foreground">
                                    {profile?.nationality || t('tenant.profile.not_provided') || 'Not provided'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">{t('tenant.profile.phone') || 'Phone'}</dt>
                                <dd className="font-medium text-foreground">
                                    {profile?.phone_number
                                        ? `${profile.phone_country_code} ${profile.phone_number}`
                                        : t('tenant.profile.not_provided') || 'Not provided'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Employment */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                            <Briefcase className="h-5 w-5 text-primary" />
                            {t('tenant.profile.employment') || 'Employment'}
                        </h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">{t('tenant.profile.employment_status') || 'Status'}</dt>
                                <dd className="font-medium text-foreground">
                                    {profile?.employment_status
                                        ? formatEmploymentStatus(profile.employment_status)
                                        : t('tenant.profile.not_provided') || 'Not provided'}
                                </dd>
                            </div>
                            {profile?.employer_name && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">{t('tenant.profile.employer') || 'Employer'}</dt>
                                    <dd className="font-medium text-foreground">{profile.employer_name}</dd>
                                </div>
                            )}
                            {profile?.monthly_income && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">{t('tenant.profile.monthly_income') || 'Monthly Income'}</dt>
                                    <dd className="font-medium text-foreground">
                                        {profile.income_currency?.toUpperCase()} {profile.monthly_income.toLocaleString()}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Documents */}
                    <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                            <FileText className="h-5 w-5 text-primary" />
                            {t('tenant.profile.documents') || 'Documents'}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                                {documents.id_document ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="font-medium text-foreground">{t('tenant.profile.id_document') || 'ID Document'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {documents.id_document
                                            ? t('tenant.profile.uploaded') || 'Uploaded'
                                            : t('tenant.profile.not_uploaded') || 'Not uploaded'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                                {documents.proof_of_income ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="font-medium text-foreground">{t('tenant.profile.proof_of_income') || 'Proof of Income'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {documents.proof_of_income
                                            ? t('tenant.profile.uploaded') || 'Uploaded'
                                            : t('tenant.profile.not_uploaded') || 'Not uploaded'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                                {documents.reference_letter ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="font-medium text-foreground">{t('tenant.profile.reference_letter') || 'Reference Letter'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {documents.reference_letter
                                            ? t('tenant.profile.uploaded') || 'Uploaded'
                                            : t('tenant.profile.not_uploaded') || 'Not uploaded'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Address */}
                    {profile?.current_street_name && (
                        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                                <Home className="h-5 w-5 text-primary" />
                                {t('tenant.profile.current_address') || 'Current Address'}
                            </h2>
                            <p className="text-foreground">
                                {profile.current_house_number} {profile.current_street_name}
                                {profile.current_address_line_2 && (
                                    <>
                                        <br />
                                        {profile.current_address_line_2}
                                    </>
                                )}
                                <br />
                                {profile.current_city}
                                {profile.current_state_province && `, ${profile.current_state_province}`} {profile.current_postal_code}
                                <br />
                                {profile.current_country}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </TenantLayout>
    );
}
