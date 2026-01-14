<?php

namespace App\Enums;

enum IdDocumentType: string
{
    case Passport = 'passport';
    case NationalId = 'national_id';
    case DriversLicense = 'drivers_license';

    public function label(): string
    {
        return match ($this) {
            self::Passport => 'Passport',
            self::NationalId => 'National ID',
            self::DriversLicense => "Driver's License",
        };
    }

    /**
     * Get all types as options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $type) => ['value' => $type->value, 'label' => $type->label()],
            self::cases()
        );
    }
}
