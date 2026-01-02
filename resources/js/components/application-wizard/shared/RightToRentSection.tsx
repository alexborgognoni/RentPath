import { FileUpload, type UploadedFile } from '@/components/ui/file-upload';
import type { Translations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';

export interface RightToRentData {
    right_to_rent_share_code: string;
}

export interface RightToRentSectionProps {
    data: RightToRentData;
    onChange: (field: keyof RightToRentData, value: string) => void;
    onBlur?: () => void;
    /** Error messages keyed by field name (with prefix if applicable) */
    errors?: Record<string, string | undefined>;
    /** Touched state keyed by field name (with prefix if applicable) */
    touchedFields?: Record<string, boolean>;
    /** Field prefix for error/touched lookups (e.g., 'cosigner_0_') */
    fieldPrefix?: string;
    translations: Translations;
    /** Upload URL for right to rent document */
    uploadUrl?: string;
    /** Prefix for document type when uploading */
    documentTypePrefix?: string;
    /** Called when upload succeeds */
    onUploadSuccess?: (file: UploadedFile) => void;
    /** Existing right to rent document */
    existingDocument?: {
        originalName: string;
        previewUrl?: string;
        size?: number;
        uploadedAt?: number;
    } | null;
}

export function RightToRentSection({
    data,
    onChange,
    onBlur,
    errors = {},
    touchedFields = {},
    fieldPrefix = '',
    translations,
    uploadUrl,
    documentTypePrefix = '',
    onUploadSuccess,
    existingDocument,
}: RightToRentSectionProps) {
    const t = (key: string) => translate(translations, `wizard.application.shared.rightToRent.${key}`);

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

    // Build document type for upload endpoint
    const getDocumentType = (docType: string) => (documentTypePrefix ? `${documentTypePrefix}${docType}` : docType);

    return (
        <div className="space-y-4">
            {/* Helper text */}
            <div className="rounded-lg border border-muted bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                    {t('notice') ||
                        'If you are applying for a property in the UK or Ireland, landlords may request proof of your right to rent. Providing these documents can strengthen your application.'}
                </p>
            </div>

            {/* Right to Rent Share Code */}
            <div>
                <label className="mb-2 block text-sm font-medium">{t('fields.shareCode') || 'Right to Rent Share Code'}</label>
                <input
                    type="text"
                    value={data.right_to_rent_share_code}
                    onChange={(e) => onChange('right_to_rent_share_code', e.target.value)}
                    onBlur={onBlur}
                    placeholder={t('placeholders.shareCode') || 'Enter your share code from gov.uk'}
                    aria-invalid={hasError('right_to_rent_share_code')}
                    className={getFieldClass('right_to_rent_share_code')}
                />
                {hasError('right_to_rent_share_code') && (
                    <p className="mt-1 text-sm text-destructive">{getError('right_to_rent_share_code')}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                    {t('help.shareCodePrefix') || 'Get your share code from'}{' '}
                    <a
                        href="https://www.gov.uk/prove-right-to-rent"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                    >
                        gov.uk/prove-right-to-rent
                    </a>
                </p>
            </div>

            {/* Right to Rent Document Upload - only if uploadUrl is provided */}
            {uploadUrl && (
                <FileUpload
                    label={t('fields.document') || 'Right to Rent Document'}
                    documentType={getDocumentType('right_to_rent_document')}
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
                    existingFile={existingDocument ?? null}
                    onUploadSuccess={onUploadSuccess}
                    error={hasError('right_to_rent_document') ? getError('right_to_rent_document') : undefined}
                />
            )}
        </div>
    );
}
