<?php

namespace App\Enums;

enum EmploymentStatus: string
{
    case Employed = 'employed';
    case SelfEmployed = 'self_employed';
    case Student = 'student';
    case Unemployed = 'unemployed';
    case Retired = 'retired';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Employed => 'Employed',
            self::SelfEmployed => 'Self Employed',
            self::Student => 'Student',
            self::Unemployed => 'Unemployed',
            self::Retired => 'Retired',
            self::Other => 'Other',
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
