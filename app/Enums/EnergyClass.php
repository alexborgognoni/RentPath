<?php

namespace App\Enums;

enum EnergyClass: string
{
    // Standard EU Energy Classes (A-G)
    case A_PLUS    = 'a_plus';         // A+ (Highest efficiency)
    case A         = 'a';
    case B         = 'b';
    case C         = 'c';
    case D         = 'd';
    case E         = 'e';
    case F         = 'f';
    case G         = 'g';              // G (Lowest efficiency)

        // Additional Common Classes
    case A_PLUS_PLUS = 'a_plus_plus';  // A++ (Premium efficiency)
    case H         = 'h';              // Below G (Non-compliant)
    case I         = 'i';              // Rare, worst rating
    case EXEMPT    = 'exempt';         // Not rated (e.g., historic buildings)
    case PENDING   = 'pending';        // Assessment in progress
    case UNKNOWN   = 'unknown';        // Data missing

    public function label(): string
    {
        return match ($this) {
            self::A_PLUS       => 'A+',
            self::A_PLUS_PLUS  => 'A++',
            self::EXEMPT       => 'Exempt',
            self::PENDING     => 'Pending Assessment',
            self::UNKNOWN      => 'Unknown',
            default           => strtoupper($this->value),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::A_PLUS_PLUS => 'bg-emerald-100 text-emerald-800',
            self::A_PLUS      => 'bg-green-100 text-green-800',
            self::A           => 'bg-lime-100 text-lime-800',
            self::B           => 'bg-teal-100 text-teal-800',
            self::C           => 'bg-cyan-100 text-cyan-800',
            self::D           => 'bg-blue-100 text-blue-800',
            self::E           => 'bg-amber-100 text-amber-800',
            self::F           => 'bg-orange-100 text-orange-800',
            self::G, self::H   => 'bg-red-100 text-red-800',
            default           => 'bg-gray-100 text-gray-800',
        };
    }
}
