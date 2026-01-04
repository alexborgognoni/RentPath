import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Search } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Standard option shape for simple selects */
export interface SelectOption {
    value: string;
    label: string;
}

/** Check if options are standard SelectOption shape */
function isSelectOptionArray(options: unknown[]): options is SelectOption[] {
    return options.length === 0 || (typeof options[0] === 'object' && options[0] !== null && 'value' in options[0] && 'label' in options[0]);
}

/** Default filter for simple text search on label */
function defaultFilter(options: SelectOption[], query: string): SelectOption[] {
    const q = query.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
}

export interface SelectProps<T> {
    /** Current value */
    value: string;
    /** Called when value changes */
    onChange: (value: string) => void;
    /** Array of options */
    options: T[];
    /**
     * Get the value from an option.
     * Optional for {value, label} options - defaults to (opt) => opt.value
     */
    getOptionValue?: (option: T) => string;
    /**
     * Render the trigger content.
     * Optional for {value, label} options - defaults to showing label
     */
    renderTrigger?: (option: T | null, placeholder: string) => ReactNode;
    /**
     * Render an option in the list.
     * Optional for {value, label} options - defaults to showing label
     */
    renderOption?: (option: T) => ReactNode;
    /**
     * Enable search with custom filter function.
     * For simple label-based search, use `searchable={true}` instead.
     */
    filterOptions?: (options: T[], query: string) => T[];
    /**
     * Enable simple label-based search (for {value, label} options).
     * For custom filtering, use `filterOptions` instead.
     */
    searchable?: boolean;
    /**
     * Default selection value to display when value is empty.
     * NOTE: This is only for visual display fallback - it does NOT set form data.
     * Use sparingly (e.g., phone dial code from geolocation). Avoid for sensitive fields.
     */
    defaultSelection?: string;
    /** Placeholder text when no value selected */
    placeholder?: string;
    /** Search input placeholder */
    searchPlaceholder?: string;
    /** Empty state text */
    emptyText?: string;
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
    /** Error message */
    error?: string;
    /** Close on scroll (default: true) */
    closeOnScroll?: boolean;
    /** Compact mode - for inline use */
    compact?: boolean;
    /** Min width for dropdown */
    minWidth?: string;
    /** Hide native scrollbar (default: true) */
    hideScrollbar?: boolean;
}

export function Select<T>({
    value,
    onChange,
    options,
    getOptionValue: getOptionValueProp,
    renderTrigger: renderTriggerProp,
    renderOption: renderOptionProp,
    filterOptions: filterOptionsProp,
    searchable = false,
    defaultSelection,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found',
    onBlur,
    disabled = false,
    className,
    name,
    'aria-invalid': ariaInvalid,
    error,
    closeOnScroll = true,
    compact = false,
    minWidth = '200px',
    hideScrollbar = true,
}: SelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const wasOpenRef = useRef(false);
    const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    // Determine if options are simple {value, label} shape
    const isSimpleOptions = useMemo(() => isSelectOptionArray(options), [options]);

    // Smart defaults for {value, label} options
    const getOptionValue = useMemo(() => {
        if (getOptionValueProp) return getOptionValueProp;
        if (isSimpleOptions) return (opt: T) => (opt as SelectOption).value;
        throw new Error('Select: getOptionValue is required for custom option types');
    }, [getOptionValueProp, isSimpleOptions]);

    const renderTrigger = useMemo(() => {
        if (renderTriggerProp) return renderTriggerProp;
        if (isSimpleOptions) {
            return (opt: T | null, ph: string) => <span className="truncate">{opt ? (opt as unknown as SelectOption).label : ph}</span>;
        }
        throw new Error('Select: renderTrigger is required for custom option types');
    }, [renderTriggerProp, isSimpleOptions]);

    const renderOption = useMemo(() => {
        if (renderOptionProp) return renderOptionProp;
        if (isSimpleOptions) {
            return (opt: T) => <span className="flex-1 truncate text-left">{(opt as SelectOption).label}</span>;
        }
        throw new Error('Select: renderOption is required for custom option types');
    }, [renderOptionProp, isSimpleOptions]);

    // Determine filter function
    const filterOptions = useMemo(() => {
        if (filterOptionsProp) return filterOptionsProp;
        if (searchable && isSimpleOptions) return defaultFilter as unknown as (options: T[], query: string) => T[];
        return undefined;
    }, [filterOptionsProp, searchable, isSimpleOptions]);

    const hasSearch = !!filterOptions;

    // Get current option (use defaultSelection for display fallback only)
    const displayValue = value || defaultSelection || '';
    const currentOption = options.find((opt) => getOptionValue(opt) === displayValue) ?? null;

    // Filter options based on search
    const filteredOptions = hasSearch && search && filterOptions ? filterOptions(options, search) : options;

    // Reset state when popover opens/closes
    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0);
            setSearch('');
            if (hasSearch) {
                setTimeout(() => searchInputRef.current?.focus(), 0);
            }
        } else if (wasOpenRef.current && onBlur) {
            onBlur();
        }
        wasOpenRef.current = isOpen;
    }, [isOpen, onBlur, hasSearch]);

    // Reset highlighted index when search changes
    useEffect(() => {
        setHighlightedIndex(0);
    }, [search]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (isOpen && filteredOptions.length > 0) {
            const item = itemRefs.current.get(highlightedIndex);
            item?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, isOpen, filteredOptions.length]);

    // Close on scroll (but not when scrolling inside the dropdown)
    useEffect(() => {
        if (!isOpen || !closeOnScroll) return;

        const handleScroll = (e: Event) => {
            // Don't close if scrolling inside the popover content
            if (contentRef.current?.contains(e.target as Node)) return;
            setIsOpen(false);
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isOpen, closeOnScroll]);

    const handleSelect = useCallback(
        (option: T) => {
            onChange(getOptionValue(option));
            setIsOpen(false);
            setSearch('');
            triggerRef.current?.focus();
        },
        [onChange, getOptionValue],
    );

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!isOpen) {
                if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(true);
                }
                return;
            }

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredOptions[highlightedIndex]) {
                        handleSelect(filteredOptions[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    setIsOpen(false);
                    break;
            }
        },
        [isOpen, filteredOptions, highlightedIndex, handleSelect],
    );

    const hasError = ariaInvalid || !!error;

    return (
        <div className={cn(!compact && 'w-full')}>
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                <Popover.Trigger asChild>
                    <button
                        ref={triggerRef}
                        type="button"
                        name={name}
                        disabled={disabled}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            'flex cursor-pointer items-center justify-between gap-1 border bg-background',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
                            !currentOption && 'text-muted-foreground',
                            hasError ? 'border-destructive bg-destructive/5' : 'border-border',
                            compact ? 'rounded-l-lg rounded-r-none border-r-0 px-3 py-2' : 'w-full rounded-lg px-4 py-2 gap-2',
                            className,
                        )}
                    >
                        {renderTrigger(currentOption, placeholder)}
                        <ChevronDown className={cn('shrink-0 opacity-50', compact ? 'size-3' : 'size-4')} />
                    </button>
                </Popover.Trigger>

                <Popover.Portal>
                    <Popover.Content
                        ref={contentRef}
                        className={cn(
                            'bg-background text-foreground z-50 rounded-lg border border-border shadow-md',
                            compact ? '' : 'w-[var(--radix-popover-trigger-width)]',
                            'data-[state=open]:animate-in data-[state=closed]:animate-out',
                            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                            'data-[side=bottom]:slide-in-from-top-2',
                        )}
                        style={{ minWidth }}
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        onKeyDown={hasSearch ? undefined : handleKeyDown}
                    >
                        {/* Search Input (optional) */}
                        {hasSearch && (
                            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                                <Search className="size-4 text-muted-foreground" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={searchPlaceholder}
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                />
                            </div>
                        )}

                        {/* Options List */}
                        <div
                            className={cn('max-h-64 overflow-y-auto p-1', hideScrollbar && 'scrollbar-hide')}
                            style={hideScrollbar ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : undefined}
                        >
                            {filteredOptions.length === 0 ? (
                                <div className="px-2 py-4 text-center text-sm text-muted-foreground">{emptyText}</div>
                            ) : (
                                filteredOptions.map((option, index) => (
                                    <button
                                        key={getOptionValue(option)}
                                        ref={(el) => {
                                            if (el) itemRefs.current.set(index, el);
                                            else itemRefs.current.delete(index);
                                        }}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        onMouseMove={() => setHighlightedIndex(index)}
                                        className={cn(
                                            'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                                            index === highlightedIndex && 'bg-muted',
                                        )}
                                    >
                                        {renderOption(option)}
                                    </button>
                                ))
                            )}
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            {error && !compact && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
}
