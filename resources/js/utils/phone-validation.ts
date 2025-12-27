import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

/**
 * Validate a phone number for a specific country
 * @param phoneNumber - The national phone number (without country code)
 * @param countryCode - The dial code (e.g., "+31") or ISO country code (e.g., "NL")
 * @returns true if valid, false otherwise
 */
export function validatePhoneNumber(phoneNumber: string, countryCode: string): boolean {
    if (!phoneNumber || !countryCode) return false;

    try {
        // Convert dial code to full number
        const dialCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
        const fullNumber = `${dialCode}${phoneNumber}`;

        return isValidPhoneNumber(fullNumber);
    } catch {
        return false;
    }
}

/**
 * Get a formatted phone number for display
 * @param phoneNumber - The national phone number
 * @param countryCode - The dial code (e.g., "+31")
 * @returns Formatted phone number or original if parsing fails
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    if (!phoneNumber || !countryCode) return phoneNumber;

    try {
        const dialCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
        const fullNumber = `${dialCode}${phoneNumber}`;
        const parsed = parsePhoneNumber(fullNumber);

        if (parsed) {
            return parsed.formatNational();
        }
    } catch {
        // Ignore parsing errors
    }

    return phoneNumber;
}

/**
 * Get validation error message for phone number
 * @param phoneNumber - The national phone number
 * @param countryCode - The dial code (e.g., "+31")
 * @returns Error message or null if valid
 */
export function getPhoneValidationError(phoneNumber: string, countryCode: string): string | null {
    if (!phoneNumber) return null; // Let required validation handle empty

    if (!validatePhoneNumber(phoneNumber, countryCode)) {
        return 'Please enter a valid phone number for the selected country';
    }

    return null;
}

/**
 * Check if phone number has minimum digits (basic check before full validation)
 */
export function hasMinimumDigits(phoneNumber: string, minDigits: number = 6): boolean {
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length >= minDigits;
}
