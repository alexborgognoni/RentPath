# Support Step (Co-Signers & Guarantors) Fix Plan

## Current State

### GuarantorDetails Interface

The interface has these field groups:

- **Identity**: first_name, last_name, email, phone_country_code, phone_number, date_of_birth, nationality, relationship, relationship_other
- **ID Document**: id_document_type, id_number, id_issuing_country, id_expiry_date, id_document_front, id_document_back
- **Address**: street_address, city, state_province, postal_code, country, years_at_address, proof_of_residence
- **Financial**: employment_status, employer_name, job_title, net_monthly_income, income_currency, proof_of_income, credit_report
- **Consent**: consent_to_credit_check, consent_to_contact, guarantee_consent_signed

### Current UI (SupportStep.tsx)

Shows only:

- First name, last name
- Email, phone (plain text input, NOT using PhoneInput component)
- Relationship (dropdown with "other" option)
- Basic address: street_address, city, postal_code (NOT using AddressForm component)
- FinancialInfoSection with `entityType="guarantor"`
- Flat layout (NOT using collapsible card pattern from HouseholdStep)

### Current Validation (riskMitigationStepSchema)

Only validates:

- email (required)
- phone_number (required)
- Financial fields via `validateFinancialFields(guarantor, 'guarantor')`

**Missing validation for**: first_name, last_name, relationship, address fields

---

## Proposed Changes

### 1. Update GuarantorDetails Interface

Align address fields with AddressForm component:

```typescript
// Old:
street_address: string;

// New:
street_name: string;
house_number: string;
address_line_2: string;
```

### 2. Use PhoneInput Component (like IdentityStep)

Replace plain phone text inputs with the `PhoneInput` component for both co-signers and guarantors:

**Reference**: `resources/js/components/ui/phone-input.tsx`

```tsx
// Current: plain text input
<input type="tel" value={guarantor.phone_number} ... />

// New: PhoneInput component with country selector
<PhoneInput
    value={guarantor.phone_number}
    countryCode={guarantor.phone_country_code}
    onChange={(phoneNumber, countryCode) => {
        updateGuarantor(index, 'phone_number', phoneNumber);
        updateGuarantor(index, 'phone_country_code', countryCode);
    }}
    onBlur={handleGuarantorFieldBlur(index, 'phone_number')}
    error={getGuarantorError(index, 'phone_number')}
/>
```

Features:

- Country selector dropdown (SearchableSelect in compact mode) with flag + dial code
- Phone number input (digits only, national format)
- Stores `phone_country_code` (e.g., "+31") and `phone_number` (e.g., "612345678") separately
- Uses libphonenumber validation

### 3. Use Collapsible Card Layout (like HouseholdStep)

Replace flat layout with collapsible sections for better UX:

**Reference pattern from HouseholdStep:**

```tsx
// Section state
const [expandedSections, setExpandedSections] = useState({
    coSigners: true, // First section expanded by default
    guarantors: false,
    insurance: false,
});

const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
};

// Card structure
<div className="rounded-lg border border-border bg-card">
    <button type="button" onClick={() => toggleSection('coSigners')} className="flex w-full cursor-pointer items-center justify-between p-4">
        <div className="flex items-center gap-3">
            <Users size={20} className="text-primary" />
            <div className="flex items-center gap-2">
                <h3 className="font-semibold">Co-Signers</h3>
                {data.co_signers.length > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.co_signers.length}</span>
                )}
            </div>
        </div>
        {expandedSections.coSigners ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>

    {expandedSections.coSigners && (
        <div className="space-y-4 border-t border-border p-4">
            {/* Individual co-signer cards */}
            {data.co_signers.map((coSigner, index) => (
                <div key={index} className="rounded-lg border border-border p-4">
                    {/* Header with index & remove button */}
                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-medium">Co-Signer {index + 1}</h4>
                        <button onClick={() => removeCoSigner(index)} className="text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    {/* Fields */}
                </div>
            ))}
            {/* Add button */}
            <button onClick={addCoSigner} className="flex items-center gap-2 text-primary">
                <Plus size={16} />
                Add Co-Signer
            </button>
        </div>
    )}
</div>;
```

Features:

- Auto-expand sections with validation errors
- Count badges showing number of entries
- Chevron icons for collapse/expand indication
- Lucide icons: Users, Shield, ChevronUp, ChevronDown, Plus, Trash2

### 4. Update SupportStep UI

- Replace manual address fields with `<AddressForm>` component
- Keep using `FinancialInfoSection` with `entityType="guarantor"`

### 5. FinancialInfoSection Must Include Document Uploads

The FinancialInfoSection component MUST be identical everywhere it's used (tenant, co-signer, guarantor). Currently missing from co-signers/guarantors:

**Required document uploads (same as Financial step for tenant):**

- Proof of income (payslips, tax returns, etc.)
- Bank statements (if applicable)
- Employment contract (if employed)

The reusable component should handle all document uploads internally based on `entityType`, storing to the appropriate fields:

- `proof_of_income`
- `bank_statements`
- `employment_contract`

**No discrepancy allowed** - if the tenant sees document uploads in FinancialInfoSection, co-signers and guarantors must see the exact same uploads.

### 6. Update Validation Schema (riskMitigationStepSchema)

Add validation for:

- `first_name` (required)
- `last_name` (required)
- `relationship` (required, with relationship_other if "other" selected)
- Address fields: street_name, house_number, city, postal_code, country (required)
- Phone validation using libphonenumber (same as identity step)
- Document uploads validation (same rules as tenant financial step)

### 7. Update markAllCurrentStepFieldsTouched

Add guarantor fields:

- `guarantor_${index}_first_name`
- `guarantor_${index}_last_name`
- `guarantor_${index}_relationship`
- `guarantor_${index}_phone_country_code`
- Address fields with guarantor prefix
- Document upload fields

---

## Clarified Requirements (User Answers)

### 1. Co-Signers & Guarantors Need FULL Personal Details (like Identity Step)

Both co-signers and guarantors need the same personal details as the tenant's Identity step:

- First name, last name
- Email, phone (with PhoneInput component)
- Date of birth
- Nationality
- **Plus**: Relationship field (unique to co-signers/guarantors)

**Special case - Lease Signer Co-Signers**: When synced from occupants who marked "will sign lease", some fields are pre-filled and should be **unmodifiable** (disabled).

### 2. Full ID Document Section Required

Both co-signers and guarantors need complete ID document capture (same as tenant Identity step):

- Document type (passport, national_id, drivers_license, residence_permit)
- ID number
- Issuing country
- Expiry date (DatePicker with `restriction="strictFuture"`)
- Front image upload
- Back image upload (optional for passports)

### 3. Address Section - AddressForm Component

Both co-signers and guarantors need full address using the `AddressForm` component:

- **Required fields**: street_name, house_number, city, postal_code, country
- **Optional fields**: address_line_2, state_province (conditional on country)

**Database migration required**: Rename `street_address` → `street_name`, add `house_number`, `address_line_2` columns.

### 4. Financial Section - Identical Everywhere

- **Employment statuses**: Same options as tenant (employed, self_employed, student, unemployed, retired, other)
- **Document uploads**: MUST include proof_of_income, bank_statements, employment_contract - identical to Financial step
- Remove the limited guarantor-only status list

### 5. Financial Document Uploads Required

Pass `renderDocuments` prop to FinancialInfoSection with these uploads:

- **proof_of_income**: Payslips, tax returns, employment verification letters
- **bank_statements**: Recent bank statements (3-6 months)
- **employment_contract**: Current employment contract (if employed)

Documents should be status-conditional (e.g., employment_contract only for employed status).

### 6. Collapsible Layout - Same as HouseholdStep

- **Order**: 1. Co-Signers → 2. Guarantors → 3. Rent Guarantee Insurance
- **Visibility**: All sections always visible (even if empty)
- **Expansion**: First section expanded by default, others collapsed
- **Auto-expand**: Sections with validation errors auto-expand

---

## Design Guidelines (from DESIGN.md)

These patterns MUST be followed during implementation:

### 1. Unified Validation Architecture - Single Source of Truth

The wizard uses ONE validation function for ALL scenarios. No discrepancy allowed between:

- Clicking "Continue" (validates current step)
- Page refresh/mount (validates all steps to determine max valid step)

```typescript
// ONLY modify validateApplicationStep() in application-schemas.ts
// The wizard automatically uses it everywhere
const result = validateStepFn(steps[i].id, data);
```

**Rule**: When adding validation for co-signers/guarantors, ONLY modify `riskMitigationStepSchema` in `application-schemas.ts`.

### 2. Per-Field Blur Pattern

Show validation errors only after user has interacted with specific field:

```typescript
// CORRECT: Mark touched on blur, not on change
onBlur={createIndexedBlurHandler('guarantor', index, 'first_name')}

// WRONG: Never mark touched in onChange
onChange={(e) => {
    updateGuarantor(index, 'first_name', e.target.value);
    // DON'T mark touched here!
}}
```

**Prefixes**: `occupant`, `pet`, `ref`, `cosigner`, `guarantor`, `prevaddr`, `landlordref`, `otherref`

Error display requires BOTH conditions:

```typescript
{touchedFields[fieldKey] && errors[fieldKey] && <p className="text-destructive">{errors[fieldKey]}</p>}
```

### 3. ExistingDocumentsContext for Document Validation

Document validation must check both new uploads AND existing documents:

```typescript
// Validation passes if EITHER new file uploaded OR existing doc present
if (!data.guarantor_proof_of_income && !existingDocs.guarantor_proof_of_income) {
    addError('Proof of income is required');
}
```

### 4. aria-invalid on All Inputs

ALL form inputs must set `aria-invalid` for scroll-to-first-error to work:

```tsx
<input aria-invalid={!!getError(index, 'first_name')} className={hasError ? 'border-destructive bg-destructive/5' : 'border-border'} />
```

### 5. "Other" Option Pattern

When dropdown has "Other" option, MUST show required text field:

```typescript
// If relationship === 'other', relationship_other is required
if (guarantor.relationship === 'other' && !guarantor.relationship_other?.trim()) {
    ctx.addIssue({ path: [`guarantor_${index}_relationship_other`], message: 'Please specify relationship' });
}
```

### 6. Backend Validation Must Match Frontend

- Frontend: Zod schema in `application-schemas.ts`
- Backend: Laravel Form Request (StoreApplicationRequest.php)
- IDENTICAL error messages in both

### 7. Step Locking Behavior

If user edits step N and makes it invalid while on step N+2:

- User gets locked to step N
- `maxStepReached` reduced to N
- Data from later steps preserved but inaccessible

### 8. DatePicker Restrictions

Use appropriate restriction prop:

- `restriction="past"` - Date of birth
- `restriction="future"` - Move-in date
- `restriction="strictFuture"` - ID expiry (must be AFTER today)

### 9. Validation UX Feedback

When "Continue" clicked with invalid data:

1. **Button shake animation** - immediate visual feedback
2. **Scroll to first error** - finds first `[aria-invalid="true"]` element and scrolls + focuses

This requires `aria-invalid` on ALL form inputs.

### 10. markAllCurrentStepFieldsTouched

When user clicks "Continue", ALL fields for current step must be marked as touched so errors display:

```typescript
// In useApplicationWizard.ts - markAllCurrentStepFieldsTouched()
if (wizard.currentStep === 'support') {
    wizard.data.co_signers.forEach((_, index) => {
        newTouched[`cosigner_${index}_first_name`] = true;
        newTouched[`cosigner_${index}_last_name`] = true;
        // ... ALL cosigner fields
    });
    wizard.data.guarantors.forEach((_, index) => {
        newTouched[`guarantor_${index}_first_name`] = true;
        // ... ALL guarantor fields
    });
}
```

**Critical**: Every field that has validation MUST be included here, otherwise errors won't show on "Continue" click.

### 11. Field Path Naming Convention

Schema errors use flat paths with index embedded:

- `cosigner_${index}_${field}` (e.g., `cosigner_0_first_name`)
- `guarantor_${index}_${field}` (e.g., `guarantor_1_email`)

NOT nested paths like `co_signers.0.first_name` - that causes path mismatch bugs.

---

## Implementation Steps

### Phase 0: Database & Backend Changes

1. **Create database migration** for co_signers table:
    - Add address fields: street_name, house_number, address_line_2, city, state_province, postal_code, country
    - Add ID document fields if missing: id_document_type, id_number, id_issuing_country, id_expiry_date
    - Ensure all fields are nullable (for draft saves)

2. **Create database migration** for guarantors table:
    - Rename `street_address` → `street_name`
    - Add `house_number`, `address_line_2` columns
    - Add ID document fields if missing

3. **Update Eloquent Models** (CoSigner.php, Guarantor.php):
    - Add new fields to $fillable
    - Update $casts if needed

4. **Update StoreApplicationRequest.php** validation:
    - Add validation rules for all new fields (personal details, ID, address, financial docs)
    - Match validation rules with frontend Zod schemas

### Phase 1: Frontend Data Layer Updates

5. **Update `CoSignerDetails` interface** in useApplicationWizard.ts:
    - Ensure all Identity-step fields exist: first_name, last_name, email, phone_country_code, phone_number, date_of_birth, nationality
    - Ensure AddressForm fields: street_name, house_number, address_line_2, city, state_province, postal_code, country
    - Ensure ID document fields: id_document_type, id_number, id_issuing_country, id_expiry_date, id_document_front, id_document_back
    - Ensure financial document fields: proof_of_income, bank_statements, employment_contract
    - Add `is_synced_from_occupant` flag to track lease-signer co-signers (for disabled state)

6. **Update `GuarantorDetails` interface** similarly:
    - Same personal details, ID, address, and financial fields as co-signers
    - Rename `street_address` → `street_name`, add `house_number`, `address_line_2`

7. **Update `addCoSigner` and `addGuarantor` functions** to initialize all new fields

8. **Update FinancialInfoSection component**:
    - Add `allowedStatuses` prop to customize employment status options (or remove guarantor-specific limitation)
    - Ensure document uploads are included and work for all entity types
    - Verify identical behavior for tenant/co-signer/guarantor

### Phase 2: UI - Collapsible Card Layout

9. **Refactor SupportStep.tsx** to use collapsible card layout (like HouseholdStep):
    - Add `expandedSections` state: `{ coSigners: true, guarantors: false, insurance: false }`
    - Add `toggleSection` function
    - Add auto-expand on error useEffect
    - Structure: Card with button header → Chevron toggle → Conditional content

10. **Add section headers** with icons and count badges:
    - Co-Signers: Users icon + count badge
    - Guarantors: Shield icon + count badge
    - Insurance: appropriate icon

### Phase 3: UI - Personal Details Section (like Identity Step)

11. **Co-Signer personal details**:
    - First name, last name (disabled if synced from occupant)
    - Email (editable)
    - PhoneInput component (phone_country_code + phone_number)
    - DatePicker for date_of_birth (disabled if synced from occupant)
    - Nationality dropdown
    - Relationship dropdown (with "other" text field)

12. **Guarantor personal details**: Same as co-signer but all fields editable

13. **Handle disabled state** for lease-signer co-signers:
    - Check `from_occupant_index !== null` flag
    - Disable: first_name, last_name, date_of_birth (pre-filled from occupant)
    - Keep editable: email, phone, relationship, ID, address, financial

### Phase 4: UI - ID Document Section

14. **Add ID Document section** for both co-signers and guarantors:
    - Document type dropdown (passport, national_id, drivers_license, residence_permit)
    - ID number text input
    - Issuing country dropdown
    - Expiry date DatePicker (restriction="strictFuture")
    - Front image upload (required)
    - Back image upload (optional for passports)

### Phase 5: UI - Address & Financial Sections

15. **Replace manual address fields** with `<AddressForm>` component for both co-signers and guarantors

16. **Update FinancialInfoSection usage**:
    - Remove guarantor-specific employment status limitation (all 6 statuses for everyone)
    - Pass `renderDocuments` prop with document upload components
    - Document uploads: proof_of_income, bank_statements, employment_contract

### Phase 6: Validation Updates

17. **Update `riskMitigationStepSchema`** to validate all fields:
    - Personal: first_name, last_name, email, phone (with libphonenumber), date_of_birth, nationality, relationship
    - ID Document: id_document_type, id_number, id_issuing_country, id_expiry_date
    - Address: street_name, house_number, city, postal_code, country (same rules as Identity step)
    - Financial: employment_status, income fields, document uploads (same rules as Financial step)

18. **Update `markAllCurrentStepFieldsTouched`** to include ALL fields for co-signers and guarantors

19. **Update handler functions** (`createCoSignerHandlers`, `createGuarantorHandlers`):
    - AddressForm compatibility
    - PhoneInput compatibility
    - Document upload handlers

### Phase 7: Backend Validation

20. **Update StoreApplicationRequest.php** to validate all new fields with identical rules

### Phase 8: Testing

21. Test validation consistency between UI and schema
22. Test collapsible behavior with validation errors (auto-expand)
23. Test phone validation with different country codes
24. Test document uploads for co-signers and guarantors
25. Test disabled fields for lease-signer co-signers synced from occupants
26. Test that FinancialInfoSection is identical across tenant/co-signer/guarantor
27. Test ID document section with different document types
