import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload';
import { Select } from '@/components/ui/select';
import type { Translations } from '@/types/translations';
import { getCountryByIso2 } from '@/utils/country-data';
import { translate } from '@/utils/translate-utils';
import { useCallback, useMemo } from 'react';

export interface ImmigrationStatusData {
    immigration_status: string;
    immigration_status_other: string;
    visa_type: string;
    visa_type_other: string;
    visa_expiry_date: string;
}

export interface ImmigrationStatusSectionProps {
    data: ImmigrationStatusData;
    onChange: (field: keyof ImmigrationStatusData, value: string) => void;
    /** Per-field blur handler - called with field name for per-field validation */
    onFieldBlur?: (field: keyof ImmigrationStatusData) => void;
    /** Error messages keyed by field name (with prefix if applicable) */
    errors?: Record<string, string | undefined>;
    /** Touched state keyed by field name (with prefix if applicable) */
    touchedFields?: Record<string, boolean>;
    /** Field prefix for error/touched lookups (e.g., 'cosigner_0_') */
    fieldPrefix?: string;
    translations: Translations;
    /** Property country for contextual help text (ISO-2) */
    propertyCountry?: string;
    /** Upload URL for residence permit document */
    uploadUrl?: string;
    /** Prefix for document type when uploading */
    documentTypePrefix?: string;
    /** Called when upload succeeds */
    onUploadSuccess?: (file: UploadedFile) => void;
    /** Existing residence permit document */
    existingDocument?: {
        originalName: string;
        previewUrl?: string;
        size?: number;
        uploadedAt?: number;
    } | null;
}

const IMMIGRATION_STATUS_OPTIONS = [
    { value: 'citizen', label: 'Citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident' },
    { value: 'temporary_resident', label: 'Temporary Resident' },
    { value: 'visa_holder', label: 'Visa Holder' },
    { value: 'student', label: 'Student' },
    { value: 'work_permit', label: 'Work Permit' },
    { value: 'family_reunification', label: 'Family Reunification' },
    { value: 'refugee_or_protected', label: 'Refugee / Protected Status' },
    { value: 'other', label: 'Other' },
];

const VISA_TYPE_OPTIONS = [
    { value: 'student_visa', label: 'Student Visa' },
    { value: 'work_visa', label: 'Work Visa' },
    { value: 'skilled_worker', label: 'Skilled Worker Visa' },
    { value: 'eu_blue_card', label: 'EU Blue Card' },
    { value: 'family_visa', label: 'Family Reunification Visa' },
    { value: 'entrepreneur_visa', label: 'Entrepreneur / Business Visa' },
    { value: 'temporary_residence', label: 'Temporary Residence Permit' },
    { value: 'long_term_residence', label: 'Long-Term Residence Permit' },
    { value: 'schengen_visa', label: 'Schengen Visa' },
    { value: 'working_holiday', label: 'Working Holiday Visa' },
    { value: 'research_visa', label: 'Research Visa' },
    { value: 'other', label: 'Other' },
];

// Statuses that require additional permit details
const STATUSES_REQUIRING_PERMIT_DETAILS = [
    'temporary_resident',
    'visa_holder',
    'student',
    'work_permit',
    'family_reunification',
    'refugee_or_protected',
];

export function ImmigrationStatusSection({
    data,
    onChange,
    onFieldBlur,
    errors = {},
    touchedFields = {},
    fieldPrefix = '',
    translations,
    propertyCountry,
    uploadUrl,
    documentTypePrefix = '',
    onUploadSuccess,
    existingDocument,
}: ImmigrationStatusSectionProps) {
    const t = useCallback((key: string) => translate(translations, `wizard.application.shared.immigrationStatus.${key}`), [translations]);

    // Helper to get prefixed field key for errors/touched lookups
    const fieldKey = (field: string) => (fieldPrefix ? `${fieldPrefix}${field}` : field);

    // Check if field has error and was touched
    const hasError = (field: string) => !!(touchedFields[fieldKey(field)] && errors[fieldKey(field)]);
    const getError = (field: string) => errors[fieldKey(field)];

    // Get field styling based on error state
    const getFieldClass = (field: string) => {
        const error = hasError(field);
        return `w-full h-9 rounded-md border px-3 text-sm ${error ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    // Get property country name for display
    const propertyCountryName = useMemo(() => {
        if (!propertyCountry) return '';
        const country = getCountryByIso2(propertyCountry);
        return country?.name || propertyCountry;
    }, [propertyCountry]);

    // Check if additional permit details are required
    const requiresPermitDetails = STATUSES_REQUIRING_PERMIT_DETAILS.includes(data.immigration_status || '');

    // Check if visa type is "other"
    const isVisaTypeOther = data.visa_type === 'other';

    // Build translated options
    const immigrationStatusOptions = useMemo(
        () =>
            IMMIGRATION_STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: t(`statuses.${opt.value}`) || opt.label,
            })),
        [t],
    );

    const visaTypeOptions = useMemo(
        () =>
            VISA_TYPE_OPTIONS.map((opt) => ({
                value: opt.value,
                label: t(`visaTypes.${opt.value}`) || opt.label,
            })),
        [t],
    );

    // Build document type for upload endpoint
    const getDocumentType = (docType: string) => (documentTypePrefix ? `${documentTypePrefix}${docType}` : docType);

    return (
        <div className="space-y-4">
            {/* Helper text about property country */}
            <div className="rounded-lg border border-muted bg-muted/30 p-3">
                <p className="text-sm text-muted-foreground">
                    {t('notice') ||
                        (propertyCountryName
                            ? `This is your legal residency status in ${propertyCountryName}, where the property is located.`
                            : 'This is your legal residency status in the country where the property is located.')}
                </p>
            </div>

            {/* Immigration / Residency Status */}
            <div>
                <label className="mb-2 block text-sm font-medium">{t('fields.status') || 'Immigration / Residency Status'}</label>
                <Select
                    value={data.immigration_status}
                    onChange={(value) => onChange('immigration_status', value)}
                    options={immigrationStatusOptions}
                    placeholder={t('placeholders.selectStatus') || 'Select status...'}
                    onBlur={() => onFieldBlur?.('immigration_status')}
                    aria-invalid={hasError('immigration_status')}
                    error={getError('immigration_status')}
                />
            </div>

            {/* If Other - specify */}
            {data.immigration_status === 'other' && (
                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.statusOther') || 'Please Specify'}</label>
                    <input
                        type="text"
                        value={data.immigration_status_other}
                        onChange={(e) => onChange('immigration_status_other', e.target.value)}
                        onBlur={() => onFieldBlur?.('immigration_status_other')}
                        placeholder={t('placeholders.specifyStatus') || 'Specify your status...'}
                        aria-invalid={hasError('immigration_status_other')}
                        className={getFieldClass('immigration_status_other')}
                    />
                    {hasError('immigration_status_other') && <p className="mt-1 text-sm text-destructive">{getError('immigration_status_other')}</p>}
                </div>
            )}

            {/* If status requires permit details */}
            {requiresPermitDetails && (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.visaType') || 'Permit / Visa Type'}</label>
                            <Select
                                value={data.visa_type}
                                onChange={(value) => onChange('visa_type', value)}
                                options={visaTypeOptions}
                                placeholder={t('placeholders.selectVisaType') || 'Select permit type...'}
                                onBlur={() => onFieldBlur?.('visa_type')}
                                aria-invalid={hasError('visa_type')}
                                error={getError('visa_type')}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.visaExpiryDate') || 'Expiry Date'}</label>
                            <DatePicker
                                value={data.visa_expiry_date}
                                onChange={(value) => onChange('visa_expiry_date', value || '')}
                                onBlur={() => onFieldBlur?.('visa_expiry_date')}
                                restriction="strictFuture"
                                aria-invalid={hasError('visa_expiry_date')}
                                error={hasError('visa_expiry_date') ? getError('visa_expiry_date') : undefined}
                            />
                        </div>
                    </div>

                    {/* Show text input when "Other" is selected */}
                    {isVisaTypeOther && (
                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.visaTypeOther') || 'Please Specify Visa/Permit Type'}</label>
                            <input
                                type="text"
                                value={data.visa_type_other || ''}
                                onChange={(e) => onChange('visa_type_other', e.target.value)}
                                onBlur={() => onFieldBlur?.('visa_type_other')}
                                placeholder={t('placeholders.specifyVisaType') || 'Enter your visa/permit type...'}
                                aria-invalid={hasError('visa_type_other')}
                                className={getFieldClass('visa_type_other')}
                            />
                            {hasError('visa_type_other') && <p className="mt-1 text-sm text-destructive">{getError('visa_type_other')}</p>}
                        </div>
                    )}

                    {/* Residence Permit Upload - only if uploadUrl is provided */}
                    {uploadUrl && (
                        <FileUpload
                            label={t('fields.residencePermit') || 'Residence Permit'}
                            required={data.immigration_status === 'visa_holder'}
                            documentType={getDocumentType('residence_permit_document')}
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
                            error={hasError('residence_permit_document') ? getError('residence_permit_document') : undefined}
                        />
                    )}
                </>
            )}
        </div>
    );
}
