import type { Translations, TranslationKey } from '@/types/translations';

export const translate = (translations: Translations, key: TranslationKey): string => {
    // Safety check: ensure both parameters are provided
    if (!translations || typeof translations !== 'object') {
        console.error('translate() called without translations object. Did you forget to pass translations as the first argument?');
        return String(key || '');
    }

    if (!key || typeof key !== 'string') {
        console.error('translate() called without a valid translation key');
        return '';
    }

    const parts = key.split('.');

    let current: unknown = translations;

    for (const part of parts) {
        // Handle array access like 'features[0]'
        const arrayMatch = part.match(/^([^[]+)\[(\d+)\]$/);
        
        if (arrayMatch) {
            const [, arrayKey, indexStr] = arrayMatch;
            const index = parseInt(indexStr, 10);
            
            if (typeof current === 'object' && current !== null && arrayKey in current) {
                const arrayValue = (current as Record<string, unknown>)[arrayKey];
                if (Array.isArray(arrayValue) && index >= 0 && index < arrayValue.length) {
                    current = arrayValue[index];
                } else {
                    return key; // fallback to key if array access invalid
                }
            } else {
                return key; // fallback to key if path invalid
            }
        } else {
            // Handle regular property access
            if (typeof current === 'object' && current !== null && part in current) {
                current = (current as Record<string, unknown>)[part];
            } else {
                return key; // fallback to key if path invalid
            }
        }
    }

    return typeof current === 'string' ? current : key;
};
