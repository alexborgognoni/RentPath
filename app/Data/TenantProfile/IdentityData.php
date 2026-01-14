<?php

namespace App\Data\TenantProfile;

use App\Data\Shared\AddressData;
use App\Data\Shared\IdDocumentData;
use App\Data\Shared\PhoneData;
use App\Enums\ImmigrationStatus;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\After;
use Spatie\LaravelData\Attributes\Validation\Before;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Identity and personal information for a tenant.
 * Maps to tenant_profiles table fields.
 */
#[TypeScript]
class IdentityData extends Data
{
    public function __construct(
        // Personal Details
        #[Required, Before('-18 years')]
        public Carbon $date_of_birth,

        #[Nullable, StringType, Max(100)]
        public ?string $middle_name,

        #[Required, StringType, Size(2)]
        public string $nationality,

        #[Required]
        public PhoneData $phone,

        #[Nullable, StringType, Max(1000)]
        public ?string $bio,

        // ID Document
        #[Required]
        public IdDocumentData $id_document,

        // Immigration Status
        #[Nullable]
        public ?ImmigrationStatus $immigration_status,

        #[Nullable, StringType, Max(100)]
        public ?string $immigration_status_other,

        #[Nullable, StringType, Max(100)]
        public ?string $visa_type,

        #[Nullable, StringType, Max(100)]
        public ?string $visa_type_other,

        #[Nullable, After('today')]
        public ?Carbon $visa_expiry_date,

        #[Nullable, StringType, Max(100)]
        public ?string $work_permit_number,

        // Regional fields (UK-specific)
        #[Nullable, StringType, Max(50)]
        public ?string $right_to_rent_share_code,

        // Current Address
        #[Required]
        public AddressData $current_address,
    ) {}

    /**
     * Calculate age from date of birth.
     */
    public function age(): int
    {
        return $this->date_of_birth->age;
    }

    /**
     * Check if tenant is a visa holder.
     */
    public function isVisaHolder(): bool
    {
        return $this->immigration_status === ImmigrationStatus::VisaHolder;
    }

    /**
     * Check if visa is expiring soon.
     */
    public function isVisaExpiringSoon(int $days = 90): bool
    {
        if (! $this->visa_expiry_date) {
            return false;
        }

        return $this->visa_expiry_date->diffInDays(now()) <= $days;
    }
}
