/**
 * Get the display name for a country code using Intl.DisplayNames
 * Falls back to the country code if not found
 */
export function getCountryName(countryCode: string | undefined, locale: string = 'en'): string {
    if (!countryCode) return '';

    try {
        const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
        return displayNames.of(countryCode.toUpperCase()) || countryCode;
    } catch {
        // Fallback for unsupported browsers or invalid codes
        return countryCode;
    }
}

/**
 * Format a full address from property parts
 */
export function formatAddress(parts: {
    house_number?: string;
    street_name?: string;
    city?: string;
    country?: string;
}): string {
    const { house_number, street_name, city, country } = parts;
    const addressParts = [house_number, street_name, city, getCountryName(country)].filter(Boolean);
    return addressParts.join(', ');
}
