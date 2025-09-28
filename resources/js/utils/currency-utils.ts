// Common currencies with their symbols and conversion rates (base: EUR)
// Exchange rates updated September 2025
export const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 1.0 },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1.17 },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.87 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', rate: 0.94 },
] as const;

export type Currency = (typeof currencies)[number];
export type CurrencyCode = Currency['code'];

// Get currency by code
export const getCurrency = (code: Currency['code']) => {
    return currencies.find((currency) => currency.code === code) || currencies[0];
};

// Convert amount from base to quote currency
export const convertCurrency = (amount: number, baseCurrency: CurrencyCode = 'EUR', quoteCurrency: CurrencyCode = 'EUR') => {
    if (baseCurrency === quoteCurrency) return amount;

    const baseCurrencyData = getCurrency(baseCurrency);
    const quoteCurrencyData = getCurrency(quoteCurrency);

    // Handle missing currency data
    if (!baseCurrencyData || !quoteCurrencyData) return amount;

    const baseRate = baseCurrencyData.rate;
    const quoteRate = quoteCurrencyData.rate;

    // Handle invalid rates
    if (!baseRate || !quoteRate || baseRate <= 0 || quoteRate <= 0) return amount;

    // Convert quote EUR first, then quote target currency
    const amountInEUR = amount / baseRate;
    const convertedAmount = amountInEUR * quoteRate;

    // Ensure result is a valid number
    return isNaN(convertedAmount) ? amount : convertedAmount;
};

// Format currency amount with proper symbol and decimals
export const formatCurrency = (amount: string, baseCurrency: CurrencyCode = 'EUR') => {
    // Handle invalid inputs
    const numericAmount = parseFloat(amount);
    if (!numericAmount || isNaN(numericAmount)) return '€0.00';

    const currentCurrency = getCurrencyFromStorage();
    const currency = getCurrency(currentCurrency);

    if (!currency) return `€${numericAmount.toFixed(2)}`;

    const convertedAmount = convertCurrency(numericAmount, baseCurrency, currentCurrency);

    // Ensure converted amount is a valid number
    const finalAmount = isNaN(convertedAmount) ? numericAmount : convertedAmount;

    // For most currencies, use 2 decimal places
    const formatted = finalAmount.toFixed(2);

    // Format with proper symbol placement
    if (['USD', 'CAD', 'AUD'].includes(currentCurrency)) {
        return `${currency.symbol}${formatted}`;
    } else if (['SEK', 'NOK', 'DKK'].includes(currentCurrency)) {
        return `${formatted} ${currency.symbol}`;
    } else if (currentCurrency === 'CHF') {
        return `${currency.symbol} ${formatted}`;
    } else {
        // EUR, GBP and others
        return `${currency.symbol}${formatted}`;
    }
};

// Currency context functions
export const getCurrencyFromStorage = (): CurrencyCode => {
    if (typeof window === 'undefined') return 'EUR';
    return (localStorage.getItem('selectedCurrency') as CurrencyCode) || 'EUR';
};

export const setCurrencyInStorage = (currencyCode: CurrencyCode) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('selectedCurrency', currencyCode);
};

// Convert and round up to nearest whole number for pricing
export const convertAndRoundUpPrice = (basePrice: number, baseCurrency: CurrencyCode = 'EUR', targetCurrency: CurrencyCode = 'EUR') => {
    const convertedPrice = convertCurrency(basePrice, baseCurrency, targetCurrency);
    return Math.ceil(convertedPrice); // Always round up to nearest whole number
};

// Hook for currency conversion
export const useCurrency = () => {
    const currentCurrency = getCurrencyFromStorage();

    const changeCurrency = (newCurrency: CurrencyCode) => {
        setCurrencyInStorage(newCurrency);
        // Trigger page refresh or state update
        window.dispatchEvent(new CustomEvent('currencyChange', { detail: newCurrency }));
    };

    const formatPrice = (amount: string) => {
        return formatCurrency(amount, currentCurrency);
    };

    const convertPrice = (basePrice: number, baseCurrency: CurrencyCode = 'EUR') => {
        return convertAndRoundUpPrice(basePrice, baseCurrency, currentCurrency);
    };

    return {
        currentCurrency,
        changeCurrency,
        formatPrice,
        convertPrice,
        currencies,
        getCurrency: () => getCurrency(currentCurrency),
    };
};
