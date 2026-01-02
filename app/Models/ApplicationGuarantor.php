<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationGuarantor extends Model
{
    protected $fillable = [
        'application_id',
        'for_signer_type',
        'for_co_signer_id',
        // Identity - Basic
        'first_name',
        'last_name',
        'date_of_birth',
        'nationality',
        'email',
        'phone_country_code',
        'phone_number',
        // Relationship
        'relationship',
        'relationship_other',
        // Identity - ID Document
        'id_document_type',
        'id_number',
        'id_issuing_country',
        'id_expiry_date',
        'id_document_front_path',
        'id_document_front_original_name',
        'id_document_back_path',
        'id_document_back_original_name',
        // Address (matching AddressForm component)
        'street_name',
        'house_number',
        'address_line_2',
        'city',
        'state_province',
        'postal_code',
        'country',
        'years_at_address',
        'proof_of_residence_path',
        'proof_of_residence_original_name',
        // Employment
        'employment_status',
        'employer_name',
        'job_title',
        // Financial
        'net_monthly_income',
        'income_currency',
        // Documents
        'proof_of_income_path',
        'proof_of_income_original_name',
        'credit_report_path',
        'credit_report_original_name',
        // Consent
        'consent_to_credit_check',
        'consent_to_contact',
        'guarantee_consent_signed',
        'guarantee_consent_timestamp',
        'guarantee_consent_ip',
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
            'net_monthly_income' => 'decimal:2',
            'years_at_address' => 'integer',
            'consent_to_credit_check' => 'boolean',
            'consent_to_contact' => 'boolean',
            'guarantee_consent_signed' => 'boolean',
            'guarantee_consent_timestamp' => 'datetime',
        ];
    }

    /**
     * Get the application this guarantor belongs to.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the co-signer this guarantor is for (if applicable).
     */
    public function coSigner(): BelongsTo
    {
        return $this->belongsTo(ApplicationCoSigner::class, 'for_co_signer_id');
    }

    /**
     * Get the guarantor's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Check if this guarantor is for the primary applicant.
     */
    public function isForPrimaryApplicant(): bool
    {
        return $this->for_signer_type === 'primary';
    }

    /**
     * Get the full address as a string.
     */
    public function getFullAddressAttribute(): string
    {
        $streetLine = trim("{$this->street_name} {$this->house_number}");
        $parts = array_filter([
            $streetLine,
            $this->address_line_2,
            $this->city,
            $this->state_province,
            $this->postal_code,
            $this->country,
        ]);

        return implode(', ', $parts);
    }
}
