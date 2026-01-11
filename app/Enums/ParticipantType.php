<?php

namespace App\Enums;

enum ParticipantType: string
{
    case Lead = 'lead';
    case Tenant = 'tenant';

    public function label(): string
    {
        return match ($this) {
            self::Lead => 'Lead',
            self::Tenant => 'Tenant',
        };
    }
}
