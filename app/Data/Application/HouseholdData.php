<?php

namespace App\Data\Application;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Household information for an application.
 * This data is APPLICATION-SPECIFIC, not part of tenant profile.
 */
#[TypeScript]
class HouseholdData extends Data
{
    public function __construct(
        // Move-in details
        #[Required]
        public Carbon $desired_move_in_date,

        #[Required, Min(1), Max(60)]
        public int $lease_duration_months,

        #[Nullable]
        public ?bool $is_flexible_on_move_in,

        #[Nullable]
        public ?bool $is_flexible_on_duration,

        // Occupants
        #[Required, Min(0)]
        public int $additional_occupants,

        /** @var DataCollection<int, OccupantData>|null */
        #[Nullable, DataCollectionOf(OccupantData::class)]
        public ?DataCollection $occupants_details,

        // Pets
        #[Required]
        public bool $has_pets,

        /** @var DataCollection<int, PetData>|null */
        #[Nullable, DataCollectionOf(PetData::class)]
        public ?DataCollection $pets_details,

        // Message to landlord
        #[Nullable, StringType, Max(2000)]
        public ?string $message_to_landlord,
    ) {}

    /**
     * Get total occupants including tenant.
     */
    public function totalOccupants(): int
    {
        return 1 + $this->additional_occupants;
    }
}
