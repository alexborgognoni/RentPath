<?php

namespace App\Data\Application;

use App\Data\Shared\PhoneData;
use App\Enums\Relationship;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Emergency contact for an application.
 * This is APPLICATION-SPECIFIC, not part of tenant profile.
 */
#[TypeScript]
class EmergencyContactData extends Data
{
    public function __construct(
        #[Required, StringType, Max(100)]
        public string $first_name,

        #[Required, StringType, Max(100)]
        public string $last_name,

        #[Required]
        public PhoneData $phone,

        #[Nullable, Email, Max(255)]
        public ?string $email,

        #[Required]
        public Relationship $relationship,

        #[Nullable, StringType, Max(100)]
        public ?string $relationship_other,
    ) {}

    /**
     * Get full name.
     */
    public function fullName(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
