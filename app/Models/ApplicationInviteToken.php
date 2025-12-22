<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ApplicationInviteToken extends Model
{
    protected $fillable = [
        'property_id',
        'token',
        'max_uses',
        'used_count',
        'view_count',
        'expires_at',
        'name',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'view_count' => 'integer',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Relationship: Token belongs to a property.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Relationship: Token may have created leads (when users sign up via this token).
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'invite_token_id');
    }

    /**
     * Check if this is the default token.
     */
    public function isDefault(): bool
    {
        return $this->name === 'Default';
    }

    /**
     * Check if token is valid (not expired, not over usage limit).
     */
    public function isValid(): bool
    {
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Check if token can be used for applications.
     * Tokens are now anonymous shareable links only.
     */
    public function canBeUsed(): bool
    {
        return $this->isValid();
    }

    /**
     * Increment usage count (when someone applies using this token).
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    /**
     * Increment view count (when someone clicks this token link).
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    /**
     * Generate a new random token.
     */
    public static function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * Scope: Get default token for a property.
     */
    public function scopeDefault($query)
    {
        return $query->where('name', 'Default');
    }

    /**
     * Scope: Get custom (non-default) tokens.
     */
    public function scopeCustom($query)
    {
        return $query->where('name', '!=', 'Default');
    }

    /**
     * Scope: Get valid (non-expired, under limit) tokens.
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
