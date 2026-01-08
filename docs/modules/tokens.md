# Application Invite Tokens

## Overview

Tokens provide shareable links for property access. They can be anonymous (shareable URL) or personal (email-specific).

## Key Fields

| Field | Description |
|-------|-------------|
| `property_id` | Property this grants access to |
| `name` | Optional label ("Open House Link", "LinkedIn Ad") |
| `token` | 64-char unique string |
| `type` | `shareable` or `personal` |
| `email` | For personal tokens only |
| `max_uses` | Optional usage limit |
| `used_count` | Current application count |
| `view_count` | Link click count |
| `expires_at` | Token expiration |

## Token Types

### Anonymous Shareable Token

```
Manager creates token -> Shares URL publicly or privately
-> Anyone with link can view property until expiry
-> view_count incremented on each access
-> Must register/login to apply
-> On signup: Lead created with source=token_signup
```

### Personal Invite Token

```
Manager creates token with email -> Sends invite
-> Only that email can use the token
-> Linked to Lead for engagement tracking
```

## Access Control Flow

| Property Setting | Token Required? | Who Can Apply |
|------------------|-----------------|---------------|
| `application_access = open` | No | Anyone who can view |
| `application_access = link_required` | Yes | Anyone with valid token |
| `application_access = invite_only` | Yes (personal) | Only personally invited leads |

## Token Validation

On access, tokens are validated for:
1. Existence
2. Expiration (`expires_at`)
3. Usage limit (`max_uses` vs `used_count`)
4. Email match (for personal tokens)

## Related Files

- `app/Models/ApplicationInviteToken.php`
- `resources/js/Pages/Tokens/` (manager portal)
