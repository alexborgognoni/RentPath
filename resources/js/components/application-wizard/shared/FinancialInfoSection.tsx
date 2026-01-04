import { CurrencySelect } from '@/components/ui/currency-select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload';
import { OptionalBadge } from '@/components/ui/optional-badge';
import { Select } from '@/components/ui/select';
import type { Translations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';
import { Briefcase, Building, GraduationCap, HeartHandshake, UserCheck } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

// Re-export validation utilities from the shared location
export { validateFinancialFields } from '@/lib/validation/financial-validation';
export type { FinancialEntityType, FinancialValidationErrors } from '@/lib/validation/financial-validation';

const EMPLOYMENT_STATUS_ICONS = {
    employed: Briefcase,
    self_employed: Building,
    student: GraduationCap,
    unemployed: UserCheck,
    retired: UserCheck,
    other: HeartHandshake,
} as const;

export type EntityType = 'tenant' | 'co_signer' | 'guarantor';

/** Available employment statuses per entity type */
const AVAILABLE_STATUSES: Record<EntityType, readonly string[]> = {
    tenant: ['employed', 'self_employed', 'student', 'retired', 'unemployed', 'other'],
    co_signer: ['employed', 'self_employed', 'student', 'retired', 'unemployed', 'other'],
    guarantor: ['employed', 'self_employed', 'student', 'retired', 'unemployed', 'other'],
} as const;

export interface ExistingDocuments {
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
}

export interface FinancialInfoSectionProps {
    /** Entity type affects available employment statuses */
    entityType: EntityType;
    /** Translations object */
    translations: Translations;
    /** Field prefix (e.g., 'profile_' for tenant, '' for co-signers) */
    fieldPrefix?: string;
    /** Get field value */
    getValue: (field: string) => string;
    /** Set field value */
    setValue: (field: string, value: string) => void;
    /** Get error for field */
    getError: (field: string) => string | undefined;
    /** Check if field was touched */
    isTouched: (field: string) => boolean;
    /** Per-field blur handler - called with prefixed field name (e.g., 'profile_employer_name') */
    onFieldBlur?: (field: string) => void;
    /** Upload URL for documents */
    uploadUrl: string;
    /** Document type prefix (e.g., 'cosigner_0_' for co-signers) */
    documentTypePrefix?: string;
    /** Existing uploaded documents */
    existingDocuments?: ExistingDocuments | null;
    /** Called when document upload succeeds */
    onUploadSuccess?: (file: UploadedFile) => void;
}

const FILE_UPLOAD_ACCEPT = {
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
};

const FILE_UPLOAD_DESCRIPTION = {
    fileTypes: 'PDF, PNG, JPG',
    maxFileSize: '20MB',
};

export function FinancialInfoSection({
    entityType,
    translations,
    fieldPrefix = '',
    getValue,
    setValue,
    getError,
    isTouched,
    onFieldBlur,
    uploadUrl,
    documentTypePrefix = '',
    existingDocuments,
    onUploadSuccess,
}: FinancialInfoSectionProps) {
    const t = (key: string) => translate(translations, `wizard.application.employmentStep.${key}`);

    // Helper to get prefixed field name
    const f = (field: string) => `${fieldPrefix}${field}`;

    // Per-field blur handler - calls onFieldBlur with the prefixed field name
    const handleBlur = useCallback(
        (field: string) => () => {
            onFieldBlur?.(f(field));
        },
        [onFieldBlur, fieldPrefix],
    );

    // Helper to get document type with prefix
    const docType = (type: string) => (documentTypePrefix ? `${documentTypePrefix}${type}` : type);

    // Default employment_status to 'employed' if not set
    const hasSetDefault = useRef(false);
    useEffect(() => {
        if (!hasSetDefault.current) {
            hasSetDefault.current = true;
            const currentStatus = getValue(f('employment_status'));
            if (!currentStatus) {
                setValue(f('employment_status'), 'employed');
            }
        }
    }, [getValue, setValue, f]);

    const getFieldClass = (field: string) => {
        const hasError = isTouched(f(field)) && getError(f(field));
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    // Check if field has error and was touched (for document fields)
    const hasDocError = (field: string) => !!(isTouched(f(field)) && getError(f(field)));
    const getDocError = (field: string) => (hasDocError(field) ? getError(f(field)) : undefined);

    // Build existing file object for FileUpload
    const buildExistingFile = useMemo(
        () => (docName: keyof ExistingDocuments) => {
            if (!existingDocuments || !existingDocuments[docName]) return null;
            const urlKey = `${docName}_url` as keyof ExistingDocuments;
            const sizeKey = `${docName}_size` as keyof ExistingDocuments;
            const uploadedAtKey = `${docName}_uploaded_at` as keyof ExistingDocuments;
            return {
                originalName: existingDocuments[docName] as string,
                previewUrl: existingDocuments[urlKey] as string | undefined,
                size: existingDocuments[sizeKey] as number | undefined,
                uploadedAt: existingDocuments[uploadedAtKey] as number | undefined,
            };
        },
        [existingDocuments],
    );

    // Build options from translations
    const availableStatuses = AVAILABLE_STATUSES[entityType];

    const EMPLOYMENT_STATUSES = useMemo(
        () =>
            availableStatuses.map((value) => ({
                value,
                label: t(`employmentStatuses.${value}`),
                icon: EMPLOYMENT_STATUS_ICONS[value as keyof typeof EMPLOYMENT_STATUS_ICONS],
            })),
        [availableStatuses, translations],
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

    const status = getValue(f('employment_status'));
    const isEmployed = status === 'employed';
    const isSelfEmployed = status === 'self_employed';
    const isStudent = status === 'student';
    const isRetired = status === 'retired';
    const isUnemployed = status === 'unemployed';
    const isOther = status === 'other';

    // Render document uploads for employed status
    const renderEmployedDocuments = () => (
        <div className="grid gap-4 md:grid-cols-2">
            <FileUpload
                label={t('documents.employmentContract') || 'Employment Contract'}
                required
                documentType={docType('employment_contract')}
                uploadUrl={uploadUrl}
                accept={FILE_UPLOAD_ACCEPT}
                maxSize={20 * 1024 * 1024}
                description={FILE_UPLOAD_DESCRIPTION}
                existingFile={buildExistingFile('employment_contract')}
                onUploadSuccess={onUploadSuccess}
                error={getDocError('employment_contract')}
            />
            <FileUpload
                label={t('documents.payslip1') || 'Payslip 1'}
                required
                documentType={docType('payslip_1')}
                uploadUrl={uploadUrl}
                accept={FILE_UPLOAD_ACCEPT}
                maxSize={20 * 1024 * 1024}
                description={FILE_UPLOAD_DESCRIPTION}
                existingFile={buildExistingFile('payslip_1')}
                onUploadSuccess={onUploadSuccess}
                error={getDocError('payslip_1')}
            />
            <FileUpload
                label={t('documents.payslip2') || 'Payslip 2'}
                required
                documentType={docType('payslip_2')}
                uploadUrl={uploadUrl}
                accept={FILE_UPLOAD_ACCEPT}
                maxSize={20 * 1024 * 1024}
                description={FILE_UPLOAD_DESCRIPTION}
                existingFile={buildExistingFile('payslip_2')}
                onUploadSuccess={onUploadSuccess}
                error={getDocError('payslip_2')}
            />
            <FileUpload
                label={t('documents.payslip3') || 'Payslip 3'}
                required
                documentType={docType('payslip_3')}
                uploadUrl={uploadUrl}
                accept={FILE_UPLOAD_ACCEPT}
                maxSize={20 * 1024 * 1024}
                description={FILE_UPLOAD_DESCRIPTION}
                existingFile={buildExistingFile('payslip_3')}
                onUploadSuccess={onUploadSuccess}
                error={getDocError('payslip_3')}
            />
        </div>
    );

    // Render document uploads for self-employed status
    const renderSelfEmployedDocuments = () => (
        <FileUpload
            label={t('documents.incomeProof') || 'Proof of Income'}
            required
            documentType={docType('income_proof')}
            uploadUrl={uploadUrl}
            accept={FILE_UPLOAD_ACCEPT}
            maxSize={20 * 1024 * 1024}
            description={{
                ...FILE_UPLOAD_DESCRIPTION,
                customText: t('documents.selfEmployedHint') || 'Tax returns, bank statements, or accountant letter',
            }}
            existingFile={buildExistingFile('other_income_proof')}
            onUploadSuccess={onUploadSuccess}
            error={getDocError('income_proof')}
        />
    );

    // Render document uploads for student status
    const renderStudentDocuments = () => (
        <FileUpload
            label={t('documents.studentProof') || 'Student Enrollment Proof'}
            required
            documentType={docType('student_proof')}
            uploadUrl={uploadUrl}
            accept={FILE_UPLOAD_ACCEPT}
            maxSize={20 * 1024 * 1024}
            description={FILE_UPLOAD_DESCRIPTION}
            existingFile={buildExistingFile('student_proof')}
            onUploadSuccess={onUploadSuccess}
            error={getDocError('student_proof')}
        />
    );

    // Render document uploads for retired status
    const renderRetiredDocuments = () => (
        <div className="space-y-4">
            <FileUpload
                label={t('documents.pensionStatement') || 'Pension Statement'}
                required
                documentType={docType('pension_statement')}
                uploadUrl={uploadUrl}
                accept={FILE_UPLOAD_ACCEPT}
                maxSize={20 * 1024 * 1024}
                description={FILE_UPLOAD_DESCRIPTION}
                existingFile={buildExistingFile('pension_statement')}
                onUploadSuccess={onUploadSuccess}
                error={getDocError('pension_statement')}
            />
            <FileUpload
                label={t('documents.otherIncomeProof') || 'Other Income Proof'}
                optional
                documentType={docType('other_income_proof')}
                uploadUrl={uploadUrl}
                accept={FILE_UPLOAD_ACCEPT}
                maxSize={20 * 1024 * 1024}
                description={FILE_UPLOAD_DESCRIPTION}
                existingFile={buildExistingFile('other_income_proof')}
                onUploadSuccess={onUploadSuccess}
            />
        </div>
    );

    // Render document uploads for unemployed status (always shown)
    const renderUnemployedDocuments = () => (
        <FileUpload
            label={t('documents.otherIncomeProof') || 'Proof of Income'}
            required
            documentType={docType('other_income_proof')}
            uploadUrl={uploadUrl}
            accept={FILE_UPLOAD_ACCEPT}
            maxSize={20 * 1024 * 1024}
            description={FILE_UPLOAD_DESCRIPTION}
            existingFile={buildExistingFile('other_income_proof')}
            onUploadSuccess={onUploadSuccess}
            error={getDocError('other_income_proof')}
        />
    );

    // Render document uploads for other status
    const renderOtherDocuments = () => (
        <FileUpload
            label={t('documents.otherIncomeProof') || 'Proof of Income'}
            required
            documentType={docType('other_income_proof')}
            uploadUrl={uploadUrl}
            accept={FILE_UPLOAD_ACCEPT}
            maxSize={20 * 1024 * 1024}
            description={FILE_UPLOAD_DESCRIPTION}
            existingFile={buildExistingFile('other_income_proof')}
            onUploadSuccess={onUploadSuccess}
            error={getDocError('other_income_proof')}
        />
    );

    return (
        <div className="space-y-4">
            {/* Employment Status Selection */}
            <div>
                <label className="mb-3 block text-sm font-medium">{t('fields.employmentStatus')}</label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                    {EMPLOYMENT_STATUSES.map((statusOption) => {
                        const Icon = statusOption.icon;
                        const isSelected = getValue(f('employment_status')) === statusOption.value;
                        return (
                            <button
                                key={statusOption.value}
                                type="button"
                                onClick={() => setValue(f('employment_status'), statusOption.value)}
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
                {isTouched(f('employment_status')) && getError(f('employment_status')) && (
                    <p className="mt-2 text-sm text-destructive">{getError(f('employment_status'))}</p>
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
                                value={getValue(f('employer_name'))}
                                onChange={(e) => setValue(f('employer_name'), e.target.value)}
                                onBlur={handleBlur('employer_name')}
                                placeholder={t('placeholders.employerName')}
                                className={getFieldClass('employer_name')}
                                aria-invalid={!!(isTouched(f('employer_name')) && getError(f('employer_name')))}
                                required
                            />
                            {isTouched(f('employer_name')) && getError(f('employer_name')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('employer_name'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.jobTitle')}</label>
                            <input
                                type="text"
                                value={getValue(f('job_title'))}
                                onChange={(e) => setValue(f('job_title'), e.target.value)}
                                onBlur={handleBlur('job_title')}
                                placeholder={t('placeholders.jobTitle')}
                                className={getFieldClass('job_title')}
                                aria-invalid={!!(isTouched(f('job_title')) && getError(f('job_title')))}
                                required
                            />
                            {isTouched(f('job_title')) && getError(f('job_title')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('job_title'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.employmentType')}</label>
                            <Select
                                value={getValue(f('employment_type'))}
                                onChange={(value) => setValue(f('employment_type'), value)}
                                options={EMPLOYMENT_TYPES}
                                placeholder={t('placeholders.selectType')}
                                onBlur={handleBlur('employment_type')}
                                aria-invalid={!!(isTouched(f('employment_type')) && getError(f('employment_type')))}
                            />
                            {isTouched(f('employment_type')) && getError(f('employment_type')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('employment_type'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.employmentStartDate')}</label>
                            <DatePicker
                                value={getValue(f('employment_start_date'))}
                                onChange={(value) => setValue(f('employment_start_date'), value || '')}
                                onBlur={handleBlur('employment_start_date')}
                                max={new Date()}
                                aria-invalid={!!(isTouched(f('employment_start_date')) && getError(f('employment_start_date')))}
                            />
                            {isTouched(f('employment_start_date')) && getError(f('employment_start_date')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('employment_start_date'))}</p>
                            )}
                        </div>
                    </div>

                    {/* Income Fields for Employed */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.grossAnnualSalary')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={getValue(f('income_currency')) || 'eur'}
                                    onChange={(value) => setValue(f('income_currency'), value)}
                                    onBlur={handleBlur('income_currency')}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={getValue(f('gross_annual_income'))}
                                    onChange={(e) => setValue(f('gross_annual_income'), e.target.value)}
                                    onBlur={handleBlur('gross_annual_income')}
                                    placeholder={t('placeholders.grossAnnual')}
                                    min="0"
                                    step="1000"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('gross_annual_income')}`}
                                    aria-invalid={!!(isTouched(f('gross_annual_income')) && getError(f('gross_annual_income')))}
                                    required
                                />
                            </div>
                            {isTouched(f('gross_annual_income')) && getError(f('gross_annual_income')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('gross_annual_income'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.netMonthlyIncome')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={getValue(f('income_currency')) || 'eur'}
                                    onChange={(value) => setValue(f('income_currency'), value)}
                                    onBlur={handleBlur('income_currency')}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={getValue(f('net_monthly_income'))}
                                    onChange={(e) => setValue(f('net_monthly_income'), e.target.value)}
                                    onBlur={handleBlur('net_monthly_income')}
                                    placeholder={t('placeholders.netMonthly')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('net_monthly_income')}`}
                                    aria-invalid={!!(isTouched(f('net_monthly_income')) && getError(f('net_monthly_income')))}
                                    required
                                />
                            </div>
                            {isTouched(f('net_monthly_income')) && getError(f('net_monthly_income')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('net_monthly_income'))}</p>
                            )}
                        </div>
                    </div>

                    {/* Document uploads for employed */}
                    {renderEmployedDocuments()}
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
                                value={getValue(f('business_name'))}
                                onChange={(e) => setValue(f('business_name'), e.target.value)}
                                onBlur={handleBlur('business_name')}
                                placeholder={t('placeholders.businessName')}
                                className={getFieldClass('business_name')}
                                aria-invalid={!!(isTouched(f('business_name')) && getError(f('business_name')))}
                                required
                            />
                            {isTouched(f('business_name')) && getError(f('business_name')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('business_name'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.businessType')}</label>
                            <Select
                                value={getValue(f('business_type'))}
                                onChange={(value) => setValue(f('business_type'), value)}
                                options={BUSINESS_TYPES}
                                placeholder={t('placeholders.selectBusinessType')}
                                onBlur={handleBlur('business_type')}
                                aria-invalid={!!(isTouched(f('business_type')) && getError(f('business_type')))}
                            />
                            {isTouched(f('business_type')) && getError(f('business_type')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('business_type'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.businessStartDate')}</label>
                            <DatePicker
                                value={getValue(f('business_start_date'))}
                                onChange={(value) => setValue(f('business_start_date'), value || '')}
                                onBlur={handleBlur('business_start_date')}
                                max={new Date()}
                                aria-invalid={!!(isTouched(f('business_start_date')) && getError(f('business_start_date')))}
                            />
                            {isTouched(f('business_start_date')) && getError(f('business_start_date')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('business_start_date'))}</p>
                            )}
                        </div>
                    </div>

                    {/* Income Fields for Self-Employed */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.grossAnnualRevenue')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={getValue(f('income_currency')) || 'eur'}
                                    onChange={(value) => setValue(f('income_currency'), value)}
                                    onBlur={handleBlur('income_currency')}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={getValue(f('gross_annual_revenue'))}
                                    onChange={(e) => setValue(f('gross_annual_revenue'), e.target.value)}
                                    onBlur={handleBlur('gross_annual_revenue')}
                                    placeholder={t('placeholders.grossRevenue')}
                                    min="0"
                                    step="1000"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('gross_annual_revenue')}`}
                                    aria-invalid={!!(isTouched(f('gross_annual_revenue')) && getError(f('gross_annual_revenue')))}
                                    required
                                />
                            </div>
                            {isTouched(f('gross_annual_revenue')) && getError(f('gross_annual_revenue')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('gross_annual_revenue'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.netMonthlyIncome')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={getValue(f('income_currency')) || 'eur'}
                                    onChange={(value) => setValue(f('income_currency'), value)}
                                    onBlur={handleBlur('income_currency')}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={getValue(f('net_monthly_income'))}
                                    onChange={(e) => setValue(f('net_monthly_income'), e.target.value)}
                                    onBlur={handleBlur('net_monthly_income')}
                                    placeholder={t('placeholders.netMonthly')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('net_monthly_income')}`}
                                    aria-invalid={!!(isTouched(f('net_monthly_income')) && getError(f('net_monthly_income')))}
                                    required
                                />
                            </div>
                            {isTouched(f('net_monthly_income')) && getError(f('net_monthly_income')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('net_monthly_income'))}</p>
                            )}
                        </div>
                    </div>

                    {/* Self-Employed Documents Note */}
                    <p className="text-sm text-muted-foreground">{t('hints.selfEmployedDocs')}</p>

                    {/* Document uploads for self-employed */}
                    {renderSelfEmployedDocuments()}
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
                                value={getValue(f('university_name'))}
                                onChange={(e) => setValue(f('university_name'), e.target.value)}
                                onBlur={handleBlur('university_name')}
                                placeholder={t('placeholders.universityName')}
                                className={getFieldClass('university_name')}
                                aria-invalid={!!(isTouched(f('university_name')) && getError(f('university_name')))}
                                required
                            />
                            {isTouched(f('university_name')) && getError(f('university_name')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('university_name'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.programOfStudy')}</label>
                            <input
                                type="text"
                                value={getValue(f('program_of_study'))}
                                onChange={(e) => setValue(f('program_of_study'), e.target.value)}
                                onBlur={handleBlur('program_of_study')}
                                placeholder={t('placeholders.programOfStudy')}
                                className={getFieldClass('program_of_study')}
                                aria-invalid={!!(isTouched(f('program_of_study')) && getError(f('program_of_study')))}
                                required
                            />
                            {isTouched(f('program_of_study')) && getError(f('program_of_study')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('program_of_study'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.expectedGraduation')}
                                <OptionalBadge />
                            </label>
                            <DatePicker
                                value={getValue(f('expected_graduation_date'))}
                                onChange={(value) => setValue(f('expected_graduation_date'), value || '')}
                                onBlur={handleBlur('expected_graduation_date')}
                                min={new Date()}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.studentIncomeSource')}</label>
                            <Select
                                value={getValue(f('student_income_source_type'))}
                                onChange={(value) => setValue(f('student_income_source_type'), value)}
                                options={STUDENT_INCOME_SOURCES}
                                placeholder={t('placeholders.selectIncomeSource')}
                                onBlur={handleBlur('student_income_source_type')}
                                aria-invalid={!!(isTouched(f('student_income_source_type')) && getError(f('student_income_source_type')))}
                            />
                            {isTouched(f('student_income_source_type')) && getError(f('student_income_source_type')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('student_income_source_type'))}</p>
                            )}
                        </div>

                        {/* Other income source specification */}
                        {getValue(f('student_income_source_type')) === 'other' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.incomeSourceOther')}</label>
                                <input
                                    type="text"
                                    value={getValue(f('student_income_source_other'))}
                                    onChange={(e) => setValue(f('student_income_source_other'), e.target.value)}
                                    onBlur={handleBlur('student_income_source_other')}
                                    placeholder={t('placeholders.specifyIncomeSource')}
                                    className={getFieldClass('student_income_source_other')}
                                    aria-invalid={!!(isTouched(f('student_income_source_other')) && getError(f('student_income_source_other')))}
                                    required
                                />
                                {isTouched(f('student_income_source_other')) && getError(f('student_income_source_other')) && (
                                    <p className="mt-1 text-sm text-destructive">{getError(f('student_income_source_other'))}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Student Income */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('fields.studentMonthlyIncome')}</label>
                        <div className="flex">
                            <CurrencySelect
                                value={getValue(f('income_currency')) || 'eur'}
                                onChange={(value) => setValue(f('income_currency'), value)}
                                onBlur={handleBlur('income_currency')}
                                compact
                            />
                            <input
                                type="number"
                                value={getValue(f('student_monthly_income'))}
                                onChange={(e) => setValue(f('student_monthly_income'), e.target.value)}
                                onBlur={handleBlur('student_monthly_income')}
                                placeholder={t('placeholders.monthlyIncome')}
                                min="0"
                                step="100"
                                className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('student_monthly_income')}`}
                                aria-invalid={!!(isTouched(f('student_monthly_income')) && getError(f('student_monthly_income')))}
                                required
                            />
                        </div>
                        {getValue(f('student_income_source_type')) === 'student_loan' && (
                            <p className="mt-1 text-xs text-amber-600">{t('hints.studentLoanNote')}</p>
                        )}
                        {isTouched(f('student_monthly_income')) && getError(f('student_monthly_income')) && (
                            <p className="mt-1 text-sm text-destructive">{getError(f('student_monthly_income'))}</p>
                        )}
                    </div>

                    {/* Document uploads for student */}
                    {renderStudentDocuments()}
                </div>
            )}

            {/* RETIRED Section */}
            {isRetired && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.pensionType')}</label>
                            <Select
                                value={getValue(f('pension_type'))}
                                onChange={(value) => setValue(f('pension_type'), value)}
                                options={PENSION_TYPES}
                                placeholder={t('placeholders.selectPensionType')}
                                onBlur={handleBlur('pension_type')}
                                aria-invalid={!!(isTouched(f('pension_type')) && getError(f('pension_type')))}
                            />
                            {isTouched(f('pension_type')) && getError(f('pension_type')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('pension_type'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.pensionProvider')}
                                <OptionalBadge />
                            </label>
                            <input
                                type="text"
                                value={getValue(f('pension_provider'))}
                                onChange={(e) => setValue(f('pension_provider'), e.target.value)}
                                onBlur={handleBlur('pension_provider')}
                                placeholder={t('placeholders.pensionProvider')}
                                className={getFieldClass('pension_provider')}
                            />
                        </div>
                    </div>

                    {/* Pension Income Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.monthlyPension')}</label>
                            <div className="flex">
                                <CurrencySelect
                                    value={getValue(f('income_currency')) || 'eur'}
                                    onChange={(value) => setValue(f('income_currency'), value)}
                                    onBlur={handleBlur('income_currency')}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={getValue(f('pension_monthly_income'))}
                                    onChange={(e) => setValue(f('pension_monthly_income'), e.target.value)}
                                    onBlur={handleBlur('pension_monthly_income')}
                                    placeholder={t('placeholders.monthlyPension')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('pension_monthly_income')}`}
                                    aria-invalid={!!(isTouched(f('pension_monthly_income')) && getError(f('pension_monthly_income')))}
                                    required
                                />
                            </div>
                            {isTouched(f('pension_monthly_income')) && getError(f('pension_monthly_income')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('pension_monthly_income'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.otherRetirementIncome')}
                                <OptionalBadge />
                            </label>
                            <div className="flex">
                                <CurrencySelect
                                    value={getValue(f('income_currency')) || 'eur'}
                                    onChange={(value) => setValue(f('income_currency'), value)}
                                    onBlur={handleBlur('income_currency')}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={getValue(f('retirement_other_income'))}
                                    onChange={(e) => setValue(f('retirement_other_income'), e.target.value)}
                                    onBlur={handleBlur('retirement_other_income')}
                                    placeholder={t('placeholders.otherIncome')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('retirement_other_income')}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Document uploads for retired */}
                    {renderRetiredDocuments()}
                </div>
            )}

            {/* UNEMPLOYED Section */}
            {isUnemployed && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.incomeSource')}</label>
                            <Select
                                value={getValue(f('unemployed_income_source'))}
                                onChange={(value) => setValue(f('unemployed_income_source'), value)}
                                options={UNEMPLOYED_INCOME_SOURCES}
                                placeholder={t('placeholders.selectIncomeSource')}
                                onBlur={handleBlur('unemployed_income_source')}
                                aria-invalid={!!(isTouched(f('unemployed_income_source')) && getError(f('unemployed_income_source')))}
                            />
                            {isTouched(f('unemployed_income_source')) && getError(f('unemployed_income_source')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('unemployed_income_source'))}</p>
                            )}
                        </div>

                        {/* Other income source specification */}
                        {getValue(f('unemployed_income_source')) === 'other' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.incomeSourceOther')}</label>
                                <input
                                    type="text"
                                    value={getValue(f('unemployed_income_source_other'))}
                                    onChange={(e) => setValue(f('unemployed_income_source_other'), e.target.value)}
                                    onBlur={handleBlur('unemployed_income_source_other')}
                                    placeholder={t('placeholders.specifyIncomeSource')}
                                    className={getFieldClass('unemployed_income_source_other')}
                                    aria-invalid={!!(isTouched(f('unemployed_income_source_other')) && getError(f('unemployed_income_source_other')))}
                                    required
                                />
                                {isTouched(f('unemployed_income_source_other')) && getError(f('unemployed_income_source_other')) && (
                                    <p className="mt-1 text-sm text-destructive">{getError(f('unemployed_income_source_other'))}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Monthly Income - always shown */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('fields.monthlyIncome')}</label>
                        <div className="flex">
                            <CurrencySelect
                                value={getValue(f('income_currency')) || 'eur'}
                                onChange={(value) => setValue(f('income_currency'), value)}
                                onBlur={handleBlur('income_currency')}
                                compact
                            />
                            <input
                                type="number"
                                value={getValue(f('unemployment_benefits_amount'))}
                                onChange={(e) => setValue(f('unemployment_benefits_amount'), e.target.value)}
                                onBlur={handleBlur('unemployment_benefits_amount')}
                                placeholder={t('placeholders.monthlyIncome')}
                                min="0"
                                step="100"
                                className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('unemployment_benefits_amount')}`}
                                aria-invalid={!!(isTouched(f('unemployment_benefits_amount')) && getError(f('unemployment_benefits_amount')))}
                                required
                            />
                        </div>
                        {isTouched(f('unemployment_benefits_amount')) && getError(f('unemployment_benefits_amount')) && (
                            <p className="mt-1 text-sm text-destructive">{getError(f('unemployment_benefits_amount'))}</p>
                        )}
                    </div>

                    {/* Document uploads for unemployed - always shown */}
                    {renderUnemployedDocuments()}
                </div>
            )}

            {/* OTHER Employment Situation Section */}
            {isOther && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.situationType')}</label>
                            <Select
                                value={getValue(f('other_employment_situation'))}
                                onChange={(value) => setValue(f('other_employment_situation'), value)}
                                options={OTHER_SITUATIONS}
                                placeholder={t('placeholders.selectSituation')}
                                onBlur={handleBlur('other_employment_situation')}
                                aria-invalid={!!(isTouched(f('other_employment_situation')) && getError(f('other_employment_situation')))}
                            />
                            {isTouched(f('other_employment_situation')) && getError(f('other_employment_situation')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('other_employment_situation'))}</p>
                            )}
                        </div>

                        {getValue(f('other_employment_situation')) === 'other' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.situationDetails')}</label>
                                <input
                                    type="text"
                                    value={getValue(f('other_employment_situation_details'))}
                                    onChange={(e) => setValue(f('other_employment_situation_details'), e.target.value)}
                                    onBlur={handleBlur('other_employment_situation_details')}
                                    placeholder={t('placeholders.situationDetails')}
                                    className={getFieldClass('other_employment_situation_details')}
                                    aria-invalid={
                                        !!(isTouched(f('other_employment_situation_details')) && getError(f('other_employment_situation_details')))
                                    }
                                    required
                                />
                                {isTouched(f('other_employment_situation_details')) && getError(f('other_employment_situation_details')) && (
                                    <p className="mt-1 text-sm text-destructive">{getError(f('other_employment_situation_details'))}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.expectedReturnToWork')}
                                <OptionalBadge />
                            </label>
                            <DatePicker
                                value={getValue(f('expected_return_to_work'))}
                                onChange={(value) => setValue(f('expected_return_to_work'), value || '')}
                                onBlur={handleBlur('expected_return_to_work')}
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
                                    value={getValue(f('income_currency')) || 'eur'}
                                    onChange={(value) => setValue(f('income_currency'), value)}
                                    onBlur={handleBlur('income_currency')}
                                    compact
                                />
                                <input
                                    type="number"
                                    value={getValue(f('other_situation_monthly_income'))}
                                    onChange={(e) => setValue(f('other_situation_monthly_income'), e.target.value)}
                                    onBlur={handleBlur('other_situation_monthly_income')}
                                    placeholder={t('placeholders.monthlyIncome')}
                                    min="0"
                                    step="100"
                                    className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('other_situation_monthly_income')}`}
                                    aria-invalid={!!(isTouched(f('other_situation_monthly_income')) && getError(f('other_situation_monthly_income')))}
                                    required
                                />
                            </div>
                            {isTouched(f('other_situation_monthly_income')) && getError(f('other_situation_monthly_income')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('other_situation_monthly_income'))}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.incomeSource')}</label>
                            <input
                                type="text"
                                value={getValue(f('other_situation_income_source'))}
                                onChange={(e) => setValue(f('other_situation_income_source'), e.target.value)}
                                onBlur={handleBlur('other_situation_income_source')}
                                placeholder={t('placeholders.incomeSource')}
                                className={getFieldClass('other_situation_income_source')}
                                aria-invalid={!!(isTouched(f('other_situation_income_source')) && getError(f('other_situation_income_source')))}
                                required
                            />
                            {isTouched(f('other_situation_income_source')) && getError(f('other_situation_income_source')) && (
                                <p className="mt-1 text-sm text-destructive">{getError(f('other_situation_income_source'))}</p>
                            )}
                        </div>
                    </div>

                    {/* Document uploads for other */}
                    {renderOtherDocuments()}
                </div>
            )}
        </div>
    );
}
