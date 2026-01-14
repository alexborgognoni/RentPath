<?php

namespace App\Data\Shared;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PhoneData extends Data
{
    public function __construct(
        #[Required, StringType, Max(5)]
        public string $country_code,

        #[Required, StringType, Max(20)]
        public string $number,
    ) {}

    /**
     * Get a formatted phone number.
     */
    public function formatted(): string
    {
        return $this->country_code.' '.$this->number;
    }

    /**
     * Get E.164 format (e.g., +12025551234).
     */
    public function e164(): string
    {
        $number = preg_replace('/[^0-9]/', '', $this->number);

        return $this->country_code.$number;
    }
}
