<?php

namespace App\Enums;

enum PropertyType: string
{
    case HOUSE = 'house';
    case DETACHED_HOUSE = 'detached_house';
    case SEMI_DETACHED_HOUSE = 'semi_detached_house';
    case APARTMENT = 'apartment';
    case STUDIO = 'studio';
    case PENTHOUSE = 'penthouse';
    case DUPLEX = 'duplex';
    case TRIPLEX = 'triplex';
    case LOFT = 'loft';
    case GARAGE = 'garage';
    case OFFICE = 'office';

    public function label(): string
    {
        return match ($this) {
            self::HOUSE => 'House',
            self::DETACHED_HOUSE => 'Detached House',
            self::SEMI_DETACHED_HOUSE => 'Semi-detached House',
            self::APARTMENT => 'Apartment',
            self::STUDIO => 'Studio',
            self::PENTHOUSE => 'Penthouse',
            self::DUPLEX => 'Duplex',
            self::TRIPLEX => 'Triplex',
            self::LOFT => 'Loft',
            self::GARAGE => 'Garage',
            self::OFFICE => 'Office',
            default => ucfirst($this->value),
        };
    }
}
