<?php

namespace App\Data\Property;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Property image data.
 */
#[TypeScript]
class PropertyImageData extends Data
{
    public function __construct(
        public ?int $id,

        public ?int $property_id,

        #[Required, StringType, Max(500)]
        public string $image_path,

        #[Required, Min(0)]
        public int $sort_order,

        public bool $is_main,

        /** Generated signed URL */
        #[Nullable]
        public ?string $image_url,

        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,
    ) {}
}
