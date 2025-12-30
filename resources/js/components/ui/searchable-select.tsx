import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Search } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

export interface SearchableSelectProps<T> {
    /** Current value */
    value: string;
    /** Called when value changes */
    onChange: (value: string) => void;
    /** Array of options */
    options: T[];
    /** Get the value from an option */
    getOptionValue: (option: T) => string;
    /** Render the trigger content */
    renderTrigger: (option: T | null, placeholder: string) => ReactNode;
    /** Render an option in the list */
    renderOption: (option: T) => ReactNode;
    /** Filter options based on search query (if not provided, search is disabled) */
    filterOptions?: (options: T[], query: string) => T[];
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

export function SearchableSelect<T>({
    value,
    onChange,
    options,
    getOptionValue,
    renderTrigger,
    renderOption,
    filterOptions,
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
}: SearchableSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const wasOpenRef = useRef(false);
    const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    const hasSearch = !!filterOptions;

    // Get current option
    const currentOption = options.find((opt) => getOptionValue(opt) === value) ?? null;

    // Filter options based on search
    const filteredOptions = hasSearch && search ? filterOptions(options, search) : options;

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
                            'disabled:cursor-not-allowed disabled:opacity-50',
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
                            className={cn(
                                'max-h-64 overflow-y-auto p-1',
                                hideScrollbar && 'scrollbar-hide',
                            )}
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
