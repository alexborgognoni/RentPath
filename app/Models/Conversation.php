<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

    public const PARTICIPANT_TYPE_LEAD = 'lead';

    public const PARTICIPANT_TYPE_TENANT = 'tenant';

    protected $fillable = [
        'property_manager_id',
        'participant_type',
        'participant_id',
        'last_message_at',
        'manager_last_read_at',
        'participant_last_read_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'manager_last_read_at' => 'datetime',
            'participant_last_read_at' => 'datetime',
        ];
    }

    /**
     * Get the property manager in this conversation.
     */
    public function propertyManager(): BelongsTo
    {
        return $this->belongsTo(PropertyManager::class);
    }

    /**
     * Get all messages in this conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get the latest message in this conversation (for eager loading).
     */
    public function latestMessage(): HasMany
    {
        return $this->hasMany(Message::class)->latest('created_at')->limit(1);
    }

    /**
     * Get the participant (Lead or User) dynamically.
     * Note: For tenants, participant_id stores the user_id, not tenant_profile_id.
     */
    public function participant(): BelongsTo
    {
        if ($this->participant_type === self::PARTICIPANT_TYPE_LEAD) {
            return $this->belongsTo(Lead::class, 'participant_id');
        }

        return $this->belongsTo(User::class, 'participant_id');
    }

    /**
     * Get the lead if participant is a lead.
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class, 'participant_id');
    }

    /**
     * Get the user if participant is a tenant.
     * Note: For tenants, participant_id stores the user_id, not tenant_profile_id.
     */
    public function tenantUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant_id');
    }

    /**
     * Get the participant's display name.
     */
    public function getParticipantNameAttribute(): string
    {
        if ($this->participant_type === self::PARTICIPANT_TYPE_LEAD) {
            $lead = $this->lead;
            if ($lead) {
                return $lead->full_name ?? $lead->email;
            }

            return 'Unknown Lead';
        }

        $user = $this->tenantUser;
        if ($user) {
            return $user->name ?? $user->email;
        }

        return 'Unknown Tenant';
    }

    /**
     * Get the participant's email.
     */
    public function getParticipantEmailAttribute(): ?string
    {
        if ($this->participant_type === self::PARTICIPANT_TYPE_LEAD) {
            return $this->lead?->email;
        }

        return $this->tenantUser?->email;
    }

    /**
     * Check if the manager has unread messages.
     */
    public function hasUnreadForManager(): bool
    {
        if (! $this->last_message_at) {
            return false;
        }

        if (! $this->manager_last_read_at) {
            return true;
        }

        return $this->last_message_at->gt($this->manager_last_read_at);
    }

    /**
     * Check if the participant has unread messages.
     */
    public function hasUnreadForParticipant(): bool
    {
        if (! $this->last_message_at) {
            return false;
        }

        if (! $this->participant_last_read_at) {
            return true;
        }

        return $this->last_message_at->gt($this->participant_last_read_at);
    }

    /**
     * Mark conversation as read by the manager.
     */
    public function markAsReadByManager(): void
    {
        $this->update(['manager_last_read_at' => now()]);
    }

    /**
     * Mark conversation as read by the participant.
     */
    public function markAsReadByParticipant(): void
    {
        $this->update(['participant_last_read_at' => now()]);
    }

    /**
     * Get or create a conversation between a property manager and participant.
     */
    public static function getOrCreateBetween(
        int $propertyManagerId,
        string $participantType,
        int $participantId
    ): self {
        return self::firstOrCreate([
            'property_manager_id' => $propertyManagerId,
            'participant_type' => $participantType,
            'participant_id' => $participantId,
        ]);
    }

    /**
     * Scope: Get conversations for a specific property manager.
     */
    public function scopeForManager($query, int $propertyManagerId)
    {
        return $query->where('property_manager_id', $propertyManagerId);
    }

    /**
     * Scope: Get conversations for a specific participant.
     */
    public function scopeForParticipant($query, string $type, int $id)
    {
        return $query->where('participant_type', $type)
            ->where('participant_id', $id);
    }

    /**
     * Scope: Get conversations with messages, ordered by most recent.
     */
    public function scopeWithActivity($query)
    {
        return $query->whereNotNull('last_message_at')
            ->orderBy('last_message_at', 'desc');
    }
}
