---
name: new-feature
description: Complete guide for implementing new features in RentPath. Covers the full workflow from planning to testing. Auto-triggers on "implement feature", "add new feature", "build this feature", "create new functionality", "new endpoint".
---

# New Feature Implementation Guide

You are helping implement a new feature in RentPath following established patterns and conventions.

## Before You Start

1. **Clarify requirements**: What exactly should this feature do?
2. **Identify scope**: Backend, frontend, or full-stack?
3. **Check existing patterns**: Find similar features to use as templates

## Tools to Use

| Task            | Tool                                 | Command/Action                |
| --------------- | ------------------------------------ | ----------------------------- |
| Search codebase | `Grep`, `Glob`                       | Find similar patterns         |
| Read docs       | `Read`                               | Check `docs/` for patterns    |
| Create files    | `Bash`                               | `php artisan make:*` commands |
| Database schema | `laravel-boost` -> `database-schema` | Check existing tables         |
| Run tests       | `Bash`                               | `php artisan test`            |
| Type check      | `Bash`                               | `npm run types`               |

## Feature Implementation Checklist

### Phase 1: Planning

```
[ ] Requirements clearly understood
[ ] Similar feature identified as template
[ ] Database changes identified
[ ] API/routes designed
[ ] Frontend components planned
[ ] Test scenarios listed
```

### Phase 2: Backend

```
[ ] Migration created and run
[ ] Model created/updated
[ ] Factory created/updated
[ ] Form Request created
[ ] Controller methods added
[ ] Routes registered
[ ] Authorization (policy) added
```

### Phase 3: Frontend

```
[ ] TypeScript types updated
[ ] Zod schema created/updated
[ ] Page component created
[ ] UI components created
[ ] Hooks created (if needed)
[ ] Translations added
```

### Phase 4: Testing & Polish

```
[ ] Feature tests written
[ ] Manual testing done
[ ] Edge cases handled
[ ] Error states handled
[ ] Loading states added
[ ] Documentation updated (if needed)
```

## Step-by-Step Implementation

### 1. Database Layer

**Create migration:**

```bash
php artisan make:migration create_[table]_table --no-interaction
# or
php artisan make:migration add_[field]_to_[table] --no-interaction
```

**Migration template:**

```php
public function up(): void
{
    Schema::create('feature_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
        $table->timestamps();

        $table->index(['user_id', 'status']);
    });
}

public function down(): void
{
    Schema::dropIfExists('feature_items');
}
```

**Run migration:**

```bash
php artisan migrate
```

### 2. Model Layer

**Create model:**

```bash
php artisan make:model FeatureItem --no-interaction
```

**Model template:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeatureItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUser($query, User $user)
    {
        return $query->where('user_id', $user->id);
    }
}
```

### 3. Factory Layer

**Create factory:**

```bash
php artisan make:factory FeatureItemFactory --no-interaction
```

**Factory template:**

```php
<?php

namespace Database\Factories;

use App\Models\FeatureItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeatureItemFactory extends Factory
{
    protected $model = FeatureItem::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'status' => 'draft',
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }
}
```

### 4. Form Request Layer

**Create form request:**

```bash
php artisan make:request StoreFeatureItemRequest --no-interaction
```

**Form request template:**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeatureItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Or check policy
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(['draft', 'active', 'archived'])],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'title.max' => 'Title must be less than 255 characters',
            'description.max' => 'Description must be less than 1000 characters',
            'status.in' => 'Please select a valid status',
        ];
    }
}
```

### 5. Controller Layer

**Create controller:**

```bash
php artisan make:controller FeatureItemController --no-interaction
```

**Controller template:**

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeatureItemRequest;
use App\Http\Requests\UpdateFeatureItemRequest;
use App\Models\FeatureItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeatureItemController extends Controller
{
    public function index(): Response
    {
        $items = FeatureItem::query()
            ->forUser(auth()->user())
            ->latest()
            ->paginate(10);

        return Inertia::render('feature-items/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('feature-items/create');
    }

    public function store(StoreFeatureItemRequest $request): RedirectResponse
    {
        $item = FeatureItem::create([
            'user_id' => auth()->id(),
            ...$request->validated(),
        ]);

        return redirect()
            ->route('feature-items.show', $item)
            ->with('success', __('Item created successfully'));
    }

    public function show(FeatureItem $featureItem): Response
    {
        $this->authorize('view', $featureItem);

        return Inertia::render('feature-items/show', [
            'item' => $featureItem,
        ]);
    }

    public function edit(FeatureItem $featureItem): Response
    {
        $this->authorize('update', $featureItem);

        return Inertia::render('feature-items/edit', [
            'item' => $featureItem,
        ]);
    }

    public function update(UpdateFeatureItemRequest $request, FeatureItem $featureItem): RedirectResponse
    {
        $this->authorize('update', $featureItem);

        $featureItem->update($request->validated());

        return redirect()
            ->route('feature-items.show', $featureItem)
            ->with('success', __('Item updated successfully'));
    }

    public function destroy(FeatureItem $featureItem): RedirectResponse
    {
        $this->authorize('delete', $featureItem);

        $featureItem->delete();

        return redirect()
            ->route('feature-items.index')
            ->with('success', __('Item deleted successfully'));
    }
}
```

### 6. Routes

**Add to routes/web.php:**

```php
// Feature Items
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('feature-items', FeatureItemController::class);
});
```

**Generate Wayfinder routes:**

```bash
php artisan wayfinder:generate
```

### 7. Policy (Authorization)

**Create policy:**

```bash
php artisan make:policy FeatureItemPolicy --model=FeatureItem --no-interaction
```

**Policy template:**

```php
<?php

namespace App\Policies;

use App\Models\FeatureItem;
use App\Models\User;

class FeatureItemPolicy
{
    public function view(User $user, FeatureItem $featureItem): bool
    {
        return $user->id === $featureItem->user_id;
    }

    public function update(User $user, FeatureItem $featureItem): bool
    {
        return $user->id === $featureItem->user_id;
    }

    public function delete(User $user, FeatureItem $featureItem): bool
    {
        return $user->id === $featureItem->user_id;
    }
}
```

**Register in AuthServiceProvider or auto-discovery.**

### 8. TypeScript Types

**Add to resources/js/types/index.d.ts:**

```typescript
export interface FeatureItem {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    status: 'draft' | 'active' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface FeatureItemFormData {
    title: string;
    description: string;
    status: 'draft' | 'active' | 'archived';
}
```

### 9. Zod Schema

**Create/update validation schema:**

```typescript
// resources/js/lib/validation/feature-item-schemas.ts
import { z } from 'zod';

export const featureItemSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
    status: z.enum(['draft', 'active', 'archived'], {
        errorMap: () => ({ message: 'Please select a valid status' }),
    }),
});

export type FeatureItemFormData = z.infer<typeof featureItemSchema>;
```

### 10. Page Components

**Create page component:**

```tsx
// resources/js/pages/feature-items/index.tsx
import { Head } from '@inertiajs/react';
import { FeatureItem } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    items: {
        data: FeatureItem[];
        links: any;
    };
}

export default function FeatureItemsIndex({ items }: Props) {
    return (
        <>
            <Head title="Feature Items" />

            <div className="container mx-auto py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Feature Items</h1>
                    <Link href="/feature-items/create" className="btn btn-primary">
                        Create New
                    </Link>
                </div>

                <div className="space-y-4">
                    {items.data.map((item) => (
                        <div key={item.id} className="rounded-lg bg-white p-4 shadow">
                            <h2 className="font-semibold">{item.title}</h2>
                            <p className="text-gray-600">{item.description}</p>
                            <span className="text-sm text-gray-500">{item.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
```

### 11. Feature Tests

**Create test file:**

```bash
php artisan make:test FeatureItemTest --no-interaction
```

**Test template:**

```php
<?php

use App\Models\User;
use App\Models\FeatureItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

describe('Feature Items CRUD', function () {
    test('user can view their items', function () {
        FeatureItem::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->get('/feature-items');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('feature-items/index')
            ->has('items.data', 3)
        );
    });

    test('user can create item', function () {
        $response = $this->actingAs($this->user)
            ->post('/feature-items', [
                'title' => 'Test Item',
                'description' => 'Test description',
                'status' => 'draft',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('feature_items', [
            'user_id' => $this->user->id,
            'title' => 'Test Item',
        ]);
    });

    test('user cannot view other user\'s item', function () {
        $otherUser = User::factory()->create();
        $item = FeatureItem::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->get("/feature-items/{$item->id}");

        $response->assertForbidden();
    });

    test('validates required fields', function () {
        $response = $this->actingAs($this->user)
            ->post('/feature-items', [
                'title' => '',
            ]);

        $response->assertSessionHasErrors('title');
    });
});
```

## Documentation References

- `docs/architecture/overview.md` - Architecture patterns
- `docs/patterns/validation.md` - 3-layer validation
- `docs/patterns/wizard.md` - Wizard patterns (if applicable)
- `.claude/rules/laravel-boost.md` - Laravel conventions

## Related Skills

- `/wizard-field` - If adding wizard fields
- `/test-feature` - For test writing patterns
- `/refactor` - If extracting to services
- `/code-review` - Before merging

## Quick Reference Commands

```bash
# Create all backend files
php artisan make:model FeatureItem -mf --no-interaction
php artisan make:controller FeatureItemController --no-interaction
php artisan make:request StoreFeatureItemRequest --no-interaction
php artisan make:policy FeatureItemPolicy --model=FeatureItem --no-interaction
php artisan make:test FeatureItemTest --no-interaction

# Run checks
php artisan migrate
php artisan wayfinder:generate
npm run types
php artisan test --filter=FeatureItem
```
