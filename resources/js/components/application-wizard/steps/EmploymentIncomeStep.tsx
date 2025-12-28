import { CurrencySelect } from '@/components/ui/currency-select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { SimpleSelect } from '@/components/ui/simple-select';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { router } from '@inertiajs/react';
import { Briefcase, GraduationCap, UserCheck } from 'lucide-react';
import { useCallback } from 'react';

const EMPLOYMENT_STATUSES = [
    { value: 'employed', label: 'Employed', icon: Briefcase },
    { value: 'self_employed', label: 'Self-Employed', icon: Briefcase },
    { value: 'student', label: 'Student', icon: GraduationCap },
    { value: 'unemployed', label: 'Unemployed', icon: UserCheck },
    { value: 'retired', label: 'Retired', icon: UserCheck },
] as const;

const EMPLOYMENT_TYPES = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
] as const;

const GUARANTOR_RELATIONSHIPS = [
    { value: 'Parent', label: 'Parent' },
    { value: 'Grandparent', label: 'Grandparent' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Partner', label: 'Partner' },
    { value: 'Other Family', label: 'Other Family' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Employer', label: 'Employer' },
    { value: 'Other', label: 'Other' },
] as const;

interface EmploymentIncomeStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    existingDocuments?: {
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
        other_income_proof?: string;
        other_income_proof_url?: string;
        other_income_proof_size?: number;
        other_income_proof_uploaded_at?: number;
        guarantor_id?: string;
        guarantor_id_url?: string;
        guarantor_id_size?: number;
        guarantor_id_uploaded_at?: number;
        guarantor_proof_income?: string;
        guarantor_proof_income_url?: string;
        guarantor_proof_income_size?: number;
        guarantor_proof_income_uploaded_at?: number;
    };
}

export function EmploymentIncomeStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onBlur,
    existingDocuments,
}: EmploymentIncomeStepProps) {
    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    const getFieldClass = (field: string) => {
        const hasError = touchedFields[field] && errors[field];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    const isEmployed = data.profile_employment_status === 'employed' || data.profile_employment_status === 'self_employed';
    const isStudent = data.profile_employment_status === 'student';
    const isUnemployedOrRetired = data.profile_employment_status === 'unemployed' || data.profile_employment_status === 'retired';

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
                <h2 className="text-xl font-bold">Employment & Income</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    This information helps landlords assess your ability to pay rent. It will be saved to your profile.
                </p>
            </div>

            {/* Employment Status Selection */}
            <div>
                <label className="mb-3 block text-sm font-medium">Employment Status </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {EMPLOYMENT_STATUSES.map((status) => {
                        const Icon = status.icon;
                        const isSelected = data.profile_employment_status === status.value;
                        return (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() => handleFieldChange('profile_employment_status', status.value)}
                                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                                    isSelected
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{status.label}</span>
                            </button>
                        );
                    })}
                </div>
                {touchedFields.profile_employment_status && errors.profile_employment_status && (
                    <p className="mt-2 text-sm text-destructive">{errors.profile_employment_status}</p>
                )}
            </div>

            {/* Employed / Self-Employed Fields */}
            {isEmployed && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Employer Name </label>
                            <input
                                type="text"
                                value={data.profile_employer_name}
                                onChange={(e) => handleFieldChange('profile_employer_name', e.target.value)}
                                onBlur={onBlur}
                                placeholder="Acme Corporation"
                                className={getFieldClass('profile_employer_name')}
                                required
                            />
                            {touchedFields.profile_employer_name && errors.profile_employer_name && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_employer_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Job Title </label>
                            <input
                                type="text"
                                value={data.profile_job_title}
                                onChange={(e) => handleFieldChange('profile_job_title', e.target.value)}
                                onBlur={onBlur}
                                placeholder="Software Engineer"
                                className={getFieldClass('profile_job_title')}
                                required
                            />
                            {touchedFields.profile_job_title && errors.profile_job_title && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_job_title}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Employment Type</label>
                            <SimpleSelect
                                value={data.profile_employment_type}
                                onChange={(value) => handleFieldChange('profile_employment_type', value)}
                                options={EMPLOYMENT_TYPES}
                                placeholder="Select type..."
                                onBlur={onBlur}
                                aria-invalid={!!(touchedFields.profile_employment_type && errors.profile_employment_type)}
                            />
                            {touchedFields.profile_employment_type && errors.profile_employment_type && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_employment_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Employment Start Date </label>
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

                    {/* Income */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Monthly Income (Gross)</label>
                        <div className="flex">
                            <CurrencySelect
                                value={data.profile_income_currency}
                                onChange={(value) => handleFieldChange('profile_income_currency', value)}
                                onBlur={onBlur}
                                compact
                            />
                            <input
                                type="number"
                                value={data.profile_monthly_income}
                                onChange={(e) => handleFieldChange('profile_monthly_income', e.target.value)}
                                onBlur={onBlur}
                                placeholder="3500"
                                min="0"
                                step="100"
                                className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_monthly_income')}`}
                                required
                            />
                        </div>
                        {touchedFields.profile_monthly_income && errors.profile_monthly_income && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_monthly_income}</p>
                        )}
                    </div>

                    {/* Employment Documents */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <FileUpload
                            label="Employment Contract"
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
                            label="Recent Payslip (1)"
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
                            label="Recent Payslip (2)"
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
                            label="Recent Payslip (3)"
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

            {/* Student Fields */}
            {isStudent && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">University / Institution </label>
                            <input
                                type="text"
                                value={data.profile_university_name}
                                onChange={(e) => handleFieldChange('profile_university_name', e.target.value)}
                                onBlur={onBlur}
                                placeholder="University of Amsterdam"
                                className={getFieldClass('profile_university_name')}
                                required
                            />
                            {touchedFields.profile_university_name && errors.profile_university_name && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_university_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Program of Study </label>
                            <input
                                type="text"
                                value={data.profile_program_of_study}
                                onChange={(e) => handleFieldChange('profile_program_of_study', e.target.value)}
                                onBlur={onBlur}
                                placeholder="Computer Science"
                                className={getFieldClass('profile_program_of_study')}
                                required
                            />
                            {touchedFields.profile_program_of_study && errors.profile_program_of_study && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_program_of_study}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Expected Graduation Date <span className="text-muted-foreground">(optional)</span>
                            </label>
                            <DatePicker
                                value={data.profile_expected_graduation_date}
                                onChange={(value) => handleFieldChange('profile_expected_graduation_date', value)}
                                onBlur={onBlur}
                                min={new Date()}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Income Source <span className="text-muted-foreground">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={data.profile_student_income_source}
                                onChange={(e) => handleFieldChange('profile_student_income_source', e.target.value)}
                                onBlur={onBlur}
                                placeholder="Scholarship, Part-time job, Parents"
                                className={getFieldClass('profile_student_income_source')}
                            />
                        </div>
                    </div>

                    {/* Monthly Income for Students */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Monthly Income <span className="text-muted-foreground">(optional)</span>
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
                                value={data.profile_monthly_income}
                                onChange={(e) => handleFieldChange('profile_monthly_income', e.target.value)}
                                onBlur={onBlur}
                                placeholder="0"
                                min="0"
                                step="100"
                                className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_monthly_income')}`}
                            />
                        </div>
                    </div>

                    {/* Student Document */}
                    <FileUpload
                        label="Proof of Student Status (enrollment letter, student ID)"
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

            {/* Unemployed / Retired Fields */}
            {isUnemployedOrRetired && (
                <div className="space-y-4">
                    {/* Optional: Monthly Income field */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Monthly Income <span className="text-muted-foreground">(optional)</span>
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
                                value={data.profile_monthly_income}
                                onChange={(e) => handleFieldChange('profile_monthly_income', e.target.value)}
                                onBlur={onBlur}
                                placeholder="0"
                                min="0"
                                step="100"
                                className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_monthly_income')}`}
                            />
                        </div>
                    </div>

                    {/* Income Proof Document */}
                    <FileUpload
                        label={
                            data.profile_employment_status === 'retired'
                                ? 'Proof of Pension/Retirement Income'
                                : 'Proof of Income Source (benefits statement, bank statements, etc.)'
                        }
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

            {/* Guarantor Section */}
            <div className="border-t border-border pt-6">
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="has_guarantor"
                        checked={data.profile_has_guarantor}
                        onChange={(e) => handleFieldChange('profile_has_guarantor', e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label htmlFor="has_guarantor" className="text-sm font-medium">
                        I have a guarantor
                    </label>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                    A guarantor is someone who agrees to pay your rent if you cannot. This is often required for students or first-time renters.
                </p>

                {data.profile_has_guarantor && (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Guarantor Name </label>
                                <input
                                    type="text"
                                    value={data.profile_guarantor_name}
                                    onChange={(e) => handleFieldChange('profile_guarantor_name', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="John Smith"
                                    className={getFieldClass('profile_guarantor_name')}
                                    required
                                />
                                {touchedFields.profile_guarantor_name && errors.profile_guarantor_name && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_guarantor_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Relationship</label>
                                <SimpleSelect
                                    value={data.profile_guarantor_relationship}
                                    onChange={(value) => handleFieldChange('profile_guarantor_relationship', value)}
                                    options={GUARANTOR_RELATIONSHIPS}
                                    placeholder="Select relationship..."
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields.profile_guarantor_relationship && errors.profile_guarantor_relationship)}
                                />
                                {touchedFields.profile_guarantor_relationship && errors.profile_guarantor_relationship && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_guarantor_relationship}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Guarantor Phone <span className="text-muted-foreground">(optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.profile_guarantor_phone}
                                    onChange={(e) => handleFieldChange('profile_guarantor_phone', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="+31 612345678"
                                    className={getFieldClass('profile_guarantor_phone')}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Guarantor Email <span className="text-muted-foreground">(optional)</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.profile_guarantor_email}
                                    onChange={(e) => handleFieldChange('profile_guarantor_email', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="guarantor@example.com"
                                    className={getFieldClass('profile_guarantor_email')}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Guarantor Address <span className="text-muted-foreground">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.profile_guarantor_address}
                                    onChange={(e) => handleFieldChange('profile_guarantor_address', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="123 Main Street, Amsterdam, 1012 AB, Netherlands"
                                    className={getFieldClass('profile_guarantor_address')}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Guarantor Employer <span className="text-muted-foreground">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.profile_guarantor_employer}
                                    onChange={(e) => handleFieldChange('profile_guarantor_employer', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="Company Name"
                                    className={getFieldClass('profile_guarantor_employer')}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Guarantor Monthly Income</label>
                                <div className="flex">
                                    <CurrencySelect
                                        value={data.profile_guarantor_income_currency}
                                        onChange={(value) => handleFieldChange('profile_guarantor_income_currency', value)}
                                        onBlur={onBlur}
                                        compact
                                    />
                                    <input
                                        type="number"
                                        value={data.profile_guarantor_monthly_income}
                                        onChange={(e) => handleFieldChange('profile_guarantor_monthly_income', e.target.value)}
                                        onBlur={onBlur}
                                        placeholder="5000"
                                        min="0"
                                        step="100"
                                        className={`w-full rounded-l-none rounded-r-lg ${getFieldClass('profile_guarantor_monthly_income')}`}
                                        required
                                    />
                                </div>
                                {touchedFields.profile_guarantor_monthly_income && errors.profile_guarantor_monthly_income && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_guarantor_monthly_income}</p>
                                )}
                            </div>
                        </div>

                        {/* Guarantor Documents */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <FileUpload
                                label="Guarantor ID Document"
                                required
                                documentType="guarantor_id"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.guarantor_id
                                        ? {
                                              originalName: existingDocuments.guarantor_id,
                                              previewUrl: existingDocuments.guarantor_id_url,
                                              size: existingDocuments.guarantor_id_size,
                                              uploadedAt: existingDocuments.guarantor_id_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_guarantor_id ? errors.profile_guarantor_id : undefined}
                            />
                            <FileUpload
                                label="Guarantor Proof of Income"
                                required
                                documentType="guarantor_proof_income"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.guarantor_proof_income
                                        ? {
                                              originalName: existingDocuments.guarantor_proof_income,
                                              previewUrl: existingDocuments.guarantor_proof_income_url,
                                              size: existingDocuments.guarantor_proof_income_size,
                                              uploadedAt: existingDocuments.guarantor_proof_income_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_guarantor_proof_income ? errors.profile_guarantor_proof_income : undefined}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
