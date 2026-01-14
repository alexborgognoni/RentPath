<?php

namespace App\Data\TenantProfile;

use App\Enums\Relationship;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Represents a reference (landlord, personal, or professional).
 */
#[TypeScript]
class ReferenceData extends Data
{
    public function __construct(
        #[Required, StringType, Max(100)]
        public string $first_name,

        #[Required, StringType, Max(100)]
        public string $last_name,

        #[Required]
        public Relationship $relationship,

        #[Nullable, StringType, Max(100)]
        public ?string $relationship_other,

        #[Required, StringType, Max(20)]
        public string $phone,

        #[Nullable, Email, Max(255)]
        public ?string $email,

        #[Nullable, Min(0), Max(100)]
        public ?int $years_known,
    ) {}

    /**
     * Get full name.
     */
    public function fullName(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
