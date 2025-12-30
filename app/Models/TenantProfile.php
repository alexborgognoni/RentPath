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

        // Guarantor - Basic Info
        'has_guarantor',
        'guarantor_first_name',
        'guarantor_last_name',
        'guarantor_relationship',
        'guarantor_relationship_other',
        'guarantor_phone_country_code',
        'guarantor_phone_number',
        'guarantor_email',
        'guarantor_street_name',
        'guarantor_house_number',
        'guarantor_address_line_2',
        'guarantor_city',
        'guarantor_state_province',
        'guarantor_postal_code',
        'guarantor_country',

        // Guarantor - Employment
        'guarantor_employment_status',
        'guarantor_employer_name',
        'guarantor_job_title',
        'guarantor_employment_type',
        'guarantor_employment_start_date',
        'guarantor_monthly_income',
        'guarantor_income_currency',

        // Guarantor - Student Info
        'guarantor_university_name',
        'guarantor_program_of_study',
        'guarantor_expected_graduation_date',
        'guarantor_student_income_source',

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

        // Guarantor Documents
        'guarantor_id_front_path',
        'guarantor_id_front_original_name',
        'guarantor_id_back_path',
        'guarantor_id_back_original_name',
        'guarantor_proof_income_path',
        'guarantor_proof_income_original_name',
        'guarantor_employment_contract_path',
        'guarantor_employment_contract_original_name',
        'guarantor_payslip_1_path',
        'guarantor_payslip_1_original_name',
        'guarantor_payslip_2_path',
        'guarantor_payslip_2_original_name',
        'guarantor_payslip_3_path',
        'guarantor_payslip_3_original_name',
        'guarantor_student_proof_path',
        'guarantor_student_proof_original_name',
        'guarantor_other_income_proof_path',
        'guarantor_other_income_proof_original_name',
        'reference_letter_path',
        'reference_letter_original_name',
        'profile_picture_path',

        // Emergency contact
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',

        // Preferences
        'occupants_count',
        'occupants_details',
        'has_pets',
        'pets_description',
        'pets_details',
        'is_smoker',

        // Verification
        'profile_verified_at',
        'verification_rejection_reason',
        'verification_rejected_fields',
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
        'guarantor_monthly_income' => 'decimal:2',
        'guarantor_employment_start_date' => 'date',
        'guarantor_expected_graduation_date' => 'date',
        'has_guarantor' => 'boolean',
        'has_additional_income' => 'boolean',
        'has_pets' => 'boolean',
        'is_smoker' => 'boolean',
        'profile_verified_at' => 'datetime',
        'verification_rejected_fields' => 'array',
        'occupants_count' => 'integer',
        'occupants_details' => 'array',
        'pets_details' => 'array',
        'identity_points_documents' => 'array',
        'identity_points_total' => 'integer',
        'additional_income_sources' => 'array',
        'tax_returns_paths' => 'array',
        'bank_statements_paths' => 'array',
        'business_bank_statements_paths' => 'array',
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
        'guarantor_full_name',
        'guarantor_id_front_url',
        'guarantor_id_back_url',
        'guarantor_proof_income_url',
        'guarantor_employment_contract_url',
        'guarantor_payslip_1_url',
        'guarantor_payslip_2_url',
        'guarantor_payslip_3_url',
        'guarantor_student_proof_url',
        'guarantor_other_income_proof_url',
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
     * Get the full guarantor address as a string.
     */
    public function getFullGuarantorAddressAttribute(): string
    {
        $parts = array_filter([
            $this->guarantor_house_number,
            $this->guarantor_street_name,
            $this->guarantor_address_line_2,
            $this->guarantor_city,
            $this->guarantor_state_province,
            $this->guarantor_postal_code,
            $this->guarantor_country,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Get the full guarantor phone number as a string.
     */
    public function getFullGuarantorPhoneAttribute(): string
    {
        if (! $this->guarantor_phone_country_code || ! $this->guarantor_phone_number) {
            return '';
        }

        return $this->guarantor_phone_country_code.' '.$this->guarantor_phone_number;
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
     * Get the guarantor's full name (first + last).
     */
    public function getGuarantorFullNameAttribute(): ?string
    {
        if (! $this->guarantor_first_name && ! $this->guarantor_last_name) {
            return null;
        }

        return trim($this->guarantor_first_name.' '.$this->guarantor_last_name);
    }

    /**
     * Get the URL for guarantor ID front (5-minute signed URL).
     */
    public function getGuarantorIdFrontUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_id_front_path, 'private', 5, $this->guarantor_id_front_original_name);
    }

    /**
     * Get the URL for guarantor ID back (5-minute signed URL).
     */
    public function getGuarantorIdBackUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_id_back_path, 'private', 5, $this->guarantor_id_back_original_name);
    }

    /**
     * Get the URL for guarantor employment contract (5-minute signed URL).
     */
    public function getGuarantorEmploymentContractUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_employment_contract_path, 'private', 5, $this->guarantor_employment_contract_original_name);
    }

    /**
     * Get the URL for guarantor payslip 1 (5-minute signed URL).
     */
    public function getGuarantorPayslip1UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_payslip_1_path, 'private', 5, $this->guarantor_payslip_1_original_name);
    }

    /**
     * Get the URL for guarantor payslip 2 (5-minute signed URL).
     */
    public function getGuarantorPayslip2UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_payslip_2_path, 'private', 5, $this->guarantor_payslip_2_original_name);
    }

    /**
     * Get the URL for guarantor payslip 3 (5-minute signed URL).
     */
    public function getGuarantorPayslip3UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_payslip_3_path, 'private', 5, $this->guarantor_payslip_3_original_name);
    }

    /**
     * Get the URL for guarantor student proof (5-minute signed URL).
     */
    public function getGuarantorStudentProofUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_student_proof_path, 'private', 5, $this->guarantor_student_proof_original_name);
    }

    /**
     * Get the URL for guarantor other income proof (5-minute signed URL).
     */
    public function getGuarantorOtherIncomeProofUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_other_income_proof_path, 'private', 5, $this->guarantor_other_income_proof_original_name);
    }

    /**
     * Get the URL for guarantor proof of income (5-minute signed URL).
     */
    public function getGuarantorProofIncomeUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_proof_income_path, 'private', 5, $this->guarantor_proof_income_original_name);
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
            // Main tenant documents
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
            // Guarantor documents
            'guarantor_id_front' => $this->guarantor_id_front_path,
            'guarantor_id_back' => $this->guarantor_id_back_path,
            'guarantor_proof_income' => $this->guarantor_proof_income_path,
            'guarantor_employment_contract' => $this->guarantor_employment_contract_path,
            'guarantor_payslip_1' => $this->guarantor_payslip_1_path,
            'guarantor_payslip_2' => $this->guarantor_payslip_2_path,
            'guarantor_payslip_3' => $this->guarantor_payslip_3_path,
            'guarantor_student_proof' => $this->guarantor_student_proof_path,
            'guarantor_other_income_proof' => $this->guarantor_other_income_proof_path,
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
     * Check if the guarantor is employed or self-employed.
     */
    public function isGuarantorEmployed(): bool
    {
        return in_array($this->guarantor_employment_status, ['employed', 'self_employed']);
    }

    /**
     * Check if the guarantor is a student.
     */
    public function isGuarantorStudent(): bool
    {
        return $this->guarantor_employment_status === 'student';
    }

    /**
     * Check if the guarantor is unemployed or retired.
     */
    public function isGuarantorUnemployedOrRetired(): bool
    {
        return in_array($this->guarantor_employment_status, ['unemployed', 'retired']);
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

        if ($this->has_guarantor) {
            // Guarantor ID documents (always required)
            $required[] = 'guarantor_id_front_path';
            $required[] = 'guarantor_id_back_path';

            // Guarantor employment-specific documents
            if ($this->isGuarantorEmployed()) {
                $required[] = 'guarantor_employment_contract_path';
                $required[] = 'guarantor_payslip_1_path';
                $required[] = 'guarantor_payslip_2_path';
                $required[] = 'guarantor_payslip_3_path';
            }

            if ($this->isGuarantorStudent()) {
                $required[] = 'guarantor_student_proof_path';
            }

            if ($this->isGuarantorUnemployedOrRetired()) {
                $required[] = 'guarantor_other_income_proof_path';
            }
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
