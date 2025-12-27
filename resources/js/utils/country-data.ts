/**
 * Country data utility combining phone codes, nationalities (demonyms), and flags
 *
 * Sources:
 * - Phone data: react-international-phone (217 countries with dial codes + formatting)
 * - Nationality/demonym data: country-flags-svg (250+ countries)
 */

import { countries as countriesWithDemonyms } from 'country-flags-svg';
import { defaultCountries, parseCountry } from 'react-international-phone';

export interface CountryInfo {
    iso2: string; // "NL", "US", "DE"
    name: string; // "Netherlands", "United States"
    demonym: string; // "Dutch", "American"
    dialCode: string; // "31", "1", "49"
    flag: string; // SVG URL
}

// Build a lookup map from country-flags-svg for demonyms and flags
const demonymMap = new Map<string, { demonym: string; flag: string }>();
for (const country of countriesWithDemonyms) {
    demonymMap.set(country.iso2.toUpperCase(), {
        demonym: country.demonym,
        flag: country.flag,
    });
}

// Build the unified country list from react-international-phone (has phone data)
// and enrich with demonyms from country-flags-svg
export const COUNTRIES: CountryInfo[] = defaultCountries
    .map((countryData) => {
        const parsed = parseCountry(countryData);
        const iso2Upper = parsed.iso2.toUpperCase();
        const demonymData = demonymMap.get(iso2Upper);

        return {
            iso2: iso2Upper,
            name: parsed.name,
            demonym: demonymData?.demonym || parsed.name, // Fallback to country name
            dialCode: parsed.dialCode,
            flag: demonymData?.flag || '',
        };
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical

// Create lookup maps for quick access
const countryByIso2 = new Map<string, CountryInfo>();
const countryByDialCode = new Map<string, CountryInfo>();

for (const country of COUNTRIES) {
    countryByIso2.set(country.iso2, country);
    // For dial codes, some countries share (US/CA = 1), so we only store first match
    if (!countryByDialCode.has(country.dialCode)) {
        countryByDialCode.set(country.dialCode, country);
    }
}

/**
 * Get country by ISO 3166-1 alpha-2 code (e.g., "NL", "US")
 */
export function getCountryByIso2(iso2: string): CountryInfo | undefined {
    return countryByIso2.get(iso2.toUpperCase());
}

/**
 * Get country by dial code (e.g., "31", "1")
 * Note: Some dial codes are shared by multiple countries
 */
export function getCountryByDialCode(dialCode: string): CountryInfo | undefined {
    // Remove leading + if present
    const code = dialCode.replace(/^\+/, '');
    return countryByDialCode.get(code);
}

/**
 * Search countries by name or demonym
 * Returns matches sorted by relevance (exact match first, then starts-with, then contains)
 */
export function searchCountries(query: string): CountryInfo[] {
    if (!query.trim()) return COUNTRIES;

    const q = query.toLowerCase().trim();

    // Score matches: 0 = exact, 1 = starts with, 2 = contains
    const scored = COUNTRIES.map((country) => {
        const nameLower = country.name.toLowerCase();
        const demonymLower = country.demonym.toLowerCase();
        const iso2Lower = country.iso2.toLowerCase();

        let score = 999;

        // Check exact matches
        if (nameLower === q || demonymLower === q || iso2Lower === q) {
            score = 0;
        }
        // Check starts with
        else if (nameLower.startsWith(q) || demonymLower.startsWith(q)) {
            score = 1;
        }
        // Check contains
        else if (nameLower.includes(q) || demonymLower.includes(q)) {
            score = 2;
        }

        return { country, score };
    })
        .filter((item) => item.score < 999)
        .sort((a, b) => a.score - b.score || a.country.name.localeCompare(b.country.name));

    return scored.map((item) => item.country);
}

/**
 * Convert ISO 3166-1 alpha-2 code to flag emoji
 * Uses regional indicator symbols
 */
export function iso2ToFlagEmoji(iso2: string): string {
    const codePoints = iso2
        .toUpperCase()
        .split('')
        .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
    return String.fromCodePoint(...codePoints);
}

/**
 * Get demonym (nationality name) for a country code
 * e.g., "NL" -> "Dutch", "US" -> "American"
 */
export function getDemonym(iso2: string): string {
    return getCountryByIso2(iso2)?.demonym || iso2;
}

/**
 * Format dial code with + prefix
 */
export function formatDialCode(dialCode: string): string {
    const code = dialCode.replace(/^\+/, '');
    return `+${code}`;
}
