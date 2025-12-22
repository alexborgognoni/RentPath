<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    // Status constants (lifecycle only, funnel stage is derived from applications)
    public const STATUS_DRAFT = 'draft';

    public const STATUS_VACANT = 'vacant';

    public const STATUS_LEASED = 'leased';

    public const STATUS_MAINTENANCE = 'maintenance';

    public const STATUS_ARCHIVED = 'archived';

    // Visibility constants (who can SEE the property)
    public const VISIBILITY_PUBLIC = 'public';

    public const VISIBILITY_UNLISTED = 'unlisted';

    public const VISIBILITY_PRIVATE = 'private';

    // Application access constants (who can APPLY)
    public const ACCESS_OPEN = 'open';

    public const ACCESS_LINK_REQUIRED = 'link_required';

    public const ACCESS_INVITE_ONLY = 'invite_only';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_manager_id',
        'title',
        'description',
        'type',
        'subtype',

        // Property specifications
        'bedrooms',
        'bathrooms',
        'parking_spots_interior',
        'parking_spots_exterior',
        'size',
        'balcony_size',
        'land_size',
        'floor_level',
        'has_elevator',
        'year_built',

        // Energy / building
        'energy_class',
        'thermal_insulation_class',
        'heating_type',

        // Kitchen
        'kitchen_equipped',
        'kitchen_separated',

        // Extras / amenities
        'has_cellar',
        'has_laundry',
        'has_fireplace',
        'has_air_conditioning',
        'has_garden',
        'has_rooftop',
        'extras',

        // Rental information
        'available_date',
        'rent_amount',
        'rent_currency',
        'status',
        'wizard_step',

        // Address fields
        'house_number',
        'street_name',
        'street_line2',
        'city',
        'state',
        'postal_code',
        'country',

        // Visibility and access control
        'visibility',
        'accepting_applications',
        'application_access',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'formatted_rent',
        'main_image_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'available_date' => 'date',
        'rent_amount' => 'decimal:2',
        'size' => 'decimal:2',
        'balcony_size' => 'decimal:2',
        'land_size' => 'decimal:2',
        'bathrooms' => 'decimal:1',
        'bedrooms' => 'integer',
        'parking_spots_interior' => 'integer',
        'parking_spots_exterior' => 'integer',
        'floor_level' => 'integer',
        'has_elevator' => 'boolean',
        'year_built' => 'integer',
        'kitchen_equipped' => 'boolean',
        'kitchen_separated' => 'boolean',
        'has_cellar' => 'boolean',
        'has_laundry' => 'boolean',
        'has_fireplace' => 'boolean',
        'has_air_conditioning' => 'boolean',
        'has_garden' => 'boolean',
        'has_rooftop' => 'boolean',
        'extras' => 'array',
        'accepting_applications' => 'boolean',
        'wizard_step' => 'integer',
    ];

    /**
     * Get the property manager that owns the property.
     */
    public function propertyManager(): BelongsTo
    {
        return $this->belongsTo(PropertyManager::class);
    }

    /**
     * Get the images for the property.
     */
    public function images()
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    /**
     * Get the invite tokens for the property.
     */
    public function inviteTokens()
    {
        return $this->hasMany(ApplicationInviteToken::class);
    }

    /**
     * Get the applications for the property.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Get the leads for the property.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    /**
     * Get the main image for the property.
     */
    public function mainImage()
    {
        return $this->hasOne(PropertyImage::class)->where('is_main', true);
    }

    /**
     * Property type options.
     */
    public static function getTypeOptions(): array
    {
        return [
            'apartment' => 'Apartment',
            'house' => 'House',
            'room' => 'Room',
            'commercial' => 'Commercial',
            'industrial' => 'Industrial',
            'parking' => 'Parking',
        ];
    }

    /**
     * Property subtype options organized by type.
     */
    public static function getSubtypeOptions(): array
    {
        return [
            'apartment' => [
                'studio' => 'Studio',
                'loft' => 'Loft',
                'duplex' => 'Duplex',
                'triplex' => 'Triplex',
                'penthouse' => 'Penthouse',
                'serviced' => 'Serviced',
            ],
            'house' => [
                'detached' => 'Detached',
                'semi-detached' => 'Semi-detached',
                'villa' => 'Villa',
                'bungalow' => 'Bungalow',
            ],
            'room' => [
                'private_room' => 'Private Room',
                'student_room' => 'Student Room',
                'co-living' => 'Co-living',
            ],
            'commercial' => [
                'office' => 'Office',
                'retail' => 'Retail',
            ],
            'industrial' => [
                'warehouse' => 'Warehouse',
                'factory' => 'Factory',
            ],
            'parking' => [
                'garage' => 'Garage',
                'indoor_spot' => 'Indoor Spot',
                'outdoor_spot' => 'Outdoor Spot',
            ],
        ];
    }

    /**
     * Get subtypes for a specific type.
     */
    public static function getSubtypesForType(string $type): array
    {
        $subtypes = self::getSubtypeOptions();

        return $subtypes[$type] ?? [];
    }

    /**
     * Currency options.
     */
    public static function getCurrencyOptions(): array
    {
        return [
            'eur' => 'Euro (€)',
            'usd' => 'US Dollar ($)',
            'gbp' => 'British Pound (£)',
            'chf' => 'Swiss Franc (CHF)',
        ];
    }

    /**
     * Get formatted rent amount with currency.
     */
    public function getFormattedRentAttribute(): string
    {
        $symbols = [
            'eur' => '€',
            'usd' => '$',
            'gbp' => '£',
            'chf' => 'CHF ',
        ];

        $symbol = $symbols[$this->rent_currency] ?? $this->rent_currency;

        return $symbol.number_format($this->rent_amount, 2);
    }

    /**
     * Get the main image URL.
     */
    public function getMainImageUrlAttribute(): ?string
    {
        $mainImage = $this->mainImage;

        if (! $mainImage) {
            return null;
        }

        return $mainImage->url;
    }

    /**
     * Get formatted size with unit.
     */
    public function getFormattedSizeAttribute(): ?string
    {
        if (! $this->size) {
            return null;
        }

        return number_format($this->size, 0).' m²';
    }

    /**
     * Scope for properties with a specific status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for vacant properties.
     */
    public function scopeVacant($query)
    {
        return $query->where('status', self::STATUS_VACANT);
    }

    /**
     * Scope for publicly visible properties.
     */
    public function scopePubliclyVisible($query)
    {
        return $query->where('visibility', self::VISIBILITY_PUBLIC);
    }

    /**
     * Scope for properties accepting applications.
     */
    public function scopeAcceptingApplications($query)
    {
        return $query->where('accepting_applications', true);
    }

    /**
     * Scope for properties available from a specific date.
     */
    public function scopeAvailableFrom($query, $date)
    {
        return $query->where('available_date', '<=', $date);
    }

    /**
     * Scope for properties by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Check if the property is publicly visible.
     */
    public function isPubliclyVisible(): bool
    {
        return $this->visibility === self::VISIBILITY_PUBLIC;
    }

    /**
     * Check if the property is accessible via direct link (unlisted or public).
     */
    public function isAccessibleViaLink(): bool
    {
        return in_array($this->visibility, [self::VISIBILITY_PUBLIC, self::VISIBILITY_UNLISTED]);
    }

    /**
     * Check if the property accepts open applications (no token/invite required).
     */
    public function hasOpenApplicationAccess(): bool
    {
        return $this->accepting_applications && $this->application_access === self::ACCESS_OPEN;
    }

    /**
     * Check if the property requires a token link to apply.
     */
    public function requiresTokenToApply(): bool
    {
        return $this->application_access === self::ACCESS_LINK_REQUIRED;
    }

    /**
     * Check if the property is invite-only for applications.
     */
    public function isInviteOnly(): bool
    {
        return $this->application_access === self::ACCESS_INVITE_ONLY;
    }

    /**
     * Get the funnel stage derived from applications.
     * This replaces the old status-based funnel tracking.
     */
    public function getFunnelStageAttribute(): string
    {
        $applications = $this->applications()
            ->whereNotIn('status', ['draft', 'withdrawn'])
            ->get();

        if ($applications->isEmpty()) {
            return 'no_applications';
        }

        // Return highest priority stage
        $priorities = ['approved', 'visit_scheduled', 'under_review', 'submitted'];
        foreach ($priorities as $status) {
            if ($applications->contains('status', $status)) {
                return $status;
            }
        }

        return 'has_applications';
    }

    /**
     * Check if the property can be accessed with the given token.
     * Now checks ApplicationInviteToken table instead of property.invite_token.
     */
    public function canAccessWithToken(string $token): bool
    {
        $inviteToken = $this->inviteTokens()->where('token', $token)->first();

        if (! $inviteToken) {
            return false;
        }

        return $inviteToken->canBeUsed();
    }

    /**
     * Get or create the default invite token for this property.
     */
    public function getOrCreateDefaultToken(): ApplicationInviteToken
    {
        $defaultToken = $this->inviteTokens()->default()->first();

        if (! $defaultToken) {
            $defaultToken = $this->inviteTokens()->create([
                'name' => 'Default',
                'token' => ApplicationInviteToken::generateToken(),
                'max_uses' => null,
                'expires_at' => null,
            ]);
        }

        return $defaultToken;
    }

    /**
     * Regenerate the default invite token.
     */
    public function regenerateDefaultToken(): ApplicationInviteToken
    {
        $defaultToken = $this->inviteTokens()->default()->first();

        if ($defaultToken) {
            $defaultToken->update([
                'token' => ApplicationInviteToken::generateToken(),
                'used_count' => 0, // Reset usage count
            ]);
        } else {
            $defaultToken = $this->getOrCreateDefaultToken();
        }

        return $defaultToken;
    }

    /**
     * Get the default invite token (read-only, doesn't create).
     */
    public function getDefaultToken(): ?ApplicationInviteToken
    {
        return $this->inviteTokens()->default()->first();
    }

    /**
     * Create a custom invite token.
     */
    public function createCustomToken(array $data): ApplicationInviteToken
    {
        return $this->inviteTokens()->create([
            'name' => $data['name'] ?? null,
            'token' => ApplicationInviteToken::generateToken(),
            'max_uses' => $data['max_uses'] ?? null,
            'expires_at' => $data['expires_at'] ?? null,
        ]);
    }

    /**
     * Get available status options with labels.
     *
     * @return array<string, string>
     */
    public static function getStatusOptions(): array
    {
        return [
            self::STATUS_DRAFT => 'Draft',
            self::STATUS_VACANT => 'Vacant',
            self::STATUS_LEASED => 'Leased',
            self::STATUS_MAINTENANCE => 'Maintenance',
            self::STATUS_ARCHIVED => 'Archived',
        ];
    }

    /**
     * Get available visibility options with labels.
     *
     * @return array<string, string>
     */
    public static function getVisibilityOptions(): array
    {
        return [
            self::VISIBILITY_PUBLIC => 'Public',
            self::VISIBILITY_UNLISTED => 'Unlisted',
            self::VISIBILITY_PRIVATE => 'Private',
        ];
    }

    /**
     * Get available application access options with labels.
     *
     * @return array<string, string>
     */
    public static function getApplicationAccessOptions(): array
    {
        return [
            self::ACCESS_OPEN => 'Open',
            self::ACCESS_LINK_REQUIRED => 'Link Required',
            self::ACCESS_INVITE_ONLY => 'Invite Only',
        ];
    }
}
