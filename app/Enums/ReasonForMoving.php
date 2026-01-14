<?php

namespace App\Enums;

enum ReasonForMoving: string
{
    case RelocationWork = 'relocation_work';
    case RelocationPersonal = 'relocation_personal';
    case Upsizing = 'upsizing';
    case Downsizing = 'downsizing';
    case EndOfLease = 'end_of_lease';
    case BuyingProperty = 'buying_property';
    case RelationshipChange = 'relationship_change';
    case CloserToFamily = 'closer_to_family';
    case BetterLocation = 'better_location';
    case Cost = 'cost';
    case FirstTimeRenter = 'first_time_renter';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::RelocationWork => 'Relocation for Work',
            self::RelocationPersonal => 'Personal Relocation',
            self::Upsizing => 'Upsizing',
            self::Downsizing => 'Downsizing',
            self::EndOfLease => 'End of Lease',
            self::BuyingProperty => 'Buying Property',
            self::RelationshipChange => 'Relationship Change',
            self::CloserToFamily => 'Closer to Family',
            self::BetterLocation => 'Better Location',
            self::Cost => 'Cost',
            self::FirstTimeRenter => 'First Time Renter',
            self::Other => 'Other',
        };
    }

    /**
     * Get all reasons as options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $reason) => ['value' => $reason->value, 'label' => $reason->label()],
            self::cases()
        );
    }
}
