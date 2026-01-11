<?php

namespace App\Enums;

enum LeadSource: string
{
    case Manual = 'manual';
    case Invite = 'invite';
    case Website = 'website';

    public function label(): string
    {
        return match ($this) {
            self::Manual => 'Manual Entry',
            self::Invite => 'Email Invite',
            self::Website => 'Website',
        };
    }

    /**
     * Get all sources as options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $source) => ['value' => $source->value, 'label' => $source->label()],
            self::cases()
        );
    }
}
