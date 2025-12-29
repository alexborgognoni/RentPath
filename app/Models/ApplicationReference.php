<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationReference extends Model
{
    protected $fillable = [
        'application_id',
        'type',
        // Basic contact
        'name',
        'company',
        'email',
        'phone',
        // Landlord-specific
        'property_address',
        'tenancy_start_date',
        'tenancy_end_date',
        'monthly_rent_paid',
        // Employer-specific
        'job_title',
        // Personal/Professional
        'relationship',
        'years_known',
        // Consent
        'consent_to_contact',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tenancy_start_date' => 'date',
            'tenancy_end_date' => 'date',
            'monthly_rent_paid' => 'decimal:2',
            'years_known' => 'integer',
            'consent_to_contact' => 'boolean',
        ];
    }

    /**
     * Get the application this reference belongs to.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Scope to filter by landlord references.
     */
    public function scopeLandlord($query)
    {
        return $query->where('type', 'landlord');
    }

    /**
     * Scope to filter by employer references.
     */
    public function scopeEmployer($query)
    {
        return $query->where('type', 'employer');
    }

    /**
     * Scope to filter by personal references.
     */
    public function scopePersonal($query)
    {
        return $query->where('type', 'personal');
    }

    /**
     * Scope to filter by professional references.
     */
    public function scopeProfessional($query)
    {
        return $query->where('type', 'professional');
    }

    /**
     * Check if this is a landlord reference.
     */
    public function isLandlord(): bool
    {
        return $this->type === 'landlord';
    }

    /**
     * Check if this is an employer reference.
     */
    public function isEmployer(): bool
    {
        return $this->type === 'employer';
    }
}
