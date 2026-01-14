<?php

namespace App\Data\Shared;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AddressData extends Data
{
    public function __construct(
        #[Required, StringType, Max(20)]
        public string $house_number,

        #[Required, StringType, Max(255)]
        public string $street_name,

        #[Nullable, StringType, Max(100)]
        public ?string $address_line_2,

        #[Required, StringType, Max(100)]
        public string $city,

        #[Nullable, StringType, Max(100)]
        public ?string $state_province,

        #[Required, StringType, Max(20)]
        public string $postal_code,

        #[Required, StringType, Size(2)]
        public string $country,
    ) {}

    /**
     * Get a formatted single-line address.
     */
    public function formatted(): string
    {
        $parts = [
            $this->house_number.' '.$this->street_name,
        ];

        if ($this->address_line_2) {
            $parts[] = $this->address_line_2;
        }

        $parts[] = $this->city;

        if ($this->state_province) {
            $parts[] = $this->state_province;
        }

        $parts[] = $this->postal_code;
        $parts[] = strtoupper($this->country);

        return implode(', ', $parts);
    }
}
