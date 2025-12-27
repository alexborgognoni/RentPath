<?php

namespace App\Models;

use App\Helpers\StorageHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantReference extends Model
{
    use HasFactory;

    // Reference types
    public const TYPE_LANDLORD = 'landlord';

    public const TYPE_PERSONAL = 'personal';

    public const TYPE_PROFESSIONAL = 'professional';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tenant_profile_id',
        'type',
        'name',
        'phone',
        'email',
        'relationship',
        'years_known',
        'reference_document_path',
        'reference_document_original_name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'years_known' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'reference_document_url',
    ];

    /**
     * Get all available reference types.
     *
     * @return array<string, string>
     */
    public static function types(): array
    {
        return [
            self::TYPE_LANDLORD => 'Previous Landlord',
            self::TYPE_PERSONAL => 'Personal Reference',
            self::TYPE_PROFESSIONAL => 'Professional Reference',
        ];
    }

    /**
     * The tenant profile this reference belongs to.
     */
    public function tenantProfile(): BelongsTo
    {
        return $this->belongsTo(TenantProfile::class);
    }

    /**
     * Check if this is a landlord reference.
     */
    public function isLandlord(): bool
    {
        return $this->type === self::TYPE_LANDLORD;
    }

    /**
     * Check if this is a personal reference.
     */
    public function isPersonal(): bool
    {
        return $this->type === self::TYPE_PERSONAL;
    }

    /**
     * Check if this is a professional reference.
     */
    public function isProfessional(): bool
    {
        return $this->type === self::TYPE_PROFESSIONAL;
    }

    /**
     * Get the URL for the reference document (5-minute signed URL).
     */
    public function getReferenceDocumentUrlAttribute(): ?string
    {
        return StorageHelper::url($this->reference_document_path, 'private', 5);
    }

    /**
     * Get the human-readable type label.
     */
    public function getTypeLabelAttribute(): string
    {
        return self::types()[$this->type] ?? ucfirst($this->type);
    }
}
