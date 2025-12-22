<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Lead extends Model
{
    /** @use HasFactory<\Database\Factories\LeadFactory> */
    use HasFactory;

    // Status constants
    public const STATUS_INVITED = 'invited';

    public const STATUS_VIEWED = 'viewed';

    public const STATUS_DRAFTING = 'drafting';

    public const STATUS_APPLIED = 'applied';

    public const STATUS_ARCHIVED = 'archived';

    // Source constants
    public const SOURCE_MANUAL = 'manual';

    public const SOURCE_INVITE = 'invite';

    public const SOURCE_TOKEN_SIGNUP = 'token_signup';

    public const SOURCE_APPLICATION = 'application';

    public const SOURCE_INQUIRY = 'inquiry';

    protected $fillable = [
        'property_id',
        'email',
        'first_name',
        'last_name',
        'phone',
        'token',
        'source',
        'status',
        'user_id',
        'application_id',
        'invite_token_id',
        'invited_at',
        'viewed_at',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'invited_at' => 'datetime',
            'viewed_at' => 'datetime',
        ];
    }

    /**
     * Get the property this lead is interested in.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the user linked to this lead (if they signed up).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the application linked to this lead (if they applied).
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the invite token that led to this lead (if created via token).
     */
    public function inviteToken(): BelongsTo
    {
        return $this->belongsTo(ApplicationInviteToken::class, 'invite_token_id');
    }

    /**
     * Generate a unique token for this lead.
     */
    public static function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * Get the lead's full name.
     */
    public function getFullNameAttribute(): ?string
    {
        if (! $this->first_name && ! $this->last_name) {
            return null;
        }

        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Mark the lead as viewed (when they first click the invite link).
     */
    public function markAsViewed(): void
    {
        if ($this->status === self::STATUS_INVITED) {
            $this->update([
                'status' => self::STATUS_VIEWED,
                'viewed_at' => now(),
            ]);
        }
    }

    /**
     * Mark the lead as drafting (when they start an application).
     */
    public function markAsDrafting(Application $application): void
    {
        if (in_array($this->status, [self::STATUS_INVITED, self::STATUS_VIEWED])) {
            $this->update([
                'status' => self::STATUS_DRAFTING,
                'application_id' => $application->id,
            ]);
        }
    }

    /**
     * Mark the lead as applied (when they submit their application).
     */
    public function markAsApplied(): void
    {
        if ($this->status !== self::STATUS_APPLIED && $this->status !== self::STATUS_ARCHIVED) {
            $this->update(['status' => self::STATUS_APPLIED]);
        }
    }

    /**
     * Archive this lead.
     */
    public function archive(): void
    {
        $this->update(['status' => self::STATUS_ARCHIVED]);
    }

    /**
     * Scope: Get active (non-archived) leads.
     */
    public function scopeActive($query)
    {
        return $query->where('status', '!=', self::STATUS_ARCHIVED);
    }

    /**
     * Scope: Get leads that are currently drafting an application.
     */
    public function scopeDrafting($query)
    {
        return $query->where('status', self::STATUS_DRAFTING);
    }

    /**
     * Scope: Get leads that have applied.
     */
    public function scopeApplied($query)
    {
        return $query->where('status', self::STATUS_APPLIED);
    }

    /**
     * Scope: Get leads for a specific property.
     */
    public function scopeForProperty($query, $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }

    /**
     * Get available status options with labels.
     *
     * @return array<string, string>
     */
    public static function getStatusOptions(): array
    {
        return [
            self::STATUS_INVITED => 'Invited',
            self::STATUS_VIEWED => 'Viewed',
            self::STATUS_DRAFTING => 'Drafting',
            self::STATUS_APPLIED => 'Applied',
            self::STATUS_ARCHIVED => 'Archived',
        ];
    }

    /**
     * Get available source options with labels.
     *
     * @return array<string, string>
     */
    public static function getSourceOptions(): array
    {
        return [
            self::SOURCE_MANUAL => 'Manual',
            self::SOURCE_INVITE => 'Invite',
            self::SOURCE_TOKEN_SIGNUP => 'Token Signup',
            self::SOURCE_APPLICATION => 'Application',
            self::SOURCE_INQUIRY => 'Inquiry',
        ];
    }
}
