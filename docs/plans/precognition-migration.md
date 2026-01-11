# Wizard Validation Migration to Laravel Precognition

> **Goal**: Single source of truth for validation rules, eliminating frontend/backend duplication and simplifying field management.

## Decisions

| Question                  | Decision                                                             |
| ------------------------- | -------------------------------------------------------------------- |
| Keep Zod for client-side? | **No** - Pure Precognition. Backend is sole source of truth.         |
| FormRequest structure?    | **One per step** - 7 step requests + 1 submit request per wizard     |
| Migration approach?       | **Both wizards together** - Shared patterns, one refactor cycle      |
| Service granularity?      | **One service per wizard** - `ApplicationService`, `PropertyService` |
| Documentation?            | **Update after completion** - All docs in `/docs` and `/.claude`     |

## Design Principles

- **Minimal**: Only add what's necessary. No abstractions for single use cases.
- **Clean**: Each file has one responsibility. No 900-line controllers.
- **Simple**: Prefer explicit over clever. New developers should understand in minutes.
- **Maintainable**: Adding a field = editing one FormRequest. That's it.

## Current State Analysis

### The Problem

Validation rules are duplicated across **4+ locations**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CURRENT ARCHITECTURE (Painful)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Frontend (TypeScript)                Backend (PHP)                     │
│  ─────────────────────                ──────────────                    │
│  • Zod schemas (2200+ lines)          • FormRequest (600+ lines)        │
│  • Error messages (500 lines)         • Error messages (100+ lines)     │
│  • financial-validation.ts            • Controller validation methods   │
│                                                                         │
│  Problem: Same rules written twice, can drift apart                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Concrete examples of duplication:**

| Rule            | Frontend (Zod)         | Backend (Laravel)         |
| --------------- | ---------------------- | ------------------------- |
| Age 18+         | `calculateAge() >= 18` | `before:-18 years`        |
| Phone format    | Custom regex           | `ValidPhoneNumber` rule   |
| Employment docs | `superRefine` check    | Conditional `required_if` |
| Postal code     | Country-specific regex | Country-specific regex    |

### Impact

- Adding a field requires changes in 4+ files
- Bug risk when rules drift apart
- Frontend passes but backend rejects on submit
- 2200+ lines of Zod schemas to maintain
- Controllers bloated (900+ lines) with validation logic

---

## Target Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TARGET ARCHITECTURE (Clean)                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Frontend                              Backend                          │
│  ────────                              ───────                          │
│  • useForm().withPrecognition()        • FormRequest (single source)    │
│  • validate({ only: [...] })           • Service layer (business logic) │
│  • Display errors from backend         • Controller (thin, HTTP only)   │
│                                                                         │
│  Flow:                                                                  │
│  1. User types → validate('field') → Precognitive request               │
│  2. Backend FormRequest validates → Returns errors or 204               │
│  3. Frontend displays backend errors immediately                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Migration Plan

### Phase 1: Backend Foundation

#### 1.1 Create Service Layer Structure

```
app/Services/
├── ApplicationService.php       # All application wizard logic (draft, submit, sync)
├── PropertyService.php          # All property wizard logic (draft, publish, images)
└── Traits/
    └── ValidatesWizardSteps.php # Shared step validation logic
```

Each service handles:

- Draft persistence
- Step validation orchestration
- Data transformation (profile sync, image handling)
- Submission logic
- Max step calculation

#### 1.2 Create Step-Aware Form Requests

**Application Wizard:**

```php
app/Http/Requests/Application/
├── Steps/
│   ├── IdentityStepRequest.php          # Step 1: Personal info, ID docs
│   ├── HouseholdStepRequest.php         # Step 2: Occupants, pets
│   ├── FinancialStepRequest.php         # Step 3: Employment, income
│   ├── SupportStepRequest.php           # Step 4: Co-signers, guarantors
│   ├── HistoryStepRequest.php           # Step 5: Rental history, references
│   ├── AdditionalStepRequest.php        # Step 6: Additional info
│   └── ConsentStepRequest.php           # Step 7: Terms, consent
└── SubmitApplicationRequest.php         # Combines all step rules
```

**Property Wizard:**

```php
app/Http/Requests/Property/
├── Steps/
│   ├── TypeStepRequest.php              # Step 1: Property type/subtype
│   ├── LocationStepRequest.php          # Step 2: Address, coordinates
│   ├── SpecsStepRequest.php             # Step 3: Bedrooms, size, etc
│   ├── AmenitiesStepRequest.php         # Step 4: Features, amenities
│   ├── EnergyStepRequest.php            # Step 5: Energy rating (optional)
│   ├── PricingStepRequest.php           # Step 6: Rent, deposit, dates
│   └── MediaStepRequest.php             # Step 7: Photos, description
└── PublishPropertyRequest.php           # Combines all step rules
```

**Why one per step:**

- Precognitive validation targets specific step
- Adding field = edit one file
- Step rules are isolated and testable

#### 1.3 Add Precognition Middleware

```php
// bootstrap/app.php or routes/web.php
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;

Route::middleware([HandlePrecognitiveRequests::class])->group(function () {
    // Wizard routes
    Route::post('/tenant/{tenant}/applications/{property}/draft', [ApplicationController::class, 'saveDraft']);
    Route::post('/tenant/{tenant}/applications/{property}', [ApplicationController::class, 'store']);

    Route::post('/properties/draft', [PropertyController::class, 'createDraft']);
    Route::patch('/properties/{property}/draft', [PropertyController::class, 'saveDraft']);
    Route::post('/properties/{property}/publish', [PropertyController::class, 'publishDraft']);
});
```

---

### Phase 2: Frontend Migration

#### 2.1 Replace useWizard with Precognition-Enabled Form

**Before (current):**

```typescript
// useApplicationWizard.ts - Custom implementation
const { data, errors, updateData, validateCurrentStep } = useApplicationWizard({
    initialData,
    validateStep: validateApplicationStep, // Zod validation
});

// Manual Zod validation on blur
const handleBlur = (field: string) => {
    const result = validateField(stepId, field, data[field]);
    setErrors((prev) => ({ ...prev, [field]: result?.message }));
};
```

**After (Precognition):**

```typescript
// Much simpler - backend is source of truth
import { useForm } from '@inertiajs/react';

const form = useForm(initialData).withPrecognition('post', route);

// Real-time validation hits backend
<Input
    value={form.data.email}
    onChange={e => form.setData('email', e.target.value)}
    onBlur={() => form.validate('email')}
/>
{form.invalid('email') && <InputError>{form.errors.email}</InputError>}
```

#### 2.2 Create Step Validation Helper

```typescript
// hooks/useWizardPrecognition.ts
import { useForm } from '@inertiajs/react';

export function useWizardPrecognition<T extends Record<string, unknown>>(
    method: 'post' | 'patch',
    route: string,
    initialData: T,
    steps: WizardStep[],
) {
    const form = useForm(initialData).withPrecognition(method, route);

    const validateStep = async (stepId: string): Promise<boolean> => {
        const stepFields = getFieldsForStep(stepId, steps);

        return new Promise((resolve) => {
            form.validate({
                only: stepFields,
                onSuccess: () => resolve(true),
                onValidationError: () => resolve(false),
            });
        });
    };

    const goToNextStep = async () => {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            setCurrentStepIndex((prev) => prev + 1);
        }
        return isValid;
    };

    return {
        ...form,
        validateStep,
        goToNextStep,
        currentStep,
        // ... other wizard methods
    };
}
```

#### 2.3 Delete Zod Schemas

Files to remove completely:

- `resources/js/lib/validation/application-schemas.ts` (2200+ lines)
- `resources/js/lib/validation/property-schemas.ts`
- `resources/js/lib/validation/financial-validation.ts`
- `resources/js/lib/validation/property-messages.ts`
- Any related validation utilities

Backend is the sole source of truth. No client-side validation duplication.

---

### Phase 3: Service Layer Implementation

#### 3.1 ApplicationService

Single service handling all application wizard logic:

```php
<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Property;
use App\Models\TenantProfile;
use Illuminate\Support\Facades\Validator;

class ApplicationService
{
    private const STEPS = [
        'identity', 'household', 'financial', 'support',
        'history', 'additional', 'consent'
    ];

    /**
     * Save draft and calculate max valid step.
     */
    public function saveDraft(Application $application, array $data, int $requestedStep): array
    {
        $this->syncProfileData($application->tenantProfile, $data);

        $maxValidStep = $this->calculateMaxValidStep($data, $requestedStep, $application);

        $application->update([
            'draft_data' => $this->filterDraftData($data),
            'max_step' => $maxValidStep,
            'wizard_step' => min($requestedStep, $maxValidStep),
        ]);

        return [
            'maxValidStep' => $maxValidStep,
            'savedAt' => now()->toIso8601String(),
        ];
    }

    /**
     * Submit application with full validation.
     */
    public function submit(Application $application, array $data): Application
    {
        $this->syncProfileData($application->tenantProfile, $data);

        $application->update([
            'status' => 'submitted',
            'submitted_at' => now(),
            'draft_data' => null,
        ]);

        return $application;
    }

    /**
     * Calculate the furthest valid step.
     */
    public function calculateMaxValidStep(array $data, int $requestedStep, Application $application): int
    {
        for ($i = 0; $i <= $requestedStep && $i < count(self::STEPS); $i++) {
            $stepRequest = $this->getStepRequest(self::STEPS[$i], $application);
            $validator = Validator::make($data, $stepRequest->rules(), $stepRequest->messages());

            if ($validator->fails()) {
                return max(0, $i - 1);
            }
        }

        return $requestedStep;
    }

    /**
     * Sync wizard data to tenant profile.
     */
    private function syncProfileData(TenantProfile $profile, array $data): void
    {
        $profileFields = array_filter($data, fn($key) => str_starts_with($key, 'profile_'), ARRAY_FILTER_USE_KEY);

        $profile->update(collect($profileFields)
            ->mapWithKeys(fn($value, $key) => [str_replace('profile_', '', $key) => $value])
            ->toArray()
        );
    }

    private function getStepRequest(string $stepId, Application $application): FormRequest
    {
        $class = 'App\\Http\\Requests\\Application\\Steps\\' . Str::studly($stepId) . 'StepRequest';
        $request = app($class);
        $request->setApplication($application); // For context-aware validation
        return $request;
    }

    private function filterDraftData(array $data): array
    {
        // Remove file uploads and transient fields
        return array_filter($data, fn($key) => !str_ends_with($key, '_file'), ARRAY_FILTER_USE_KEY);
    }
}
```

#### 3.2 PropertyService

```php
<?php

namespace App\Services;

use App\Models\Property;
use Illuminate\Support\Facades\Validator;

class PropertyService
{
    private const STEPS = [
        'type', 'location', 'specs', 'amenities',
        'energy', 'pricing', 'media'
    ];

    public function createDraft(int $userId, array $data): Property
    {
        return Property::create([
            'user_id' => $userId,
            'status' => 'draft',
            ...$data,
        ]);
    }

    public function saveDraft(Property $property, array $data, int $requestedStep): array
    {
        $maxValidStep = $this->calculateMaxValidStep($data, $requestedStep, $property);

        $property->update([
            ...$this->filterDraftData($data),
            'wizard_step' => min($requestedStep, $maxValidStep),
        ]);

        return [
            'maxValidStep' => $maxValidStep,
            'savedAt' => now()->toIso8601String(),
        ];
    }

    public function publish(Property $property, array $data): Property
    {
        $property->update([
            ...$data,
            'status' => 'active',
            'published_at' => now(),
        ]);

        return $property;
    }

    public function calculateMaxValidStep(array $data, int $requestedStep, Property $property): int
    {
        for ($i = 0; $i <= $requestedStep && $i < count(self::STEPS); $i++) {
            $stepRequest = $this->getStepRequest(self::STEPS[$i], $property);
            $validator = Validator::make($data, $stepRequest->rules(), $stepRequest->messages());

            if ($validator->fails()) {
                return max(0, $i - 1);
            }
        }

        return $requestedStep;
    }

    private function getStepRequest(string $stepId, Property $property): FormRequest
    {
        $class = 'App\\Http\\Requests\\Property\\Steps\\' . Str::studly($stepId) . 'StepRequest';
        $request = app($class);
        $request->setProperty($property);
        return $request;
    }

    private function filterDraftData(array $data): array
    {
        return array_filter($data, fn($key) => !in_array($key, ['images', 'deleted_image_ids']), ARRAY_FILTER_USE_KEY);
    }
}
```

---

### Phase 4: Controller Simplification

**Before (900+ lines):**

```php
class ApplicationController extends Controller
{
    public function saveDraft(Request $request, Property $property)
    {
        // 200+ lines of validation, syncing, calculation...
    }
}
```

**After (thin controller):**

```php
class ApplicationController extends Controller
{
    public function __construct(
        private ApplicationDraftService $draftService,
        private ApplicationSubmissionService $submissionService,
    ) {}

    public function saveDraft(
        ApplicationDraftRequest $request,  // Handles validation
        Property $property
    ) {
        $application = $this->getOrCreateDraft($request->user(), $property);

        $result = $this->draftService->saveDraft(
            $application,
            $request->validated(),
            $request->integer('wizard_step')
        );

        return response()->json($result);
    }

    public function store(
        SubmitApplicationRequest $request,  // Full validation
        Property $property
    ) {
        $application = $this->getOrCreateDraft($request->user(), $property);

        $this->submissionService->submit($application, $request->validated());

        return redirect()->route('tenant.applications.show', $application);
    }
}
```

---

## Implementation Sequence

### Phase 1: Backend Foundation - COMPLETE

- [x] Create `app/Services/` directory
- [x] Create step FormRequests for both wizards (14 step files + 2 submit files)
- [x] Create `ApplicationService` and `PropertyService`
- [x] Add `HandlePrecognitiveRequests` middleware to wizard routes
- [x] Create dual-mode SaveDraftRequest (Precognition strict, autosave relaxed)
- [x] Write tests for services

### Phase 2: Frontend Migration - COMPLETE

- [x] Create `useWizardPrecognition` hook
- [x] Update Property wizard to use Precognition
- [x] Update Application wizard to use Precognition
- [x] Test Precognitive validation end-to-end for both wizards
- [x] Fix async `goToNextStep` blocking navigation
- [x] Add `validateFieldAndRecalculateMaxStep` for step locking on blur
- [x] Add mount-time validation to recalculate maxStepReached

### Phase 3: Cleanup - COMPLETE

- [x] Delete Zod schemas (`application-schemas.ts`, `financial-validation.ts`)
- [x] Delete unused wizard hooks (`useWizard.ts`)
- [x] Run full test suite, fix any regressions

### Phase 4: Documentation Update - COMPLETE

- [x] Update `docs/patterns/wizard.md` - New Precognition-based architecture
- [x] Update `docs/patterns/validation.md` - Single source of truth approach
- [x] Update `.claude/CLAUDE.md` - Remove outdated validation reference
- [x] Update `.claude/skills/wizard-field/SKILL.md` - Current patterns
- [x] Update `docs/TODO.md` - Mark migration complete

---

## Files Created/Modified

### Backend

```
app/Services/
├── ApplicationService.php          # Application wizard business logic
└── PropertyService.php             # Property wizard business logic

app/Http/Requests/
├── Traits/
│   └── ApplicationValidationRules.php  # Shared validation helpers
├── Application/
│   ├── Steps/
│   │   ├── IdentityStepRequest.php     # Step 1
│   │   ├── HouseholdStepRequest.php    # Step 2
│   │   ├── FinancialStepRequest.php    # Step 3
│   │   ├── SupportStepRequest.php      # Step 4
│   │   ├── HistoryStepRequest.php      # Step 5
│   │   ├── AdditionalStepRequest.php   # Step 6
│   │   └── ConsentStepRequest.php      # Step 7
│   ├── SaveApplicationDraftRequest.php # Dual-mode Precognition/autosave
│   └── SubmitApplicationRequest.php    # Full submission
└── Property/
    ├── Steps/
    │   ├── TypeStepRequest.php         # Step 1
    │   ├── LocationStepRequest.php     # Step 2
    │   ├── SpecsStepRequest.php        # Step 3
    │   ├── AmenitiesStepRequest.php    # Step 4
    │   ├── EnergyStepRequest.php       # Step 5
    │   ├── PricingStepRequest.php      # Step 6
    │   └── MediaStepRequest.php        # Step 7
    ├── SavePropertyDraftRequest.php    # Dual-mode Precognition/autosave
    └── PublishPropertyRequest.php      # Full submission
```

### Frontend

```
resources/js/hooks/
├── useWizardPrecognition.ts        # Base Precognition hook with step locking
├── usePropertyWizard.ts            # Property-specific wrapper
└── useApplicationWizard.ts         # Application-specific wrapper
```

### Files Deleted

```
resources/js/lib/validation/
├── application-schemas.ts          # Zod schemas (deleted)
└── financial-validation.ts         # Financial validation helpers (deleted)

resources/js/hooks/
└── useWizard.ts                    # Legacy wizard hook (deleted)
```

### Routes Modified

```
routes/web.php                      # Added HandlePrecognitiveRequests middleware
```

---

## Benefits After Migration

| Metric                      | Before       | After            |
| --------------------------- | ------------ | ---------------- |
| Files to edit for new field | 4+           | 1 (FormRequest)  |
| Lines of validation code    | 3000+        | ~800             |
| Controller size             | 900 lines    | ~200 lines       |
| Source of truth             | Multiple     | Single (backend) |
| Frontend/backend drift risk | High         | None             |
| Test coverage               | Hard to test | Easy (services)  |

---

## Risks & Mitigations

| Risk                  | Mitigation                                           |
| --------------------- | ---------------------------------------------------- |
| Network latency       | Debounce (1500ms default), "validating..." indicator |
| Migration regressions | Full test suite, phased implementation               |

---

## Validation Rule Parity Check

Before removing Zod, verify all current validation rules can be expressed in Laravel:

| Zod Feature                  | Laravel Equivalent               | Notes                      |
| ---------------------------- | -------------------------------- | -------------------------- |
| `.min()` / `.max()`          | `min:x` / `max:x`                | Direct mapping             |
| `.email()`                   | `email`                          | Direct mapping             |
| `.regex()`                   | `regex:pattern`                  | Direct mapping             |
| `.refine()` custom           | Custom Rule class                | Create `App\Rules\*`       |
| `.superRefine()` multi-field | `after` validation hook          | Use closure in FormRequest |
| Conditional fields           | `required_if`, `required_unless` | Direct mapping             |
| Array validation             | `array`, `*.field` notation      | Direct mapping             |
| File validation              | `file`, `mimes`, `max`           | Direct mapping             |

**Custom rules needed:**

- `ValidPhoneNumber` - Already exists
- `ValidPostalCode` - Country-aware, create if not exists
- `AdultAge` - 18+ years check

---

## References

- [Laravel Precognition](https://laravel.com/docs/12.x/precognition)
- [Inertia Precognition](https://inertiajs.com/validation#precognition)
