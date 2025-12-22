<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory;

    public const SENDER_ROLE_MANAGER = 'manager';

    public const SENDER_ROLE_PARTICIPANT = 'participant';

    public $timestamps = false;

    protected $fillable = [
        'conversation_id',
        'sender_role',
        'body',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::created(function (Message $message) {
            $message->conversation->update([
                'last_message_at' => $message->created_at ?? now(),
            ]);
        });
    }

    /**
     * Get the conversation this message belongs to.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the attachments for this message.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(MessageAttachment::class);
    }

    /**
     * Check if this message was sent by the manager.
     */
    public function isSentByManager(): bool
    {
        return $this->sender_role === self::SENDER_ROLE_MANAGER;
    }

    /**
     * Check if this message was sent by the participant.
     */
    public function isSentByParticipant(): bool
    {
        return $this->sender_role === self::SENDER_ROLE_PARTICIPANT;
    }

    /**
     * Get the sender's display name.
     */
    public function getSenderNameAttribute(): string
    {
        if ($this->isSentByManager()) {
            $manager = $this->conversation->propertyManager;
            if ($manager) {
                return $manager->company_name ?? $manager->user->name ?? 'Property Manager';
            }

            return 'Property Manager';
        }

        return $this->conversation->participant_name;
    }
}
