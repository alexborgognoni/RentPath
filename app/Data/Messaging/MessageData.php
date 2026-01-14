<?php

namespace App\Data\Messaging;

use App\Enums\ParticipantType;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MessageData extends Data
{
    public function __construct(
        public ?int $id,

        #[Required]
        public int $conversation_id,

        #[Required]
        public ParticipantType $sender_type,

        #[Required]
        public int $sender_id,

        #[Required, StringType, Max(10000)]
        public string $content,

        #[Nullable]
        public ?Carbon $read_at,

        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,

        /** @var DataCollection<int, MessageAttachmentData>|null */
        #[Nullable, DataCollectionOf(MessageAttachmentData::class)]
        public ?DataCollection $attachments,
    ) {}

    /**
     * Check if message is read.
     */
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    /**
     * Check if message is from tenant.
     */
    public function isFromTenant(): bool
    {
        return $this->sender_type === ParticipantType::Tenant;
    }
}
