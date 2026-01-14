<?php

namespace App\Data\Shared;

use App\Enums\IdDocumentType;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\After;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Represents ID document information for identity verification.
 */
#[TypeScript]
class IdDocumentData extends Data
{
    public function __construct(
        #[Required]
        public IdDocumentType $type,

        #[Required, StringType, Max(100)]
        public string $number,

        #[Required, StringType, Size(2)]
        public string $issuing_country,

        #[Required, After('today')]
        public Carbon $expiry_date,

        /** Front of ID document */
        #[Nullable]
        public ?DocumentData $front = null,

        /** Back of ID document */
        #[Nullable]
        public ?DocumentData $back = null,
    ) {}

    /**
     * Check if the document is expired.
     */
    public function isExpired(): bool
    {
        return $this->expiry_date->isPast();
    }

    /**
     * Check if the document expires within the given days.
     */
    public function expiresWithin(int $days): bool
    {
        return $this->expiry_date->diffInDays(now()) <= $days;
    }
}
