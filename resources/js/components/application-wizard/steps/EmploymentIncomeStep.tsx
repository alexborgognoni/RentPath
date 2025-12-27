import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { CURRENCIES } from '@/lib/validation/property-validation';
import { Briefcase, FileText, GraduationCap, Upload, UserCheck, X } from 'lucide-react';

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

const GUARANTOR_RELATIONSHIPS = ['Parent', 'Grandparent', 'Sibling', 'Spouse', 'Partner', 'Other Family', 'Friend', 'Employer', 'Other'];

const CURRENCY_SYMBOLS: Record<string, string> = {
    eur: '€',
    usd: '$',
    gbp: '£',
    chf: 'CHF',
};

interface EmploymentIncomeStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    existingDocuments?: {
        id_document?: string;
        employment_contract?: string;
        payslip_1?: string;
        payslip_2?: string;
        payslip_3?: string;
        student_proof?: string;
        guarantor_id?: string;
        guarantor_proof_income?: string;
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

    const handleFileChange = (field: keyof ApplicationWizardData, file: File | null) => {
        updateField(field, file);
        markFieldTouched(field);
    };

    const renderFileInput = (field: keyof ApplicationWizardData, label: string, required: boolean = false, existingFileName?: string) => {
        const file = data[field] as File | null;
        const hasExisting = existingFileName && !file;

        return (
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {hasExisting ? (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 dark:border-green-800 dark:bg-green-950">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="flex-1 truncate text-sm text-green-700 dark:text-green-300">{existingFileName}</span>
                        <button
                            type="button"
                            onClick={() => handleFileChange(field, null)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Replace
                        </button>
                    </div>
                ) : file ? (
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="flex-1 truncate text-sm">{file.name}</span>
                        <button type="button" onClick={() => handleFileChange(field, null)} className="text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-colors hover:border-primary hover:bg-muted/50 ${touchedFields[field] && errors[field] ? 'border-destructive' : 'border-border'}`}
                    >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload</span>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                            className="hidden"
                        />
                    </label>
                )}
                {touchedFields[field] && errors[field] && <p className="mt-1 text-sm text-destructive">{errors[field]}</p>}
            </div>
        );
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
                <label className="mb-3 block text-sm font-medium">
                    Employment Status <span className="text-red-500">*</span>
                </label>
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
                <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold">Employment Details</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Employer Name <span className="text-red-500">*</span>
                            </label>
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
                            <label className="mb-2 block text-sm font-medium">
                                Job Title <span className="text-red-500">*</span>
                            </label>
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
                            <select
                                value={data.profile_employment_type}
                                onChange={(e) => handleFieldChange('profile_employment_type', e.target.value)}
                                onBlur={onBlur}
                                className={getFieldClass('profile_employment_type')}
                            >
                                <option value="">Select type...</option>
                                {EMPLOYMENT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Employment Start Date</label>
                            <input
                                type="date"
                                value={data.profile_employment_start_date}
                                onChange={(e) => handleFieldChange('profile_employment_start_date', e.target.value)}
                                onBlur={onBlur}
                                max={new Date().toISOString().split('T')[0]}
                                className={getFieldClass('profile_employment_start_date')}
                            />
                        </div>
                    </div>

                    {/* Income */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Monthly Income (Gross) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={data.profile_income_currency}
                                    onChange={(e) => handleFieldChange('profile_income_currency', e.target.value)}
                                    className="w-24 rounded-lg border border-border bg-background px-3 py-2"
                                >
                                    {CURRENCIES.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {CURRENCY_SYMBOLS[currency]} ({currency.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={data.profile_monthly_income}
                                    onChange={(e) => handleFieldChange('profile_monthly_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="3500"
                                    min="0"
                                    step="100"
                                    className={`flex-1 ${getFieldClass('profile_monthly_income')}`}
                                    required
                                />
                            </div>
                            {touchedFields.profile_monthly_income && errors.profile_monthly_income && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_monthly_income}</p>
                            )}
                        </div>
                    </div>

                    {/* Employment Documents */}
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium">Employment Documents</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                            {renderFileInput('profile_employment_contract', 'Employment Contract', true, existingDocuments?.employment_contract)}
                            {renderFileInput('profile_payslip_1', 'Recent Payslip (1)', true, existingDocuments?.payslip_1)}
                            {renderFileInput('profile_payslip_2', 'Recent Payslip (2)', true, existingDocuments?.payslip_2)}
                            {renderFileInput('profile_payslip_3', 'Recent Payslip (3)', true, existingDocuments?.payslip_3)}
                        </div>
                    </div>
                </div>
            )}

            {/* Student Fields */}
            {isStudent && (
                <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold">Student Information</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                University / Institution <span className="text-red-500">*</span>
                            </label>
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
                            <label className="mb-2 block text-sm font-medium">
                                Program of Study <span className="text-red-500">*</span>
                            </label>
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
                            <label className="mb-2 block text-sm font-medium">Expected Graduation Date</label>
                            <input
                                type="date"
                                value={data.profile_expected_graduation_date}
                                onChange={(e) => handleFieldChange('profile_expected_graduation_date', e.target.value)}
                                onBlur={onBlur}
                                min={new Date().toISOString().split('T')[0]}
                                className={getFieldClass('profile_expected_graduation_date')}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Income Source</label>
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
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Monthly Income (if any)</label>
                            <div className="flex gap-2">
                                <select
                                    value={data.profile_income_currency}
                                    onChange={(e) => handleFieldChange('profile_income_currency', e.target.value)}
                                    className="w-24 rounded-lg border border-border bg-background px-3 py-2"
                                >
                                    {CURRENCIES.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {CURRENCY_SYMBOLS[currency]} ({currency.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={data.profile_monthly_income}
                                    onChange={(e) => handleFieldChange('profile_monthly_income', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="0"
                                    min="0"
                                    step="100"
                                    className={`flex-1 ${getFieldClass('profile_monthly_income')}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Student Document */}
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium">Student Documents</h4>
                        {renderFileInput(
                            'profile_student_proof',
                            'Proof of Student Status (enrollment letter, student ID)',
                            true,
                            existingDocuments?.student_proof,
                        )}
                    </div>
                </div>
            )}

            {/* ID Document - Required for all */}
            <div className="border-t border-border pt-6">
                <h3 className="mb-3 font-semibold">Identity Document</h3>
                <p className="mb-4 text-sm text-muted-foreground">A valid ID is required for all applications.</p>
                {renderFileInput('profile_id_document', 'ID Document (Passport, ID Card, Drivers License)', true, existingDocuments?.id_document)}
            </div>

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
                    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
                        <h4 className="font-semibold">Guarantor Information</h4>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Guarantor Name <span className="text-red-500">*</span>
                                </label>
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
                                <label className="mb-2 block text-sm font-medium">
                                    Relationship <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.profile_guarantor_relationship}
                                    onChange={(e) => handleFieldChange('profile_guarantor_relationship', e.target.value)}
                                    onBlur={onBlur}
                                    className={getFieldClass('profile_guarantor_relationship')}
                                    required
                                >
                                    <option value="">Select relationship...</option>
                                    {GUARANTOR_RELATIONSHIPS.map((rel) => (
                                        <option key={rel} value={rel}>
                                            {rel}
                                        </option>
                                    ))}
                                </select>
                                {touchedFields.profile_guarantor_relationship && errors.profile_guarantor_relationship && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_guarantor_relationship}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Guarantor Phone</label>
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
                                <label className="mb-2 block text-sm font-medium">Guarantor Email</label>
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
                                <label className="mb-2 block text-sm font-medium">Guarantor Address</label>
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
                                <label className="mb-2 block text-sm font-medium">Guarantor Employer</label>
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
                                <label className="mb-2 block text-sm font-medium">
                                    Guarantor Monthly Income <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <span className="flex items-center rounded-lg border border-border bg-muted px-3 text-sm">
                                        {CURRENCY_SYMBOLS[data.profile_income_currency] || '€'}
                                    </span>
                                    <input
                                        type="number"
                                        value={data.profile_guarantor_monthly_income}
                                        onChange={(e) => handleFieldChange('profile_guarantor_monthly_income', e.target.value)}
                                        onBlur={onBlur}
                                        placeholder="5000"
                                        min="0"
                                        step="100"
                                        className={`flex-1 ${getFieldClass('profile_guarantor_monthly_income')}`}
                                        required
                                    />
                                </div>
                                {touchedFields.profile_guarantor_monthly_income && errors.profile_guarantor_monthly_income && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_guarantor_monthly_income}</p>
                                )}
                            </div>
                        </div>

                        {/* Guarantor Documents */}
                        <div className="mt-4 border-t border-border pt-4">
                            <h4 className="mb-3 text-sm font-medium">Guarantor Documents</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                                {renderFileInput('profile_guarantor_id', 'Guarantor ID Document', true, existingDocuments?.guarantor_id)}
                                {renderFileInput(
                                    'profile_guarantor_proof_income',
                                    'Guarantor Proof of Income',
                                    true,
                                    existingDocuments?.guarantor_proof_income,
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
