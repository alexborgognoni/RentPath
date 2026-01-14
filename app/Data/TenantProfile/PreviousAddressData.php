<?php

namespace App\Data\TenantProfile;

use App\Data\Shared\AddressData;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Represents a previous address in rental history.
 */
#[TypeScript]
class PreviousAddressData extends Data
{
    public function __construct(
        #[Required]
        public AddressData $address,

        #[Required]
        public Carbon $move_in_date,

        #[Required]
        public Carbon $move_out_date,

        #[Nullable, StringType, Max(255)]
        public ?string $landlord_name,

        #[Nullable, StringType, Max(255)]
        public ?string $landlord_contact,

        #[Nullable, StringType, Max(100)]
        public ?string $reason_for_leaving,
    ) {}

    /**
     * Get duration at this address in months.
     */
    public function durationMonths(): int
    {
        return (int) $this->move_in_date->diffInMonths($this->move_out_date);
    }
}
