# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.3.28
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- tightenco/ziggy (ZIGGY) - v2
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

---

## Laravel Boost MCP Tools

Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

### Artisan

- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

### URLs

- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

### Tinker / Debugging

- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

### Reading Browser Logs

- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

### Searching Documentation (Critical)

- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared.

**Search Syntax:**

1. Simple Word Searches with auto-stemming - `authentication` finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - `rate limit` finds knowledge containing both terms
3. Quoted Phrases (Exact Position) - `"infinite scroll"` - words must be adjacent
4. Mixed Queries - `middleware "rate limit"` - both conditions
5. Multiple Queries - `["authentication", "middleware"]` - ANY of these terms

---

## PHP Guidelines

- Always use curly braces for control structures, even if it has one line.

### Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

```php
protected function isAccessible(User $user, ?string $path = null): bool
{
    // ...
}
```

### Comments

- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

### PHPDoc Blocks

- Add useful array shape type definitions for arrays when appropriate.

### Enums

- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

---

## Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test` with a specific filename or filter.

---

## Inertia.js

### Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use `search-docs` for accurate guidance on all things Inertia.

### Inertia v2 Features

- Polling, Prefetching, Deferred props
- Infinite scrolling using merging props and `WhenVisible`
- Lazy loading data on scroll

### Deferred Props & Empty States

- When using deferred props on the frontend, you should add a nice empty state with pulsing / animated skeleton.

### Forms

- The recommended way to build forms is with the `<Form>` component. Use `search-docs` with query `form component`.
- Forms can also use the `useForm` helper for more programmatic control.
- `resetOnError`, `resetOnSuccess`, and `setDefaultsOnSuccess` are available on the `<Form>` component.

---

## Laravel Guidelines

### Do Things the Laravel Way

- Use `php artisan make:` commands to create new files. List available commands using `list-artisan-commands` tool.
- If creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands.

### Database

- Always use proper Eloquent relationship methods with return type hints.
- Use Eloquent models and relationships before suggesting raw database queries.
- Avoid `DB::`; prefer `Model::query()`.
- Generate code that prevents N+1 query problems by using eager loading.

### Model Creation

- When creating new models, create useful factories and seeders for them too.

### APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing routes don't.

### Controllers & Validation

- Always create Form Request classes for validation rather than inline validation in controllers.
- Check sibling Form Requests for array or string based validation rules convention.

### Queues

- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization

- Use Laravel's built-in auth features (gates, policies, Sanctum, etc.).

### URL Generation

- Prefer named routes and the `route()` function.

### Configuration

- Use environment variables only in configuration files - never use `env()` directly outside config files.

### Testing

- When creating models for tests, use factories. Check if the factory has custom states.
- Use `php artisan make:test` for feature tests, pass `--unit` for unit tests.

### Vite Error

- If you receive "ViteException: Unable to locate file in Vite manifest", run `npm run build` or `npm run dev`.

---

## Laravel 12 Specifics

- Use `search-docs` for version specific documentation.
- Laravel 11+ has streamlined file structure which this project uses.

### Structure

- No middleware files in `app/Http/Middleware/` by default.
- `bootstrap/app.php` registers middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php`.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available.

### Database

- When modifying a column, the migration must include all attributes previously defined on the column.
- Laravel 11 allows limiting eagerly loaded records natively: `$query->latest()->limit(10);`.

### Models

- Casts can be set in a `casts()` method on a model rather than the `$casts` property.

---

## Laravel Wayfinder

Wayfinder generates TypeScript functions and types for Laravel controllers and routes.

### Guidelines

- Always use `search-docs` to check wayfinder correct usage.
- Prefer named imports for tree-shaking: `import { show } from '@/actions/...'`
- Avoid default controller imports (prevents tree-shaking).
- Run `php artisan wayfinder:generate` after route changes if Vite plugin isn't installed.

### Features

- Form Support: Use `.form()` with `--with-form` flag
- HTTP Methods: Call `.get()`, `.post()`, `.patch()`, `.put()`, `.delete()`
- Invokable Controllers: Import and invoke directly as functions
- Named Routes: Import from `@/routes/` for non-controller routes
- Parameter Binding: Detects route keys and accepts matching object properties
- Query Merging: Use `mergeQuery` to merge with `window.location.search`
- Query Parameters: Pass `{ query: {...} }` to append params
- Route Objects: Functions return `{ url, method }` shaped objects
- URL Extraction: Use `.url()` to get URL string

---

## Pest Testing

### Core

- Use Pest PHP for all tests. Check existing tests for conventions.
- Use `describe()` blocks to group related tests.
- Use `it()` for individual test cases with descriptive names.
- Use `beforeEach()` for common setup within a describe block.

### Mocking

- When mocking, use `$this->mock()` or import via `use function Pest\Laravel\mock;`.
- Create partial mocks when you only need to mock specific methods.

### Datasets

- Use datasets to simplify tests with duplicated data patterns.

### Pest v4 Features

- Browser testing, smoke testing, visual regression testing, test sharding, faster type coverage.
- Browser tests should live in `tests/Browser/`.
- Use `search-docs` for detailed guidance.

---

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

---

## Tailwind CSS

### Core

- Use Tailwind CSS classes to style HTML, check existing conventions first.
- When listing items, use gap utilities for spacing, don't use margins.
- If existing pages support dark mode, new pages must support it too.

### Tailwind v4

- Always use Tailwind CSS v4 - do not use deprecated utilities.
- Configuration is CSS-first using the `@theme` directive.
- Import Tailwind using `@import "tailwindcss";` not `@tailwind` directives.

### Replaced Utilities

| Deprecated        | Replacement   |
| ----------------- | ------------- |
| bg-opacity-\*     | bg-black/\*   |
| text-opacity-\*   | text-black/\* |
| flex-shrink-\*    | shrink-\*     |
| flex-grow-\*      | grow-\*       |
| overflow-ellipsis | text-ellipsis |
