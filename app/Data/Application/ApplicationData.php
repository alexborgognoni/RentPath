<?php

namespace App\Data\Application;

use App\Data\Property\PropertyData;
use App\Data\TenantProfile\TenantProfileData;
use App\Enums\ApplicationStatus;
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
 * Main Application data class.
 *
 * NOTE: Application-specific data (household, pets, emergency contact, support)
 * lives HERE, not in TenantProfile. TenantProfile only contains reusable
 * identity, employment, and rental history info.
 */
#[TypeScript]
class ApplicationData extends Data
{
    public function __construct(
        public ?int $id,

        public ?int $property_id,

        public ?int $tenant_profile_id,

        #[Required]
        public ApplicationStatus $status,

        #[Required, Min(1), Max(10)]
        public int $current_step,

        // Household data
        #[Required]
        public HouseholdData $household,

        // Emergency contact
        #[Nullable]
        public ?EmergencyContactData $emergency_contact,

        // Support (co-signers and guarantors)
        /** @var DataCollection<int, CoSignerData>|null */
        #[Nullable, DataCollectionOf(CoSignerData::class)]
        public ?DataCollection $co_signers,

        /** @var DataCollection<int, GuarantorData>|null */
        #[Nullable, DataCollectionOf(GuarantorData::class)]
        public ?DataCollection $guarantors,

        // Consent
        #[Nullable]
        public ?ConsentData $consent,

        // Additional info
        #[Nullable, StringType, Max(5000)]
        public ?string $additional_information,

        // Review & decision
        #[Nullable, StringType, Max(2000)]
        public ?string $rejection_reason,

        /** @var array<string, mixed>|null */
        #[Nullable]
        public ?array $rejection_details,

        #[Nullable]
        public ?int $reviewed_by_user_id,

        #[Nullable]
        public ?Carbon $reviewed_at,

        // Visit
        #[Nullable]
        public ?Carbon $visit_scheduled_at,

        #[Nullable, StringType, Max(2000)]
        public ?string $visit_notes,

        #[Nullable]
        public ?Carbon $visit_completed_at,

        // Approval
        #[Nullable]
        public ?int $approved_by_user_id,

        #[Nullable]
        public ?Carbon $approved_at,

        #[Nullable, StringType, Max(2000)]
        public ?string $approval_notes,

        // Lease
        #[Nullable]
        public ?Carbon $lease_start_date,

        #[Nullable]
        public ?Carbon $lease_end_date,

        #[Nullable, Min(0)]
        public ?float $agreed_rent_amount,

        #[Nullable, Min(0)]
        public ?float $deposit_amount,

        // Status timestamps
        #[Nullable]
        public ?Carbon $submitted_at,

        #[Nullable]
        public ?Carbon $withdrawn_at,

        #[Nullable]
        public ?Carbon $archived_at,

        // Token
        #[Nullable, StringType, Max(100)]
        public ?string $invited_via_token,

        // Internal
        #[Nullable, StringType, Max(5000)]
        public ?string $internal_notes,

        // Timestamps
        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,

        // Relationships
        #[Nullable]
        public ?PropertyData $property,

        #[Nullable]
        public ?TenantProfileData $tenant_profile,
    ) {}

    /**
     * Check if application is in draft status.
     */
    public function isDraft(): bool
    {
        return $this->status === ApplicationStatus::Draft;
    }

    /**
     * Check if application is submitted.
     */
    public function isSubmitted(): bool
    {
        return $this->submitted_at !== null;
    }

    /**
     * Check if application has a guarantor.
     */
    public function hasGuarantor(): bool
    {
        return $this->guarantors !== null && count($this->guarantors) > 0;
    }

    /**
     * Check if application has co-signers.
     */
    public function hasCoSigners(): bool
    {
        return $this->co_signers !== null && count($this->co_signers) > 0;
    }

    /**
     * Check if application can be edited.
     */
    public function canEdit(): bool
    {
        return $this->status === ApplicationStatus::Draft;
    }
}
