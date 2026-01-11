<?php

namespace App\Http\Requests\Traits;

use App\Models\Application;
use App\Rules\ValidCountryCode;
use App\Rules\ValidPhoneNumber;
use App\Rules\ValidPostalCode;

/**
 * Shared validation rules for Application wizard steps.
 *
 * Provides centralized validation rules matching the frontend schemas.
 * Each step FormRequest uses this trait for consistency.
 */
trait ApplicationValidationRules
{
    protected ?Application $application = null;

    /**
     * Set the application context for validation.
     */
    public function setApplication(Application $application): static
    {
        $this->application = $application;

        return $this;
    }

    /**
     * Get the tenant profile for document existence checks.
     */
    protected function getTenantProfile(): ?\App\Models\TenantProfile
    {
        return $this->application?->tenantProfile ?? auth()->user()?->tenantProfile;
    }

    /**
     * Countries that require state/province field.
     */
    protected function countriesRequiringState(): array
    {
        return ['US', 'CA', 'AU', 'BR', 'MX', 'IN'];
    }

    /**
     * Supported currencies.
     */
    protected function currencies(): array
    {
        return ['eur', 'usd', 'gbp', 'chf'];
    }

    /**
     * Employment status options.
     */
    protected function employmentStatuses(): array
    {
        return ['employed', 'self_employed', 'student', 'unemployed', 'retired'];
    }

    /**
     * Living situation options.
     */
    protected function livingSituations(): array
    {
        return ['renting', 'owner', 'living_with_family', 'student_housing', 'employer_provided', 'other'];
    }

    /**
     * Relationship options for occupants/references.
     */
    protected function relationships(): array
    {
        return ['spouse', 'partner', 'parent', 'sibling', 'child', 'friend', 'employer', 'other'];
    }

    /**
     * ID document types.
     */
    protected function idDocumentTypes(): array
    {
        return ['passport', 'national_id', 'drivers_license'];
    }

    /**
     * Immigration status options.
     */
    protected function immigrationStatuses(): array
    {
        return ['citizen', 'permanent_resident', 'visa_holder', 'refugee', 'asylum_seeker', 'other'];
    }

    /**
     * Reason for moving options.
     */
    protected function reasonsForMoving(): array
    {
        return [
            'relocation_work', 'relocation_personal', 'upsizing', 'downsizing',
            'end_of_lease', 'buying_property', 'relationship_change',
            'closer_to_family', 'better_location', 'cost', 'first_time_renter', 'other',
        ];
    }

    /**
     * File validation rule for documents.
     */
    protected function fileRule(bool $required = false): string
    {
        $base = 'file|mimes:pdf,jpeg,png,jpg|max:20480';

        return $required ? "required|{$base}" : "nullable|{$base}";
    }

    /**
     * Check if a document already exists in the tenant profile.
     */
    protected function hasExistingDocument(string $field): bool
    {
        $profile = $this->getTenantProfile();
        $pathField = str_replace('profile_', '', $field).'_path';

        return $profile && ! empty($profile->$pathField);
    }

    /**
     * Get phone validation rules.
     */
    protected function phoneRules(string $countryCodeField, bool $required = true): array
    {
        $requiredRule = $required ? 'required' : 'nullable';

        return [
            $requiredRule,
            'string',
            'max:20',
            new ValidPhoneNumber($countryCodeField),
        ];
    }

    /**
     * Get country code validation rules.
     */
    protected function countryCodeRules(bool $required = true): array
    {
        $requiredRule = $required ? 'required' : 'nullable';

        return [$requiredRule, 'string', 'max:2', new ValidCountryCode];
    }

    /**
     * Get postal code validation rules.
     */
    protected function postalCodeRules(string $countryField, bool $required = true): array
    {
        $requiredRule = $required ? 'required' : 'nullable';

        return [$requiredRule, 'string', 'max:20', new ValidPostalCode($countryField)];
    }
}
