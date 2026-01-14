<?php

namespace App\Data\Application;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Consent and declaration data for an application.
 */
#[TypeScript]
class ConsentData extends Data
{
    public function __construct(
        #[Nullable]
        public ?Carbon $declaration_accuracy_at,

        #[Nullable]
        public ?Carbon $consent_screening_at,

        #[Nullable]
        public ?Carbon $consent_data_processing_at,

        #[Nullable]
        public ?Carbon $consent_reference_contact_at,

        #[Nullable]
        public ?Carbon $consent_data_sharing_at,

        #[Nullable]
        public ?Carbon $consent_marketing_at,

        #[Nullable, StringType, Max(500)]
        public ?string $digital_signature,

        #[Nullable, StringType, Max(45)]
        public ?string $signature_ip_address,
    ) {}

    /**
     * Check if all required consents are given.
     */
    public function hasRequiredConsents(): bool
    {
        return $this->declaration_accuracy_at !== null
            && $this->consent_screening_at !== null
            && $this->consent_data_processing_at !== null;
    }

    /**
     * Check if signature is present.
     */
    public function isSigned(): bool
    {
        return $this->digital_signature !== null;
    }
}
