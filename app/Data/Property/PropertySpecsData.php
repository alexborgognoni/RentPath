<?php

namespace App\Data\Property;

use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Property specifications (rooms, size, amenities).
 */
#[TypeScript]
class PropertySpecsData extends Data
{
    public function __construct(
        // Room counts
        #[Required, Min(0)]
        public int $bedrooms,

        #[Required, Min(0)]
        public int $bathrooms,

        #[Min(0)]
        public int $parking_spots_interior,

        #[Min(0)]
        public int $parking_spots_exterior,

        // Size
        #[Nullable, Min(0)]
        public ?float $size,

        #[Nullable, In(['sqm', 'sqft'])]
        public ?string $size_unit,

        #[Nullable, Min(0)]
        public ?float $balcony_size,

        #[Nullable, Min(0)]
        public ?float $land_size,

        // Building details
        #[Nullable, Min(0)]
        public ?int $floor_level,

        public bool $has_elevator,

        #[Nullable, Min(1800), Max(2100)]
        public ?int $year_built,

        // Energy
        #[Nullable, In(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'])]
        public ?string $energy_class,

        #[Nullable, In(['A', 'B', 'C', 'D', 'E', 'F', 'G'])]
        public ?string $thermal_insulation_class,

        #[Nullable, In(['gas', 'electric', 'district', 'wood', 'heat_pump', 'other'])]
        public ?string $heating_type,

        // Kitchen
        public bool $kitchen_equipped,

        public bool $kitchen_separated,

        // Amenities
        public bool $has_cellar,

        public bool $has_laundry,

        public bool $has_fireplace,

        public bool $has_air_conditioning,

        public bool $has_garden,

        public bool $has_rooftop,

        /** @var array<string, mixed>|null */
        #[Nullable]
        public ?array $extras,
    ) {}

    /**
     * Get total parking spots.
     */
    public function totalParkingSpots(): int
    {
        return $this->parking_spots_interior + $this->parking_spots_exterior;
    }

    /**
     * Get formatted size (e.g., "85 sqm").
     */
    public function formattedSize(): ?string
    {
        if (! $this->size) {
            return null;
        }

        return number_format($this->size, 0).' '.($this->size_unit ?? 'sqm');
    }
}
