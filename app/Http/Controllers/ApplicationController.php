<?php

namespace App\Http\Controllers;

use App\Helpers\StorageHelper;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use App\Models\ApplicationCoSigner;
use App\Models\ApplicationGuarantor;
use App\Models\Lead;
use App\Models\Property;
use App\Models\TenantReference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the tenant's applications.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $tenantProfile = $user->tenantProfile;

        if (! $tenantProfile) {
            return Inertia::render('tenant/applications', [
                'applications' => [],
                'filters' => ['status' => 'all', 'search' => ''],
            ]);
        }

        $query = Application::where('tenant_profile_id', $tenantProfile->id)
            ->with(['property.images'])
            ->whereNotIn('status', ['deleted']);

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by property
        if ($request->filled('search')) {
            $query->whereHas('property', function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhere('street_name', 'like', '%'.$request->search.'%')
                    ->orWhere('city', 'like', '%'.$request->search.'%');
            });
        }

        $applications = $query->latest()->get()
            ->map(function ($application) {
                $applicationArray = $application->toArray();

                // Add property image URLs
                if ($application->property && $application->property->images) {
                    $applicationArray['property']['images'] = $application->property->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_url' => StorageHelper::url($image->image_path, 'private', 1440),
                            'image_path' => $image->image_path,
                            'is_main' => $image->is_main,
                            'sort_order' => $image->sort_order,
                        ];
                    })->sortBy('sort_order')->values()->toArray();
                }

                return $applicationArray;
            });

        return Inertia::render('tenant/applications', [
            'applications' => $applications,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Show the application creation form for a specific property.
     */
    public function create(Property $property)
    {
        $user = Auth::user();

        // Auto-create tenant profile if it doesn't exist
        $tenantProfile = $user->tenantProfile;
        if (! $tenantProfile) {
            $tenantProfile = $user->tenantProfile()->create([]);
        }

        // Check if already applied (excluding drafts - those can continue)
        $existingApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->whereNotIn('status', ['draft', 'withdrawn', 'archived', 'deleted'])
            ->first();

        if ($existingApplication) {
            return redirect()->route('applications.show', ['application' => $existingApplication->id])
                ->with('message', 'You already have an application for this property');
        }

        // Load existing draft if it exists (with co-signers and guarantors for document paths)
        $draftApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->with(['coSigners', 'guarantors'])
            ->first();

        // Re-validate max step based on current profile data
        // This handles the edge case where profile changes in another application
        // might invalidate steps that were previously valid
        if ($draftApplication) {
            $draftApplication = $this->revalidateDraftMaxStep($draftApplication, $tenantProfile);
        }

        // Check if property is accepting applications
        if (! $property->accepting_applications) {
            return redirect()->route('tenant.properties.show', ['property' => $property->id])
                ->with('error', 'This property is not accepting applications at this time');
        }

        return Inertia::render('tenant/application-create', [
            'property' => $property->load('images', 'mainImage', 'propertyManager'),
            'tenantProfile' => $tenantProfile,
            'draftApplication' => $draftApplication,
            'token' => request()->query('token'), // Pass token if accessing via invite
        ]);
    }

    /**
     * Re-validate draft application max step based on current profile data.
     *
     * This handles the edge case where profile data changed in another application,
     * potentially invalidating steps that were previously valid.
     *
     * Sets current_step to the first invalid step (so user can fix it),
     * or to the review step (6) if all content steps are valid.
     */
    private function revalidateDraftMaxStep(Application $draft, $tenantProfile): Application
    {
        // Build validation data from current profile + draft
        $validationData = array_merge(
            $this->mapProfileToValidationData($tenantProfile),
            $draft->only([
                'desired_move_in_date',
                'lease_duration_months',
                'message_to_landlord',
                'additional_occupants',
                'occupants_details',
                'pets_details',
                'references',
                'previous_landlord_name',
                'previous_landlord_phone',
                'previous_landlord_email',
                'emergency_contact_name',
                'emergency_contact_phone',
                'emergency_contact_relationship',
            ])
        );

        // Find the first invalid step (steps 1-5 are content, step 6 is review)
        $firstInvalidStep = null;
        for ($step = 1; $step <= 5; $step++) {
            $stepValidation = $this->getStepValidationRules($step, $validationData);

            if (! empty($stepValidation)) {
                $validator = \Validator::make($validationData, $stepValidation);
                if ($validator->fails()) {
                    $firstInvalidStep = $step;
                    break;
                }
            }
        }

        // If all steps valid, go to review (step 6); otherwise go to first invalid step
        $targetStep = $firstInvalidStep ?? 6;

        // Update if changed
        if ($targetStep !== $draft->current_step) {
            $draft->update(['current_step' => $targetStep]);
            $draft->refresh();
        }

        return $draft;
    }

    /**
     * Store a new application.
     */
    public function store(StoreApplicationRequest $request, Property $property)
    {
        $user = Auth::user();

        // Auto-create tenant profile if it doesn't exist
        $tenantProfile = $user->tenantProfile;
        if (! $tenantProfile) {
            $tenantProfile = $user->tenantProfile()->create([]);
        }

        // Check for existing application
        $existingApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->whereNotIn('status', ['draft', 'withdrawn', 'archived', 'deleted'])
            ->first();

        if ($existingApplication) {
            return redirect()->route('applications.show', ['application' => $existingApplication->id])
                ->with('error', 'You already have an application for this property');
        }

        // Check for draft application (we'll update it instead of creating new)
        $draftApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->first();

        // Validation is handled by StoreApplicationRequest with conditional rules
        $validated = $request->validated();

        // Sync profile data (save profile fields to TenantProfile for reuse)
        $this->syncProfileDataFromWizard($request, $tenantProfile);

        // Refresh the tenant profile to get updated data for snapshot
        $tenantProfile->refresh();

        // Handle file uploads for application-specific documents
        if ($request->hasFile('application_id_document')) {
            $validated['application_id_document_path'] = StorageHelper::store(
                $request->file('application_id_document'),
                'applications/id-documents',
                'private'
            );
            $validated['application_id_document_original_name'] = $request->file('application_id_document')->getClientOriginalName();
        }

        if ($request->hasFile('application_proof_of_income')) {
            $validated['application_proof_of_income_path'] = StorageHelper::store(
                $request->file('application_proof_of_income'),
                'applications/proof-of-income',
                'private'
            );
            $validated['application_proof_of_income_original_name'] = $request->file('application_proof_of_income')->getClientOriginalName();
        }

        if ($request->hasFile('application_reference_letter')) {
            $validated['application_reference_letter_path'] = StorageHelper::store(
                $request->file('application_reference_letter'),
                'applications/reference-letters',
                'private'
            );
            $validated['application_reference_letter_original_name'] = $request->file('application_reference_letter')->getClientOriginalName();
        }

        // Handle additional documents
        if ($request->hasFile('additional_documents')) {
            $additionalDocs = [];
            foreach ($request->file('additional_documents') as $index => $file) {
                $path = StorageHelper::store($file, 'applications/additional-documents', 'private');
                $additionalDocs[] = [
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'type' => $file->getClientMimeType(),
                    'description' => $request->input("additional_documents_description.{$index}", ''),
                ];
            }
            $validated['additional_documents'] = $additionalDocs;
        }

        // Remove file fields from validated data
        unset(
            $validated['application_id_document'],
            $validated['application_proof_of_income'],
            $validated['application_reference_letter']
        );

        // Remove profile fields from validated data (they're saved to TenantProfile, not Application)
        $profileFieldPrefixes = ['profile_'];
        foreach (array_keys($validated) as $key) {
            foreach ($profileFieldPrefixes as $prefix) {
                if (str_starts_with($key, $prefix)) {
                    unset($validated[$key]);
                    break;
                }
            }
        }

        // Snapshot profile data at submission time (for audit trail)
        $validated = array_merge($validated, $this->snapshotProfileData($tenantProfile));

        // Update draft or create new application
        $validated['property_id'] = $property->id;
        $validated['tenant_profile_id'] = $tenantProfile->id;
        $validated['status'] = 'submitted';
        $validated['submitted_at'] = now();

        if ($draftApplication) {
            $draftApplication->update($validated);
            $application = $draftApplication;
        } else {
            $application = Application::create($validated);
        }

        // Auto-verify profile if minimum required data is present
        $this->autoVerifyProfileIfReady($tenantProfile);

        // Sync application data (references, emergency contact, pets, occupants) back to profile
        $this->syncApplicationToProfile($application, $tenantProfile);

        // Update lead status to 'applied' if exists
        $this->updateLeadOnApplicationSubmit($user, $property, $application);

        // TODO: Send email notifications to property manager and tenant
        // Note: Property funnel stage is now derived from applications, no need to update property status

        return redirect()->route('applications.show', ['application' => $application->id])
            ->with('success', 'Application submitted successfully!');
    }

    /**
     * Save application as draft (for step-by-step form).
     *
     * Note: Profile fields are autosaved directly to TenantProfile via /tenant-profile/autosave.
     * Draft only stores application-specific fields (move-in date, occupants, pets, references, etc.).
     * On final submission, profile data is snapshotted from the current TenantProfile.
     */
    public function saveDraft(Request $request, Property $property)
    {
        $user = Auth::user();

        // Auto-create tenant profile if it doesn't exist
        $tenantProfile = $user->tenantProfile;
        if (! $tenantProfile) {
            $tenantProfile = $user->tenantProfile()->create([]);
        }

        // Check if draft already exists for this user and property
        $application = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->first();

        $requestedStep = $request->input('current_step', 1);

        $allData = $request->all();

        // Save profile fields to TenantProfile (ensures data is persisted even if autosave hasn't run)
        // Note: Emergency contact fields are now application-specific, NOT stored in profile
        // Only include fields that actually exist in tenant_profiles table
        $profileFields = [
            'date_of_birth', 'middle_name', 'nationality', 'phone_country_code', 'phone_number', 'bio',
            'id_document_type', 'id_number', 'id_issuing_country', 'id_expiry_date',
            'immigration_status', 'immigration_status_other', 'visa_type', 'visa_type_other', 'visa_expiry_date',
            'right_to_rent_share_code',
            'current_house_number', 'current_address_line_2', 'current_street_name', 'current_city',
            'current_state_province', 'current_postal_code', 'current_country',
            'employment_status', 'employer_name', 'job_title', 'employment_type', 'employment_start_date',
            'monthly_income', 'income_currency',
            'university_name', 'program_of_study', 'expected_graduation_date', 'student_income_source',
            'has_guarantor', 'guarantor_first_name', 'guarantor_last_name', 'guarantor_relationship',
            'guarantor_phone_country_code', 'guarantor_phone_number',
            'guarantor_email', 'guarantor_street_name', 'guarantor_house_number', 'guarantor_address_line_2',
            'guarantor_city', 'guarantor_state_province', 'guarantor_postal_code', 'guarantor_country',
            'guarantor_employment_status', 'guarantor_employer_name', 'guarantor_job_title',
            'guarantor_monthly_income', 'guarantor_income_currency',
        ];

        $profileData = [];
        foreach ($allData as $key => $value) {
            // Handle profile_ prefix from wizard form fields
            $fieldName = str_starts_with($key, 'profile_') ? substr($key, 8) : $key;
            if (in_array($fieldName, $profileFields)) {
                // Handle boolean conversion for has_guarantor
                if ($fieldName === 'has_guarantor') {
                    $profileData[$fieldName] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                } else {
                    $profileData[$fieldName] = $value === '' ? null : $value;
                }
            }
        }

        if (! empty($profileData)) {
            $tenantProfile->update($profileData);
            $tenantProfile->refresh();
        }

        // Only save application-specific fields to draft (not profile fields)
        $applicationFields = [
            // Rental Intent
            'desired_move_in_date',
            'lease_duration_months',
            'is_flexible_on_move_in',
            'is_flexible_on_duration',
            'message_to_landlord',
            // Occupants
            'additional_occupants',
            'occupants_details',
            // Pets
            'pets_details',
            // Credit Check & History
            'authorize_credit_check',
            'authorize_background_check',
            'credit_check_provider_preference',
            'has_ccjs_or_bankruptcies',
            'ccj_bankruptcy_details',
            'has_eviction_history',
            'eviction_details',
            'self_reported_credit_score',
            // Current Address (matching AddressForm structure)
            'current_living_situation',
            'current_address_street_name',
            'current_address_house_number',
            'current_address_address_line_2',
            'current_address_city',
            'current_address_state_province',
            'current_address_postal_code',
            'current_address_country',
            'current_address_move_in_date',
            'current_monthly_rent',
            'current_rent_currency',
            'current_landlord_name',
            'current_landlord_contact',
            'reason_for_moving',
            'reason_for_moving_other',
            // Previous Addresses
            'previous_addresses',
            // Rent Insurance
            'interested_in_rent_insurance',
            'existing_insurance_provider',
            'existing_insurance_policy_number',
            // References
            'references',
            'previous_landlord_name',
            'previous_landlord_phone',
            'previous_landlord_email',
            // Emergency Contact (application-specific, split fields)
            'emergency_contact_first_name',
            'emergency_contact_last_name',
            'emergency_contact_relationship',
            'emergency_contact_relationship_other',
            'emergency_contact_phone_country_code',
            'emergency_contact_phone_number',
            'emergency_contact_email',
            // Additional Info & Consent
            'additional_information',
            // Legacy fields (for backwards compatibility during migration)
            'emergency_contact_name',
            'emergency_contact_phone',
            'invited_via_token',
        ];

        $data = [];
        foreach ($applicationFields as $field) {
            if (array_key_exists($field, $allData)) {
                $data[$field] = $allData[$field];
            }
        }

        $data['tenant_profile_id'] = $tenantProfile->id;
        $data['property_id'] = $property->id;
        $data['status'] = 'draft';

        // Validate to determine actual allowed max step
        // Note: Validation still uses profile fields from the request to check step validity,
        // but profile data comes from TenantProfile (already autosaved) for actual validation
        $validatedMaxStep = 0;

        // Merge current profile data with request for validation
        $validationData = array_merge($this->mapProfileToValidationData($tenantProfile), $allData);

        // Check all steps up to the requested step
        for ($step = 1; $step <= $requestedStep; $step++) {
            $stepValidation = $this->getStepValidationRules($step, $validationData);

            if (! empty($stepValidation)) {
                // Create a validator instance to check without throwing
                $validator = \Validator::make($validationData, $stepValidation);

                if ($validator->fails()) {
                    // This step is invalid - can't progress beyond here
                    // But we still save the data
                    break;
                }
            }

            // This step is valid
            $validatedMaxStep = $step;
        }

        // The actual current_step is the max validated step
        $data['current_step'] = $validatedMaxStep;

        if ($application) {
            $application->update($data);
        } else {
            $application = Application::create($data);
        }

        // Refresh to get updated values
        $application->refresh();

        // Sync co-signers and guarantors to their respective tables
        $this->syncCoSignersFromRequest($application, $allData['co_signers'] ?? []);
        $this->syncGuarantorsFromRequest($application, $allData['guarantors'] ?? []);

        // Update lead status to 'drafting' if exists
        $this->updateLeadOnDraft($user, $property);

        // Return back - Inertia will reload the page and get updated draftApplication from create()
        return back(303);
    }

    /**
     * Map TenantProfile data to profile_* fields for validation.
     */
    private function mapProfileToValidationData($tenantProfile): array
    {
        return [
            // Personal Info
            'profile_date_of_birth' => $tenantProfile->date_of_birth,
            'profile_middle_name' => $tenantProfile->middle_name,
            'profile_nationality' => $tenantProfile->nationality,
            'profile_phone_country_code' => $tenantProfile->phone_country_code,
            'profile_phone_number' => $tenantProfile->phone_number,
            'profile_bio' => $tenantProfile->bio,
            // ID Document
            'profile_id_document_type' => $tenantProfile->id_document_type,
            'profile_id_number' => $tenantProfile->id_number,
            'profile_id_issuing_country' => $tenantProfile->id_issuing_country,
            'profile_id_expiry_date' => $tenantProfile->id_expiry_date,
            // Immigration Status
            'profile_immigration_status' => $tenantProfile->immigration_status,
            'profile_immigration_status_other' => $tenantProfile->immigration_status_other,
            'profile_visa_type' => $tenantProfile->visa_type,
            'profile_visa_type_other' => $tenantProfile->visa_type_other,
            'profile_visa_expiry_date' => $tenantProfile->visa_expiry_date,
            // Right to Rent
            'profile_right_to_rent_share_code' => $tenantProfile->right_to_rent_share_code,
            // Document paths (for validation)
            'profile_id_document_front_path' => $tenantProfile->id_document_front_path,
            'profile_id_document_back_path' => $tenantProfile->id_document_back_path,
            'profile_residence_permit_document_path' => $tenantProfile->residence_permit_document_path,
            'profile_right_to_rent_document_path' => $tenantProfile->right_to_rent_document_path,
            // Current Address
            'profile_current_house_number' => $tenantProfile->current_house_number,
            'profile_current_address_line_2' => $tenantProfile->current_address_line_2,
            'profile_current_street_name' => $tenantProfile->current_street_name,
            'profile_current_city' => $tenantProfile->current_city,
            'profile_current_state_province' => $tenantProfile->current_state_province,
            'profile_current_postal_code' => $tenantProfile->current_postal_code,
            'profile_current_country' => $tenantProfile->current_country,
            // Employment (Employed)
            'profile_employment_status' => $tenantProfile->employment_status,
            'profile_employer_name' => $tenantProfile->employer_name,
            'profile_job_title' => $tenantProfile->job_title,
            'profile_employment_type' => $tenantProfile->employment_type,
            'profile_employment_start_date' => $tenantProfile->employment_start_date,
            'profile_gross_annual_income' => $tenantProfile->gross_annual_income,
            'profile_net_monthly_income' => $tenantProfile->net_monthly_income,
            'profile_monthly_income' => $tenantProfile->monthly_income, // Deprecated
            'profile_income_currency' => $tenantProfile->income_currency,
            // Self-Employed
            'profile_business_name' => $tenantProfile->business_name,
            'profile_business_type' => $tenantProfile->business_type,
            'profile_business_start_date' => $tenantProfile->business_start_date,
            'profile_gross_annual_revenue' => $tenantProfile->gross_annual_revenue,
            // Student
            'profile_university_name' => $tenantProfile->university_name,
            'profile_program_of_study' => $tenantProfile->program_of_study,
            'profile_expected_graduation_date' => $tenantProfile->expected_graduation_date,
            'profile_student_income_source' => $tenantProfile->student_income_source,
            'profile_student_income_source_type' => $tenantProfile->student_income_source_type,
            'profile_student_income_source_other' => $tenantProfile->student_income_source_other,
            'profile_student_monthly_income' => $tenantProfile->student_monthly_income,
            // Retired
            'profile_pension_monthly_income' => $tenantProfile->pension_monthly_income,
            'profile_pension_provider' => $tenantProfile->pension_provider,
            'profile_retirement_other_income' => $tenantProfile->retirement_other_income,
            // Unemployed
            'profile_receiving_unemployment_benefits' => $tenantProfile->receiving_unemployment_benefits,
            'profile_unemployment_benefits_amount' => $tenantProfile->unemployment_benefits_amount,
            'profile_unemployed_income_source' => $tenantProfile->unemployed_income_source,
            'profile_unemployed_income_source_other' => $tenantProfile->unemployed_income_source_other,
            // Other Employment Situation
            'profile_other_employment_situation' => $tenantProfile->other_employment_situation,
            'profile_other_employment_situation_details' => $tenantProfile->other_employment_situation_details,
            'profile_expected_return_to_work' => $tenantProfile->expected_return_to_work,
            'profile_other_situation_monthly_income' => $tenantProfile->other_situation_monthly_income,
            'profile_other_situation_income_source' => $tenantProfile->other_situation_income_source,
            // Guarantor
            'profile_has_guarantor' => $tenantProfile->has_guarantor,
            'profile_guarantor_first_name' => $tenantProfile->guarantor_first_name,
            'profile_guarantor_last_name' => $tenantProfile->guarantor_last_name,
            'profile_guarantor_relationship' => $tenantProfile->guarantor_relationship,
            'profile_guarantor_phone_country_code' => $tenantProfile->guarantor_phone_country_code,
            'profile_guarantor_phone_number' => $tenantProfile->guarantor_phone_number,
            'profile_guarantor_email' => $tenantProfile->guarantor_email,
            'profile_guarantor_monthly_income' => $tenantProfile->guarantor_monthly_income,
            // Document paths for guarantor
            'profile_employment_contract_path' => $tenantProfile->employment_contract_path,
            'profile_payslip_1_path' => $tenantProfile->payslip_1_path,
            'profile_payslip_2_path' => $tenantProfile->payslip_2_path,
            'profile_payslip_3_path' => $tenantProfile->payslip_3_path,
            'profile_student_proof_path' => $tenantProfile->student_proof_path,
            'profile_pension_statement_path' => $tenantProfile->pension_statement_path,
            'profile_benefits_statement_path' => $tenantProfile->benefits_statement_path,
            'profile_other_income_proof_path' => $tenantProfile->other_income_proof_path,
        ];
    }

    /**
     * Get validation rules for a specific step.
     * 8-step structure:
     * 1: Identity & Legal Eligibility
     * 2: Household Composition
     * 3: Financial Capability
     * 4: Risk Mitigation (optional)
     * 5: Credit & Rental History
     * 6: Additional Information (optional)
     * 7: Declarations & Consent
     * 8: Review
     */
    private function getStepValidationRules(int $step, array $data): array
    {
        switch ($step) {
            case 1:
                // Step 1: Identity & Legal Eligibility
                $rules = [
                    'profile_date_of_birth' => 'required|date|before:-18 years',
                    'profile_nationality' => 'required|string|max:100',
                    'profile_phone_country_code' => 'required|string|max:10',
                    'profile_phone_number' => 'required|string|max:20',
                    // ID Document
                    'profile_id_document_type' => 'required|in:passport,national_id,drivers_license',
                    'profile_id_number' => 'required|string|max:100',
                    'profile_id_issuing_country' => 'required|string|max:2',
                    'profile_id_expiry_date' => 'required|date|after:today',
                    // Immigration Status
                    'profile_immigration_status' => 'required|string',
                ];

                // Require ID documents unless already uploaded
                if (empty($data['profile_id_document_front_path'])) {
                    $rules['profile_id_document_front'] = 'required';
                }
                if (empty($data['profile_id_document_back_path'])) {
                    $rules['profile_id_document_back'] = 'required';
                }

                // Immigration status conditional validation
                $immigrationStatus = $data['profile_immigration_status'] ?? '';
                if ($immigrationStatus === 'other') {
                    $rules['profile_immigration_status_other'] = 'required|string|max:100';
                }

                // Statuses that require permit details
                $requiresPermitDetails = in_array($immigrationStatus, [
                    'temporary_resident', 'visa_holder', 'student', 'work_permit',
                    'family_reunification', 'refugee_or_protected',
                ]);
                if ($requiresPermitDetails) {
                    $rules['profile_visa_type'] = 'required|string|max:100';
                    $rules['profile_visa_expiry_date'] = 'required|date|after:today';

                    // Residence permit document required for visa_holder
                    if ($immigrationStatus === 'visa_holder' && empty($data['profile_residence_permit_document_path'])) {
                        $rules['profile_residence_permit_document'] = 'required';
                    }
                }

                return $rules;

            case 2:
                // Step 2: Household Composition
                $rules = [
                    'desired_move_in_date' => 'required|date|after:today',
                    'lease_duration_months' => 'required|integer|min:1|max:60',
                    'message_to_landlord' => 'nullable|string|max:2000',
                ];

                // Validate occupant details (if any occupants provided, validate them)
                $occupants = $data['occupants_details'] ?? [];
                if (is_array($occupants) && count($occupants) > 0) {
                    $rules['occupants_details.*.first_name'] = 'required|string|max:100';
                    $rules['occupants_details.*.last_name'] = 'required|string|max:100';
                    $rules['occupants_details.*.date_of_birth'] = 'required|date';
                    $rules['occupants_details.*.relationship'] = 'required|string|max:100';
                    // Require relationship_other when relationship is 'other'
                    foreach ($occupants as $index => $occupant) {
                        if (($occupant['relationship'] ?? '') === 'other') {
                            $rules["occupants_details.{$index}.relationship_other"] = 'required|string|max:100';
                        }
                    }
                }

                // Validate pet details (if any pets provided, validate them)
                $pets = $data['pets_details'] ?? [];
                if (is_array($pets) && count($pets) > 0) {
                    $rules['pets_details.*.type'] = 'required|string|max:100';
                    // Require type_other when type is 'other'
                    foreach ($pets as $index => $pet) {
                        if (($pet['type'] ?? '') === 'other') {
                            $rules["pets_details.{$index}.type_other"] = 'required|string|max:100';
                        }
                    }
                }

                // Emergency contact: if first name OR last name is filled, all fields become required (except email)
                $ecFirstName = $data['emergency_contact_first_name'] ?? '';
                $ecLastName = $data['emergency_contact_last_name'] ?? '';
                $ecRelationship = $data['emergency_contact_relationship'] ?? '';

                $hasEmergencyContactName = trim($ecFirstName) || trim($ecLastName);

                if ($hasEmergencyContactName) {
                    $rules['emergency_contact_first_name'] = 'required|string|max:100';
                    $rules['emergency_contact_last_name'] = 'required|string|max:100';
                    $rules['emergency_contact_relationship'] = 'required|string|max:100';
                    $rules['emergency_contact_phone_number'] = 'required|string|max:20';
                    // Email stays optional

                    // If relationship is 'other', require specification
                    if ($ecRelationship === 'other') {
                        $rules['emergency_contact_relationship_other'] = 'required|string|max:100';
                    }
                }

                return $rules;

            case 3:
                // Step 3: Financial Capability
                $rules = [
                    'profile_employment_status' => 'required|in:employed,self_employed,student,unemployed,retired,other',
                ];

                $status = $data['profile_employment_status'] ?? '';

                // EMPLOYED
                if ($status === 'employed') {
                    $rules['profile_employer_name'] = 'required|string|max:255';
                    $rules['profile_job_title'] = 'required|string|max:255';
                    $rules['profile_employment_type'] = 'required|in:full_time,part_time,contract,temporary';
                    $rules['profile_employment_start_date'] = 'required|date';
                    $rules['profile_gross_annual_income'] = 'required|numeric|min:0';
                    $rules['profile_net_monthly_income'] = 'required|numeric|min:0';
                }

                // SELF-EMPLOYED
                if ($status === 'self_employed') {
                    $rules['profile_business_name'] = 'required|string|max:255';
                    $rules['profile_business_type'] = 'required|string|max:100';
                    $rules['profile_business_start_date'] = 'required|date';
                    $rules['profile_gross_annual_revenue'] = 'required|numeric|min:0';
                    $rules['profile_net_monthly_income'] = 'required|numeric|min:0';
                }

                // STUDENT
                if ($status === 'student') {
                    $rules['profile_university_name'] = 'required|string|max:255';
                    $rules['profile_program_of_study'] = 'required|string|max:255';
                    $rules['profile_student_income_source_type'] = 'required|in:scholarship,stipend,part_time_job,parental_support,student_loan,savings,other';
                    $rules['profile_student_monthly_income'] = 'required|numeric|min:0';

                    // If income source is 'other', require specification
                    $incomeSource = $data['profile_student_income_source_type'] ?? '';
                    if ($incomeSource === 'other') {
                        $rules['profile_student_income_source_other'] = 'required|string|max:200';
                    }
                }

                // RETIRED
                if ($status === 'retired') {
                    $rules['profile_pension_type'] = 'required|in:state_pension,employer_pension,private_pension,annuity,other';
                    $rules['profile_pension_monthly_income'] = 'required|numeric|min:0';
                    // retirement_other_income is optional
                }

                // UNEMPLOYED
                if ($status === 'unemployed') {
                    $rules['profile_unemployed_income_source'] = 'required|in:unemployment_benefits,severance_pay,savings,family_support,rental_income,investment_income,alimony,social_assistance,disability_allowance,freelance_gig,other';

                    // If income source is 'other', require specification
                    $incomeSource = $data['profile_unemployed_income_source'] ?? '';
                    if ($incomeSource === 'other') {
                        $rules['profile_unemployed_income_source_other'] = 'required|string|max:200';
                    }

                    // Always require income amount when income source is selected
                    if (! empty($incomeSource)) {
                        $rules['profile_unemployment_benefits_amount'] = 'required|numeric|min:0';

                        // If income source is unemployment_benefits, require benefits statement
                        if ($incomeSource === 'unemployment_benefits' && empty($data['profile_benefits_statement_path'])) {
                            $rules['profile_benefits_statement'] = 'required';
                        }

                        // If income source is NOT unemployment_benefits, require other income proof
                        if ($incomeSource !== 'unemployment_benefits' && empty($data['profile_other_income_proof_path'])) {
                            $rules['profile_other_income_proof'] = 'required';
                        }
                    }
                }

                // OTHER
                if ($status === 'other') {
                    $rules['profile_other_employment_situation'] = 'required|in:parental_leave,disability,sabbatical,career_break,medical_leave,caregiver,homemaker,volunteer,gap_year,early_retirement,military_service,other';
                    $rules['profile_other_situation_monthly_income'] = 'required|numeric|min:0';
                    $rules['profile_other_situation_income_source'] = 'required|string|max:200';

                    $situation = $data['profile_other_employment_situation'] ?? '';
                    if ($situation === 'other') {
                        $rules['profile_other_employment_situation_details'] = 'required|string|max:200';
                    }
                }

                return $rules;

            case 4:
                // Step 4: Financial Support (co-signers, guarantors, insurance)
                $rules = [
                    'interested_in_rent_insurance' => 'required|in:yes,no,already_have',
                ];

                // If already has insurance, provider is required
                $insuranceStatus = $data['interested_in_rent_insurance'] ?? '';
                if ($insuranceStatus === 'already_have') {
                    $rules['existing_insurance_provider'] = 'required|string|max:200';
                }

                // Validate co-signers if any provided
                $coSigners = $data['co_signers'] ?? [];
                if (is_array($coSigners) && count($coSigners) > 0) {
                    foreach ($coSigners as $index => $coSigner) {
                        $prefix = "co_signers.{$index}";

                        // === Identity ===
                        $rules["{$prefix}.first_name"] = 'required|string|max:100';
                        $rules["{$prefix}.last_name"] = 'required|string|max:100';
                        $rules["{$prefix}.email"] = 'required|email|max:255';
                        $rules["{$prefix}.phone_number"] = 'required|string|max:30';
                        $rules["{$prefix}.date_of_birth"] = 'required|date|before:-18 years';
                        $rules["{$prefix}.nationality"] = 'required|string|max:100';
                        $rules["{$prefix}.relationship"] = 'required|string|max:100';

                        if (($coSigner['relationship'] ?? '') === 'other') {
                            $rules["{$prefix}.relationship_other"] = 'required|string|max:100';
                        }

                        // === ID Document ===
                        $rules["{$prefix}.id_document_type"] = 'required|in:passport,national_id,drivers_license';
                        $rules["{$prefix}.id_number"] = 'required|string|max:100';
                        $rules["{$prefix}.id_issuing_country"] = 'required|string|max:2';
                        $rules["{$prefix}.id_expiry_date"] = 'required|date|after:today';

                        // ID documents required unless already uploaded
                        if (empty($coSigner['id_document_front_path'])) {
                            $rules["{$prefix}.id_document_front"] = 'required';
                        }
                        if (empty($coSigner['id_document_back_path'])) {
                            $rules["{$prefix}.id_document_back"] = 'required';
                        }

                        // === Address ===
                        $rules["{$prefix}.street_name"] = 'required|string|max:200';
                        $rules["{$prefix}.house_number"] = 'required|string|max:20';
                        $rules["{$prefix}.city"] = 'required|string|max:100';
                        $rules["{$prefix}.postal_code"] = 'required|string|max:20';
                        $rules["{$prefix}.country"] = 'required|string|max:2';

                        // === Employment-based validation ===
                        $rules["{$prefix}.employment_status"] = 'required|in:employed,self_employed,student,unemployed,retired,other';
                        $empStatus = $coSigner['employment_status'] ?? '';

                        if ($empStatus === 'employed') {
                            $rules["{$prefix}.employer_name"] = 'required|string|max:255';
                            $rules["{$prefix}.job_title"] = 'required|string|max:255';
                            $rules["{$prefix}.employment_type"] = 'required|in:full_time,part_time,contract,temporary';
                            $rules["{$prefix}.employment_start_date"] = 'required|date';
                            $rules["{$prefix}.net_monthly_income"] = 'required|numeric|min:0';
                            // Documents
                            if (empty($coSigner['employment_contract_path'])) {
                                $rules["{$prefix}.employment_contract"] = 'required';
                            }
                            if (empty($coSigner['payslip_1_path'])) {
                                $rules["{$prefix}.payslip_1"] = 'required';
                            }
                            if (empty($coSigner['payslip_2_path'])) {
                                $rules["{$prefix}.payslip_2"] = 'required';
                            }
                            if (empty($coSigner['payslip_3_path'])) {
                                $rules["{$prefix}.payslip_3"] = 'required';
                            }
                        }

                        if ($empStatus === 'self_employed') {
                            $rules["{$prefix}.net_monthly_income"] = 'required|numeric|min:0';
                            if (empty($coSigner['income_proof_path'])) {
                                $rules["{$prefix}.income_proof"] = 'required';
                            }
                        }

                        if ($empStatus === 'student') {
                            $rules["{$prefix}.university_name"] = 'required|string|max:255';
                            $rules["{$prefix}.student_income_source"] = 'required|string|max:100';
                            $rules["{$prefix}.student_monthly_income"] = 'required|numeric|min:0';
                            if (empty($coSigner['student_proof_path']) && empty($coSigner['enrollment_proof_path'])) {
                                $rules["{$prefix}.student_proof"] = 'required';
                            }
                        }

                        if ($empStatus === 'retired') {
                            $rules["{$prefix}.net_monthly_income"] = 'required|numeric|min:0';
                            if (empty($coSigner['pension_statement_path'])) {
                                $rules["{$prefix}.pension_statement"] = 'required';
                            }
                        }

                        if ($empStatus === 'unemployed') {
                            $rules["{$prefix}.income_source"] = 'required|string|max:200';
                            $rules["{$prefix}.net_monthly_income"] = 'required|numeric|min:0';
                            if (empty($coSigner['income_proof_path']) && empty($coSigner['benefits_statement_path'])) {
                                $rules["{$prefix}.income_proof"] = 'required';
                            }
                        }

                        if ($empStatus === 'other') {
                            $rules["{$prefix}.income_source"] = 'required|string|max:200';
                            $rules["{$prefix}.net_monthly_income"] = 'required|numeric|min:0';
                            if (empty($coSigner['income_proof_path'])) {
                                $rules["{$prefix}.income_proof"] = 'required';
                            }
                        }
                    }
                }

                // Validate guarantors if any provided
                $guarantors = $data['guarantors'] ?? [];
                if (is_array($guarantors) && count($guarantors) > 0) {
                    foreach ($guarantors as $index => $guarantor) {
                        $prefix = "guarantors.{$index}";

                        // === Identity ===
                        $rules["{$prefix}.first_name"] = 'required|string|max:100';
                        $rules["{$prefix}.last_name"] = 'required|string|max:100';
                        $rules["{$prefix}.email"] = 'required|email|max:255';
                        $rules["{$prefix}.phone_number"] = 'required|string|max:30';
                        $rules["{$prefix}.date_of_birth"] = 'required|date|before:-18 years';
                        $rules["{$prefix}.nationality"] = 'required|string|max:100';
                        $rules["{$prefix}.relationship"] = 'required|string|max:100';

                        if (($guarantor['relationship'] ?? '') === 'other') {
                            $rules["{$prefix}.relationship_other"] = 'required|string|max:100';
                        }

                        // === ID Document ===
                        $rules["{$prefix}.id_document_type"] = 'required|in:passport,national_id,drivers_license';
                        $rules["{$prefix}.id_number"] = 'required|string|max:100';
                        $rules["{$prefix}.id_issuing_country"] = 'required|string|max:2';
                        $rules["{$prefix}.id_expiry_date"] = 'required|date|after:today';

                        // ID documents required unless already uploaded
                        if (empty($guarantor['id_document_front_path'])) {
                            $rules["{$prefix}.id_document_front"] = 'required';
                        }
                        if (empty($guarantor['id_document_back_path'])) {
                            $rules["{$prefix}.id_document_back"] = 'required';
                        }

                        // === Address ===
                        $rules["{$prefix}.street_name"] = 'required|string|max:200';
                        $rules["{$prefix}.house_number"] = 'required|string|max:20';
                        $rules["{$prefix}.city"] = 'required|string|max:100';
                        $rules["{$prefix}.postal_code"] = 'required|string|max:20';
                        $rules["{$prefix}.country"] = 'required|string|max:2';

                        // === Employment (simpler for guarantors) ===
                        $rules["{$prefix}.employment_status"] = 'required|in:employed,self_employed,student,unemployed,retired,other';
                        $rules["{$prefix}.net_monthly_income"] = 'required|numeric|min:0';

                        // Proof of income required for guarantors
                        if (empty($guarantor['proof_of_income_path'])) {
                            $rules["{$prefix}.proof_of_income"] = 'required';
                        }
                    }
                }

                return $rules;

            case 5:
                // Step 5: Credit & Rental History
                return [];

            case 6:
                // Step 6: Additional Information (optional)
                return [];

            case 7:
                // Step 7: Declarations & Consent
                return [];

            case 8:
                // Step 8: Review (no validation needed)
                return [];

            default:
                return [];
        }
    }

    /**
     * Show a specific application.
     */
    public function show(Application $application)
    {
        $user = Auth::user();

        // Check authorization: must be the applicant (tenant portal is for tenants only)
        if ($application->tenantProfile->user_id !== $user->id) {
            abort(403, 'Unauthorized to view this application');
        }

        // If viewing a draft application, redirect to continue editing
        if ($application->status === 'draft') {
            return redirect()->route('applications.create', ['property' => $application->property_id])
                ->with('message', 'Continue filling out your application');
        }

        // Load relationships
        $application->load([
            'property.images',
            'property.propertyManager',
            'tenantProfile.user',
        ]);

        // Transform application data with property images and document URLs
        $applicationData = $this->transformApplicationWithUrls($application);

        return Inertia::render('tenant/application-view', [
            'application' => $applicationData,
        ]);
    }

    /**
     * Withdraw an application.
     */
    public function withdraw(Application $application)
    {
        $user = Auth::user();

        // Check authorization: must be the applicant
        if ($application->tenantProfile->user_id !== $user->id) {
            abort(403, 'Unauthorized to withdraw this application');
        }

        // Check if can be withdrawn
        if (! $application->canBeWithdrawn()) {
            return back()->with('error', 'This application cannot be withdrawn at this stage');
        }

        $application->withdraw();

        return redirect()->route('applications.index')
            ->with('success', 'Application withdrawn successfully');
    }

    /**
     * Update a draft application.
     */
    public function update(Request $request, Application $application)
    {
        $user = Auth::user();

        // Check authorization
        if ($application->tenantProfile->user_id !== $user->id) {
            abort(403, 'Unauthorized to update this application');
        }

        // Check if can be edited
        if (! $application->canBeEdited()) {
            return back()->with('error', 'Only draft applications can be edited');
        }

        // Same validation rules as store (could be extracted to a shared method)
        $rules = [
            'desired_move_in_date' => 'required|date|after:today',
            'lease_duration_months' => 'required|integer|min:1|max:60',
            'message_to_landlord' => 'nullable|string|max:2000',
            'additional_occupants' => 'required|integer|min:0|max:20',
            'occupants_details' => 'nullable|array',
            'pets_details' => 'nullable|array',
            'previous_landlord_name' => 'required|string|max:255',
            'previous_landlord_phone' => 'required|string|max:20',
            'previous_landlord_email' => 'required|email|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'references' => 'nullable|array',
        ];

        $validated = $request->validate($rules);

        // Handle file uploads (same as store)
        if ($request->hasFile('application_id_document')) {
            if ($application->application_id_document_path) {
                StorageHelper::delete($application->application_id_document_path, 'private');
            }
            $validated['application_id_document_path'] = StorageHelper::store(
                $request->file('application_id_document'),
                'applications/id-documents',
                'private'
            );
            $validated['application_id_document_original_name'] = $request->file('application_id_document')->getClientOriginalName();
        }

        if ($request->hasFile('application_proof_of_income')) {
            if ($application->application_proof_of_income_path) {
                StorageHelper::delete($application->application_proof_of_income_path, 'private');
            }
            $validated['application_proof_of_income_path'] = StorageHelper::store(
                $request->file('application_proof_of_income'),
                'applications/proof-of-income',
                'private'
            );
            $validated['application_proof_of_income_original_name'] = $request->file('application_proof_of_income')->getClientOriginalName();
        }

        if ($request->hasFile('application_reference_letter')) {
            if ($application->application_reference_letter_path) {
                StorageHelper::delete($application->application_reference_letter_path, 'private');
            }
            $validated['application_reference_letter_path'] = StorageHelper::store(
                $request->file('application_reference_letter'),
                'applications/reference-letters',
                'private'
            );
            $validated['application_reference_letter_original_name'] = $request->file('application_reference_letter')->getClientOriginalName();
        }

        $application->update($validated);

        return back()->with('success', 'Application updated successfully');
    }

    /**
     * Delete a draft application.
     */
    public function destroy(Application $application)
    {
        $user = Auth::user();

        // Check authorization
        if ($application->tenantProfile->user_id !== $user->id) {
            abort(403, 'Unauthorized to delete this application');
        }

        // Check if can be deleted
        if (! $application->isDraft()) {
            return back()->with('error', 'Only draft applications can be deleted');
        }

        // Delete uploaded files
        if ($application->application_id_document_path) {
            StorageHelper::delete($application->application_id_document_path, 'private');
        }
        if ($application->application_proof_of_income_path) {
            StorageHelper::delete($application->application_proof_of_income_path, 'private');
        }
        if ($application->application_reference_letter_path) {
            StorageHelper::delete($application->application_reference_letter_path, 'private');
        }

        $application->delete();

        return redirect()->route('applications.index')
            ->with('success', 'Draft application deleted');
    }

    /**
     * Sync profile data from wizard form to TenantProfile.
     * This saves the profile fields for reuse across applications.
     */
    private function syncProfileDataFromWizard(Request $request, $tenantProfile): void
    {
        $profileData = [
            // Personal Info
            'date_of_birth' => $request->input('profile_date_of_birth'),
            'nationality' => $request->input('profile_nationality'),
            'phone_country_code' => $request->input('profile_phone_country_code'),
            'phone_number' => $request->input('profile_phone_number'),
            'current_house_number' => $request->input('profile_current_house_number'),
            'current_address_line_2' => $request->input('profile_current_address_line_2'),
            'current_street_name' => $request->input('profile_current_street_name'),
            'current_city' => $request->input('profile_current_city'),
            'current_state_province' => $request->input('profile_current_state_province'),
            'current_postal_code' => $request->input('profile_current_postal_code'),
            'current_country' => $request->input('profile_current_country'),

            // Employment & Income (Employed)
            'employment_status' => $request->input('profile_employment_status'),
            'employer_name' => $request->input('profile_employer_name'),
            'job_title' => $request->input('profile_job_title'),
            'employment_type' => $request->input('profile_employment_type'),
            'employment_start_date' => $request->input('profile_employment_start_date'),
            'gross_annual_income' => $request->input('profile_gross_annual_income'),
            'net_monthly_income' => $request->input('profile_net_monthly_income'),
            'monthly_income' => $request->input('profile_net_monthly_income'), // Deprecated field, sync with net
            'income_currency' => $request->input('profile_income_currency'),

            // Self-Employed
            'business_name' => $request->input('profile_business_name'),
            'business_type' => $request->input('profile_business_type'),
            'business_start_date' => $request->input('profile_business_start_date'),
            'gross_annual_revenue' => $request->input('profile_gross_annual_revenue'),

            // Student Info
            'university_name' => $request->input('profile_university_name'),
            'program_of_study' => $request->input('profile_program_of_study'),
            'expected_graduation_date' => $request->input('profile_expected_graduation_date'),
            'student_income_source' => $request->input('profile_student_income_source'),
            'student_income_source_type' => $request->input('profile_student_income_source_type'),
            'student_income_source_other' => $request->input('profile_student_income_source_other'),
            'student_monthly_income' => $request->input('profile_student_monthly_income'),

            // Retired
            'pension_monthly_income' => $request->input('profile_pension_monthly_income'),
            'pension_provider' => $request->input('profile_pension_provider'),
            'retirement_other_income' => $request->input('profile_retirement_other_income'),

            // Unemployed
            'receiving_unemployment_benefits' => $request->boolean('profile_receiving_unemployment_benefits'),
            'unemployment_benefits_amount' => $request->input('profile_unemployment_benefits_amount'),
            'unemployed_income_source' => $request->input('profile_unemployed_income_source'),
            'unemployed_income_source_other' => $request->input('profile_unemployed_income_source_other'),

            // Other Employment Situation
            'other_employment_situation' => $request->input('profile_other_employment_situation'),
            'other_employment_situation_details' => $request->input('profile_other_employment_situation_details'),
            'expected_return_to_work' => $request->input('profile_expected_return_to_work'),
            'other_situation_monthly_income' => $request->input('profile_other_situation_monthly_income'),
            'other_situation_income_source' => $request->input('profile_other_situation_income_source'),

            // Guarantor
            'has_guarantor' => $request->boolean('profile_has_guarantor'),
            'guarantor_name' => $request->input('profile_guarantor_name'),
            'guarantor_relationship' => $request->input('profile_guarantor_relationship'),
            'guarantor_phone' => $request->input('profile_guarantor_phone'),
            'guarantor_email' => $request->input('profile_guarantor_email'),
            'guarantor_address' => $request->input('profile_guarantor_address'),
            'guarantor_employer' => $request->input('profile_guarantor_employer'),
            'guarantor_monthly_income' => $request->input('profile_guarantor_monthly_income'),
        ];

        // Handle profile document uploads
        // Note: With immediate uploads, documents are already uploaded to tenant profile
        // This fallback handles any files still sent on form submission (backwards compatibility)
        $documentFields = [
            'profile_id_document_front' => ['path' => 'id_document_front_path', 'name' => 'id_document_front_original_name', 'folder' => 'profiles/id-documents'],
            'profile_id_document_back' => ['path' => 'id_document_back_path', 'name' => 'id_document_back_original_name', 'folder' => 'profiles/id-documents'],
            'profile_employment_contract' => ['path' => 'employment_contract_path', 'name' => 'employment_contract_original_name', 'folder' => 'profiles/employment-contracts'],
            'profile_payslip_1' => ['path' => 'payslip_1_path', 'name' => 'payslip_1_original_name', 'folder' => 'profiles/payslips'],
            'profile_payslip_2' => ['path' => 'payslip_2_path', 'name' => 'payslip_2_original_name', 'folder' => 'profiles/payslips'],
            'profile_payslip_3' => ['path' => 'payslip_3_path', 'name' => 'payslip_3_original_name', 'folder' => 'profiles/payslips'],
            'profile_student_proof' => ['path' => 'student_proof_path', 'name' => 'student_proof_original_name', 'folder' => 'profiles/student-proofs'],
            'profile_pension_statement' => ['path' => 'pension_statement_path', 'name' => 'pension_statement_original_name', 'folder' => 'profiles/pension-statements'],
            'profile_benefits_statement' => ['path' => 'benefits_statement_path', 'name' => 'benefits_statement_original_name', 'folder' => 'profiles/benefits-statements'],
            'profile_other_income_proof' => ['path' => 'other_income_proof_path', 'name' => 'other_income_proof_original_name', 'folder' => 'profiles/other-income-proofs'],
            'profile_guarantor_id' => ['path' => 'guarantor_id_path', 'name' => 'guarantor_id_original_name', 'folder' => 'profiles/guarantor-ids'],
            'profile_guarantor_proof_income' => ['path' => 'guarantor_proof_income_path', 'name' => 'guarantor_proof_income_original_name', 'folder' => 'profiles/guarantor-income-proofs'],
        ];

        foreach ($documentFields as $formField => $dbFields) {
            if ($request->hasFile($formField)) {
                $file = $request->file($formField);
                $path = StorageHelper::store($file, $dbFields['folder'], 'private');
                $profileData[$dbFields['path']] = $path;
                $profileData[$dbFields['name']] = $file->getClientOriginalName();
            }
        }

        // Update the tenant profile with all collected data
        $tenantProfile->update($profileData);
    }

    /**
     * Snapshot profile data into application for audit trail.
     * This preserves the profile state at submission time.
     */
    private function snapshotProfileData($tenantProfile): array
    {
        return [
            // Personal info snapshot
            'snapshot_date_of_birth' => $tenantProfile->date_of_birth,
            'snapshot_nationality' => $tenantProfile->nationality,
            'snapshot_phone_country_code' => $tenantProfile->phone_country_code,
            'snapshot_phone_number' => $tenantProfile->phone_number,

            // Current address snapshot
            'snapshot_current_house_number' => $tenantProfile->current_house_number,
            'snapshot_current_address_line_2' => $tenantProfile->current_address_line_2,
            'snapshot_current_street_name' => $tenantProfile->current_street_name,
            'snapshot_current_city' => $tenantProfile->current_city,
            'snapshot_current_state_province' => $tenantProfile->current_state_province,
            'snapshot_current_postal_code' => $tenantProfile->current_postal_code,
            'snapshot_current_country' => $tenantProfile->current_country,

            // Employment snapshot
            'snapshot_employment_status' => $tenantProfile->employment_status,
            'snapshot_employer_name' => $tenantProfile->employer_name,
            'snapshot_job_title' => $tenantProfile->job_title,
            'snapshot_employment_start_date' => $tenantProfile->employment_start_date,
            'snapshot_employment_type' => $tenantProfile->employment_type,
            'snapshot_monthly_income' => $tenantProfile->monthly_income,
            'snapshot_income_currency' => $tenantProfile->income_currency,

            // Student snapshot
            'snapshot_university_name' => $tenantProfile->university_name,
            'snapshot_program_of_study' => $tenantProfile->program_of_study,
            'snapshot_expected_graduation_date' => $tenantProfile->expected_graduation_date,
            'snapshot_student_income_source' => $tenantProfile->student_income_source,

            // Guarantor snapshot
            'snapshot_has_guarantor' => $tenantProfile->has_guarantor,
            'snapshot_guarantor_name' => $tenantProfile->guarantor_name,
            'snapshot_guarantor_relationship' => $tenantProfile->guarantor_relationship,
            'snapshot_guarantor_phone' => $tenantProfile->guarantor_phone,
            'snapshot_guarantor_email' => $tenantProfile->guarantor_email,
            'snapshot_guarantor_address' => $tenantProfile->guarantor_address,
            'snapshot_guarantor_employer' => $tenantProfile->guarantor_employer,
            'snapshot_guarantor_monthly_income' => $tenantProfile->guarantor_monthly_income,

            // Document paths snapshot
            'snapshot_id_document_front_path' => $tenantProfile->id_document_front_path,
            'snapshot_id_document_back_path' => $tenantProfile->id_document_back_path,
            'snapshot_employment_contract_path' => $tenantProfile->employment_contract_path,
            'snapshot_payslip_1_path' => $tenantProfile->payslip_1_path,
            'snapshot_payslip_2_path' => $tenantProfile->payslip_2_path,
            'snapshot_payslip_3_path' => $tenantProfile->payslip_3_path,
            'snapshot_student_proof_path' => $tenantProfile->student_proof_path,
            'snapshot_other_income_proof_path' => $tenantProfile->other_income_proof_path,
            'snapshot_guarantor_id_path' => $tenantProfile->guarantor_id_path,
            'snapshot_guarantor_proof_income_path' => $tenantProfile->guarantor_proof_income_path,
        ];
    }

    /**
     * Auto-verify profile if minimum required data is present.
     * Called when an application is submitted.
     */
    private function autoVerifyProfileIfReady($tenantProfile): void
    {
        // Skip if already verified
        if ($tenantProfile->isVerified()) {
            return;
        }

        // Check minimum required data
        $hasRequiredData = $tenantProfile->date_of_birth
            && $tenantProfile->phone_number
            && $tenantProfile->employment_status
            && $tenantProfile->id_document_path
            && (
                // Employed: need employment docs
                ($tenantProfile->isEmployed() && $tenantProfile->employment_contract_path)
                // Student: need student proof
                || ($tenantProfile->isStudent() && $tenantProfile->student_proof_path)
                // Other statuses: ID is enough
                || in_array($tenantProfile->employment_status, ['unemployed', 'retired'])
            );

        if ($hasRequiredData) {
            $tenantProfile->update(['profile_verified_at' => now()]);
        }
    }

    /**
     * Sync application data back to TenantProfile after submission.
     * This saves references, emergency contact, pets, and occupants for reuse.
     */
    private function syncApplicationToProfile(Application $application, $tenantProfile): void
    {
        $profileUpdates = [];

        // Sync Emergency Contact
        if ($application->emergency_contact_name) {
            $profileUpdates['emergency_contact_name'] = $application->emergency_contact_name;
            $profileUpdates['emergency_contact_phone'] = $application->emergency_contact_phone;
            $profileUpdates['emergency_contact_relationship'] = $application->emergency_contact_relationship;
        }

        // Sync Pets
        if ($application->pets_details !== null) {
            $profileUpdates['pets_details'] = $application->pets_details;
            // Generate description from details
            if ($application->pets_details && is_array($application->pets_details)) {
                $descriptions = array_map(function ($pet) {
                    return trim(($pet['breed'] ?? '').' '.($pet['type'] ?? ''));
                }, $application->pets_details);
                $profileUpdates['pets_description'] = implode(', ', array_filter($descriptions));
            }
        }

        // Sync Occupants
        if ($application->additional_occupants !== null) {
            $profileUpdates['occupants_count'] = $application->additional_occupants + 1; // +1 for applicant
            $profileUpdates['occupants_details'] = $application->occupants_details;
        }

        // Apply profile updates
        if (! empty($profileUpdates)) {
            $tenantProfile->update($profileUpdates);
        }

        // Sync References to tenant_references table
        $this->syncReferencesToProfile($application, $tenantProfile);
    }

    /**
     * Sync references from application to tenant_references table.
     */
    private function syncReferencesToProfile(Application $application, $tenantProfile): void
    {
        $references = $application->snapshot_references ?? $application->references ?? [];

        // Also include previous_landlord if it exists (legacy support)
        if ($application->previous_landlord_name) {
            $landlordRef = [
                'type' => TenantReference::TYPE_LANDLORD,
                'name' => $application->previous_landlord_name,
                'phone' => $application->previous_landlord_phone,
                'email' => $application->previous_landlord_email,
                'relationship' => 'Previous Landlord',
            ];
            // Prepend landlord reference
            array_unshift($references, $landlordRef);
        }

        foreach ($references as $ref) {
            if (empty($ref['name'])) {
                continue;
            }

            $type = $ref['type'] ?? TenantReference::TYPE_PERSONAL;

            // Upsert: update if same type+email exists, otherwise create
            TenantReference::updateOrCreate(
                [
                    'tenant_profile_id' => $tenantProfile->id,
                    'type' => $type,
                    'email' => $ref['email'] ?? null,
                ],
                [
                    'name' => $ref['name'],
                    'phone' => $ref['phone'] ?? null,
                    'relationship' => $ref['relationship'] ?? null,
                    'years_known' => $ref['years_known'] ?? null,
                ]
            );
        }
    }

    /**
     * Sync co-signers from request data to application_co_signers table.
     * Handles both auto-generated (from occupants) and manually added co-signers.
     */
    private function syncCoSignersFromRequest(Application $application, array $coSigners): void
    {
        if (empty($coSigners)) {
            // Clear all co-signers if empty
            $application->coSigners()->delete();

            return;
        }

        // Get existing co-signer IDs for cleanup
        $existingIds = $application->coSigners()->pluck('id')->toArray();
        $processedIds = [];

        foreach ($coSigners as $index => $coSignerData) {
            if (empty($coSignerData['first_name']) && empty($coSignerData['last_name'])) {
                continue;
            }

            $fromOccupantIndex = $coSignerData['from_occupant_index'] ?? null;

            // For auto-generated co-signers, try to find existing record by from_occupant_index
            if ($fromOccupantIndex !== null) {
                $coSigner = $application->coSigners()
                    ->where('from_occupant_index', $fromOccupantIndex)
                    ->first();
            } else {
                // For manually added, use the index to track position
                $coSigner = null;
            }

            $data = [
                'application_id' => $application->id,
                'occupant_index' => $coSignerData['occupant_index'] ?? $index,
                'from_occupant_index' => $fromOccupantIndex,
                // Identity
                'first_name' => $coSignerData['first_name'] ?? null,
                'last_name' => $coSignerData['last_name'] ?? null,
                'email' => $coSignerData['email'] ?? null,
                'phone_country_code' => $coSignerData['phone_country_code'] ?? null,
                'phone_number' => $coSignerData['phone_number'] ?? null,
                'date_of_birth' => $coSignerData['date_of_birth'] ?? null,
                'nationality' => $coSignerData['nationality'] ?? null,
                'relationship' => $coSignerData['relationship'] ?? null,
                'relationship_other' => $coSignerData['relationship_other'] ?? null,
                // Address
                'street_name' => $coSignerData['street_name'] ?? null,
                'house_number' => $coSignerData['house_number'] ?? null,
                'address_line_2' => $coSignerData['address_line_2'] ?? null,
                'city' => $coSignerData['city'] ?? null,
                'state_province' => $coSignerData['state_province'] ?? null,
                'postal_code' => $coSignerData['postal_code'] ?? null,
                'country' => $coSignerData['country'] ?? null,
                // ID Document
                'id_document_type' => $coSignerData['id_document_type'] ?? null,
                'id_number' => $coSignerData['id_number'] ?? null,
                'id_issuing_country' => $coSignerData['id_issuing_country'] ?? null,
                'id_expiry_date' => $coSignerData['id_expiry_date'] ?? null,
                // Employment
                'employment_status' => $coSignerData['employment_status'] ?? null,
                'employment_status_other' => $coSignerData['employment_status_other'] ?? null,
                'employer_name' => $coSignerData['employer_name'] ?? null,
                'job_title' => $coSignerData['job_title'] ?? null,
                'employment_type' => $coSignerData['employment_type'] ?? null,
                'employment_start_date' => $coSignerData['employment_start_date'] ?? null,
                'net_monthly_income' => $coSignerData['net_monthly_income'] ?? null,
                'income_currency' => $coSignerData['income_currency'] ?? null,
                // Student
                'university_name' => $coSignerData['university_name'] ?? null,
                'student_income_source' => $coSignerData['student_income_source'] ?? null,
                'student_monthly_income' => $coSignerData['student_monthly_income'] ?? null,
                // Other income
                'income_source' => $coSignerData['income_source'] ?? null,
            ];

            if ($coSigner) {
                $coSigner->update($data);
                $processedIds[] = $coSigner->id;
            } else {
                $newCoSigner = ApplicationCoSigner::create($data);
                $processedIds[] = $newCoSigner->id;
            }
        }

        // Remove co-signers that are no longer in the list
        $toDelete = array_diff($existingIds, $processedIds);
        if (! empty($toDelete)) {
            $application->coSigners()->whereIn('id', $toDelete)->delete();
        }
    }

    /**
     * Sync guarantors from request data to application_guarantors table.
     */
    private function syncGuarantorsFromRequest(Application $application, array $guarantors): void
    {
        if (empty($guarantors)) {
            // Clear all guarantors if empty
            $application->guarantors()->delete();

            return;
        }

        // Get existing guarantor IDs for cleanup
        $existingIds = $application->guarantors()->pluck('id')->toArray();
        $processedIds = [];

        foreach ($guarantors as $index => $guarantorData) {
            if (empty($guarantorData['first_name']) && empty($guarantorData['last_name'])) {
                continue;
            }

            $data = [
                'application_id' => $application->id,
                'for_signer_type' => $guarantorData['for_signer_type'] ?? 'primary',
                'for_co_signer_id' => $guarantorData['for_co_signer_id'] ?? null,
                // Identity
                'first_name' => $guarantorData['first_name'] ?? null,
                'last_name' => $guarantorData['last_name'] ?? null,
                'email' => $guarantorData['email'] ?? null,
                'phone_country_code' => $guarantorData['phone_country_code'] ?? null,
                'phone_number' => $guarantorData['phone_number'] ?? null,
                'date_of_birth' => $guarantorData['date_of_birth'] ?? null,
                'nationality' => $guarantorData['nationality'] ?? null,
                'relationship' => $guarantorData['relationship'] ?? null,
                'relationship_other' => $guarantorData['relationship_other'] ?? null,
                // ID Document
                'id_document_type' => $guarantorData['id_document_type'] ?? null,
                'id_number' => $guarantorData['id_number'] ?? null,
                'id_issuing_country' => $guarantorData['id_issuing_country'] ?? null,
                'id_expiry_date' => $guarantorData['id_expiry_date'] ?? null,
                // Address
                'street_name' => $guarantorData['street_name'] ?? null,
                'house_number' => $guarantorData['house_number'] ?? null,
                'address_line_2' => $guarantorData['address_line_2'] ?? null,
                'city' => $guarantorData['city'] ?? null,
                'state_province' => $guarantorData['state_province'] ?? null,
                'postal_code' => $guarantorData['postal_code'] ?? null,
                'country' => $guarantorData['country'] ?? null,
                'years_at_address' => $guarantorData['years_at_address'] ?? null,
                // Employment
                'employment_status' => $guarantorData['employment_status'] ?? null,
                'employer_name' => $guarantorData['employer_name'] ?? null,
                'job_title' => $guarantorData['job_title'] ?? null,
                'net_monthly_income' => $guarantorData['net_monthly_income'] ?? null,
                'income_currency' => $guarantorData['income_currency'] ?? null,
                // Consent
                'consent_to_credit_check' => $guarantorData['consent_to_credit_check'] ?? false,
                'consent_to_contact' => $guarantorData['consent_to_contact'] ?? false,
                'guarantee_consent_signed' => $guarantorData['guarantee_consent_signed'] ?? false,
            ];

            // For now, just create/recreate all guarantors since we don't have a unique identifier
            $newGuarantor = ApplicationGuarantor::create($data);
            $processedIds[] = $newGuarantor->id;
        }

        // Remove guarantors that are no longer in the list
        $toDelete = array_diff($existingIds, $processedIds);
        if (! empty($toDelete)) {
            $application->guarantors()->whereIn('id', $toDelete)->delete();
        }
    }

    // ========================================
    // Manager-side methods
    // ========================================

    /**
     * List all applications for manager's properties.
     */
    public function indexManager(Request $request)
    {
        $user = Auth::user();
        $propertyManager = $user->propertyManager;

        if (! $propertyManager) {
            abort(403, 'Property manager profile required');
        }

        // Get all property IDs owned by this manager
        $propertyIds = $user->properties()->pluck('properties.id');

        // Build query for applications
        $query = Application::whereIn('property_id', $propertyIds)
            ->visibleToManager()
            ->with([
                'property:id,title,city,street_name,house_number',
                'tenantProfile.user:id,first_name,last_name,email',
            ])
            ->orderBy('submitted_at', 'desc');

        // Optional property filter
        if ($request->has('property') && $request->property) {
            $query->where('property_id', $request->property);
        }

        $applications = $query->get();

        // Get properties for filter dropdown
        $properties = $user->properties()
            ->select('properties.id', 'properties.title')
            ->orderBy('properties.title')
            ->get();

        return Inertia::render('applications', [
            'applications' => $applications,
            'properties' => $properties,
            'selectedPropertyId' => $request->property ? (int) $request->property : null,
        ]);
    }

    /**
     * Show a single application for manager.
     */
    public function showManager(Application $application)
    {
        $user = Auth::user();
        $propertyManager = $user->propertyManager;

        // Check authorization: must be property owner
        if (! $propertyManager || $application->property->property_manager_id !== $propertyManager->id) {
            abort(403, 'Unauthorized to view this application');
        }

        // Load relationships
        $application->load([
            'property.images',
            'property.propertyManager',
            'tenantProfile.user',
        ]);

        // Transform application data with property images and document URLs
        $applicationData = $this->transformApplicationWithUrls($application);

        // Define allowed status transitions based on current status
        $allowedTransitions = $this->getAllowedTransitions($application->status);

        return Inertia::render('application', [
            'application' => $applicationData,
            'allowedTransitions' => $allowedTransitions,
        ]);
    }

    /**
     * Update application status.
     */
    public function updateStatus(Request $request, Application $application)
    {
        $user = Auth::user();
        $propertyManager = $user->propertyManager;

        // Check authorization
        if (! $propertyManager || $application->property->property_manager_id !== $propertyManager->id) {
            abort(403, 'Unauthorized to update this application');
        }

        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'nullable|string|max:2000',
        ]);

        $newStatus = $validated['status'];
        $notes = $validated['notes'] ?? null;

        // Verify this is an allowed transition
        $allowedTransitions = $this->getAllowedTransitions($application->status);
        if (! in_array($newStatus, $allowedTransitions)) {
            return back()->with('error', 'Invalid status transition');
        }

        // Handle specific transitions
        switch ($newStatus) {
            case 'under_review':
                $application->moveToUnderReview($user);
                break;

            case 'visit_scheduled':
                $application->status = 'visit_scheduled';
                $application->visit_scheduled_at = now(); // Simple confirmation for now
                $application->visit_notes = $notes;
                $application->save();
                break;

            case 'visit_completed':
                $application->completeVisit($notes);
                break;

            case 'approved':
                $application->approve($user, $notes);
                break;

            case 'rejected':
                $application->reject($notes ?? 'No reason provided');
                break;

            case 'leased':
                // For now, mark as leased with current date
                $application->status = 'leased';
                $application->lease_signed_at = now();
                if ($notes) {
                    $application->approval_notes = ($application->approval_notes ? $application->approval_notes."\n\n" : '').$notes;
                }
                $application->save();

                // Update property status
                $application->property->update(['status' => 'leased']);
                break;

            case 'archived':
                $application->archive();
                break;

            default:
                return back()->with('error', 'Unknown status');
        }

        return back()->with('success', 'Application status updated');
    }

    /**
     * Get allowed status transitions for manager.
     */
    private function getAllowedTransitions(string $currentStatus): array
    {
        return match ($currentStatus) {
            'submitted' => ['under_review', 'archived'],
            'under_review' => ['visit_scheduled', 'approved', 'rejected', 'archived'],
            'visit_scheduled' => ['visit_completed', 'archived'],
            'visit_completed' => ['approved', 'rejected', 'archived'],
            'approved' => ['leased', 'archived'],
            'rejected' => ['archived'],
            'leased' => ['archived'],
            default => [],
        };
    }

    /**
     * Transform application with property images and document URLs.
     */
    private function transformApplicationWithUrls(Application $application): array
    {
        // Transform property images with URLs
        $property = $application->property;
        $imagesWithUrls = $property->images->map(function ($image) {
            return [
                'id' => $image->id,
                'image_url' => StorageHelper::url($image->image_path, 'private', 1440),
                'image_path' => $image->image_path,
                'is_main' => $image->is_main,
                'sort_order' => $image->sort_order,
            ];
        })->sortBy('sort_order')->values()->toArray();

        // Transform application data with document URLs
        $applicationData = $application->toArray();
        $applicationData['property']['images'] = $imagesWithUrls;

        // Add signed URLs for snapshot documents
        $documentFields = [
            'snapshot_id_document_path',
            'snapshot_employment_contract_path',
            'snapshot_payslip_1_path',
            'snapshot_payslip_2_path',
            'snapshot_payslip_3_path',
            'snapshot_student_proof_path',
            'snapshot_guarantor_id_path',
            'snapshot_guarantor_proof_income_path',
            'application_id_document_path',
            'application_proof_of_income_path',
            'application_reference_letter_path',
        ];

        foreach ($documentFields as $field) {
            $urlField = str_replace('_path', '_url', $field);
            $applicationData[$urlField] = StorageHelper::url($application->$field, 'private', 5);
        }

        return $applicationData;
    }

    /**
     * Upload additional document for an application.
     */
    public function uploadDocument(Request $request, Property $property)
    {
        $user = Auth::user();
        $tenantProfile = $user->tenantProfile;

        if (! $tenantProfile) {
            return response()->json(['success' => false, 'message' => 'Tenant profile not found'], 404);
        }

        // Find or create draft application
        $application = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->first();

        if (! $application) {
            $application = Application::create([
                'tenant_profile_id' => $tenantProfile->id,
                'property_id' => $property->id,
                'status' => 'draft',
                'current_step' => 1,
            ]);
        }

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpeg,jpg,png', 'max:20480'],
        ]);

        $file = $request->file('file');
        $path = StorageHelper::store($file, 'applications/additional-documents', 'private');

        // Add to existing documents
        $documents = $application->additional_documents ?? [];
        $documents[] = [
            'path' => $path,
            'originalName' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'uploadedAt' => time(),
        ];
        $application->update(['additional_documents' => $documents]);

        return response()->json([
            'success' => true,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
        ]);
    }

    /**
     * Remove additional document from an application.
     */
    public function removeDocument(Request $request, Property $property)
    {
        $user = Auth::user();
        $tenantProfile = $user->tenantProfile;

        if (! $tenantProfile) {
            return response()->json(['success' => false, 'message' => 'Tenant profile not found'], 404);
        }

        $application = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->first();

        if (! $application) {
            return response()->json(['success' => false, 'message' => 'Application not found'], 404);
        }

        $validated = $request->validate([
            'path' => ['required', 'string'],
        ]);

        $documents = $application->additional_documents ?? [];
        $documents = array_values(array_filter($documents, fn ($doc) => $doc['path'] !== $validated['path']));

        // Delete the file from storage
        StorageHelper::delete($validated['path'], 'private');

        $application->update(['additional_documents' => $documents]);

        return response()->json(['success' => true]);
    }

    /**
     * Upload a document for a co-signer.
     */
    public function uploadCoSignerDocument(Request $request, Application $application, int $index)
    {
        $user = Auth::user();

        // Verify user owns this application
        if ($application->tenantProfile->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Verify application is still in draft
        if ($application->status !== 'draft') {
            return response()->json(['success' => false, 'message' => 'Application is not editable'], 400);
        }

        // Define allowed document types for co-signers
        $documentTypes = [
            // ID Documents
            'id_document_front' => ['folder' => 'applications/co-signers/id-documents', 'path_field' => 'id_document_front_path', 'name_field' => 'id_document_front_original_name'],
            'id_document_back' => ['folder' => 'applications/co-signers/id-documents', 'path_field' => 'id_document_back_path', 'name_field' => 'id_document_back_original_name'],
            // Immigration
            'residence_permit_document' => ['folder' => 'applications/co-signers/residence-permits', 'path_field' => 'residence_permit_document_path', 'name_field' => 'residence_permit_document_original_name'],
            'right_to_rent_document' => ['folder' => 'applications/co-signers/right-to-rent', 'path_field' => 'right_to_rent_document_path', 'name_field' => 'right_to_rent_document_original_name'],
            // Employment (employed)
            'employment_contract' => ['folder' => 'applications/co-signers/employment-contracts', 'path_field' => 'employment_contract_path', 'name_field' => 'employment_contract_original_name'],
            'payslip_1' => ['folder' => 'applications/co-signers/payslips', 'path_field' => 'payslip_1_path', 'name_field' => 'payslip_1_original_name'],
            'payslip_2' => ['folder' => 'applications/co-signers/payslips', 'path_field' => 'payslip_2_path', 'name_field' => 'payslip_2_original_name'],
            'payslip_3' => ['folder' => 'applications/co-signers/payslips', 'path_field' => 'payslip_3_path', 'name_field' => 'payslip_3_original_name'],
            // Self-employed
            'income_proof' => ['folder' => 'applications/co-signers/income-proofs', 'path_field' => 'income_proof_path', 'name_field' => 'income_proof_original_name'],
            // Student
            'enrollment_proof' => ['folder' => 'applications/co-signers/enrollment-proofs', 'path_field' => 'enrollment_proof_path', 'name_field' => 'enrollment_proof_original_name'],
            'student_proof' => ['folder' => 'applications/co-signers/student-proofs', 'path_field' => 'student_proof_path', 'name_field' => 'student_proof_original_name'],
            // Retired
            'pension_statement' => ['folder' => 'applications/co-signers/pension-statements', 'path_field' => 'pension_statement_path', 'name_field' => 'pension_statement_original_name'],
            // Unemployed
            'benefits_statement' => ['folder' => 'applications/co-signers/benefits-statements', 'path_field' => 'benefits_statement_path', 'name_field' => 'benefits_statement_original_name'],
            // Other income proof (for unemployed/other statuses)
            'other_income_proof' => ['folder' => 'applications/co-signers/income-proofs', 'path_field' => 'income_proof_path', 'name_field' => 'income_proof_original_name'],
        ];

        // Handle prefixed document types (e.g., "cosigner_0_id_document_front")
        $documentType = $request->input('document_type');
        $actualType = preg_replace('/^cosigner_\d+_/', '', $documentType);

        if (! isset($documentTypes[$actualType])) {
            return response()->json(['success' => false, 'message' => 'Invalid document type'], 400);
        }

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpeg,jpg,png', 'max:20480'],
        ]);

        $file = $request->file('file');
        $config = $documentTypes[$actualType];

        // Find or create the co-signer record
        $coSigner = ApplicationCoSigner::firstOrCreate(
            ['application_id' => $application->id, 'occupant_index' => $index],
            ['first_name' => '', 'last_name' => '', 'date_of_birth' => now(), 'nationality' => '', 'email' => '', 'phone_country_code' => '', 'phone_number' => '', 'id_document_type' => 'passport', 'employment_status' => 'employed']
        );

        // Delete old file if exists
        $oldPath = $coSigner->{$config['path_field']};
        if ($oldPath) {
            StorageHelper::delete($oldPath, 'private');
        }

        // Store new file
        $path = StorageHelper::store($file, $config['folder'], 'private');

        // Update co-signer record
        $coSigner->update([
            $config['path_field'] => $path,
            $config['name_field'] => $file->getClientOriginalName(),
        ]);

        return response()->json([
            'success' => true,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'uploaded_at' => time(),
            'preview_url' => StorageHelper::url($path, 'private', 60),
        ]);
    }

    /**
     * Upload a document for a guarantor.
     */
    public function uploadGuarantorDocument(Request $request, Application $application, int $index)
    {
        $user = Auth::user();

        // Verify user owns this application
        if ($application->tenantProfile->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Verify application is still in draft
        if ($application->status !== 'draft') {
            return response()->json(['success' => false, 'message' => 'Application is not editable'], 400);
        }

        // Define allowed document types for guarantors
        $documentTypes = [
            'id_document_front' => ['folder' => 'applications/guarantors/id-documents', 'path_field' => 'id_document_front_path', 'name_field' => 'id_document_front_original_name'],
            'id_document_back' => ['folder' => 'applications/guarantors/id-documents', 'path_field' => 'id_document_back_path', 'name_field' => 'id_document_back_original_name'],
            'proof_of_income' => ['folder' => 'applications/guarantors/income-proofs', 'path_field' => 'proof_of_income_path', 'name_field' => 'proof_of_income_original_name'],
            'credit_report' => ['folder' => 'applications/guarantors/credit-reports', 'path_field' => 'credit_report_path', 'name_field' => 'credit_report_original_name'],
            'proof_of_residence' => ['folder' => 'applications/guarantors/residence-proofs', 'path_field' => 'proof_of_residence_path', 'name_field' => 'proof_of_residence_original_name'],
        ];

        // Handle prefixed document types (e.g., "guarantor_0_id_document_front")
        $documentType = $request->input('document_type');
        $actualType = preg_replace('/^guarantor_\d+_/', '', $documentType);

        if (! isset($documentTypes[$actualType])) {
            return response()->json(['success' => false, 'message' => 'Invalid document type'], 400);
        }

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpeg,jpg,png', 'max:20480'],
        ]);

        $file = $request->file('file');
        $config = $documentTypes[$actualType];

        // Find or create the guarantor record
        $guarantor = ApplicationGuarantor::firstOrCreate(
            ['application_id' => $application->id, 'for_signer_type' => 'primary'],
            ['first_name' => '', 'last_name' => '', 'date_of_birth' => now(), 'nationality' => '', 'email' => '', 'phone_country_code' => '', 'phone_number' => '', 'relationship' => 'parent', 'id_document_type' => 'passport', 'street_address' => '', 'city' => '', 'postal_code' => '', 'country' => '', 'employment_status' => 'employed', 'net_monthly_income' => 0, 'income_currency' => 'EUR']
        );

        // For indexed guarantors, we need a different approach - use index to find by order
        if ($index > 0) {
            $guarantors = ApplicationGuarantor::where('application_id', $application->id)
                ->orderBy('id')
                ->get();

            if ($index < count($guarantors)) {
                $guarantor = $guarantors[$index];
            }
        }

        // Delete old file if exists
        $oldPath = $guarantor->{$config['path_field']};
        if ($oldPath) {
            StorageHelper::delete($oldPath, 'private');
        }

        // Store new file
        $path = StorageHelper::store($file, $config['folder'], 'private');

        // Update guarantor record
        $guarantor->update([
            $config['path_field'] => $path,
            $config['name_field'] => $file->getClientOriginalName(),
        ]);

        return response()->json([
            'success' => true,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'uploaded_at' => time(),
            'preview_url' => StorageHelper::url($path, 'private', 60),
        ]);
    }

    /**
     * Update lead status to 'drafting' when user starts an application draft.
     */
    private function updateLeadOnDraft($user, Property $property): void
    {
        $lead = Lead::where('property_id', $property->id)
            ->where('email', $user->email)
            ->whereNotIn('status', [Lead::STATUS_APPLIED, Lead::STATUS_ARCHIVED])
            ->first();

        if ($lead && $lead->status !== Lead::STATUS_DRAFTING) {
            $lead->update(['status' => Lead::STATUS_DRAFTING]);
        }
    }

    /**
     * Update lead status to 'applied' when application is submitted.
     */
    private function updateLeadOnApplicationSubmit($user, Property $property, Application $application): void
    {
        $lead = Lead::where('property_id', $property->id)
            ->where('email', $user->email)
            ->first();

        if ($lead) {
            $lead->update([
                'status' => Lead::STATUS_APPLIED,
                'application_id' => $application->id,
                'user_id' => $user->id,
            ]);
        } else {
            // Create a lead from the application if one doesn't exist
            Lead::create([
                'property_id' => $property->id,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'token' => Lead::generateToken(),
                'source' => Lead::SOURCE_APPLICATION,
                'status' => Lead::STATUS_APPLIED,
                'user_id' => $user->id,
                'application_id' => $application->id,
            ]);
        }
    }
}
