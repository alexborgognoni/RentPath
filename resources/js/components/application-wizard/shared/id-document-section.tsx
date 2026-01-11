import { CountrySelect } from '@/components/ui/country-select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload';
import { Select } from '@/components/ui/select';
import type { Translations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';
import { useCallback, useMemo } from 'react';

export interface IdDocumentData {
    id_document_type: string;
    id_number: string;
    id_issuing_country: string;
    id_expiry_date: string;
}

export interface IdDocumentSectionProps {
    data: IdDocumentData;
    onChange: (field: keyof IdDocumentData, value: string) => void;
    /** Per-field blur handler - called with field name for per-field validation */
    onFieldBlur?: (field: keyof IdDocumentData) => void;
    /** Error messages keyed by field name (with prefix if applicable) */
    errors?: Record<string, string | undefined>;
    /** Touched state keyed by field name (with prefix if applicable) */
    touchedFields?: Record<string, boolean>;
    /** Field prefix for error/touched lookups (e.g., 'cosigner_0_') */
    fieldPrefix?: string;
    translations: Translations;
    /** Existing documents already uploaded */
    existingDocuments?: {
        id_document_front?: string;
        id_document_front_url?: string;
        id_document_front_size?: number;
        id_document_front_uploaded_at?: number;
        id_document_back?: string;
        id_document_back_url?: string;
        id_document_back_size?: number;
        id_document_back_uploaded_at?: number;
    };
    /** Upload URL for documents */
    uploadUrl: string;
    /** Prefix for document type when uploading (e.g., 'cosigner_0_id_document_front') */
    documentTypePrefix?: string;
    /** Called when upload succeeds */
    onUploadSuccess?: (file: UploadedFile) => void;
}

const ID_DOCUMENT_TYPE_OPTIONS = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'drivers_license', label: "Driver's License" },
];

export function IdDocumentSection({
    data,
    onChange,
    onFieldBlur,
    errors = {},
    touchedFields = {},
    fieldPrefix = '',
    translations,
    existingDocuments,
    uploadUrl,
    documentTypePrefix = '',
    onUploadSuccess,
}: IdDocumentSectionProps) {
    const t = useCallback((key: string) => translate(translations, `wizard.application.shared.idDocument.${key}`), [translations]);

    // Helper to get prefixed field key for errors/touched lookups
    const fieldKey = (field: string) => (fieldPrefix ? `${fieldPrefix}${field}` : field);

    // Check if field has error and was touched
    const hasError = (field: string) => !!(touchedFields[fieldKey(field)] && errors[fieldKey(field)]);
    const getError = (field: string) => errors[fieldKey(field)];

    // Get field styling based on error state
    const getFieldClass = (field: string) => {
        const error = hasError(field);
        return `w-full rounded-lg border px-4 py-2 ${error ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    // Build document type options with translations
    const documentTypeOptions = useMemo(
        () =>
            ID_DOCUMENT_TYPE_OPTIONS.map((opt) => ({
                value: opt.value,
                label: t(`documentTypes.${opt.value}`) || opt.label,
            })),
        [t],
    );

    // Build document type for upload endpoint
    const getDocumentType = (docType: string) => (documentTypePrefix ? `${documentTypePrefix}${docType}` : docType);

    return (
        <div className="space-y-4">
            {/* Document Type & Number */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.documentType') || 'Document Type'}</label>
                    <Select
                        value={data.id_document_type}
                        onChange={(value) => onChange('id_document_type', value)}
                        options={documentTypeOptions}
                        placeholder={t('placeholders.selectDocumentType') || 'Select document type...'}
                        onBlur={() => onFieldBlur?.('id_document_type')}
                        aria-invalid={hasError('id_document_type')}
                        error={getError('id_document_type')}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.idNumber') || 'Document Number'}</label>
                    <input
                        type="text"
                        value={data.id_number}
                        onChange={(e) => onChange('id_number', e.target.value)}
                        onBlur={() => onFieldBlur?.('id_number')}
                        placeholder={t('placeholders.enterIdNumber') || 'Enter document number'}
                        aria-invalid={hasError('id_number')}
                        className={getFieldClass('id_number')}
                    />
                    {hasError('id_number') && <p className="mt-1 text-sm text-destructive">{getError('id_number')}</p>}
                </div>
            </div>

            {/* Issuing Country & Expiry Date */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.issuingCountry') || 'Issuing Country'}</label>
                    <CountrySelect
                        value={data.id_issuing_country}
                        onChange={(value) => onChange('id_issuing_country', value)}
                        onBlur={() => onFieldBlur?.('id_issuing_country')}
                        placeholder={t('placeholders.selectIssuingCountry') || 'Select country...'}
                        aria-invalid={hasError('id_issuing_country')}
                        error={getError('id_issuing_country')}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.expiryDate') || 'Expiry Date'}</label>
                    <DatePicker
                        value={data.id_expiry_date}
                        onChange={(value) => onChange('id_expiry_date', value || '')}
                        onBlur={() => onFieldBlur?.('id_expiry_date')}
                        restriction="strictFuture"
                        aria-invalid={hasError('id_expiry_date')}
                        error={hasError('id_expiry_date') ? getError('id_expiry_date') : undefined}
                    />
                </div>
            </div>

            {/* Document Uploads */}
            <div className="grid gap-4 md:grid-cols-2">
                <FileUpload
                    label={t('fields.documentFront') || 'Document Front'}
                    required
                    documentType={getDocumentType('id_document_front')}
                    uploadUrl={uploadUrl}
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
                        existingDocuments?.id_document_front
                            ? {
                                  originalName: existingDocuments.id_document_front,
                                  previewUrl: existingDocuments.id_document_front_url,
                                  size: existingDocuments.id_document_front_size,
                                  uploadedAt: existingDocuments.id_document_front_uploaded_at,
                              }
                            : null
                    }
                    onUploadSuccess={onUploadSuccess}
                    error={hasError('id_document_front') ? getError('id_document_front') : undefined}
                />

                <FileUpload
                    label={t('fields.documentBack') || 'Document Back'}
                    required
                    allowDelete={false}
                    documentType={getDocumentType('id_document_back')}
                    uploadUrl={uploadUrl}
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
                        existingDocuments?.id_document_back
                            ? {
                                  originalName: existingDocuments.id_document_back,
                                  previewUrl: existingDocuments.id_document_back_url,
                                  size: existingDocuments.id_document_back_size,
                                  uploadedAt: existingDocuments.id_document_back_uploaded_at,
                              }
                            : null
                    }
                    onUploadSuccess={onUploadSuccess}
                    error={hasError('id_document_back') ? getError('id_document_back') : undefined}
                />
            </div>
        </div>
    );
}
