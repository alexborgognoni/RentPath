<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Full name accessor.
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Relation to property manager profile.
     */
    public function propertyManager(): HasOne
    {
        return $this->hasOne(PropertyManager::class);
    }

    /**
     * Relation to tenant profile.
     */
    public function tenantProfile(): HasOne
    {
        return $this->hasOne(TenantProfile::class);
    }

    /**
     * Relation to properties owned by the user through property manager.
     */
    public function properties(): HasManyThrough
    {
        return $this->hasManyThrough(Property::class, PropertyManager::class);
    }

    /**
     * Relation to applications submitted by the user through tenant profile.
     */
    public function applications(): HasManyThrough
    {
        return $this->hasManyThrough(Application::class, TenantProfile::class);
    }
}
