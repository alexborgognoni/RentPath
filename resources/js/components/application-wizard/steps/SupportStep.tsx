import { AddressForm } from '@/components/ui/address-form';
import { DatePicker } from '@/components/ui/date-picker';
import { NationalitySelect } from '@/components/ui/nationality-select';
import { OptionalBadge } from '@/components/ui/optional-badge';
import { PhoneInput } from '@/components/ui/phone-input';
import { SimpleSelect } from '@/components/ui/simple-select';
import type { ApplicationWizardData, CoSignerDetails, GuarantorDetails } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Info, Link2, Plus, Shield, Trash2, UserPlus, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FinancialInfoSection } from '../shared';

interface SupportStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    onFieldBlur?: (field: string) => void;
    addCoSigner: () => void;
    removeCoSigner: (index: number) => void;
    updateCoSigner: (index: number, field: keyof CoSignerDetails, value: string | File | File[] | null) => void;
    addGuarantor: () => void;
    removeGuarantor: (index: number) => void;
    updateGuarantor: (index: number, field: keyof GuarantorDetails, value: string | File | null | boolean) => void;
    syncCoSignersFromOccupants: () => void;
}

const RELATIONSHIP_OPTIONS = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'partner', label: 'Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'child', label: 'Child' },
    { value: 'friend', label: 'Friend' },
    { value: 'employer', label: 'Employer' },
    { value: 'other', label: 'Other' },
];

const ID_DOCUMENT_TYPE_OPTIONS = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'residence_permit', label: 'Residence Permit' },
];

const INSURANCE_OPTIONS = [
    { value: 'no', label: 'No, I am not interested' },
    { value: 'yes', label: 'Yes, I would like more information' },
    { value: 'already_have', label: 'I already have rent guarantee insurance' },
];

export function SupportStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onBlur,
    onFieldBlur,
    addCoSigner,
    removeCoSigner,
    updateCoSigner,
    addGuarantor,
    removeGuarantor,
    updateGuarantor,
    syncCoSignersFromOccupants,
}: SupportStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.supportStep.${key}`);

    // Collapsible section state (like HouseholdStep)
    const [expandedSections, setExpandedSections] = useState({
        coSigners: true,
        guarantors: false,
        insurance: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Auto-expand sections with validation errors
    useEffect(() => {
        // Define field groups for each section
        const coSignerFields = data.co_signers.flatMap((_, i) => [
            `cosigner_${i}_first_name`,
            `cosigner_${i}_last_name`,
            `cosigner_${i}_email`,
            `cosigner_${i}_phone_number`,
            `cosigner_${i}_date_of_birth`,
            `cosigner_${i}_nationality`,
            `cosigner_${i}_relationship`,
            `cosigner_${i}_id_document_type`,
            `cosigner_${i}_id_number`,
            `cosigner_${i}_id_issuing_country`,
            `cosigner_${i}_id_expiry_date`,
            `cosigner_${i}_street_name`,
            `cosigner_${i}_house_number`,
            `cosigner_${i}_city`,
            `cosigner_${i}_postal_code`,
            `cosigner_${i}_country`,
            `cosigner_${i}_employment_status`,
        ]);
        const guarantorFields = data.guarantors.flatMap((_, i) => [
            `guarantor_${i}_first_name`,
            `guarantor_${i}_last_name`,
            `guarantor_${i}_email`,
            `guarantor_${i}_phone_number`,
            `guarantor_${i}_date_of_birth`,
            `guarantor_${i}_nationality`,
            `guarantor_${i}_relationship`,
            `guarantor_${i}_id_document_type`,
            `guarantor_${i}_id_number`,
            `guarantor_${i}_id_issuing_country`,
            `guarantor_${i}_id_expiry_date`,
            `guarantor_${i}_street_name`,
            `guarantor_${i}_house_number`,
            `guarantor_${i}_city`,
            `guarantor_${i}_postal_code`,
            `guarantor_${i}_country`,
            `guarantor_${i}_employment_status`,
        ]);
        const insuranceFields = ['interested_in_rent_insurance', 'existing_insurance_provider'];

        const hasCoSignerError = coSignerFields.some((f) => touchedFields[f] && errors[f]);
        const hasGuarantorError = guarantorFields.some((f) => touchedFields[f] && errors[f]);
        const hasInsuranceError = insuranceFields.some((f) => touchedFields[f] && errors[f]);

        if (hasCoSignerError || hasGuarantorError || hasInsuranceError) {
            setExpandedSections((prev) => ({
                ...prev,
                coSigners: prev.coSigners || hasCoSignerError,
                guarantors: prev.guarantors || hasGuarantorError,
                insurance: prev.insurance || hasInsuranceError,
            }));
        }
    }, [errors, touchedFields, data.co_signers, data.guarantors]);

    // Sync co-signers from occupants on mount
    useEffect(() => {
        syncCoSignersFromOccupants();
    }, [syncCoSignersFromOccupants]);

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    // Per-field blur handler
    const handleFieldBlur = (field: string) => () => {
        if (onFieldBlur) {
            onFieldBlur(field);
        } else {
            markFieldTouched(field);
            onBlur();
        }
    };

    // Helper to create blur handler for co-signer fields
    const handleCoSignerFieldBlur = (index: number, field: keyof CoSignerDetails) => () => {
        const fieldKey = `cosigner_${index}_${field}`;
        if (onFieldBlur) {
            onFieldBlur(fieldKey);
        } else {
            markFieldTouched(fieldKey);
            onBlur();
        }
    };

    // Helper to create blur handler for guarantor fields
    const handleGuarantorFieldBlur = (index: number, field: keyof GuarantorDetails) => () => {
        const fieldKey = `guarantor_${index}_${field}`;
        if (onFieldBlur) {
            onFieldBlur(fieldKey);
        } else {
            markFieldTouched(fieldKey);
            onBlur();
        }
    };

    // Get field class with error styling for co-signer fields
    const getCoSignerFieldClass = (index: number, field: keyof CoSignerDetails, isDisabled = false) => {
        if (isDisabled) {
            return 'w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-muted-foreground';
        }
        const fieldKey = `cosigner_${index}_${field}`;
        const hasError = touchedFields[fieldKey] && errors[fieldKey];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    // Get field class with error styling for guarantor fields
    const getGuarantorFieldClass = (index: number, field: keyof GuarantorDetails) => {
        const fieldKey = `guarantor_${index}_${field}`;
        const hasError = touchedFields[fieldKey] && errors[fieldKey];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    // Check if field has error
    const hasCoSignerError = (index: number, field: keyof CoSignerDetails) => {
        const fieldKey = `cosigner_${index}_${field}`;
        return touchedFields[fieldKey] && errors[fieldKey];
    };

    const getCoSignerError = (index: number, field: keyof CoSignerDetails) => {
        const fieldKey = `cosigner_${index}_${field}`;
        return errors[fieldKey];
    };

    const hasGuarantorError = (index: number, field: keyof GuarantorDetails) => {
        const fieldKey = `guarantor_${index}_${field}`;
        return touchedFields[fieldKey] && errors[fieldKey];
    };

    const getGuarantorError = (index: number, field: keyof GuarantorDetails) => {
        const fieldKey = `guarantor_${index}_${field}`;
        return errors[fieldKey];
    };

    // Count auto-generated co-signers (from occupants who will sign the lease)
    const autoCoSignersCount = data.co_signers.filter((cs) => cs.from_occupant_index !== null).length;

    // Create handlers for each co-signer's FinancialInfoSection
    const createCoSignerHandlers = useCallback(
        (index: number) => ({
            getValue: (field: string) => {
                const coSigner = data.co_signers[index];
                return String(coSigner?.[field as keyof CoSignerDetails] ?? '');
            },
            setValue: (field: string, value: string) => {
                updateCoSigner(index, field as keyof CoSignerDetails, value);
            },
            getError: (field: string) => {
                return errors[`cosigner_${index}_${field}`];
            },
            isTouched: (field: string) => {
                return !!touchedFields[`cosigner_${index}_${field}`];
            },
        }),
        [data.co_signers, updateCoSigner, errors, touchedFields],
    );

    // Create handlers for each guarantor's FinancialInfoSection
    const createGuarantorHandlers = useCallback(
        (index: number) => ({
            getValue: (field: string) => {
                const guarantor = data.guarantors[index];
                return String(guarantor?.[field as keyof GuarantorDetails] ?? '');
            },
            setValue: (field: string, value: string) => {
                updateGuarantor(index, field as keyof GuarantorDetails, value);
            },
            getError: (field: string) => {
                return errors[`guarantor_${index}_${field}`];
            },
            isTouched: (field: string) => {
                return !!touchedFields[`guarantor_${index}_${field}`];
            },
        }),
        [data.guarantors, updateGuarantor, errors, touchedFields],
    );

    // Check if ID document back is required based on type
    const requiresIdDocumentBack = (docType: string) => {
        return ['national_id', 'drivers_license'].includes(docType);
    };

    // Render financial documents for co-signers based on employment status
    const renderCoSignerDocuments = useCallback(
        (index: number) => (status: string) => {
            const coSigner = data.co_signers[index];
            if (!coSigner) return null;

            switch (status) {
                case 'employed':
                    return (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm">{t('documents.employmentContract') || 'Employment Contract'}</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => updateCoSigner(index, 'employment_contract', e.target.files?.[0] || null)}
                                    onBlur={handleCoSignerFieldBlur(index, 'employment_contract')}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                                />
                                {coSigner.employment_contract && (
                                    <p className="mt-1 text-xs text-muted-foreground">Selected: {coSigner.employment_contract.name}</p>
                                )}
                                {hasCoSignerError(index, 'employment_contract') && (
                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'employment_contract')}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('documents.payslips') || 'Recent Payslips'}</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    multiple
                                    onChange={(e) => {
                                        const files = e.target.files ? Array.from(e.target.files) : [];
                                        updateCoSigner(index, 'payslips', files.length > 0 ? files : null);
                                    }}
                                    onBlur={handleCoSignerFieldBlur(index, 'payslips')}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                                />
                                {coSigner.payslips && coSigner.payslips.length > 0 && (
                                    <p className="mt-1 text-xs text-muted-foreground">Selected: {coSigner.payslips.length} file(s)</p>
                                )}
                                {hasCoSignerError(index, 'payslips') && (
                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'payslips')}</p>
                                )}
                            </div>
                        </div>
                    );

                case 'self_employed':
                    return (
                        <div className="mt-4">
                            <label className="mb-1 block text-sm">{t('documents.incomeProof') || 'Proof of Income'}</label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => updateCoSigner(index, 'income_proof', e.target.files?.[0] || null)}
                                onBlur={handleCoSignerFieldBlur(index, 'income_proof')}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t('documents.selfEmployedHint') || 'Tax returns, bank statements, or accountant letter'}
                            </p>
                            {coSigner.income_proof && <p className="mt-1 text-xs text-muted-foreground">Selected: {coSigner.income_proof.name}</p>}
                            {hasCoSignerError(index, 'income_proof') && (
                                <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'income_proof')}</p>
                            )}
                        </div>
                    );

                case 'student':
                    return (
                        <div className="mt-4">
                            <label className="mb-1 block text-sm">{t('documents.enrollmentProof') || 'Enrollment Proof'}</label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => updateCoSigner(index, 'enrollment_proof', e.target.files?.[0] || null)}
                                onBlur={handleCoSignerFieldBlur(index, 'enrollment_proof')}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                            />
                            {coSigner.enrollment_proof && (
                                <p className="mt-1 text-xs text-muted-foreground">Selected: {coSigner.enrollment_proof.name}</p>
                            )}
                            {hasCoSignerError(index, 'enrollment_proof') && (
                                <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'enrollment_proof')}</p>
                            )}
                        </div>
                    );

                case 'retired':
                case 'unemployed':
                case 'other':
                    return (
                        <div className="mt-4">
                            <label className="mb-1 block text-sm">{t('documents.incomeProof') || 'Proof of Income'}</label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => updateCoSigner(index, 'income_proof', e.target.files?.[0] || null)}
                                onBlur={handleCoSignerFieldBlur(index, 'income_proof')}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                            />
                            {coSigner.income_proof && <p className="mt-1 text-xs text-muted-foreground">Selected: {coSigner.income_proof.name}</p>}
                            {hasCoSignerError(index, 'income_proof') && (
                                <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'income_proof')}</p>
                            )}
                        </div>
                    );

                default:
                    return null;
            }
        },
        [data.co_signers, updateCoSigner, handleCoSignerFieldBlur, hasCoSignerError, getCoSignerError, t],
    );

    // Render financial documents for guarantors (same regardless of employment status)
    const renderGuarantorDocuments = useCallback(
        (index: number) =>
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (_status: string) => {
                const guarantor = data.guarantors[index];
                if (!guarantor) return null;

                return (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm">{t('documents.proofOfIncome') || 'Proof of Income'}</label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => updateGuarantor(index, 'proof_of_income', e.target.files?.[0] || null)}
                                onBlur={handleGuarantorFieldBlur(index, 'proof_of_income')}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                            />
                            {guarantor.proof_of_income && (
                                <p className="mt-1 text-xs text-muted-foreground">Selected: {guarantor.proof_of_income.name}</p>
                            )}
                            {hasGuarantorError(index, 'proof_of_income') && (
                                <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'proof_of_income')}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 flex items-center gap-2 text-sm">
                                {t('documents.creditReport') || 'Credit Report'}
                                <OptionalBadge />
                            </label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => updateGuarantor(index, 'credit_report', e.target.files?.[0] || null)}
                                onBlur={handleGuarantorFieldBlur(index, 'credit_report')}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                            />
                            {guarantor.credit_report && (
                                <p className="mt-1 text-xs text-muted-foreground">Selected: {guarantor.credit_report.name}</p>
                            )}
                        </div>
                    </div>
                );
            },
        [data.guarantors, updateGuarantor, handleGuarantorFieldBlur, hasGuarantorError, getGuarantorError, t],
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title') || 'Financial Support'}</h2>
            <p className="text-muted-foreground">
                {t('description') || 'Add co-signers, guarantors, or rent insurance to strengthen your application.'}
            </p>

            {/* Info Card */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="space-y-2 text-sm">
                        <p>
                            {t('info.purpose') ||
                                'Co-signers and guarantors can help strengthen your application by providing additional financial assurance to the landlord.'}
                        </p>
                        <p className="text-muted-foreground">{t('info.optional') || 'All sections on this page are optional.'}</p>
                    </div>
                </div>
            </div>

            {/* Co-signers Section - Collapsible */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('coSigners')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <Users size={20} className="text-primary" />
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{t('coSigners.title') || 'Co-Signers'}</h3>
                            {data.co_signers.length > 0 && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.co_signers.length}</span>
                            )}
                            {data.co_signers.length === 0 && <OptionalBadge />}
                        </div>
                    </div>
                    {expandedSections.coSigners ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.coSigners && (
                    <div className="space-y-4 border-t border-border p-4">
                        <p className="text-sm text-muted-foreground">
                            {t('coSigners.description') || 'Co-signers are people who will be jointly responsible for the lease alongside you.'}
                        </p>

                        {autoCoSignersCount > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link2 className="h-4 w-4" />
                                {autoCoSignersCount} {t('coSigners.fromHousehold') || 'from household members who will sign the lease'}
                            </div>
                        )}

                        {data.co_signers.map((coSigner, index) => {
                            const isFromOccupant = coSigner.from_occupant_index !== null;
                            const handlers = createCoSignerHandlers(index);

                            return (
                                <div key={index} className="rounded-lg border border-border p-4">
                                    {/* Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">
                                                {coSigner.first_name && coSigner.last_name
                                                    ? `${coSigner.first_name} ${coSigner.last_name}`
                                                    : `Co-Signer ${index + 1}`}
                                            </h4>
                                            {isFromOccupant && (
                                                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                                    <Link2 className="h-3 w-3" />
                                                    {t('coSigners.leaseSignerBadge') || 'Lease Signer'}
                                                </span>
                                            )}
                                        </div>
                                        {!isFromOccupant && (
                                            <button
                                                type="button"
                                                onClick={() => removeCoSigner(index)}
                                                className="cursor-pointer text-red-500 hover:text-red-700"
                                                title={t('coSigners.remove') || 'Remove'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Personal Details Section */}
                                    <div className="space-y-4">
                                        <h5 className="text-sm font-medium text-muted-foreground">Personal Details</h5>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {/* First Name, Last Name */}
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.firstName') || 'First Name'}</label>
                                                <input
                                                    type="text"
                                                    value={coSigner.first_name}
                                                    onChange={(e) => updateCoSigner(index, 'first_name', e.target.value)}
                                                    onBlur={handleCoSignerFieldBlur(index, 'first_name')}
                                                    disabled={isFromOccupant}
                                                    aria-invalid={!!hasCoSignerError(index, 'first_name')}
                                                    className={getCoSignerFieldClass(index, 'first_name', isFromOccupant)}
                                                />
                                                {hasCoSignerError(index, 'first_name') && (
                                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'first_name')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.lastName') || 'Last Name'}</label>
                                                <input
                                                    type="text"
                                                    value={coSigner.last_name}
                                                    onChange={(e) => updateCoSigner(index, 'last_name', e.target.value)}
                                                    onBlur={handleCoSignerFieldBlur(index, 'last_name')}
                                                    disabled={isFromOccupant}
                                                    aria-invalid={!!hasCoSignerError(index, 'last_name')}
                                                    className={getCoSignerFieldClass(index, 'last_name', isFromOccupant)}
                                                />
                                                {hasCoSignerError(index, 'last_name') && (
                                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'last_name')}</p>
                                                )}
                                            </div>

                                            {/* Date of Birth, Nationality */}
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.dateOfBirth') || 'Date of Birth'}</label>
                                                <DatePicker
                                                    value={coSigner.date_of_birth}
                                                    onChange={(value) => updateCoSigner(index, 'date_of_birth', value || '')}
                                                    onBlur={handleCoSignerFieldBlur(index, 'date_of_birth')}
                                                    restriction="past"
                                                    disabled={isFromOccupant}
                                                    aria-invalid={!!hasCoSignerError(index, 'date_of_birth')}
                                                    error={
                                                        hasCoSignerError(index, 'date_of_birth')
                                                            ? getCoSignerError(index, 'date_of_birth')
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.nationality') || 'Nationality'}</label>
                                                <NationalitySelect
                                                    value={coSigner.nationality}
                                                    onChange={(value) => updateCoSigner(index, 'nationality', value)}
                                                    onBlur={handleCoSignerFieldBlur(index, 'nationality')}
                                                    aria-invalid={!!hasCoSignerError(index, 'nationality')}
                                                    error={getCoSignerError(index, 'nationality')}
                                                />
                                            </div>

                                            {/* Email, Phone */}
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.email') || 'Email'}</label>
                                                <input
                                                    type="email"
                                                    value={coSigner.email}
                                                    onChange={(e) => updateCoSigner(index, 'email', e.target.value)}
                                                    onBlur={handleCoSignerFieldBlur(index, 'email')}
                                                    aria-invalid={!!hasCoSignerError(index, 'email')}
                                                    className={getCoSignerFieldClass(index, 'email')}
                                                />
                                                {hasCoSignerError(index, 'email') && (
                                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'email')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.phone') || 'Phone Number'}</label>
                                                <PhoneInput
                                                    value={coSigner.phone_number}
                                                    countryCode={coSigner.phone_country_code}
                                                    onChange={(phoneNumber, countryCode) => {
                                                        updateCoSigner(index, 'phone_number', phoneNumber);
                                                        updateCoSigner(index, 'phone_country_code', countryCode);
                                                    }}
                                                    onBlur={handleCoSignerFieldBlur(index, 'phone_number')}
                                                    aria-invalid={!!hasCoSignerError(index, 'phone_number')}
                                                    error={getCoSignerError(index, 'phone_number')}
                                                />
                                            </div>

                                            {/* Relationship */}
                                            <div>
                                                <label className="mb-1 block text-sm">
                                                    {t('fields.relationship') || 'Relationship to Applicant'}
                                                </label>
                                                <SimpleSelect
                                                    value={coSigner.relationship}
                                                    onChange={(value) => updateCoSigner(index, 'relationship', value)}
                                                    options={RELATIONSHIP_OPTIONS}
                                                    placeholder={t('placeholders.selectRelationship') || 'Select relationship'}
                                                    onBlur={handleCoSignerFieldBlur(index, 'relationship')}
                                                    aria-invalid={!!hasCoSignerError(index, 'relationship')}
                                                />
                                                {hasCoSignerError(index, 'relationship') && (
                                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'relationship')}</p>
                                                )}
                                            </div>
                                            {coSigner.relationship === 'other' && (
                                                <div>
                                                    <label className="mb-1 block text-sm">{t('fields.relationshipOther') || 'Please Specify'}</label>
                                                    <input
                                                        type="text"
                                                        value={coSigner.relationship_other}
                                                        onChange={(e) => updateCoSigner(index, 'relationship_other', e.target.value)}
                                                        onBlur={handleCoSignerFieldBlur(index, 'relationship_other')}
                                                        placeholder={t('placeholders.specifyRelationship') || 'Specify relationship'}
                                                        aria-invalid={!!hasCoSignerError(index, 'relationship_other')}
                                                        className={getCoSignerFieldClass(index, 'relationship_other')}
                                                    />
                                                    {hasCoSignerError(index, 'relationship_other') && (
                                                        <p className="mt-1 text-sm text-destructive">
                                                            {getCoSignerError(index, 'relationship_other')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ID Document Section */}
                                    <div className="mt-6 border-t border-border pt-4">
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">ID Document</h5>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm">Document Type</label>
                                                <SimpleSelect
                                                    value={coSigner.id_document_type}
                                                    onChange={(value) => updateCoSigner(index, 'id_document_type', value)}
                                                    options={ID_DOCUMENT_TYPE_OPTIONS}
                                                    placeholder="Select document type"
                                                    onBlur={handleCoSignerFieldBlur(index, 'id_document_type')}
                                                    aria-invalid={!!hasCoSignerError(index, 'id_document_type')}
                                                />
                                                {hasCoSignerError(index, 'id_document_type') && (
                                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'id_document_type')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">ID Number</label>
                                                <input
                                                    type="text"
                                                    value={coSigner.id_number}
                                                    onChange={(e) => updateCoSigner(index, 'id_number', e.target.value)}
                                                    onBlur={handleCoSignerFieldBlur(index, 'id_number')}
                                                    placeholder="Enter ID number"
                                                    aria-invalid={!!hasCoSignerError(index, 'id_number')}
                                                    className={getCoSignerFieldClass(index, 'id_number')}
                                                />
                                                {hasCoSignerError(index, 'id_number') && (
                                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'id_number')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">Issuing Country</label>
                                                <NationalitySelect
                                                    value={coSigner.id_issuing_country}
                                                    onChange={(value) => updateCoSigner(index, 'id_issuing_country', value)}
                                                    onBlur={handleCoSignerFieldBlur(index, 'id_issuing_country')}
                                                    aria-invalid={!!hasCoSignerError(index, 'id_issuing_country')}
                                                    error={getCoSignerError(index, 'id_issuing_country')}
                                                    placeholder="Select issuing country"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">Expiry Date</label>
                                                <DatePicker
                                                    value={coSigner.id_expiry_date}
                                                    onChange={(value) => updateCoSigner(index, 'id_expiry_date', value || '')}
                                                    onBlur={handleCoSignerFieldBlur(index, 'id_expiry_date')}
                                                    restriction="strictFuture"
                                                    aria-invalid={!!hasCoSignerError(index, 'id_expiry_date')}
                                                    error={
                                                        hasCoSignerError(index, 'id_expiry_date')
                                                            ? getCoSignerError(index, 'id_expiry_date')
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">Document Front</label>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => updateCoSigner(index, 'id_document_front', e.target.files?.[0] || null)}
                                                    onBlur={handleCoSignerFieldBlur(index, 'id_document_front')}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                                                />
                                                {hasCoSignerError(index, 'id_document_front') && (
                                                    <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'id_document_front')}</p>
                                                )}
                                            </div>
                                            {requiresIdDocumentBack(coSigner.id_document_type) && (
                                                <div>
                                                    <label className="mb-1 block text-sm">Document Back</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => updateCoSigner(index, 'id_document_back', e.target.files?.[0] || null)}
                                                        onBlur={handleCoSignerFieldBlur(index, 'id_document_back')}
                                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                                                    />
                                                    {hasCoSignerError(index, 'id_document_back') && (
                                                        <p className="mt-1 text-sm text-destructive">{getCoSignerError(index, 'id_document_back')}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="mt-6 border-t border-border pt-4">
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">Address</h5>
                                        <AddressForm
                                            data={{
                                                street_name: coSigner.street_name,
                                                house_number: coSigner.house_number,
                                                address_line_2: coSigner.address_line_2,
                                                city: coSigner.city,
                                                state_province: coSigner.state_province,
                                                postal_code: coSigner.postal_code,
                                                country: coSigner.country,
                                            }}
                                            onChange={(field, value) => updateCoSigner(index, field as keyof CoSignerDetails, value)}
                                            errors={{
                                                street_name: getCoSignerError(index, 'street_name'),
                                                house_number: getCoSignerError(index, 'house_number'),
                                                city: getCoSignerError(index, 'city'),
                                                postal_code: getCoSignerError(index, 'postal_code'),
                                                country: getCoSignerError(index, 'country'),
                                            }}
                                            touchedFields={{
                                                street_name: !!touchedFields[`cosigner_${index}_street_name`],
                                                house_number: !!touchedFields[`cosigner_${index}_house_number`],
                                                address_line_2: !!touchedFields[`cosigner_${index}_address_line_2`],
                                                city: !!touchedFields[`cosigner_${index}_city`],
                                                state_province: !!touchedFields[`cosigner_${index}_state_province`],
                                                postal_code: !!touchedFields[`cosigner_${index}_postal_code`],
                                                country: !!touchedFields[`cosigner_${index}_country`],
                                            }}
                                            onBlur={onBlur}
                                        />
                                    </div>

                                    {/* Financial Information Section */}
                                    <div className="mt-6 border-t border-border pt-4">
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">Financial Information</h5>
                                        <FinancialInfoSection
                                            entityType="co_signer"
                                            translations={translations}
                                            fieldPrefix=""
                                            getValue={handlers.getValue}
                                            setValue={handlers.setValue}
                                            getError={handlers.getError}
                                            isTouched={handlers.isTouched}
                                            onBlur={onBlur}
                                            renderDocuments={renderCoSignerDocuments(index)}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addCoSigner}
                            className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Plus size={16} />
                            {t('coSigners.addCoSigner') || 'Add Co-Signer'}
                        </button>
                    </div>
                )}
            </div>

            {/* Guarantors Section - Collapsible */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('guarantors')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <UserPlus size={20} className="text-primary" />
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{t('guarantors.title') || 'Guarantors'}</h3>
                            {data.guarantors.length > 0 && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.guarantors.length}</span>
                            )}
                            {data.guarantors.length === 0 && <OptionalBadge />}
                        </div>
                    </div>
                    {expandedSections.guarantors ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.guarantors && (
                    <div className="space-y-4 border-t border-border p-4">
                        <p className="text-sm text-muted-foreground">
                            {t('guarantors.description') ||
                                'Guarantors agree to pay rent if you are unable to. They are typically not living in the property.'}
                        </p>

                        {data.guarantors.map((guarantor, index) => {
                            const handlers = createGuarantorHandlers(index);

                            return (
                                <div key={index} className="rounded-lg border border-border p-4">
                                    {/* Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="font-medium">
                                            {guarantor.first_name && guarantor.last_name
                                                ? `${guarantor.first_name} ${guarantor.last_name}`
                                                : `Guarantor ${index + 1}`}
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => removeGuarantor(index)}
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Personal Details Section */}
                                    <div className="space-y-4">
                                        <h5 className="text-sm font-medium text-muted-foreground">Personal Details</h5>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {/* First Name, Last Name */}
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.firstName') || 'First Name'}</label>
                                                <input
                                                    type="text"
                                                    value={guarantor.first_name}
                                                    onChange={(e) => updateGuarantor(index, 'first_name', e.target.value)}
                                                    onBlur={handleGuarantorFieldBlur(index, 'first_name')}
                                                    aria-invalid={!!hasGuarantorError(index, 'first_name')}
                                                    className={getGuarantorFieldClass(index, 'first_name')}
                                                />
                                                {hasGuarantorError(index, 'first_name') && (
                                                    <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'first_name')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.lastName') || 'Last Name'}</label>
                                                <input
                                                    type="text"
                                                    value={guarantor.last_name}
                                                    onChange={(e) => updateGuarantor(index, 'last_name', e.target.value)}
                                                    onBlur={handleGuarantorFieldBlur(index, 'last_name')}
                                                    aria-invalid={!!hasGuarantorError(index, 'last_name')}
                                                    className={getGuarantorFieldClass(index, 'last_name')}
                                                />
                                                {hasGuarantorError(index, 'last_name') && (
                                                    <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'last_name')}</p>
                                                )}
                                            </div>

                                            {/* Date of Birth, Nationality */}
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.dateOfBirth') || 'Date of Birth'}</label>
                                                <DatePicker
                                                    value={guarantor.date_of_birth}
                                                    onChange={(value) => updateGuarantor(index, 'date_of_birth', value || '')}
                                                    onBlur={handleGuarantorFieldBlur(index, 'date_of_birth')}
                                                    restriction="past"
                                                    aria-invalid={!!hasGuarantorError(index, 'date_of_birth')}
                                                    error={
                                                        hasGuarantorError(index, 'date_of_birth')
                                                            ? getGuarantorError(index, 'date_of_birth')
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.nationality') || 'Nationality'}</label>
                                                <NationalitySelect
                                                    value={guarantor.nationality}
                                                    onChange={(value) => updateGuarantor(index, 'nationality', value)}
                                                    onBlur={handleGuarantorFieldBlur(index, 'nationality')}
                                                    aria-invalid={!!hasGuarantorError(index, 'nationality')}
                                                    error={getGuarantorError(index, 'nationality')}
                                                />
                                            </div>

                                            {/* Email, Phone */}
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.email') || 'Email'}</label>
                                                <input
                                                    type="email"
                                                    value={guarantor.email}
                                                    onChange={(e) => updateGuarantor(index, 'email', e.target.value)}
                                                    onBlur={handleGuarantorFieldBlur(index, 'email')}
                                                    aria-invalid={!!hasGuarantorError(index, 'email')}
                                                    className={getGuarantorFieldClass(index, 'email')}
                                                />
                                                {hasGuarantorError(index, 'email') && (
                                                    <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'email')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.phone') || 'Phone Number'}</label>
                                                <PhoneInput
                                                    value={guarantor.phone_number}
                                                    countryCode={guarantor.phone_country_code}
                                                    onChange={(phoneNumber, countryCode) => {
                                                        updateGuarantor(index, 'phone_number', phoneNumber);
                                                        updateGuarantor(index, 'phone_country_code', countryCode);
                                                    }}
                                                    onBlur={handleGuarantorFieldBlur(index, 'phone_number')}
                                                    aria-invalid={!!hasGuarantorError(index, 'phone_number')}
                                                    error={getGuarantorError(index, 'phone_number')}
                                                />
                                            </div>

                                            {/* Relationship */}
                                            <div>
                                                <label className="mb-1 block text-sm">
                                                    {t('fields.relationship') || 'Relationship to Applicant'}
                                                </label>
                                                <SimpleSelect
                                                    value={guarantor.relationship}
                                                    onChange={(value) => updateGuarantor(index, 'relationship', value)}
                                                    options={RELATIONSHIP_OPTIONS}
                                                    placeholder={t('placeholders.selectRelationship') || 'Select relationship'}
                                                    onBlur={handleGuarantorFieldBlur(index, 'relationship')}
                                                    aria-invalid={!!hasGuarantorError(index, 'relationship')}
                                                />
                                                {hasGuarantorError(index, 'relationship') && (
                                                    <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'relationship')}</p>
                                                )}
                                            </div>
                                            {guarantor.relationship === 'other' && (
                                                <div>
                                                    <label className="mb-1 block text-sm">{t('fields.relationshipOther') || 'Please Specify'}</label>
                                                    <input
                                                        type="text"
                                                        value={guarantor.relationship_other}
                                                        onChange={(e) => updateGuarantor(index, 'relationship_other', e.target.value)}
                                                        onBlur={handleGuarantorFieldBlur(index, 'relationship_other')}
                                                        placeholder={t('placeholders.specifyRelationship') || 'Specify relationship'}
                                                        aria-invalid={!!hasGuarantorError(index, 'relationship_other')}
                                                        className={getGuarantorFieldClass(index, 'relationship_other')}
                                                    />
                                                    {hasGuarantorError(index, 'relationship_other') && (
                                                        <p className="mt-1 text-sm text-destructive">
                                                            {getGuarantorError(index, 'relationship_other')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ID Document Section */}
                                    <div className="mt-6 border-t border-border pt-4">
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">ID Document</h5>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm">Document Type</label>
                                                <SimpleSelect
                                                    value={guarantor.id_document_type}
                                                    onChange={(value) => updateGuarantor(index, 'id_document_type', value)}
                                                    options={ID_DOCUMENT_TYPE_OPTIONS}
                                                    placeholder="Select document type"
                                                    onBlur={handleGuarantorFieldBlur(index, 'id_document_type')}
                                                    aria-invalid={!!hasGuarantorError(index, 'id_document_type')}
                                                />
                                                {hasGuarantorError(index, 'id_document_type') && (
                                                    <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'id_document_type')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">ID Number</label>
                                                <input
                                                    type="text"
                                                    value={guarantor.id_number}
                                                    onChange={(e) => updateGuarantor(index, 'id_number', e.target.value)}
                                                    onBlur={handleGuarantorFieldBlur(index, 'id_number')}
                                                    placeholder="Enter ID number"
                                                    aria-invalid={!!hasGuarantorError(index, 'id_number')}
                                                    className={getGuarantorFieldClass(index, 'id_number')}
                                                />
                                                {hasGuarantorError(index, 'id_number') && (
                                                    <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'id_number')}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">Issuing Country</label>
                                                <NationalitySelect
                                                    value={guarantor.id_issuing_country}
                                                    onChange={(value) => updateGuarantor(index, 'id_issuing_country', value)}
                                                    onBlur={handleGuarantorFieldBlur(index, 'id_issuing_country')}
                                                    aria-invalid={!!hasGuarantorError(index, 'id_issuing_country')}
                                                    error={getGuarantorError(index, 'id_issuing_country')}
                                                    placeholder="Select issuing country"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">Expiry Date</label>
                                                <DatePicker
                                                    value={guarantor.id_expiry_date}
                                                    onChange={(value) => updateGuarantor(index, 'id_expiry_date', value || '')}
                                                    onBlur={handleGuarantorFieldBlur(index, 'id_expiry_date')}
                                                    restriction="strictFuture"
                                                    aria-invalid={!!hasGuarantorError(index, 'id_expiry_date')}
                                                    error={
                                                        hasGuarantorError(index, 'id_expiry_date')
                                                            ? getGuarantorError(index, 'id_expiry_date')
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">Document Front</label>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => updateGuarantor(index, 'id_document_front', e.target.files?.[0] || null)}
                                                    onBlur={handleGuarantorFieldBlur(index, 'id_document_front')}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                                                />
                                                {hasGuarantorError(index, 'id_document_front') && (
                                                    <p className="mt-1 text-sm text-destructive">{getGuarantorError(index, 'id_document_front')}</p>
                                                )}
                                            </div>
                                            {requiresIdDocumentBack(guarantor.id_document_type) && (
                                                <div>
                                                    <label className="mb-1 block text-sm">Document Back</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => updateGuarantor(index, 'id_document_back', e.target.files?.[0] || null)}
                                                        onBlur={handleGuarantorFieldBlur(index, 'id_document_back')}
                                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:text-primary"
                                                    />
                                                    {hasGuarantorError(index, 'id_document_back') && (
                                                        <p className="mt-1 text-sm text-destructive">
                                                            {getGuarantorError(index, 'id_document_back')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="mt-6 border-t border-border pt-4">
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">Address</h5>
                                        <AddressForm
                                            data={{
                                                street_name: guarantor.street_name,
                                                house_number: guarantor.house_number,
                                                address_line_2: guarantor.address_line_2,
                                                city: guarantor.city,
                                                state_province: guarantor.state_province,
                                                postal_code: guarantor.postal_code,
                                                country: guarantor.country,
                                            }}
                                            onChange={(field, value) => updateGuarantor(index, field as keyof GuarantorDetails, value)}
                                            errors={{
                                                street_name: getGuarantorError(index, 'street_name'),
                                                house_number: getGuarantorError(index, 'house_number'),
                                                city: getGuarantorError(index, 'city'),
                                                postal_code: getGuarantorError(index, 'postal_code'),
                                                country: getGuarantorError(index, 'country'),
                                            }}
                                            touchedFields={{
                                                street_name: !!touchedFields[`guarantor_${index}_street_name`],
                                                house_number: !!touchedFields[`guarantor_${index}_house_number`],
                                                address_line_2: !!touchedFields[`guarantor_${index}_address_line_2`],
                                                city: !!touchedFields[`guarantor_${index}_city`],
                                                state_province: !!touchedFields[`guarantor_${index}_state_province`],
                                                postal_code: !!touchedFields[`guarantor_${index}_postal_code`],
                                                country: !!touchedFields[`guarantor_${index}_country`],
                                            }}
                                            onBlur={onBlur}
                                        />
                                    </div>

                                    {/* Financial Information Section */}
                                    <div className="mt-6 border-t border-border pt-4">
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">Financial Information</h5>
                                        <FinancialInfoSection
                                            entityType="guarantor"
                                            translations={translations}
                                            fieldPrefix=""
                                            getValue={handlers.getValue}
                                            setValue={handlers.setValue}
                                            getError={handlers.getError}
                                            isTouched={handlers.isTouched}
                                            onBlur={onBlur}
                                            renderDocuments={renderGuarantorDocuments(index)}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => addGuarantor()}
                            className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Plus size={16} />
                            {t('guarantors.addGuarantor') || 'Add Guarantor'}
                        </button>
                    </div>
                )}
            </div>

            {/* Rent Insurance Section - Collapsible */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('insurance')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <Shield size={20} className="text-green-500" />
                        <h3 className="font-semibold">{t('insurance.title') || 'Rent Guarantee Insurance'}</h3>
                    </div>
                    {expandedSections.insurance ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.insurance && (
                    <div className="space-y-4 border-t border-border p-4">
                        <p className="text-sm text-muted-foreground">
                            {t('insurance.description') ||
                                'Rent guarantee insurance provides protection for both you and the landlord in case of payment difficulties.'}
                        </p>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                {t('insurance.interestedLabel') || 'Are you interested in rent guarantee insurance?'}
                            </label>
                            <SimpleSelect
                                value={data.interested_in_rent_insurance}
                                onChange={(value) => handleFieldChange('interested_in_rent_insurance', value as 'yes' | 'no' | 'already_have' | '')}
                                onBlur={handleFieldBlur('interested_in_rent_insurance')}
                                options={INSURANCE_OPTIONS}
                                placeholder={t('insurance.selectPlaceholder') || 'Select an option'}
                                aria-invalid={!!(touchedFields.interested_in_rent_insurance && errors.interested_in_rent_insurance)}
                            />
                            {touchedFields.interested_in_rent_insurance && errors.interested_in_rent_insurance && (
                                <p className="mt-1 text-sm text-destructive">{errors.interested_in_rent_insurance}</p>
                            )}
                        </div>

                        {data.interested_in_rent_insurance === 'already_have' && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">{t('insurance.providerLabel') || 'Insurance Provider'}</label>
                                    <input
                                        type="text"
                                        value={data.existing_insurance_provider}
                                        onChange={(e) => handleFieldChange('existing_insurance_provider', e.target.value)}
                                        onBlur={handleFieldBlur('existing_insurance_provider')}
                                        placeholder={t('insurance.providerPlaceholder') || 'Enter provider name'}
                                        aria-invalid={!!(touchedFields.existing_insurance_provider && errors.existing_insurance_provider)}
                                        className={`w-full rounded-lg border px-4 py-2 ${
                                            touchedFields.existing_insurance_provider && errors.existing_insurance_provider
                                                ? 'border-destructive bg-destructive/5'
                                                : 'border-border bg-background'
                                        }`}
                                    />
                                    {touchedFields.existing_insurance_provider && errors.existing_insurance_provider && (
                                        <p className="mt-1 text-sm text-destructive">{errors.existing_insurance_provider}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        {t('insurance.policyNumberLabel') || 'Policy Number'}{' '}
                                        <span className="text-muted-foreground">({t('optional') || 'optional'})</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.existing_insurance_policy_number}
                                        onChange={(e) => handleFieldChange('existing_insurance_policy_number', e.target.value)}
                                        onBlur={handleFieldBlur('existing_insurance_policy_number')}
                                        placeholder={t('insurance.policyNumberPlaceholder') || 'Enter policy number'}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
