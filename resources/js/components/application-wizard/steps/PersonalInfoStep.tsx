import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { COUNTRIES } from '@/lib/validation/property-validation';

// Common phone country codes for EU focus
const PHONE_COUNTRY_CODES = [
    { code: '+31', country: 'NL' },
    { code: '+32', country: 'BE' },
    { code: '+33', country: 'FR' },
    { code: '+34', country: 'ES' },
    { code: '+39', country: 'IT' },
    { code: '+41', country: 'CH' },
    { code: '+43', country: 'AT' },
    { code: '+44', country: 'GB' },
    { code: '+49', country: 'DE' },
    { code: '+351', country: 'PT' },
    { code: '+352', country: 'LU' },
    { code: '+353', country: 'IE' },
    { code: '+1', country: 'US' },
];

// Nationalities using ISO 3166-1 alpha-2 codes (industry standard)
// Store code, display demonym
const NATIONALITIES = [
    { code: 'NL', name: 'Dutch' },
    { code: 'BE', name: 'Belgian' },
    { code: 'DE', name: 'German' },
    { code: 'FR', name: 'French' },
    { code: 'GB', name: 'British' },
    { code: 'IE', name: 'Irish' },
    { code: 'IT', name: 'Italian' },
    { code: 'ES', name: 'Spanish' },
    { code: 'PT', name: 'Portuguese' },
    { code: 'AT', name: 'Austrian' },
    { code: 'CH', name: 'Swiss' },
    { code: 'US', name: 'American' },
    { code: 'OTHER', name: 'Other' },
];

// Country code to name mapping
const COUNTRY_NAMES: Record<string, string> = {
    AT: 'Austria',
    BE: 'Belgium',
    CH: 'Switzerland',
    DE: 'Germany',
    ES: 'Spain',
    FR: 'France',
    GB: 'United Kingdom',
    IE: 'Ireland',
    IT: 'Italy',
    LU: 'Luxembourg',
    NL: 'Netherlands',
    PT: 'Portugal',
    US: 'United States',
};

interface PersonalInfoStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
}

export function PersonalInfoStep({ data, errors, touchedFields, updateField, markFieldTouched, onBlur }: PersonalInfoStepProps) {
    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
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
                    <select
                        value={data.profile_nationality}
                        onChange={(e) => handleFieldChange('profile_nationality', e.target.value)}
                        onBlur={onBlur}
                        aria-invalid={!!(touchedFields.profile_nationality && errors.profile_nationality)}
                        className={getFieldClass('profile_nationality')}
                        required
                    >
                        <option value="">Select nationality...</option>
                        {NATIONALITIES.map((nat) => (
                            <option key={nat.code} value={nat.code}>
                                {nat.name}
                            </option>
                        ))}
                    </select>
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
                <div className="flex gap-2">
                    <select
                        value={data.profile_phone_country_code}
                        onChange={(e) => handleFieldChange('profile_phone_country_code', e.target.value)}
                        onBlur={onBlur}
                        className="w-32 rounded-lg border border-border bg-background px-3 py-2"
                    >
                        {PHONE_COUNTRY_CODES.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.code} ({item.country})
                            </option>
                        ))}
                    </select>
                    <input
                        type="tel"
                        value={data.profile_phone_number}
                        onChange={(e) => handleFieldChange('profile_phone_number', e.target.value)}
                        onBlur={onBlur}
                        placeholder="612345678"
                        aria-invalid={!!(touchedFields.profile_phone_number && errors.profile_phone_number)}
                        className={`flex-1 ${getFieldClass('profile_phone_number')}`}
                        required
                    />
                </div>
                {touchedFields.profile_phone_number && errors.profile_phone_number && (
                    <p className="mt-1 text-sm text-destructive">{errors.profile_phone_number}</p>
                )}
            </div>

            {/* Current Address */}
            <div className="border-t border-border pt-6">
                <h3 className="mb-4 font-semibold">Current Address</h3>

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

                <div className="mt-4 grid gap-4 md:grid-cols-3">
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

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.profile_current_postal_code}
                            onChange={(e) => handleFieldChange('profile_current_postal_code', e.target.value)}
                            onBlur={onBlur}
                            placeholder="1012 AB"
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
                        <select
                            value={data.profile_current_country}
                            onChange={(e) => handleFieldChange('profile_current_country', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields.profile_current_country && errors.profile_current_country)}
                            className={getFieldClass('profile_current_country')}
                            required
                        >
                            <option value="">Select country...</option>
                            {COUNTRIES.map((code) => (
                                <option key={code} value={code}>
                                    {COUNTRY_NAMES[code] || code}
                                </option>
                            ))}
                        </select>
                        {touchedFields.profile_current_country && errors.profile_current_country && (
                            <p className="mt-1 text-sm text-destructive">{errors.profile_current_country}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
