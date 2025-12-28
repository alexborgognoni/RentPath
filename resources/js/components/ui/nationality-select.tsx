import { type CountryInfo, iso2ToFlagEmoji, searchCountries, COUNTRIES } from '@/utils/country-data';
import { SearchableSelect } from './searchable-select';

export interface NationalitySelectProps {
    /** Current value (ISO 3166-1 alpha-2 code, e.g., "NL") */
    value: string;
    /** Called when nationality changes */
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

export function NationalitySelect({
    value,
    onChange,
    // defaultCountry - reserved for future use
    error,
    onBlur,
    disabled = false,
    placeholder = 'Select nationality...',
    className,
    'aria-invalid': ariaInvalid,
    closeOnScroll = true,
}: NationalitySelectProps) {
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
                        <span>{country.demonym}</span>
                    </span>
                ) : (
                    <span>{ph}</span>
                )
            }
            renderOption={(c) => (
                <>
                    <span className="text-base">{iso2ToFlagEmoji(c.iso2)}</span>
                    <span className="flex-1 truncate text-left">{c.demonym}</span>
                    <span className="text-xs text-muted-foreground">{c.name}</span>
                </>
            )}
            placeholder={placeholder}
            searchPlaceholder="Search by country or nationality..."
            emptyText="No nationalities found"
            onBlur={onBlur}
            disabled={disabled}
            className={className}
            aria-invalid={ariaInvalid}
            error={error}
            closeOnScroll={closeOnScroll}
        />
    );
}
