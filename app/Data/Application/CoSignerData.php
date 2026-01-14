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
 * Co-signer for an application.
 * CO-SIGNERS ARE APPLICATION-SPECIFIC - they live on applications table or related table.
 */
#[TypeScript]
class CoSignerData extends Data
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

        #[Nullable, Min(0)]
        public ?float $monthly_income,

        #[Nullable]
        public ?Currency $income_currency,

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
     * Check if co-signer is a student.
     */
    public function isStudent(): bool
    {
        return $this->employment_status === EmploymentStatus::Student;
    }
}
