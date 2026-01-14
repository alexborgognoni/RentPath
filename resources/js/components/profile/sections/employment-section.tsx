import { FinancialInfoSection, type ExistingDocuments } from '@/components/application-wizard/shared/financial-info-section';
import type { UseProfileFormReturn } from '@/hooks/use-profile-form';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

interface EmploymentSectionProps {
    form: UseProfileFormReturn;
}

/**
 * Wrapper around FinancialInfoSection for the profile page.
 * Uses the getValue/setValue pattern expected by the shared section.
 */
export function EmploymentSection({ form }: EmploymentSectionProps) {
    const { translations } = usePage<SharedData>().props;

    // Get field value by name
    const getValue = useCallback(
        (field: string): string => {
            // The shared section expects unprefixed field names, so we use them directly
            const value = form.data[field as keyof typeof form.data];
            if (typeof value === 'boolean') return value ? 'true' : 'false';
            if (typeof value === 'number') return String(value);
            return (value as string) || '';
        },
        [form.data],
    );

    // Set field value by name
    const setValue = useCallback(
        (field: string, value: string) => {
            form.setField(field as keyof typeof form.data, value as never);
        },
        [form.setField],
    );

    // Get error for field
    const getError = useCallback(
        (field: string): string | undefined => {
            return form.errors[field];
        },
        [form.errors],
    );

    // Check if field is touched
    const isTouched = useCallback(
        (field: string): boolean => {
            return !!form.touchedFields[field];
        },
        [form.touchedFields],
    );

    // Handle field blur - mark touched and validate
    const handleFieldBlur = useCallback(
        (field: string) => {
            form.markFieldTouched(field);
            form.validateField(field);
        },
        [form],
    );

    // Clear touched fields when employment status changes
    const clearTouchedFields = useCallback(() => {
        // The shared section handles this internally, no action needed
    }, []);

    // Build existing documents from form's existingDocuments
    const existingDocs: ExistingDocuments = useMemo(
        () => ({
            employment_contract: form.existingDocuments.employment_contract?.originalName,
            employment_contract_url: form.existingDocuments.employment_contract?.url,
            employment_contract_size: form.existingDocuments.employment_contract?.size,
            employment_contract_uploaded_at: form.existingDocuments.employment_contract?.uploadedAt,
            payslip_1: form.existingDocuments.payslip_1?.originalName,
            payslip_1_url: form.existingDocuments.payslip_1?.url,
            payslip_1_size: form.existingDocuments.payslip_1?.size,
            payslip_1_uploaded_at: form.existingDocuments.payslip_1?.uploadedAt,
            payslip_2: form.existingDocuments.payslip_2?.originalName,
            payslip_2_url: form.existingDocuments.payslip_2?.url,
            payslip_2_size: form.existingDocuments.payslip_2?.size,
            payslip_2_uploaded_at: form.existingDocuments.payslip_2?.uploadedAt,
            payslip_3: form.existingDocuments.payslip_3?.originalName,
            payslip_3_url: form.existingDocuments.payslip_3?.url,
            payslip_3_size: form.existingDocuments.payslip_3?.size,
            payslip_3_uploaded_at: form.existingDocuments.payslip_3?.uploadedAt,
            student_proof: form.existingDocuments.student_proof?.originalName,
            student_proof_url: form.existingDocuments.student_proof?.url,
            student_proof_size: form.existingDocuments.student_proof?.size,
            student_proof_uploaded_at: form.existingDocuments.student_proof?.uploadedAt,
            pension_statement: form.existingDocuments.pension_statement?.originalName,
            pension_statement_url: form.existingDocuments.pension_statement?.url,
            pension_statement_size: form.existingDocuments.pension_statement?.size,
            pension_statement_uploaded_at: form.existingDocuments.pension_statement?.uploadedAt,
            other_income_proof: form.existingDocuments.other_income_proof?.originalName,
            other_income_proof_url: form.existingDocuments.other_income_proof?.url,
            other_income_proof_size: form.existingDocuments.other_income_proof?.size,
            other_income_proof_uploaded_at: form.existingDocuments.other_income_proof?.uploadedAt,
        }),
        [form.existingDocuments],
    );

    // Handle document upload success
    const handleUploadSuccess = useCallback(() => {
        form.handleUploadSuccess('employment_document');
    }, [form]);

    return (
        <FinancialInfoSection
            entityType="tenant"
            translations={translations}
            getValue={getValue}
            setValue={setValue}
            getError={getError}
            isTouched={isTouched}
            onFieldBlur={handleFieldBlur}
            clearTouchedFields={clearTouchedFields}
            uploadUrl="/tenant-profile/document/upload"
            existingDocuments={existingDocs}
            onUploadSuccess={handleUploadSuccess}
        />
    );
}
