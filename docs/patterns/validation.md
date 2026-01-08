# Validation Strategy

RentPath uses a **three-layer validation** approach to prevent bugs and ensure data integrity.

## Validation Stack

```
┌─────────────────────────────────────────┐
│  1. Frontend (Zod)                       │
│  - Immediate user feedback               │
│  - Per-step validation for wizards       │
│  - Real-time field validation on blur    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. Backend (Laravel Form Request)       │
│  - Single source of truth                │
│  - SaveDraftRequest (relaxed)            │
│  - PublishRequest (strict)               │
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

1. **Backend is Source of Truth**: Frontend can be bypassed; backend must reject invalid data
2. **Consistent Messages**: Error text identical between frontend Zod and backend Laravel
3. **Progressive Validation**: Wizards validate current step only for navigation
4. **Full Validation on Submit**: All fields validated when publishing/submitting
5. **Fail Fast**: Show errors immediately on blur, don't wait for submission

## Validation Contexts

| Context | Frontend | Backend | Rules |
|---------|----------|---------|-------|
| Field blur | Zod schema | - | Single field |
| Step navigation | Zod step schema | - | Current step fields |
| Autosave (draft) | - | SaveDraftRequest | Relaxed (nullable) |
| Publish/Submit | Zod full schema | PublishRequest | Strict (required) |
| Edit existing | Zod full schema | UpdateRequest | Contextual |

## File Structure

```
resources/js/lib/validation/
├── property-validation.ts    # Constraints (max lengths, ranges)
├── property-messages.ts      # Error messages
└── property-schemas.ts       # Zod schemas per step

app/Http/Requests/
├── Traits/
│   └── PropertyValidationRules.php  # Shared rules & messages
├── SavePropertyDraftRequest.php
├── PublishPropertyRequest.php
└── UpdatePropertyRequest.php
```

## Adding/Updating Wizard Fields Checklist

### 1. Database Migration

```bash
php artisan make:migration add_field_to_table --no-interaction
```

### 2. Backend Model

- Add field to `$fillable` array
- Add to `casts()` if needed
- Add accessor for URL generation if document field

### 3. Backend Validation

- **Form Request**: Add validation rules and custom messages
- **Controller**: Update data mapping if needed

### 4. Frontend Types

- `resources/js/types/index.d.ts`: Add to interface
- `resources/js/hooks/useApplicationWizard.ts`: Add to data type and initial state

### 5. Frontend Validation (Zod)

- Add error message to `APPLICATION_MESSAGES`
- Add validation rule to relevant schema
- Update `existingDocumentsShape` if document field

### 6. Frontend Components

- **Shared Section**: Add to data interface, add UI element with handlers
- **Step Component**: Add to field mapping and blur handler

### 7. Translations

- Add field label, placeholder, error messages in all 4 locales

### 8. UI Options (Dropdowns/Enums)

- Frontend: Options array
- Backend: `in:` validation rule
- Database: ENUM column or string
- Translations: Labels for each option

## Date Validation

The `DatePicker` component has built-in validation:

| Restriction | Description | Use Case |
|-------------|-------------|----------|
| `past` | Today or earlier | Date of birth |
| `future` | Today or later | Move-in date |
| `strictFuture` | After today | ID/visa expiry |

## Related Files

- `resources/js/lib/validation/application-schemas.ts`
- `app/Http/Requests/` (Form Requests)
