# Documentation Index

> RentPath - Rental property management platform for the European market

## Architecture

| Topic                | Description                                  | File                                                 |
| -------------------- | -------------------------------------------- | ---------------------------------------------------- |
| System Overview      | Domain structure, subdomains, tech stack     | [architecture/overview.md](architecture/overview.md) |
| Storage              | S3/CloudFront setup, signed URLs, file types | [architecture/storage.md](architecture/storage.md)   |
| Internationalization | Multi-language support (EN/FR/DE/NL)         | [architecture/i18n.md](architecture/i18n.md)         |

## Modules

| Module           | Responsibility                                 | File                                               |
| ---------------- | ---------------------------------------------- | -------------------------------------------------- |
| Users & Profiles | Authentication, PropertyManager, TenantProfile | [modules/users.md](modules/users.md)               |
| Properties       | Property listings, types, specifications       | [modules/properties.md](modules/properties.md)     |
| Applications     | Tenant applications, status workflow           | [modules/applications.md](modules/applications.md) |
| Leads            | Lead tracking, engagement funnel               | [modules/leads.md](modules/leads.md)               |
| Tokens           | Invite tokens, access control                  | [modules/tokens.md](modules/tokens.md)             |

## Patterns

| Pattern             | When to Use                                        | File                                             |
| ------------------- | -------------------------------------------------- | ------------------------------------------------ |
| Wizard Architecture | Multi-step forms (property creation, applications) | [patterns/wizard.md](patterns/wizard.md)         |
| Validation          | Frontend/backend validation strategy               | [patterns/validation.md](patterns/validation.md) |
| User Flows          | End-to-end journeys for PM and tenants             | [patterns/user-flows.md](patterns/user-flows.md) |
| Sizing Standards    | Component sizes, spacing, icons                    | [patterns/sizing.md](patterns/sizing.md)         |

## Project Management

| Document             | Purpose                              |
| -------------------- | ------------------------------------ |
| [TODO.md](TODO.md)   | Project roadmap and task tracking    |
| [IDEAS.md](IDEAS.md) | Future tooling and improvement ideas |
