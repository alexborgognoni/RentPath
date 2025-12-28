import { cn } from '@/lib/utils';
import { COUNTRIES_WITH_DIAL_CODES, formatDialCode, getCountryByDialCode, getCountryByIso2, iso2ToFlagEmoji, searchCountries } from '@/utils/country-data';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface PhoneInputProps {
    /** Current phone number value (national format without country code) */
    value: string;
    /** Current country code (e.g., "+31") */
    countryCode: string;
    /** Called when phone number or country changes */
    onChange: (value: string, countryCode: string) => void;
    /** Default country ISO code for initial selection (e.g., "NL") */
    defaultCountry?: string;
    /** Error message to display */
    error?: string;
    /** Called when input loses focus */
    onBlur?: () => void;
    /** Disable the input */
    disabled?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Additional class names for the container */
    className?: string;
    /** Show validation state */
    'aria-invalid'?: boolean;
}

export function PhoneInput({
    value,
    countryCode,
    onChange,
    defaultCountry = 'NL',
    error,
    onBlur,
    disabled = false,
    placeholder = 'Phone number',
    className,
    'aria-invalid': ariaInvalid,
}: PhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    // Determine current country from countryCode prop or defaultCountry
    const currentCountry = useMemo(() => {
        if (countryCode) {
            const dialCode = countryCode.replace('+', '');
            const country = getCountryByDialCode(dialCode);
            if (country) return country;
        }
        return getCountryByIso2(defaultCountry) || COUNTRIES_WITH_DIAL_CODES[0];
    }, [countryCode, defaultCountry]);

    // Filter countries based on search (only show countries with dial codes)
    const filteredCountries = useMemo(() => {
        return searchCountries(search, true);
    }, [search]);

    // Reset highlighted index when search changes or popover opens
    useEffect(() => {
        setHighlightedIndex(0);
    }, [search, isOpen]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (isOpen && filteredCountries.length > 0) {
            const item = itemRefs.current.get(highlightedIndex);
            item?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, isOpen, filteredCountries.length]);

    // Handle country selection
    const handleCountrySelect = useCallback(
        (iso2: string) => {
            const country = getCountryByIso2(iso2);
            if (country) {
                onChange(value, `+${country.dialCode}`);
            }
            setIsOpen(false);
            setSearch('');
            phoneInputRef.current?.focus();
        },
        [value, onChange],
    );

    // Handle phone number input change
    const handlePhoneChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value.replace(/[^\d]/g, '');
            onChange(newValue, `+${currentCountry.dialCode}`);
        },
        [currentCountry.dialCode, onChange],
    );

    // Focus search input when popover opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        }
    }, [isOpen]);

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
            if (filteredCountries.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < filteredCountries.length - 1 ? prev + 1 : prev));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredCountries[highlightedIndex]) {
                        handleCountrySelect(filteredCountries[highlightedIndex].iso2);
                    }
                    break;
                case 'Escape':
                    setIsOpen(false);
                    break;
            }
        },
        [filteredCountries, highlightedIndex, handleCountrySelect],
    );

    const hasError = ariaInvalid || !!error;

    return (
        <div className={cn('flex gap-2', className)}>
            {/* Country Selector */}
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                <Popover.Trigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        onKeyDown={handleTriggerKeyDown}
                        className={cn(
                            'flex w-32 shrink-0 cursor-pointer items-center justify-between gap-1 rounded-lg border bg-background px-4 py-2',
                            'border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            hasError && 'border-destructive bg-destructive/5',
                        )}
                    >
                        <span className="flex items-center gap-1.5">
                            <span className="text-base">{iso2ToFlagEmoji(currentCountry.iso2)}</span>
                            <span>{formatDialCode(currentCountry.dialCode)}</span>
                        </span>
                        <ChevronDown className="size-4 shrink-0 opacity-50" />
                    </button>
                </Popover.Trigger>

                <Popover.Portal>
                    <Popover.Content
                        className={cn(
                            'bg-background text-foreground z-50 w-72 rounded-lg border border-border shadow-md',
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
                                placeholder="Search countries..."
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Country List */}
                        <div ref={listRef} className="max-h-64 overflow-y-auto p-1">
                            {filteredCountries.length === 0 ? (
                                <div className="px-2 py-4 text-center text-sm text-muted-foreground">No countries found</div>
                            ) : (
                                filteredCountries.map((c, index) => (
                                    <button
                                        key={c.iso2}
                                        ref={(el) => {
                                            if (el) itemRefs.current.set(index, el);
                                            else itemRefs.current.delete(index);
                                        }}
                                        type="button"
                                        onClick={() => handleCountrySelect(c.iso2)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        className={cn(
                                            'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                                            'hover:bg-muted',
                                            'focus:bg-muted',
                                            index === highlightedIndex && 'bg-muted',
                                            c.iso2 === currentCountry.iso2 && 'font-medium',
                                        )}
                                    >
                                        <span className="text-base">{iso2ToFlagEmoji(c.iso2)}</span>
                                        <span className="flex-1 truncate text-left">{c.name}</span>
                                        <span className="text-muted-foreground">{formatDialCode(c.dialCode)}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            {/* Phone Number Input */}
            <input
                ref={phoneInputRef}
                type="tel"
                value={value}
                onChange={handlePhoneChange}
                onBlur={onBlur}
                disabled={disabled}
                placeholder={placeholder}
                aria-invalid={hasError}
                className={cn(
                    'w-full min-w-0 flex-1 rounded-lg border bg-background px-4 py-2',
                    'border-border placeholder:text-muted-foreground',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    hasError && 'border-destructive bg-destructive/5',
                )}
            />
        </div>
    );
}
