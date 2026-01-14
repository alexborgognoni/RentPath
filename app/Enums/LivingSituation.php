<?php

namespace App\Enums;

enum LivingSituation: string
{
    case Renting = 'renting';
    case Owner = 'owner';
    case LivingWithFamily = 'living_with_family';
    case StudentHousing = 'student_housing';
    case EmployerProvided = 'employer_provided';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Renting => 'Renting',
            self::Owner => 'Owner',
            self::LivingWithFamily => 'Living with Family',
            self::StudentHousing => 'Student Housing',
            self::EmployerProvided => 'Employer Provided',
            self::Other => 'Other',
        };
    }

    /**
     * Get all situations as options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $situation) => ['value' => $situation->value, 'label' => $situation->label()],
            self::cases()
        );
    }
}
