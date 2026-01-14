import { IdDocumentSection, type IdDocumentData } from '@/components/application-wizard/shared/id-document-section';
import type { ProfileFormData, UseProfileFormReturn } from '@/hooks/use-profile-form';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

interface IdentitySectionProps {
    form: UseProfileFormReturn;
}

/**
 * Wrapper around IdDocumentSection for the profile page.
 * Maps ProfileFormData to the shared section's data format.
 */
export function IdentitySection({ form }: IdentitySectionProps) {
    const { translations } = usePage<SharedData>().props;

    // Map profile form data to IdDocumentData
    const idDocumentData: IdDocumentData = useMemo(
        () => ({
            id_document_type: form.data.id_document_type,
            id_number: form.data.id_number,
            id_issuing_country: form.data.id_issuing_country,
            id_expiry_date: form.data.id_expiry_date,
        }),
        [form.data],
    );

    // Handle field changes
    const handleChange = useCallback(
        (field: keyof IdDocumentData, value: string) => {
            form.setField(field as keyof ProfileFormData, value as ProfileFormData[keyof ProfileFormData]);
        },
        [form],
    );

    // Handle field blur for validation
    const handleFieldBlur = useCallback(
        (field: keyof IdDocumentData) => {
            form.markFieldTouched(field);
            form.validateField(field);
        },
        [form],
    );

    // Build existing documents from form's existingDocuments
    const existingDocs = useMemo(
        () => ({
            id_document_front: form.existingDocuments.id_document_front?.originalName,
            id_document_front_url: form.existingDocuments.id_document_front?.url,
            id_document_front_size: form.existingDocuments.id_document_front?.size,
            id_document_front_uploaded_at: form.existingDocuments.id_document_front?.uploadedAt,
            id_document_back: form.existingDocuments.id_document_back?.originalName,
            id_document_back_url: form.existingDocuments.id_document_back?.url,
            id_document_back_size: form.existingDocuments.id_document_back?.size,
            id_document_back_uploaded_at: form.existingDocuments.id_document_back?.uploadedAt,
        }),
        [form.existingDocuments],
    );

    // Handle document upload success
    const handleUploadSuccess = useCallback(() => {
        form.handleUploadSuccess('id_document');
    }, [form]);

    return (
        <IdDocumentSection
            data={idDocumentData}
            onChange={handleChange}
            onFieldBlur={handleFieldBlur}
            errors={form.errors}
            touchedFields={form.touchedFields}
            translations={translations}
            existingDocuments={existingDocs}
            uploadUrl="/tenant-profile/document/upload"
            onUploadSuccess={handleUploadSuccess}
        />
    );
}
