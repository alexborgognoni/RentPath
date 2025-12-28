<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'tenant_profile_id',
        'status',
        'current_step',

        // Application-specific details
        'desired_move_in_date',
        'lease_duration_months',
        'message_to_landlord',

        // Additional occupants
        'additional_occupants',
        'occupants_details',

        // Pet information
        'has_pets',
        'pets_details',

        // References
        'references',
        'snapshot_references',
        'previous_landlord_name',
        'previous_landlord_phone',
        'previous_landlord_email',

        // Emergency contact
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',

        // Application-specific documents
        'application_id_document_path',
        'application_id_document_original_name',
        'application_proof_of_income_path',
        'application_proof_of_income_original_name',
        'application_reference_letter_path',
        'application_reference_letter_original_name',
        'additional_documents',

        // Review & decision
        'rejection_reason',
        'rejection_details',
        'reviewed_by_user_id',
        'reviewed_at',

        // Visit information
        'visit_scheduled_at',
        'visit_notes',
        'visit_completed_at',

        // Approval
        'approved_by_user_id',
        'approved_at',
        'approval_notes',

        // Lease information
        'lease_start_date',
        'lease_end_date',
        'agreed_rent_amount',
        'deposit_amount',
        'lease_document_path',
        'lease_document_original_name',
        'lease_signed_at',

        // Timestamps
        'submitted_at',
        'withdrawn_at',
        'archived_at',

        // Token tracking
        'invited_via_token',

        // Internal notes
        'internal_notes',

        // Snapshot fields (frozen profile data at submission time)
        'snapshot_date_of_birth',
        'snapshot_nationality',
        'snapshot_phone_country_code',
        'snapshot_phone_number',
        'snapshot_employment_status',
        'snapshot_employer_name',
        'snapshot_job_title',
        'snapshot_employment_start_date',
        'snapshot_employment_type',
        'snapshot_monthly_income',
        'snapshot_income_currency',
        'snapshot_current_house_number',
        'snapshot_current_address_line_2',
        'snapshot_current_street_name',
        'snapshot_current_city',
        'snapshot_current_state_province',
        'snapshot_current_postal_code',
        'snapshot_current_country',
        'snapshot_university_name',
        'snapshot_program_of_study',
        'snapshot_expected_graduation_date',
        'snapshot_student_income_source',
        'snapshot_has_guarantor',
        'snapshot_guarantor_name',
        'snapshot_guarantor_relationship',
        'snapshot_guarantor_phone',
        'snapshot_guarantor_email',
        'snapshot_guarantor_address',
        'snapshot_guarantor_employer',
        'snapshot_guarantor_monthly_income',
        'snapshot_guarantor_income_currency',
        'snapshot_id_document_path',
        'snapshot_employment_contract_path',
        'snapshot_payslip_1_path',
        'snapshot_payslip_2_path',
        'snapshot_payslip_3_path',
        'snapshot_student_proof_path',
        'snapshot_guarantor_id_path',
        'snapshot_guarantor_proof_income_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'desired_move_in_date' => 'date',
        'lease_start_date' => 'date',
        'lease_end_date' => 'date',
        'additional_occupants' => 'integer',
        'occupants_details' => 'array',
        'has_pets' => 'boolean',
        'pets_details' => 'array',
        'references' => 'array',
        'snapshot_references' => 'array',
        'additional_documents' => 'array',
        'rejection_details' => 'array',
        'agreed_rent_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'lease_duration_months' => 'integer',
        'reviewed_at' => 'datetime',
        'visit_scheduled_at' => 'datetime',
        'visit_completed_at' => 'datetime',
        'approved_at' => 'datetime',
        'lease_signed_at' => 'datetime',
        'submitted_at' => 'datetime',
        'withdrawn_at' => 'datetime',
        'archived_at' => 'datetime',
        'snapshot_date_of_birth' => 'date',
        'snapshot_employment_start_date' => 'date',
        'snapshot_expected_graduation_date' => 'date',
        'snapshot_monthly_income' => 'decimal:2',
        'snapshot_guarantor_monthly_income' => 'decimal:2',
        'snapshot_has_guarantor' => 'boolean',
    ];

    /**
     * The property this application is for.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * The tenant profile that submitted this application.
     */
    public function tenantProfile(): BelongsTo
    {
        return $this->belongsTo(TenantProfile::class);
    }

    /**
     * The user who reviewed this application.
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    /**
     * The user who approved this application.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    /**
     * Check if the application is in draft status.
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if the application has been submitted.
     */
    public function isSubmitted(): bool
    {
        return ! is_null($this->submitted_at);
    }

    /**
     * Check if the application is under review.
     */
    public function isUnderReview(): bool
    {
        return $this->status === 'under_review';
    }

    /**
     * Check if the application has been approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the application has been rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if the application has been withdrawn.
     */
    public function isWithdrawn(): bool
    {
        return $this->status === 'withdrawn';
    }

    /**
     * Check if the application has a lease signed.
     */
    public function isLeased(): bool
    {
        return $this->status === 'leased';
    }

    /**
     * Check if the application is archived.
     */
    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }

    /**
     * Check if the application can be edited.
     */
    public function canBeEdited(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if the application can be withdrawn.
     */
    public function canBeWithdrawn(): bool
    {
        return in_array($this->status, ['submitted', 'under_review', 'visit_scheduled', 'visit_completed']);
    }

    /**
     * Get the URL for application ID document (5-minute signed URL).
     */
    public function getApplicationIdDocumentUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->application_id_document_path, 'private', 5, $this->application_id_document_original_name);
    }

    /**
     * Get the URL for application proof of income (5-minute signed URL).
     */
    public function getApplicationProofOfIncomeUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->application_proof_of_income_path, 'private', 5, $this->application_proof_of_income_original_name);
    }

    /**
     * Get the URL for application reference letter (5-minute signed URL).
     */
    public function getApplicationReferenceLetterUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->application_reference_letter_path, 'private', 5, $this->application_reference_letter_original_name);
    }

    /**
     * Get the URL for lease document (5-minute signed URL).
     */
    public function getLeaseDocumentUrlAttribute(): ?string
    {
        return \App\Helpers\StorageHelper::url($this->lease_document_path, 'private', 5, $this->lease_document_original_name);
    }

    /**
     * Scope to get only active applications (not withdrawn or archived).
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['withdrawn', 'archived', 'deleted']);
    }

    /**
     * Scope to get applications visible to property managers (submitted and beyond, not drafts).
     */
    public function scopeVisibleToManager($query)
    {
        return $query->whereNotIn('status', ['draft', 'withdrawn', 'archived', 'deleted']);
    }

    /**
     * Scope to get applications by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get applications for a specific property.
     */
    public function scopeForProperty($query, int $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }

    /**
     * Scope to get applications by a specific tenant.
     */
    public function scopeByTenant($query, int $tenantProfileId)
    {
        return $query->where('tenant_profile_id', $tenantProfileId);
    }

    /**
     * Get human-readable status text.
     */
    public function getStatusTextAttribute(): string
    {
        return match ($this->status) {
            'draft' => 'Draft',
            'submitted' => 'Submitted',
            'under_review' => 'Under Review',
            'visit_scheduled' => 'Visit Scheduled',
            'visit_completed' => 'Visit Completed',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'withdrawn' => 'Withdrawn',
            'leased' => 'Leased',
            'archived' => 'Archived',
            'deleted' => 'Deleted',
            default => 'Unknown',
        };
    }

    /**
     * Get the total number of occupants (including applicant).
     */
    public function getTotalOccupantsAttribute(): int
    {
        return 1 + $this->additional_occupants;
    }

    /**
     * Submit the application (change from draft to submitted).
     */
    public function submit(): bool
    {
        if (! $this->isDraft()) {
            return false;
        }

        $this->status = 'submitted';
        $this->submitted_at = now();

        return $this->save();
    }

    /**
     * Withdraw the application.
     */
    public function withdraw(): bool
    {
        if (! $this->canBeWithdrawn()) {
            return false;
        }

        $this->status = 'withdrawn';
        $this->withdrawn_at = now();

        return $this->save();
    }

    /**
     * Move application to under review.
     */
    public function moveToUnderReview(User $reviewer): bool
    {
        if ($this->status !== 'submitted') {
            return false;
        }

        $this->status = 'under_review';
        $this->reviewed_by_user_id = $reviewer->id;
        $this->reviewed_at = now();

        return $this->save();
    }

    /**
     * Approve the application.
     */
    public function approve(User $approver, ?string $notes = null): bool
    {
        if (! in_array($this->status, ['under_review', 'visit_completed'])) {
            return false;
        }

        $this->status = 'approved';
        $this->approved_by_user_id = $approver->id;
        $this->approved_at = now();
        $this->approval_notes = $notes;

        return $this->save();
    }

    /**
     * Reject the application.
     */
    public function reject(string $reason, ?array $details = null): bool
    {
        if (! in_array($this->status, ['submitted', 'under_review', 'visit_completed'])) {
            return false;
        }

        $this->status = 'rejected';
        $this->rejection_reason = $reason;
        $this->rejection_details = $details;

        return $this->save();
    }

    /**
     * Schedule a visit.
     */
    public function scheduleVisit(\DateTime $dateTime, ?string $notes = null): bool
    {
        if (! in_array($this->status, ['submitted', 'under_review'])) {
            return false;
        }

        $this->status = 'visit_scheduled';
        $this->visit_scheduled_at = $dateTime;
        $this->visit_notes = $notes;

        return $this->save();
    }

    /**
     * Mark visit as completed.
     */
    public function completeVisit(?string $notes = null): bool
    {
        if ($this->status !== 'visit_scheduled') {
            return false;
        }

        $this->status = 'visit_completed';
        $this->visit_completed_at = now();
        if ($notes) {
            $this->visit_notes = ($this->visit_notes ? $this->visit_notes."\n\n" : '').$notes;
        }

        return $this->save();
    }

    /**
     * Mark as leased with lease details.
     */
    public function markAsLeased(
        \DateTime $startDate,
        \DateTime $endDate,
        float $rentAmount,
        float $depositAmount
    ): bool {
        if ($this->status !== 'approved') {
            return false;
        }

        $this->status = 'leased';
        $this->lease_start_date = $startDate;
        $this->lease_end_date = $endDate;
        $this->agreed_rent_amount = $rentAmount;
        $this->deposit_amount = $depositAmount;
        $this->lease_signed_at = now();

        return $this->save();
    }

    /**
     * Archive the application.
     */
    public function archive(): bool
    {
        $this->status = 'archived';
        $this->archived_at = now();

        return $this->save();
    }
}
