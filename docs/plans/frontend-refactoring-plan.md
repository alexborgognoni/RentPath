# Frontend Refactoring Plan

## Overview

This plan addresses maintainability and reusability issues in the React frontend. The wizard/validation refactoring has been completed - this plan now includes all areas.

## Current State Summary (Post-Wizard Refactoring)

| Metric                          | Value |
| ------------------------------- | ----- |
| Total TypeScript/TSX files      | ~300  |
| Files > 500 lines               | 15    |
| Files > 1000 lines              | 6     |
| Components with data fetching   | 7     |
| Components with default exports | 10    |
| Unused utility functions        | ~12   |

### Largest Files (Current)

| File                          | Lines | Status                    |
| ----------------------------- | ----- | ------------------------- |
| `useApplicationWizard.ts`     | 2,419 | ⚠️ NEEDS SPLITTING        |
| `tenant/profile.tsx`          | 1,366 | ⚠️ NEEDS SPLITTING        |
| `FinancialInfoSection.tsx`    | 1,102 | ⚠️ NEEDS SPLITTING        |
| `HistoryStep.tsx`             | 1,066 | ⚠️ NEEDS SPLITTING        |
| `SupportStep.tsx`             | 934   | ⚠️ NEEDS SPLITTING        |
| `profile-setup.tsx`           | 887   | ⚠️ NEEDS SPLITTING        |
| `HouseholdStep.tsx`           | 835   | ⚠️ NEEDS SPLITTING        |
| `application-view.tsx`        | 788   | ⚠️ NEEDS SPLITTING        |
| `property-form.tsx`           | 768   | ⚠️ NEEDS REVIEW           |
| `ReviewStep.tsx` (app wizard) | 730   | ⚠️ NEEDS REVIEW           |
| `useWizardPrecognition.ts`    | 630   | ✅ OK (generic, reusable) |
| `usePropertyWizard.ts`        | 614   | ✅ OK (focused)           |

---

## Tooling Approach

When implementing this plan, use the following tools and agents:

### Agents

- **`Explore` agent** - For investigating codebase patterns before making changes
- **`code-reviewer` agent** - Review changes for quality and pattern adherence
- **`testing-expert` agent** - For test strategy when adding/modifying tests
- **`frontend` agent** - For complex React/UI implementation decisions

### Skills

- **`/commit`** - Create commits following project conventions
- **`/code-review`** - Review code changes before finalizing

### Tools

- **Laravel Boost `search-docs`** - Search Inertia/React documentation before implementing patterns
- **Context7** - Look up external library documentation when needed
- **TypeScript LSP** - Check for type errors after changes
- **`npm run build`** - Verify bundle compiles after each phase

---

## Documentation Updates

**Important:** After completing each phase, update the relevant documentation:

### `.claude/` Documentation

- `.claude/CLAUDE.md` - Update if architectural patterns change
- `.claude/rules/` - Add new rules if new patterns are established

### `docs/` Documentation

- `docs/architecture/overview.md` - Update if frontend structure changes significantly
- `docs/patterns/` - Document new patterns (e.g., form hooks, section components)
- `docs/INDEX.md` - Update navigation if new docs are added
- `docs/TODO.md` - Mark completed items, add new discovered tasks

---

## Phase 1: Quick Wins (Low Risk, High Impact)

### 1.1 Remove Debug Code

**File:** `resources/js/pages/schema-viewer.tsx` (488 lines)

- This is a database schema visualization tool for development
- Should not be in production bundle
- **Action:** Delete file and remove any routes pointing to it

### 1.2 Convert Default Exports to Named Exports

**Files:** 10 components currently using default exports

```
components/delete-user.tsx
components/app-logo.tsx
components/user-type-toggle.tsx
components/app-logo-icon.tsx
components/appearance-dropdown.tsx
components/appearance-tabs.tsx
components/heading-small.tsx
components/heading.tsx
components/input-error.tsx
components/text-link.tsx
```

- **Why:** Named exports enable tree-shaking and consistent imports
- **Action:** Convert `export default` to named exports, update all import sites

### 1.3 Rename Unclear Files

**File:** `pages/agent-profile.tsx` → `pages/manager-dashboard.tsx`

- Current name suggests it's about an "agent" but it's actually the property manager dashboard
- **Action:** Rename file, update routes and navigation references

**Docs to update:** None required for Phase 1

---

## Phase 2: Clean Up Unused Code

### 2.1 Unused Hooks

| File                          | Status             | Notes                                                          |
| ----------------------------- | ------------------ | -------------------------------------------------------------- |
| ~~`hooks/useWizard.ts`~~      | ✅ ALREADY DELETED | Was superseded by useWizardPrecognition                        |
| `hooks/useGeoLocation.ts`     | ✅ KEEP            | Used in profile-setup.tsx, HouseholdStep.tsx, IdentityStep.tsx |
| `hooks/useProfileAutosave.ts` | ✅ KEEP            | Used in useApplicationWizard.ts                                |

### 2.2 Unused Utility Functions (DELETE)

**`utils/country-data.ts`** - Remove 4 unused exports:

- `getCountryByDialCode(dialCode)`
- `getDemonym(iso2)`
- `formatDialCode(dialCode)`
- `getCountryByIso2(iso2)`

**`utils/currency-utils.ts`** - Remove 2 unused exports:

- `useCurrency()` - Superseded by `useReactiveCurrency()`
- `convertCurrency()` - Only used internally

**`utils/phone-validation.ts`** - Remove 3 unused exports:

- `getPhoneValidationError()`
- `hasMinimumDigits()`
- `formatPhoneNumber()`

**`utils/postal-code-patterns.ts`** - Remove:

- `getCountriesWithPostalPatterns()`

**`utils/state-province-data.ts`** - Remove:

- `getStateProvinceLabel()`

**`utils/address-validation.ts`** - Remove:

- `getPostalCodeError()`

**`utils/country-utils.ts`** - Remove:

- `getCountryName()`

### 2.3 Remove Debug Console Statements

**File:** `hooks/useProfileAutosave.ts`

- Lines 161, 174, 177, 198, 202 contain `console.log()` debug statements
- **Action:** Remove or convert to proper error handling

### 2.4 Verification Process

For each deletion:

1. Search for all imports of the function/hook
2. Verify zero external references
3. Remove export and implementation
4. Run `npm run build` to verify no breakage
5. Run TypeScript LSP to check for errors

**Docs to update:** None required for Phase 2

---

## Phase 3: Extract Data Fetching from Components

### Problem

7 components perform their own API calls instead of receiving data via Inertia props:

1. `components/mobile-menu.tsx`
2. `components/app-sidebar.tsx`
3. `components/property/property-sidebar.tsx`
4. `components/dashboard/properties-section.tsx`
5. `components/property/invite-tokens-modal.tsx`
6. `components/property/create-token-form.tsx`
7. `components/language-selector.tsx`

### 3.1 Properties Section Data Fetching

**File:** `components/dashboard/properties-section.tsx` (353 lines)

**Current Problem:**

```tsx
const handleDeleteDraft = async (draft: Property) => {
    await axios.delete(`/properties/${draft.id}/draft`);
    router.reload();
};
```

**Solution:**

- Keep the delete handler but use Inertia's `router.delete()` instead of axios
- Ensure proper error handling through Inertia's error callbacks
- Remove axios import

### 3.2 Invite Tokens Modal

**File:** `components/property/invite-tokens-modal.tsx`

**Current Problem:** Fetches tokens on mount using `fetch()`

**Solution:**

- Move token fetching to the parent page component
- Pass tokens as props to the modal
- Modal only handles display and actions

### 3.3 Property Sidebar Toggle

**File:** `components/property/property-sidebar.tsx`

**Current Problem:** Uses `fetch()` for toggle visibility action

**Solution:**

- Use Inertia `router.patch()` for the toggle action
- Handle optimistic updates via component state

### 3.4 Language Selector

**File:** `components/language-selector.tsx`

**Review:** Check if this is necessary or if locale can be handled via Inertia shared data

**Docs to update:** `docs/patterns/` - Document the Inertia data fetching pattern

---

## Phase 4: Split Oversized Pages

### 4.1 Tenant Profile Page (HIGHEST PRIORITY)

**File:** `pages/tenant/profile.tsx` (1,366 lines)

**Current Problems:**

- 18+ useState declarations managing form state
- Multiple sections (personal, address, identity, employment, documents, guarantor, emergency)
- Document upload handling inline
- Should use Inertia's `useForm` hook instead of raw state

**Proposed Structure:**

```
pages/tenant/
├── profile.tsx                    # Main page (orchestrator, ~200 lines)
└── profile/
    ├── sections/
    │   ├── PersonalInfoSection.tsx
    │   ├── AddressSection.tsx
    │   ├── IdentitySection.tsx
    │   ├── EmploymentSection.tsx
    │   ├── DocumentsSection.tsx
    │   ├── GuarantorSection.tsx
    │   └── EmergencyContactSection.tsx
    ├── hooks/
    │   └── useProfileForm.ts      # Centralized form state with useForm
    └── types.ts                   # Section-specific types
```

**Key Changes:**

1. Extract each collapsible section into its own component
2. Create `useProfileForm` hook using Inertia's `useForm` instead of useState
3. Section components receive form data and handlers as props
4. Main page handles layout and section orchestration

### 4.2 Profile Setup Page

**File:** `pages/profile-setup.tsx` (887 lines)

**Current Problems:**

- Manages PropertyManager setup form
- Redundant "original value" tracking for change detection
- Complex form state

**Proposed Structure:**

```
pages/
├── profile-setup.tsx              # Main page (~150 lines)
└── profile-setup/
    ├── ProfileSetupForm.tsx       # Form component
    └── hooks/
        └── useProfileSetupForm.ts # Form state with useForm
```

### 4.3 Application View Page

**File:** `pages/tenant/application-view.tsx` (788 lines)

**Review:** Determine if this displays application details or allows editing
**Action:** Split into logical sections similar to profile page

**Docs to update:**

- `docs/patterns/` - Add documentation for page section pattern
- `docs/modules/users.md` - Update tenant profile section

---

## Phase 5: Split Oversized Wizard Components

### 5.1 useApplicationWizard Hook (CRITICAL)

**File:** `hooks/useApplicationWizard.ts` (2,419 lines)

**Current Problems:**

- Manages entire application wizard state in single hook
- 80+ fields in CoSignerDetails interface alone
- Multiple entity types mixed: occupants, pets, references, co-signers, guarantors
- Complex state management that could benefit from smaller hooks

**Proposed Structure:**

```
hooks/
├── useApplicationWizard.ts        # Main orchestrator (~400 lines)
└── application-wizard/
    ├── useOccupants.ts            # Occupant CRUD operations
    ├── usePets.ts                 # Pet CRUD operations
    ├── useReferences.ts           # Reference management
    ├── useCoSigners.ts            # Co-signer management
    ├── useGuarantors.ts           # Guarantor management
    └── types.ts                   # Shared interfaces
```

### 5.2 FinancialInfoSection Component

**File:** `components/application-wizard/shared/FinancialInfoSection.tsx` (1,102 lines)

**Current Problems:**

- Handles multiple employment statuses (employed, self-employed, student, unemployed, retired)
- Each status has different fields and logic
- Income proof document handling mixed in

**Proposed Structure:**

```
components/application-wizard/shared/
├── FinancialInfoSection.tsx       # Main orchestrator (~150 lines)
└── financial/
    ├── EmploymentSection.tsx      # Employed/self-employed fields
    ├── StudentSection.tsx         # Student-specific fields
    ├── UnemployedSection.tsx      # Unemployed/retired fields
    └── IncomeProofSection.tsx     # Document uploads
```

### 5.3 HistoryStep Component

**File:** `components/application-wizard/steps/HistoryStep.tsx` (1,066 lines)

**Proposed Split:**

- Extract `PreviousAddressesSection.tsx`
- Extract `ReferencesSection.tsx`
- Extract `RentalHistorySection.tsx`

### 5.4 SupportStep Component

**File:** `components/application-wizard/steps/SupportStep.tsx` (934 lines)

**Proposed Split:**

- Extract `CoSignersManager.tsx`
- Extract `GuarantorsManager.tsx`
- Extract `RentInsuranceSection.tsx`

### 5.5 HouseholdStep Component

**File:** `components/application-wizard/steps/HouseholdStep.tsx` (835 lines)

**Proposed Split:**

- Extract `OccupantsManager.tsx`
- Extract `PetsManager.tsx`
- Extract `EmergencyContactSection.tsx`

**Docs to update:**

- `docs/patterns/wizard.md` - Add section about component structure

---

## Phase 6: Extract Business Logic from Components

### 6.1 Property Filters Component

**File:** `components/dashboard/property-filters.tsx` (503 lines)

**Current Problems:**

- Contains 20+ filter fields
- Filter logic embedded in component
- Should be split into logical filter groups

**Proposed Structure:**

```
components/dashboard/
├── property-filters.tsx           # Main filter container (~100 lines)
└── property-filters/
    ├── BasicFilters.tsx           # Search, status, type
    ├── PriceFilters.tsx           # Min/max rent
    ├── SizeFilters.tsx            # Bedrooms, size
    ├── AmenityFilters.tsx         # Checkboxes for amenities
    └── hooks/
        └── usePropertyFilters.ts  # Filter state management
```

### 6.2 Properties Section Component

**File:** `components/dashboard/properties-section.tsx` (353 lines)

**Current Problems:**

- Contains business logic for draft/published separation
- City extraction logic
- Filtering logic

**Solution:**

- Extract draft/published separation to a utility function
- Move city extraction to the server (Laravel controller)
- Pass pre-filtered data from server when possible

**Docs to update:** `docs/modules/properties.md` - Update dashboard section

---

## Phase 7: Create Shared Utilities

### 7.1 Copy-to-Clipboard Utility

**Current:** Duplicated in 4 components

- `components/dashboard/property-card.tsx`
- `components/dashboard/property-table.tsx`
- `components/property/invite-tokens-modal.tsx`
- `components/property/property-sidebar.tsx`

**Solution:**

```tsx
// hooks/useClipboard.ts
export function useClipboard() {
    const copy = async (text: string, successMessage?: string) => {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage ?? 'Copied to clipboard');
    };
    return { copy };
}
```

### 7.2 Address Formatting Utility

**Current:** Inline in multiple property components

**Solution:**

```tsx
// utils/address.ts
export function formatPropertyAddress(property: Property): string {
    return [property.street, property.city, property.country].filter(Boolean).join(', ');
}
```

**Docs to update:** None required for Phase 7

---

## Phase 8: Standardize Component Patterns

### 8.1 File Naming Convention

**Standard:** All component files should use `kebab-case`

**Current Status:** Mostly consistent. Wizard step components use PascalCase but that's acceptable for step components.

### 8.2 Export Pattern Standard

- Named exports for all components: `export function ComponentName()`
- Only use `export default` for page components (Inertia requirement)
- No barrel files (`index.ts` re-exporting everything) except for explicit re-exports

**Note:** The `components/wizard/` re-exports in `property-wizard/components/` are intentional and should be kept.

### 8.3 Component Function Style

- Use `function` declarations over `const` for components
- Props interface directly above component

```tsx
// Good
interface ButtonProps {
    variant: 'primary' | 'secondary';
}

export function Button({ variant }: ButtonProps) {
    return <button className={variant} />;
}

// Avoid
const Button = ({ variant }: ButtonProps) => {
    return <button className={variant} />;
};
export default Button;
```

**Docs to update:**

- `.claude/rules/` - Add frontend coding standards rule if not present

---

## Implementation Order

| Priority | Phase | Task                                               | Effort  | Risk   |
| -------- | ----- | -------------------------------------------------- | ------- | ------ |
| 1        | 1     | Remove schema-viewer.tsx                           | 5 min   | None   |
| 2        | 1     | Convert default exports to named exports           | 30 min  | Low    |
| 3        | 1     | Rename agent-profile.tsx                           | 15 min  | Low    |
| 4        | 2     | Remove unused utility functions                    | 30 min  | Low    |
| 5        | 2     | Remove console.log debug statements                | 15 min  | None   |
| 6        | 3     | Extract data fetching from properties-section.tsx  | 1 hour  | Medium |
| 7        | 3     | Extract data fetching from invite-tokens-modal.tsx | 1 hour  | Medium |
| 8        | 7     | Create useClipboard hook                           | 30 min  | Low    |
| 9        | 4     | Split tenant/profile.tsx into sections             | 3 hours | Medium |
| 10       | 4     | Create useProfileForm hook                         | 2 hours | Medium |
| 11       | 5     | Split useApplicationWizard.ts into smaller hooks   | 4 hours | Medium |
| 12       | 5     | Split FinancialInfoSection.tsx                     | 2 hours | Medium |
| 13       | 5     | Split HistoryStep.tsx                              | 2 hours | Medium |
| 14       | 5     | Split SupportStep.tsx                              | 2 hours | Medium |
| 15       | 5     | Split HouseholdStep.tsx                            | 2 hours | Medium |
| 16       | 6     | Split property-filters.tsx                         | 2 hours | Medium |
| 17       | 4     | Split profile-setup.tsx                            | 2 hours | Medium |
| 18       | 8     | Standardize file naming                            | 1 hour  | Low    |
| 19       | -     | Update documentation                               | 1 hour  | None   |

---

## Files Already Well-Structured (No Action Needed)

The wizard refactoring left these files in good shape:

- `hooks/useWizardPrecognition.ts` (630 lines) - Generic, well-documented
- `hooks/usePropertyWizard.ts` (614 lines) - Focused, appropriate size
- `components/wizard/WizardNavigation.tsx` (142 lines) - Shared component
- `components/wizard/WizardProgress.tsx` - Shared component
- `app/Services/PropertyService.php` (327 lines) - Clean service layer
- `app/Services/ApplicationService.php` (451 lines) - Clean service layer
- All FormRequest files in `app/Http/Requests/Property/Steps/` and `app/Http/Requests/Application/Steps/`

---

## Success Criteria

After refactoring:

- [ ] No file exceeds 400 lines (excluding generated/data files and useWizardPrecognition.ts)
- [ ] No component fetches data directly (use Inertia props)
- [ ] All components use named exports (except pages)
- [ ] All files use kebab-case naming (except wizard step components)
- [ ] No duplicate utility code
- [ ] No unused exports or dead code
- [ ] Business logic extracted to hooks/utils
- [ ] Clear separation: pages orchestrate, components render
- [ ] All documentation updated to reflect changes

---

## Testing Strategy

For each refactoring step:

1. Use `Explore` agent to understand current implementation before changes
2. Ensure existing functionality works before changes
3. Make incremental changes
4. Run TypeScript compilation (`npm run build`)
5. Manual testing of affected features
6. Run any existing tests (`php artisan test` for backend, check for frontend tests)
7. Use `/code-review` skill before committing

---

## References

- [Spatie: How to structure Laravel Inertia React frontend](https://spatie.be/blog/how-to-structure-the-frontend-of-a-laravel-inertia-react-application)
- [Laravel Frontend Documentation](https://laravel.com/docs/12.x/frontend)
- [Inertia.js Documentation](https://inertiajs.com/)
- `docs/patterns/wizard.md` - Current wizard architecture
- `docs/patterns/validation.md` - Current validation strategy
