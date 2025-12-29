<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicationCoSigner extends Model
{
    protected $fillable = [
        'application_id',
        'occupant_index',
        // Identity - Basic
        'first_name',
        'last_name',
        'date_of_birth',
        'nationality',
        'email',
        'phone_country_code',
        'phone_number',
        // Identity - ID Document
        'id_document_type',
        'id_number',
        'id_issuing_country',
        'id_expiry_date',
        'id_document_front_path',
        'id_document_front_original_name',
        'id_document_back_path',
        'id_document_back_original_name',
        // Immigration
        'immigration_status',
        'visa_type',
        'visa_expiry_date',
        // Employment
        'employment_status',
        'employment_status_other',
        'employer_name',
        'job_title',
        'employment_type',
        'employment_contract_type',
        'employment_start_date',
        // Financial
        'net_monthly_income',
        'income_currency',
        // Documents
        'employment_contract_path',
        'employment_contract_original_name',
        'payslips_paths',
        // Student
        'university_name',
        'enrollment_proof_path',
        'enrollment_proof_original_name',
        'student_income_source',
        'student_monthly_income',
        // Other income
        'income_source',
        'income_proof_path',
        'income_proof_original_name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'id_expiry_date' => 'date',
            'visa_expiry_date' => 'date',
            'employment_start_date' => 'date',
            'net_monthly_income' => 'decimal:2',
            'student_monthly_income' => 'decimal:2',
            'payslips_paths' => 'array',
            'occupant_index' => 'integer',
        ];
    }

    /**
     * Get the application this co-signer belongs to.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the guarantors for this co-signer.
     */
    public function guarantors(): HasMany
    {
        return $this->hasMany(ApplicationGuarantor::class, 'for_co_signer_id');
    }

    /**
     * Get the co-signer's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Check if ID document back is required based on document type.
     */
    public function requiresIdDocumentBack(): bool
    {
        return in_array($this->id_document_type, ['national_id', 'drivers_license']);
    }
}
