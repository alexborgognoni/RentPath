<?php

namespace App\Data\Messaging;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MessageAttachmentData extends Data
{
    public function __construct(
        public ?int $id,

        #[Required]
        public int $message_id,

        #[Required, StringType, Max(500)]
        public string $file_path,

        #[Required, StringType, Max(255)]
        public string $original_name,

        #[Nullable, StringType, Max(100)]
        public ?string $mime_type,

        #[Nullable]
        public ?int $file_size,

        /** Generated signed URL */
        #[Nullable]
        public ?string $file_url,

        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,
    ) {}
}
