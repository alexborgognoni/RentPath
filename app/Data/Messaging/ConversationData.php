<?php

namespace App\Data\Messaging;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ConversationData extends Data
{
    public function __construct(
        public ?int $id,

        #[Required]
        public int $property_id,

        #[Required]
        public int $tenant_profile_id,

        #[Nullable]
        public ?int $application_id,

        #[Nullable]
        public ?Carbon $last_message_at,

        #[Nullable]
        public ?int $tenant_unread_count,

        #[Nullable]
        public ?int $manager_unread_count,

        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,

        /** @var DataCollection<int, MessageData>|null */
        #[Nullable, DataCollectionOf(MessageData::class)]
        public ?DataCollection $messages,
    ) {}

    /**
     * Get total unread messages.
     */
    public function totalUnread(): int
    {
        return ($this->tenant_unread_count ?? 0) + ($this->manager_unread_count ?? 0);
    }
}
