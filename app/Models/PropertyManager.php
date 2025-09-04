<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyManager extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'company_name',
        'company_website',
        'license_number',
        'phone_country_code',
        'phone_number',
        'profile_picture_path',
        'id_document_path',
        'id_document_original_name',
        'license_document_path',
        'license_document_original_name',
        'profile_verified_at',
        'rejection_reason',
        'rejected_fields',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'profile_verified_at' => 'datetime',
        'rejected_fields' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_picture_url',
    ];

    /**
     * The user this property manager belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The properties owned by this property manager.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Check if the property manager is professional type.
     */
    public function isProfessional(): bool
    {
        return $this->type === 'professional';
    }

    /**
     * Check if the property manager is an individual landlord.
     */
    public function isIndividual(): bool
    {
        return $this->type === 'individual';
    }

    /**
     * Check if the property manager profile is verified.
     */
    public function isVerified(): bool
    {
        return !is_null($this->profile_verified_at);
    }

    /**
     * Check if the profile was rejected.
     */
    public function isRejected(): bool
    {
        return !is_null($this->rejection_reason);
    }

    /**
     * Get the URL for the profile picture.
     */
    public function getProfilePictureUrlAttribute(): ?string
    {
        if (!$this->profile_picture_path) {
            return null;
        }
        
        return \Illuminate\Support\Facades\Storage::disk('public')->url($this->profile_picture_path);
    }

    /**
     * Get the URL for the ID document.
     */
    public function getIdDocumentUrlAttribute(): ?string
    {
        if (!$this->id_document_path) {
            return null;
        }

        return \Illuminate\Support\Facades\Storage::disk('private')->url($this->id_document_path);
    }

    /**
     * Get the URL for the license document.
     */
    public function getLicenseDocumentUrlAttribute(): ?string
    {
        if (!$this->license_document_path) {
            return null;
        }

        return \Illuminate\Support\Facades\Storage::disk('private')->url($this->license_document_path);
    }
}
