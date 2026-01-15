import { Select } from './select';

export interface WeightUnitInfo {
    code: string;
    symbol: string;
    name: string;
}

const WEIGHT_UNITS: WeightUnitInfo[] = [
    { code: 'kg', symbol: 'kg', name: 'Kilograms' },
    { code: 'lbs', symbol: 'lbs', name: 'Pounds' },
];

const weightUnitMap = new Map<string, WeightUnitInfo>(WEIGHT_UNITS.map((u) => [u.code.toLowerCase(), u]));

export function getWeightUnitByCode(code: string): WeightUnitInfo | undefined {
    return weightUnitMap.get(code.toLowerCase());
}

export function getWeightUnitSymbol(code: string): string {
    return getWeightUnitByCode(code)?.symbol || code;
}

function filterWeightUnits(units: WeightUnitInfo[], query: string): WeightUnitInfo[] {
    if (!query.trim()) return units;
    const q = query.toLowerCase().trim();
    return units.filter(
        (u) => u.code.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.symbol.toLowerCase().includes(q),
    );
}

export interface WeightUnitSelectProps {
    /** Current value (unit code, e.g., "kg", "lbs") */
    value: string;
    /** Called when unit changes */
    onChange: (value: string) => void;
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
    /** Compact mode - only shows symbol, designed to be attached to an input */
    compact?: boolean;
    /** Close on scroll (default: true) */
    closeOnScroll?: boolean;
}

export function WeightUnitSelect({
    value,
    onChange,
    error,
    onBlur,
    disabled = false,
    placeholder = 'Select unit...',
    className,
    'aria-invalid': ariaInvalid,
    compact = false,
    closeOnScroll = true,
}: WeightUnitSelectProps) {
    const handleChange = (code: string) => {
        onChange(code.toLowerCase());
    };

    return (
        <Select
            value={value.toLowerCase()}
            onChange={handleChange}
            options={WEIGHT_UNITS}
            getOptionValue={(u) => u.code.toLowerCase()}
            filterOptions={filterWeightUnits}
            renderTrigger={(unit, ph) =>
                compact ? (
                    <span className="font-medium">{unit?.symbol || '?'}</span>
                ) : unit ? (
                    <span className="flex items-center gap-2 truncate">
                        <span className="min-w-8 text-muted-foreground">{unit.symbol}</span>
                        <span>{unit.name}</span>
                    </span>
                ) : (
                    <span>{ph}</span>
                )
            }
            renderOption={(u) => (
                <>
                    <span className="min-w-8 text-muted-foreground">{u.symbol}</span>
                    <span className="flex-1 truncate text-left">{u.name}</span>
                </>
            )}
            placeholder={placeholder}
            searchPlaceholder="Search units..."
            emptyText="No units found"
            onBlur={onBlur}
            disabled={disabled}
            className={compact ? 'rounded-l-none border-l-0' : className}
            aria-invalid={ariaInvalid}
            error={error}
            closeOnScroll={closeOnScroll}
            size={compact ? 'sm' : 'md'}
            fullWidth={!compact}
            minWidth="160px"
        />
    );
}
