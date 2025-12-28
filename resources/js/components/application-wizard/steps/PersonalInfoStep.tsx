import { CountrySelect } from '@/components/ui/country-select';
import { NationalitySelect } from '@/components/ui/nationality-select';
import { PhoneInput } from '@/components/ui/phone-input';
import { StateProvinceSelect } from '@/components/ui/state-province-select';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import {
    getPostalCodeLabel,
    getPostalCodePlaceholder,
    getStateProvinceLabel,
    hasStateProvinceOptions,
    requiresStateProvince,
} from '@/utils/address-validation';
import { getCountryByIso2 } from '@/utils/country-data';
import { useEffect, useMemo, useRef } from 'react';

interface PersonalInfoStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    onFieldBlur?: (field: string) => void;
}

export function PersonalInfoStep({ data, errors, touchedFields, updateField, markFieldTouched, onBlur, onFieldBlur }: PersonalInfoStepProps) {
    const { countryCode: detectedCountry } = useGeoLocation();
    const hasSetDefaults = useRef(false);

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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Personal Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your profile will be updated when you submit this application.</p>
            </div>

            {/* Date of Birth & Nationality */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={data.profile_date_of_birth}
                        onChange={(e) => handleFieldChange('profile_date_of_birth', e.target.value)}
                        onBlur={onBlur}
                        max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        aria-invalid={!!(touchedFields.profile_date_of_birth && errors.profile_date_of_birth)}
                        className={getFieldClass('profile_date_of_birth')}
                        required
                    />
                    {touchedFields.profile_date_of_birth && errors.profile_date_of_birth && (
                        <p className="mt-1 text-sm text-destructive">{errors.profile_date_of_birth}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Nationality <span className="text-red-500">*</span>
                    </label>
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
                <label className="mb-2 block text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                    value={data.profile_phone_number}
                    countryCode={data.profile_phone_country_code}
                    onChange={handlePhoneChange}
                    onBlur={handleFieldBlur('profile_phone_number')}
                    defaultCountry={detectedCountry}
                    aria-invalid={!!(touchedFields.profile_phone_number && errors.profile_phone_number)}
                    error={touchedFields.profile_phone_number ? errors.profile_phone_number : undefined}
                    placeholder="612345678"
                />
                {touchedFields.profile_phone_number && errors.profile_phone_number && (
                    <p className="mt-1 text-sm text-destructive">{errors.profile_phone_number}</p>
                )}
            </div>

            {/* Current Address */}
            <div className="border-t border-border pt-6">
                <h3 className="mb-4 font-semibold">Current Address</h3>

                {/* Street Name & House Number */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                            Street Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.profile_current_street_name}
                            onChange={(e) => handleFieldChange('profile_current_street_name', e.target.value)}
                            onBlur={onBlur}
                            placeholder="Kalverstraat"
                            aria-invalid={!!(touchedFields.profile_current_street_name && errors.profile_current_street_name)}
                            className={getFieldClass('profile_current_street_name')}
                            required
                        />
                        {touchedFields.profile_current_street_name && errors.profile_current_street_name && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_current_street_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            House Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.profile_current_house_number}
                            onChange={(e) => handleFieldChange('profile_current_house_number', e.target.value)}
                            onBlur={onBlur}
                            placeholder="123A"
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
                    <label className="mb-2 block text-sm font-medium">Apartment, Suite, Unit (optional)</label>
                    <input
                        type="text"
                        value={data.profile_current_address_line_2}
                        onChange={(e) => handleFieldChange('profile_current_address_line_2', e.target.value)}
                        onBlur={onBlur}
                        placeholder="Apt 4B, Floor 2"
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
                        <label className="mb-2 block text-sm font-medium">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.profile_current_city}
                            onChange={(e) => handleFieldChange('profile_current_city', e.target.value)}
                            onBlur={onBlur}
                            placeholder="Amsterdam"
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
                                {stateProvinceLabel} {stateProvinceRequired && <span className="text-red-500">*</span>}
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
                        <label className="mb-2 block text-sm font-medium">
                            {postalCodeLabel} <span className="text-red-500">*</span>
                        </label>
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
                        <label className="mb-2 block text-sm font-medium">
                            Country <span className="text-red-500">*</span>
                        </label>
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
        </div>
    );
}
