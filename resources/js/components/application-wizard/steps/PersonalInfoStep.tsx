import { CountrySelect } from '@/components/ui/country-select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { NationalitySelect } from '@/components/ui/nationality-select';
import { PhoneInput } from '@/components/ui/phone-input';
import { SimpleSelect } from '@/components/ui/simple-select';
import { StateProvinceSelect } from '@/components/ui/state-province-select';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import type { SharedData } from '@/types';
import {
    getPostalCodeLabel,
    getPostalCodePlaceholder,
    getStateProvinceLabel,
    hasStateProvinceOptions,
    requiresStateProvince,
} from '@/utils/address-validation';
import { getCountryByIso2 } from '@/utils/country-data';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface PersonalInfoStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    onFieldBlur?: (field: string) => void;
    existingDocuments?: {
        id_document_front?: string;
        id_document_front_url?: string;
        id_document_front_size?: number;
        id_document_front_uploaded_at?: number;
        id_document_back?: string;
        id_document_back_url?: string;
        id_document_back_size?: number;
        id_document_back_uploaded_at?: number;
        right_to_rent_document?: string;
        right_to_rent_document_url?: string;
        right_to_rent_document_size?: number;
        right_to_rent_document_uploaded_at?: number;
    };
    propertyCountry?: string;
}

export function PersonalInfoStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onBlur,
    onFieldBlur,
    existingDocuments,
    propertyCountry,
}: PersonalInfoStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.personalStep.${key}`);

    const { countryCode: detectedCountry } = useGeoLocation();
    const hasSetDefaults = useRef(false);

    // Collapsible sections state
    const [showImmigration, setShowImmigration] = useState(false);
    const [showRegionalDocs, setShowRegionalDocs] = useState(false);

    // ID Document type options
    const ID_DOCUMENT_TYPES = useMemo(
        () => [
            { value: 'passport', label: t('idDocumentTypes.passport') || 'Passport' },
            { value: 'national_id', label: t('idDocumentTypes.nationalId') || 'National ID Card' },
            { value: 'drivers_license', label: t('idDocumentTypes.driversLicense') || "Driver's License" },
            { value: 'residence_permit', label: t('idDocumentTypes.residencePermit') || 'Residence Permit' },
        ],
        [translations],
    );

    // Immigration status options
    const IMMIGRATION_STATUSES = useMemo(
        () => [
            { value: 'citizen', label: t('immigrationStatuses.citizen') || 'Citizen' },
            { value: 'permanent_resident', label: t('immigrationStatuses.permanentResident') || 'Permanent Resident' },
            { value: 'visa_holder', label: t('immigrationStatuses.visaHolder') || 'Visa Holder' },
            { value: 'refugee', label: t('immigrationStatuses.refugee') || 'Refugee' },
            { value: 'asylum_seeker', label: t('immigrationStatuses.asylumSeeker') || 'Asylum Seeker' },
            { value: 'other', label: t('immigrationStatuses.other') || 'Other' },
        ],
        [translations],
    );

    // Show regional documents for UK/IE properties
    const showRegionalDocumentsSection = propertyCountry === 'GB' || propertyCountry === 'IE';

    // Determine if back side is required (for national_id and drivers_license)
    const requiresBackSide = data.profile_id_document_type === 'national_id' || data.profile_id_document_type === 'drivers_license';

    // Country-specific address field info
    const currentCountry = data.profile_current_country || detectedCountry || 'NL';
    const postalCodeLabel = useMemo(() => getPostalCodeLabel(currentCountry), [currentCountry]);
    const postalCodePlaceholder = useMemo(() => getPostalCodePlaceholder(currentCountry), [currentCountry]);
    const stateProvinceLabel = useMemo(() => getStateProvinceLabel(currentCountry), [currentCountry]);
    const showStateProvince = useMemo(() => hasStateProvinceOptions(currentCountry), [currentCountry]);
    const stateProvinceRequired = useMemo(() => requiresStateProvince(currentCountry), [currentCountry]);

    // Create field-specific blur handler
    const handleFieldBlur = (field: string) => () => {
        if (onFieldBlur) {
            onFieldBlur(field);
        } else {
            markFieldTouched(field);
            onBlur();
        }
    };

    // Set default country-related fields based on IP detection (only once, if empty)
    useEffect(
        () => {
            if (detectedCountry && !hasSetDefaults.current) {
                hasSetDefaults.current = true;

                // Set default phone country code if not set
                if (!data.profile_phone_country_code) {
                    const country = getCountryByIso2(detectedCountry);
                    if (country) {
                        updateField('profile_phone_country_code', `+${country.dialCode}`);
                    }
                }
                // Set default current country if not set
                if (!data.profile_current_country) {
                    updateField('profile_current_country', detectedCountry);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run only when detectedCountry changes, using ref guard to prevent loops
        [detectedCountry],
    );

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    const handlePhoneChange = (phoneNumber: string, countryCode: string) => {
        updateField('profile_phone_number', phoneNumber);
        updateField('profile_phone_country_code', countryCode);
        markFieldTouched('profile_phone_number');
    };

    const handleNationalityChange = (value: string) => {
        updateField('profile_nationality', value);
        markFieldTouched('profile_nationality');
    };

    const handleStateProvinceChange = (value: string) => {
        updateField('profile_current_state_province', value);
        markFieldTouched('profile_current_state_province');
    };

    const getFieldClass = (field: string) => {
        const hasError = touchedFields[field] && errors[field];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    // Reload tenant profile data after successful upload
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['tenantProfile'] });
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
            </div>

            {/* Date of Birth & Nationality */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.dateOfBirth')}</label>
                    <DatePicker
                        value={data.profile_date_of_birth}
                        onChange={(value) => handleFieldChange('profile_date_of_birth', value)}
                        onBlur={onBlur}
                        restriction="past"
                        max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
                        aria-invalid={!!(touchedFields.profile_date_of_birth && errors.profile_date_of_birth)}
                    />
                    {touchedFields.profile_date_of_birth && errors.profile_date_of_birth && (
                        <p className="mt-1 text-sm text-destructive">{errors.profile_date_of_birth}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.nationality')}</label>
                    <NationalitySelect
                        value={data.profile_nationality}
                        onChange={handleNationalityChange}
                        onBlur={onBlur}
                        defaultCountry={detectedCountry}
                        aria-invalid={!!(touchedFields.profile_nationality && errors.profile_nationality)}
                        error={touchedFields.profile_nationality ? errors.profile_nationality : undefined}
                    />
                    {touchedFields.profile_nationality && errors.profile_nationality && (
                        <p className="mt-1 text-sm text-destructive">{errors.profile_nationality}</p>
                    )}
                </div>
            </div>

            {/* Phone Number */}
            <div>
                <label className="mb-2 block text-sm font-medium">{t('fields.phoneNumber')}</label>
                <PhoneInput
                    value={data.profile_phone_number}
                    countryCode={data.profile_phone_country_code}
                    onChange={handlePhoneChange}
                    onBlur={handleFieldBlur('profile_phone_number')}
                    defaultCountry={detectedCountry}
                    aria-invalid={!!(touchedFields.profile_phone_number && errors.profile_phone_number)}
                    error={touchedFields.profile_phone_number ? errors.profile_phone_number : undefined}
                    placeholder={t('placeholders.phone')}
                />
                {touchedFields.profile_phone_number && errors.profile_phone_number && (
                    <p className="mt-1 text-sm text-destructive">{errors.profile_phone_number}</p>
                )}
            </div>

            {/* Current Address */}
            <div className="border-t border-border pt-6">
                <h3 className="mb-4 font-semibold">{t('sections.currentAddress')}</h3>

                {/* Street Name & House Number */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">{t('fields.streetName')}</label>
                        <input
                            type="text"
                            value={data.profile_current_street_name}
                            onChange={(e) => handleFieldChange('profile_current_street_name', e.target.value)}
                            onBlur={onBlur}
                            placeholder={t('placeholders.streetName')}
                            aria-invalid={!!(touchedFields.profile_current_street_name && errors.profile_current_street_name)}
                            className={getFieldClass('profile_current_street_name')}
                            required
                        />
                        {touchedFields.profile_current_street_name && errors.profile_current_street_name && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_current_street_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('fields.houseNumber')}</label>
                        <input
                            type="text"
                            value={data.profile_current_house_number}
                            onChange={(e) => handleFieldChange('profile_current_house_number', e.target.value)}
                            onBlur={onBlur}
                            placeholder={t('placeholders.houseNumber')}
                            aria-invalid={!!(touchedFields.profile_current_house_number && errors.profile_current_house_number)}
                            className={getFieldClass('profile_current_house_number')}
                            required
                        />
                        {touchedFields.profile_current_house_number && errors.profile_current_house_number && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_current_house_number}</p>
                        )}
                    </div>
                </div>

                {/* Address Line 2 (optional) */}
                <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium">
                        {t('fields.apartment')} <span className="text-muted-foreground">({t('optional')})</span>
                    </label>
                    <input
                        type="text"
                        value={data.profile_current_address_line_2}
                        onChange={(e) => handleFieldChange('profile_current_address_line_2', e.target.value)}
                        onBlur={onBlur}
                        placeholder={t('placeholders.apartment')}
                        aria-invalid={!!(touchedFields.profile_current_address_line_2 && errors.profile_current_address_line_2)}
                        className={getFieldClass('profile_current_address_line_2')}
                    />
                    {touchedFields.profile_current_address_line_2 && errors.profile_current_address_line_2 && (
                        <p className="mt-1 text-sm text-destructive">{errors.profile_current_address_line_2}</p>
                    )}
                </div>

                {/* City & State/Province */}
                <div className={`mt-4 grid gap-4 ${showStateProvince ? 'md:grid-cols-2' : ''}`}>
                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('fields.city')}</label>
                        <input
                            type="text"
                            value={data.profile_current_city}
                            onChange={(e) => handleFieldChange('profile_current_city', e.target.value)}
                            onBlur={onBlur}
                            placeholder={t('placeholders.city')}
                            aria-invalid={!!(touchedFields.profile_current_city && errors.profile_current_city)}
                            className={getFieldClass('profile_current_city')}
                            required
                        />
                        {touchedFields.profile_current_city && errors.profile_current_city && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_current_city}</p>
                        )}
                    </div>

                    {showStateProvince && (
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                {stateProvinceLabel}
                                {!stateProvinceRequired && <span className="text-muted-foreground"> ({t('optional')})</span>}
                            </label>
                            <StateProvinceSelect
                                value={data.profile_current_state_province}
                                onChange={handleStateProvinceChange}
                                onBlur={onBlur}
                                countryCode={currentCountry}
                                aria-invalid={!!(touchedFields.profile_current_state_province && errors.profile_current_state_province)}
                                error={touchedFields.profile_current_state_province ? errors.profile_current_state_province : undefined}
                            />
                            {touchedFields.profile_current_state_province && errors.profile_current_state_province && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_current_state_province}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Postal Code & Country */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium">{postalCodeLabel}</label>
                        <input
                            type="text"
                            value={data.profile_current_postal_code}
                            onChange={(e) => handleFieldChange('profile_current_postal_code', e.target.value)}
                            onBlur={onBlur}
                            placeholder={postalCodePlaceholder}
                            aria-invalid={!!(touchedFields.profile_current_postal_code && errors.profile_current_postal_code)}
                            className={getFieldClass('profile_current_postal_code')}
                            required
                        />
                        {touchedFields.profile_current_postal_code && errors.profile_current_postal_code && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_current_postal_code}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('fields.country')}</label>
                        <CountrySelect
                            value={data.profile_current_country}
                            onChange={(value) => handleFieldChange('profile_current_country', value)}
                            onBlur={onBlur}
                            defaultCountry={detectedCountry}
                            placeholder="Select country..."
                            aria-invalid={!!(touchedFields.profile_current_country && errors.profile_current_country)}
                            error={touchedFields.profile_current_country ? errors.profile_current_country : undefined}
                        />
                        {touchedFields.profile_current_country && errors.profile_current_country && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_current_country}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ID Document */}
            <div className="border-t border-border pt-6">
                <h3 className="mb-4 font-semibold">{t('sections.idDocument')}</h3>

                {/* Document Type & Number */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('fields.idDocumentType') || 'Document Type'} <span className="text-destructive">*</span>
                        </label>
                        <SimpleSelect
                            value={data.profile_id_document_type}
                            onChange={(value) => handleFieldChange('profile_id_document_type', value)}
                            options={ID_DOCUMENT_TYPES}
                            placeholder={t('placeholders.idDocumentType') || 'Select document type...'}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields.profile_id_document_type && errors.profile_id_document_type)}
                        />
                        {touchedFields.profile_id_document_type && errors.profile_id_document_type && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_id_document_type}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('fields.idNumber') || 'Document Number'} <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.profile_id_number}
                            onChange={(e) => handleFieldChange('profile_id_number', e.target.value)}
                            onBlur={onBlur}
                            placeholder={t('placeholders.idNumber') || 'Enter document number'}
                            aria-invalid={!!(touchedFields.profile_id_number && errors.profile_id_number)}
                            className={getFieldClass('profile_id_number')}
                            required
                        />
                        {touchedFields.profile_id_number && errors.profile_id_number && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_id_number}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                            {t('help.idNumber') || 'Your document number is encrypted and stored securely'}
                        </p>
                    </div>
                </div>

                {/* Issuing Country & Expiry Date */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('fields.idIssuingCountry') || 'Issuing Country'} <span className="text-destructive">*</span>
                        </label>
                        <CountrySelect
                            value={data.profile_id_issuing_country}
                            onChange={(value) => handleFieldChange('profile_id_issuing_country', value)}
                            onBlur={onBlur}
                            defaultCountry={detectedCountry}
                            placeholder={t('placeholders.idIssuingCountry') || 'Select country...'}
                            aria-invalid={!!(touchedFields.profile_id_issuing_country && errors.profile_id_issuing_country)}
                            error={touchedFields.profile_id_issuing_country ? errors.profile_id_issuing_country : undefined}
                        />
                        {touchedFields.profile_id_issuing_country && errors.profile_id_issuing_country && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_id_issuing_country}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('fields.idExpiryDate') || 'Expiry Date'} <span className="text-destructive">*</span>
                        </label>
                        <DatePicker
                            value={data.profile_id_expiry_date}
                            onChange={(value) => handleFieldChange('profile_id_expiry_date', value)}
                            onBlur={onBlur}
                            restriction="future"
                            min={new Date()}
                            aria-invalid={!!(touchedFields.profile_id_expiry_date && errors.profile_id_expiry_date)}
                        />
                        {touchedFields.profile_id_expiry_date && errors.profile_id_expiry_date && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_id_expiry_date}</p>
                        )}
                    </div>
                </div>

                {/* Document Uploads */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <FileUpload
                        label={t('fileLabels.frontSide')}
                        required
                        documentType="id_document_front"
                        uploadUrl="/tenant-profile/document/upload"
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
                        onUploadSuccess={handleUploadSuccess}
                        error={touchedFields.profile_id_document_front ? errors.profile_id_document_front : undefined}
                    />

                    <FileUpload
                        label={t('fileLabels.backSide')}
                        required={requiresBackSide}
                        documentType="id_document_back"
                        uploadUrl="/tenant-profile/document/upload"
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
                        onUploadSuccess={handleUploadSuccess}
                        error={touchedFields.profile_id_document_back ? errors.profile_id_document_back : undefined}
                    />
                </div>
            </div>

            {/* Immigration Status (Optional - Collapsible) */}
            <div className="border-t border-border pt-6">
                <button
                    type="button"
                    onClick={() => setShowImmigration(!showImmigration)}
                    className="flex w-full cursor-pointer items-center justify-between text-left"
                >
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <h3 className="font-semibold">{t('sections.immigration') || 'Immigration Status'}</h3>
                            <p className="text-xs text-muted-foreground">
                                {t('sections.immigrationDescription') || 'Optional but strengthens your application'}
                            </p>
                        </div>
                    </div>
                    {showImmigration ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>

                {showImmigration && (
                    <div className="mt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.immigrationStatus') || 'Immigration Status'}</label>
                                <SimpleSelect
                                    value={data.profile_immigration_status}
                                    onChange={(value) => handleFieldChange('profile_immigration_status', value)}
                                    options={IMMIGRATION_STATUSES}
                                    placeholder={t('placeholders.immigrationStatus') || 'Select status...'}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields.profile_immigration_status && errors.profile_immigration_status)}
                                />
                                {touchedFields.profile_immigration_status && errors.profile_immigration_status && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_immigration_status}</p>
                                )}
                            </div>

                            {data.profile_immigration_status === 'other' && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium">{t('fields.immigrationStatusOther') || 'Please Specify'}</label>
                                    <input
                                        type="text"
                                        value={data.profile_immigration_status_other}
                                        onChange={(e) => handleFieldChange('profile_immigration_status_other', e.target.value)}
                                        onBlur={onBlur}
                                        placeholder={t('placeholders.immigrationStatusOther') || 'Specify your status...'}
                                        aria-invalid={!!(touchedFields.profile_immigration_status_other && errors.profile_immigration_status_other)}
                                        className={getFieldClass('profile_immigration_status_other')}
                                    />
                                    {touchedFields.profile_immigration_status_other && errors.profile_immigration_status_other && (
                                        <p className="mt-1 text-sm text-destructive">{errors.profile_immigration_status_other}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {data.profile_immigration_status === 'visa_holder' && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">{t('fields.visaType') || 'Visa Type'}</label>
                                    <input
                                        type="text"
                                        value={data.profile_visa_type}
                                        onChange={(e) => handleFieldChange('profile_visa_type', e.target.value)}
                                        onBlur={onBlur}
                                        placeholder={t('placeholders.visaType') || 'e.g., Work Visa, Student Visa'}
                                        aria-invalid={!!(touchedFields.profile_visa_type && errors.profile_visa_type)}
                                        className={getFieldClass('profile_visa_type')}
                                    />
                                    {touchedFields.profile_visa_type && errors.profile_visa_type && (
                                        <p className="mt-1 text-sm text-destructive">{errors.profile_visa_type}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">{t('fields.visaExpiryDate') || 'Visa Expiry Date'}</label>
                                    <DatePicker
                                        value={data.profile_visa_expiry_date}
                                        onChange={(value) => handleFieldChange('profile_visa_expiry_date', value)}
                                        onBlur={onBlur}
                                        restriction="future"
                                        min={new Date()}
                                        aria-invalid={!!(touchedFields.profile_visa_expiry_date && errors.profile_visa_expiry_date)}
                                    />
                                    {touchedFields.profile_visa_expiry_date && errors.profile_visa_expiry_date && (
                                        <p className="mt-1 text-sm text-destructive">{errors.profile_visa_expiry_date}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                {t('fields.workPermitNumber') || 'Work Permit Number'}{' '}
                                <span className="text-muted-foreground">({t('optional')})</span>
                            </label>
                            <input
                                type="text"
                                value={data.profile_work_permit_number}
                                onChange={(e) => handleFieldChange('profile_work_permit_number', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.workPermitNumber') || 'If applicable'}
                                aria-invalid={!!(touchedFields.profile_work_permit_number && errors.profile_work_permit_number)}
                                className={getFieldClass('profile_work_permit_number')}
                            />
                            {touchedFields.profile_work_permit_number && errors.profile_work_permit_number && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_work_permit_number}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Regional Documents (UK/IE Only - Collapsible) */}
            {showRegionalDocumentsSection && (
                <div className="border-t border-border pt-6">
                    <button
                        type="button"
                        onClick={() => setShowRegionalDocs(!showRegionalDocs)}
                        className="flex w-full cursor-pointer items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <div>
                                <h3 className="font-semibold">{t('sections.rightToRent') || 'Right to Rent'}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t('sections.rightToRentDescription') || 'Recommended for UK/Ireland properties'}
                                </p>
                            </div>
                        </div>
                        {showRegionalDocs ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </button>

                    {showRegionalDocs && (
                        <div className="mt-4 space-y-4">
                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    {t('rightToRent.notice') ||
                                        'Landlords in the UK/Ireland may request proof of your right to rent. Providing these documents can strengthen your application.'}
                                </p>
                            </div>

                            {propertyCountry === 'GB' && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        {t('fields.rightToRentShareCode') || 'Right to Rent Share Code'}{' '}
                                        <span className="text-muted-foreground">({t('optional')})</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.profile_right_to_rent_share_code}
                                        onChange={(e) => handleFieldChange('profile_right_to_rent_share_code', e.target.value)}
                                        onBlur={onBlur}
                                        placeholder={t('placeholders.shareCode') || 'Enter your share code from gov.uk'}
                                        aria-invalid={!!(touchedFields.profile_right_to_rent_share_code && errors.profile_right_to_rent_share_code)}
                                        className={getFieldClass('profile_right_to_rent_share_code')}
                                    />
                                    {touchedFields.profile_right_to_rent_share_code && errors.profile_right_to_rent_share_code && (
                                        <p className="mt-1 text-sm text-destructive">{errors.profile_right_to_rent_share_code}</p>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {t('help.shareCode') || 'Get your share code from gov.uk/prove-right-to-rent'}
                                    </p>
                                </div>
                            )}

                            <FileUpload
                                label={t('fileLabels.rightToRentDocument') || 'Right to Rent Document'}
                                documentType="right_to_rent_document"
                                uploadUrl="/tenant-profile/document/upload"
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
                                    existingDocuments?.right_to_rent_document
                                        ? {
                                              originalName: existingDocuments.right_to_rent_document,
                                              previewUrl: existingDocuments.right_to_rent_document_url,
                                              size: existingDocuments.right_to_rent_document_size,
                                              uploadedAt: existingDocuments.right_to_rent_document_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_right_to_rent_document ? errors.profile_right_to_rent_document : undefined}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
