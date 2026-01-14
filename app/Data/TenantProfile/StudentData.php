<?php

namespace App\Data\TenantProfile;

use App\Data\Shared\DocumentData;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\After;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Student information for tenant profile.
 * Only applicable when employment_status is 'student'.
 */
#[TypeScript]
class StudentData extends Data
{
    public function __construct(
        #[Required, StringType, Max(255)]
        public string $university_name,

        #[Required, StringType, Max(255)]
        public string $program_of_study,

        #[Required, After('today')]
        public Carbon $expected_graduation_date,

        #[Nullable, StringType, Max(100)]
        public ?string $income_source_type,

        #[Nullable, StringType, Max(500)]
        public ?string $income_source_other,

        #[Nullable, Min(0)]
        public ?float $monthly_income,

        #[Nullable]
        public ?DocumentData $student_proof,
    ) {}

    /**
     * Check if graduating soon.
     */
    public function isGraduatingSoon(int $months = 6): bool
    {
        return $this->expected_graduation_date->diffInMonths(now()) <= $months;
    }
}
