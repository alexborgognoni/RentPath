import { Select } from './select';

export interface AreaUnitInfo {
    code: string;
    symbol: string;
    name: string;
}

const AREA_UNITS: AreaUnitInfo[] = [
    { code: 'sqm', symbol: 'm²', name: 'Square Meters' },
    { code: 'sqft', symbol: 'ft²', name: 'Square Feet' },
];

const areaUnitMap = new Map<string, AreaUnitInfo>(AREA_UNITS.map((u) => [u.code.toLowerCase(), u]));

export function getAreaUnitByCode(code: string): AreaUnitInfo | undefined {
    return areaUnitMap.get(code.toLowerCase());
}

export function getAreaUnitSymbol(code: string): string {
    return getAreaUnitByCode(code)?.symbol || code;
}

function filterAreaUnits(units: AreaUnitInfo[], query: string): AreaUnitInfo[] {
    if (!query.trim()) return units;
    const q = query.toLowerCase().trim();
    return units.filter(
        (u) => u.code.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.symbol.toLowerCase().includes(q),
    );
}

export interface AreaUnitSelectProps {
    /** Current value (unit code, e.g., "sqm", "sqft") */
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

export function AreaUnitSelect({
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
}: AreaUnitSelectProps) {
    const handleChange = (code: string) => {
        onChange(code.toLowerCase());
    };

    return (
        <Select
            value={value.toLowerCase()}
            onChange={handleChange}
            options={AREA_UNITS}
            getOptionValue={(u) => u.code.toLowerCase()}
            filterOptions={filterAreaUnits}
            renderTrigger={(unit, ph) =>
                compact ? (
                    <span className="font-medium">{unit?.symbol || '?'}</span>
                ) : unit ? (
                    <span className="flex items-center gap-2 truncate">
                        <span className="min-w-[2rem] text-muted-foreground">{unit.symbol}</span>
                        <span>{unit.name}</span>
                    </span>
                ) : (
                    <span>{ph}</span>
                )
            }
            renderOption={(u) => (
                <>
                    <span className="min-w-[2rem] text-muted-foreground">{u.symbol}</span>
                    <span className="flex-1 truncate text-left">{u.name}</span>
                </>
            )}
            placeholder={placeholder}
            searchPlaceholder="Search units..."
            emptyText="No units found"
            onBlur={onBlur}
            disabled={disabled}
            className={className}
            aria-invalid={ariaInvalid}
            error={error}
            closeOnScroll={closeOnScroll}
            compact={compact}
            minWidth="180px"
        />
    );
}
