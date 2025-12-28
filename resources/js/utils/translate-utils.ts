import type { Translations } from '@/types/translations';

export const translate = (translations: Translations, key: string, params?: Record<string, string | number>): string => {
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

    if (typeof current !== 'string') {
        return key;
    }

    let result = current;

    // Handle Laravel-style pluralization: "singular|plural"
    // e.g., ":count spot|:count spots" with count=2 becomes "2 spots"
    if (result.includes('|') && params && 'count' in params) {
        const count = Number(params.count);
        const [singular, plural] = result.split('|');
        result = count === 1 ? singular : plural;
    }

    // Replace Laravel-style :param placeholders
    if (params) {
        return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
            return str.replace(new RegExp(`:${paramKey}`, 'g'), String(paramValue));
        }, result);
    }

    return result;
};
