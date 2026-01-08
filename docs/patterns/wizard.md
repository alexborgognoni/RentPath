# Wizard Architecture

Multi-step wizards (property creation, tenant applications) use a **step-locked validation pattern** that ensures data integrity.

## Core Concepts

| Term | Description |
|------|-------------|
| `viewingStep` | The step currently displayed to the user |
| `maxStepReached` | The highest step the user has validly completed |
| `completedSteps` | Set of steps that have been validated and passed |

## Validation Flow

```
User edits field in Step N
    ↓
Frontend validates Step N immediately
    ↓
If Step N invalid AND maxStepReached > N:
    -> Reduce maxStepReached to N
    -> Lock user into Step N until valid
    ↓
Autosave triggers (debounced 1000ms)
    ↓
Backend validates all steps 1..N
    ↓
Backend returns actual maxValidStep
    ↓
Frontend updates maxStepReached from backend response
```

## Key Principles

1. **Backend is source of truth**: Frontend validation is for UX; backend prevents invalid DB states
2. **Progressive validation**: Can only advance if all previous steps are valid
3. **Immediate feedback**: Errors shown as soon as field loses focus
4. **No orphaned progress**: Editing step 2 and making it invalid locks you out of step 3+
5. **Data preservation**: Invalid states don't delete data from later steps, just lock access
6. **Lazy draft creation**: Only create database record on first user interaction

## Step Locking

| Scenario | Action |
|----------|--------|
| User on step 3, edits step 1, makes it invalid | User locked to step 1 until fixed |
| User on step 3, edits step 2, makes it invalid | User locked to step 2 until fixed |
| User on step 3, completes step 3, clicks Continue | maxStepReached increases to 4 |
| Page refresh | maxStepReached recalculated from saved data |

## Unified Validation

**Critical**: Use a SINGLE validation function for all validation scenarios:

```typescript
// useWizard.ts - SINGLE SOURCE OF TRUTH
const validateStepWrapper = (stepId, data) => {
    return validateApplicationStep(stepId, data, existingDocsContext);
};

// Used for:
// 1. goToNextStep() - validates current step
// 2. computeFirstInvalidStep() - iterates all steps
```

**Rule**: When modifying validation for a step, ONLY modify `validateApplicationStep()` in `application-schemas.ts`.

## Per-Field Blur Pattern

Show validation errors only after user interacts with a field:

1. `onChange` handlers update data only (NEVER mark fields as touched)
2. `onBlur` handlers mark field as touched AND validate just that field
3. "Continue" button validates ALL fields and shows ALL errors

```tsx
// Per-field blur handler
const handleFieldBlur = useCallback((field: string) => {
    wizard.markFieldTouched(field);
    wizard.validateField(field);
    wizard.saveNow();
}, [wizard]);
```

## Validation UX Feedback

### Button Shake Animation

When "Continue" fails validation, button shakes horizontally:

```typescript
x: [0, -8, 8, -8, 8, -4, 4, 0]  // pixels
duration: 0.4s
```

### Scroll to First Error

After validation fails:
1. Find first element with `aria-invalid="true"`
2. Smoothly scroll into view (centered)
3. Focus the field

**Important**: All form inputs must set `aria-invalid={!!errors.fieldName}`.

## Database Persistence

```sql
wizard_step INT DEFAULT 1      -- Current/max step reached
status ENUM('draft', ...)      -- Draft until published
```

- Relaxed validation for drafts (only enough to identify the draft)
- Full validation only on publish/submit

## Adding/Updating Wizard Fields

See [validation.md](validation.md) for the complete checklist.

## Related Files

- `resources/js/hooks/useApplicationWizard.ts`
- `resources/js/lib/validation/application-schemas.ts`
- `resources/js/components/application-wizard/`
