<?php

namespace App\Enums;

enum Relationship: string
{
    case Spouse = 'spouse';
    case Partner = 'partner';
    case Parent = 'parent';
    case Sibling = 'sibling';
    case Child = 'child';
    case Friend = 'friend';
    case Employer = 'employer';
    case Colleague = 'colleague';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Spouse => 'Spouse',
            self::Partner => 'Partner',
            self::Parent => 'Parent',
            self::Sibling => 'Sibling',
            self::Child => 'Child',
            self::Friend => 'Friend',
            self::Employer => 'Employer',
            self::Colleague => 'Colleague',
            self::Other => 'Other',
        };
    }

    /**
     * Get all relationships as options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $relationship) => ['value' => $relationship->value, 'label' => $relationship->label()],
            self::cases()
        );
    }
}
