import { SearchableSelect } from './searchable-select';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SimpleSelectProps {
    /** Current value */
    value: string;
    /** Called when value changes */
    onChange: (value: string) => void;
    /** Array of options */
    options: SelectOption[] | readonly SelectOption[];
    /** Placeholder text when no value selected */
    placeholder?: string;
    /** Called when select loses focus */
    onBlur?: () => void;
    /** Disable the select */
    disabled?: boolean;
    /** Additional class names for trigger */
    className?: string;
    /** Name attribute for form identification and focus */
    name?: string;
    /** Show validation error state */
    'aria-invalid'?: boolean;
    /** Error message to display */
    error?: string;
    /** Close on scroll (default: true) */
    closeOnScroll?: boolean;
}

export function SimpleSelect({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    onBlur,
    disabled = false,
    className,
    name,
    'aria-invalid': ariaInvalid,
    error,
    closeOnScroll = true,
}: SimpleSelectProps) {
    return (
        <SearchableSelect
            value={value}
            onChange={onChange}
            options={options as SelectOption[]}
            getOptionValue={(opt) => opt.value}
            renderTrigger={(opt, ph) => <span className="truncate">{opt?.label || ph}</span>}
            renderOption={(opt) => <span className="flex-1 truncate text-left">{opt.label}</span>}
            placeholder={placeholder}
            onBlur={onBlur}
            disabled={disabled}
            className={className}
            name={name}
            aria-invalid={ariaInvalid}
            error={error}
            closeOnScroll={closeOnScroll}
        />
    );
}
