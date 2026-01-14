<?php

namespace App\Data\TenantProfile;

use App\Enums\LivingSituation;
use App\Enums\ReasonForMoving;
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
 * Rental history and credit information for tenant profile.
 */
#[TypeScript]
class RentalHistoryData extends Data
{
    public function __construct(
        // Current living situation
        #[Required]
        public LivingSituation $current_living_situation,

        #[Nullable]
        public ?Carbon $current_address_move_in_date,

        #[Nullable, Min(0)]
        public ?float $current_monthly_rent,

        #[Nullable, StringType, Max(10)]
        public ?string $current_rent_currency,

        #[Nullable, StringType, Max(255)]
        public ?string $current_landlord_name,

        #[Nullable, StringType, Max(255)]
        public ?string $current_landlord_contact,

        // Reason for moving
        #[Required]
        public ReasonForMoving $reason_for_moving,

        #[Nullable, StringType, Max(255)]
        public ?string $reason_for_moving_other,

        // Previous addresses (JSON array in DB)
        /** @var DataCollection<int, PreviousAddressData>|null */
        #[Nullable, DataCollectionOf(PreviousAddressData::class)]
        public ?DataCollection $previous_addresses,

        // References
        /** @var DataCollection<int, ReferenceData>|null */
        #[Nullable, DataCollectionOf(ReferenceData::class)]
        public ?DataCollection $landlord_references,

        /** @var DataCollection<int, ReferenceData>|null */
        #[Nullable, DataCollectionOf(ReferenceData::class)]
        public ?DataCollection $other_references,

        // Credit history
        #[Nullable]
        public ?bool $authorize_credit_check,

        #[Nullable]
        public ?bool $authorize_background_check,

        #[Nullable, StringType, Max(50)]
        public ?string $credit_check_provider_preference,

        #[Nullable]
        public ?bool $has_ccjs_or_bankruptcies,

        #[Nullable, StringType, Max(2000)]
        public ?string $ccj_bankruptcy_details,

        #[Nullable]
        public ?bool $has_eviction_history,

        #[Nullable, StringType, Max(2000)]
        public ?string $eviction_details,
    ) {}

    /**
     * Get duration at current address in months.
     */
    public function monthsAtCurrentAddress(): ?int
    {
        if (! $this->current_address_move_in_date) {
            return null;
        }

        return (int) $this->current_address_move_in_date->diffInMonths(now());
    }

    /**
     * Check if tenant has any credit issues.
     */
    public function hasCreditIssues(): bool
    {
        return $this->has_ccjs_or_bankruptcies === true
            || $this->has_eviction_history === true;
    }
}
