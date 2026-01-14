<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TenantProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'middle_name',
        'nationality',
        'phone_country_code',
        'phone_number',
        'bio',

        // Identity - ID Document
        'id_document_type',
        'id_number',
        'id_issuing_country',
        'id_expiry_date',

        // Identity - Immigration
        'immigration_status',
        'immigration_status_other',
        'visa_type',
        'visa_type_other',
        'visa_expiry_date',
        'work_permit_number',

        // Identity - Regional Enhancements
        'residence_permit_document_path',
        'residence_permit_document_original_name',
        'right_to_rent_document_path',
        'right_to_rent_document_original_name',
        'right_to_rent_share_code',
        'identity_verification_method',
        'identity_points_documents',
        'identity_points_total',

        // Current address
        'current_house_number',
        'current_address_line_2',
        'current_street_name',
        'current_city',
        'current_state_province',
        'current_postal_code',
        'current_country',

        // Employment
        'employment_status',
        'employer_name',
        'business_name',
        'business_type',
        'business_registration_number',
        'business_start_date',
        'job_title',
        'employment_start_date',
        'employment_end_date',
        'probation_end_date',
        'employment_type',
        'employment_contract_type',
        'monthly_income',
        'net_monthly_income',
        'gross_annual_income',
        'gross_annual_revenue',
        'income_currency',
        'pay_frequency',
        'employer_contact_name',
        'employer_contact_phone',
        'employer_contact_email',
        'employer_address',
        'employer_phone',

        // Additional Income
        'has_additional_income',
        'additional_income_sources',

        // Additional Documents
        'tax_returns_paths',
        'bank_statements_paths',
        'business_bank_statements_paths',

        // Student info
        'university_name',
        'program_of_study',
        'expected_graduation_date',
        'student_income_source',
        'student_income_source_type',
        'student_income_source_other',
        'student_monthly_income',

        // Retired info
        'pension_monthly_income',
        'pension_provider',
        'pension_type',
        'retirement_other_income',

        // Unemployed info
        'receiving_unemployment_benefits',
        'unemployment_benefits_amount',
        'unemployed_income_source',
        'unemployed_income_source_other',

        // Other employment situation
        'other_employment_situation',
        'other_employment_situation_details',
        'expected_return_to_work',
        'other_situation_monthly_income',
        'other_situation_income_source',

        // Documents
        'id_document_front_path',
        'id_document_front_original_name',
        'id_document_back_path',
        'id_document_back_original_name',
        'employment_contract_path',
        'employment_contract_original_name',
        'payslip_1_path',
        'payslip_1_original_name',
        'payslip_2_path',
        'payslip_2_original_name',
        'payslip_3_path',
        'payslip_3_original_name',
        'student_proof_path',
        'student_proof_original_name',
        'pension_statement_path',
        'pension_statement_original_name',
        'benefits_statement_path',
        'benefits_statement_original_name',
        'other_income_proof_path',
        'other_income_proof_original_name',

        'reference_letter_path',
        'reference_letter_original_name',
        'profile_picture_path',

        // Verification
        'profile_verified_at',
        'verification_rejection_reason',
        'verification_rejected_fields',

        // Credit & Background Authorization (History Step)
        'authorize_credit_check',
        'authorize_background_check',
        'credit_check_provider_preference',

        // Credit & Background Self-Disclosure (History Step)
        'has_ccjs_or_bankruptcies',
        'ccj_bankruptcy_details',
        'has_eviction_history',
        'eviction_details',

        // Current Living Situation (History Step)
        'current_living_situation',
        'current_address_move_in_date',
        'current_monthly_rent',
        'current_rent_currency',
        'current_landlord_name',
        'current_landlord_contact',

        // Reason for Moving (History Step)
        'reason_for_moving',
        'reason_for_moving_other',

        // Previous Addresses & References (History Step)
        'previous_addresses',
        'landlord_references',
        'other_references',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'id_expiry_date' => 'date',
        'visa_expiry_date' => 'date',
        'employment_start_date' => 'date',
        'employment_end_date' => 'date',
        'probation_end_date' => 'date',
        'expected_graduation_date' => 'date',
        'monthly_income' => 'decimal:2',
        'net_monthly_income' => 'decimal:2',
        'gross_annual_income' => 'decimal:2',
        'gross_annual_revenue' => 'decimal:2',
        'business_start_date' => 'date',
        'student_monthly_income' => 'decimal:2',
        'pension_monthly_income' => 'decimal:2',
        'retirement_other_income' => 'decimal:2',
        'receiving_unemployment_benefits' => 'boolean',
        'unemployment_benefits_amount' => 'decimal:2',
        'expected_return_to_work' => 'date',
        'other_situation_monthly_income' => 'decimal:2',
        'has_additional_income' => 'boolean',
        'profile_verified_at' => 'datetime',
        'verification_rejected_fields' => 'array',
        'identity_points_documents' => 'array',
        'identity_points_total' => 'integer',
        'additional_income_sources' => 'array',
        'tax_returns_paths' => 'array',
        'bank_statements_paths' => 'array',
        'business_bank_statements_paths' => 'array',
        // History Step casts
        'authorize_credit_check' => 'boolean',
        'authorize_background_check' => 'boolean',
        'has_ccjs_or_bankruptcies' => 'boolean',
        'has_eviction_history' => 'boolean',
        'current_address_move_in_date' => 'date',
        'current_monthly_rent' => 'decimal:2',
        'previous_addresses' => 'array',
        'landlord_references' => 'array',
        'other_references' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_picture_url',
        'age',
        'id_document_front_url',
        'id_document_back_url',
        'residence_permit_document_url',
        'right_to_rent_document_url',
        'employment_contract_url',
        'payslip_1_url',
        'payslip_2_url',
        'payslip_3_url',
        'student_proof_url',
        'pension_statement_url',
        'benefits_statement_url',
        'other_income_proof_url',
        'documents_metadata',
    ];

    /**
     * The user this tenant profile belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The applications submitted by this tenant.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    /**
     * The references associated with this tenant profile.
     */
    public function references(): HasMany
    {
        return $this->hasMany(TenantReference::class);
    }

    /**
     * Get landlord references only.
     */
    public function landlordReferences(): HasMany
    {
        return $this->references()->where('type', TenantReference::TYPE_LANDLORD);
    }

    /**
     * Get personal references (non-landlord).
     */
    public function personalReferences(): HasMany
    {
        return $this->references()->whereIn('type', [
            TenantReference::TYPE_PERSONAL,
            TenantReference::TYPE_PROFESSIONAL,
        ]);
    }

    /**
     * Check if the tenant profile is verified.
     */
    public function isVerified(): bool
    {
        return ! is_null($this->profile_verified_at);
    }

    /**
     * Check if the profile was rejected.
     */
    public function isRejected(): bool
    {
        return ! is_null($this->verification_rejection_reason);
    }

    /**
     * Check if the tenant is a student.
     */
    public function isStudent(): bool
    {
        return $this->employment_status === 'student';
    }

    /**
     * Check if the tenant is employed.
     */
    public function isEmployed(): bool
    {
        return in_array($this->employment_status, ['employed', 'self_employed']);
    }

    /**
     * Get the tenant's age based on date of birth.
     */
    public function getAgeAttribute(): ?int
    {
        if (! $this->date_of_birth) {
            return null;
        }

        return $this->date_of_birth->age;
    }

    /**
     * Get the full current address as a string.
     */
    public function getFullCurrentAddressAttribute(): string
    {
        $parts = array_filter([
            $this->current_house_number,
            $this->current_street_name,
            $this->current_address_line_2,
            $this->current_city,
            $this->current_state_province,
            $this->current_postal_code,
            $this->current_country,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Get the URL for the profile picture.
     */
    public function getProfilePictureUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->profile_picture_path, 'public');
    }

    /**
     * Get the URL for the ID document front (5-minute signed URL).
     */
    public function getIdDocumentFrontUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->id_document_front_path, 'private', 5, $this->id_document_front_original_name);
    }

    /**
     * Get the URL for the ID document back (5-minute signed URL).
     */
    public function getIdDocumentBackUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->id_document_back_path, 'private', 5, $this->id_document_back_original_name);
    }

    /**
     * Get the URL for the residence permit document (5-minute signed URL).
     */
    public function getResidencePermitDocumentUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->residence_permit_document_path, 'private', 5, $this->residence_permit_document_original_name);
    }

    /**
     * Get the URL for the right to rent document (5-minute signed URL).
     */
    public function getRightToRentDocumentUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->right_to_rent_document_path, 'private', 5, $this->right_to_rent_document_original_name);
    }

    /**
     * Get the URL for the employment contract (5-minute signed URL).
     */
    public function getEmploymentContractUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->employment_contract_path, 'private', 5, $this->employment_contract_original_name);
    }

    /**
     * Get the URL for payslip 1 (5-minute signed URL).
     */
    public function getPayslip1UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->payslip_1_path, 'private', 5, $this->payslip_1_original_name);
    }

    /**
     * Get the URL for payslip 2 (5-minute signed URL).
     */
    public function getPayslip2UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->payslip_2_path, 'private', 5, $this->payslip_2_original_name);
    }

    /**
     * Get the URL for payslip 3 (5-minute signed URL).
     */
    public function getPayslip3UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->payslip_3_path, 'private', 5, $this->payslip_3_original_name);
    }

    /**
     * Get the URL for student proof document (5-minute signed URL).
     */
    public function getStudentProofUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->student_proof_path, 'private', 5, $this->student_proof_original_name);
    }

    /**
     * Get the URL for pension statement document (5-minute signed URL).
     */
    public function getPensionStatementUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->pension_statement_path, 'private', 5, $this->pension_statement_original_name);
    }

    /**
     * Get the URL for benefits statement document (5-minute signed URL).
     */
    public function getBenefitsStatementUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->benefits_statement_path, 'private', 5, $this->benefits_statement_original_name);
    }

    /**
     * Get the URL for other income proof document (5-minute signed URL).
     * Used for unemployed/retired tenants to prove benefits, savings, pension, etc.
     */
    public function getOtherIncomeProofUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->other_income_proof_path, 'private', 5, $this->other_income_proof_original_name);
    }

    /**
     * Get the URL for reference letter (5-minute signed URL).
     */
    public function getReferenceLetterUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->reference_letter_path, 'private', 5, $this->reference_letter_original_name);
    }

    /**
     * Get metadata for all documents (size, lastModified).
     * Returns an associative array keyed by document type.
     *
     * @return array<string, array{size: int|null, lastModified: int|null}|null>
     */
    public function getDocumentsMetadataAttribute(): array
    {
        $documents = [
            'id_document_front' => $this->id_document_front_path,
            'id_document_back' => $this->id_document_back_path,
            'employment_contract' => $this->employment_contract_path,
            'payslip_1' => $this->payslip_1_path,
            'payslip_2' => $this->payslip_2_path,
            'payslip_3' => $this->payslip_3_path,
            'student_proof' => $this->student_proof_path,
            'pension_statement' => $this->pension_statement_path,
            'benefits_statement' => $this->benefits_statement_path,
            'other_income_proof' => $this->other_income_proof_path,
            'reference_letter' => $this->reference_letter_path,
        ];

        $metadata = [];
        foreach ($documents as $key => $path) {
            if ($path) {
                $metadata[$key] = \App\Helpers\StorageHelper::getMetadata($path, 'private');
            }
        }

        return $metadata;
    }

    /**
     * Check if the tenant is unemployed or retired.
     */
    public function isUnemployedOrRetired(): bool
    {
        return in_array($this->employment_status, ['unemployed', 'retired']);
    }

    /**
     * Get required documents based on employment status.
     */
    public function getRequiredDocuments(): array
    {
        $required = ['id_document_front_path', 'id_document_back_path'];

        if ($this->isEmployed()) {
            $required[] = 'employment_contract_path';
            $required[] = 'payslip_1_path';
            $required[] = 'payslip_2_path';
            $required[] = 'payslip_3_path';
        }

        if ($this->isStudent()) {
            $required[] = 'student_proof_path';
        }

        if ($this->isUnemployedOrRetired()) {
            $required[] = 'other_income_proof_path';
        }

        return $required;
    }

    /**
     * Check if all required documents are uploaded.
     */
    public function hasAllRequiredDocuments(): bool
    {
        $required = $this->getRequiredDocuments();

        foreach ($required as $field) {
            if (empty($this->$field)) {
                return false;
            }
        }

        return true;
    }
}
