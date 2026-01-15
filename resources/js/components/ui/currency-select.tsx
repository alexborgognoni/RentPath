import { Select } from './select';

export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
}

// All major world currencies
const CURRENCIES: CurrencyInfo[] = [
    // Major currencies (most commonly used)
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso' },
    { code: 'COP', symbol: 'COL$', name: 'Colombian Peso' },
    { code: 'ARS', symbol: 'AR$', name: 'Argentine Peso' },
    { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
    { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
    { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
    { code: 'ISK', symbol: 'kr', name: 'Icelandic Krona' },
    { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
    { code: 'BHD', symbol: 'ب.د', name: 'Bahraini Dinar' },
    { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial' },
];

// Create a map for quick lookups
const currencyMap = new Map<string, CurrencyInfo>(CURRENCIES.map((c) => [c.code.toLowerCase(), c]));

export function getCurrencyByCode(code: string): CurrencyInfo | undefined {
    return currencyMap.get(code.toLowerCase());
}

export function getCurrencySymbol(code: string): string {
    return getCurrencyByCode(code)?.symbol || code;
}

function filterCurrencies(currencies: CurrencyInfo[], query: string): CurrencyInfo[] {
    if (!query.trim()) return currencies;
    const q = query.toLowerCase().trim();
    return currencies.filter(
        (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
    );
}

export interface CurrencySelectProps {
    /** Current value (currency code, e.g., "eur", "usd") */
    value: string;
    /** Called when currency changes */
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

export function CurrencySelect({
    value,
    onChange,
    error,
    onBlur,
    disabled = false,
    placeholder = 'Select currency...',
    className,
    'aria-invalid': ariaInvalid,
    compact = false,
    closeOnScroll = true,
}: CurrencySelectProps) {
    const handleChange = (code: string) => {
        onChange(code.toLowerCase());
    };

    return (
        <Select
            value={value.toLowerCase()}
            onChange={handleChange}
            options={CURRENCIES}
            getOptionValue={(c) => c.code.toLowerCase()}
            filterOptions={filterCurrencies}
            renderTrigger={(currency, ph) =>
                compact ? (
                    <span className="font-medium">{currency?.symbol || '?'}</span>
                ) : currency ? (
                    <span className="flex items-center gap-2 truncate">
                        <span className="min-w-6 text-muted-foreground">{currency.symbol}</span>
                        <span>{currency.name}</span>
                    </span>
                ) : (
                    <span>{ph}</span>
                )
            }
            renderOption={(c) => (
                <>
                    <span className="min-w-6 text-muted-foreground">{c.symbol}</span>
                    <span className="flex-1 truncate text-left">{c.name}</span>
                </>
            )}
            placeholder={placeholder}
            searchPlaceholder="Search currencies..."
            emptyText="No currencies found"
            onBlur={onBlur}
            disabled={disabled}
            className={compact ? 'rounded-r-none border-r-0' : className}
            aria-invalid={ariaInvalid}
            error={error}
            closeOnScroll={closeOnScroll}
            size="md"
            fullWidth={!compact}
            minWidth="280px"
        />
    );
}
