<?php

namespace App\Data\Application;

use App\Enums\Relationship;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Additional occupant for an application.
 */
#[TypeScript]
class OccupantData extends Data
{
    public function __construct(
        #[Required, StringType, Max(100)]
        public string $name,

        #[Required, Min(0), Max(120)]
        public int $age,

        #[Required]
        public Relationship $relationship,

        #[Nullable, StringType, Max(100)]
        public ?string $relationship_other,
    ) {}

    /**
     * Check if occupant is a minor.
     */
    public function isMinor(): bool
    {
        return $this->age < 18;
    }
}
