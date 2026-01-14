<?php

namespace App\Data\PropertyManager;

use App\Data\Shared\DocumentData;
use App\Data\Shared\PhoneData;
use App\Data\User\UserData;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Url;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PropertyManagerData extends Data
{
    public function __construct(
        public ?int $id,

        public ?int $user_id,

        #[Required, In(['individual', 'professional'])]
        public string $type,

        #[Nullable, StringType, Max(255)]
        public ?string $company_name,

        #[Nullable, StringType, Url, Max(255)]
        public ?string $company_website,

        #[Nullable, StringType, Max(100)]
        public ?string $license_number,

        #[Nullable]
        public ?PhoneData $phone,

        #[Nullable]
        public ?DocumentData $profile_picture,

        #[Nullable]
        public ?DocumentData $id_document,

        #[Nullable]
        public ?DocumentData $license_document,

        #[Nullable]
        public ?Carbon $profile_verified_at,

        #[Nullable]
        public ?Carbon $created_at,

        #[Nullable]
        public ?Carbon $updated_at,

        /** Related user data */
        #[Nullable]
        public ?UserData $user,
    ) {}

    /**
     * Check if this is a professional property manager.
     */
    public function isProfessional(): bool
    {
        return $this->type === 'professional';
    }

    /**
     * Check if profile is verified.
     */
    public function isVerified(): bool
    {
        return $this->profile_verified_at !== null;
    }
}
