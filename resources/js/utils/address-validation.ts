/**
 * Address validation utilities.
 * Combines postal code validation and state/province requirements.
 */

import { getPostalCodeLabel, getPostalCodePattern, getPostalCodePlaceholder } from './postal-code-patterns';
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
