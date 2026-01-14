<?php

namespace App\Enums;

enum Currency: string
{
    case Eur = 'eur';
    case Usd = 'usd';
    case Gbp = 'gbp';
    case Chf = 'chf';

    public function label(): string
    {
        return match ($this) {
            self::Eur => 'EUR',
            self::Usd => 'USD',
            self::Gbp => 'GBP',
            self::Chf => 'CHF',
        };
    }

    public function symbol(): string
    {
        return match ($this) {
            self::Eur => '€',
            self::Usd => '$',
            self::Gbp => '£',
            self::Chf => 'CHF',
        };
    }

    /**
     * Get all currencies as options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $currency) => ['value' => $currency->value, 'label' => $currency->label()],
            self::cases()
        );
    }
}
