import { currencies, getCurrency, getCurrencyFromStorage, setCurrencyInStorage, type Currency, type CurrencyCode } from '@/utils/currency-utils';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CurrencySelector() {
    const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('EUR');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setCurrentCurrency(getCurrencyFromStorage());

        const handleCurrencyChange = (event: CustomEvent<CurrencyCode>) => {
            setCurrentCurrency(event.detail);
        };

        // Type assertion because window.addEventListener does not know our custom event type
        window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
        return () => window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    }, []);

    const currentCurrencyData: Currency | undefined = getCurrency(currentCurrency);

    const handleCurrencyChange = (currencyCode: CurrencyCode) => {
        setCurrencyInStorage(currencyCode);
        setCurrentCurrency(currencyCode);
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent<CurrencyCode>('currencyChange', { detail: currencyCode }));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-surface text-text-secondary hover:text-text-primary flex items-center space-x-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background"
            >
                <span>{currentCurrencyData?.flag}</span>
                <span className="hidden sm:block">{currentCurrencyData?.code}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                    <div className="bg-surface absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-lg border border-border shadow-xl">
                        <div className="py-1">
                            {currencies.map((currency: Currency) => (
                                <button
                                    key={currency.code}
                                    onClick={() => handleCurrencyChange(currency.code)}
                                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background ${
                                        currentCurrency === currency.code ? 'bg-background text-primary' : 'text-text-secondary'
                                    }`}
                                >
                                    <span className="text-base">{currency.flag}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{currency.code}</span>
                                            <span className="text-xs opacity-75">{currency.symbol}</span>
                                        </div>
                                        <div className="text-xs opacity-60">{currency.name}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
