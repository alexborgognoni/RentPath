<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory;

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

        // Address fields
        'house_number',
        'street_name',
        'street_line2',
        'city',
        'state',
        'postal_code',
        'country',

        // Application access control and invite tokens
        'requires_invite',
        'invite_token',
        'invite_token_expires_at',
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
        'requires_invite' => 'boolean',
        'invite_token_expires_at' => 'datetime',
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

        return $symbol . number_format($this->rent_amount, 2);
    }

    /**
     * Get formatted size with unit.
     */
    public function getFormattedSizeAttribute(): ?string
    {
        if (!$this->size) {
            return null;
        }

        return number_format($this->size, 0) . ' m²';
    }

    /**
     * Scope for properties with a specific status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for available properties.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
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
     * Generate a new invite token that expires in the given number of days.
     */
    public function generateInviteToken(int $expirationDays = 30): string
    {
        $this->invite_token = Str::random(64);
        $this->invite_token_expires_at = now()->addDays($expirationDays);
        $this->save();

        return $this->invite_token;
    }

    /**
     * Check if the invite token is valid and not expired.
     */
    public function hasValidInviteToken(): bool
    {
        if (!$this->invite_token) {
            return false;
        }

        if (!$this->invite_token_expires_at) {
            return false;
        }

        return $this->invite_token_expires_at->isFuture();
    }

    /**
     * Invalidate the current invite token.
     */
    public function invalidateInviteToken(): void
    {
        $this->invite_token = null;
        $this->invite_token_expires_at = null;
        $this->save();
    }

    /**
     * Check if the property can be accessed publicly for applications.
     * Returns true if invite is NOT required (inverted from requires_invite).
     */
    public function isPubliclyAccessible(): bool
    {
        return $this->requires_invite === false;
    }

    /**
     * Check if the property can be accessed with the given token.
     * Now checks ApplicationInviteToken table instead of property.invite_token.
     */
    public function canAccessWithToken(string $token): bool
    {
        $inviteToken = $this->inviteTokens()->where('token', $token)->first();

        if (!$inviteToken) {
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

        if (!$defaultToken) {
            $defaultToken = $this->inviteTokens()->create([
                'name' => 'Default',
                'token' => ApplicationInviteToken::generateToken(),
                'type' => 'private',
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
            'type' => $data['type'] ?? 'private',
            'email' => $data['email'] ?? null,
            'max_uses' => $data['max_uses'] ?? null,
            'expires_at' => $data['expires_at'] ?? null,
        ]);
    }
}
