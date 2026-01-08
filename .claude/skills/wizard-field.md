---
name: wizard-field
description: Guide for adding new fields to application or property wizards. Ensures 3-layer validation (Zod, FormRequest, Database) is properly implemented. Auto-triggers on "add field to wizard", "new wizard field", "add to application form", "add to property form", "wizard validation".
---

# Adding Wizard Fields Guide

You are helping add new fields to RentPath's multi-step wizard forms (Application Wizard or Property Wizard).

## Before You Start

1. **Read the validation pattern**: `docs/patterns/validation.md`
2. **Read the wizard pattern**: `docs/patterns/wizard.md`
3. **Identify which wizard**: Application (tenant) or Property (manager)

## Tools to Use

| Task | Tool | Command/Action |
|------|------|----------------|
| Check existing schema | `Read` | `resources/js/lib/validation/application-schemas.ts` or `property-schemas.ts` |
| Check Form Request | `Read` | `app/Http/Requests/StoreApplicationRequest.php` or property requests |
| Check model | `Read` | `app/Models/Application.php` or `Property.php` |
| Create migration | `Bash` | `php artisan make:migration add_[field]_to_[table]` |
| Check types | `Read` | `resources/js/types/index.d.ts` |
| Run validation | `Bash` | `php artisan test --filter=Validation` |

## The 3-Layer Validation Rule

**Every field must be validated at all 3 layers with IDENTICAL error messages:**

```
Layer 1: Frontend (Zod)     → Immediate UX feedback
Layer 2: Backend (FormRequest) → Server-side validation
Layer 3: Database           → Constraints, enums, types
```

## Step-by-Step Implementation

### 1. Create Database Migration

```bash
php artisan make:migration add_[field_name]_to_[table_name] --no-interaction
```

```php
public function up(): void
{
    Schema::table('applications', function (Blueprint $table) {
        // Choose appropriate type
        $table->string('new_field')->nullable();           // Optional string
        $table->string('required_field');                   // Required string
        $table->enum('status_field', ['a', 'b', 'c']);     // Enum
        $table->boolean('flag_field')->default(false);     // Boolean
        $table->integer('count_field')->nullable();        // Number
        $table->json('complex_field')->nullable();         // JSON array/object
        $table->date('date_field')->nullable();            // Date
    });
}

public function down(): void
{
    Schema::table('applications', function (Blueprint $table) {
        $table->dropColumn('new_field');
    });
}
```

Run migration:
```bash
php artisan migrate
```

### 2. Update Model

**Add to fillable:**
```php
// app/Models/Application.php
protected $fillable = [
    // ... existing fields
    'new_field',
];
```

**Add casts if needed:**
```php
protected function casts(): array
{
    return [
        // ... existing casts
        'flag_field' => 'boolean',
        'complex_field' => 'array',
        'date_field' => 'date',
    ];
}
```

### 3. Update TypeScript Types

```typescript
// resources/js/types/index.d.ts

// For Application fields
interface Application {
    // ... existing fields
    new_field: string | null;
    required_field: string;
    status_field: 'a' | 'b' | 'c';
    flag_field: boolean;
}

// For wizard data (may differ from model)
interface ApplicationWizardData {
    // ... existing fields
    new_field: string;  // Required in wizard even if nullable in DB
}
```

### 4. Update Zod Schema (Frontend Validation)

```typescript
// resources/js/lib/validation/application-schemas.ts

// Find the appropriate step schema
export const identityStepSchema = z.object({
    // ... existing fields
    new_field: z.string()
        .min(1, 'New field is required')
        .max(255, 'New field must be less than 255 characters'),

    // Optional field
    optional_field: z.string()
        .max(255, 'Optional field must be less than 255 characters')
        .optional()
        .or(z.literal('')),

    // Enum field
    status_field: z.enum(['a', 'b', 'c'], {
        errorMap: () => ({ message: 'Please select a valid status' }),
    }),

    // Boolean field
    flag_field: z.boolean(),

    // Date field
    date_field: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date'),
});
```

### 5. Update Form Request (Backend Validation)

```php
// app/Http/Requests/StoreApplicationRequest.php

public function rules(): array
{
    return [
        // ... existing rules

        // Required field - message must match Zod exactly!
        'new_field' => ['required', 'string', 'max:255'],

        // Optional field
        'optional_field' => ['nullable', 'string', 'max:255'],

        // Enum field
        'status_field' => ['required', Rule::in(['a', 'b', 'c'])],

        // Boolean field
        'flag_field' => ['required', 'boolean'],

        // Date field
        'date_field' => ['required', 'date', 'after:today'],
    ];
}

public function messages(): array
{
    return [
        // ... existing messages

        // Messages MUST match Zod error messages exactly!
        'new_field.required' => 'New field is required',
        'new_field.max' => 'New field must be less than 255 characters',
        'status_field.in' => 'Please select a valid status',
        'date_field.date' => 'Please enter a valid date',
    ];
}
```

### 6. Update Wizard Step Component

```tsx
// resources/js/components/application-wizard/steps/[Step]Step.tsx

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/ui/field-error';

export function IdentityStep({ data, errors, onChange }: StepProps) {
    return (
        <div className="space-y-4">
            {/* ... existing fields */}

            {/* New field */}
            <div className="space-y-2">
                <Label htmlFor="new_field">
                    New Field <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="new_field"
                    value={data.new_field}
                    onChange={(e) => onChange('new_field', e.target.value)}
                    className={errors.new_field ? 'border-red-500' : ''}
                />
                <FieldError error={errors.new_field} />
            </div>
        </div>
    );
}
```

### 7. Update Wizard Hook

```typescript
// resources/js/hooks/useApplicationWizard.ts

// Add to initial state
const initialData: ApplicationWizardData = {
    // ... existing fields
    new_field: '',
};

// If field affects step validation, update step schemas
const stepSchemas = {
    1: identityStepSchema,  // If field is in step 1
    // ...
};
```

### 8. Update Controller (if needed)

```php
// app/Http/Controllers/ApplicationController.php

// In store/update method, ensure field is handled
$application->update([
    // ... existing fields
    'new_field' => $request->validated('new_field'),
]);

// In show/edit method, ensure field is passed to frontend
return Inertia::render('tenant/application-edit', [
    'application' => [
        // ... existing fields
        'new_field' => $application->new_field,
    ],
]);
```

### 9. Add Translations (i18n)

```php
// resources/lang/en/validation.php (if custom messages)
// resources/lang/en/application.php (if labels)

return [
    'new_field' => [
        'label' => 'New Field',
        'placeholder' => 'Enter value...',
        'help' => 'This field is used for...',
    ],
];
```

### 10. Update Tests

```php
// tests/Feature/ApplicationFlowTest.php

test('application requires new_field', function () {
    $user = User::factory()->withTenantProfile()->create();

    $response = $this->actingAs($user)
        ->post('/applications', [
            // ... other required fields
            'new_field' => '',  // Empty
        ]);

    $response->assertSessionHasErrors('new_field');
});

test('application accepts valid new_field', function () {
    $user = User::factory()->withTenantProfile()->create();

    $response = $this->actingAs($user)
        ->post('/applications', [
            // ... other required fields
            'new_field' => 'Valid value',
        ]);

    $response->assertSessionDoesntHaveErrors('new_field');
});
```

### 11. Update Factory (for tests)

```php
// database/factories/ApplicationFactory.php

public function definition(): array
{
    return [
        // ... existing fields
        'new_field' => fake()->sentence(),
    ];
}
```

## Which Step Does the Field Belong To?

### Application Wizard Steps
| Step | Fields |
|------|--------|
| 1. Identity | Name, DOB, nationality, ID documents |
| 2. Address | Current address, previous addresses |
| 3. Employment | Employment status, income, employer |
| 4. Financial | Bank details, credit info |
| 5. History | Rental history, references |
| 6. Review | Summary, consents, submission |

### Property Wizard Steps
| Step | Fields |
|------|--------|
| 1. Basics | Type, title, description |
| 2. Location | Address, coordinates |
| 3. Details | Bedrooms, bathrooms, size, amenities |
| 4. Pricing | Rent, deposit, availability |
| 5. Images | Photos, floor plans |
| 6. Review | Summary, visibility, publish |

## Documentation References

- `docs/patterns/validation.md` - 3-layer validation strategy
- `docs/patterns/wizard.md` - Wizard architecture
- `docs/modules/applications.md` - Application fields
- `docs/modules/properties.md` - Property fields

## Checklist

- [ ] Migration created and run
- [ ] Model updated (fillable, casts)
- [ ] TypeScript types updated
- [ ] Zod schema updated with validation
- [ ] Form Request updated with matching messages
- [ ] Step component updated with UI
- [ ] Wizard hook updated (if needed)
- [ ] Controller updated (if needed)
- [ ] Translations added
- [ ] Tests written
- [ ] Factory updated
- [ ] Manual testing in browser
