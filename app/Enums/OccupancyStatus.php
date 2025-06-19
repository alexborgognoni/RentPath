<?php

namespace App\Enums;

enum OccupancyStatus: string
{
    case OCCUPIED = 'occupied';
    case VACANT = 'vacant';
    case UNDER_MAINTENANCE = 'under_maintenance';

    public function label(): string
    {
        return match ($this) {
            self::OCCUPIED => 'Occupied',
            self::VACANT => 'Vacant',
            self::UNDER_MAINTENANCE => 'Under Maintenance',
            default => ucfirst($this->value),
        };
    }
}
