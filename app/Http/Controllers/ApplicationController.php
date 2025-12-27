<?php

namespace App\Http\Controllers;

use App\Helpers\StorageHelper;
use App\Models\Application;
use App\Models\Lead;
use App\Models\Property;
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
        if (! $user->tenantProfile) {
            $user->tenantProfile()->create([]);
        }

        $tenantProfile = $user->tenantProfile;

        // Check if already applied (excluding drafts - those can continue)
        $existingApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->whereNotIn('status', ['draft', 'withdrawn', 'archived', 'deleted'])
            ->first();

        if ($existingApplication) {
            return redirect()->route('applications.show', ['application' => $existingApplication->id])
                ->with('message', 'You already have an application for this property');
        }

        // Load existing draft if it exists
        $draftApplication = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->first();

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
     * Store a new application.
     */
    public function store(Request $request, Property $property)
    {
        $user = Auth::user();

        // Auto-create tenant profile if it doesn't exist
        if (! $user->tenantProfile) {
            $user->tenantProfile()->create([]);
        }

        $tenantProfile = $user->tenantProfile;

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

        // Validation rules
        $rules = [
            'desired_move_in_date' => 'required|date|after:today',
            'lease_duration_months' => 'required|integer|min:1|max:60',
            'message_to_landlord' => 'nullable|string|max:2000',

            // Occupants
            'additional_occupants' => 'required|integer|min:0|max:20',
            'occupants_details' => 'nullable|array',
            'occupants_details.*.name' => 'required|string|max:255',
            'occupants_details.*.age' => 'required|integer|min:0|max:120',
            'occupants_details.*.relationship' => 'required|string|max:100',

            // Pets
            'has_pets' => 'required|boolean',
            'pets_details' => 'nullable|array',
            'pets_details.*.type' => 'required|string|max:100',
            'pets_details.*.breed' => 'nullable|string|max:100',
            'pets_details.*.age' => 'nullable|integer|min:0|max:50',
            'pets_details.*.weight' => 'nullable|numeric|min:0',

            // Previous landlord reference (optional)
            'previous_landlord_name' => 'nullable|string|max:255',
            'previous_landlord_phone' => 'nullable|string|max:20',
            'previous_landlord_email' => 'nullable|email|max:255',

            // Emergency contact (can override profile)
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',

            // References
            'references' => 'nullable|array',
            'references.*.name' => 'required|string|max:255',
            'references.*.phone' => 'required|string|max:20',
            'references.*.email' => 'required|email|max:255',
            'references.*.relationship' => 'required|string|max:100',
            'references.*.years_known' => 'required|integer|min:0|max:100',

            // Optional fresh documents
            'application_id_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'application_proof_of_income' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
            'application_reference_letter' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',

            // Additional documents
            'additional_documents' => 'nullable|array',
            'additional_documents.*' => 'file|mimes:pdf,jpeg,png,jpg|max:20480',

            // Token tracking
            'invited_via_token' => 'nullable|string|max:64',
        ];

        $validated = $request->validate($rules);

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

        // Update lead status to 'applied' if exists
        $this->updateLeadOnApplicationSubmit($user, $property, $application);

        // TODO: Send email notifications to property manager and tenant
        // Note: Property funnel stage is now derived from applications, no need to update property status

        return redirect()->route('applications.show', ['application' => $application->id])
            ->with('success', 'Application submitted successfully!');
    }

    /**
     * Save application as draft (for step-by-step form).
     */
    public function saveDraft(Request $request, Property $property)
    {
        $user = Auth::user();

        // Auto-create tenant profile if it doesn't exist
        if (! $user->tenantProfile) {
            $user->tenantProfile()->create([]);
        }

        $tenantProfile = $user->tenantProfile;

        // Check if draft already exists for this user and property
        $application = Application::where('tenant_profile_id', $tenantProfile->id)
            ->where('property_id', $property->id)
            ->where('status', 'draft')
            ->first();

        $requestedStep = $request->input('current_step', 1);
        $previousMaxStep = $application ? $application->current_step : 0;

        // ALWAYS save the data first (preserve user work)
        $data = $request->all();
        $data['tenant_profile_id'] = $tenantProfile->id;
        $data['property_id'] = $property->id;
        $data['status'] = 'draft';
        // Don't set current_step yet - will determine after validation

        // Validate to determine actual allowed max step
        $validatedMaxStep = 0;

        // Check all steps up to the requested step
        for ($step = 1; $step <= $requestedStep; $step++) {
            $stepValidation = $this->getStepValidationRules($step, $data);

            if (! empty($stepValidation)) {
                // Create a validator instance to check without throwing
                $validator = \Validator::make($data, $stepValidation);

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
        // If no steps are valid, current_step stays at 0
        $data['current_step'] = $validatedMaxStep;

        if ($application) {
            $application->update($data);
        } else {
            $application = Application::create($data);
        }

        // Update lead status to 'drafting' if exists
        $this->updateLeadOnDraft($user, $property);

        // Return back with the actual max step reached
        // The frontend will read this from the updated draft application
        return back(303);
    }

    /**
     * Get validation rules for a specific step.
     */
    private function getStepValidationRules(int $step, array $data): array
    {
        switch ($step) {
            case 1:
                $rules = [
                    'desired_move_in_date' => 'required|date|after:today',
                    'lease_duration_months' => 'required|integer|min:1|max:60',
                    'message_to_landlord' => 'nullable|string|max:2000',
                    'additional_occupants' => 'required|integer|min:0|max:20',
                    'occupants_details' => 'nullable|array',
                    'occupants_details.*.name' => 'required|string|max:255',
                    'occupants_details.*.age' => 'required|integer|min:0|max:120',
                    'occupants_details.*.relationship' => 'required|string|max:100',
                    'occupants_details.*.relationship_other' => 'nullable|string|max:100',
                    'has_pets' => 'required|boolean',
                ];

                // Validate relationship_other when relationship is "Other"
                $occupants = $data['occupants_details'] ?? [];
                foreach ($occupants as $index => $occupant) {
                    if (isset($occupant['relationship']) && $occupant['relationship'] === 'Other') {
                        $rules["occupants_details.{$index}.relationship_other"] = 'required|string|max:100';
                    }
                }

                // Add pets validation only if has_pets is true
                if (isset($data['has_pets']) && $data['has_pets'] === true) {
                    $rules['pets_details'] = 'required|array|min:1';
                    $rules['pets_details.*.type'] = 'required|string|max:100';
                    $rules['pets_details.*.type_other'] = 'nullable|string|max:100';
                    $rules['pets_details.*.breed'] = 'nullable|string|max:100';
                    $rules['pets_details.*.age'] = 'nullable|integer|min:0|max:50';
                    $rules['pets_details.*.weight'] = 'nullable|numeric|min:0';

                    // Validate type_other when type is "Other"
                    $pets = $data['pets_details'] ?? [];
                    foreach ($pets as $index => $pet) {
                        if (isset($pet['type']) && $pet['type'] === 'Other') {
                            $rules["pets_details.{$index}.type_other"] = 'required|string|max:100';
                        }
                    }
                }

                return $rules;

            case 2:
                // Step 2: References (all optional, but if provided must be complete)
                return [];

            case 3:
            case 4:
                // Steps 3 and 4 have no required fields
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

        // Check authorization: must be the applicant or the property owner
        $isApplicant = $application->tenantProfile->user_id === $user->id;
        $isPropertyOwner = $application->property->property_manager_id === $user->propertyManager?->id;

        if (! $isApplicant && ! $isPropertyOwner) {
            abort(403, 'Unauthorized to view this application');
        }

        // If applicant views a draft application, redirect to continue editing
        if ($isApplicant && $application->status === 'draft') {
            return redirect()->route('applications.create', ['property' => $application->property_id])
                ->with('message', 'Continue filling out your application');
        }

        // Load relationships
        $application->load([
            'property.images',
            'property.propertyManager',
            'tenantProfile.user',
        ]);

        // Determine which view to render based on user role
        if ($isPropertyOwner) {
            return Inertia::render('property-manager/application-view', [
                'application' => $application,
            ]);
        }

        return Inertia::render('tenant/application-view', [
            'application' => $application,
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

        return redirect()->route('dashboard')
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
            'has_pets' => 'required|boolean',
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

        return redirect()->route('dashboard')
            ->with('success', 'Draft application deleted');
    }

    /**
     * Snapshot profile data into application for audit trail.
     * This preserves the profile state at submission time.
     */
    private function snapshotProfileData($tenantProfile): array
    {
        return [
            // Employment snapshot
            'snapshot_employment_status' => $tenantProfile->employment_status,
            'snapshot_employer_name' => $tenantProfile->employer_name,
            'snapshot_job_title' => $tenantProfile->job_title,
            'snapshot_employment_start_date' => $tenantProfile->employment_start_date,
            'snapshot_employment_type' => $tenantProfile->employment_type,
            'snapshot_monthly_income' => $tenantProfile->monthly_income,
            'snapshot_income_currency' => $tenantProfile->income_currency,

            // Current address snapshot
            'snapshot_current_house_number' => $tenantProfile->current_house_number,
            'snapshot_current_street_name' => $tenantProfile->current_street_name,
            'snapshot_current_city' => $tenantProfile->current_city,
            'snapshot_current_postal_code' => $tenantProfile->current_postal_code,
            'snapshot_current_country' => $tenantProfile->current_country,

            // Student snapshot
            'snapshot_university_name' => $tenantProfile->university_name,
            'snapshot_program_of_study' => $tenantProfile->program_of_study,
            'snapshot_expected_graduation_date' => $tenantProfile->expected_graduation_date,

            // Guarantor snapshot
            'snapshot_has_guarantor' => $tenantProfile->has_guarantor,
            'snapshot_guarantor_name' => $tenantProfile->guarantor_name,
            'snapshot_guarantor_relationship' => $tenantProfile->guarantor_relationship,
            'snapshot_guarantor_monthly_income' => $tenantProfile->guarantor_monthly_income,

            // Document paths snapshot
            'snapshot_id_document_path' => $tenantProfile->id_document_path,
            'snapshot_employment_contract_path' => $tenantProfile->employment_contract_path,
            'snapshot_payslip_1_path' => $tenantProfile->payslip_1_path,
            'snapshot_payslip_2_path' => $tenantProfile->payslip_2_path,
            'snapshot_payslip_3_path' => $tenantProfile->payslip_3_path,
            'snapshot_student_proof_path' => $tenantProfile->student_proof_path,
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
