<?php

namespace App\Enums;

enum HeatingType: string
{
    case CENTRAL = 'central';
    case DISTRICT = 'district';
    case ELECTRIC = 'electric';
    case GAS = 'gas';
    case HEAT_PUMP = 'heat_pump';
    case NONE = 'none';
    case OIL = 'oil';
    case RADIANT_FLOOR = 'radiant_floor';
    case SOLAR = 'solar';
    case WOOD_PELLET = 'wood_pellet';

    public function label(): string
    {
        return match ($this) {
            self::CENTRAL => 'Central Heating',
            self::DISTRICT => 'District Heating',
            self::HEAT_PUMP => 'Heat Pump',
            self::NONE => 'No Heating',
            self::RADIANT_FLOOR => 'Radiant Floor',
            self::WOOD_PELLET => 'Wood/Pellet Stove',
            default => ucfirst($this->value),
        };
    }
}
