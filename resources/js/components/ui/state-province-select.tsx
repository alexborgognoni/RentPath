import { cn } from '@/lib/utils';
import {
    getStateProvinceLabel,
    getStateProvinceOptions,
    hasStateProvinceOptions,
    type StateProvinceOption,
} from '@/utils/address-validation';
import { useEffect, useMemo, useRef } from 'react';
import { SearchableSelect } from './searchable-select';

export interface StateProvinceSelectProps {
    /** Current value (state/province code or name) */
    value: string;
    /** Called when state/province changes */
    onChange: (value: string) => void;
    /** Country code to determine options (ISO 3166-1 alpha-2) */
    countryCode: string;
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

function filterOptions(options: StateProvinceOption[], query: string): StateProvinceOption[] {
    if (!query) return options;
    const searchLower = query.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(searchLower) || o.code.toLowerCase().includes(searchLower));
}

export function StateProvinceSelect({
    value,
    onChange,
    countryCode,
    error,
    onBlur,
    disabled = false,
    placeholder,
    className,
    'aria-invalid': ariaInvalid,
    closeOnScroll = true,
}: StateProvinceSelectProps) {
    const previousCountryRef = useRef(countryCode);

    // Get label for the field
    const label = getStateProvinceLabel(countryCode);
    const defaultPlaceholder = placeholder || `Select ${label.toLowerCase()}...`;

    // Check if country has predefined options
    const hasOptions = hasStateProvinceOptions(countryCode);

    // Get options for the country
    const options = useMemo(() => {
        return getStateProvinceOptions(countryCode);
    }, [countryCode]);

    // Clear value when country changes (if it's not valid for the new country)
    useEffect(() => {
        if (previousCountryRef.current !== countryCode && value) {
            const newOptions = getStateProvinceOptions(countryCode);
            const isValid = newOptions.some((o) => o.code === value || o.name === value);
            if (!isValid) {
                onChange('');
            }
        }
        previousCountryRef.current = countryCode;
    }, [countryCode, value, onChange]);

    const hasError = ariaInvalid || !!error;

    // For countries without predefined options, show a text input
    if (!hasOptions) {
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={defaultPlaceholder}
                disabled={disabled}
                className={cn(
                    'w-full rounded-lg border bg-background px-4 py-2',
                    'border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    hasError && 'border-destructive bg-destructive/5',
                    className,
                )}
            />
        );
    }

    return (
        <SearchableSelect
            value={value}
            onChange={onChange}
            options={options}
            getOptionValue={(o) => o.code}
            filterOptions={filterOptions}
            renderTrigger={(option, ph) => (option ? <span className="truncate">{option.name}</span> : <span>{ph}</span>)}
            renderOption={(o) => (
                <>
                    <span className="w-10 text-xs text-muted-foreground">{o.code}</span>
                    <span className="flex-1 truncate text-left">{o.name}</span>
                </>
            )}
            placeholder={defaultPlaceholder}
            searchPlaceholder={`Search ${label.toLowerCase()}...`}
            emptyText="No options found"
            onBlur={onBlur}
            disabled={disabled}
            className={className}
            aria-invalid={ariaInvalid}
            error={error}
            closeOnScroll={closeOnScroll}
        />
    );
}
