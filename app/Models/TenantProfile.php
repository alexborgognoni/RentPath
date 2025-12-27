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
        'nationality',
        'phone_country_code',
        'phone_number',

        // Current address
        'current_house_number',
        'current_street_name',
        'current_city',
        'current_postal_code',
        'current_country',

        // Employment
        'employment_status',
        'employer_name',
        'job_title',
        'employment_start_date',
        'employment_type',
        'monthly_income',
        'income_currency',
        'employer_contact_name',
        'employer_contact_phone',
        'employer_contact_email',

        // Student info
        'university_name',
        'program_of_study',
        'expected_graduation_date',
        'student_income_source',

        // Guarantor
        'has_guarantor',
        'guarantor_name',
        'guarantor_relationship',
        'guarantor_phone',
        'guarantor_email',
        'guarantor_address',
        'guarantor_employer',
        'guarantor_monthly_income',

        // Documents
        'id_document_path',
        'id_document_original_name',
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
        'other_income_proof_path',
        'other_income_proof_original_name',
        'guarantor_id_path',
        'guarantor_id_original_name',
        'guarantor_proof_income_path',
        'guarantor_proof_income_original_name',
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
        'employment_start_date' => 'date',
        'expected_graduation_date' => 'date',
        'monthly_income' => 'decimal:2',
        'guarantor_monthly_income' => 'decimal:2',
        'has_guarantor' => 'boolean',
        'has_pets' => 'boolean',
        'is_smoker' => 'boolean',
        'profile_verified_at' => 'datetime',
        'verification_rejected_fields' => 'array',
        'occupants_count' => 'integer',
        'occupants_details' => 'array',
        'pets_details' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_picture_url',
        'age',
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
            $this->current_city,
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
     * Get the URL for the ID document (5-minute signed URL).
     */
    public function getIdDocumentUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->id_document_path, 'private', 5);
    }

    /**
     * Get the URL for the employment contract (5-minute signed URL).
     */
    public function getEmploymentContractUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->employment_contract_path, 'private', 5);
    }

    /**
     * Get the URL for payslip 1 (5-minute signed URL).
     */
    public function getPayslip1UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->payslip_1_path, 'private', 5);
    }

    /**
     * Get the URL for payslip 2 (5-minute signed URL).
     */
    public function getPayslip2UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->payslip_2_path, 'private', 5);
    }

    /**
     * Get the URL for payslip 3 (5-minute signed URL).
     */
    public function getPayslip3UrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->payslip_3_path, 'private', 5);
    }

    /**
     * Get the URL for student proof document (5-minute signed URL).
     */
    public function getStudentProofUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->student_proof_path, 'private', 5);
    }

    /**
     * Get the URL for other income proof document (5-minute signed URL).
     * Used for unemployed/retired tenants to prove benefits, savings, pension, etc.
     */
    public function getOtherIncomeProofUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->other_income_proof_path, 'private', 5);
    }

    /**
     * Get the URL for guarantor ID (5-minute signed URL).
     */
    public function getGuarantorIdUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_id_path, 'private', 5);
    }

    /**
     * Get the URL for guarantor proof of income (5-minute signed URL).
     */
    public function getGuarantorProofIncomeUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->guarantor_proof_income_path, 'private', 5);
    }

    /**
     * Get the URL for reference letter (5-minute signed URL).
     */
    public function getReferenceLetterUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->reference_letter_path, 'private', 5);
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
        $required = ['id_document_path'];

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
            $required[] = 'guarantor_id_path';
            $required[] = 'guarantor_proof_income_path';
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
