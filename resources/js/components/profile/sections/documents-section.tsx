import { FileUpload } from '@/components/ui/file-upload';
import type { UseProfileFormReturn } from '@/hooks/use-profile-form';
import { useCallback, useMemo } from 'react';

interface DocumentsSectionProps {
    form: UseProfileFormReturn;
}

/**
 * Documents section for additional/optional documents.
 * Employment-related documents are handled by the EmploymentSection.
 * This section is for immigration documents and other supporting docs.
 */
export function DocumentsSection({ form }: DocumentsSectionProps) {
    const handleUploadSuccess = useCallback(
        (documentType: string) => {
            form.handleUploadSuccess(documentType);
        },
        [form],
    );

    // Check if user needs to show immigration documents
    // This would typically be based on nationality vs current country
    const showImmigrationDocs = useMemo(() => {
        const nationality = form.data.nationality;
        const currentCountry = form.data.current_country;
        return nationality && currentCountry && nationality !== currentCountry;
    }, [form.data.nationality, form.data.current_country]);

    if (!showImmigrationDocs) {
        return (
            <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                No additional documents required. Employment documents can be uploaded in the Employment section.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Since you're applying in a different country from your nationality, you may need to provide additional documents.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Residence Permit */}
                <FileUpload
                    documentType="residence_permit_document"
                    uploadUrl="/tenant-profile/document/upload"
                    label="Residence Permit"
                    optional
                    accept={{
                        'image/*': ['.png', '.jpg', '.jpeg'],
                        'application/pdf': ['.pdf'],
                    }}
                    maxSize={20 * 1024 * 1024}
                    description={{
                        fileTypes: 'PDF, PNG, JPG',
                        maxFileSize: '20MB',
                    }}
                    existingFile={
                        form.existingDocuments.residence_permit_document
                            ? {
                                  originalName: form.existingDocuments.residence_permit_document.originalName,
                                  previewUrl: form.existingDocuments.residence_permit_document.url,
                                  size: form.existingDocuments.residence_permit_document.size,
                                  uploadedAt: form.existingDocuments.residence_permit_document.uploadedAt,
                              }
                            : null
                    }
                    onUploadSuccess={() => handleUploadSuccess('residence_permit_document')}
                />

                {/* Right to Rent (UK specific) */}
                {form.data.current_country === 'GB' && (
                    <FileUpload
                        documentType="right_to_rent_document"
                        uploadUrl="/tenant-profile/document/upload"
                        label="Right to Rent Document"
                        optional
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg'],
                            'application/pdf': ['.pdf'],
                        }}
                        maxSize={20 * 1024 * 1024}
                        description={{
                            fileTypes: 'PDF, PNG, JPG',
                            maxFileSize: '20MB',
                        }}
                        existingFile={
                            form.existingDocuments.right_to_rent_document
                                ? {
                                      originalName: form.existingDocuments.right_to_rent_document.originalName,
                                      previewUrl: form.existingDocuments.right_to_rent_document.url,
                                      size: form.existingDocuments.right_to_rent_document.size,
                                      uploadedAt: form.existingDocuments.right_to_rent_document.uploadedAt,
                                  }
                                : null
                        }
                        onUploadSuccess={() => handleUploadSuccess('right_to_rent_document')}
                    />
                )}
            </div>
        </div>
    );
}
