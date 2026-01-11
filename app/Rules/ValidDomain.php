<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDomain implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            return; // Allow empty values (use 'required' rule separately if needed)
        }

        // Domain validation regex: alphanumeric with optional hyphens, followed by TLD
        $pattern = '/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/';

        if (! preg_match($pattern, $value)) {
            $fail('Please enter a valid domain (e.g., example.com).');
        }
    }
}
