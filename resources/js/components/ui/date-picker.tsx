import { cn } from '@/lib/utils';
import {
    CalendarDate,
    getLocalTimeZone,
    parseDate as parseISODate,
    today,
} from '@internationalized/date';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    Button,
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarStateContext,
    DateInput,
    DatePicker as AriaDatePicker,
    DateSegment,
    Dialog,
    Group,
    Popover,
} from 'react-aria-components';

/** Date restriction presets */
export type DateRestriction = 'past' | 'future' | 'any';

export interface DatePickerProps {
    /** Current value (ISO date string: yyyy-MM-dd) */
    value: string;
    /** Called when date changes (returns ISO date string) */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Date restriction preset: 'past' (up to today), 'future' (from today), 'any' (no restriction) */
    restriction?: DateRestriction;
    /** Minimum selectable date (overrides restriction if provided) */
    min?: Date | string;
    /** Maximum selectable date (overrides restriction if provided) */
    max?: Date | string;
    /** Called when picker loses focus */
    onBlur?: () => void;
    /** Disable the picker */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
    /** Show validation error state */
    'aria-invalid'?: boolean;
    /** Error message */
    error?: string;
}

/** Convert Date or string to CalendarDate */
function toCalendarDate(value: Date | string | undefined): CalendarDate | undefined {
    if (!value) return undefined;
    if (value instanceof Date) {
        return new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
    }
    try {
        return parseISODate(value);
    } catch {
        return undefined;
    }
}

interface DropdownProps {
    minValue?: CalendarDate;
    maxValue?: CalendarDate;
}

/** Month dropdown for quick navigation */
function MonthDropdown({ minValue, maxValue }: DropdownProps) {
    const state = useContext(CalendarStateContext);
    if (!state) return null;

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const currentYear = state.focusedDate.year;

    // Filter months based on min/max constraints for the current year
    const availableMonths = months.map((month, idx) => {
        const monthNum = idx + 1;
        let disabled = false;

        if (minValue && currentYear === minValue.year && monthNum < minValue.month) {
            disabled = true;
        }
        if (maxValue && currentYear === maxValue.year && monthNum > maxValue.month) {
            disabled = true;
        }

        return { name: month, value: monthNum, disabled };
    });

    return (
        <select
            aria-label="Month"
            value={state.focusedDate.month}
            onChange={(e) => {
                const newDate = state.focusedDate.set({ month: parseInt(e.target.value) });
                state.setFocusedDate(newDate);
            }}
            className="cursor-pointer rounded border-none bg-transparent px-1 py-0.5 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
            {availableMonths.map(({ name, value, disabled }) => (
                <option key={name} value={value} disabled={disabled}>
                    {name}
                </option>
            ))}
        </select>
    );
}

/** Year dropdown for quick navigation */
function YearDropdown({ minValue, maxValue }: DropdownProps) {
    const state = useContext(CalendarStateContext);
    if (!state) return null;

    // Determine year range based on constraints
    const thisYear = new Date().getFullYear();
    const minYear = minValue?.year ?? thisYear - 100;
    const maxYear = maxValue?.year ?? thisYear + 20;

    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    return (
        <select
            aria-label="Year"
            value={state.focusedDate.year}
            onChange={(e) => {
                const newDate = state.focusedDate.set({ year: parseInt(e.target.value) });
                state.setFocusedDate(newDate);
            }}
            className="cursor-pointer rounded border-none bg-transparent px-1 py-0.5 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
            {years.map((year) => (
                <option key={year} value={year}>
                    {year}
                </option>
            ))}
        </select>
    );
}

export function DatePicker({
    value,
    onChange,
    restriction = 'any',
    min,
    max,
    onBlur,
    disabled = false,
    className,
    'aria-invalid': ariaInvalid,
    error,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wasOpenRef = useRef(false);

    // Convert value to CalendarDate
    const dateValue = useMemo(() => toCalendarDate(value), [value]);

    // Compute effective min/max based on restriction and explicit min/max props
    const { minValue, maxValue } = useMemo(() => {
        const todayDate = today(getLocalTimeZone());
        let effectiveMin = toCalendarDate(min);
        let effectiveMax = toCalendarDate(max);

        // Apply restriction presets (only if explicit min/max not provided)
        if (restriction === 'past' && !max) {
            effectiveMax = todayDate;
        } else if (restriction === 'future' && !min) {
            effectiveMin = todayDate;
        }

        return { minValue: effectiveMin, maxValue: effectiveMax };
    }, [min, max, restriction]);

    // Call onBlur when popover closes
    useEffect(() => {
        if (!isOpen && wasOpenRef.current && onBlur) {
            onBlur();
        }
        wasOpenRef.current = isOpen;
    }, [isOpen, onBlur]);

    const handleChange = (date: CalendarDate | null) => {
        if (date) {
            onChange(date.toString()); // Returns ISO format yyyy-MM-dd
        }
    };

    const hasError = ariaInvalid || !!error;

    return (
        <AriaDatePicker
            value={dateValue}
            onChange={handleChange}
            minValue={minValue}
            maxValue={maxValue}
            isDisabled={disabled}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            granularity="day"
            className={cn('group', className)}
        >
            <Group
                className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 py-2',
                    'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
                    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                    hasError && 'border-destructive bg-destructive/5',
                )}
            >
                <DateInput className="flex flex-1 items-center">
                    {(segment) => (
                        <DateSegment
                            segment={segment}
                            className={cn(
                                'rounded px-0.5 tabular-nums outline-none',
                                'focus:bg-primary focus:text-primary-foreground',
                                'data-[placeholder]:text-muted-foreground',
                                'data-[type=literal]:text-muted-foreground',
                            )}
                        />
                    )}
                </DateInput>
                <Button className="shrink-0 cursor-pointer outline-none">
                    <CalendarIcon className="size-4 shrink-0 opacity-50" />
                </Button>
            </Group>

            <Popover
                className={cn(
                    'z-50 rounded-lg border border-border bg-background p-3 shadow-md',
                    'data-[entering]:animate-in data-[exiting]:animate-out',
                    'data-[entering]:fade-in-0 data-[exiting]:fade-out-0',
                    'data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95',
                    'data-[placement=bottom]:slide-in-from-top-2',
                )}
                offset={4}
            >
                <Dialog className="outline-none">
                    <Calendar className="w-[280px]">
                        {/* Header with month/year dropdowns and nav buttons */}
                        <header className="mb-4 flex items-center justify-between gap-1">
                            <Button
                                slot="previous"
                                className={cn(
                                    'flex size-8 cursor-pointer items-center justify-center rounded-md outline-none',
                                    'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                )}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                <MonthDropdown minValue={minValue} maxValue={maxValue} />
                                <YearDropdown minValue={minValue} maxValue={maxValue} />
                            </div>
                            <Button
                                slot="next"
                                className={cn(
                                    'flex size-8 cursor-pointer items-center justify-center rounded-md outline-none',
                                    'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                )}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </header>

                        {/* Calendar grid */}
                        <CalendarGrid className="w-full border-collapse">
                            <CalendarGridHeader>
                                {(day) => (
                                    <CalendarHeaderCell className="w-10 pb-2 text-center text-xs font-medium text-muted-foreground">
                                        {day}
                                    </CalendarHeaderCell>
                                )}
                            </CalendarGridHeader>
                            <CalendarGridBody>
                                {(date) => (
                                    <CalendarCell
                                        date={date}
                                        className={cn(
                                            'flex size-10 cursor-pointer items-center justify-center rounded-md text-sm outline-none',
                                            'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                                            'data-[selected]:bg-primary data-[selected]:text-primary-foreground',
                                            'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                                            'data-[unavailable]:cursor-not-allowed data-[unavailable]:line-through data-[unavailable]:opacity-50',
                                            'data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50',
                                        )}
                                    />
                                )}
                            </CalendarGridBody>
                        </CalendarGrid>
                    </Calendar>
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
}
