<?php

namespace App\Data\TenantProfile;

use App\Data\Shared\DocumentData;
use App\Data\User\UserData;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Main TenantProfile data class that aggregates all profile sections.
 * This represents the complete tenant profile stored in tenant_profiles table.
 */
#[TypeScript]
class TenantProfileData extends Data
{
    public function __construct(
        public ?int $id,

        public ?int $user_id,

        // Aggregated sections
        public IdentityData $identity,

        public EmploymentData $employment,

        #[Nullable]
        public ?StudentData $student,

        public RentalHistoryData $rental_history,

        // Documents that don't fit into specific sections
        #[Nullable]
        public ?DocumentData $profile_picture,

        #[Nullable]
        public ?DocumentData $reference_letter,

        #[Nullable]
        public ?DocumentData $other_income_proof,

        // Verification
        #[Nullable]
        public ?Carbon $profile_verified_at,

        #[Nullable]
        public ?string $verification_rejection_reason,

        /** @var array<string>|null */
        #[Nullable]
        public ?array $verification_rejected_fields,

        // Timestamps
        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,

        // Relationships
        #[Nullable]
        public ?UserData $user,
    ) {}

    /**
     * Check if profile is verified.
     */
    public function isVerified(): bool
    {
        return $this->profile_verified_at !== null;
    }

    /**
     * Check if profile was rejected.
     */
    public function isRejected(): bool
    {
        return $this->verification_rejection_reason !== null;
    }

    /**
     * Get profile completion percentage.
     */
    public function completionPercentage(): int
    {
        $total = 0;
        $completed = 0;

        // Identity section
        $total += 5;
        if ($this->identity->date_of_birth) {
            $completed++;
        }
        if ($this->identity->nationality) {
            $completed++;
        }
        if ($this->identity->phone->number ?? null) {
            $completed++;
        }
        if ($this->identity->id_document->number ?? null) {
            $completed++;
        }
        if ($this->identity->current_address->city ?? null) {
            $completed++;
        }

        // Employment section
        $total += 3;
        if ($this->employment->employment_status) {
            $completed++;
        }
        if ($this->employment->monthly_income ?? $this->employment->net_monthly_income) {
            $completed++;
        }
        if ($this->employment->income_currency) {
            $completed++;
        }

        // Rental history
        $total += 2;
        if ($this->rental_history->current_living_situation) {
            $completed++;
        }
        if ($this->rental_history->reason_for_moving) {
            $completed++;
        }

        return $total > 0 ? (int) (($completed / $total) * 100) : 0;
    }
}
