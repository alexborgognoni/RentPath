import { AddressForm } from '@/components/ui/address-form';
import { OptionalBadge } from '@/components/ui/optional-badge';
import { Select } from '@/components/ui/select';
import type { ApplicationWizardData, CoSignerDetails, GuarantorDetails } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Link2, Plus, Shield, Trash2, UserPlus, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FinancialInfoSection, IdDocumentSection, PersonalDetailsSection, type IdDocumentData, type PersonalDetailsData } from '../shared';

interface SupportStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    /** Per-field blur handler - called with prefixed field name (e.g., 'cosigner_0_street_name') */
    onFieldBlur?: (field: string) => void;
    addCoSigner: () => void;
    removeCoSigner: (index: number) => void;
    updateCoSigner: (index: number, field: keyof CoSignerDetails, value: string | File | File[] | null) => void;
    addGuarantor: () => void;
    removeGuarantor: (index: number) => void;
    updateGuarantor: (index: number, field: keyof GuarantorDetails, value: string | File | null | boolean) => void;
    syncCoSignersFromOccupants: () => void;
    propertyCountry?: string;
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

    // Update field value only - do NOT mark as touched (per DESIGN.md: touched on blur only)
    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
    };

    // Per-field blur handler for top-level fields (e.g., insurance fields)
    const handleFieldBlur = (field: string) => () => {
        markFieldTouched(field);
        onFieldBlur?.(field);
    };

    // Helper to create blur handler for co-signer fields
    const handleCoSignerFieldBlur = (index: number, field: keyof CoSignerDetails) => () => {
        const fieldKey = `cosigner_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Helper to create blur handler for guarantor fields
    const handleGuarantorFieldBlur = (index: number, field: keyof GuarantorDetails) => () => {
        const fieldKey = `guarantor_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for co-signer PersonalDetailsSection
    // Maps shared section field names to prefixed field names (e.g., 'date_of_birth' -> 'cosigner_0_date_of_birth')
    const createCoSignerPersonalDetailsBlur = (index: number) => (field: string) => {
        const fieldKey = `cosigner_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for co-signer IdDocumentSection
    const createCoSignerIdDocBlur = (index: number) => (field: string) => {
        const fieldKey = `cosigner_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for co-signer AddressForm
    const createCoSignerAddressBlur = (index: number) => (field: string) => {
        const fieldKey = `cosigner_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for guarantor PersonalDetailsSection
    const createGuarantorPersonalDetailsBlur = (index: number) => (field: string) => {
        const fieldKey = `guarantor_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for guarantor IdDocumentSection
    const createGuarantorIdDocBlur = (index: number) => (field: string) => {
        const fieldKey = `guarantor_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for guarantor AddressForm
    const createGuarantorAddressBlur = (index: number) => (field: string) => {
        const fieldKey = `guarantor_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for co-signer FinancialInfoSection
    const createCoSignerFinancialBlur = (index: number) => (field: string) => {
        const fieldKey = `cosigner_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
    };

    // Factory to create per-field blur handler for guarantor FinancialInfoSection
    const createGuarantorFinancialBlur = (index: number) => (field: string) => {
        const fieldKey = `guarantor_${index}_${field}`;
        markFieldTouched(fieldKey);
        onFieldBlur?.(fieldKey);
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

    // Build existing documents for co-signers from their stored paths
    const getCoSignerExistingDocs = useCallback(
        (coSigner: CoSignerDetails) => ({
            id_document_front: coSigner.id_document_front_path || undefined,
            id_document_back: coSigner.id_document_back_path || undefined,
            employment_contract: coSigner.employment_contract_path || undefined,
            payslip_1: coSigner.payslip_1_path || undefined,
            payslip_2: coSigner.payslip_2_path || undefined,
            payslip_3: coSigner.payslip_3_path || undefined,
            student_proof: coSigner.student_proof_path || coSigner.enrollment_proof_path || undefined,
            pension_statement: coSigner.pension_statement_path || undefined,
            benefits_statement: coSigner.benefits_statement_path || undefined,
            other_income_proof: coSigner.income_proof_path || undefined,
        }),
        [],
    );

    // Build existing documents for guarantors from their stored paths
    const getGuarantorExistingDocs = useCallback(
        (guarantor: GuarantorDetails) => ({
            id_document_front: guarantor.id_document_front_path || undefined,
            id_document_back: guarantor.id_document_back_path || undefined,
            employment_contract: undefined,
            payslip_1: undefined,
            payslip_2: undefined,
            payslip_3: undefined,
            proof_of_income: guarantor.proof_of_income_path || undefined,
            other_income_proof: guarantor.proof_of_income_path || guarantor.income_proof_path || undefined,
        }),
        [],
    );

    // Handle upload success for co-signer documents - update wizard state with path
    const handleCoSignerUploadSuccess = useCallback(
        (index: number, documentType: string, path: string) => {
            // Map document types to path field names
            const pathFieldMap: Record<string, keyof CoSignerDetails> = {
                id_document_front: 'id_document_front_path',
                id_document_back: 'id_document_back_path',
                employment_contract: 'employment_contract_path',
                payslip_1: 'payslip_1_path',
                payslip_2: 'payslip_2_path',
                payslip_3: 'payslip_3_path',
                student_proof: 'student_proof_path',
                pension_statement: 'pension_statement_path',
                benefits_statement: 'benefits_statement_path',
                income_proof: 'income_proof_path',
                other_income_proof: 'income_proof_path',
            };

            // Strip the cosigner_N_ prefix to get the document type
            const cleanType = documentType.replace(/^cosigner_\d+_/, '');
            const pathField = pathFieldMap[cleanType];

            if (pathField) {
                updateCoSigner(index, pathField, path);
            }
        },
        [updateCoSigner],
    );

    // Handle upload success for guarantor documents - update wizard state with path
    const handleGuarantorUploadSuccess = useCallback(
        (index: number, documentType: string, path: string) => {
            // Map document types to path field names
            const pathFieldMap: Record<string, keyof GuarantorDetails> = {
                id_document_front: 'id_document_front_path',
                id_document_back: 'id_document_back_path',
                proof_of_income: 'proof_of_income_path',
                proof_of_residence: 'proof_of_residence_path',
                credit_report: 'credit_report_path',
            };

            // Strip the guarantor_N_ prefix to get the document type
            const cleanType = documentType.replace(/^guarantor_\d+_/, '');
            const pathField = pathFieldMap[cleanType];

            if (pathField) {
                updateGuarantor(index, pathField, path);
            }
        },
        [updateGuarantor],
    );

    // Build co-signer personal details data for PersonalDetailsSection
    const getCoSignerPersonalData = (coSigner: CoSignerDetails): PersonalDetailsData => ({
        first_name: coSigner.first_name,
        last_name: coSigner.last_name,
        email: coSigner.email,
        date_of_birth: coSigner.date_of_birth,
        nationality: coSigner.nationality,
        phone_number: coSigner.phone_number,
        phone_country_code: coSigner.phone_country_code,
        bio: '',
    });

    // Build co-signer ID document data for IdDocumentSection
    const getCoSignerIdDocData = (coSigner: CoSignerDetails): IdDocumentData => ({
        id_document_type: coSigner.id_document_type,
        id_number: coSigner.id_number,
        id_issuing_country: coSigner.id_issuing_country,
        id_expiry_date: coSigner.id_expiry_date,
    });

    // Build guarantor personal details data for PersonalDetailsSection
    const getGuarantorPersonalData = (guarantor: GuarantorDetails): PersonalDetailsData => ({
        first_name: guarantor.first_name,
        last_name: guarantor.last_name,
        email: guarantor.email,
        date_of_birth: guarantor.date_of_birth,
        nationality: guarantor.nationality,
        phone_number: guarantor.phone_number,
        phone_country_code: guarantor.phone_country_code,
        bio: '',
    });

    // Build guarantor ID document data for IdDocumentSection
    const getGuarantorIdDocData = (guarantor: GuarantorDetails): IdDocumentData => ({
        id_document_type: guarantor.id_document_type,
        id_number: guarantor.id_number,
        id_issuing_country: guarantor.id_issuing_country,
        id_expiry_date: guarantor.id_expiry_date,
    });

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title') || 'Financial Support'}</h2>
            <p className="text-muted-foreground">
                {t('description') || 'Add co-signers, guarantors, or rent insurance to strengthen your application.'}
            </p>

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
                            const fieldPrefix = `cosigner_${index}_`;

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
                                        <h5 className="text-sm font-medium text-muted-foreground">
                                            {translate(translations, 'wizard.application.shared.personalDetails.title') || 'Personal Details'}
                                        </h5>
                                        <PersonalDetailsSection
                                            data={getCoSignerPersonalData(coSigner)}
                                            onChange={(field, value) => updateCoSigner(index, field as keyof CoSignerDetails, value)}
                                            onFieldBlur={createCoSignerPersonalDetailsBlur(index)}
                                            errors={errors}
                                            touchedFields={touchedFields}
                                            fieldPrefix={fieldPrefix}
                                            translations={translations}
                                            disabledFields={{
                                                first_name: isFromOccupant,
                                                last_name: isFromOccupant,
                                                date_of_birth: isFromOccupant,
                                            }}
                                        />

                                        {/* Relationship - not in shared component */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium">
                                                    {t('fields.relationship') || 'Relationship to Applicant'}
                                                </label>
                                                <Select
                                                    value={coSigner.relationship}
                                                    onChange={(value) => updateCoSigner(index, 'relationship', value)}
                                                    options={RELATIONSHIP_OPTIONS}
                                                    placeholder={t('placeholders.selectRelationship') || 'Select relationship'}
                                                    onBlur={handleCoSignerFieldBlur(index, 'relationship')}
                                                    aria-invalid={!!hasCoSignerError(index, 'relationship')}
                                                    error={getCoSignerError(index, 'relationship')}
                                                    disabled={isFromOccupant}
                                                />
                                            </div>
                                            {coSigner.relationship === 'other' && !isFromOccupant && (
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">
                                                        {t('fields.relationshipOther') || 'Please Specify'}
                                                    </label>
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
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">
                                            {translate(translations, 'wizard.application.shared.idDocument.title') || 'ID Document'}
                                        </h5>
                                        <IdDocumentSection
                                            data={getCoSignerIdDocData(coSigner)}
                                            onChange={(field, value) => updateCoSigner(index, field as keyof CoSignerDetails, value)}
                                            onFieldBlur={createCoSignerIdDocBlur(index)}
                                            errors={errors}
                                            touchedFields={touchedFields}
                                            fieldPrefix={fieldPrefix}
                                            translations={translations}
                                            uploadUrl={`/applications/${data.id}/co-signer/${index}/document/upload`}
                                            documentTypePrefix={fieldPrefix}
                                            existingDocuments={{
                                                id_document_front: coSigner.id_document_front_path,
                                                id_document_back: coSigner.id_document_back_path,
                                            }}
                                            onUploadSuccess={(file) => {
                                                if (file.documentType?.includes('id_document_front') && file.path) {
                                                    updateCoSigner(index, 'id_document_front_path', file.path);
                                                } else if (file.documentType?.includes('id_document_back') && file.path) {
                                                    updateCoSigner(index, 'id_document_back_path', file.path);
                                                }
                                            }}
                                        />
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
                                            onFieldBlur={createCoSignerAddressBlur(index)}
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
                                            onFieldBlur={createCoSignerFinancialBlur(index)}
                                            uploadUrl={`/applications/${data.id}/co-signer/${index}/document/upload`}
                                            documentTypePrefix={`cosigner_${index}_`}
                                            existingDocuments={getCoSignerExistingDocs(coSigner)}
                                            onUploadSuccess={(file) => handleCoSignerUploadSuccess(index, file.documentType || '', file.path || '')}
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
                            const fieldPrefix = `guarantor_${index}_`;

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
                                        <h5 className="text-sm font-medium text-muted-foreground">
                                            {translate(translations, 'wizard.application.shared.personalDetails.title') || 'Personal Details'}
                                        </h5>
                                        <PersonalDetailsSection
                                            data={getGuarantorPersonalData(guarantor)}
                                            onChange={(field, value) => updateGuarantor(index, field as keyof GuarantorDetails, value)}
                                            onFieldBlur={createGuarantorPersonalDetailsBlur(index)}
                                            errors={errors}
                                            touchedFields={touchedFields}
                                            fieldPrefix={fieldPrefix}
                                            translations={translations}
                                        />

                                        {/* Relationship - not in shared component */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium">
                                                    {t('fields.relationship') || 'Relationship to Applicant'}
                                                </label>
                                                <Select
                                                    value={guarantor.relationship}
                                                    onChange={(value) => updateGuarantor(index, 'relationship', value)}
                                                    options={RELATIONSHIP_OPTIONS}
                                                    placeholder={t('placeholders.selectRelationship') || 'Select relationship'}
                                                    onBlur={handleGuarantorFieldBlur(index, 'relationship')}
                                                    aria-invalid={!!hasGuarantorError(index, 'relationship')}
                                                    error={getGuarantorError(index, 'relationship')}
                                                />
                                            </div>
                                            {guarantor.relationship === 'other' && (
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">
                                                        {t('fields.relationshipOther') || 'Please Specify'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={guarantor.relationship_other}
                                                        onChange={(e) => updateGuarantor(index, 'relationship_other', e.target.value)}
                                                        onBlur={handleGuarantorFieldBlur(index, 'relationship_other')}
                                                        placeholder={t('placeholders.specifyRelationship') || 'Specify relationship'}
                                                        aria-invalid={!!hasGuarantorError(index, 'relationship_other')}
                                                        className={`w-full rounded-lg border px-4 py-2 ${hasGuarantorError(index, 'relationship_other') ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
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
                                        <h5 className="mb-4 text-sm font-medium text-muted-foreground">
                                            {translate(translations, 'wizard.application.shared.idDocument.title') || 'ID Document'}
                                        </h5>
                                        <IdDocumentSection
                                            data={getGuarantorIdDocData(guarantor)}
                                            onChange={(field, value) => updateGuarantor(index, field as keyof GuarantorDetails, value)}
                                            onFieldBlur={createGuarantorIdDocBlur(index)}
                                            errors={errors}
                                            touchedFields={touchedFields}
                                            fieldPrefix={fieldPrefix}
                                            translations={translations}
                                            uploadUrl={`/applications/${data.id}/guarantor/${index}/document/upload`}
                                            documentTypePrefix={fieldPrefix}
                                            existingDocuments={{
                                                id_document_front: guarantor.id_document_front_path,
                                                id_document_back: guarantor.id_document_back_path,
                                            }}
                                            onUploadSuccess={(file) => {
                                                if (file.documentType?.includes('id_document_front') && file.path) {
                                                    updateGuarantor(index, 'id_document_front_path', file.path);
                                                } else if (file.documentType?.includes('id_document_back') && file.path) {
                                                    updateGuarantor(index, 'id_document_back_path', file.path);
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* NOTE: Guarantors do NOT get Immigration Status or Right to Rent sections
                                        because they don't occupy the property */}

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
                                            onFieldBlur={createGuarantorAddressBlur(index)}
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
                                            onFieldBlur={createGuarantorFinancialBlur(index)}
                                            uploadUrl={`/applications/${data.id}/guarantor/${index}/document/upload`}
                                            documentTypePrefix={`guarantor_${index}_`}
                                            existingDocuments={getGuarantorExistingDocs(guarantor)}
                                            onUploadSuccess={(file) => handleGuarantorUploadSuccess(index, file.documentType || '', file.path || '')}
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
                            <Select
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
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                        {t('insurance.policyNumberLabel') || 'Policy Number'}
                                        <OptionalBadge />
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
