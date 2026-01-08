---
name: code-review
description: Apply RentPath-specific code review standards. Use for reviewing code changes, checking for security issues, verifying pattern adherence, and ensuring code quality. Auto-triggers on "review this code", "code review", "is this ready to merge", "check my changes", "PR review".
---

# RentPath Code Review Guide

You are performing a code review using RentPath-specific standards and patterns.

## Before You Start

1. **Understand the change**: What is the purpose of this code?
2. **Check related docs**: Is there documentation for this feature?
3. **Identify scope**: Backend, frontend, or full-stack change?

## Tools to Use

| Task | Tool | Command/Action |
|------|------|----------------|
| View changes | `Bash` | `git diff` or `git diff --staged` |
| Check file | `Read` | Read specific files |
| Find patterns | `Grep` | Search for similar code |
| Run tests | `Bash` | `php artisan test` |
| Type check | `Bash` | `npm run types` |
| Lint PHP | `Bash` | `./vendor/bin/pint --test` |
| Lint JS | `Bash` | `npm run lint` |

## Review Checklist

### 1. Security Review (Critical)

```
[ ] No SQL injection (use Eloquent, parameterized queries)
[ ] No XSS vulnerabilities (escape output, use React)
[ ] No mass assignment issues (use $fillable)
[ ] No sensitive data in logs or responses
[ ] Authorization checks present (policies, gates)
[ ] File uploads validated (type, size, path)
[ ] No hardcoded credentials or secrets
[ ] CSRF protection maintained
```

**Red flags:**
```php
// BAD: SQL injection risk
DB::select("SELECT * FROM users WHERE id = $id");

// GOOD: Parameterized
DB::select("SELECT * FROM users WHERE id = ?", [$id]);
User::find($id);

// BAD: Mass assignment
$user->update($request->all());

// GOOD: Validated input
$user->update($request->validated());
```

### 2. Validation Review

```
[ ] Frontend Zod schema present/updated
[ ] Backend Form Request present/updated
[ ] Error messages match between Zod and Laravel
[ ] Database constraints appropriate
[ ] Required fields properly marked
```

**Check validation alignment:**
```bash
# Compare Zod schema
grep -A 20 "fieldName" resources/js/lib/validation/application-schemas.ts

# Compare Form Request
grep -A 5 "field_name" app/Http/Requests/StoreApplicationRequest.php
```

### 3. Architecture Review

```
[ ] Follows existing patterns (check sibling files)
[ ] Controller is thin (< 50 lines per method ideally)
[ ] Business logic in appropriate layer
[ ] No N+1 query problems (check eager loading)
[ ] Proper use of relationships
```

**Pattern checks:**
```php
// BAD: Fat controller with business logic
public function approve(Application $application)
{
    // 50+ lines of business logic...
}

// GOOD: Thin controller, logic in service
public function approve(Application $application)
{
    $this->applicationService->approve($application);
    return redirect()->back();
}

// BAD: N+1 query
$applications = Application::all();
foreach ($applications as $app) {
    echo $app->property->title; // Query per iteration!
}

// GOOD: Eager loading
$applications = Application::with('property')->get();
```

### 4. Frontend Review

```
[ ] TypeScript types correct and complete
[ ] Components follow existing patterns
[ ] Tailwind classes (no inline styles)
[ ] Proper error handling
[ ] Loading states present
[ ] Accessibility considered (labels, ARIA)
[ ] i18n keys used (no hardcoded strings)
```

**Pattern checks:**
```tsx
// BAD: Inline styles
<div style={{ color: 'red' }}>Error</div>

// GOOD: Tailwind
<div className="text-red-500">Error</div>

// BAD: Hardcoded string
<label>Email Address</label>

// GOOD: i18n
<label>{translate(translations, 'form.email')}</label>
```

### 5. Testing Review

```
[ ] Tests cover happy path
[ ] Tests cover error cases
[ ] Tests cover authorization
[ ] Factory states used appropriately
[ ] No flaky tests (timing, randomness)
[ ] Tests are readable and maintainable
```

**Check test coverage:**
```bash
# Run specific tests
php artisan test --filter=ApplicationFlow

# Check coverage
php artisan test --coverage
```

### 6. Database Review

```
[ ] Migration has up() and down()
[ ] Indexes on frequently queried columns
[ ] Foreign keys with appropriate cascades
[ ] Appropriate column types
[ ] Nullable only when necessary
```

**Migration checks:**
```php
// GOOD: Complete migration
public function up(): void
{
    Schema::table('applications', function (Blueprint $table) {
        $table->string('new_field')->nullable()->index();
        $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
    });
}

public function down(): void
{
    Schema::table('applications', function (Blueprint $table) {
        $table->dropColumn('new_field');
    });
}
```

### 7. Performance Review

```
[ ] No unnecessary queries in loops
[ ] Appropriate pagination for lists
[ ] Heavy operations queued (if applicable)
[ ] Caching considered for expensive operations
[ ] Indexes used for filtered queries
```

### 8. Code Quality Review

```
[ ] Descriptive variable/method names
[ ] No magic numbers/strings
[ ] DRY (Don't Repeat Yourself)
[ ] Single Responsibility Principle
[ ] Consistent formatting (Pint, ESLint)
[ ] No commented-out code
[ ] No TODO/FIXME without issue reference
```

## Review Commands

```bash
# Run all checks
./vendor/bin/pint --test          # PHP formatting
npm run lint                       # JS/TS linting
npm run types                      # TypeScript check
php artisan test                   # All tests

# Quick validation
php artisan test --filter=Validation
php artisan test --filter=Authorization
```

## Review Response Format

When providing review feedback, use this format:

```markdown
## Code Review: [Feature/PR Name]

### Summary
[Brief description of what was reviewed]

### Approval Status
- [ ] Approved
- [ ] Approved with minor changes
- [ ] Changes requested

### Critical Issues (Must Fix)
1. **[File:Line]** - [Issue description]
   ```php
   // Current code
   ```
   **Suggestion:**
   ```php
   // Recommended fix
   ```

### Suggestions (Nice to Have)
1. **[File:Line]** - [Suggestion]

### Positive Notes
- [What was done well]

### Checklist Verification
- [x] Security review passed
- [x] Validation aligned
- [ ] Tests need expansion
```

## Documentation References

- `docs/architecture/overview.md` - Architecture patterns
- `docs/patterns/validation.md` - Validation strategy
- `docs/patterns/wizard.md` - Wizard patterns
- `.claude/rules/laravel-boost.md` - Laravel conventions

## Common Issues by Area

### Controller Issues
- Too much business logic
- Missing authorization
- Not using Form Requests
- Returning raw data instead of Resources

### Model Issues
- Missing fillable/guarded
- Missing casts
- N+1 relationships
- Missing scopes for common queries

### Frontend Issues
- Missing TypeScript types
- Hardcoded strings (i18n)
- Missing loading/error states
- Accessibility issues

### Test Issues
- Missing edge cases
- Not using factories
- Testing implementation instead of behavior
- Flaky async tests
