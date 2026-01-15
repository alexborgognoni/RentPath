import { cn } from '@/lib/utils';
import {
    type CountryInfo,
    COUNTRIES_WITH_DIAL_CODES,
    formatDialCode,
    getCountryByDialCode,
    getCountryByIso2,
    iso2ToFlagEmoji,
    searchCountries,
} from '@/utils/country-data';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Select } from './select';

export type PhoneInputSize = 'sm' | 'md' | 'lg';

export interface PhoneInputProps {
    /** Current phone number value (national format without country code) */
    value: string;
    /** Current country code (e.g., "+31") */
    countryCode: string;
    /** Called when phone number or country changes */
    onChange: (value: string, countryCode: string) => void;
    /** Default country ISO code for initial selection (e.g., "NL") */
    defaultCountry?: string;
    /** Error message to display */
    error?: string;
    /** Called when input loses focus */
    onBlur?: () => void;
    /** Disable the input */
    disabled?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Additional class names for the container */
    className?: string;
    /** Show validation state */
    'aria-invalid'?: boolean;
    /** Close on scroll (default: true) */
    closeOnScroll?: boolean;
    /** Size variant - matches form input sizes (default: md) */
    size?: PhoneInputSize;
}

function filterCountries(countries: CountryInfo[], query: string): CountryInfo[] {
    return searchCountries(query, true);
}

// Size-specific styles for the phone input
const sizeStyles = {
    sm: { height: 'h-8', padding: 'px-3', text: 'text-sm' },
    md: { height: 'h-9', padding: 'px-3', text: 'text-sm' },
    lg: { height: 'h-11', padding: 'px-4', text: 'text-base' },
} as const;

export function PhoneInput({
    value,
    countryCode,
    onChange,
    defaultCountry = 'NL',
    error,
    onBlur,
    disabled = false,
    placeholder = 'Phone number',
    className,
    'aria-invalid': ariaInvalid,
    closeOnScroll = true,
    size = 'md',
}: PhoneInputProps) {
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const [internalCountryIso, setInternalCountryIso] = useState<string>('');

    // Determine current country from countryCode prop or defaultCountry
    const currentCountry = useMemo(() => {
        if (countryCode) {
            const dialCode = countryCode.replace('+', '');
            const country = getCountryByDialCode(dialCode);
            if (country) return country;
        }
        return getCountryByIso2(defaultCountry) || COUNTRIES_WITH_DIAL_CODES[0];
    }, [countryCode, defaultCountry]);

    // Keep internal state in sync
    useEffect(() => {
        setInternalCountryIso(currentCountry.iso2);
    }, [currentCountry.iso2]);

    // Handle country selection
    const handleCountryChange = useCallback(
        (iso2: string) => {
            const country = getCountryByIso2(iso2);
            if (country) {
                setInternalCountryIso(iso2);
                onChange(value, `+${country.dialCode}`);
                phoneInputRef.current?.focus();
            }
        },
        [value, onChange],
    );

    // Handle phone number input change
    const handlePhoneChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value.replace(/[^\d]/g, '');
            onChange(newValue, `+${currentCountry.dialCode}`);
        },
        [currentCountry.dialCode, onChange],
    );

    const hasError = ariaInvalid || !!error;

    const styles = sizeStyles[size];

    return (
        <div className={cn('w-full', className)}>
            <div className="flex">
                {/* Country Selector - never shows error state since it always has a default */}
                <Select
                    value={internalCountryIso}
                    onChange={handleCountryChange}
                    options={COUNTRIES_WITH_DIAL_CODES}
                    getOptionValue={(c) => c.iso2}
                    filterOptions={filterCountries}
                    renderTrigger={(country) => (
                        <span className="flex items-center gap-1.5">
                            <span className="text-base">{country ? iso2ToFlagEmoji(country.iso2) : '?'}</span>
                            <span>{country ? formatDialCode(country.dialCode) : ''}</span>
                        </span>
                    )}
                    renderOption={(c) => (
                        <>
                            <span className="text-base">{iso2ToFlagEmoji(c.iso2)}</span>
                            <span className="flex-1 truncate text-left">{c.name}</span>
                            <span className="text-muted-foreground">{formatDialCode(c.dialCode)}</span>
                        </>
                    )}
                    placeholder=""
                    searchPlaceholder="Search countries..."
                    emptyText="No countries found"
                    disabled={disabled}
                    closeOnScroll={closeOnScroll}
                    minWidth="288px"
                    size={size}
                    fullWidth={false}
                    className="rounded-r-none border-r-0"
                />

                {/* Phone Number Input */}
                <input
                    ref={phoneInputRef}
                    type="tel"
                    name="profile_phone_number"
                    value={value}
                    onChange={handlePhoneChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    placeholder={placeholder}
                    aria-invalid={hasError}
                    className={cn(
                        'min-w-0 flex-1 rounded-l-none rounded-r-md border bg-background',
                        styles.height,
                        styles.padding,
                        styles.text,
                        'border-border placeholder:text-muted-foreground',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        hasError && 'border-destructive bg-destructive/5',
                    )}
                />
            </div>
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
}
