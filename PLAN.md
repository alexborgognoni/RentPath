# Tenant Profile & Application Data Flow - Gap Analysis & Implementation Plan

## Executive Summary

The current application system has a **critical disconnect** between tenant profile data and the application submission flow. When a tenant submits an application, the system attempts to snapshot their profile data (employment, income, documents), but this data is never collected because:

1. The application wizard only collects **application-specific data** (move-in date, occupants, pets, references)
2. The tenant profile is **auto-created empty** when starting an application
3. There's **no step in the wizard** to collect financial/employment information
4. **Result**: Property managers receive applications with all profile snapshot fields as `null`

---

## Current Architecture Analysis

### What the Application Wizard Currently Collects

```
Step 1: Details          → Move-in preferences, occupants, pets
Step 2: References       → Previous landlord, personal references
Step 3: Emergency        → Emergency contact (pre-filled from profile if exists)
Step 4: Documents        → Application-specific documents only
```

### What Gets Snapshotted (But Is Empty)

The `snapshotProfileData()` method in `ApplicationController.php:591` attempts to capture:

| Category   | Fields                                                               | Source        |
| ---------- | -------------------------------------------------------------------- | ------------- |
| Employment | status, employer, job title, start date, type, income                | TenantProfile |
| Address    | house number, street, city, postal code, country                     | TenantProfile |
| Student    | university, program, graduation date                                 | TenantProfile |
| Guarantor  | has_guarantor, name, relationship, income                            | TenantProfile |
| Documents  | ID, employment contract, payslips (3), student proof, guarantor docs | TenantProfile |

**Problem**: None of this is collected anywhere in the application flow.

### Data Flow Diagram

```
Current Flow (Broken):
┌─────────────────────────────────────────────────────────────────────┐
│  User starts application                                             │
│         ↓                                                            │
│  TenantProfile auto-created (EMPTY)                                  │
│         ↓                                                            │
│  Wizard Step 1-4 (no profile data collected)                         │
│         ↓                                                            │
│  Submit → snapshotProfileData() → ALL NULLS                          │
│         ↓                                                            │
│  Manager receives application with NO financial/employment data      │
└─────────────────────────────────────────────────────────────────────┘

Expected Flow:
┌─────────────────────────────────────────────────────────────────────┐
│  User starts application                                             │
│         ↓                                                            │
│  TenantProfile auto-created OR existing profile loaded               │
│         ↓                                                            │
│  Wizard collects/verifies profile data (employment, income, docs)    │
│         ↓                                                            │
│  Profile data saved to TenantProfile (reusable for future apps)     │
│         ↓                                                            │
│  Submit → snapshotProfileData() → Captures current profile state    │
│         ↓                                                            │
│  Manager receives complete application                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Industry Best Practices (Research Summary)

### Portable/Reusable Tenant Profiles

- **One profile, multiple applications**: Tenants build their profile once and reuse it across applications
- **Snapshot at submission time**: Profile data is frozen when submitted, so later profile updates don't affect past applications
- **6 US states have laws** requiring landlords to accept portable screening reports (Colorado, New York, Rhode Island)

### Wizard UX Best Practices

- **Branching based on user type**: Different fields for employed vs student vs retired
- **Progressive disclosure**: Show relevant fields based on previous answers
- **Pre-fill from existing data**: Reduce friction for returning users
- **Step count < 10**: Keep cognitive load manageable

### Key Insight

> "Airbnb's onboarding process for new hosts breaks down each part of the process, guiding hosts with simpler steps. Upwork allows freelancers to preview their profiles as they go."
> — [Eleken: Wizard UI Pattern](https://www.eleken.co/blog-posts/wizard-ui-pattern-explained)

---

## Proposed Solution: Hybrid Profile-Application Wizard

### Design Philosophy

1. **Collect profile data inline** during the application wizard (not a separate flow)
2. **Save to TenantProfile** so data is reusable across applications
3. **Pre-fill from existing profile** for returning users
4. **Snapshot on submit** to freeze data for that specific application
5. **Branching logic** based on employment status

### New Wizard Structure

```
Step 1: Personal Info (NEW)
  - Date of birth, nationality, phone
  - Current address
  - Pre-filled from TenantProfile if exists

Step 2: Employment & Income (NEW)
  - Employment status (branching point)
  - If Employed/Self-Employed: employer, job title, income, contract, payslips
  - If Student: university, program, graduation, student proof
  - If Unemployed/Retired: alternative income source
  - Guarantor option (always available)

Step 3: Application Details (existing Step 1)
  - Move-in preferences
  - Occupants, pets

Step 4: References (existing Step 2)
  - Previous landlord
  - Personal references

Step 5: Emergency Contact (existing Step 3)
  - Pre-filled from profile

Step 6: Documents (existing Step 4)
  - ID document (required, from profile)
  - Additional application-specific documents

Step 7: Review & Submit (NEW)
  - Summary of all data
  - Confirm and submit
```

### Data Synchronization

```
┌──────────────────────────────────────────────────────────────────┐
│                    On Each Step Save (Autosave)                   │
├──────────────────────────────────────────────────────────────────┤
│  Profile Fields → Save to TenantProfile (for reuse)              │
│  Application Fields → Save to Application draft                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    On Submit                                      │
├──────────────────────────────────────────────────────────────────┤
│  1. Final save to TenantProfile                                   │
│  2. snapshotProfileData() → Copy profile fields to application   │
│  3. Save application with status='submitted'                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Implementation Tasks

### Phase 1: Backend Foundation

#### 1.1 Create Form Request Classes

- [ ] `StoreApplicationStep1Request` - Personal info validation
- [ ] `StoreApplicationStep2Request` - Employment/income validation (with branching)
- [ ] Update existing step validations to use Form Requests
- [ ] Create unified `SubmitApplicationRequest` for final validation

#### 1.2 Update ApplicationController

- [ ] Add `saveProfileDataFromWizard()` method to sync wizard data to TenantProfile
- [ ] Update `saveDraft()` to handle new profile fields
- [ ] Update `store()` to save profile data before snapshotting
- [ ] Add validation for required profile fields on submit

#### 1.3 Database Considerations

- [ ] Verify all profile fields are properly snapshotted (some may be missing)
- [ ] Consider adding `snapshot_date_of_birth`, `snapshot_nationality`, `snapshot_phone` to applications table
- [ ] Add migration if new snapshot fields needed

### Phase 2: Frontend Wizard Restructure

#### 2.1 New Wizard Steps

- [ ] Create `PersonalInfoStep` component
- [ ] Create `EmploymentIncomeStep` component with branching UI
- [ ] Create `ReviewStep` component for final confirmation
- [ ] Update `APPLICATION_STEPS` configuration

#### 2.2 Update useApplicationWizard Hook

- [ ] Add new data fields to `ApplicationWizardData` interface
- [ ] Add profile field pre-filling from `tenantProfile` prop
- [ ] Update validation schemas for new steps
- [ ] Handle file uploads for profile documents (ID, payslips, etc.)

#### 2.3 Branching Logic

- [ ] Implement employment status branching in `EmploymentIncomeStep`
- [ ] Show/hide fields based on status (employed, student, etc.)
- [ ] Adjust validation based on employment type

### Phase 3: Validation Schemas

#### 3.1 Zod Schemas (Frontend)

- [ ] Create `personalInfoStepSchema`
- [ ] Create `employmentIncomeStepSchema` with conditional validation
- [ ] Update `validateApplicationStep()` for new steps
- [ ] Update `validateApplicationForSubmit()` for complete validation

#### 3.2 Laravel Validation (Backend)

- [ ] Mirror Zod schemas in Form Request classes
- [ ] Add conditional rules based on employment status
- [ ] Ensure frontend/backend validation parity

### Phase 4: Document Handling

#### 4.1 Profile Documents vs Application Documents

- [ ] Clarify which documents belong to profile (reusable) vs application (one-time)
- [ ] ID document → Profile (reusable)
- [ ] Payslips → Profile (reusable, can be updated)
- [ ] Reference letter → Application-specific
- [ ] Update document upload logic accordingly

#### 4.2 Document Display

- [ ] Show existing profile documents in wizard (with option to replace)
- [ ] Indicate which documents are already on file
- [ ] Allow skipping upload if document exists

### Phase 5: Pre-fill & UX

#### 5.1 Pre-fill Logic

- [ ] Load existing TenantProfile data into wizard initial state
- [ ] Indicate which fields are pre-filled
- [ ] Allow editing of pre-filled data

#### 5.2 Progress Indicators

- [ ] Update progress calculation for new step count
- [ ] Show profile completeness indicator
- [ ] Add step descriptions for new steps

### Phase 6: Testing

#### 6.1 Feature Tests

- [ ] Test new user application flow (empty profile)
- [ ] Test returning user application flow (existing profile)
- [ ] Test branching logic (employed vs student vs unemployed)
- [ ] Test profile data synchronization
- [ ] Test snapshot integrity

#### 6.2 Browser Tests (Pest v4)

- [ ] End-to-end application submission flow
- [ ] Document upload flow
- [ ] Form validation errors display
- [ ] Pre-fill verification

---

## Files to Modify/Create

### Backend (PHP)

```
app/Http/Controllers/ApplicationController.php  - Major updates
app/Http/Requests/Application/                   - New directory
  ├── PersonalInfoStepRequest.php               - NEW
  ├── EmploymentIncomeStepRequest.php           - NEW
  └── SubmitApplicationRequest.php              - NEW
database/migrations/                             - If new snapshot fields needed
```

### Frontend (TypeScript/React)

```
resources/js/hooks/useApplicationWizard.ts       - Major updates
resources/js/lib/validation/application-schemas.ts - Add new step schemas
resources/js/components/application-wizard/steps/
  ├── PersonalInfoStep.tsx                       - NEW
  ├── EmploymentIncomeStep.tsx                   - NEW
  ├── ReviewStep.tsx                             - NEW
  └── index.ts                                   - Update exports
resources/js/pages/tenant/application-create.tsx - Update step rendering
resources/js/types/index.ts                      - Update ApplicationWizardData
```

### Tests

```
tests/Feature/Tenant/ApplicationSubmissionTest.php - NEW or expand existing
tests/Browser/ApplicationWizardTest.php            - NEW
```

---

## Migration Strategy

### For Existing Draft Applications

- Existing drafts won't have new profile fields
- Add null checks when loading drafts
- Allow submission of existing drafts with minimal data
- Consider a "profile incomplete" warning for old drafts

### For Existing Submitted Applications

- No migration needed - snapshot fields will remain null
- These represent the historical state at submission time

---

## Open Questions

1. **Required vs Optional Profile Data**: Should we require employment/income info for all applications, or make it optional?
    - Recommendation: Required for submission, but allow draft saving without

2. **Document Requirements by Property**: Should property managers be able to specify which documents they require?
    - Future enhancement, not in initial scope

3. **Profile Verification Flow**: How does profile verification interact with application submission?
    - Current: Auto-verify if minimum data present
    - Keep this behavior, but now minimum data will actually be collected

4. **Guarantor Requirement**: When should guarantor information be required?
    - Current: Always optional
    - Consider: Required if income < 3x rent (future enhancement)

---

## Success Criteria

1. ✅ Property managers receive applications with complete employment/income data
2. ✅ Tenants can reuse their profile data across multiple applications
3. ✅ Profile data is snapshotted correctly at submission time
4. ✅ Wizard has intuitive branching based on employment status
5. ✅ All validation (frontend + backend) is consistent
6. ✅ Existing functionality (drafts, autosave) continues to work

---

## References

- [Nielsen Norman Group: Wizards](https://www.nngroup.com/articles/wizards/)
- [Eleken: Wizard UI Pattern](https://www.eleken.co/blog-posts/wizard-ui-pattern-explained)
- [Andrew Coyle: How to Design a Form Wizard](https://www.andrewcoyle.com/blog/how-to-design-a-form-wizard)
- [Azibo: Portable Screening Reports](https://www.azibo.com/blog/portable-screening-reports)
- [SingleKey: Verified Tenant Profile](https://www.singlekey.com/en-ca/tenants/tenant-profile/)
