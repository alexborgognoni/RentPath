# Plan: Enhanced Support Step with Auto-Generated Co-Signers and Reusable Financial Input

## Overview

Enhance the application wizard's Support step (Step 4 - "Financial Support") to:

1. Auto-generate co-signer entries from household occupants marked as "Will sign lease"
2. Make auto-generated co-signers non-removable (tied to occupant)
3. Allow adding additional co-signers manually (current behavior)
4. Provide full financial input for all co-signers and guarantors (reusable component)

---

## Current State Analysis

### Household Step (Step 2)

- Occupants have `will_sign_lease: boolean` field
- Shows info note when checked but no action taken
- Data stored in `occupants_details` JSON array

### Support Step (Step 4)

- Co-signers: Manual add/remove, basic fields (name, email, phone, DOB, relationship, simplified employment/income)
- Guarantors: Manual add/remove, basic fields + consent checkboxes
- No link between `will_sign_lease` occupants and co-signers
- Financial input is minimal (just `employment_status`, `employer_name`, `job_title`, `net_monthly_income`)

### Financial Step (Step 3)

- Full financial input for main tenant via `EmploymentIncomeStep.tsx`
- Handles 6 employment statuses with conditional fields and documents
- NOT reusable - tightly coupled to profile fields with `profile_` prefix

---

## Implementation Plan

### Phase 1: Database & Models

#### 1.1 Add `from_occupant_index` field to `application_co_signers` table

**File:** New migration

```php
Schema::table('application_co_signers', function (Blueprint $table) {
    $table->tinyInteger('from_occupant_index')->nullable()->after('occupant_index');
    // When non-null, indicates this co-signer was auto-created from occupant at this index
    // and should not be manually removable
});
```

**Rationale:** Distinguish between auto-generated (from `will_sign_lease`) vs manually added co-signers.

#### 1.2 Update `ApplicationCoSigner` model

**File:** `app/Models/ApplicationCoSigner.php`

- Add `from_occupant_index` to `$fillable`
- Add helper method: `isFromOccupant(): bool`

---

### Phase 2: Reusable Financial Input Component

#### 2.1 Create `FinancialInfoSection.tsx`

**File:** `resources/js/components/application-wizard/shared/FinancialInfoSection.tsx`

**Purpose:** Reusable financial input component for tenant, co-signers, and guarantors.

**Props:**

```typescript
interface FinancialInfoSectionProps {
    // Prefix for field names (e.g., 'profile_', 'co_signers.0.', 'guarantors.0.')
    fieldPrefix: string;
    // Current values
    data: FinancialData;
    // Update handler
    onChange: (field: string, value: any) => void;
    // Validation errors
    errors: Record<string, string>;
    // Which entity type (affects available options)
    entityType: 'tenant' | 'co_signer' | 'guarantor';
    // Existing documents context (to skip re-upload requirements)
    existingDocs?: ExistingDocumentsContext;
    // Translations
    translations: Translations;
    // Whether to show document upload fields
    showDocuments?: boolean;
    // Blur handler for validation
    onBlur?: (field: string) => void;
}
```

**Employment statuses by entity type:**
| Status | Tenant | Co-Signer | Guarantor |
|--------|--------|-----------|-----------|
| employed | ✓ | ✓ | ✓ |
| self_employed | ✓ | ✓ | ✓ |
| student | ✓ | ✓ | ✗ |
| unemployed | ✓ | ✓ | ✗ |
| retired | ✓ | ✓ | ✓ |
| other | ✓ | ✓ | ✓ |

**Fields to extract from `EmploymentIncomeStep.tsx`:**

- Employment status selector (icon buttons)
- Employed fields: employer_name, job_title, employment_type, employment_start_date, gross_annual_income, net_monthly_income
- Self-employed fields: business_name, business_type, business_start_date, gross_annual_revenue, net_monthly_income
- Student fields: university_name, program_of_study, expected_graduation_date, student_income_source_type, student_monthly_income
- Retired fields: pension_type, pension_provider, pension_monthly_income, retirement_other_income
- Unemployed fields: unemployed_income_source, unemployment_benefits_amount
- Other fields: other_employment_situation, other_situation_monthly_income, other_situation_income_source
- Document uploads (conditional on `showDocuments` prop)

#### 2.2 Refactor `EmploymentIncomeStep.tsx`

**File:** `resources/js/components/application-wizard/steps/EmploymentIncomeStep.tsx`

- Extract financial input logic to `FinancialInfoSection.tsx`
- Use `FinancialInfoSection` with `entityType="tenant"` and `fieldPrefix="profile_"`
- Keep step-specific UI (header, progress, navigation)

---

### Phase 3: Frontend - Support Step Enhancement

#### 3.1 Update `useApplicationWizard.ts`

**File:** `resources/js/hooks/useApplicationWizard.ts`

**3.1.1 Enhance `CoSignerDetails` interface:**

```typescript
export interface CoSignerDetails {
    // Existing fields...
    from_occupant_index: number | null; // NEW: null = manually added, number = from occupant

    // Enhanced financial fields (match FinancialData structure)
    // Employed
    employment_type: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'zero_hours' | '';
    gross_annual_income: string;
    // Self-employed
    business_name: string;
    business_type: 'freelancer' | 'sole_proprietor' | 'limited_company' | 'partnership' | '';
    business_start_date: string;
    gross_annual_revenue: string;
    // Student
    program_of_study: string;
    expected_graduation_date: string;
    student_income_source_type: string;
    // Retired
    pension_type: string;
    pension_provider: string;
    pension_monthly_income: string;
    retirement_other_income: string;
    // Unemployed
    unemployed_income_source: string;
    unemployment_benefits_amount: string;
    // Other
    other_employment_situation: string;
    other_situation_income_source: string;
    // ... keep existing document fields
}
```

**3.1.2 Enhance `GuarantorDetails` interface:**

```typescript
export interface GuarantorDetails {
    // Existing fields...

    // Enhanced financial fields
    employment_type: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'zero_hours' | '';
    gross_annual_income: string;
    business_name: string;
    business_type: string;
    business_start_date: string;
    gross_annual_revenue: string;
    pension_type: string;
    pension_provider: string;
    pension_monthly_income: string;
    retirement_other_income: string;
    other_employment_situation: string;
    other_situation_income_source: string;
}
```

**3.1.3 Add `syncCoSignersFromOccupants()` function:**

```typescript
const syncCoSignersFromOccupants = useCallback(() => {
    setData((prev) => {
        const occupantsWithLease = prev.occupants_details.filter((o) => o.will_sign_lease);

        // Keep existing manual co-signers (from_occupant_index === null)
        const manualCoSigners = prev.co_signers.filter((cs) => cs.from_occupant_index === null);

        // Create/update co-signers for each will_sign_lease occupant
        const autoCoSigners = occupantsWithLease.map((occupant, occupantIndex) => {
            const actualIndex = prev.occupants_details.indexOf(occupant);
            const existing = prev.co_signers.find((cs) => cs.from_occupant_index === actualIndex);

            if (existing) {
                // Update name if occupant name changed, keep other fields
                return {
                    ...existing,
                    first_name: occupant.first_name,
                    last_name: occupant.last_name,
                    date_of_birth: occupant.date_of_birth,
                    relationship: occupant.relationship,
                    relationship_other: occupant.relationship_other,
                };
            }

            // Create new co-signer from occupant
            return createCoSignerFromOccupant(occupant, actualIndex);
        });

        return {
            ...prev,
            co_signers: [...autoCoSigners, ...manualCoSigners],
        };
    });
}, []);
```

**3.1.4 Call sync when entering Support step or when occupants change:**

```typescript
// In goToStep or similar
if (targetStep === 'risk' || targetStepIndex === 3) {
    syncCoSignersFromOccupants();
}
```

**3.1.5 Update `removeCoSigner()` to prevent removal of auto-generated:**

```typescript
const removeCoSigner = (index: number) => {
    setData((prev) => {
        const coSigner = prev.co_signers[index];
        if (coSigner.from_occupant_index !== null) {
            // Cannot remove auto-generated co-signer
            console.warn('Cannot remove co-signer linked to occupant');
            return prev;
        }
        return {
            ...prev,
            co_signers: prev.co_signers.filter((_, i) => i !== index),
        };
    });
};
```

#### 3.2 Update `SupportStep.tsx`

**File:** `resources/js/components/application-wizard/steps/SupportStep.tsx`

**3.2.1 Replace simplified financial fields with `FinancialInfoSection`:**

```tsx
{
    data.co_signers.map((coSigner, index) => (
        <div key={index} className="rounded-lg border p-4">
            {/* Header with name and remove button */}
            <div className="mb-4 flex items-center justify-between">
                <h4 className="font-medium">
                    {coSigner.first_name} {coSigner.last_name}
                    {coSigner.from_occupant_index !== null && <span className="ml-2 text-xs text-muted-foreground">(Lease signer)</span>}
                </h4>
                {coSigner.from_occupant_index === null && (
                    <button onClick={() => removeCoSigner(index)}>
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Identity section (existing) */}
            {/* ... */}

            {/* Financial section (NEW - reusable component) */}
            <FinancialInfoSection
                fieldPrefix={`co_signers.${index}.`}
                data={coSigner}
                onChange={(field, value) => updateCoSigner(index, field, value)}
                errors={getCoSignerErrors(index)}
                entityType="co_signer"
                translations={translations}
                showDocuments={true}
                onBlur={(field) => markCoSignerFieldTouched(index, field)}
            />
        </div>
    ));
}
```

**3.2.2 Same pattern for guarantors:**

```tsx
<FinancialInfoSection
    fieldPrefix={`guarantors.${index}.`}
    data={guarantor}
    onChange={(field, value) => updateGuarantor(index, field, value)}
    errors={getGuarantorErrors(index)}
    entityType="guarantor"
    translations={translations}
    showDocuments={true}
    onBlur={(field) => markGuarantorFieldTouched(index, field)}
/>
```

**3.2.3 Section headers with counts:**

```tsx
<h3 className="flex items-center gap-2">
    <Users className="h-5 w-5" />
    Co-Signers ({autoCoSignersCount} from household, {manualCoSignersCount} additional)
</h3>
```

---

### Phase 4: Frontend Validation

#### 4.1 Update `application-schemas.ts`

**File:** `resources/js/lib/validation/application-schemas.ts`

**4.1.1 Create `financialInfoSchema` factory:**

```typescript
export function createFinancialInfoSchema(entityType: 'tenant' | 'co_signer' | 'guarantor') {
    const availableStatuses =
        entityType === 'guarantor'
            ? ['employed', 'self_employed', 'retired', 'other']
            : ['employed', 'self_employed', 'student', 'unemployed', 'retired', 'other'];

    return z
        .object({
            employment_status: z.enum(availableStatuses as [string, ...string[]]),
            // Conditional fields via superRefine...
        })
        .superRefine((data, ctx) => {
            // Same logic as current employment step but parameterized
        });
}
```

**4.1.2 Update `coSignerSchema`:**

```typescript
export const coSignerSchema = z
    .object({
        from_occupant_index: z.number().nullable(),
        // Identity fields...
        first_name: z.string().min(1, 'First name is required'),
        last_name: z.string().min(1, 'Last name is required'),
        // ... existing identity fields
    })
    .merge(createFinancialInfoSchema('co_signer'));
```

**4.1.3 Update `guarantorSchema`:**

```typescript
export const guarantorSchema = z
    .object({
        // Identity and address fields...
    })
    .merge(createFinancialInfoSchema('guarantor'));
```

**4.1.4 Update `createSupportStepSchema`:**

- Include enhanced co-signer validation
- Include enhanced guarantor validation
- Ensure validation passes for auto-generated co-signers

#### 4.2 Add error messages

**File:** `resources/js/lib/validation/application-schemas.ts`

Add to `APPLICATION_MESSAGES`:

```typescript
co_signer_employment_status: {
    required: 'Employment status is required for co-signer',
},
co_signer_employer_name: {
    required: 'Employer name is required for employed co-signer',
},
// ... etc for all new fields
```

---

### Phase 5: Backend Validation

#### 5.1 Update `StoreApplicationRequest.php`

**File:** `app/Http/Requests/StoreApplicationRequest.php`

**5.1.1 Add `from_occupant_index` rule:**

```php
'co_signers.*.from_occupant_index' => 'nullable|integer|min:0',
```

**5.1.2 Enhance co-signer financial rules:**

```php
'co_signers.*.employment_type' => 'nullable|in:full_time,part_time,contract,temporary,zero_hours',
'co_signers.*.gross_annual_income' => 'nullable|numeric|min:0',
'co_signers.*.business_name' => 'nullable|string|max:200',
'co_signers.*.business_type' => 'nullable|in:freelancer,sole_proprietor,limited_company,partnership',
'co_signers.*.business_start_date' => 'nullable|date|before_or_equal:today',
'co_signers.*.gross_annual_revenue' => 'nullable|numeric|min:0',
'co_signers.*.program_of_study' => 'nullable|string|max:200',
'co_signers.*.expected_graduation_date' => 'nullable|date|after:today',
'co_signers.*.student_income_source_type' => 'nullable|in:scholarship,stipend,part_time_job,parental_support,student_loan,savings,other',
'co_signers.*.pension_type' => 'nullable|in:state_pension,employer_pension,private_pension,annuity,other',
'co_signers.*.pension_provider' => 'nullable|string|max:200',
'co_signers.*.pension_monthly_income' => 'nullable|numeric|min:0',
'co_signers.*.retirement_other_income' => 'nullable|numeric|min:0',
'co_signers.*.unemployed_income_source' => 'nullable|in:unemployment_benefits,severance_pay,savings,family_support,rental_income,investment_income,alimony,social_assistance,disability_allowance,freelance_gig,other',
'co_signers.*.unemployment_benefits_amount' => 'nullable|numeric|min:0',
'co_signers.*.other_employment_situation' => 'nullable|in:parental_leave,disability,sabbatical,career_break,medical_leave,caregiver,homemaker,volunteer,gap_year,early_retirement,military_service,other',
'co_signers.*.other_situation_income_source' => 'nullable|string|max:200',
```

**5.1.3 Add conditional rules in `withValidator`:**

```php
$validator->sometimes('co_signers.*.employer_name', 'required|string|max:200', function ($input, $item) {
    return in_array($item->employment_status ?? '', ['employed', 'self_employed']);
});
// ... similar for other conditional fields
```

**5.1.4 Same pattern for guarantors**

#### 5.2 Add messages

```php
'co_signers.*.employment_status.required' => 'Employment status is required for co-signer',
'co_signers.*.employer_name.required' => 'Employer name is required for employed co-signer',
// ... match frontend messages
```

---

### Phase 6: Translations

#### 6.1 Update `resources/lang/en/wizard.php`

```php
'support' => [
    'title' => 'Financial Support',
    'co_signers' => [
        'title' => 'Co-Signers',
        'description' => 'People who will sign the lease alongside you',
        'from_household' => 'From household',
        'additional' => 'Additional',
        'add' => 'Add Co-Signer',
        'lease_signer_badge' => 'Lease signer',
        'cannot_remove' => 'This co-signer is linked to a household member who will sign the lease',
    ],
    'guarantors' => [
        'title' => 'Guarantors',
        'description' => 'People who will guarantee your rental obligations',
        'add' => 'Add Guarantor',
        'for_primary' => 'For primary applicant',
        'for_co_signer' => 'For co-signer: :name',
    ],
    'financial' => [
        'section_title' => 'Financial Information',
        'employment_status' => 'Employment Status',
        'select_status' => 'Select your employment status',
        // ... all employment-specific labels
    ],
],
```

#### 6.2 Copy to other languages

**Files:**

- `resources/lang/fr/wizard.php`
- `resources/lang/de/wizard.php`
- `resources/lang/nl/wizard.php`

---

### Phase 7: Controller Updates

#### 7.1 Update `ApplicationController.php`

**File:** `app/Http/Controllers/ApplicationController.php`

**7.1.1 In `saveDraft()` - sync co-signers:**

```php
// When saving draft, ensure co-signers match will_sign_lease occupants
$occupantsWithLease = collect($data['occupants_details'] ?? [])
    ->filter(fn($o) => $o['will_sign_lease'] ?? false);

// Create/update ApplicationCoSigner records for each
foreach ($occupantsWithLease as $index => $occupant) {
    $application->coSigners()->updateOrCreate(
        ['from_occupant_index' => $index],
        [
            'first_name' => $occupant['first_name'],
            'last_name' => $occupant['last_name'],
            // ... other fields from request
        ]
    );
}

// Remove auto-generated co-signers for occupants no longer signing
$application->coSigners()
    ->whereNotNull('from_occupant_index')
    ->whereNotIn('from_occupant_index', $occupantsWithLease->keys())
    ->delete();
```

---

## File Summary

### New Files

| File                                                                              | Purpose                  |
| --------------------------------------------------------------------------------- | ------------------------ |
| `database/migrations/XXXX_add_from_occupant_index_to_application_co_signers.php`  | Migration for new field  |
| `resources/js/components/application-wizard/shared/FinancialInfoSection.tsx`      | Reusable financial input |
| `resources/js/components/application-wizard/shared/FinancialInfoSection.types.ts` | Types for component      |

### Modified Files

| File                                                                        | Changes                                            |
| --------------------------------------------------------------------------- | -------------------------------------------------- |
| `app/Models/ApplicationCoSigner.php`                                        | Add `from_occupant_index`, helper methods          |
| `resources/js/hooks/useApplicationWizard.ts`                                | Enhanced interfaces, sync logic, remove prevention |
| `resources/js/components/application-wizard/steps/SupportStep.tsx`          | Use reusable component, show badges                |
| `resources/js/components/application-wizard/steps/EmploymentIncomeStep.tsx` | Refactor to use shared component                   |
| `resources/js/lib/validation/application-schemas.ts`                        | Enhanced schemas, shared financial validation      |
| `app/Http/Requests/StoreApplicationRequest.php`                             | Enhanced rules for co-signers/guarantors           |
| `app/Http/Controllers/ApplicationController.php`                            | Sync co-signers from occupants                     |
| `resources/lang/{en,fr,de,nl}/wizard.php`                                   | New translation keys                               |

---

## Testing Requirements

### Unit Tests

- `FinancialInfoSection` renders correct fields per employment status
- `createFinancialInfoSchema` validates correctly per entity type
- `syncCoSignersFromOccupants` correctly creates/updates/removes co-signers

### Feature Tests

- Auto-generated co-signers appear in Support step
- Cannot remove auto-generated co-signers (UI + backend)
- Can remove manually added co-signers
- Financial validation works for all employment statuses
- Changes to `will_sign_lease` in Household step reflect in Support step
- Draft saves include enhanced co-signer/guarantor financial data
- Submission validates all co-signer/guarantor financial info

### Browser Tests (Pest v4)

- Full wizard flow with household members signing lease
- Financial info entry for co-signers and guarantors
- Validation error display and correction
- Step navigation with incomplete financial info

---

## Implementation Order

1. **Phase 1:** Database migration + model update
2. **Phase 2:** Create `FinancialInfoSection` component
3. **Phase 3:** Update `useApplicationWizard` hook with sync logic
4. **Phase 4:** Update `SupportStep` to use new component
5. **Phase 5:** Update frontend validation schemas
6. **Phase 6:** Update backend validation rules
7. **Phase 7:** Update controller sync logic
8. **Phase 8:** Add translations
9. **Phase 9:** Refactor `EmploymentIncomeStep` to use shared component
10. **Phase 10:** Write tests
