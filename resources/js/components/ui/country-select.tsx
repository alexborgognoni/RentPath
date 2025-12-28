import { type CountryInfo, getCountryByIso2, iso2ToFlagEmoji, searchCountries, COUNTRIES } from '@/utils/country-data';
import { SearchableSelect } from './searchable-select';

export interface CountrySelectProps {
    /** Current value (ISO 3166-1 alpha-2 code, e.g., "NL") */
    value: string;
    /** Called when country changes */
    onChange: (value: string) => void;
    /** Default country ISO code for initial selection if value is empty */
    defaultCountry?: string;
    /** Error message to display */
    error?: string;
    /** Called when input loses focus */
    onBlur?: () => void;
    /** Disable the select */
    disabled?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Additional class names */
    className?: string;
    /** Show validation state */
    'aria-invalid'?: boolean;
    /** Close on scroll (default: true) */
    closeOnScroll?: boolean;
}

function filterCountries(countries: CountryInfo[], query: string): CountryInfo[] {
    return searchCountries(query);
}

export function CountrySelect({
    value,
    onChange,
    // defaultCountry - reserved for future use
    error,
    onBlur,
    disabled = false,
    placeholder = 'Select country...',
    className,
    'aria-invalid': ariaInvalid,
    closeOnScroll = true,
}: CountrySelectProps) {
    return (
        <SearchableSelect
            value={value}
            onChange={onChange}
            options={COUNTRIES}
            getOptionValue={(c) => c.iso2}
            filterOptions={filterCountries}
            renderTrigger={(country, ph) =>
                country ? (
                    <span className="flex items-center gap-2 truncate">
                        <span className="text-base">{iso2ToFlagEmoji(country.iso2)}</span>
                        <span>{country.name}</span>
                    </span>
                ) : (
                    <span>{ph}</span>
                )
            }
            renderOption={(c) => (
                <>
                    <span className="text-base">{iso2ToFlagEmoji(c.iso2)}</span>
                    <span className="flex-1 truncate text-left">{c.name}</span>
                </>
            )}
            placeholder={placeholder}
            searchPlaceholder="Search countries..."
            emptyText="No countries found"
            onBlur={onBlur}
            disabled={disabled}
            className={className}
            aria-invalid={ariaInvalid}
            error={error}
            closeOnScroll={closeOnScroll}
        />
    );
}

// Re-export for convenience
export { getCountryByIso2, iso2ToFlagEmoji };
