<?php

namespace App\Enums;

enum PropertyStatus: string
{
    case Draft = 'draft';
    case Vacant = 'vacant';
    case Occupied = 'occupied';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Vacant => 'Vacant',
            self::Occupied => 'Occupied',
            self::Archived => 'Archived',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Vacant => 'green',
            self::Occupied => 'blue',
            self::Archived => 'red',
        };
    }
}
