<?php

namespace App\Http\Controllers;

use App\Helpers\StorageHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TenantProfileController extends Controller
{
    /**
     * DEPRECATED: Tenant profiles are now auto-created on first application.
     * These methods (create/store) have been removed.
     * Users fill their profile through the application process.
     */

    /**
     * DEPRECATED: Use edit() instead
     */
    public function create()
    {
        abort(410, 'Profile creation is no longer supported. Profiles are auto-created when you start an application.');
    }

    /**
     * DEPRECATED: Profiles auto-created on first application
     */
    public function store(Request $request)
    {
        abort(410, 'Profile creation is no longer supported. Profiles are auto-created when you start an application.');
    }

    /**
     * Display the tenant profile.
     */
    public function show()
    {
        $tenantProfile = Auth::user()->tenantProfile;

        // Calculate profile completeness
        $completeness = 0;
        $documents = [
            'id_document' => false,
            'proof_of_income' => false,
            'reference_letter' => false,
        ];
        $profileDocuments = [];

        if ($tenantProfile) {
            $completeness = $this->calculateCompleteness($tenantProfile);
            $documents = [
                'id_document' => ! empty($tenantProfile->id_document_front_path),
                'proof_of_income' => ! empty($tenantProfile->payslip_1_path) || ! empty($tenantProfile->employment_contract_path),
                'reference_letter' => ! empty($tenantProfile->reference_letter_path),
            ];

            // Build document metadata for FileUpload components
            $profileDocuments = $this->buildDocumentMetadata($tenantProfile);
        }

        return Inertia::render('tenant/profile', [
            'profile' => $tenantProfile?->toArray(),
            'hasProfile' => $tenantProfile !== null,
            'completeness' => $completeness,
            'documents' => $documents,
            'profileDocuments' => $profileDocuments,
        ]);
    }

    /**
     * Build document metadata for FileUpload components.
     */
    private function buildDocumentMetadata($tenantProfile): array
    {
        $documentTypes = [
            // Main tenant documents
            'id_document_front',
            'id_document_back',
            'residence_permit_document',
            'right_to_rent_document',
            'employment_contract',
            'payslip_1',
            'payslip_2',
            'payslip_3',
            'student_proof',
            'other_income_proof',
        ];

        $documents = [];

        foreach ($documentTypes as $type) {
            $pathField = $type.'_path';
            $nameField = $type.'_original_name';

            if (! empty($tenantProfile->$pathField)) {
                $metadata = $tenantProfile->documents_metadata[$type] ?? null;

                $documents[$type] = [
                    'originalName' => $tenantProfile->$nameField ?? basename($tenantProfile->$pathField),
                    'url' => StorageHelper::url($tenantProfile->$pathField, 'private'),
                    'size' => $metadata['size'] ?? null,
                    'uploadedAt' => $metadata['lastModified'] ?? null,
                ];
            }
        }

        return $documents;
    }

    /**
     * Calculate profile completeness percentage.
     */
    private function calculateCompleteness($profile): int
    {
        $fields = [
            // Personal info
            'date_of_birth',
            'nationality',
            'phone_number',
            // Address
            'current_street_name',
            'current_city',
            'current_postal_code',
            'current_country',
            // Identity documents
            'id_document_front_path',
            'id_document_back_path',
            // Employment
            'employment_status',
        ];

        // Add employment-specific fields
        if (in_array($profile->employment_status, ['employed', 'self_employed'])) {
            $fields = array_merge($fields, [
                'employer_name',
                'job_title',
                'monthly_income',
                'employment_contract_path',
                'payslip_1_path',
            ]);
        }

        // Add student-specific fields
        if ($profile->employment_status === 'student') {
            $fields = array_merge($fields, [
                'university_name',
                'program_of_study',
                'student_proof_path',
            ]);
        }

        $filled = collect($fields)->filter(fn ($f) => ! empty($profile->$f))->count();

        return (int) round(($filled / count($fields)) * 100);
    }

    /**
     * Show the form for editing the tenant profile.
     */
    public function edit()
    {
        $tenantProfile = Auth::user()->tenantProfile;

        // This should never happen now (profiles auto-created), but handle gracefully
        if (! $tenantProfile) {
            abort(500, 'Profile not found. Please contact support.');
        }

        if ($tenantProfile->isVerified()) {
            return redirect()->route('applications.index')
                ->with('info', 'Your profile is already verified. Contact support to make changes.');
        }

        return Inertia::render('tenant/profile', [
            'profile' => $tenantProfile,
            'isEditing' => true,
            'rejectionReason' => $tenantProfile->verification_rejection_reason,
            'rejectedFields' => $tenantProfile->verification_rejected_fields ?? [],
        ]);
    }

    /**
     * Update the tenant profile.
     */
    public function update(Request $request)
    {
        $tenantProfile = Auth::user()->tenantProfile;

        if (! $tenantProfile) {
            return redirect()->route('tenant.profile.edit');
        }

        if ($tenantProfile->isVerified()) {
            return redirect()->route('applications.index')
                ->with('error', 'Cannot edit a verified profile.');
        }

        // Same validation rules as store, but make existing file uploads optional
        $rules = [
            'date_of_birth' => 'required|date|before:today|after:'.now()->subYears(120)->toDateString(),
            'nationality' => 'required|string|size:2',
            'phone_country_code' => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',

            'current_house_number' => 'required|string|max:20',
            'current_street_name' => 'required|string|max:255',
            'current_city' => 'required|string|max:100',
            'current_postal_code' => 'required|string|max:20',
            'current_country' => 'required|string|size:2',

            'employment_status' => ['required', Rule::in(['employed', 'self_employed', 'student', 'unemployed', 'retired'])],

            'profile_picture' => 'nullable|image|mimes:jpeg,png,webp|max:5120',
            'id_document' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480',
        ];

        $employmentStatus = $request->input('employment_status');

        if (in_array($employmentStatus, ['employed', 'self_employed'])) {
            $rules['employer_name'] = 'required|string|max:255';
            $rules['job_title'] = 'required|string|max:255';
            $rules['employment_start_date'] = 'required|date|before:today';
            $rules['employment_type'] = ['required', Rule::in(['full_time', 'part_time', 'contract', 'temporary'])];
            $rules['monthly_income'] = 'required|numeric|min:0';
            $rules['income_currency'] = ['required', Rule::in(['eur', 'usd', 'gbp', 'chf'])];

            $rules['employer_contact_name'] = 'nullable|string|max:255';
            $rules['employer_contact_phone'] = 'nullable|string|max:20';
            $rules['employer_contact_email'] = 'nullable|email|max:255';

            $rules['employment_contract'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
            $rules['payslip_1'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
            $rules['payslip_2'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
            $rules['payslip_3'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
        }

        if ($employmentStatus === 'student') {
            $rules['university_name'] = 'required|string|max:255';
            $rules['program_of_study'] = 'required|string|max:255';
            $rules['expected_graduation_date'] = 'required|date|after:today';
            $rules['student_income_source'] = 'required|string|max:255';
            $rules['monthly_income'] = 'required|numeric|min:0';
            $rules['income_currency'] = ['required', Rule::in(['eur', 'usd', 'gbp', 'chf'])];
            $rules['student_proof'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
        }

        $validated = $request->validate($rules);

        // Handle file uploads (same logic as store)
        if ($request->hasFile('profile_picture')) {
            // Delete old file if exists
            if ($tenantProfile->profile_picture_path) {
                StorageHelper::delete($tenantProfile->profile_picture_path, 'public');
            }
            $validated['profile_picture_path'] = StorageHelper::store(
                $request->file('profile_picture'),
                'tenants/profile-pictures',
                'public'
            );
        }

        if ($request->hasFile('id_document')) {
            if ($tenantProfile->id_document_path) {
                StorageHelper::delete($tenantProfile->id_document_path, 'private');
            }
            $validated['id_document_path'] = StorageHelper::store(
                $request->file('id_document'),
                'tenants/id-documents',
                'private'
            );
            $validated['id_document_original_name'] = $request->file('id_document')->getClientOriginalName();
        }

        // Employment documents (continue pattern for all files)
        if ($request->hasFile('employment_contract')) {
            if ($tenantProfile->employment_contract_path) {
                StorageHelper::delete($tenantProfile->employment_contract_path, 'private');
            }
            $validated['employment_contract_path'] = StorageHelper::store(
                $request->file('employment_contract'),
                'tenants/employment-contracts',
                'private'
            );
            $validated['employment_contract_original_name'] = $request->file('employment_contract')->getClientOriginalName();
        }

        if ($request->hasFile('payslip_1')) {
            if ($tenantProfile->payslip_1_path) {
                StorageHelper::delete($tenantProfile->payslip_1_path, 'private');
            }
            $validated['payslip_1_path'] = StorageHelper::store(
                $request->file('payslip_1'),
                'tenants/payslips',
                'private'
            );
            $validated['payslip_1_original_name'] = $request->file('payslip_1')->getClientOriginalName();
        }

        if ($request->hasFile('payslip_2')) {
            if ($tenantProfile->payslip_2_path) {
                StorageHelper::delete($tenantProfile->payslip_2_path, 'private');
            }
            $validated['payslip_2_path'] = StorageHelper::store(
                $request->file('payslip_2'),
                'tenants/payslips',
                'private'
            );
            $validated['payslip_2_original_name'] = $request->file('payslip_2')->getClientOriginalName();
        }

        if ($request->hasFile('payslip_3')) {
            if ($tenantProfile->payslip_3_path) {
                StorageHelper::delete($tenantProfile->payslip_3_path, 'private');
            }
            $validated['payslip_3_path'] = StorageHelper::store(
                $request->file('payslip_3'),
                'tenants/payslips',
                'private'
            );
            $validated['payslip_3_original_name'] = $request->file('payslip_3')->getClientOriginalName();
        }

        if ($request->hasFile('student_proof')) {
            if ($tenantProfile->student_proof_path) {
                StorageHelper::delete($tenantProfile->student_proof_path, 'private');
            }
            $validated['student_proof_path'] = StorageHelper::store(
                $request->file('student_proof'),
                'tenants/student-proofs',
                'private'
            );
            $validated['student_proof_original_name'] = $request->file('student_proof')->getClientOriginalName();
        }

        // Remove file fields and clear rejection data on resubmission
        unset(
            $validated['profile_picture'],
            $validated['id_document'],
            $validated['employment_contract'],
            $validated['payslip_1'],
            $validated['payslip_2'],
            $validated['payslip_3'],
            $validated['student_proof']
        );

        // Clear rejection data when resubmitting
        $validated['verification_rejection_reason'] = null;
        $validated['verification_rejected_fields'] = null;

        $tenantProfile->update($validated);

        return redirect()->route('applications.index')
            ->with('success', 'Profile updated and resubmitted for review!');
    }

    /**
     * Serve a private document with signed URL verification.
     */
    public function serveDocument(Request $request, $type)
    {
        $tenantProfile = Auth::user()->tenantProfile;

        if (! $tenantProfile) {
            abort(404);
        }

        $pathField = $type.'_path';

        if (! property_exists($tenantProfile, $pathField) || ! $tenantProfile->$pathField) {
            abort(404);
        }

        $path = $tenantProfile->$pathField;
        $disk = StorageHelper::getDisk('private');

        if (! Storage::disk($disk)->exists($path)) {
            abort(404);
        }

        return Storage::disk($disk)->response($path);
    }

    /**
     * Upload a single document to the tenant profile immediately.
     * Used by the application wizard for per-file uploads with progress.
     */
    public function uploadDocument(Request $request)
    {
        $user = Auth::user();

        // Auto-create tenant profile if it doesn't exist
        $tenantProfile = $user->tenantProfile;
        if (! $tenantProfile) {
            $tenantProfile = $user->tenantProfile()->create([]);
        }

        // Define allowed document types and their storage config
        $documentTypes = [
            'id_document_front' => ['folder' => 'profiles/id-documents', 'disk' => 'private'],
            'id_document_back' => ['folder' => 'profiles/id-documents', 'disk' => 'private'],
            'residence_permit_document' => ['folder' => 'profiles/residence-permits', 'disk' => 'private'],
            'right_to_rent_document' => ['folder' => 'profiles/right-to-rent', 'disk' => 'private'],
            'employment_contract' => ['folder' => 'profiles/employment-contracts', 'disk' => 'private'],
            'payslip_1' => ['folder' => 'profiles/payslips', 'disk' => 'private'],
            'payslip_2' => ['folder' => 'profiles/payslips', 'disk' => 'private'],
            'payslip_3' => ['folder' => 'profiles/payslips', 'disk' => 'private'],
            'student_proof' => ['folder' => 'profiles/student-proofs', 'disk' => 'private'],
            'other_income_proof' => ['folder' => 'profiles/other-income-proofs', 'disk' => 'private'],
        ];

        $validated = $request->validate([
            'document_type' => ['required', 'string', 'in:'.implode(',', array_keys($documentTypes))],
            'file' => ['required', 'file', 'mimes:pdf,jpeg,jpg,png', 'max:20480'], // 20MB max
        ]);

        $documentType = $validated['document_type'];
        $file = $request->file('file');
        $config = $documentTypes[$documentType];

        // Build field names
        $pathField = $documentType.'_path';
        $nameField = $documentType.'_original_name';

        // Delete old file if exists
        $oldPath = $tenantProfile->$pathField;
        if ($oldPath) {
            StorageHelper::delete($oldPath, $config['disk']);
        }

        // Store new file
        $newPath = StorageHelper::store($file, $config['folder'], $config['disk']);

        // Update tenant profile
        $tenantProfile->update([
            $pathField => $newPath,
            $nameField => $file->getClientOriginalName(),
        ]);

        return response()->json([
            'success' => true,
            'document_type' => $documentType,
            'original_name' => $file->getClientOriginalName(),
            'path' => $newPath,
        ]);
    }

    /**
     * Delete a document from the tenant profile.
     */
    public function deleteDocument(Request $request)
    {
        $user = Auth::user();
        $tenantProfile = $user->tenantProfile;

        if (! $tenantProfile) {
            return response()->json(['success' => false, 'error' => 'Profile not found'], 404);
        }

        $documentTypes = [
            'id_document_front', 'id_document_back', 'residence_permit_document', 'right_to_rent_document',
            'employment_contract', 'payslip_1', 'payslip_2', 'payslip_3', 'student_proof', 'other_income_proof',
        ];

        $validated = $request->validate([
            'document_type' => ['required', 'string', 'in:'.implode(',', $documentTypes)],
        ]);

        $documentType = $validated['document_type'];
        $pathField = $documentType.'_path';
        $nameField = $documentType.'_original_name';

        // Delete file if exists
        $oldPath = $tenantProfile->$pathField;
        if ($oldPath) {
            StorageHelper::delete($oldPath, 'private');
        }

        // Clear fields
        $tenantProfile->update([
            $pathField => null,
            $nameField => null,
        ]);

        return response()->json([
            'success' => true,
            'document_type' => $documentType,
        ]);
    }

    /**
     * Autosave profile fields immediately.
     * Used by the application wizard for real-time profile updates.
     */
    public function autosave(Request $request)
    {
        $user = Auth::user();

        // Auto-create tenant profile if it doesn't exist
        $tenantProfile = $user->tenantProfile;
        if (! $tenantProfile) {
            $tenantProfile = $user->tenantProfile()->create([]);
        }

        // Define allowed fields that can be autosaved
        // These are profile fields, not application-specific fields
        // Must match PROFILE_FIELDS in useProfileAutosave.ts (without 'profile_' prefix)
        $allowedFields = [
            // Personal Info
            'date_of_birth',
            'middle_name',
            'nationality',
            'phone_country_code',
            'phone_number',
            'bio',
            // ID Document
            'id_document_type',
            'id_number',
            'id_issuing_country',
            'id_expiry_date',
            // Immigration Status
            'immigration_status',
            'immigration_status_other',
            'visa_type',
            'visa_type_other',
            'visa_expiry_date',
            'work_permit_number',
            // Right to Rent
            'right_to_rent_share_code',
            // Current Address
            'current_house_number',
            'current_address_line_2',
            'current_street_name',
            'current_city',
            'current_state_province',
            'current_postal_code',
            'current_country',

            // ===== Employment & Income =====
            'employment_status',
            'income_currency',

            // Employed fields
            'employer_name',
            'job_title',
            'employment_type',
            'employment_start_date',
            'gross_annual_income',
            'net_monthly_income',
            'monthly_income', // Legacy
            'pay_frequency',
            'employment_contract_type',
            'employment_end_date',
            'probation_end_date',
            'employer_address',
            'employer_phone',

            // Self-employed fields
            'business_name',
            'business_type',
            'business_registration_number',
            'business_start_date',
            'gross_annual_revenue',

            // Student fields
            'university_name',
            'program_of_study',
            'expected_graduation_date',
            'student_id_number',
            'student_income_source',
            'student_income_source_type',
            'student_income_source_other',
            'student_monthly_income',

            // Retired fields
            'pension_type',
            'pension_provider',
            'pension_monthly_income',
            'retirement_other_income',

            // Unemployed fields
            'receiving_unemployment_benefits',
            'unemployment_benefits_amount',
            'unemployed_income_source',
            'unemployed_income_source_other',

            // Other employment situation fields
            'other_employment_situation',
            'other_employment_situation_details',
            'expected_return_to_work',
            'other_situation_monthly_income',
            'other_situation_income_source',

            // Additional income
            'has_additional_income',
            'additional_income_sources',
        ];

        // Only accept allowed fields from the request
        $data = [];
        foreach ($request->all() as $key => $value) {
            // Handle profile_ prefix (from wizard form fields)
            $fieldName = str_starts_with($key, 'profile_') ? substr($key, 8) : $key;

            if (in_array($fieldName, $allowedFields)) {
                $data[$fieldName] = $value === '' ? null : $value;
            }
        }

        if (empty($data)) {
            return response()->json(['success' => false, 'error' => 'No valid fields provided'], 400);
        }

        // Update the tenant profile
        $tenantProfile->update($data);

        return response()->json([
            'success' => true,
            'updated_fields' => array_keys($data),
        ]);
    }

    /**
     * Validate profile data using Precognition.
     * Returns 204 if valid, 422 with errors if invalid.
     */
    public function validateDraft(\App\Http\Requests\Profile\ValidateProfileRequest $request)
    {
        // Precognition middleware handles validation automatically
        // If we reach here, validation passed
        return response()->noContent();
    }

    /**
     * Clear all profile data (GDPR right to erasure).
     * Deletes all documents from storage and resets all profile fields.
     */
    public function clearAllData()
    {
        $user = Auth::user();
        $tenantProfile = $user->tenantProfile;

        if (! $tenantProfile) {
            return response()->json(['success' => false, 'error' => 'Profile not found'], 404);
        }

        // Define all document path fields and their storage disk
        $documentFields = [
            'id_document_front_path' => 'private',
            'id_document_back_path' => 'private',
            'residence_permit_document_path' => 'private',
            'right_to_rent_document_path' => 'private',
            'employment_contract_path' => 'private',
            'payslip_1_path' => 'private',
            'payslip_2_path' => 'private',
            'payslip_3_path' => 'private',
            'student_proof_path' => 'private',
            'pension_statement_path' => 'private',
            'benefits_statement_path' => 'private',
            'other_income_proof_path' => 'private',
            'reference_letter_path' => 'private',
            'profile_picture_path' => 'public',
        ];

        // Delete all documents from storage
        foreach ($documentFields as $pathField => $disk) {
            $path = $tenantProfile->$pathField;
            if ($path) {
                StorageHelper::delete($path, $disk);
            }
        }

        // Boolean fields that have NOT NULL constraints with default false
        $booleanFieldsWithDefaults = [
            'authorize_credit_check',
            'authorize_background_check',
            'has_ccjs_or_bankruptcies',
            'has_eviction_history',
            'has_additional_income',
            'receiving_unemployment_benefits',
        ];

        // Fields to exclude from clearing (system/verification fields)
        $excludedFields = [
            'user_id',
            'profile_verified_at',
            'verification_rejection_reason',
            'verification_rejected_fields',
        ];

        // Get all fillable fields and set appropriate values
        $fieldsToReset = collect($tenantProfile->getFillable())
            ->reject(fn ($field) => in_array($field, $excludedFields))
            ->mapWithKeys(function ($field) use ($booleanFieldsWithDefaults) {
                // Boolean fields with NOT NULL defaults should be set to false, not null
                if (in_array($field, $booleanFieldsWithDefaults)) {
                    return [$field => false];
                }

                return [$field => null];
            })
            ->all();

        // Reset all profile fields
        $tenantProfile->update($fieldsToReset);

        return redirect()->back()->with('success', 'All profile data has been cleared.');
    }
}
