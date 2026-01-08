---
name: test-feature
description: Write Pest PHP feature tests following RentPath conventions. Use for writing new tests, understanding test patterns, using factories, and ensuring proper coverage. Auto-triggers on "write test", "add test", "test this feature", "create test", "test coverage".
---

# Feature Test Writing Guide

You are helping write Pest PHP tests following RentPath conventions.

## Before You Start

1. **Check existing tests**: Look at `tests/Feature/` for patterns
2. **Check factories**: Review `database/factories/` for available states
3. **Understand the feature**: What behavior are you testing?

## Tools to Use

| Task | Tool | Command/Action |
|------|------|----------------|
| Create test | `Bash` | `php artisan make:test [Name]Test` |
| View factories | `Read` | `database/factories/[Model]Factory.php` |
| Run tests | `Bash` | `php artisan test --filter=[pattern]` |
| Run specific file | `Bash` | `php artisan test tests/Feature/[File].php` |
| Check coverage | `Bash` | `php artisan test --coverage` |

## Test Structure

### Basic Feature Test

```php
<?php

use App\Models\User;
use App\Models\Property;
use App\Models\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('user can view property list', function () {
    Property::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->get('/properties');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('properties/index')
        ->has('properties', 3)
    );
});
```

### Describe Block Pattern

```php
describe('Application Submission', function () {
    beforeEach(function () {
        $this->tenant = User::factory()->withTenantProfile()->create();
        $this->property = Property::factory()->vacant()->public()->create();
    });

    test('tenant can submit application', function () {
        $application = Application::factory()
            ->for($this->property)
            ->for($this->tenant->tenantProfile)
            ->draft()
            ->create();

        $response = $this->actingAs($this->tenant)
            ->post("/applications/{$application->id}/submit");

        $response->assertRedirect();
        expect($application->fresh()->status)->toBe('submitted');
    });

    test('cannot submit already submitted application', function () {
        $application = Application::factory()
            ->for($this->property)
            ->for($this->tenant->tenantProfile)
            ->submitted()
            ->create();

        $response = $this->actingAs($this->tenant)
            ->post("/applications/{$application->id}/submit");

        $response->assertForbidden();
    });
});
```

## Factory Reference

### UserFactory

```php
User::factory()->create();                           // Verified user
User::factory()->unverified()->create();             // Unverified
User::factory()->withTenantProfile()->create();      // With tenant profile
User::factory()->withPropertyManager()->create();    // With PM profile
User::factory()
    ->withTenantProfile(verified: true)
    ->create();                                      // Verified tenant
```

### TenantProfileFactory

```php
TenantProfile::factory()->create();                  // Basic profile
TenantProfile::factory()->verified()->create();      // Verified
TenantProfile::factory()->rejected('reason')->create();
TenantProfile::factory()->employed()->create();
TenantProfile::factory()->student()->create();
TenantProfile::factory()->withGuarantor()->create();
```

### PropertyFactory

```php
Property::factory()->create();                       // Public, vacant
Property::factory()->draft()->create();
Property::factory()->vacant()->create();
Property::factory()->leased()->create();
Property::factory()->public()->create();
Property::factory()->unlisted()->create();
Property::factory()->private()->create();
Property::factory()->requiresToken()->create();
Property::factory()->inviteOnly()->create();
Property::factory()->notAcceptingApplications()->create();
```

### ApplicationFactory

```php
Application::factory()->create();                    // Draft
Application::factory()->draft()->create();
Application::factory()->submitted()->create();
Application::factory()->underReview()->create();
Application::factory()->visitScheduled()->create();
Application::factory()->approved()->create();
Application::factory()->rejected()->create();
Application::factory()->withdrawn()->create();
```

### Relationship Factories

```php
// Create with specific relationships
Application::factory()
    ->for($property)
    ->for($tenantProfile)
    ->create();

// Create with nested relationships
$user = User::factory()
    ->has(TenantProfile::factory()->verified())
    ->create();

// Create multiple
Property::factory()
    ->count(5)
    ->for($propertyManager)
    ->create();
```

## Common Test Patterns

### Testing Authentication

```php
test('guest is redirected to login', function () {
    $response = $this->get('/dashboard');
    $response->assertRedirect('/login');
});

test('authenticated user can access dashboard', function () {
    $response = $this->actingAs($this->user)
        ->get('/dashboard');
    $response->assertOk();
});
```

### Testing Authorization

```php
test('user cannot view other user\'s application', function () {
    $otherUser = User::factory()->withTenantProfile()->create();
    $application = Application::factory()
        ->for($otherUser->tenantProfile)
        ->create();

    $response = $this->actingAs($this->user)
        ->get("/applications/{$application->id}");

    $response->assertForbidden();
});

test('owner can view their application', function () {
    $application = Application::factory()
        ->for($this->user->tenantProfile)
        ->create();

    $response = $this->actingAs($this->user)
        ->get("/applications/{$application->id}");

    $response->assertOk();
});
```

### Testing Validation

```php
test('validates required fields', function () {
    $response = $this->actingAs($this->user)
        ->post('/properties', [
            'title' => '',  // Required field empty
        ]);

    $response->assertSessionHasErrors('title');
});

test('validates field format', function () {
    $response = $this->actingAs($this->user)
        ->post('/properties', [
            'rent_amount' => 'not-a-number',
        ]);

    $response->assertSessionHasErrors('rent_amount');
});
```

### Testing Subdomain Routes

```php
test('manager can access manager portal', function () {
    $user = User::factory()->withPropertyManager(verified: true)->create();
    $managerUrl = 'http://manager.' . config('app.domain');

    $response = $this->actingAs($user)
        ->get("{$managerUrl}/properties");

    $response->assertOk();
});

test('tenant cannot access manager portal', function () {
    $user = User::factory()->withTenantProfile()->create();
    $managerUrl = 'http://manager.' . config('app.domain');

    $response = $this->actingAs($user)
        ->get("{$managerUrl}/properties");

    $response->assertForbidden();
});
```

### Testing Inertia Responses

```php
use Inertia\Testing\AssertableInertia as Assert;

test('returns correct page component', function () {
    $response = $this->actingAs($this->user)
        ->get('/properties');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('properties/index')
    );
});

test('passes expected props', function () {
    Property::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->get('/properties');

    $response->assertInertia(fn (Assert $page) => $page
        ->has('properties', 3)
        ->has('properties.0', fn (Assert $prop) => $prop
            ->has('id')
            ->has('title')
            ->has('status')
            ->etc()
        )
    );
});
```

### Testing File Uploads

```php
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('user can upload document', function () {
    Storage::fake('s3-private');

    $file = UploadedFile::fake()->create('document.pdf', 1024);

    $response = $this->actingAs($this->user)
        ->post('/profile/documents', [
            'id_document' => $file,
        ]);

    $response->assertOk();
    Storage::disk('s3-private')->assertExists('documents/' . $file->hashName());
});
```

### Testing Database State

```php
test('creates application in database', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply", [
            'message' => 'I am interested',
        ]);

    $this->assertDatabaseHas('applications', [
        'property_id' => $this->property->id,
        'tenant_profile_id' => $this->tenant->tenantProfile->id,
        'status' => 'draft',
    ]);
});

test('deletes application from database', function () {
    $application = Application::factory()
        ->for($this->tenant->tenantProfile)
        ->draft()
        ->create();

    $response = $this->actingAs($this->tenant)
        ->delete("/applications/{$application->id}");

    $this->assertDatabaseMissing('applications', [
        'id' => $application->id,
    ]);
});
```

## Test Coverage Checklist

### For CRUD Operations

```
[ ] Index - list items with pagination
[ ] Index - filter/search works
[ ] Create - form renders
[ ] Create - validation errors
[ ] Create - success creates record
[ ] Show - displays correct item
[ ] Show - 404 for non-existent
[ ] Update - form renders with data
[ ] Update - validation errors
[ ] Update - success updates record
[ ] Delete - removes record
[ ] Delete - handles dependencies
```

### For Workflows

```
[ ] Each status transition
[ ] Invalid transitions rejected
[ ] Authorization at each step
[ ] Side effects triggered (events, notifications)
```

### For Wizards

```
[ ] Each step renders
[ ] Step validation works
[ ] Can navigate between valid steps
[ ] Cannot skip ahead
[ ] Draft saves work
[ ] Final submission works
```

## Running Tests

```bash
# All tests
php artisan test

# Specific file
php artisan test tests/Feature/ApplicationFlowTest.php

# Filter by name
php artisan test --filter="can submit application"

# Filter by describe block
php artisan test --filter="Application Submission"

# With coverage
php artisan test --coverage

# Parallel execution
php artisan test --parallel

# Stop on first failure
php artisan test --stop-on-failure
```

## Documentation References

- `tests/Pest.php` - Global test configuration
- `database/factories/` - All model factories
- `.claude/agents/testing-expert.md` - Testing expert agent
- `docs/patterns/wizard.md` - Wizard testing patterns

## Debugging Tips

```php
// Dump response content
$response->dump();
$response->dumpHeaders();
$response->dumpSession();

// Disable exception handling to see full errors
$this->withoutExceptionHandling();

// Debug database state
dd(Application::all()->toArray());

// Check what was validated
dd($response->exception->validator->errors()->toArray());
```
