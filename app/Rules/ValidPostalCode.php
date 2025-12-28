<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Validates postal codes based on country-specific patterns.
 *
 * IMPORTANT: These patterns MUST match the frontend patterns in:
 * resources/js/utils/postal-code-patterns.ts
 *
 * Per DESIGN.md validation strategy, frontend and backend must have identical
 * validation logic. When adding/modifying patterns, update BOTH files.
 *
 * Coverage: 120+ countries with standardized postal code systems
 *
 * Sources:
 * - Universal Postal Union (UPU) standards
 * - Wikipedia: List of postal codes
 * - Country-specific postal authorities
 */
class ValidPostalCode implements ValidationRule
{
    /**
     * Postal code validation patterns by country (ISO 3166-1 alpha-2 codes).
     * Case-insensitive patterns allowing common formatting variations.
     */
    private const PATTERNS = [
        // =====================
        // EUROPE (40 countries)
        // =====================

        // Western Europe
        'AD' => '/^AD\d{3}$/i', // Andorra: AD100
        'AT' => '/^\d{4}$/', // Austria: 1010
        'BE' => '/^\d{4}$/', // Belgium: 1000
        'CH' => '/^\d{4}$/', // Switzerland: 8001
        'DE' => '/^\d{5}$/', // Germany: 12345
        'FR' => '/^\d{5}$/', // France: 75001
        'LI' => '/^\d{4}$/', // Liechtenstein: 9490
        'LU' => '/^\d{4}$/', // Luxembourg: 1234
        'MC' => '/^980\d{2}$/', // Monaco: 98000
        'NL' => '/^\d{4}\s?[A-Z]{2}$/i', // Netherlands: 1012 AB

        // British Isles
        'GB' => '/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i', // UK: SW1A 1AA
        'GG' => '/^GY\d\s?\d[A-Z]{2}$/i', // Guernsey: GY1 1AA
        'IM' => '/^IM\d\s?\d[A-Z]{2}$/i', // Isle of Man: IM1 1AA
        'JE' => '/^JE\d\s?\d[A-Z]{2}$/i', // Jersey: JE1 1AA
        'IE' => '/^[A-Z]\d{2}\s?[A-Z\d]{4}$/i', // Ireland: D02 X285

        // Nordic
        'DK' => '/^\d{4}$/', // Denmark: 1000
        'FI' => '/^\d{5}$/', // Finland: 00100
        'FO' => '/^FO-?\d{3}$/i', // Faroe Islands: FO-100
        'GL' => '/^\d{4}$/', // Greenland: 3900
        'IS' => '/^\d{3}$/', // Iceland: 101
        'NO' => '/^\d{4}$/', // Norway: 0001
        'SE' => '/^\d{3}\s?\d{2}$/', // Sweden: 111 22
        'AX' => '/^\d{5}$/', // Åland Islands: 22100

        // Southern Europe
        'ES' => '/^\d{5}$/', // Spain: 28001
        'GI' => '/^GX11\s?1[A-Z]{2}$/i', // Gibraltar: GX11 1AA
        'IT' => '/^\d{5}$/', // Italy: 00100
        'MT' => '/^[A-Z]{3}\s?\d{4}$/i', // Malta: VLT 1234
        'PT' => '/^\d{4}-?\d{3}$/', // Portugal: 1000-001
        'SM' => '/^4789\d$/', // San Marino: 47890
        'VA' => '/^00120$/', // Vatican: 00120

        // Central Europe
        'CZ' => '/^\d{3}\s?\d{2}$/', // Czech Republic: 110 00
        'HU' => '/^\d{4}$/', // Hungary: 1011
        'PL' => '/^\d{2}-?\d{3}$/', // Poland: 00-001
        'SK' => '/^\d{3}\s?\d{2}$/', // Slovakia: 811 01

        // Eastern Europe
        'BY' => '/^\d{6}$/', // Belarus: 220000
        'MD' => '/^MD-?\d{4}$/i', // Moldova: MD-2000
        'RU' => '/^\d{6}$/', // Russia: 101000
        'UA' => '/^\d{5}$/', // Ukraine: 01001

        // Balkans
        'AL' => '/^\d{4}$/', // Albania: 1001
        'BA' => '/^\d{5}$/', // Bosnia: 71000
        'BG' => '/^\d{4}$/', // Bulgaria: 1000
        'GR' => '/^\d{3}\s?\d{2}$/', // Greece: 104 32
        'HR' => '/^\d{5}$/', // Croatia: 10000
        'ME' => '/^\d{5}$/', // Montenegro: 81000
        'MK' => '/^\d{4}$/', // North Macedonia: 1000
        'RO' => '/^\d{6}$/', // Romania: 010001
        'RS' => '/^\d{5,6}$/', // Serbia: 11000
        'SI' => '/^\d{4}$/', // Slovenia: 1000
        'XK' => '/^\d{5}$/', // Kosovo: 10000

        // Baltic States
        'EE' => '/^\d{5}$/', // Estonia: 10111
        'LT' => '/^LT-?\d{5}$/i', // Lithuania: LT-01234
        'LV' => '/^LV-?\d{4}$/i', // Latvia: LV-1050

        // =====================
        // NORTH AMERICA
        // =====================
        'CA' => '/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i', // Canada: K1A 0B1
        'MX' => '/^\d{5}$/', // Mexico: 06600
        'US' => '/^\d{5}(-\d{4})?$/', // USA: 10001 or 10001-1234
        'PR' => '/^\d{5}(-\d{4})?$/', // Puerto Rico: 00901
        'VI' => '/^\d{5}(-\d{4})?$/', // US Virgin Islands: 00801

        // Caribbean
        'BB' => '/^BB\d{5}$/i', // Barbados: BB11000
        'JM' => '/^JM[A-Z]{3}\d{2}$/i', // Jamaica: JMAAW01
        'TC' => '/^TKCA\s?1ZZ$/i', // Turks and Caicos: TKCA 1ZZ
        'VG' => '/^VG\d{4}$/i', // British Virgin Islands: VG1110

        // Central America
        'CR' => '/^\d{4,5}$/', // Costa Rica: 10101
        'GT' => '/^\d{5}$/', // Guatemala: 01001
        'HN' => '/^\d{5}$/', // Honduras: 11101
        'NI' => '/^\d{5}$/', // Nicaragua: 11001
        'PA' => '/^\d{4}$/', // Panama: 0801
        'SV' => '/^\d{4}$/', // El Salvador: 1101

        // =====================
        // SOUTH AMERICA
        // =====================
        'AR' => '/^[A-Z]?\d{4}[A-Z]{3}$/i', // Argentina: C1425ABC
        'BO' => '/^\d{4}$/', // Bolivia: 0000
        'BR' => '/^\d{5}-?\d{3}$/', // Brazil: 01310-100
        'CL' => '/^\d{7}$/', // Chile: 8320000
        'CO' => '/^\d{6}$/', // Colombia: 110111
        'EC' => '/^\d{6}$/', // Ecuador: 170150
        'GY' => '/^\d{6}$/', // Guyana: 000000 (limited use)
        'PE' => '/^\d{5}$/', // Peru: 15001
        'PY' => '/^\d{4}$/', // Paraguay: 1234
        'UY' => '/^\d{5}$/', // Uruguay: 11000
        'VE' => '/^\d{4}(-?[A-Z])?$/i', // Venezuela: 1010 or 1010-A

        // =====================
        // ASIA
        // =====================

        // East Asia
        'CN' => '/^\d{6}$/', // China: 100000
        'HK' => '/^999077$/', // Hong Kong: 999077 (single code)
        'JP' => '/^\d{3}-?\d{4}$/', // Japan: 100-0001
        'KP' => '/^\d{6}$/', // North Korea: 999093
        'KR' => '/^\d{5}$/', // South Korea: 03000
        'MO' => '/^999078$/', // Macau: 999078 (single code)
        'MN' => '/^\d{5}$/', // Mongolia: 14200
        'TW' => '/^\d{3}(-?\d{2,3})?$/', // Taiwan: 100 or 100-01

        // Southeast Asia
        'BN' => '/^[A-Z]{2}\d{4}$/i', // Brunei: KB1234
        'ID' => '/^\d{5}$/', // Indonesia: 10110
        'KH' => '/^\d{5}$/', // Cambodia: 12000
        'LA' => '/^\d{5}$/', // Laos: 01000
        'MM' => '/^\d{5}$/', // Myanmar: 11181
        'MY' => '/^\d{5}$/', // Malaysia: 50000
        'PH' => '/^\d{4}$/', // Philippines: 1000
        'SG' => '/^\d{6}$/', // Singapore: 018956
        'TH' => '/^\d{5}$/', // Thailand: 10100
        'VN' => '/^\d{6}$/', // Vietnam: 100000

        // South Asia
        'AF' => '/^\d{4}$/', // Afghanistan: 1001
        'BD' => '/^\d{4}$/', // Bangladesh: 1000
        'BT' => '/^\d{5}$/', // Bhutan: 11001
        'IN' => '/^\d{6}$/', // India: 110001
        'LK' => '/^\d{5}$/', // Sri Lanka: 00100
        'MV' => '/^\d{5}$/', // Maldives: 20002
        'NP' => '/^\d{5}$/', // Nepal: 44600
        'PK' => '/^\d{5}$/', // Pakistan: 44000

        // Central Asia
        'KG' => '/^\d{6}$/', // Kyrgyzstan: 720001
        'KZ' => '/^\d{6}$/', // Kazakhstan: 010000
        'TJ' => '/^\d{6}$/', // Tajikistan: 734000
        'TM' => '/^\d{6}$/', // Turkmenistan: 744000
        'UZ' => '/^\d{6}$/', // Uzbekistan: 100000

        // Middle East
        'AE' => '/^\d{5}$/', // UAE: 00000 (optional use)
        'AM' => '/^\d{4}$/', // Armenia: 0001
        'AZ' => '/^AZ\s?\d{4}$/i', // Azerbaijan: AZ 1000
        'BH' => '/^\d{3,4}$/', // Bahrain: 317 or 1234
        'CY' => '/^\d{4}$/', // Cyprus: 1010
        'GE' => '/^\d{4}$/', // Georgia: 0100
        'IL' => '/^\d{7}$/', // Israel: 9100001
        'IQ' => '/^\d{5}$/', // Iraq: 10001
        'IR' => '/^\d{10}$/', // Iran: 1234567890
        'JO' => '/^\d{5}$/', // Jordan: 11110
        'KW' => '/^\d{5}$/', // Kuwait: 12345
        'LB' => '/^\d{4}(\s?\d{4})?$/', // Lebanon: 1100 or 1100 0000
        'OM' => '/^\d{3}$/', // Oman: 100
        'PS' => '/^\d{3}$/', // Palestine: 000
        'QA' => '/^\d{4,5}$/', // Qatar: 0000 (limited use)
        'SA' => '/^\d{5}(-?\d{4})?$/', // Saudi Arabia: 12345
        'SY' => '/^\d{5}$/', // Syria: 00000 (limited use)
        'TR' => '/^\d{5}$/', // Turkey: 34000
        'YE' => '/^\d{5}$/', // Yemen: 00000 (limited use)

        // =====================
        // AFRICA
        // =====================
        'DZ' => '/^\d{5}$/', // Algeria: 16000
        'EG' => '/^\d{5}$/', // Egypt: 12411
        'ET' => '/^\d{4}$/', // Ethiopia: 1000
        'KE' => '/^\d{5}$/', // Kenya: 00100
        'MA' => '/^\d{5}$/', // Morocco: 10000
        'MU' => '/^\d{5}$/', // Mauritius: 72000 (limited use)
        'NG' => '/^\d{6}$/', // Nigeria: 100001
        'SN' => '/^\d{5}$/', // Senegal: 10000 (limited use)
        'TN' => '/^\d{4}$/', // Tunisia: 1000
        'ZA' => '/^\d{4}$/', // South Africa: 2000
        'ZW' => '/^\d{5}$/', // Zimbabwe (limited use)

        // =====================
        // OCEANIA
        // =====================
        'AU' => '/^\d{4}$/', // Australia: 2000
        'FJ' => '/^\d{4}$/', // Fiji (limited use)
        'NC' => '/^\d{5}$/', // New Caledonia: 98800
        'NZ' => '/^\d{4}$/', // New Zealand: 6011
        'PF' => '/^\d{5}$/', // French Polynesia: 98700
        'PG' => '/^\d{3}$/', // Papua New Guinea: 111
        'WS' => '/^WS\d{4}$/i', // Samoa: WS1234 (limited use)
    ];

    /**
     * Create a new rule instance.
     *
     * @param  string  $countryCodeField  The request field containing the country code (ISO 3166-1 alpha-2)
     */
    public function __construct(
        private string $countryCodeField = 'current_country'
    ) {}

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            return; // Let 'required' rule handle empty values
        }

        $countryCode = $this->getCountryCodeFromRequest();

        if (! $countryCode) {
            return; // No country code, skip validation
        }

        $pattern = self::PATTERNS[strtoupper($countryCode)] ?? null;

        if (! $pattern) {
            return; // Unknown country, skip validation (lenient)
        }

        if (! preg_match($pattern, trim($value))) {
            // Message must match frontend: APPLICATION_MESSAGES.profile_current_postal_code.invalid
            $fail('Invalid postal code format for selected country');
        }
    }

    /**
     * Get the country code from the request.
     */
    private function getCountryCodeFromRequest(): ?string
    {
        return request($this->countryCodeField);
    }

    /**
     * Check if a postal code is valid for a given country.
     */
    public static function isValid(string $postalCode, string $countryCode): bool
    {
        $pattern = self::PATTERNS[strtoupper($countryCode)] ?? null;

        if (! $pattern) {
            return true; // Unknown country, allow any postal code
        }

        return (bool) preg_match($pattern, trim($postalCode));
    }

    /**
     * Get all supported country codes.
     */
    public static function getSupportedCountries(): array
    {
        return array_keys(self::PATTERNS);
    }
}
