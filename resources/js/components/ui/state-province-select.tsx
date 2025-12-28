import { cn } from '@/lib/utils';
import {
    getStateProvinceLabel,
    getStateProvinceOptions,
    hasStateProvinceOptions,
    type StateProvinceOption,
} from '@/utils/address-validation';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
}: StateProvinceSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const wasOpenRef = useRef(false);
    const previousCountryRef = useRef(countryCode);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    // Get label for the field
    const label = getStateProvinceLabel(countryCode);
    const defaultPlaceholder = placeholder || `Select ${label.toLowerCase()}...`;

    // Check if country has predefined options
    const hasOptions = hasStateProvinceOptions(countryCode);

    // Get options for the country
    const options = useMemo(() => {
        return getStateProvinceOptions(countryCode);
    }, [countryCode]);

    // Find current option
    const currentOption = useMemo((): StateProvinceOption | null => {
        if (!value || !hasOptions) return null;
        return options.find((o) => o.code === value || o.name === value) || null;
    }, [value, options, hasOptions]);

    // Filter options based on search
    const filteredOptions = useMemo(() => {
        if (!search) return options;
        const searchLower = search.toLowerCase();
        return options.filter((o) => o.name.toLowerCase().includes(searchLower) || o.code.toLowerCase().includes(searchLower));
    }, [options, search]);

    // Reset highlighted index when search changes or popover opens
    useEffect(() => {
        setHighlightedIndex(0);
    }, [search, isOpen]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (isOpen && filteredOptions.length > 0) {
            const item = itemRefs.current.get(highlightedIndex);
            item?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, isOpen, filteredOptions.length]);

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

    // Handle option selection
    const handleOptionSelect = useCallback(
        (option: StateProvinceOption) => {
            onChange(option.code);
            setIsOpen(false);
            setSearch('');
            triggerRef.current?.focus();
        },
        [onChange],
    );

    // Focus search input when popover opens, call onBlur when it closes
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        } else if (wasOpenRef.current && onBlur) {
            onBlur();
        }
        wasOpenRef.current = isOpen;
    }, [isOpen, onBlur]);

    // Keyboard navigation for trigger button
    const handleTriggerKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            } else if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !isOpen) {
                e.preventDefault();
                setIsOpen(true);
            }
        },
        [isOpen],
    );

    // Keyboard navigation for search input
    const handleSearchKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (filteredOptions.length === 0) return;

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
                        handleOptionSelect(filteredOptions[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    setIsOpen(false);
                    break;
            }
        },
        [filteredOptions, highlightedIndex, handleOptionSelect],
    );

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
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    ref={triggerRef}
                    type="button"
                    disabled={disabled}
                    onKeyDown={handleTriggerKeyDown}
                    className={cn(
                        'flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-background px-4 py-2',
                        'border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        !currentOption && 'text-muted-foreground',
                        hasError && 'border-destructive bg-destructive/5',
                        className,
                    )}
                >
                    {currentOption ? (
                        <span className="truncate">{currentOption.name}</span>
                    ) : (
                        <span>{defaultPlaceholder}</span>
                    )}
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className={cn(
                        'bg-background text-foreground z-50 w-[var(--radix-popover-trigger-width)] min-w-[200px] rounded-lg border border-border shadow-md',
                        'data-[state=open]:animate-in data-[state=closed]:animate-out',
                        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                        'data-[side=bottom]:slide-in-from-top-2',
                    )}
                    side="bottom"
                    align="start"
                    sideOffset={4}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                        <Search className="size-4 text-muted-foreground" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder={`Search ${label.toLowerCase()}...`}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Options List */}
                    <div ref={listRef} className="max-h-64 overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">No options found</div>
                        ) : (
                            filteredOptions.map((option, index) => (
                                <button
                                    key={option.code}
                                    ref={(el) => {
                                        if (el) itemRefs.current.set(index, el);
                                        else itemRefs.current.delete(index);
                                    }}
                                    type="button"
                                    onClick={() => handleOptionSelect(option)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                                        'hover:bg-muted',
                                        'focus:bg-muted',
                                        index === highlightedIndex && 'bg-muted',
                                        (option.code === value || option.name === value) && 'font-medium',
                                    )}
                                >
                                    <span className="w-10 text-xs text-muted-foreground">{option.code}</span>
                                    <span className="flex-1 truncate text-left">{option.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
