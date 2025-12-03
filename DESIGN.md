# RentPath - Architecture Design

## Overview

RentPath is a rental property management platform connecting property managers with tenants through a streamlined application process.

---

## Architecture Fundamentals

### Domain Structure

```
rentpath.app (Root Domain)
├─ Public pages (landing, legal, contact)
├─ Public property previews (/property/{token})
├─ Authentication (login, register)
└─ Tenant portal (authenticated)
   ├─ Dashboard
   ├─ Applications
   ├─ Profile & Settings

manager.rentpath.app (Manager Subdomain)
└─ Property manager portal (100% authenticated)
   ├─ Dashboard
   ├─ Property management
   ├─ Application review
   └─ Settings
```

**Key Decision**: Root domain hosts main product (public + tenant features). Manager subdomain hosts specialized authenticated portal.

---

## User & Profile System

### Single User Table + Optional Role Profiles

```
users (authentication)
├─ email, password, first_name, last_name
├─ email_verified_at
└─ timestamps

property_managers (optional profile, 1:1 with users)
├─ user_id (unique)
├─ type: individual | professional
├─ company_name, license_number
├─ documents (private S3)
├─ profile_verified_at
└─ verification status

tenant_profiles (optional profile, 1:1 with users)
├─ user_id (unique)
├─ personal info (DOB, nationality, phone)
├─ current address
├─ employment (status, employer, income)
├─ documents (ID, income proof, references)
├─ preferences (move-in date, pets, smoker)
├─ profile_verified_at
└─ verification status
```

**Key Decision**: One user can have both profiles (e.g., landlord who also rents). Verification required before full access.

---

## Core Entities

### 1. Properties

**Ownership**: Belongs to `property_manager`

**Key Fields**:

- Type/subtype (apartment/studio, house/villa, room/co-living, etc.)
- Specifications (bedrooms, bathrooms, size, floor, amenities)
- Energy ratings (energy class, insulation, heating)
- Rental info (rent, currency, available date)
- Address (full address fields)
- Status (inactive → available → application_received → ... → leased → archived)

**Access Control**:

- `requires_invite`: Boolean - when true, only invite tokens grant access; when false, direct URLs work
- `invite_token`: 64-char token for private/controlled access
- `invite_token_expires_at`: Token expiration
- Note: Future enhancement will add `is_listed` for public listing visibility (separate from application access)

**Images**: Multiple images via `property_images` table (has `is_main` flag, sort order)

### 2. Applications

**Relationships**:

- `property_id` → Property
- `tenant_profile_id` → Tenant Profile

**Status Flow**:

```
draft → submitted → under_review → visit_scheduled → visit_completed
    → approved/rejected/withdrawn → leased → archived/deleted
```

**Key Fields**:

- Application details (move-in date, lease duration, cover letter)
- Occupants & pets info (can override profile)
- References & previous landlord
- Application-specific documents (private S3)
- Review tracking (reviewer, timestamps, notes)
- Visit management (scheduled, completed, notes)
- Approval tracking (approver, timestamps, notes)
- Lease details (start/end dates, rent, deposit, signed document)
- Audit trail (submitted_at, withdrawn_at, archived_at)
- `invited_via_token`: Tracks which token was used

**Uniqueness**: One active (non-draft, non-archived) application per tenant per property (enforced in application code).

### 3. Application Invite Tokens

**Purpose**: Control property access for applications

**Token Types**:

- `private`: Shareable link, anyone can view until expiry
- `invite`: Email-restricted, only specific user can view

**Key Fields**:

- `property_id`: Property this grants access to
- `token`: 64-char unique string
- `type`: private | invite
- `email`: Required if type=invite
- `max_uses`: Optional usage limit
- `used_count`: Current uses
- `expires_at`: Token expiration
- `status`: active | revoked | expired
- `created_by_user_id`: Token creator

---

## User Flows

### Property Manager Flow

1. **Onboarding**:
    - Register → Create PM profile → Upload documents → Wait for verification

2. **Property Listing**:
    - Create property → Add details & images → Generate invite token OR enable public URL

3. **Application Management**:
    - Receive applications → Review → Schedule visit → Approve/Reject → Sign lease

### Tenant Flow

1. **Discovery**:
    - Click property link (from external listing or email)
    - View property details (PUBLIC, no auth required)

2. **Application**:
    - Click "Apply" → Register/Login (if needed)
    - Create/verify tenant profile
    - Fill application (can save as draft)
    - Submit application

3. **Tracking**:
    - Dashboard shows application status
    - Receive notifications on status changes
    - Schedule visit, sign lease

---

## Token Access Control

### Public Shareable Token (`type=private`)

```
Property Manager creates token → Shares URL publicly
→ Anyone can view property until expiry
→ Must register/login to apply
```

### Email-Restricted Token (`type=invite`)

```
Property Manager creates token with email → Sends to specific person
→ Only user with that email can view property
→ Must login with invited email to access
→ Tracks usage (optional max_uses)
```

---

## Property Types & Subtypes

### Apartment

`studio`, `loft`, `duplex`, `triplex`, `penthouse`, `serviced`

### House

`detached`, `semi-detached`, `villa`, `bungalow`

### Room

`private_room`, `student_room`, `co-living`

### Commercial

`office`, `retail`

### Industrial

`warehouse`, `factory`

### Parking

`garage`, `indoor_spot`, `outdoor_spot`

---

## Status Workflows

### Property Status

| Status                 | Description                | Next States                                         |
| ---------------------- | -------------------------- | --------------------------------------------------- |
| `inactive`             | Not accepting applications | available, maintenance, archived                    |
| `available`            | Open for applications      | application_received, leased, inactive, maintenance |
| `application_received` | Has pending applications   | under_review, available, archived                   |
| `under_review`         | Reviewing applications     | visit_scheduled, approved, rejected, available      |
| `visit_scheduled`      | Visit confirmed            | leased, available, maintenance                      |
| `approved`             | Tenant approved            | leased, available                                   |
| `leased`               | Currently rented           | available, maintenance, archived                    |
| `maintenance`          | Under repair               | available, inactive                                 |
| `archived`             | Permanently closed         | —                                                   |

### Application Status

| Status            | Description              | Next States                                   |
| ----------------- | ------------------------ | --------------------------------------------- |
| `draft`           | Started, not submitted   | submitted, deleted                            |
| `submitted`       | Awaiting review          | under_review, withdrawn, archived             |
| `under_review`    | Being reviewed           | visit_scheduled, approved, rejected, archived |
| `visit_scheduled` | Visit agreed             | visit_completed, withdrawn, archived          |
| `visit_completed` | Visit done               | approved, rejected, withdrawn, archived       |
| `approved`        | Tenant approved          | leased, withdrawn, archived                   |
| `rejected`        | Application declined     | archived                                      |
| `withdrawn`       | Tenant withdrew          | archived                                      |
| `leased`          | Lease signed             | archived                                      |
| `archived`        | Closed, kept for records | —                                             |
| `deleted`         | Draft cleanup            | —                                             |

---

## Storage Architecture

### StorageHelper Pattern

**Local Development**:

- Public: `public` disk (direct URLs)
- Private: `private` disk (Laravel signed routes)

**Production**:

- Public: `s3_public` → CloudFront URLs
- Private: `s3_private` → CloudFront signed URLs (24h expiry)
    - CloudFront private key from AWS Secrets Manager (cached 1 hour)

### File Types

| Type              | Visibility | Max Size | Formats         |
| ----------------- | ---------- | -------- | --------------- |
| Profile pictures  | Public     | 5MB      | JPEG, PNG, WEBP |
| ID documents      | Private    | 20MB     | PDF, JPEG, PNG  |
| License documents | Private    | 20MB     | PDF, JPEG, PNG  |
| Property images   | Private    | 10MB     | JPEG, PNG, WEBP |
| Income proof      | Private    | 20MB     | PDF, JPEG, PNG  |
| Reference letters | Private    | 20MB     | PDF             |
| Lease documents   | Private    | 20MB     | PDF             |

---

## Security & Verification

### Profile Verification

**Property Managers**: Must verify before creating properties
**Tenants**: Must verify before submitting applications

**Process**:

1. Upload required documents
2. Admin reviews (sets `profile_verified_at`)
3. If rejected: `verification_rejection_reason` + `verification_rejected_fields`
4. User can edit and resubmit

### Authorization

- Property CRUD: Only owner can edit/delete
- Application access: Only tenant who created + PM of property
- Documents: CloudFront signed URLs or Laravel signed routes
- Token validation: Check expiry, status, email match (if invite type)

---

## Key Design Principles

1. **Flexible Role System**: Users can be both tenant and property manager
2. **Public Entry, Auth to Act**: View properties without account, must register to apply
3. **Draft Support**: Save progress on profiles and applications
4. **Comprehensive Audit Trail**: Track all status changes with timestamps
5. **Token-Based Access**: Control property visibility (public vs. private invites)
6. **Document Privacy**: All sensitive documents in private storage with signed URLs
7. **Verification Gates**: Both tenants and PMs must verify before full access

---

## Multi-Step Wizard Architecture

### Overview

Multi-step wizards (property creation, tenant applications) use a **step-locked validation pattern** that ensures data integrity by preventing users from advancing or remaining on later steps when earlier steps become invalid.

### Core Concepts

```
viewingStep     → The step currently displayed to the user
maxStepReached  → The highest step the user has validly completed
completedSteps  → Set of steps that have been validated and passed
```

### Validation Flow

```
User edits field in Step N
    ↓
Frontend validates Step N immediately
    ↓
If Step N invalid AND maxStepReached > N:
    → Reduce maxStepReached to N
    → Lock user into Step N until valid
    ↓
Autosave triggers (debounced)
    ↓
Backend validates all steps 1..N
    ↓
Backend returns actual maxValidStep
    ↓
Frontend updates maxStepReached from backend response
```

### Key Principles

1. **Backend is source of truth**: Frontend validation is for UX; backend validation prevents invalid DB states
2. **Progressive validation**: Can only advance if all previous steps are valid
3. **Immediate feedback**: Errors shown as soon as field loses focus
4. **No orphaned progress**: Editing step 2 and making it invalid locks you out of step 3+
5. **Data preservation**: Invalid states don't delete data from later steps, just lock access

### State Management

| State              | Purpose            | When Updated                 |
| ------------------ | ------------------ | ---------------------------- |
| `viewingStep`      | Current UI step    | User navigation              |
| `maxStepReached`   | Highest valid step | On validation (may decrease) |
| `wizard_step` (DB) | Persisted progress | On every save                |

### Navigation Rules

| Action              | Allowed When             |
| ------------------- | ------------------------ |
| Go to previous step | Always                   |
| Go to next step     | Current step valid       |
| Skip to step N      | All steps 1..(N-1) valid |
| Publish/Submit      | All steps valid          |

### Database Persistence

For draft entities (properties, applications):

```sql
-- Track wizard progress
wizard_step INT DEFAULT 1      -- Current/max step reached
status ENUM('draft', ...)      -- Draft until published

-- Relaxed validation for drafts
-- Only required fields: enough to identify the draft
-- Full validation only on publish/submit
```

### Autosave Strategy

1. **Trigger**: Debounced (1000ms) after field changes
2. **Validation**: Backend validates steps 1..wizard_step
3. **Response**: Returns `{ saved_at, max_valid_step }`
4. **UI Update**: If `max_valid_step < maxStepReached`, reduce and show errors

### Error Handling

```typescript
// On every data change
useEffect(() => {
    const maxValid = calculateMaxValidStep(data);
    if (maxValid < maxStepReached) {
        setMaxStepReached(maxValid);
        // User is now locked to step maxValid until it's valid
    }
}, [data]);
```

---

## Form Validation Architecture

### Overview

Form validation follows a **dual-layer approach**: frontend (Zod) provides immediate UX feedback, backend (Laravel Form Requests) acts as the authoritative gate. Both layers use identical error messages for consistency.

### Validation Stack

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React/TypeScript)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Zod Schemas                                     │   │
│  │  - Per-step validation for wizards              │   │
│  │  - Real-time field validation on blur           │   │
│  │  - Type-safe, composable schemas                │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Shared Constants                                │   │
│  │  - Validation constraints (max lengths, ranges)  │   │
│  │  - Error messages (identical to backend)         │   │
│  │  - Enum values (types, subtypes, currencies)     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Backend (Laravel)                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Form Request Classes                            │   │
│  │  - SaveDraftRequest (relaxed, nullable fields)   │   │
│  │  - PublishRequest (strict, required fields)      │   │
│  │  - UpdateRequest (contextual validation)         │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Validation Traits                               │   │
│  │  - Shared rules() and messages() methods         │   │
│  │  - Conditional validation logic                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Backend is Source of Truth**: Frontend can be bypassed; backend must reject invalid data
2. **Consistent Messages**: Error text identical between frontend Zod and backend Laravel
3. **Progressive Validation**: Wizards validate current step only for navigation
4. **Full Validation on Submit**: All fields validated when publishing/submitting
5. **Fail Fast**: Show errors immediately on blur, don't wait for submission

### Validation Contexts

| Context          | Frontend        | Backend          | Rules               |
| ---------------- | --------------- | ---------------- | ------------------- |
| Field blur       | Zod schema      | -                | Single field        |
| Step navigation  | Zod step schema | -                | Current step fields |
| Autosave (draft) | -               | SaveDraftRequest | Relaxed (nullable)  |
| Publish/Submit   | Zod full schema | PublishRequest   | Strict (required)   |
| Edit existing    | Zod full schema | UpdateRequest    | Contextual          |

### File Structure

```
resources/js/lib/validation/
├── property-validation.ts    # Constraints (max lengths, ranges)
├── property-messages.ts      # Error messages
└── property-schemas.ts       # Zod schemas per step

app/Http/Requests/
├── Traits/
│   └── PropertyValidationRules.php  # Shared rules & messages
├── SavePropertyDraftRequest.php
├── PublishPropertyRequest.php
└── UpdatePropertyRequest.php
```

### Error Flow

```
User Input → Frontend Zod Validation
                    ↓
              Show inline error (immediate)
                    ↓
              Submit to Backend
                    ↓
         Laravel Form Request Validation
                    ↓
         ┌─────────┴─────────┐
         ↓                   ↓
    Validation OK       Validation Failed
         ↓                   ↓
    Process Request    Return 422 + errors
                             ↓
                    Frontend displays errors
                    (same format as frontend errors)
```

### Inertia.js Integration

Laravel validation errors flow automatically via Inertia:

- `ValidationException` → Session flash → `usePage().props.errors`
- Frontend displays `errors.fieldName` inline with field
- Use `form.clearErrors()` when field becomes valid

### Implementation Pattern

```typescript
// Frontend: Zod schema
const locationSchema = z.object({
    city: z.string().min(1, MESSAGES.city.required).max(100, MESSAGES.city.maxLength),
});

// Frontend: Validation on blur
const handleBlur = (field: string) => {
    const result = schema.safeParse(data);
    const error = result.error?.issues.find((i) => i.path[0] === field);
    setErrors((prev) => (error ? { ...prev, [field]: error.message } : omit(prev, field)));
};
```

```php
// Backend: Form Request
class PublishPropertyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'city' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'city.required' => 'City is required',  // Same as frontend
            'city.max' => 'City cannot exceed 100 characters',
        ];
    }
}
```

---

## Technology Stack

**Backend**: Laravel 12 (PHP 8.3) + Inertia.js
**Frontend**: React 19 + TypeScript + Tailwind CSS 4
**Database**: MySQL 8.0
**Storage**: S3 + CloudFront (signed URLs)
**Infrastructure**: AWS Elastic Beanstalk, RDS, CodePipeline
**IaC**: Terraform
