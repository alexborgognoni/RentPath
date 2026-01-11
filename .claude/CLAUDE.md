# RentPath

Rental property management platform with multi-market support (EU, US, UK, Australia) - unlike TurboTenant which focuses solely on the US market.

## Product Overview

**B2B: Manager Portal** (`manager.rentpath.app`)

- Property dashboard with guided onboarding wizard
- Application management with verification workflow
- Lead tracking and invite system

**B2C: Tenant Portal** (`rentpath.app`)

- Reusable tenant profile with documents
- Property discovery (public + invite-only)
- Application flow with progress tracking

## Documentation

All detailed documentation lives in `/docs`:

- **[docs/INDEX.md](docs/INDEX.md)** - Documentation index and navigation

### Architecture

- [docs/architecture/overview.md](docs/architecture/overview.md) - Domain structure, tech stack
- [docs/architecture/storage.md](docs/architecture/storage.md) - S3/CloudFront, signed URLs
- [docs/architecture/i18n.md](docs/architecture/i18n.md) - Multi-language support

### Modules

- [docs/modules/users.md](docs/modules/users.md) - Users, PropertyManager, TenantProfile
- [docs/modules/properties.md](docs/modules/properties.md) - Property listings, types, specs
- [docs/modules/applications.md](docs/modules/applications.md) - Application workflow
- [docs/modules/leads.md](docs/modules/leads.md) - Lead tracking system
- [docs/modules/tokens.md](docs/modules/tokens.md) - Invite tokens, access control

### Patterns

- [docs/patterns/wizard.md](docs/patterns/wizard.md) - Multi-step wizard architecture with step locking
- [docs/patterns/validation.md](docs/patterns/validation.md) - Laravel Precognition validation strategy
- [docs/patterns/user-flows.md](docs/patterns/user-flows.md) - PM and tenant journeys

### Project Management

- [docs/TODO.md](docs/TODO.md) - Current roadmap and task status
- [docs/IDEAS.md](docs/IDEAS.md) - Future tooling ideas

## Environment (Critical)

```bash
APP_DOMAIN=rentpath.test | rentpath.app
SESSION_DOMAIN=.rentpath.test | .rentpath.app  # Leading dot for subdomain auth
```

## Key Files

- **Middleware**: `app/Http/Middleware/CheckSubdomain.php` - Subdomain routing
- **Storage**: `app/Helpers/StorageHelper.php` - Environment-aware S3/CloudFront URLs
- **Services**: `app/Services/PropertyService.php`, `app/Services/ApplicationService.php` - Wizard business logic
- **Validation**: `app/Http/Requests/Property/Steps/`, `app/Http/Requests/Application/Steps/` - Per-step FormRequests
- **Infrastructure**: `infrastructure/README.md` - AWS deployment guide

## Instructions for Claude

- **Read docs first**: Check relevant docs in `/docs` before making architectural decisions
- **Prefer existing patterns**: Follow patterns documented in `/docs/patterns`
- **Validation**: Use Laravel Precognition with FormRequest rules as single source of truth
- **Keep docs current**: When changing functionality that impacts documentation in `/docs`, update the relevant docs to reflect the changes
- **Ask when unsure**: Clarify ambiguous requirements instead of guessing

## Git Guidelines

- Only commit when explicitly requested
- No AI attribution in commits
- Follow conventional commit format (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
