<?php

namespace App\Enums;

enum ImmigrationStatus: string
{
    case Citizen = 'citizen';
    case PermanentResident = 'permanent_resident';
    case VisaHolder = 'visa_holder';
    case Refugee = 'refugee';
    case AsylumSeeker = 'asylum_seeker';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Citizen => 'Citizen',
            self::PermanentResident => 'Permanent Resident',
            self::VisaHolder => 'Visa Holder',
            self::Refugee => 'Refugee',
            self::AsylumSeeker => 'Asylum Seeker',
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
