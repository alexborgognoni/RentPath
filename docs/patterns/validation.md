# Validation Strategy

RentPath uses a **backend-first validation** approach with Laravel Precognition for real-time feedback.

## Validation Stack

```
┌─────────────────────────────────────────┐
│  1. Frontend (Precognition)              │
│  - Real-time validation via backend      │
│  - Uses FormRequest rules as source      │
│  - Per-step validation for wizards       │
│  - Field validation on blur              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. Backend (Laravel Form Request)       │
│  - Single source of truth                │
│  - Step FormRequests (per-step rules)    │
│  - SaveDraftRequest (relaxed)            │
│  - PublishRequest (strict + combined)    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. Database                             │
│  - Constraints, enums, foreign keys      │
│  - CHECK constraints for ranges          │
│  - Final safety net                      │
└─────────────────────────────────────────┘
```

## Key Principles

1. **Backend is Single Source of Truth**: FormRequest rules define validation, frontend uses Precognition to fetch them
2. **No Validation Duplication**: Rules defined once in Laravel FormRequests
3. **Progressive Validation**: Wizards validate current step only for navigation
4. **Full Validation on Submit**: All fields validated when publishing/submitting
5. **Fail Fast**: Show errors immediately on blur via Precognition requests

## Precognition Approach

Laravel Precognition allows the frontend to validate against backend FormRequest rules without actually saving data:

```typescript
// Frontend hook sends Precognition header
const headers = {
    Precognition: 'true',
    'Precognition-Validate-Only': 'type,subtype', // Optional: specific fields
};

// Backend responds with 204 (valid) or 422 (validation errors)
```

### Both Wizards (Precognition-based)

Both Property and Application wizards use `use-wizard-precognition` hook which:

- Makes axios requests with Precognition headers
- Validates against draft endpoints (`/properties/{id}/draft`, `/properties/{id}/apply/draft`)
- Uses SaveDraftRequest rules with dual-mode validation:
    - **Precognition requests**: Strict step validation rules
    - **Normal autosave**: Relaxed rules (preserves user data)
- Uses full validation on publish/submit

### Draft Request Pattern

```php
// SaveApplicationDraftRequest.php or SavePropertyDraftRequest.php
public function rules(): array
{
    if ($this->isPrecognitive()) {
        return $this->precognitionRules();  // Strict step validation
    }
    return $this->draftRules();  // Relaxed for autosave
}
```

## Validation Contexts

| Context          | Frontend             | Backend          | Rules               |
| ---------------- | -------------------- | ---------------- | ------------------- |
| Field blur       | Precognition request | Step FormRequest | Single field        |
| Step navigation  | Precognition request | Step FormRequest | Current step fields |
| Autosave (draft) | -                    | SaveDraftRequest | Relaxed (nullable)  |
| Publish/Submit   | Precognition request | PublishRequest   | Strict (required)   |
| Edit existing    | Precognition request | UpdateRequest    | Contextual          |

## File Structure

### Backend FormRequests

```
app/Http/Requests/
├── Property/
│   ├── Steps/                          # Per-step validation
│   │   ├── TypeStepRequest.php
│   │   ├── LocationStepRequest.php
│   │   ├── SpecsStepRequest.php
│   │   ├── AmenitiesStepRequest.php
│   │   ├── EnergyStepRequest.php
│   │   ├── PricingStepRequest.php
│   │   └── MediaStepRequest.php
│   ├── SavePropertyDraftRequest.php    # Relaxed rules for autosave
│   └── PublishPropertyRequest.php      # Combines all step rules
├── Application/
│   ├── Steps/                          # Per-step validation
│   │   └── ...
│   ├── SaveApplicationDraftRequest.php # Dual-mode: Precognition strict, autosave relaxed
│   └── SubmitApplicationRequest.php    # Combines all step rules
└── Traits/
    ├── PropertyValidationRules.php     # Shared constraints & helpers
    └── ApplicationValidationRules.php
```

### Frontend Hooks

```
resources/js/hooks/
├── use-wizard-precognition.ts    # Base wizard hook with Precognition
├── use-property-wizard.ts        # Property-specific wrapper
└── use-application-wizard.ts     # Application-specific wrapper
```

### Constraints (UI display)

```
resources/js/lib/validation/
└── property-validation.ts      # Constraints for UI display (max lengths, etc.)
```

## Service Layer

Business logic is centralized in services:

```
app/Services/
├── PropertyService.php     # Property wizard logic
└── ApplicationService.php  # Application wizard logic
```

Services handle:

- Draft creation and updates
- Step validation (using FormRequest rules)
- Publishing/submission logic
- Image handling

## Adding/Updating Wizard Fields Checklist

### 1. Database Migration

```bash
php artisan make:migration add_field_to_table --no-interaction
```

### 2. Backend Model

- Add field to `$fillable` array
- Add to `casts()` if needed

### 3. Backend Validation

- **Step FormRequest**: Add validation rules and custom messages
- **Publish FormRequest**: Rules are auto-combined from steps
- **Validation Trait**: Add constraints if needed

### 4. Frontend Types

- `resources/js/types/index.d.ts`: Add to interface
- Wizard hook: Add to data type and initial state

### 5. Frontend Step Config

- Add field to step's `fields` array for Precognition validation targeting:

```typescript
{
    id: 'location',
    fields: ['house_number', 'street_name', 'city', ...],
}
```

### 6. Frontend Components

- Add UI element with data binding
- Field validation happens automatically via Precognition on blur

### 7. Translations

- Add field label, placeholder, error messages in all locales

## Date Validation

The `DatePicker` component has built-in validation:

| Restriction    | Description      | Use Case       |
| -------------- | ---------------- | -------------- |
| `past`         | Today or earlier | Date of birth  |
| `future`       | Today or later   | Move-in date   |
| `strictFuture` | After today      | ID/visa expiry |

## Related Files

- `app/Http/Requests/Property/Steps/` (Step FormRequests)
- `app/Http/Requests/Application/Steps/` (Step FormRequests)
- `app/Services/PropertyService.php`
- `app/Services/ApplicationService.php`
- `resources/js/hooks/use-wizard-precognition.ts`
