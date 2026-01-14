<?php

namespace App\Data\Lead;

use App\Data\Application\ApplicationData;
use App\Data\Property\PropertyData;
use App\Data\User\UserData;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class LeadData extends Data
{
    public function __construct(
        public ?int $id,

        public ?int $property_id,

        #[Required, Email, Max(255)]
        public string $email,

        #[Nullable, StringType, Max(100)]
        public ?string $first_name,

        #[Nullable, StringType, Max(100)]
        public ?string $last_name,

        #[Nullable, StringType, Max(20)]
        public ?string $phone,

        #[Required, StringType, Max(100)]
        public string $token,

        #[Required]
        public LeadSource $source,

        #[Required]
        public LeadStatus $status,

        #[Nullable]
        public ?int $user_id,

        #[Nullable]
        public ?int $application_id,

        #[Nullable]
        public ?int $invite_token_id,

        #[Nullable]
        public ?Carbon $invited_at,

        #[Nullable]
        public ?Carbon $viewed_at,

        #[Nullable, StringType, Max(2000)]
        public ?string $notes,

        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,

        // Relationships
        #[Nullable]
        public ?PropertyData $property,

        #[Nullable]
        public ?UserData $user,

        #[Nullable]
        public ?ApplicationData $application,
    ) {}

    /**
     * Get full name.
     */
    public function fullName(): ?string
    {
        if (! $this->first_name && ! $this->last_name) {
            return null;
        }

        return trim(($this->first_name ?? '').' '.($this->last_name ?? ''));
    }

    /**
     * Check if lead has converted to application.
     */
    public function hasApplied(): bool
    {
        return $this->application_id !== null;
    }
}
