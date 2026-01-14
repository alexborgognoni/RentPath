<?php

namespace App\Data\Application;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Pet information for an application.
 */
#[TypeScript]
class PetData extends Data
{
    public function __construct(
        #[Required, StringType, Max(50)]
        public string $type,

        #[Nullable, StringType, Max(100)]
        public ?string $breed,

        #[Nullable, Min(0), Max(50)]
        public ?int $age,

        #[Nullable, Min(0)]
        public ?float $weight,

        #[Nullable, StringType, Max(500)]
        public ?string $description,
    ) {}
}
