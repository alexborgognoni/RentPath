import { OptionalBadge } from '@/components/ui/optional-badge';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import type { SharedData } from '@/types';
import { getCountryByIso2 } from '@/utils/country-data';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, FileText, Shield, User } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    IdDocumentSection,
    ImmigrationStatusSection,
    PersonalDetailsSection,
    RightToRentSection,
    type IdDocumentData,
    type ImmigrationStatusData,
    type PersonalDetailsData,
    type RightToRentData,
} from '../shared';

interface IdentityStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    /** Per-field blur handler - called with prefixed field name (e.g., 'profile_date_of_birth') */
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
        residence_permit_document?: string;
        residence_permit_document_url?: string;
        residence_permit_document_size?: number;
        residence_permit_document_uploaded_at?: number;
        right_to_rent_document?: string;
        right_to_rent_document_url?: string;
        right_to_rent_document_size?: number;
        right_to_rent_document_uploaded_at?: number;
    };
    /** ISO-2 country code of the property being applied to */
    propertyCountry?: string;
}

export function IdentityStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onFieldBlur,
    existingDocuments,
    propertyCountry,
}: IdentityStepProps) {
    const { translations, auth } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.personalStep.${key}`);
    const user = auth.user;

    const { countryCode: detectedCountry } = useGeoLocation();
    const hasSetDefaults = useRef(false);

    // Collapsible sections state (card-based layout like HistoryStep)
    const [expandedSections, setExpandedSections] = useState({
        personalDetails: true,
        idDocument: false,
        immigration: false,
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

    // Set default phone country code based on IP detection (only once, if empty)
    useEffect(
        () => {
            if (detectedCountry && !hasSetDefaults.current) {
                hasSetDefaults.current = true;

                if (!data.profile_phone_country_code) {
                    const country = getCountryByIso2(detectedCountry);
                    if (country) {
                        updateField('profile_phone_country_code', `+${country.dialCode}`);
                    }
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [detectedCountry],
    );

    // Reload tenant profile data after successful upload
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['tenantProfile'] });
    }, []);

    // ===== Data Mapping for Shared Components =====

    // Map ApplicationWizardData to PersonalDetailsData
    const personalDetailsData: PersonalDetailsData = useMemo(
        () => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            date_of_birth: data.profile_date_of_birth,
            nationality: data.profile_nationality,
            phone_number: data.profile_phone_number,
            phone_country_code: data.profile_phone_country_code,
            bio: data.profile_bio,
        }),
        [user, data.profile_date_of_birth, data.profile_nationality, data.profile_phone_number, data.profile_phone_country_code, data.profile_bio],
    );

    // Field map for personal details - maps shared component field names to profile_ prefixed fields
    const personalDetailsFieldMap: Record<keyof PersonalDetailsData, keyof ApplicationWizardData> = {
        first_name: 'profile_date_of_birth', // Not used - disabled
        last_name: 'profile_date_of_birth', // Not used - disabled
        email: 'profile_date_of_birth', // Not used - disabled
        date_of_birth: 'profile_date_of_birth',
        nationality: 'profile_nationality',
        phone_number: 'profile_phone_number',
        phone_country_code: 'profile_phone_country_code',
        bio: 'profile_bio',
    };

    const handlePersonalDetailsChange = useCallback(
        (field: keyof PersonalDetailsData, value: string) => {
            const targetField = personalDetailsFieldMap[field];
            if (targetField && field !== 'first_name' && field !== 'last_name' && field !== 'email') {
                updateField(targetField, value);
                // Note: markFieldTouched is called on blur, not on change (per DESIGN.md)
            }
        },
        [updateField],
    );

    // Per-field blur handler for personal details section
    const handlePersonalDetailsBlur = useCallback(
        (field: keyof PersonalDetailsData) => {
            const targetField = personalDetailsFieldMap[field];
            if (targetField && field !== 'first_name' && field !== 'last_name' && field !== 'email') {
                markFieldTouched(targetField);
                onFieldBlur?.(targetField);
            }
        },
        [markFieldTouched, onFieldBlur],
    );

    // Map ApplicationWizardData to IdDocumentData
    const idDocumentData: IdDocumentData = useMemo(
        () => ({
            id_document_type: data.profile_id_document_type,
            id_number: data.profile_id_number,
            id_issuing_country: data.profile_id_issuing_country,
            id_expiry_date: data.profile_id_expiry_date,
        }),
        [data.profile_id_document_type, data.profile_id_number, data.profile_id_issuing_country, data.profile_id_expiry_date],
    );

    // Field map for ID document - maps shared component field names to profile_ prefixed fields
    const idDocumentFieldMap: Record<keyof IdDocumentData, keyof ApplicationWizardData> = {
        id_document_type: 'profile_id_document_type',
        id_number: 'profile_id_number',
        id_issuing_country: 'profile_id_issuing_country',
        id_expiry_date: 'profile_id_expiry_date',
    };

    const handleIdDocumentChange = useCallback(
        (field: keyof IdDocumentData, value: string) => {
            const targetField = idDocumentFieldMap[field];
            if (targetField) {
                updateField(targetField, value);
                // Note: markFieldTouched is called on blur, not on change (per DESIGN.md)
            }
        },
        [updateField],
    );

    // Per-field blur handler for ID document section
    const handleIdDocumentBlur = useCallback(
        (field: keyof IdDocumentData) => {
            const targetField = idDocumentFieldMap[field];
            if (targetField) {
                markFieldTouched(targetField);
                onFieldBlur?.(targetField);
            }
        },
        [markFieldTouched, onFieldBlur],
    );

    // Map ApplicationWizardData to ImmigrationStatusData
    const immigrationStatusData: ImmigrationStatusData = useMemo(
        () => ({
            immigration_status: data.profile_immigration_status,
            immigration_status_other: data.profile_immigration_status_other,
            visa_type: data.profile_visa_type,
            visa_type_other: data.profile_visa_type_other || '',
            visa_expiry_date: data.profile_visa_expiry_date,
        }),
        [
            data.profile_immigration_status,
            data.profile_immigration_status_other,
            data.profile_visa_type,
            data.profile_visa_type_other,
            data.profile_visa_expiry_date,
        ],
    );

    // Field map for immigration status - maps shared component field names to profile_ prefixed fields
    const immigrationStatusFieldMap: Record<keyof ImmigrationStatusData, keyof ApplicationWizardData> = {
        immigration_status: 'profile_immigration_status',
        immigration_status_other: 'profile_immigration_status_other',
        visa_type: 'profile_visa_type',
        visa_type_other: 'profile_visa_type_other',
        visa_expiry_date: 'profile_visa_expiry_date',
    };

    const handleImmigrationStatusChange = useCallback(
        (field: keyof ImmigrationStatusData, value: string) => {
            const targetField = immigrationStatusFieldMap[field];
            if (targetField) {
                updateField(targetField, value);
                // Note: markFieldTouched is called on blur, not on change (per DESIGN.md)
            }
        },
        [updateField],
    );

    // Per-field blur handler for immigration status section
    const handleImmigrationStatusBlur = useCallback(
        (field: keyof ImmigrationStatusData) => {
            const targetField = immigrationStatusFieldMap[field];
            if (targetField) {
                markFieldTouched(targetField);
                onFieldBlur?.(targetField);
            }
        },
        [markFieldTouched, onFieldBlur],
    );

    // Map ApplicationWizardData to RightToRentData
    const rightToRentData: RightToRentData = useMemo(
        () => ({
            right_to_rent_share_code: data.profile_right_to_rent_share_code,
        }),
        [data.profile_right_to_rent_share_code],
    );

    // Field map for right to rent - maps shared component field names to profile_ prefixed fields
    const rightToRentFieldMap: Record<keyof RightToRentData, keyof ApplicationWizardData> = {
        right_to_rent_share_code: 'profile_right_to_rent_share_code',
    };

    const handleRightToRentChange = useCallback(
        (field: keyof RightToRentData, value: string) => {
            const targetField = rightToRentFieldMap[field];
            if (targetField) {
                updateField(targetField, value);
                // Note: markFieldTouched is called on blur, not on change (per DESIGN.md)
            }
        },
        [updateField],
    );

    // Per-field blur handler for right to rent section
    const handleRightToRentBlur = useCallback(
        (field: keyof RightToRentData) => {
            const targetField = rightToRentFieldMap[field];
            if (targetField) {
                markFieldTouched(targetField);
                onFieldBlur?.(targetField);
            }
        },
        [markFieldTouched, onFieldBlur],
    );

    // ===== Error/Touched Mapping =====
    // The shared components use fieldPrefix to look up errors/touched
    // Since our fields are like 'profile_date_of_birth', we use 'profile_' as prefix

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
                    <div className="border-t border-border p-4">
                        <PersonalDetailsSection
                            data={personalDetailsData}
                            onChange={handlePersonalDetailsChange}
                            onFieldBlur={handlePersonalDetailsBlur}
                            errors={errors}
                            touchedFields={touchedFields}
                            fieldPrefix="profile_"
                            translations={translations}
                            disabledFields={{
                                first_name: true,
                                last_name: true,
                                email: true,
                            }}
                            defaultPhoneCountryCode={detectedCountry}
                        />
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
                    <div className="border-t border-border p-4">
                        <IdDocumentSection
                            data={idDocumentData}
                            onChange={handleIdDocumentChange}
                            onFieldBlur={handleIdDocumentBlur}
                            errors={errors}
                            touchedFields={touchedFields}
                            fieldPrefix="profile_"
                            translations={translations}
                            existingDocuments={{
                                id_document_front: existingDocuments?.id_document_front,
                                id_document_front_url: existingDocuments?.id_document_front_url,
                                id_document_front_size: existingDocuments?.id_document_front_size,
                                id_document_front_uploaded_at: existingDocuments?.id_document_front_uploaded_at,
                                id_document_back: existingDocuments?.id_document_back,
                                id_document_back_url: existingDocuments?.id_document_back_url,
                                id_document_back_size: existingDocuments?.id_document_back_size,
                                id_document_back_uploaded_at: existingDocuments?.id_document_back_uploaded_at,
                            }}
                            uploadUrl="/tenant-profile/document/upload"
                            onUploadSuccess={handleUploadSuccess}
                        />
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
                    <div className="border-t border-border p-4">
                        <ImmigrationStatusSection
                            data={immigrationStatusData}
                            onChange={handleImmigrationStatusChange}
                            onFieldBlur={handleImmigrationStatusBlur}
                            errors={errors}
                            touchedFields={touchedFields}
                            fieldPrefix="profile_"
                            translations={translations}
                            propertyCountry={propertyCountry}
                            uploadUrl="/tenant-profile/document/upload"
                            documentTypePrefix=""
                            onUploadSuccess={handleUploadSuccess}
                            existingDocument={
                                existingDocuments?.residence_permit_document
                                    ? {
                                          originalName: existingDocuments.residence_permit_document,
                                          previewUrl: existingDocuments.residence_permit_document_url,
                                          size: existingDocuments.residence_permit_document_size,
                                          uploadedAt: existingDocuments.residence_permit_document_uploaded_at,
                                      }
                                    : null
                            }
                        />
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
                        <OptionalBadge />
                        {expandedSections.rightToRent ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>

                {expandedSections.rightToRent && (
                    <div className="border-t border-border p-4">
                        <RightToRentSection
                            data={rightToRentData}
                            onChange={handleRightToRentChange}
                            onFieldBlur={handleRightToRentBlur}
                            errors={errors}
                            touchedFields={touchedFields}
                            fieldPrefix="profile_"
                            translations={translations}
                            uploadUrl="/tenant-profile/document/upload"
                            documentTypePrefix=""
                            onUploadSuccess={handleUploadSuccess}
                            existingDocument={
                                existingDocuments?.right_to_rent_document
                                    ? {
                                          originalName: existingDocuments.right_to_rent_document,
                                          previewUrl: existingDocuments.right_to_rent_document_url,
                                          size: existingDocuments.right_to_rent_document_size,
                                          uploadedAt: existingDocuments.right_to_rent_document_uploaded_at,
                                      }
                                    : null
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
