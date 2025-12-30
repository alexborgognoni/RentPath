import { CurrencySelect } from '@/components/ui/currency-select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { SimpleSelect } from '@/components/ui/simple-select';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { Briefcase, Building, GraduationCap, HeartHandshake, UserCheck } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface EmploymentIncomeStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    existingDocuments?: {
        // Main tenant documents
        employment_contract?: string;
        employment_contract_url?: string;
        employment_contract_size?: number;
        employment_contract_uploaded_at?: number;
        payslip_1?: string;
        payslip_1_url?: string;
        payslip_1_size?: number;
        payslip_1_uploaded_at?: number;
        payslip_2?: string;
        payslip_2_url?: string;
        payslip_2_size?: number;
        payslip_2_uploaded_at?: number;
        payslip_3?: string;
        payslip_3_url?: string;
        payslip_3_size?: number;
        payslip_3_uploaded_at?: number;
        student_proof?: string;
        student_proof_url?: string;
        student_proof_size?: number;
        student_proof_uploaded_at?: number;
        pension_statement?: string;
        pension_statement_url?: string;
        pension_statement_size?: number;
        pension_statement_uploaded_at?: number;
        benefits_statement?: string;
        benefits_statement_url?: string;
        benefits_statement_size?: number;
        benefits_statement_uploaded_at?: number;
        other_income_proof?: string;
        other_income_proof_url?: string;
        other_income_proof_size?: number;
        other_income_proof_uploaded_at?: number;
    };
}

const EMPLOYMENT_STATUS_ICONS = {
    employed: Briefcase,
    self_employed: Building,
    student: GraduationCap,
    unemployed: UserCheck,
    retired: UserCheck,
    other: HeartHandshake,
} as const;

export function EmploymentIncomeStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onBlur,
    existingDocuments,
}: EmploymentIncomeStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.employmentStep.${key}`);

    // Build options from translations
    const EMPLOYMENT_STATUSES = useMemo(
        () => [
            { value: 'employed', label: t('employmentStatuses.employed'), icon: EMPLOYMENT_STATUS_ICONS.employed },
            { value: 'self_employed', label: t('employmentStatuses.self_employed'), icon: EMPLOYMENT_STATUS_ICONS.self_employed },
            { value: 'student', label: t('employmentStatuses.student'), icon: EMPLOYMENT_STATUS_ICONS.student },
            { value: 'retired', label: t('employmentStatuses.retired'), icon: EMPLOYMENT_STATUS_ICONS.retired },
            { value: 'unemployed', label: t('employmentStatuses.unemployed'), icon: EMPLOYMENT_STATUS_ICONS.unemployed },
            { value: 'other', label: t('employmentStatuses.other'), icon: EMPLOYMENT_STATUS_ICONS.other },
        ],
        [translations],
    );

    const EMPLOYMENT_TYPES = useMemo(
        () => [
            { value: 'full_time', label: t('employmentTypes.full_time') },
            { value: 'part_time', label: t('employmentTypes.part_time') },
            { value: 'contract', label: t('employmentTypes.contract') },
            { value: 'temporary', label: t('employmentTypes.temporary') },
        ],
        [translations],
    );

    const BUSINESS_TYPES = useMemo(
        () => [
            { value: 'freelancer', label: t('businessTypes.freelancer') },
            { value: 'sole_proprietor', label: t('businessTypes.sole_proprietor') },
            { value: 'limited_company', label: t('businessTypes.limited_company') },
            { value: 'partnership', label: t('businessTypes.partnership') },
        ],
        [translations],
    );

    const STUDENT_INCOME_SOURCES = useMemo(
        () => [
            { value: 'scholarship', label: t('studentIncomeSources.scholarship') },
            { value: 'stipend', label: t('studentIncomeSources.stipend') },
            { value: 'part_time_job', label: t('studentIncomeSources.part_time_job') },
            { value: 'parental_support', label: t('studentIncomeSources.parental_support') },
            { value: 'student_loan', label: t('studentIncomeSources.student_loan') },
            { value: 'savings', label: t('studentIncomeSources.savings') },
            { value: 'other', label: t('studentIncomeSources.other') },
        ],
        [translations],
    );

    const UNEMPLOYED_INCOME_SOURCES = useMemo(
        () => [
            { value: 'unemployment_benefits', label: t('unemployedIncomeSources.unemployment_benefits') },
            { value: 'severance_pay', label: t('unemployedIncomeSources.severance_pay') },
            { value: 'savings', label: t('unemployedIncomeSources.savings') },
            { value: 'family_support', label: t('unemployedIncomeSources.family_support') },
            { value: 'rental_income', label: t('unemployedIncomeSources.rental_income') },
            { value: 'investment_income', label: t('unemployedIncomeSources.investment_income') },
            { value: 'alimony', label: t('unemployedIncomeSources.alimony') },
            { value: 'social_assistance', label: t('unemployedIncomeSources.social_assistance') },
            { value: 'disability_allowance', label: t('unemployedIncomeSources.disability_allowance') },
            { value: 'freelance_gig', label: t('unemployedIncomeSources.freelance_gig') },
            { value: 'other', label: t('unemployedIncomeSources.other') },
        ],
        [translations],
    );

    const PENSION_TYPES = useMemo(
        () => [
            { value: 'state_pension', label: t('pensionTypes.state_pension') },
            { value: 'employer_pension', label: t('pensionTypes.employer_pension') },
            { value: 'private_pension', label: t('pensionTypes.private_pension') },
            { value: 'annuity', label: t('pensionTypes.annuity') },
            { value: 'other', label: t('pensionTypes.other') },
        ],
        [translations],
    );

    const OTHER_SITUATIONS = useMemo(
        () => [
            { value: 'parental_leave', label: t('otherSituations.parental_leave') },
            { value: 'disability', label: t('otherSituations.disability') },
            { value: 'sabbatical', label: t('otherSituations.sabbatical') },
            { value: 'career_break', label: t('otherSituations.career_break') },
            { value: 'medical_leave', label: t('otherSituations.medical_leave') },
            { value: 'caregiver', label: t('otherSituations.caregiver') },
            { value: 'homemaker', label: t('otherSituations.homemaker') },
            { value: 'volunteer', label: t('otherSituations.volunteer') },
            { value: 'gap_year', label: t('otherSituations.gap_year') },
            { value: 'early_retirement', label: t('otherSituations.early_retirement') },
            { value: 'military_service', label: t('otherSituations.military_service') },
            { value: 'other', label: t('otherSituations.other') },
        ],
        [translations],
    );

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    const getFieldClass = (field: string) => {
        const hasError = touchedFields[field] && errors[field];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    const status = data.profile_employment_status;
    const isEmployed = status === 'employed';
    const isSelfEmployed = status === 'self_employed';
    const isStudent = status === 'student';
    const isRetired = status === 'retired';
    const isUnemployed = status === 'unemployed';
    const isOther = status === 'other';

    // Reload tenant profile data after successful upload
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['tenantProfile'] });
    }, []);

    const fileUploadAccept = {
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/pdf': ['.pdf'],
    };

    const fileUploadDescription = {
        fileTypes: 'PDF, PNG, JPG',
        maxFileSize: '20MB',
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
            </div>

            {/* Employment Status Selection */}
            <div>
                <label className="mb-3 block text-sm font-medium">{t('fields.employmentStatus')}</label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                    {EMPLOYMENT_STATUSES.map((statusOption) => {
                        const Icon = statusOption.icon;
                        const isSelected = data.profile_employment_status === statusOption.value;
                        return (
                            <button
                                key={statusOption.value}
                                type="button"
                                onClick={() => handleFieldChange('profile_employment_status', statusOption.value)}
                                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                                    isSelected
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{statusOption.label}</span>
                            </button>
                        );
                    })}
                </div>
                {touchedFields.profile_employment_status && errors.profile_employment_status && (
                    <p className="mt-2 text-sm text-destructive">{errors.profile_employment_status}</p>
                )}
            </div>

            {/* EMPLOYED Section */}
            {isEmployed && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.employerName')}</label>
                            <input
                                type="text"
                                value={data.profile_employer_name}
                                onChange={(e) => handleFieldChange('profile_employer_name', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.employerName')}
                                className={getFieldClass('profile_employer_name')}
                                required
                            />
                            {touchedFields.profile_employer_name && errors.profile_employer_name && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_employer_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.jobTitle')}</label>
                            <input
                                type="text"
                                value={data.profile_job_title}
                                onChange={(e) => handleFieldChange('profile_job_title', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.jobTitle')}
                                className={getFieldClass('profile_job_title')}
                                required
                            />
                            {touchedFields.profile_job_title && errors.profile_job_title && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_job_title}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.employmentType')}</label>
                            <SimpleSelect
                                value={data.profile_employment_type}
                                onChange={(value) => handleFieldChange('profile_employment_type', value)}
                                options={EMPLOYMENT_TYPES}
                                placeholder={t('placeholders.selectType')}
                                onBlur={onBlur}
                                aria-invalid={!!(touchedFields.profile_employment_type && errors.profile_employment_type)}
                            />
                            {touchedFields.profile_employment_type && errors.profile_employment_type && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_employment_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.employmentStartDate')}</label>
                            <DatePicker
                                value={data.profile_employment_start_date}
                                onChange={(value) => handleFieldChange('profile_employment_start_date', value)}
                                onBlur={onBlur}
                                max={new Date()}
                                aria-invalid={!!(touchedFields.profile_employment_start_date && errors.profile_employment_start_date)}
                            />
                            {touchedFields.profile_employment_start_date && errors.profile_employment_start_date && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_employment_start_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Income Fields for Employed */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.grossAnnualSalary')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_gross_annual_income}
                                    onChange={(e) => handleFieldChange('profile_gross_annual_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.grossAnnual')}
                                    min="0"
                                    step="1000"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_gross_annual_income')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_gross_annual_income && errors.profile_gross_annual_income && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_gross_annual_income}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.netMonthlyIncome')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_net_monthly_income}
                                    onChange={(e) => handleFieldChange('profile_net_monthly_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.netMonthly')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_net_monthly_income')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_net_monthly_income && errors.profile_net_monthly_income && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_net_monthly_income}</p>
                            )}
                        </div>
                    </div>

                    {/* Employment Documents */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <FileUpload
                            label={t('documents.employmentContract')}
                            required
                            documentType="employment_contract"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                existingDocuments?.employment_contract
                                    ? {
                                          originalName: existingDocuments.employment_contract,
                                          previewUrl: existingDocuments.employment_contract_url,
                                          size: existingDocuments.employment_contract_size,
                                          uploadedAt: existingDocuments.employment_contract_uploaded_at,
                                      }
                                    : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={touchedFields.profile_employment_contract ? errors.profile_employment_contract : undefined}
                        />
                        <FileUpload
                            label={t('documents.payslip1')}
                            required
                            documentType="payslip_1"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                existingDocuments?.payslip_1
                                    ? {
                                          originalName: existingDocuments.payslip_1,
                                          previewUrl: existingDocuments.payslip_1_url,
                                          size: existingDocuments.payslip_1_size,
                                          uploadedAt: existingDocuments.payslip_1_uploaded_at,
                                      }
                                    : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={touchedFields.profile_payslip_1 ? errors.profile_payslip_1 : undefined}
                        />
                        <FileUpload
                            label={t('documents.payslip2')}
                            required
                            documentType="payslip_2"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                existingDocuments?.payslip_2
                                    ? {
                                          originalName: existingDocuments.payslip_2,
                                          previewUrl: existingDocuments.payslip_2_url,
                                          size: existingDocuments.payslip_2_size,
                                          uploadedAt: existingDocuments.payslip_2_uploaded_at,
                                      }
                                    : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={touchedFields.profile_payslip_2 ? errors.profile_payslip_2 : undefined}
                        />
                        <FileUpload
                            label={t('documents.payslip3')}
                            required
                            documentType="payslip_3"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                existingDocuments?.payslip_3
                                    ? {
                                          originalName: existingDocuments.payslip_3,
                                          previewUrl: existingDocuments.payslip_3_url,
                                          size: existingDocuments.payslip_3_size,
                                          uploadedAt: existingDocuments.payslip_3_uploaded_at,
                                      }
                                    : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={touchedFields.profile_payslip_3 ? errors.profile_payslip_3 : undefined}
                        />
                    </div>
                </div>
            )}

            {/* SELF-EMPLOYED Section */}
            {isSelfEmployed && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.businessName')}</label>
                            <input
                                type="text"
                                value={data.profile_business_name}
                                onChange={(e) => handleFieldChange('profile_business_name', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.businessName')}
                                className={getFieldClass('profile_business_name')}
                                required
                            />
                            {touchedFields.profile_business_name && errors.profile_business_name && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_business_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.businessType')}</label>
                            <SimpleSelect
                                value={data.profile_business_type}
                                onChange={(value) => handleFieldChange('profile_business_type', value)}
                                options={BUSINESS_TYPES}
                                placeholder={t('placeholders.selectBusinessType')}
                                onBlur={onBlur}
                                aria-invalid={!!(touchedFields.profile_business_type && errors.profile_business_type)}
                            />
                            {touchedFields.profile_business_type && errors.profile_business_type && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_business_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.businessStartDate')}</label>
                            <DatePicker
                                value={data.profile_business_start_date}
                                onChange={(value) => handleFieldChange('profile_business_start_date', value)}
                                onBlur={onBlur}
                                max={new Date()}
                                aria-invalid={!!(touchedFields.profile_business_start_date && errors.profile_business_start_date)}
                            />
                            {touchedFields.profile_business_start_date && errors.profile_business_start_date && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_business_start_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Income Fields for Self-Employed */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.grossAnnualRevenue')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_gross_annual_revenue}
                                    onChange={(e) => handleFieldChange('profile_gross_annual_revenue', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.grossRevenue')}
                                    min="0"
                                    step="1000"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_gross_annual_revenue')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_gross_annual_revenue && errors.profile_gross_annual_revenue && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_gross_annual_revenue}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.netMonthlyIncome')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_net_monthly_income}
                                    onChange={(e) => handleFieldChange('profile_net_monthly_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.netMonthly')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_net_monthly_income')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_net_monthly_income && errors.profile_net_monthly_income && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_net_monthly_income}</p>
                            )}
                        </div>
                    </div>

                    {/* Self-Employed Documents Note */}
                    <p className="text-sm text-muted-foreground">{t('hints.selfEmployedDocs')}</p>
                </div>
            )}

            {/* STUDENT Section */}
            {isStudent && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.universityName')}</label>
                            <input
                                type="text"
                                value={data.profile_university_name}
                                onChange={(e) => handleFieldChange('profile_university_name', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.universityName')}
                                className={getFieldClass('profile_university_name')}
                                required
                            />
                            {touchedFields.profile_university_name && errors.profile_university_name && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_university_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.programOfStudy')}</label>
                            <input
                                type="text"
                                value={data.profile_program_of_study}
                                onChange={(e) => handleFieldChange('profile_program_of_study', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.programOfStudy')}
                                className={getFieldClass('profile_program_of_study')}
                                required
                            />
                            {touchedFields.profile_program_of_study && errors.profile_program_of_study && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_program_of_study}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.expectedGraduation')}
                                <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">{t('optional')}</span>
                            </label>
                            <DatePicker
                                value={data.profile_expected_graduation_date}
                                onChange={(value) => handleFieldChange('profile_expected_graduation_date', value)}
                                onBlur={onBlur}
                                min={new Date()}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.studentIncomeSource')}</label>
                            <SimpleSelect
                                value={data.profile_student_income_source_type}
                                onChange={(value) => handleFieldChange('profile_student_income_source_type', value)}
                                options={STUDENT_INCOME_SOURCES}
                                placeholder={t('placeholders.selectIncomeSource')}
                                onBlur={onBlur}
                                aria-invalid={!!(touchedFields.profile_student_income_source_type && errors.profile_student_income_source_type)}
                            />
                            {touchedFields.profile_student_income_source_type && errors.profile_student_income_source_type && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_student_income_source_type}</p>
                            )}
                        </div>

                        {/* Other income source specification */}
                        {data.profile_student_income_source_type === 'other' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.incomeSourceOther')}</label>
                                <input
                                    type="text"
                                    value={data.profile_student_income_source_other}
                                    onChange={(e) => handleFieldChange('profile_student_income_source_other', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.specifyIncomeSource')}
                                    className={getFieldClass('profile_student_income_source_other')}
                                    required
                                />
                                {touchedFields.profile_student_income_source_other && errors.profile_student_income_source_other && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_student_income_source_other}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Student Income */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('fields.studentMonthlyIncome')}</label>
                        <div className="flex">
                            <CurrencySelect
                                value={data.profile_income_currency}
                                onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                onBlur={onBlur}
                                compact
                            />
                            <input
                                type="number"
                                value={data.profile_student_monthly_income}
                                onChange={(e) => handleFieldChange('profile_student_monthly_income', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.monthlyIncome')}
                                min="0"
                                step="100"
                                className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_student_monthly_income')}`}
                                required
                            />
                        </div>
                        {data.profile_student_income_source_type === 'student_loan' && (
                            <p className="mt-1 text-xs text-amber-600">{t('hints.studentLoanNote')}</p>
                        )}
                        {touchedFields.profile_student_monthly_income && errors.profile_student_monthly_income && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_student_monthly_income}</p>
                        )}
                    </div>

                    {/* Student Document */}
                    <FileUpload
                        label={t('documents.studentProof')}
                        required
                        documentType="student_proof"
                        uploadUrl="/tenant-profile/document/upload"
                        accept={fileUploadAccept}
                        maxSize={20 * 1024 * 1024}
                        description={fileUploadDescription}
                        existingFile={
                            existingDocuments?.student_proof
                                ? {
                                      originalName: existingDocuments.student_proof,
                                      previewUrl: existingDocuments.student_proof_url,
                                      size: existingDocuments.student_proof_size,
                                      uploadedAt: existingDocuments.student_proof_uploaded_at,
                                  }
                                : null
                        }
                        onUploadSuccess={handleUploadSuccess}
                        error={touchedFields.profile_student_proof ? errors.profile_student_proof : undefined}
                    />
                </div>
            )}

            {/* RETIRED Section */}
            {isRetired && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.pensionType')}</label>
                            <SimpleSelect
                                value={data.profile_pension_type}
                                onChange={(value) => handleFieldChange('profile_pension_type', value)}
                                options={PENSION_TYPES}
                                placeholder={t('placeholders.selectPensionType')}
                                onBlur={onBlur}
                                aria-invalid={!!(touchedFields.profile_pension_type && errors.profile_pension_type)}
                            />
                            {touchedFields.profile_pension_type && errors.profile_pension_type && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_pension_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.pensionProvider')}
                                <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">{t('optional')}</span>
                            </label>
                            <input
                                type="text"
                                value={data.profile_pension_provider}
                                onChange={(e) => handleFieldChange('profile_pension_provider', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.pensionProvider')}
                                className={getFieldClass('profile_pension_provider')}
                            />
                        </div>
                    </div>

                    {/* Pension Income Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.monthlyPension')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_pension_monthly_income}
                                    onChange={(e) => handleFieldChange('profile_pension_monthly_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.monthlyPension')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_pension_monthly_income')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_pension_monthly_income && errors.profile_pension_monthly_income && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_pension_monthly_income}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.otherRetirementIncome')}
                                <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">{t('optional')}</span>
                            </label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_retirement_other_income}
                                    onChange={(e) => handleFieldChange('profile_retirement_other_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.otherIncome')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_retirement_other_income')}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pension Statement Document */}
                    <FileUpload
                        label={t('documents.pensionStatement')}
                        required
                        documentType="pension_statement"
                        uploadUrl="/tenant-profile/document/upload"
                        accept={fileUploadAccept}
                        maxSize={20 * 1024 * 1024}
                        description={fileUploadDescription}
                        existingFile={
                            existingDocuments?.pension_statement
                                ? {
                                      originalName: existingDocuments.pension_statement,
                                      previewUrl: existingDocuments.pension_statement_url,
                                      size: existingDocuments.pension_statement_size,
                                      uploadedAt: existingDocuments.pension_statement_uploaded_at,
                                  }
                                : null
                        }
                        onUploadSuccess={handleUploadSuccess}
                        error={touchedFields.profile_pension_statement ? errors.profile_pension_statement : undefined}
                    />

                    {/* Other Income Proof Document (optional) */}
                    <FileUpload
                        label={t('documents.otherIncomeProof')}
                        optional
                        documentType="other_income_proof"
                        uploadUrl="/tenant-profile/document/upload"
                        accept={fileUploadAccept}
                        maxSize={20 * 1024 * 1024}
                        description={fileUploadDescription}
                        existingFile={
                            existingDocuments?.other_income_proof
                                ? {
                                      originalName: existingDocuments.other_income_proof,
                                      previewUrl: existingDocuments.other_income_proof_url,
                                      size: existingDocuments.other_income_proof_size,
                                      uploadedAt: existingDocuments.other_income_proof_uploaded_at,
                                  }
                                : null
                        }
                        onUploadSuccess={handleUploadSuccess}
                    />
                </div>
            )}

            {/* UNEMPLOYED Section */}
            {isUnemployed && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.incomeSource')}</label>
                            <SimpleSelect
                                value={data.profile_unemployed_income_source}
                                onChange={(value) => {
                                    handleFieldChange('profile_unemployed_income_source', value);
                                    // Auto-set receiving_unemployment_benefits based on selection
                                    handleFieldChange('profile_receiving_unemployment_benefits', value === 'unemployment_benefits');
                                }}
                                options={UNEMPLOYED_INCOME_SOURCES}
                                placeholder={t('placeholders.selectIncomeSource')}
                                onBlur={onBlur}
                                aria-invalid={!!(touchedFields.profile_unemployed_income_source && errors.profile_unemployed_income_source)}
                            />
                            {touchedFields.profile_unemployed_income_source && errors.profile_unemployed_income_source && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_unemployed_income_source}</p>
                            )}
                        </div>

                        {/* Other income source specification */}
                        {data.profile_unemployed_income_source === 'other' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.incomeSourceOther')}</label>
                                <input
                                    type="text"
                                    value={data.profile_unemployed_income_source_other}
                                    onChange={(e) => handleFieldChange('profile_unemployed_income_source_other', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.specifyIncomeSource')}
                                    className={getFieldClass('profile_unemployed_income_source_other')}
                                    required
                                />
                                {touchedFields.profile_unemployed_income_source_other && errors.profile_unemployed_income_source_other && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_unemployed_income_source_other}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Income Amount - shown based on income source */}
                    {data.profile_unemployed_income_source && (
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                {data.profile_unemployed_income_source === 'unemployment_benefits'
                                    ? t('fields.benefitsAmount')
                                    : t('fields.monthlyIncome')}
                            </label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_unemployment_benefits_amount}
                                    onChange={(e) => handleFieldChange('profile_unemployment_benefits_amount', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={
                                        data.profile_unemployed_income_source === 'unemployment_benefits'
                                            ? t('placeholders.benefitsAmount')
                                            : t('placeholders.monthlyIncome')
                                    }
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_unemployment_benefits_amount')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_unemployment_benefits_amount && errors.profile_unemployment_benefits_amount && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_unemployment_benefits_amount}</p>
                            )}
                        </div>
                    )}

                    {/* Income Proof Document - always required when income source is selected */}
                    {data.profile_unemployed_income_source && (
                        <FileUpload
                            label={
                                data.profile_unemployed_income_source === 'unemployment_benefits'
                                    ? t('documents.benefitsStatement')
                                    : t('documents.otherIncomeProof')
                            }
                            required
                            documentType={
                                data.profile_unemployed_income_source === 'unemployment_benefits' ? 'benefits_statement' : 'other_income_proof'
                            }
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                data.profile_unemployed_income_source === 'unemployment_benefits'
                                    ? existingDocuments?.benefits_statement
                                        ? {
                                              originalName: existingDocuments.benefits_statement,
                                              previewUrl: existingDocuments.benefits_statement_url,
                                              size: existingDocuments.benefits_statement_size,
                                              uploadedAt: existingDocuments.benefits_statement_uploaded_at,
                                          }
                                        : null
                                    : existingDocuments?.other_income_proof
                                      ? {
                                            originalName: existingDocuments.other_income_proof,
                                            previewUrl: existingDocuments.other_income_proof_url,
                                            size: existingDocuments.other_income_proof_size,
                                            uploadedAt: existingDocuments.other_income_proof_uploaded_at,
                                        }
                                      : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={
                                data.profile_unemployed_income_source === 'unemployment_benefits'
                                    ? touchedFields.profile_benefits_statement
                                        ? errors.profile_benefits_statement
                                        : undefined
                                    : touchedFields.profile_other_income_proof
                                      ? errors.profile_other_income_proof
                                      : undefined
                            }
                        />
                    )}
                </div>
            )}

            {/* OTHER Employment Situation Section */}
            {isOther && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.situationType')}</label>
                            <SimpleSelect
                                value={data.profile_other_employment_situation}
                                onChange={(value) => handleFieldChange('profile_other_employment_situation', value)}
                                options={OTHER_SITUATIONS}
                                placeholder={t('placeholders.selectSituation')}
                                onBlur={onBlur}
                                aria-invalid={!!(touchedFields.profile_other_employment_situation && errors.profile_other_employment_situation)}
                            />
                            {touchedFields.profile_other_employment_situation && errors.profile_other_employment_situation && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_other_employment_situation}</p>
                            )}
                        </div>

                        {data.profile_other_employment_situation === 'other' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.situationDetails')}</label>
                                <input
                                    type="text"
                                    value={data.profile_other_employment_situation_details}
                                    onChange={(e) => handleFieldChange('profile_other_employment_situation_details', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.situationDetails')}
                                    className={getFieldClass('profile_other_employment_situation_details')}
                                    required
                                />
                                {touchedFields.profile_other_employment_situation_details && errors.profile_other_employment_situation_details && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_other_employment_situation_details}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.expectedReturnToWork')}
                                <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">{t('optional')}</span>
                            </label>
                            <DatePicker
                                value={data.profile_expected_return_to_work}
                                onChange={(value) => handleFieldChange('profile_expected_return_to_work', value)}
                                onBlur={onBlur}
                                min={new Date()}
                            />
                        </div>
                    </div>

                    {/* Other Situation Income Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.monthlyIncome')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={data.profile_income_currency}
                                    onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                    onBlur={onBlur}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={data.profile_other_situation_monthly_income}
                                    onChange={(e) => handleFieldChange('profile_other_situation_monthly_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.monthlyIncome')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_other_situation_monthly_income')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_other_situation_monthly_income && errors.profile_other_situation_monthly_income && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_other_situation_monthly_income}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.incomeSource')}</label>
                            <input
                                type="text"
                                value={data.profile_other_situation_income_source}
                                onChange={(e) => handleFieldChange('profile_other_situation_income_source', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.incomeSource')}
                                className={getFieldClass('profile_other_situation_income_source')}
                                required
                            />
                            {touchedFields.profile_other_situation_income_source && errors.profile_other_situation_income_source && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_other_situation_income_source}</p>
                            )}
                        </div>
                    </div>

                    {/* Other Income Proof Document */}
                    <FileUpload
                        label={t('documents.otherIncomeProof')}
                        required
                        documentType="other_income_proof"
                        uploadUrl="/tenant-profile/document/upload"
                        accept={fileUploadAccept}
                        maxSize={20 * 1024 * 1024}
                        description={fileUploadDescription}
                        existingFile={
                            existingDocuments?.other_income_proof
                                ? {
                                      originalName: existingDocuments.other_income_proof,
                                      previewUrl: existingDocuments.other_income_proof_url,
                                      size: existingDocuments.other_income_proof_size,
                                      uploadedAt: existingDocuments.other_income_proof_uploaded_at,
                                  }
                                : null
                        }
                        onUploadSuccess={handleUploadSuccess}
                        error={touchedFields.profile_other_income_proof ? errors.profile_other_income_proof : undefined}
                    />
                </div>
            )}
        </div>
    );
}
