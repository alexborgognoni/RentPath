/**
 * Country data utility with COMPLETE ISO 3166-1 alpha-2 coverage.
 *
 * Sources:
 * - Country names: i18n-iso-countries (250 countries - full ISO 3166-1)
 * - Phone dial codes: react-international-phone (217 countries with dial codes)
 * - Nationality/demonym data: country-flags-svg (247 countries)
 *
 * IMPORTANT: This data is used for country/nationality selection.
 * The backend validation in app/Http/Requests must accept the same country codes.
 * When adding/removing countries, ensure backend validation is updated.
 */

import { countries as countriesWithDemonyms } from 'country-flags-svg';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { defaultCountries, parseCountry } from 'react-international-phone';

// Register English locale for country names
countries.registerLocale(enLocale);

export interface CountryInfo {
    iso2: string; // "NL", "US", "DE"
    name: string; // "Netherlands", "United States"
    demonym: string; // "Dutch", "American"
    dialCode: string | null; // "31", "1", "49" - null if no phone code
    flag: string; // SVG URL or empty
}

// Build lookup maps from source data
const demonymMap = new Map<string, { demonym: string; flag: string }>();
for (const country of countriesWithDemonyms) {
    demonymMap.set(country.iso2.toUpperCase(), {
        demonym: country.demonym,
        flag: country.flag,
    });
}

const phoneDataMap = new Map<string, string>();
for (const countryData of defaultCountries) {
    const parsed = parseCountry(countryData);
    phoneDataMap.set(parsed.iso2.toUpperCase(), parsed.dialCode);
}

// Fallback demonyms for territories/special regions not in country-flags-svg
const FALLBACK_DEMONYMS: Record<string, string> = {
    AX: 'Ålandic',
    AS: 'American Samoan',
    AI: 'Anguillan',
    AQ: 'Antarctic',
    BL: 'Saint Barthélemy',
    BM: 'Bermudian',
    BV: 'Bouvet Island',
    CC: 'Cocos Islander',
    CK: 'Cook Islander',
    CX: 'Christmas Islander',
    EH: 'Sahrawi',
    FK: 'Falkland Islander',
    GG: 'Guernsey',
    GI: 'Gibraltarian',
    GS: 'South Georgian',
    HM: 'Heard Islander',
    IM: 'Manx',
    JE: 'Jersey',
    MF: 'Saint Martin',
    MP: 'Northern Mariana Islander',
    MS: 'Montserratian',
    NF: 'Norfolk Islander',
    NU: 'Niuean',
    PN: 'Pitcairn Islander',
    SH: 'Saint Helenian',
    SJ: 'Svalbard',
    SX: 'Sint Maarten',
    TC: 'Turks and Caicos Islander',
    TF: 'French Southern Territories',
    TK: 'Tokelauan',
    UM: 'US Minor Outlying Islands',
    VG: 'British Virgin Islander',
    VI: 'US Virgin Islander',
    XK: 'Kosovar',
};

// Build the complete country list from i18n-iso-countries (full ISO 3166-1)
const allCodes = countries.getAlpha2Codes();
export const COUNTRIES: CountryInfo[] = Object.keys(allCodes)
    .map((iso2) => {
        const iso2Upper = iso2.toUpperCase();
        const name = countries.getName(iso2Upper, 'en') || iso2Upper;
        const demonymData = demonymMap.get(iso2Upper);
        const dialCode = phoneDataMap.get(iso2Upper) || null;

        // Get demonym: first try country-flags-svg, then fallback, then use country name
        let demonym = demonymData?.demonym;
        if (!demonym) {
            demonym = FALLBACK_DEMONYMS[iso2Upper] || name;
        }

        return {
            iso2: iso2Upper,
            name,
            demonym,
            dialCode,
            flag: demonymData?.flag || '',
        };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

// Export the list of all valid ISO codes for validation
export const VALID_COUNTRY_CODES: string[] = COUNTRIES.map((c) => c.iso2);

// Countries with dial codes (for phone input - excludes territories without phone infrastructure)
export const COUNTRIES_WITH_DIAL_CODES: CountryInfo[] = COUNTRIES.filter((c) => c.dialCode !== null);

// Create lookup maps for quick access
const countryByIso2 = new Map<string, CountryInfo>();
const countryByDialCode = new Map<string, CountryInfo>();

for (const country of COUNTRIES) {
    countryByIso2.set(country.iso2, country);
    // For dial codes, some countries share (US/CA = 1), so we only store first match
    if (country.dialCode && !countryByDialCode.has(country.dialCode)) {
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
    const code = dialCode.replace(/^\+/, '');
    return countryByDialCode.get(code);
}

/**
 * Check if a country code is valid (ISO 3166-1 alpha-2)
 */
export function isValidCountryCode(iso2: string): boolean {
    return countryByIso2.has(iso2.toUpperCase());
}

/**
 * Search countries by name or demonym
 * Returns matches sorted by relevance (exact match first, then starts-with, then contains)
 * @param query - Search query
 * @param onlyWithDialCode - If true, only return countries with dial codes (for phone input)
 */
export function searchCountries(query: string, onlyWithDialCode: boolean = false): CountryInfo[] {
    const sourceList = onlyWithDialCode ? COUNTRIES_WITH_DIAL_CODES : COUNTRIES;

    if (!query.trim()) return sourceList;

    const q = query.toLowerCase().trim();

    const scored = sourceList
        .map((country) => {
            const nameLower = country.name.toLowerCase();
            const demonymLower = country.demonym.toLowerCase();
            const iso2Lower = country.iso2.toLowerCase();

            let score = 999;

            if (nameLower === q || demonymLower === q || iso2Lower === q) {
                score = 0;
            } else if (nameLower.startsWith(q) || demonymLower.startsWith(q)) {
                score = 1;
            } else if (nameLower.includes(q) || demonymLower.includes(q)) {
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
 * Format dial code with + prefix
 */
export function formatDialCode(dialCode: string | null): string {
    if (!dialCode) return '';
    const code = dialCode.replace(/^\+/, '');
    return `+${code}`;
}
