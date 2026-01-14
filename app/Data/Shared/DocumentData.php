<?php

namespace App\Data\Shared;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Represents a stored document with path and original filename.
 */
#[TypeScript]
class DocumentData extends Data
{
    public function __construct(
        #[Required, StringType, Max(500)]
        public string $path,

        #[Nullable, StringType, Max(255)]
        public ?string $original_name = null,

        /** Generated signed URL for frontend display */
        #[Nullable, StringType]
        public ?string $url = null,
    ) {}
}
