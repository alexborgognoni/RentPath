<?php

namespace App\Data\TenantProfile;

use App\Data\Shared\DocumentData;
use App\Data\Shared\PhoneData;
use App\Enums\Currency;
use App\Enums\EmploymentStatus;
use App\Enums\EmploymentType;
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
 * Employment and financial information for a tenant.
 * Maps to tenant_profiles table fields.
 */
#[TypeScript]
class EmploymentData extends Data
{
    public function __construct(
        #[Required]
        public EmploymentStatus $employment_status,

        // Employed fields
        #[Nullable, StringType, Max(255)]
        public ?string $employer_name,

        #[Nullable, StringType, Max(100)]
        public ?string $job_title,

        #[Nullable]
        public ?Carbon $employment_start_date,

        #[Nullable]
        public ?Carbon $employment_end_date,

        #[Nullable]
        public ?Carbon $probation_end_date,

        #[Nullable]
        public ?EmploymentType $employment_type,

        #[Nullable, StringType, Max(50)]
        public ?string $employment_contract_type,

        // Self-employed fields
        #[Nullable, StringType, Max(255)]
        public ?string $business_name,

        #[Nullable, StringType, Max(100)]
        public ?string $business_type,

        #[Nullable, StringType, Max(100)]
        public ?string $business_registration_number,

        #[Nullable]
        public ?Carbon $business_start_date,

        // Income
        #[Nullable, Min(0)]
        public ?float $monthly_income,

        #[Nullable, Min(0)]
        public ?float $net_monthly_income,

        #[Nullable, Min(0)]
        public ?float $gross_annual_income,

        #[Nullable, Min(0)]
        public ?float $gross_annual_revenue,

        #[Required]
        public Currency $income_currency,

        #[Nullable, StringType, Max(50)]
        public ?string $pay_frequency,

        // Employer contact
        #[Nullable, StringType, Max(100)]
        public ?string $employer_contact_name,

        #[Nullable]
        public ?PhoneData $employer_contact_phone,

        #[Nullable, StringType, Max(255)]
        public ?string $employer_contact_email,

        #[Nullable, StringType, Max(500)]
        public ?string $employer_address,

        // Additional income
        #[Nullable]
        public ?bool $has_additional_income,

        /** @var DataCollection<int, AdditionalIncomeData>|null */
        #[Nullable, DataCollectionOf(AdditionalIncomeData::class)]
        public ?DataCollection $additional_income_sources,

        // Documents
        #[Nullable]
        public ?DocumentData $employment_contract,

        #[Nullable]
        public ?DocumentData $payslip_1,

        #[Nullable]
        public ?DocumentData $payslip_2,

        #[Nullable]
        public ?DocumentData $payslip_3,

        /** @var array<DocumentData>|null */
        #[Nullable]
        public ?array $tax_returns,

        /** @var array<DocumentData>|null */
        #[Nullable]
        public ?array $bank_statements,

        /** @var array<DocumentData>|null */
        #[Nullable]
        public ?array $business_bank_statements,
    ) {}

    /**
     * Check if employed or self-employed.
     */
    public function isWorking(): bool
    {
        return in_array($this->employment_status, [
            EmploymentStatus::Employed,
            EmploymentStatus::SelfEmployed,
        ]);
    }

    /**
     * Check if currently on probation.
     */
    public function isOnProbation(): bool
    {
        if (! $this->probation_end_date) {
            return false;
        }

        return $this->probation_end_date->isFuture();
    }

    /**
     * Get total monthly income including additional sources.
     */
    public function totalMonthlyIncome(): float
    {
        $total = $this->monthly_income ?? $this->net_monthly_income ?? 0;

        if ($this->additional_income_sources) {
            foreach ($this->additional_income_sources as $source) {
                $total += $source->monthly_amount ?? 0;
            }
        }

        return $total;
    }
}
