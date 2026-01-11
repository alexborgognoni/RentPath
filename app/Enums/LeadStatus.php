<?php

namespace App\Enums;

enum LeadStatus: string
{
    case Invited = 'invited';
    case Viewed = 'viewed';
    case Applied = 'applied';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Invited => 'Invited',
            self::Viewed => 'Viewed',
            self::Applied => 'Applied',
            self::Archived => 'Archived',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Invited => 'blue',
            self::Viewed => 'yellow',
            self::Applied => 'green',
            self::Archived => 'gray',
        };
    }

    /**
     * Get all statuses as options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $status) => ['value' => $status->value, 'label' => $status->label()],
            self::cases()
        );
    }
}
