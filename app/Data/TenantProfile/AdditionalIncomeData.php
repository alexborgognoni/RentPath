<?php

namespace App\Data\TenantProfile;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Represents an additional income source.
 */
#[TypeScript]
class AdditionalIncomeData extends Data
{
    public function __construct(
        #[Required, StringType, Max(100)]
        public string $source_type,

        #[Nullable, StringType, Max(255)]
        public ?string $description,

        #[Required, Min(0)]
        public float $monthly_amount,
    ) {}
}
