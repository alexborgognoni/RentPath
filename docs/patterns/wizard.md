# Wizard Architecture

Multi-step wizards (property creation, tenant applications) use a **step-locked validation pattern** with Laravel Precognition for real-time backend validation.

## Core Concepts

| Term               | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `currentStepIndex` | The step currently displayed to the user (0-indexed)                     |
| `maxStepReached`   | The highest step the user can navigate to (0-indexed)                    |
| `fields`           | Array of field names that belong to each step (for validation targeting) |

## Validation Flow (Precognition-based)

```
User edits field in Step N
    ↓
Frontend sends Precognition request to backend
    ↓
Backend FormRequest validates field(s)
    ↓
Backend returns 204 (valid) or 422 (errors)
    ↓
Frontend updates error state from response
    ↓
If field belongs to step < maxStepReached:
    Recalculate maxStepReached (may lock future steps)
    ↓
On "Continue" click: validate current step
    ↓
If invalid: show errors, shake button, scroll to first error
If valid: advance to next step, update maxStepReached
```

## Key Principles

1. **Backend is source of truth**: FormRequest rules define all validation
2. **No validation duplication**: Rules defined once in Laravel, used via Precognition
3. **Progressive validation**: Can only advance if current step is valid
4. **Immediate feedback**: Errors shown on field blur via Precognition
5. **No orphaned progress**: Editing earlier step and making it invalid locks later steps
6. **Data preservation**: Invalid states don't delete data, just lock access
7. **Lazy draft creation**: Only create database record on first user interaction
8. **Mount validation**: On page load, maxStepReached is recalculated from saved data

## Step Locking Behavior

| Scenario                                          | Action                                             |
| ------------------------------------------------- | -------------------------------------------------- |
| User on step 3, edits step 1, makes it invalid    | maxStepReached reduced, future steps locked        |
| User on step 3, edits step 2, makes it invalid    | maxStepReached reduced, step 3+ locked             |
| User on step 3, completes step 3, clicks Continue | maxStepReached increases to 4                      |
| Page refresh / mount                              | maxStepReached recalculated via backend validation |
| Resume draft with invalid data                    | User moved to first invalid step                   |

## Precognition Validation

Validation uses Laravel Precognition headers to validate without saving:

```typescript
// useWizardPrecognition.ts
const headers = {
    Precognition: 'true',
};

const response = await axios.request({
    method: 'patch',
    url: `/properties/${propertyId}/draft`,
    data,
    headers,
});
// 204 = valid, 422 = validation errors
```

### Important: Nested Array Validation

**Do NOT use `Precognition-Validate-Only` header for step validation** when steps contain nested array fields.

When you send `Precognition-Validate-Only: occupants_details`, Laravel only validates the parent rule (`nullable|array`), NOT the nested rules (`occupants_details.*.first_name`). This causes nested validation to be skipped.

**Solution**: For `validateStep`, omit the `Precognition-Validate-Only` header entirely. Laravel validates ALL fields, and we filter errors on the frontend to only show those belonging to the current step.

### Step Field Configuration

Each step defines which fields it contains:

```typescript
{
    id: 'location',
    title: 'Location',
    fields: ['house_number', 'street_name', 'city', 'postal_code', 'country'],
}
```

The Precognition request uses `Precognition-Validate-Only` header to validate only those fields.

## Per-Field Blur Pattern

Show validation errors only after user interacts with a field:

1. `onChange` handlers update data only (clears error for that field)
2. `onBlur` handlers trigger Precognition validation for that field
3. If field belongs to previous step: recalculate maxStepReached (may lock future steps)
4. "Continue" button validates all step fields, marks all touched, shows all errors

```tsx
// Usage in step component
<Input
    value={data.house_number}
    onChange={(e) => updateField('house_number', e.target.value)}
    onBlur={() => {
        markFieldTouched('house_number');
        validateField('house_number'); // Uses validateFieldAndRecalculateMaxStep
    }}
    aria-invalid={!!errors.house_number}
/>;
{
    touchedFields.house_number && errors.house_number && <p className="text-sm text-red-500">{errors.house_number}</p>;
}
```

### Key Functions

| Function                          | Purpose                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `validateField`                   | Validates single field via Precognition, recalculates maxStepReached if needed |
| `validateStep`                    | Validates all fields in a step via Precognition                                |
| `calculateMaxValidStep`           | Validates all steps up to N, returns last valid step index                     |
| `goToNextStep`                    | Validates current step, advances if valid, blocks if invalid                   |
| `markAllCurrentStepFieldsTouched` | Marks all fields in current step as touched (shows all errors)                 |
| `focusFirstInvalidField`          | Finds first `[aria-invalid="true"]` element, focuses and scrolls to it         |

## Nested/Indexed Fields (Arrays)

For nested arrays like occupants, pets, or addresses, use **Laravel array dot notation** consistently:

```
Backend validation rule: occupants_details.*.first_name
Frontend field key:      occupants_details.0.first_name
```

### Why Laravel Format?

The backend returns validation errors in Laravel format (`occupants_details.0.first_name`). Using the same format on the frontend ensures:

1. `errors[field]` and `touchedFields[field]` use the same key
2. Error messages display correctly
3. `aria-invalid` and error display logic work consistently

### Implementation Pattern

```tsx
// Step component with nested fields
interface HouseholdStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    markFieldTouched: (field: string) => void;
    onFieldBlur?: (field: string) => void;
}

// Blur handler for indexed fields - uses Laravel array format
const handleOccupantFieldBlur = (index: number, field: keyof OccupantDetails) => () => {
    const fieldKey = `occupants_details.${index}.${field}`; // Laravel format
    if (onFieldBlur) {
        onFieldBlur(fieldKey);
    } else {
        markFieldTouched(fieldKey);
    }
};

// Usage in JSX
<input
    value={occupant.first_name}
    onChange={(e) => updateOccupant(index, 'first_name', e.target.value)}
    onBlur={handleOccupantFieldBlur(index, 'first_name')}
    aria-invalid={!!(touchedFields[`occupants_details.${index}.first_name`] && errors[`occupants_details.${index}.first_name`])}
/>;
{
    touchedFields[`occupants_details.${index}.first_name`] && errors[`occupants_details.${index}.first_name`] && (
        <p className="text-sm text-red-500">{errors[`occupants_details.${index}.first_name`]}</p>
    );
}
```

### markAllCurrentStepFieldsTouched Override

For steps with nested fields, override `markAllCurrentStepFieldsTouched` in the wrapper hook:

```typescript
// useApplicationWizard.ts
const markAllCurrentStepFieldsTouched = useCallback(() => {
    const newTouched = { ...wizard.touchedFields };

    if (wizard.currentStep === 'household') {
        // Static fields
        newTouched.desired_move_in_date = true;

        // Dynamic nested fields - use Laravel array format
        wizard.data.occupants_details.forEach((occupant, index) => {
            newTouched[`occupants_details.${index}.first_name`] = true;
            newTouched[`occupants_details.${index}.last_name`] = true;
            // ... other fields
        });
    }

    wizard.setTouchedFields(newTouched);
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

- Relaxed validation for drafts (only enough to identify)
- Full validation only on publish/submit

## Service Layer

Business logic is centralized in services:

```php
// PropertyService.php
public function validateStep(int $step, array $data, Property $property): ?array
{
    $request = new TypeStepRequest(); // Use step's FormRequest
    $request->merge($data);

    $validator = Validator::make($data, $request->rules(), $request->messages());

    if ($validator->fails()) {
        return $validator->errors()->toArray();
    }

    return null;
}
```

## Adding/Updating Wizard Fields

See [validation.md](validation.md) for the complete checklist.

## Related Files

### Base Hook (Shared)

- `resources/js/hooks/useWizardPrecognition.ts` - Base Precognition hook with step locking

### Property Wizard

- `resources/js/hooks/usePropertyWizard.ts` - Property-specific wrapper
- `resources/js/pages/property-create.tsx` - Create page
- `app/Http/Requests/Property/Steps/` - Step FormRequests
- `app/Http/Requests/Property/SavePropertyDraftRequest.php` - Draft validation
- `app/Services/PropertyService.php` - Business logic

### Application Wizard

- `resources/js/hooks/useApplicationWizard.ts` - Application-specific wrapper
- `resources/js/pages/tenant/application-create.tsx` - Create page
- `app/Http/Requests/Application/Steps/` - Step FormRequests
- `app/Http/Requests/Application/SaveApplicationDraftRequest.php` - Draft validation
- `app/Services/ApplicationService.php` - Business logic
