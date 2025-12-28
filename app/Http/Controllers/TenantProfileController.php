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

        if ($tenantProfile) {
            $completeness = $this->calculateCompleteness($tenantProfile);
            $documents = [
                'id_document' => ! empty($tenantProfile->id_document_path),
                'proof_of_income' => ! empty($tenantProfile->payslip_1_path) || ! empty($tenantProfile->employment_contract_path),
                'reference_letter' => ! empty($tenantProfile->reference_letter_path),
            ];
        }

        return Inertia::render('tenant/profile', [
            'profile' => $tenantProfile?->toArray(),
            'hasProfile' => $tenantProfile !== null,
            'completeness' => $completeness,
            'documents' => $documents,
        ]);
    }

    /**
     * Calculate profile completeness percentage.
     */
    private function calculateCompleteness($profile): int
    {
        $fields = [
            'date_of_birth',
            'nationality',
            'phone_number',
            'current_street_name',
            'current_city',
            'current_postal_code',
            'current_country',
            'employment_status',
            'id_document_path',
        ];

        // Add employment-specific fields
        if (in_array($profile->employment_status, ['employed', 'self_employed'])) {
            $fields = array_merge($fields, [
                'employer_name',
                'job_title',
                'monthly_income',
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

        // TODO: Update this to use a proper edit form (not the old setup form)
        return Inertia::render('tenant/tenant-profile-setup', [
            'user' => Auth::user(),
            'tenantProfile' => $tenantProfile,
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

            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',

            'occupants_count' => 'nullable|integer|min:1|max:20',
            'has_pets' => 'nullable|boolean',
            'pets_description' => 'nullable|string|max:500',
            'is_smoker' => 'nullable|boolean',

            'has_guarantor' => 'nullable|boolean',
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

        if ($request->boolean('has_guarantor')) {
            $rules['guarantor_name'] = 'required|string|max:255';
            $rules['guarantor_relationship'] = 'required|string|max:100';
            $rules['guarantor_phone'] = 'required|string|max:20';
            $rules['guarantor_email'] = 'required|email|max:255';
            $rules['guarantor_address'] = 'required|string|max:500';
            $rules['guarantor_employer'] = 'required|string|max:255';
            $rules['guarantor_monthly_income'] = 'required|numeric|min:0';
            $rules['guarantor_id'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
            $rules['guarantor_proof_income'] = 'nullable|file|mimes:pdf,jpeg,png,jpg|max:20480';
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

        if ($request->hasFile('guarantor_id')) {
            if ($tenantProfile->guarantor_id_path) {
                StorageHelper::delete($tenantProfile->guarantor_id_path, 'private');
            }
            $validated['guarantor_id_path'] = StorageHelper::store(
                $request->file('guarantor_id'),
                'tenants/guarantor-documents',
                'private'
            );
            $validated['guarantor_id_original_name'] = $request->file('guarantor_id')->getClientOriginalName();
        }

        if ($request->hasFile('guarantor_proof_income')) {
            if ($tenantProfile->guarantor_proof_income_path) {
                StorageHelper::delete($tenantProfile->guarantor_proof_income_path, 'private');
            }
            $validated['guarantor_proof_income_path'] = StorageHelper::store(
                $request->file('guarantor_proof_income'),
                'tenants/guarantor-documents',
                'private'
            );
            $validated['guarantor_proof_income_original_name'] = $request->file('guarantor_proof_income')->getClientOriginalName();
        }

        // Remove file fields and clear rejection data on resubmission
        unset(
            $validated['profile_picture'],
            $validated['id_document'],
            $validated['employment_contract'],
            $validated['payslip_1'],
            $validated['payslip_2'],
            $validated['payslip_3'],
            $validated['student_proof'],
            $validated['guarantor_id'],
            $validated['guarantor_proof_income']
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
            'employment_contract' => ['folder' => 'profiles/employment-contracts', 'disk' => 'private'],
            'payslip_1' => ['folder' => 'profiles/payslips', 'disk' => 'private'],
            'payslip_2' => ['folder' => 'profiles/payslips', 'disk' => 'private'],
            'payslip_3' => ['folder' => 'profiles/payslips', 'disk' => 'private'],
            'student_proof' => ['folder' => 'profiles/student-proofs', 'disk' => 'private'],
            'other_income_proof' => ['folder' => 'profiles/other-income-proofs', 'disk' => 'private'],
            'guarantor_id' => ['folder' => 'profiles/guarantor-ids', 'disk' => 'private'],
            'guarantor_proof_income' => ['folder' => 'profiles/guarantor-income-proofs', 'disk' => 'private'],
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
            'id_document_front', 'id_document_back', 'employment_contract',
            'payslip_1', 'payslip_2', 'payslip_3', 'student_proof',
            'other_income_proof', 'guarantor_id', 'guarantor_proof_income',
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
        $allowedFields = [
            // Personal Info
            'date_of_birth',
            'nationality',
            'phone_country_code',
            'phone_number',
            // Current Address
            'current_house_number',
            'current_address_line_2',
            'current_street_name',
            'current_city',
            'current_state_province',
            'current_postal_code',
            'current_country',
            // Employment
            'employment_status',
            'employer_name',
            'job_title',
            'employment_type',
            'employment_start_date',
            'monthly_income',
            'income_currency',
            // Student
            'university_name',
            'program_of_study',
            'expected_graduation_date',
            'student_income_source',
            // Guarantor
            'has_guarantor',
            'guarantor_name',
            'guarantor_relationship',
            'guarantor_phone',
            'guarantor_email',
            'guarantor_address',
            'guarantor_employer',
            'guarantor_monthly_income',
        ];

        // Only accept allowed fields from the request
        $data = [];
        foreach ($request->all() as $key => $value) {
            // Handle profile_ prefix (from wizard form fields)
            $fieldName = str_starts_with($key, 'profile_') ? substr($key, 8) : $key;

            if (in_array($fieldName, $allowedFields)) {
                // Handle boolean conversion for has_guarantor
                if ($fieldName === 'has_guarantor') {
                    $data[$fieldName] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                } else {
                    $data[$fieldName] = $value === '' ? null : $value;
                }
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
}
