<?php

namespace App\Data\Property;

use App\Data\PropertyManager\PropertyManagerData;
use App\Data\Shared\AddressData;
use App\Enums\Currency;
use App\Enums\PropertyStatus;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PropertyData extends Data
{
    public function __construct(
        public ?int $id,

        public ?int $property_manager_id,

        #[Required, StringType, Max(255)]
        public string $title,

        #[Required]
        public AddressData $address,

        #[Nullable, StringType, Max(5000)]
        public ?string $description,

        #[Required, In(['apartment', 'house', 'room', 'commercial', 'industrial', 'parking'])]
        public string $type,

        #[Required]
        public string $subtype,

        // Specifications
        #[Required]
        public PropertySpecsData $specs,

        // Rental information
        #[Nullable]
        public ?Carbon $available_date,

        #[Required, Min(0)]
        public float $rent_amount,

        #[Required]
        public Currency $rent_currency,

        #[Nullable]
        public ?bool $pets_allowed,

        #[Nullable]
        public ?bool $smoking_allowed,

        // Status and visibility
        #[Required]
        public PropertyStatus $status,

        #[Nullable, Min(1), Max(10)]
        public ?int $wizard_step,

        #[Required, In(['public', 'unlisted', 'private'])]
        public string $visibility,

        #[Required]
        public bool $accepting_applications,

        #[Required, In(['open', 'link_required', 'invite_only'])]
        public string $application_access,

        // Computed
        #[Nullable]
        public ?string $funnel_stage,

        #[Nullable]
        public ?string $main_image_url,

        // Timestamps
        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,

        // Relationships
        #[Nullable]
        public ?PropertyManagerData $property_manager,

        /** @var DataCollection<int, PropertyImageData>|null */
        #[Nullable, DataCollectionOf(PropertyImageData::class)]
        public ?DataCollection $images,
    ) {}

    /**
     * Check if property is available for applications.
     */
    public function isAvailable(): bool
    {
        return $this->status === PropertyStatus::Vacant
            && $this->accepting_applications;
    }

    /**
     * Check if property is publicly visible.
     */
    public function isPublic(): bool
    {
        return $this->visibility === 'public';
    }

    /**
     * Get formatted rent (e.g., "€1,500/month").
     */
    public function formattedRent(): string
    {
        $symbol = $this->rent_currency->symbol();

        return $symbol.number_format($this->rent_amount, 0).'/month';
    }
}
