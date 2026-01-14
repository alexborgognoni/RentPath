<?php

namespace App\Services;

use App\Helpers\StorageHelper;
use App\Http\Requests\Application\Steps\AdditionalStepRequest;
use App\Http\Requests\Application\Steps\ConsentStepRequest;
use App\Http\Requests\Application\Steps\FinancialStepRequest;
use App\Http\Requests\Application\Steps\HistoryStepRequest;
use App\Http\Requests\Application\Steps\HouseholdStepRequest;
use App\Http\Requests\Application\Steps\IdentityStepRequest;
use App\Http\Requests\Application\Steps\SupportStepRequest;
use App\Models\Application;
use App\Models\Lead;
use App\Models\Property;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

/**
 * Application wizard service.
 *
 * Handles all application wizard logic: drafts, validation, submission.
 * Single source of truth for application business logic.
 */
class ApplicationService
{
    /**
     * Step IDs in order. Step 8 (review) has no validation.
     */
    private const STEPS = [
        1 => 'identity',
        2 => 'household',
        3 => 'financial',
        4 => 'support',
        5 => 'history',
        6 => 'additional',
        7 => 'consent',
    ];

    /**
     * Step request class mapping.
     */
    private const STEP_REQUESTS = [
        1 => IdentityStepRequest::class,
        2 => HouseholdStepRequest::class,
        3 => FinancialStepRequest::class,
        4 => SupportStepRequest::class,
        5 => HistoryStepRequest::class,
        6 => AdditionalStepRequest::class,
        7 => ConsentStepRequest::class,
    ];

    /**
     * Get or create a draft application.
     */
    public function getOrCreateDraft(TenantProfile $tenantProfile, Property $property): Application
    {
        return Application::firstOrCreate(
            [
                'tenant_profile_id' => $tenantProfile->id,
                'property_id' => $property->id,
                'status' => 'draft',
            ],
            [
                'current_step' => 1,
            ]
        );
    }

    /**
     * Check if user has existing non-draft application.
     */
    public function hasExistingApplication(TenantProfile $tenantProfile, Property $property): bool
    {
        return Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->whereNotIn('status', ['draft', 'withdrawn', 'archived', 'deleted'])
            ->exists();
    }

    /**
     * Save draft and calculate max valid step.
     */
    public function saveDraft(Application $application, array $data, int $requestedStep): array
    {
        $tenantProfile = $application->tenantProfile;

        // Sync profile data
        $this->syncProfileData($tenantProfile, $data);
        $tenantProfile->refresh();

        // Calculate max valid step
        $validationData = $this->buildValidationData($tenantProfile, $data);
        $maxValidStep = $this->calculateMaxValidStep($validationData, $requestedStep, $application);

        // Filter to application-only fields
        $applicationData = $this->filterApplicationFields($data);
        $applicationData['current_step'] = $maxValidStep;

        $application->update($applicationData);

        return [
            'maxValidStep' => $maxValidStep,
            'savedAt' => now()->toIso8601String(),
        ];
    }

    /**
     * Submit application with full validation.
     */
    public function submit(Application $application, array $validatedData, TenantProfile $tenantProfile): Application
    {
        // Sync profile data
        $this->syncProfileData($tenantProfile, $validatedData);
        $tenantProfile->refresh();

        // Handle file uploads
        $validatedData = $this->handleFileUploads($validatedData);

        // Remove profile fields (saved to TenantProfile, not Application)
        $applicationData = $this->filterApplicationFields($validatedData);

        // Snapshot profile data at submission time
        $applicationData = array_merge($applicationData, $this->snapshotProfileData($tenantProfile));

        // Update application
        $applicationData['status'] = 'submitted';
        $applicationData['submitted_at'] = now();

        $application->update($applicationData);

        // Auto-verify profile if ready
        $this->autoVerifyProfileIfReady($tenantProfile);

        return $application;
    }

    /**
     * Calculate the maximum valid step.
     */
    public function calculateMaxValidStep(array $data, int $requestedStep, Application $application): int
    {
        $validatedMaxStep = 0;

        for ($step = 1; $step <= min($requestedStep, 7); $step++) {
            $errors = $this->validateStep($step, $data, $application);

            if ($errors !== null) {
                break;
            }

            $validatedMaxStep = $step;
        }

        return $validatedMaxStep;
    }

    /**
     * Validate a specific step.
     *
     * @return array|null Errors array or null if valid
     */
    public function validateStep(int $step, array $data, Application $application): ?array
    {
        if (! isset(self::STEP_REQUESTS[$step])) {
            return null; // Review step has no validation
        }

        $requestClass = self::STEP_REQUESTS[$step];

        // Create instance directly (don't use app() as it binds to current HTTP request)
        $request = new $requestClass;

        // Inject data
        $request->merge($data);

        if (method_exists($request, 'setApplication')) {
            $request->setApplication($application);
        }

        $validator = Validator::make($data, $request->rules(), $request->messages());

        if ($validator->fails()) {
            return $validator->errors()->toArray();
        }

        return null;
    }

    /**
     * Find the first invalid step.
     */
    public function findFirstInvalidStep(array $data, Application $application): ?int
    {
        for ($step = 1; $step <= 7; $step++) {
            $errors = $this->validateStep($step, $data, $application);
            if ($errors !== null) {
                return $step;
            }
        }

        return null; // All steps valid
    }

    /**
     * Revalidate draft and update current_step.
     */
    public function revalidateDraft(Application $draft): Application
    {
        $tenantProfile = $draft->tenantProfile;
        $data = $this->buildValidationData($tenantProfile, $draft->toArray());

        $firstInvalidStep = $this->findFirstInvalidStep($data, $draft);

        // Go to first invalid step, or review (8) if all valid
        $targetStep = $firstInvalidStep ?? 8;

        if ($targetStep !== $draft->current_step) {
            $draft->update(['current_step' => $targetStep]);
            $draft->refresh();
        }

        return $draft;
    }

    /**
     * Sync wizard data to tenant profile.
     */
    public function syncProfileData(TenantProfile $profile, array $data): void
    {
        $profileFields = [
            'date_of_birth', 'middle_name', 'nationality', 'phone_country_code', 'phone_number', 'bio',
            'id_document_type', 'id_number', 'id_issuing_country', 'id_expiry_date',
            'immigration_status', 'immigration_status_other', 'visa_type', 'visa_type_other', 'visa_expiry_date',
            'right_to_rent_share_code',
            'current_house_number', 'current_address_line_2', 'current_street_name', 'current_city',
            'current_state_province', 'current_postal_code', 'current_country',
            'employment_status', 'employer_name', 'job_title', 'employment_type', 'employment_start_date',
            'monthly_income', 'income_currency', 'gross_annual_income', 'net_monthly_income',
            'business_name', 'business_type', 'business_start_date', 'gross_annual_revenue',
            'university_name', 'program_of_study', 'expected_graduation_date', 'student_income_source',
            'student_income_source_type', 'student_income_source_other', 'student_monthly_income',
            'pension_type', 'pension_monthly_income', 'pension_provider', 'retirement_other_income',
            'receiving_unemployment_benefits', 'unemployment_benefits_amount', 'unemployed_income_source', 'unemployed_income_source_other',
            'other_employment_situation', 'other_employment_situation_details', 'expected_return_to_work',
            'other_situation_monthly_income', 'other_situation_income_source',
            // History step fields (Credit & Rental History)
            'authorize_credit_check', 'authorize_background_check', 'credit_check_provider_preference',
            'has_ccjs_or_bankruptcies', 'ccj_bankruptcy_details', 'has_eviction_history', 'eviction_details',
            'current_living_situation', 'current_address_move_in_date',
            'current_monthly_rent', 'current_rent_currency',
            'current_landlord_name', 'current_landlord_contact',
            'reason_for_moving', 'reason_for_moving_other',
            'previous_addresses', 'landlord_references', 'other_references',
        ];

        $booleanFields = [
            'authorize_credit_check', 'authorize_background_check',
            'has_ccjs_or_bankruptcies', 'has_eviction_history',
        ];

        $profileData = [];
        foreach ($data as $key => $value) {
            $fieldName = str_starts_with($key, 'profile_') ? substr($key, 8) : $key;
            if (in_array($fieldName, $profileFields)) {
                if (in_array($fieldName, $booleanFields)) {
                    $profileData[$fieldName] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                } else {
                    $profileData[$fieldName] = $value === '' ? null : $value;
                }
            }
        }

        if (! empty($profileData)) {
            $profile->update($profileData);
        }
    }

    /**
     * Build validation data from profile + request.
     */
    public function buildValidationData(TenantProfile $profile, array $requestData): array
    {
        return array_merge($this->mapProfileToValidationData($profile), $requestData);
    }

    /**
     * Map TenantProfile to profile_* fields for validation.
     */
    public function mapProfileToValidationData(TenantProfile $profile): array
    {
        $data = [];
        $fields = [
            'date_of_birth', 'middle_name', 'nationality', 'phone_country_code', 'phone_number', 'bio',
            'id_document_type', 'id_number', 'id_issuing_country', 'id_expiry_date',
            'immigration_status', 'immigration_status_other', 'visa_type', 'visa_type_other', 'visa_expiry_date',
            'right_to_rent_share_code',
            'current_house_number', 'current_address_line_2', 'current_street_name', 'current_city',
            'current_state_province', 'current_postal_code', 'current_country',
            'employment_status', 'employer_name', 'job_title', 'employment_type', 'employment_start_date',
            'monthly_income', 'income_currency', 'gross_annual_income', 'net_monthly_income',
            'business_name', 'business_type', 'business_start_date', 'gross_annual_revenue',
            'university_name', 'program_of_study', 'expected_graduation_date', 'student_income_source',
            'student_income_source_type', 'student_income_source_other', 'student_monthly_income',
            'pension_type', 'pension_monthly_income', 'pension_provider', 'retirement_other_income',
            'receiving_unemployment_benefits', 'unemployment_benefits_amount', 'unemployed_income_source', 'unemployed_income_source_other',
            'other_employment_situation', 'other_employment_situation_details', 'expected_return_to_work',
            'other_situation_monthly_income', 'other_situation_income_source',
            // Document paths
            'id_document_front_path', 'id_document_back_path', 'residence_permit_document_path',
            'right_to_rent_document_path', 'employment_contract_path', 'payslip_1_path',
            'payslip_2_path', 'payslip_3_path', 'student_proof_path', 'pension_statement_path',
            'benefits_statement_path', 'other_income_proof_path',
            // History step fields (Credit & Rental History)
            'authorize_credit_check', 'authorize_background_check', 'credit_check_provider_preference',
            'has_ccjs_or_bankruptcies', 'ccj_bankruptcy_details', 'has_eviction_history', 'eviction_details',
            'current_living_situation', 'current_address_move_in_date',
            'current_monthly_rent', 'current_rent_currency',
            'current_landlord_name', 'current_landlord_contact',
            'reason_for_moving', 'reason_for_moving_other',
            'previous_addresses', 'landlord_references', 'other_references',
        ];

        foreach ($fields as $field) {
            $data['profile_'.$field] = $profile->$field;
        }

        return $data;
    }

    /**
     * Filter to application-only fields (exclude profile_ fields).
     */
    private function filterApplicationFields(array $data): array
    {
        // Note: History step fields (credit check, rental history, references) now go to TenantProfile
        $applicationFields = [
            'desired_move_in_date', 'lease_duration_months', 'is_flexible_on_move_in', 'is_flexible_on_duration',
            'message_to_landlord', 'additional_occupants', 'occupants_details', 'has_pets', 'pets_details',
            'interested_in_rent_insurance', 'existing_insurance_provider', 'existing_insurance_policy_number',
            'co_signers', 'guarantors',
            'emergency_contact_first_name', 'emergency_contact_last_name', 'emergency_contact_relationship',
            'emergency_contact_relationship_other', 'emergency_contact_phone_country_code',
            'emergency_contact_phone_number', 'emergency_contact_email',
            'additional_information', 'additional_documents',
            'declaration_accuracy', 'consent_screening', 'consent_data_processing',
            'consent_reference_contact', 'consent_data_sharing', 'consent_marketing', 'digital_signature',
            'invited_via_token', 'current_step', 'status',
        ];

        return array_filter(
            $data,
            fn ($key) => in_array($key, $applicationFields),
            ARRAY_FILTER_USE_KEY
        );
    }

    /**
     * Handle file uploads for application documents.
     */
    private function handleFileUploads(array $data): array
    {
        $fileFields = [
            'application_id_document' => 'applications/id-documents',
            'application_proof_of_income' => 'applications/proof-of-income',
            'application_reference_letter' => 'applications/reference-letters',
        ];

        foreach ($fileFields as $field => $path) {
            if (isset($data[$field]) && $data[$field] instanceof \Illuminate\Http\UploadedFile) {
                $file = $data[$field];
                $data[$field.'_path'] = StorageHelper::store($file, $path, 'private');
                $data[$field.'_original_name'] = $file->getClientOriginalName();
                unset($data[$field]);
            }
        }

        // Handle additional documents array
        if (isset($data['additional_documents']) && is_array($data['additional_documents'])) {
            $additionalDocs = [];
            foreach ($data['additional_documents'] as $index => $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $additionalDocs[] = [
                        'path' => StorageHelper::store($file, 'applications/additional-documents', 'private'),
                        'original_name' => $file->getClientOriginalName(),
                        'type' => $file->getClientMimeType(),
                    ];
                }
            }
            $data['additional_documents'] = $additionalDocs;
        }

        return $data;
    }

    /**
     * Snapshot profile data at submission time.
     */
    private function snapshotProfileData(TenantProfile $profile): array
    {
        return [
            'snapshot_first_name' => $profile->user->first_name ?? null,
            'snapshot_last_name' => $profile->user->last_name ?? null,
            'snapshot_email' => $profile->user->email ?? null,
            'snapshot_phone' => $profile->phone_number,
            'snapshot_date_of_birth' => $profile->date_of_birth,
            'snapshot_nationality' => $profile->nationality,
            'snapshot_employment_status' => $profile->employment_status,
            'snapshot_employer_name' => $profile->employer_name,
            'snapshot_job_title' => $profile->job_title,
            'snapshot_monthly_income' => $profile->monthly_income ?? $profile->net_monthly_income,
        ];
    }

    /**
     * Auto-verify profile if minimum required data is present.
     */
    private function autoVerifyProfileIfReady(TenantProfile $profile): void
    {
        // Check minimum requirements
        $hasBasicInfo = $profile->date_of_birth && $profile->nationality && $profile->phone_number;
        $hasIdDocument = $profile->id_document_front_path && $profile->id_document_back_path;
        $hasEmployment = $profile->employment_status;

        if ($hasBasicInfo && $hasIdDocument && $hasEmployment && ! $profile->verified_at) {
            $profile->update(['verified_at' => now()]);
        }
    }

    /**
     * Update lead status when draft is saved.
     */
    public function updateLeadOnDraft(User $user, Property $property): void
    {
        Lead::where('property_id', $property->id)
            ->where('email', $user->email)
            ->whereIn('status', ['invited', 'new'])
            ->update(['status' => 'drafting']);
    }

    /**
     * Update lead status when application is submitted.
     */
    public function updateLeadOnSubmit(User $user, Property $property, Application $application): void
    {
        Lead::where('property_id', $property->id)
            ->where('email', $user->email)
            ->update([
                'status' => 'applied',
                'application_id' => $application->id,
            ]);
    }
}
