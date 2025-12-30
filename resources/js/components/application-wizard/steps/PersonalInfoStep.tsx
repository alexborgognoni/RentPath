import { CountrySelect } from '@/components/ui/country-select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { NationalitySelect } from '@/components/ui/nationality-select';
import { PhoneInput } from '@/components/ui/phone-input';
import { SimpleSelect } from '@/components/ui/simple-select';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import type { SharedData } from '@/types';
import { getCountryByIso2 } from '@/utils/country-data';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, FileText, Shield, User } from 'lucide-react';
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
    /** ISO-2 country code of the property being applied to */
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
    const { translations, auth } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.personalStep.${key}`);
    const user = auth.user;

    const { countryCode: detectedCountry } = useGeoLocation();
    const hasSetDefaults = useRef(false);

    // Get the property country name for display
    const propertyCountryName = useMemo(() => {
        if (!propertyCountry) return '';
        const country = getCountryByIso2(propertyCountry);
        return country?.name || propertyCountry;
    }, [propertyCountry]);

    // Collapsible sections state (card-based layout like HistoryStep)
    // Immigration is now mandatory, so start it expanded
    const [expandedSections, setExpandedSections] = useState({
        personalDetails: true,
        idDocument: false,
        immigration: true,
        rightToRent: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Effect to expand sections with errors
    useEffect(() => {
        const personalDetailsFields = ['profile_date_of_birth', 'profile_nationality', 'profile_phone_number'];
        const idDocumentFields = [
            'profile_id_document_type',
            'profile_id_number',
            'profile_id_issuing_country',
            'profile_id_expiry_date',
            'profile_id_document_front',
            'profile_id_document_back',
        ];
        const immigrationFields = [
            'profile_immigration_status',
            'profile_immigration_status_other',
            'profile_visa_type',
            'profile_visa_expiry_date',
            'profile_residence_permit_document',
        ];
        const rightToRentFields = ['profile_right_to_rent_share_code', 'profile_right_to_rent_document'];

        const hasPersonalDetailsError = personalDetailsFields.some((f) => touchedFields[f] && errors[f]);
        const hasIdDocumentError = idDocumentFields.some((f) => touchedFields[f] && errors[f]);
        const hasImmigrationError = immigrationFields.some((f) => touchedFields[f] && errors[f]);
        const hasRightToRentError = rightToRentFields.some((f) => touchedFields[f] && errors[f]);

        // Expand sections with errors
        if (hasPersonalDetailsError || hasIdDocumentError || hasImmigrationError || hasRightToRentError) {
            setExpandedSections((prev) => ({
                ...prev,
                personalDetails: prev.personalDetails || hasPersonalDetailsError,
                idDocument: prev.idDocument || hasIdDocumentError,
                immigration: prev.immigration || hasImmigrationError,
                rightToRent: prev.rightToRent || hasRightToRentError,
            }));
        }
    }, [errors, touchedFields]);

    // ID Document type options (residence permit is handled separately in Immigration section)
    const ID_DOCUMENT_TYPES = useMemo(
        () => [
            { value: 'passport', label: t('idDocumentTypes.passport') || 'Passport' },
            { value: 'national_id', label: t('idDocumentTypes.nationalId') || 'National ID Card' },
            { value: 'drivers_license', label: t('idDocumentTypes.driversLicense') || "Driver's License" },
        ],
        [translations],
    );

    // Immigration / residency status options - answers "can you legally reside here during the lease?"
    // Values must match backend enum and frontend validation schema
    const IMMIGRATION_STATUSES = useMemo(
        () => [
            { value: 'citizen', label: t('immigrationStatuses.citizen') || 'Citizen' },
            { value: 'permanent_resident', label: t('immigrationStatuses.permanentResident') || 'Permanent Resident' },
            { value: 'temporary_resident', label: t('immigrationStatuses.temporaryResident') || 'Temporary Resident' },
            { value: 'visa_holder', label: t('immigrationStatuses.visaHolder') || 'Visa Holder' },
            { value: 'student', label: t('immigrationStatuses.student') || 'Student' },
            { value: 'work_permit', label: t('immigrationStatuses.workPermit') || 'Work Permit' },
            { value: 'family_reunification', label: t('immigrationStatuses.familyReunification') || 'Family Reunification' },
            { value: 'refugee_or_protected', label: t('immigrationStatuses.refugeeOrProtected') || 'Refugee / Protected Status' },
            { value: 'other', label: t('immigrationStatuses.other') || 'Other' },
        ],
        [translations],
    );

    // Check if immigration status requires permit details
    const requiresPermitDetails = [
        'temporary_resident',
        'visa_holder',
        'student',
        'work_permit',
        'family_reunification',
        'refugee_or_protected',
    ].includes(data.profile_immigration_status || '');

    // Determine if back side is required (for national_id and drivers_license)
    const requiresBackSide = data.profile_id_document_type === 'national_id' || data.profile_id_document_type === 'drivers_license';

    // Create field-specific blur handler
    const handleFieldBlur = (field: string) => () => {
        if (onFieldBlur) {
            onFieldBlur(field);
        } else {
            markFieldTouched(field);
            onBlur();
        }
    };

    // Set default phone country code based on IP detection (only once, if empty)
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

    const getFieldClass = (field: string) => {
        const hasError = touchedFields[field] && errors[field];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    const showError = (field: string) => touchedFields[field] && errors[field];

    // Reload tenant profile data after successful upload
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['tenantProfile'] });
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
            </div>

            {/* Section 1: Personal Details */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('personalDetails')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <User size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('sections.personalDetails') || 'Personal Details'}</h3>
                    </div>
                    {expandedSections.personalDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.personalDetails && (
                    <div className="space-y-4 border-t border-border p-4">
                        {/* User Account Info (Read-only) */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.firstName') || 'First Name'}</label>
                                <input
                                    type="text"
                                    value={user.first_name}
                                    disabled
                                    className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-muted-foreground"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.lastName') || 'Last Name'}</label>
                                <input
                                    type="text"
                                    value={user.last_name}
                                    disabled
                                    className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.email') || 'Email'}</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-muted-foreground"
                            />
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
                                {showError('profile_date_of_birth') && (
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
                                    name="profile_nationality"
                                    aria-invalid={!!(touchedFields.profile_nationality && errors.profile_nationality)}
                                    error={touchedFields.profile_nationality ? errors.profile_nationality : undefined}
                                />
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
                        </div>
                    </div>
                )}
            </div>

            {/* Section 2: ID Document */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('idDocument')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('sections.idDocument') || 'ID Document'}</h3>
                    </div>
                    {expandedSections.idDocument ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.idDocument && (
                    <div className="space-y-4 border-t border-border p-4">
                        {/* Document Type & Number */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.idDocumentType') || 'Document Type'}</label>
                                <SimpleSelect
                                    value={data.profile_id_document_type}
                                    onChange={(value) => handleFieldChange('profile_id_document_type', value)}
                                    options={ID_DOCUMENT_TYPES}
                                    placeholder={t('placeholders.idDocumentType') || 'Select document type...'}
                                    onBlur={onBlur}
                                    name="profile_id_document_type"
                                    aria-invalid={!!(touchedFields.profile_id_document_type && errors.profile_id_document_type)}
                                    error={touchedFields.profile_id_document_type ? errors.profile_id_document_type : undefined}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.idNumber') || 'Document Number'}</label>
                                <input
                                    type="text"
                                    value={data.profile_id_number}
                                    onChange={(e) => handleFieldChange('profile_id_number', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('placeholders.idNumber') || 'Enter document number'}
                                    aria-invalid={!!(touchedFields.profile_id_number && errors.profile_id_number)}
                                    className={getFieldClass('profile_id_number')}
                                />
                                {showError('profile_id_number') && <p className="mt-1 text-sm text-destructive">{errors.profile_id_number}</p>}
                            </div>
                        </div>

                        {/* Issuing Country & Expiry Date */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.idIssuingCountry') || 'Issuing Country'}</label>
                                <CountrySelect
                                    value={data.profile_id_issuing_country}
                                    onChange={(value) => handleFieldChange('profile_id_issuing_country', value)}
                                    onBlur={onBlur}
                                    defaultCountry={detectedCountry}
                                    placeholder={t('placeholders.idIssuingCountry') || 'Select country...'}
                                    name="profile_id_issuing_country"
                                    aria-invalid={!!(touchedFields.profile_id_issuing_country && errors.profile_id_issuing_country)}
                                    error={touchedFields.profile_id_issuing_country ? errors.profile_id_issuing_country : undefined}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.idExpiryDate') || 'Expiry Date'}</label>
                                <DatePicker
                                    value={data.profile_id_expiry_date}
                                    onChange={(value) => handleFieldChange('profile_id_expiry_date', value)}
                                    onBlur={onBlur}
                                    restriction="future"
                                    min={new Date()}
                                    aria-invalid={!!(touchedFields.profile_id_expiry_date && errors.profile_id_expiry_date)}
                                />
                                {showError('profile_id_expiry_date') && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_id_expiry_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <div className="grid gap-4 md:grid-cols-2">
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
                                allowDelete={false}
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
                )}
            </div>

            {/* Section 3: Immigration Status */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('immigration')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <Shield size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('sections.immigration') || 'Immigration Status'}</h3>
                    </div>
                    {expandedSections.immigration ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.immigration && (
                    <div className="space-y-4 border-t border-border p-4">
                        {/* Helper text about property country */}
                        <div className="rounded-lg border border-muted bg-muted/30 p-3">
                            <p className="text-sm text-muted-foreground">
                                {t('immigration.notice') ||
                                    (propertyCountryName
                                        ? `This is your legal residency status in ${propertyCountryName}, where the property is located.`
                                        : 'This is your legal residency status in the country where the property is located.')}
                            </p>
                        </div>

                        {/* Immigration / Residency Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                {t('fields.immigrationStatus') || 'Immigration / Residency Status'}
                            </label>
                            <SimpleSelect
                                value={data.profile_immigration_status}
                                onChange={(value) => handleFieldChange('profile_immigration_status', value)}
                                options={IMMIGRATION_STATUSES}
                                placeholder={t('placeholders.immigrationStatus') || 'Select status...'}
                                onBlur={onBlur}
                                name="profile_immigration_status"
                                aria-invalid={!!(touchedFields.profile_immigration_status && errors.profile_immigration_status)}
                                error={touchedFields.profile_immigration_status ? errors.profile_immigration_status : undefined}
                            />
                        </div>

                        {/* If Other - specify */}
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
                                {showError('profile_immigration_status_other') && (
                                    <p className="mt-1 text-sm text-destructive">{errors.profile_immigration_status_other}</p>
                                )}
                            </div>
                        )}

                        {/* If status requires permit details - show permit type, expiry, and upload */}
                        {requiresPermitDetails && (
                            <>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">{t('fields.permitType') || 'Permit / Visa Type'}</label>
                                        <input
                                            type="text"
                                            value={data.profile_visa_type}
                                            onChange={(e) => handleFieldChange('profile_visa_type', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder={t('placeholders.permitType') || 'e.g., Work Permit, Student Visa'}
                                            aria-invalid={!!(touchedFields.profile_visa_type && errors.profile_visa_type)}
                                            className={getFieldClass('profile_visa_type')}
                                        />
                                        {showError('profile_visa_type') && (
                                            <p className="mt-1 text-sm text-destructive">{errors.profile_visa_type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">{t('fields.permitExpiryDate') || 'Expiry Date'}</label>
                                        <DatePicker
                                            value={data.profile_visa_expiry_date}
                                            onChange={(value) => handleFieldChange('profile_visa_expiry_date', value)}
                                            onBlur={onBlur}
                                            restriction="future"
                                            min={new Date()}
                                            aria-invalid={!!(touchedFields.profile_visa_expiry_date && errors.profile_visa_expiry_date)}
                                        />
                                        {showError('profile_visa_expiry_date') && (
                                            <p className="mt-1 text-sm text-destructive">{errors.profile_visa_expiry_date}</p>
                                        )}
                                    </div>
                                </div>

                                <FileUpload
                                    label={t('fileLabels.residencePermit') || 'Residence Permit'}
                                    required={data.profile_immigration_status === 'visa_holder'}
                                    documentType="residence_permit_document"
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
                                    onUploadSuccess={handleUploadSuccess}
                                    error={touchedFields.profile_residence_permit_document ? errors.profile_residence_permit_document : undefined}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Section 4: Right to Rent */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('rightToRent')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('sections.rightToRent') || 'Right to Rent'}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t('optional') || 'Optional'}</span>
                        {expandedSections.rightToRent ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>

                {expandedSections.rightToRent && (
                    <div className="space-y-4 border-t border-border p-4">
                        <div className="rounded-lg border border-muted bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('rightToRent.notice') ||
                                    'If you are applying for a property in the UK or Ireland, landlords may request proof of your right to rent. Providing these documents can strengthen your application.'}
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">{t('fields.rightToRentShareCode') || 'Right to Rent Share Code'}</label>
                            <input
                                type="text"
                                value={data.profile_right_to_rent_share_code}
                                onChange={(e) => handleFieldChange('profile_right_to_rent_share_code', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholders.shareCode') || 'Enter your share code from gov.uk'}
                                aria-invalid={!!(touchedFields.profile_right_to_rent_share_code && errors.profile_right_to_rent_share_code)}
                                className={getFieldClass('profile_right_to_rent_share_code')}
                            />
                            {showError('profile_right_to_rent_share_code') && (
                                <p className="mt-1 text-sm text-destructive">{errors.profile_right_to_rent_share_code}</p>
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
        </div>
    );
}
