<?php

namespace App\Data\Application;

use App\Data\Shared\AddressData;
use App\Data\Shared\DocumentData;
use App\Data\Shared\PhoneData;
use App\Enums\Currency;
use App\Enums\EmploymentStatus;
use App\Enums\Relationship;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Guarantor for an application.
 * GUARANTORS ARE APPLICATION-SPECIFIC - they live on applications table or related table.
 *
 * NOTE: This is different from the has_guarantor/guarantor_* fields that were
 * incorrectly on tenant_profiles table. Those should be removed.
 */
#[TypeScript]
class GuarantorData extends Data
{
    public function __construct(
        public ?int $id,

        public ?int $application_id,

        // Personal info
        #[Required, StringType, Max(100)]
        public string $first_name,

        #[Required, StringType, Max(100)]
        public string $last_name,

        #[Required]
        public Relationship $relationship,

        #[Nullable, StringType, Max(100)]
        public ?string $relationship_other,

        #[Required]
        public PhoneData $phone,

        #[Required, Email, Max(255)]
        public string $email,

        // Address
        #[Required]
        public AddressData $address,

        // Employment & income
        #[Required]
        public EmploymentStatus $employment_status,

        #[Nullable, StringType, Max(255)]
        public ?string $employer_name,

        #[Nullable, StringType, Max(100)]
        public ?string $job_title,

        #[Required, Min(0)]
        public float $monthly_income,

        #[Required]
        public Currency $income_currency,

        // Student fields (if employment_status is student)
        #[Nullable, StringType, Max(255)]
        public ?string $university_name,

        #[Nullable, StringType, Max(255)]
        public ?string $program_of_study,

        #[Nullable]
        public ?Carbon $expected_graduation_date,

        #[Nullable, StringType, Max(255)]
        public ?string $student_income_source,

        // Documents
        #[Nullable]
        public ?DocumentData $id_front,

        #[Nullable]
        public ?DocumentData $id_back,

        #[Nullable]
        public ?DocumentData $proof_of_income,

        #[Nullable]
        public ?DocumentData $student_proof,

        #[Nullable]
        public ?DocumentData $other_income_proof,

        // Timestamps
        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,
    ) {}

    /**
     * Get full name.
     */
    public function fullName(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    /**
     * Check if guarantor is a student.
     */
    public function isStudent(): bool
    {
        return $this->employment_status === EmploymentStatus::Student;
    }

    /**
     * Check if guarantor has sufficient income (typically 2.5-3x rent).
     */
    public function hasSufficientIncome(float $monthlyRent, float $multiplier = 2.5): bool
    {
        return $this->monthly_income >= ($monthlyRent * $multiplier);
    }
}
