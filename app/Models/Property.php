<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Property extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = ['latitude', 'longitude'];
    protected $appends = ['cover_image_url', 'photo_gallery'];

    protected $fillable = [
        'title',
        'description',
        'address',
        'city',
        'postal_code',
        'country',
        'occupancy_status',
        'rent_amount',
        'security_deposit',
        'available_from',
        'lease_term_months',
        'property_type',
        'bedrooms',
        'bathrooms',
        'square_meters',
        'floor_number',
        'total_floors',
        'year_built',
        'furnished',
        'pets_allowed',
        'smoking_allowed',
        'indoor_parking_spots',
        'outdoor_parking_spots',
        'heating_type',
        'energy_class',
        'virtual_tour_url',
        'is_visible',
        'is_active',
        'is_invite_only',
        'access_code',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'rent_amount' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'available_from' => 'date',
        'photo_gallery' => 'array',
        'furnished' => 'boolean',
        'pets_allowed' => 'boolean',
        'smoking_allowed' => 'boolean',
        'is_visible' => 'boolean',
        'is_active' => 'boolean',
        'is_invite_only' => 'boolean',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')
            ->singleFile();

        $this->addMediaCollection('gallery');
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('cover') ?: null;
    }

    public function getPhotoGalleryAttribute(): array
    {
        return $this->getMedia('gallery')->map(function ($media) {
            return $media->getUrl();
        })->toArray();
    }
}
