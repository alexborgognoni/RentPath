<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberUtil;

/**
 * Validates phone numbers using libphonenumber.
 *
 * IMPORTANT: This validation logic MUST match the frontend validation in:
 * resources/js/utils/phone-validation.ts (validatePhoneNumber function)
 *
 * Both use libphonenumber (PHP: giggsey/libphonenumber-for-php, JS: libphonenumber-js)
 * to ensure consistent validation results.
 *
 * Per DESIGN.md validation strategy, frontend and backend must have identical
 * validation logic.
 */
class ValidPhoneNumber implements ValidationRule
{
    /**
     * Create a new rule instance.
     *
     * @param  string|null  $countryCodeField  The request field containing the country dial code (e.g., "+31")
     * @param  string  $defaultRegion  Default region code if country code field is not provided
     */
    public function __construct(
        private ?string $countryCodeField = null,
        private string $defaultRegion = 'NL'
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

        $phoneUtil = PhoneNumberUtil::getInstance();

        try {
            // Get the region from the country code field or use default
            $region = $this->getRegionFromRequest();

            // If we have a dial code in the country code field, prepend it to the number
            $dialCode = $this->getDialCodeFromRequest();
            $fullNumber = $dialCode ? $dialCode.$value : $value;

            // Parse the phone number
            $phoneNumber = $phoneUtil->parse($fullNumber, $region);

            // Validate the phone number
            if (! $phoneUtil->isValidNumber($phoneNumber)) {
                $fail('Please enter a valid phone number');
            }
        } catch (NumberParseException $e) {
            $fail('Please enter a valid phone number');
        }
    }

    /**
     * Get the region code from the request's country code field.
     */
    private function getRegionFromRequest(): string
    {
        if (! $this->countryCodeField) {
            return $this->defaultRegion;
        }

        $dialCode = request($this->countryCodeField);
        if (! $dialCode) {
            return $this->defaultRegion;
        }

        // Convert dial code to region (e.g., "+31" -> "NL")
        return $this->dialCodeToRegion($dialCode);
    }

    /**
     * Get the dial code from the request.
     */
    private function getDialCodeFromRequest(): ?string
    {
        if (! $this->countryCodeField) {
            return null;
        }

        $dialCode = request($this->countryCodeField);
        if (! $dialCode) {
            return null;
        }

        // Ensure it starts with +
        return str_starts_with($dialCode, '+') ? $dialCode : '+'.$dialCode;
    }

    /**
     * Convert a dial code to a region code.
     * Note: Some dial codes are shared by multiple countries (e.g., +1 for US/CA).
     * This returns the "main" country for that dial code.
     */
    private function dialCodeToRegion(string $dialCode): string
    {
        // Remove + prefix if present
        $code = ltrim($dialCode, '+');

        $phoneUtil = PhoneNumberUtil::getInstance();

        // Get all regions for this country code
        $regions = $phoneUtil->getRegionCodesForCountryCode((int) $code);

        if (! empty($regions)) {
            // Return the first (main) region
            return $regions[0];
        }

        return $this->defaultRegion;
    }
}
