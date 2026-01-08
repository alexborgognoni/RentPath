# Leads

## Overview

A Lead tracks a person (identified by email) who has shown interest in a property OR who the manager wants to have interested. Bidirectional relationship.

## Key Fields

| Field | Description |
|-------|-------------|
| `property_id` | FK to properties |
| `email` | Required, indexed |
| `first_name`, `last_name` | Optional contact info |
| `phone` | Optional |
| `token` | Unique string for personal invite link |
| `source` | How the lead was created |
| `status` | Current engagement state |
| `user_id` | FK to users (nullable, linked on signup) |
| `application_id` | FK to applications (nullable) |
| `invite_token_id` | FK to tokens (if created via token) |
| `invited_at` | When invite was sent |
| `viewed_at` | When they first viewed property |
| `notes` | Manager's private notes |

## Lead Sources

| Source | Description |
|--------|-------------|
| `manual` | Manager added (showing, phone call, referral, open house) |
| `invite` | Manager sent personal invite to apply |
| `token_signup` | User signed up after clicking anonymous token link |
| `application` | Auto-created when user starts a draft application |
| `inquiry` | Property inquiry form (future) |

## Lead Status Flow

```
invited -> viewed -> drafting -> applied
    |         |          |          |
    v         v          v          v
archived  archived   archived   archived
```

| Status | Description | Next States |
|--------|-------------|-------------|
| `invited` | Manager invited, no engagement yet | viewed, archived |
| `viewed` | Clicked invite link / viewed property | drafting, archived |
| `drafting` | Started application, not submitted | applied, archived |
| `applied` | Submitted application | archived |
| `archived` | No longer tracking | - |

## Auto-Lead Creation

1. When a user creates a draft Application -> Lead created with `source: application`, `status: drafting`
2. When application is submitted -> Lead status updated to `applied`

## Related Files

- `app/Models/Lead.php`
- `resources/js/Pages/Leads/` (manager portal)
