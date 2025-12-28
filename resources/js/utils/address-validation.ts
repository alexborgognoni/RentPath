/**
 * Address validation utilities.
 * Combines postal code validation and state/province requirements.
 */

import { getPostalCodeLabel, getPostalCodePattern, getPostalCodePlaceholder, POSTAL_CODE_EXAMPLES } from './postal-code-patterns';
import {
    getStateProvinceLabel,
    getStateProvinceOptions,
    hasStateProvinceOptions,
    requiresStateProvince,
    type StateProvinceOption,
} from './state-province-data';

/**
 * Validate a postal code for a specific country.
 * @param postalCode - The postal code to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if valid or country is not supported, false if invalid format
 */
export function validatePostalCode(postalCode: string, countryCode: string): boolean {
    if (!postalCode || !countryCode) {
        return true; // Let required validation handle empty values
    }

    const pattern = getPostalCodePattern(countryCode);
    if (!pattern) {
        // Unknown country - accept any postal code
        return true;
    }

    return pattern.test(postalCode.trim());
}

/**
 * Get postal code validation error message.
 * @returns Error message or null if valid
 */
export function getPostalCodeError(postalCode: string, countryCode: string): string | null {
    if (!postalCode || !countryCode) {
        return null;
    }

    if (validatePostalCode(postalCode, countryCode)) {
        return null;
    }

    const example = POSTAL_CODE_EXAMPLES[countryCode.toUpperCase()];
    const label = getPostalCodeLabel(countryCode);

    if (example) {
        return `Invalid ${label.toLowerCase()} format. Example: ${example}`;
    }

    return `Invalid ${label.toLowerCase()} format`;
}

// Re-export all functions from the underlying modules for convenience
export {
    getPostalCodeLabel,
    getPostalCodePattern,
    getPostalCodePlaceholder,
    getStateProvinceLabel,
    getStateProvinceOptions,
    hasStateProvinceOptions,
    requiresStateProvince,
    type StateProvinceOption,
};
