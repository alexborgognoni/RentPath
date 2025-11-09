<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ApplicationInviteToken extends Model
{
    protected $fillable = [
        'property_id',
        'token',
        'type',
        'email',
        'max_uses',
        'used_count',
        'expires_at',
        'name',
    ];

    protected $casts = [
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
    ];

    /**
     * Relationship: Token belongs to a property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Check if this is the default token
     */
    public function isDefault(): bool
    {
        return $this->name === 'Default';
    }

    /**
     * Check if token is valid (not expired, not over usage limit)
     */
    public function isValid(): bool
    {
        // Check expiration
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        // Check usage limit
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Check if token can be used (valid + type constraints)
     */
    public function canBeUsed(?string $email = null): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        // For 'invite' type, email must match
        if ($this->type === 'invite' && $this->email !== $email) {
            return false;
        }

        return true;
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    /**
     * Generate a new random token
     */
    public static function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * Scope: Get default token for a property
     */
    public function scopeDefault($query)
    {
        return $query->where('name', 'Default');
    }

    /**
     * Scope: Get custom (non-default) tokens
     */
    public function scopeCustom($query)
    {
        return $query->where('name', '!=', 'Default');
    }

    /**
     * Scope: Get valid (non-expired, under limit) tokens
     */
    public function scopeValid($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', now());
        })->where(function ($q) {
            $q->whereNull('max_uses')
                ->orWhereRaw('used_count < max_uses');
        });
    }
}
