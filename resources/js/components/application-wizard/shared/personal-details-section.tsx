import { DatePicker } from '@/components/ui/date-picker';
import { NationalitySelect } from '@/components/ui/nationality-select';
import { OptionalBadge } from '@/components/ui/optional-badge';
import { PhoneInput } from '@/components/ui/phone-input';
import type { Translations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';

export interface PersonalDetailsData {
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    nationality: string;
    phone_number: string;
    phone_country_code: string;
    bio: string;
}

export interface PersonalDetailsSectionProps {
    data: PersonalDetailsData;
    onChange: (field: keyof PersonalDetailsData, value: string) => void;
    /** Per-field blur handler - called with field name for per-field validation */
    onFieldBlur?: (field: keyof PersonalDetailsData) => void;
    /** Error messages keyed by field name (with prefix if applicable) */
    errors?: Record<string, string | undefined>;
    /** Touched state keyed by field name (with prefix if applicable) */
    touchedFields?: Record<string, boolean>;
    /** Field prefix for error/touched lookups (e.g., 'cosigner_0_') */
    fieldPrefix?: string;
    translations: Translations;
    /** Fields that should be disabled (pre-filled from external source) */
    disabledFields?: {
        first_name?: boolean;
        last_name?: boolean;
        email?: boolean;
        date_of_birth?: boolean;
    };
    /** Default country code for phone input (ISO-2) */
    defaultPhoneCountryCode?: string;
}

export function PersonalDetailsSection({
    data,
    onChange,
    onFieldBlur,
    errors = {},
    touchedFields = {},
    fieldPrefix = '',
    translations,
    disabledFields = {},
    defaultPhoneCountryCode,
}: PersonalDetailsSectionProps) {
    const t = (key: string) => translate(translations, `wizard.application.shared.personalDetails.${key}`);

    // Helper to get prefixed field key for errors/touched lookups
    const fieldKey = (field: string) => (fieldPrefix ? `${fieldPrefix}${field}` : field);

    // Check if field has error and was touched
    const hasError = (field: string) => !!(touchedFields[fieldKey(field)] && errors[fieldKey(field)]);
    const getError = (field: string) => errors[fieldKey(field)];

    // Get field styling based on error state and disabled state
    const getFieldClass = (field: string, isDisabled = false) => {
        if (isDisabled) {
            return 'w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-muted-foreground';
        }
        const error = hasError(field);
        return `w-full rounded-lg border px-4 py-2 ${error ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    const handlePhoneChange = (phoneNumber: string, countryCode: string) => {
        onChange('phone_number', phoneNumber);
        onChange('phone_country_code', countryCode);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* First Name */}
            <div>
                <label className="mb-1 block text-sm font-medium">{t('fields.firstName') || 'First Name'}</label>
                <input
                    type="text"
                    value={data.first_name}
                    onChange={(e) => onChange('first_name', e.target.value)}
                    onBlur={() => onFieldBlur?.('first_name')}
                    disabled={disabledFields.first_name}
                    aria-invalid={hasError('first_name')}
                    className={getFieldClass('first_name', disabledFields.first_name)}
                />
                {hasError('first_name') && <p className="mt-1 text-sm text-destructive">{getError('first_name')}</p>}
            </div>

            {/* Last Name */}
            <div>
                <label className="mb-1 block text-sm font-medium">{t('fields.lastName') || 'Last Name'}</label>
                <input
                    type="text"
                    value={data.last_name}
                    onChange={(e) => onChange('last_name', e.target.value)}
                    onBlur={() => onFieldBlur?.('last_name')}
                    disabled={disabledFields.last_name}
                    aria-invalid={hasError('last_name')}
                    className={getFieldClass('last_name', disabledFields.last_name)}
                />
                {hasError('last_name') && <p className="mt-1 text-sm text-destructive">{getError('last_name')}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="mb-1 block text-sm font-medium">{t('fields.email') || 'Email'}</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    onBlur={() => onFieldBlur?.('email')}
                    disabled={disabledFields.email}
                    aria-invalid={hasError('email')}
                    className={getFieldClass('email', disabledFields.email)}
                />
                {hasError('email') && <p className="mt-1 text-sm text-destructive">{getError('email')}</p>}
            </div>

            {/* Date of Birth */}
            <div>
                <label className="mb-1 block text-sm font-medium">{t('fields.dateOfBirth') || 'Date of Birth'}</label>
                <DatePicker
                    value={data.date_of_birth}
                    onChange={(value) => onChange('date_of_birth', value || '')}
                    onBlur={() => onFieldBlur?.('date_of_birth')}
                    restriction="past"
                    disabled={disabledFields.date_of_birth}
                    aria-invalid={hasError('date_of_birth')}
                    error={hasError('date_of_birth') ? getError('date_of_birth') : undefined}
                />
            </div>

            {/* Nationality */}
            <div>
                <label className="mb-1 block text-sm font-medium">{t('fields.nationality') || 'Nationality'}</label>
                <NationalitySelect
                    value={data.nationality}
                    onChange={(value) => onChange('nationality', value)}
                    onBlur={() => onFieldBlur?.('nationality')}
                    aria-invalid={hasError('nationality')}
                    error={getError('nationality')}
                />
            </div>

            {/* Phone Number */}
            <div>
                <label className="mb-1 block text-sm font-medium">{t('fields.phoneNumber') || 'Phone Number'}</label>
                <PhoneInput
                    value={data.phone_number}
                    countryCode={data.phone_country_code}
                    onChange={handlePhoneChange}
                    onBlur={() => onFieldBlur?.('phone_number')}
                    defaultCountry={defaultPhoneCountryCode}
                    aria-invalid={hasError('phone_number')}
                    error={getError('phone_number')}
                    placeholder={t('placeholders.phone') || '612345678'}
                />
            </div>

            {/* Bio - spans full width */}
            <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    {t('fields.bio') || 'About Me'}
                    <OptionalBadge />
                </label>
                <textarea
                    value={data.bio}
                    onChange={(e) => onChange('bio', e.target.value)}
                    onBlur={() => onFieldBlur?.('bio')}
                    rows={4}
                    maxLength={1000}
                    placeholder={t('placeholders.bio') || 'Tell us a bit about yourself...'}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    {(t('bioCharacters') || ':count/:max characters').replace(':count', data.bio.length.toString()).replace(':max', '1000')}
                </p>
            </div>
        </div>
    );
}
