# System Overview

RentPath is a rental property management platform with multi-market support (EU, US, UK, Australia), connecting property managers with tenants through a streamlined application process.

## Domain Structure

```
rentpath.app (Root Domain)
├─ Public pages (landing, legal, contact)
├─ Public property previews (/property/{token})
├─ Authentication (login, register)
└─ Tenant portal (authenticated)
   ├─ Dashboard
   ├─ Applications
   └─ Profile & Settings

manager.rentpath.app (Manager Subdomain)
└─ Property manager portal (100% authenticated)
   ├─ Dashboard
   ├─ Properties (property management)
   ├─ Applications (review & manage)
   ├─ Leads (track interested tenants)
   └─ Settings
```

**Key Decision**: Root domain hosts main product (public + tenant features). Manager subdomain hosts specialized authenticated portal.

## Subdomain Routing

Subdomain routing is handled by `CheckSubdomain` middleware (`app/Http/Middleware/CheckSubdomain.php`).

**Environment Variables** (critical for auth):

```bash
APP_DOMAIN=rentpath.test | rentpath.app
SESSION_DOMAIN=.rentpath.test | .rentpath.app  # Leading dot for subdomain auth
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12 (PHP 8.3) + Inertia.js |
| Frontend | React 19 + TypeScript + Tailwind CSS 4 |
| Database | MySQL 8.0 |
| Storage | S3 + CloudFront (signed URLs) |
| Infrastructure | AWS Elastic Beanstalk, RDS, CodePipeline |
| IaC | Terraform |

## Key Design Principles

1. **Flexible Role System**: Users can be both tenant and property manager
2. **Public Entry, Auth to Act**: View properties without account, must register to apply
3. **Draft Support**: Save progress on profiles and applications
4. **Comprehensive Audit Trail**: Track all status changes with timestamps
5. **Token-Based Access**: Control property visibility (public vs. private invites)
6. **Document Privacy**: All sensitive documents in private storage with signed URLs
7. **Verification Gates**: Both tenants and PMs must verify before full access
8. **"Other" Options Require Specification**: Whenever a dropdown includes an "Other" option, a required text field must appear conditionally
