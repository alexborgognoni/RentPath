import { useMemo } from 'react';
import { CountrySelect } from './country-select';
import { StateProvinceSelect } from './state-province-select';
import {
    getPostalCodeLabel,
    getPostalCodePlaceholder,
    getStateProvinceLabel,
    hasStateProvinceOptions,
    requiresStateProvince,
} from '@/utils/address-validation';

export interface AddressData {
    street_name: string;
    house_number: string;
    address_line_2: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
}

export interface AddressFormTranslations {
    streetName?: string;
    houseNumber?: string;
    apartment?: string;
    city?: string;
    country?: string;
    optional?: string;
    placeholders?: {
        streetName?: string;
        houseNumber?: string;
        apartment?: string;
        city?: string;
        country?: string;
    };
}

interface AddressFormProps {
    /** The address data */
    data: AddressData;
    /** Callback when a field changes. Receives field name (without prefix) and value */
    onChange: (field: keyof AddressData, value: string) => void;
    /** Blur handler for autosave */
    onBlur?: () => void;
    /** Errors object keyed by full field names */
    errors?: Record<string, string>;
    /** Touched fields object keyed by full field names */
    touchedFields?: Record<string, boolean>;
    /** Prefix for field names in errors/touchedFields (e.g., 'profile_current' -> 'profile_current_street_name') */
    fieldPrefix?: string;
    /** Translations for field labels and placeholders */
    translations?: AddressFormTranslations;
    /** Default country for country select */
    defaultCountry?: string;
    /** Whether all fields are required (default: true) */
    required?: boolean;
    /** Custom class for the container */
    className?: string;
}

const defaultTranslations: AddressFormTranslations = {
    streetName: 'Street Name',
    houseNumber: 'House Number',
    apartment: 'Apartment / Unit / Floor',
    city: 'City',
    country: 'Country',
    optional: 'optional',
    placeholders: {
        streetName: 'e.g., Main Street',
        houseNumber: 'e.g., 123A',
        apartment: 'e.g., Apt 4B, Floor 2',
        city: 'e.g., Amsterdam',
        country: 'Select country...',
    },
};

export function AddressForm({
    data,
    onChange,
    onBlur,
    errors = {},
    touchedFields = {},
    fieldPrefix = '',
    translations: providedTranslations,
    defaultCountry,
    required = true,
    className,
}: AddressFormProps) {
    const t = { ...defaultTranslations, ...providedTranslations, placeholders: { ...defaultTranslations.placeholders, ...providedTranslations?.placeholders } };

    // Generate full field name with prefix
    const fieldName = (field: keyof AddressData): string => {
        return fieldPrefix ? `${fieldPrefix}_${field}` : field;
    };

    // Check if field has error
    const hasError = (field: keyof AddressData): boolean => {
        const name = fieldName(field);
        return !!(touchedFields[name] && errors[name]);
    };

    // Get error message for field
    const getError = (field: keyof AddressData): string | undefined => {
        const name = fieldName(field);
        return touchedFields[name] ? errors[name] : undefined;
    };

    // Get field class based on error state
    const getFieldClass = (field: keyof AddressData) => {
        return `w-full rounded-lg border px-4 py-2 ${hasError(field) ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    // Country-specific address field info
    // Only use defaults for labels/placeholders, not for showing state province
    const countryForLabels = data.country || defaultCountry || 'NL';
    const postalCodeLabel = useMemo(() => getPostalCodeLabel(countryForLabels), [countryForLabels]);
    const postalCodePlaceholder = useMemo(() => getPostalCodePlaceholder(countryForLabels), [countryForLabels]);
    const stateProvinceLabel = useMemo(() => getStateProvinceLabel(countryForLabels), [countryForLabels]);
    // Only show state/province if a country is actually selected AND it has options
    const showStateProvince = useMemo(() => data.country && hasStateProvinceOptions(data.country), [data.country]);
    const stateProvinceRequired = useMemo(() => data.country && requiresStateProvince(data.country), [data.country]);

    const handleStateProvinceChange = (value: string) => {
        onChange('state_province', value);
    };

    return (
        <div className={className}>
            {/* Street Name & House Number */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">{t.streetName}</label>
                    <input
                        type="text"
                        value={data.street_name}
                        onChange={(e) => onChange('street_name', e.target.value)}
                        onBlur={onBlur}
                        placeholder={t.placeholders?.streetName}
                        aria-invalid={hasError('street_name')}
                        className={getFieldClass('street_name')}
                        required={required}
                    />
                    {getError('street_name') && (
                        <p className="mt-1 text-sm text-destructive">{getError('street_name')}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t.houseNumber}</label>
                    <input
                        type="text"
                        value={data.house_number}
                        onChange={(e) => onChange('house_number', e.target.value)}
                        onBlur={onBlur}
                        placeholder={t.placeholders?.houseNumber}
                        aria-invalid={hasError('house_number')}
                        className={getFieldClass('house_number')}
                        required={required}
                    />
                    {getError('house_number') && (
                        <p className="mt-1 text-sm text-destructive">{getError('house_number')}</p>
                    )}
                </div>
            </div>

            {/* Address Line 2 (optional) */}
            <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">
                    {t.apartment} <span className="text-muted-foreground">({t.optional})</span>
                </label>
                <input
                    type="text"
                    value={data.address_line_2}
                    onChange={(e) => onChange('address_line_2', e.target.value)}
                    onBlur={onBlur}
                    placeholder={t.placeholders?.apartment}
                    aria-invalid={hasError('address_line_2')}
                    className={getFieldClass('address_line_2')}
                />
            </div>

            {/* City & State/Province */}
            <div className={`mt-4 grid gap-4 ${showStateProvince ? 'md:grid-cols-2' : ''}`}>
                <div>
                    <label className="mb-2 block text-sm font-medium">{t.city}</label>
                    <input
                        type="text"
                        value={data.city}
                        onChange={(e) => onChange('city', e.target.value)}
                        onBlur={onBlur}
                        placeholder={t.placeholders?.city}
                        aria-invalid={hasError('city')}
                        className={getFieldClass('city')}
                        required={required}
                    />
                    {getError('city') && (
                        <p className="mt-1 text-sm text-destructive">{getError('city')}</p>
                    )}
                </div>

                {showStateProvince && (
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {stateProvinceLabel}
                            {!stateProvinceRequired && <span className="text-muted-foreground"> ({t.optional})</span>}
                        </label>
                        <StateProvinceSelect
                            value={data.state_province}
                            onChange={handleStateProvinceChange}
                            onBlur={onBlur}
                            countryCode={data.country}
                            aria-invalid={hasError('state_province')}
                            error={getError('state_province')}
                        />
                        {getError('state_province') && (
                            <p className="mt-1 text-sm text-destructive">{getError('state_province')}</p>
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
                        value={data.postal_code}
                        onChange={(e) => onChange('postal_code', e.target.value)}
                        onBlur={onBlur}
                        placeholder={postalCodePlaceholder}
                        aria-invalid={hasError('postal_code')}
                        className={getFieldClass('postal_code')}
                        required={required}
                    />
                    {getError('postal_code') && (
                        <p className="mt-1 text-sm text-destructive">{getError('postal_code')}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t.country}</label>
                    <CountrySelect
                        value={data.country}
                        onChange={(value) => onChange('country', value)}
                        onBlur={onBlur}
                        defaultCountry={defaultCountry}
                        placeholder={t.placeholders?.country}
                        aria-invalid={hasError('country')}
                        error={getError('country')}
                    />
                    {getError('country') && (
                        <p className="mt-1 text-sm text-destructive">{getError('country')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
