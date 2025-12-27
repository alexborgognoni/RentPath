import { cn } from '@/lib/utils';
import { type CountryInfo, getCountryByIso2, iso2ToFlagEmoji, searchCountries } from '@/utils/country-data';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface CountrySelectProps {
    /** Current value (ISO 3166-1 alpha-2 code, e.g., "NL") */
    value: string;
    /** Called when country changes */
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
}

export function CountrySelect({
    value,
    onChange,
    // defaultCountry - reserved for future use
    error,
    onBlur,
    disabled = false,
    placeholder = 'Select country...',
    className,
    'aria-invalid': ariaInvalid,
}: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const wasOpenRef = useRef(false);

    // Get current country info
    const currentCountry = useMemo((): CountryInfo | null => {
        if (!value) return null;
        return getCountryByIso2(value) || null;
    }, [value]);

    // Filter countries based on search
    const filteredCountries = useMemo(() => {
        return searchCountries(search);
    }, [search]);

    // Handle country selection
    const handleCountrySelect = useCallback(
        (iso2: string) => {
            onChange(iso2);
            setIsOpen(false);
            setSearch('');
            // Return focus to trigger
            triggerRef.current?.focus();
        },
        [onChange],
    );

    // Focus search input when popover opens, call onBlur when it closes
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        } else if (wasOpenRef.current && onBlur) {
            // Only call onBlur when transitioning from open to closed
            onBlur();
        }
        wasOpenRef.current = isOpen;
    }, [isOpen, onBlur]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
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

    const hasError = ariaInvalid || !!error;

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    ref={triggerRef}
                    type="button"
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-lg border bg-background px-4 py-2',
                        'border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        !currentCountry && 'text-muted-foreground',
                        hasError && 'border-destructive bg-destructive/5',
                        className,
                    )}
                >
                    {currentCountry ? (
                        <span className="flex items-center gap-2 truncate">
                            <span className="text-base">{iso2ToFlagEmoji(currentCountry.iso2)}</span>
                            <span>{currentCountry.name}</span>
                        </span>
                    ) : (
                        <span>{placeholder}</span>
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
                            placeholder="Search countries..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Country List */}
                    <div className="max-h-64 overflow-y-auto p-1">
                        {filteredCountries.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">No countries found</div>
                        ) : (
                            filteredCountries.map((c) => (
                                <button
                                    key={c.iso2}
                                    type="button"
                                    onClick={() => handleCountrySelect(c.iso2)}
                                    className={cn(
                                        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                                        'hover:bg-muted',
                                        'focus:bg-muted',
                                        c.iso2 === value && 'bg-muted',
                                    )}
                                >
                                    <span className="text-base">{iso2ToFlagEmoji(c.iso2)}</span>
                                    <span className="flex-1 truncate text-left">{c.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
