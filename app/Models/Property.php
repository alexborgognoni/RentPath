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
        'image_path',
        'type',
        'bedrooms',
        'bathrooms',
        'parking_spots',
        'size',
        'size_unit',
        'available_date',
        'rent_amount',
        'rent_currency',
        'is_active',
        'invite_token',

        // Address fields
        'house_number',
        'street_name',
        'street_line2',
        'city',
        'state',
        'postal_code',
        'country',
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
        'bathrooms' => 'decimal:1',
        'bedrooms' => 'integer',
        'parking_spots' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'invite_token',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($property) {
            if (!$property->invite_token) {
                $property->invite_token = Str::random(32);
            }
        });
    }

    /**
     * Get the property manager that owns the property.
     */
    public function propertyManager(): BelongsTo
    {
        return $this->belongsTo(PropertyManager::class);
    }

    /**
     * Property type options.
     */
    public static function getTypeOptions(): array
    {
        return [
            'apartment' => 'Apartment',
            'house' => 'House',
            'condo' => 'Condo',
            'townhouse' => 'Townhouse',
            'studio' => 'Studio',
            'loft' => 'Loft',
            'room' => 'Room',
            'office' => 'Office',
            'garage' => 'Garage',
            'storage' => 'Storage',
            'warehouse' => 'Warehouse',
            'retail' => 'Retail',
            'commercial' => 'Commercial',
        ];
    }

    /**
     * Size unit options.
     */
    public static function getSizeUnitOptions(): array
    {
        return [
            'square_meters' => 'Square Meters (m²)',
            'square_feet' => 'Square Feet (ft²)',
        ];
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

        $unit = $this->size_unit === 'square_meters' ? 'm²' : 'ft²';
        return number_format($this->size, 0) . ' ' . $unit;
    }

    /**
     * Get secure image URL for property owner.
     */
    public function getSecureImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        return route('properties.image', ['property' => $this->id]);
    }

    /**
     * Get temporary signed URL for sharing.
     */
    public function getSignedImageUrl(?int $expiresInMinutes = 60): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        return \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'properties.image.signed',
            now()->addMinutes($expiresInMinutes),
            ['property' => $this->id]
        );
    }

    /**
     * Scope for active properties.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
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
}
