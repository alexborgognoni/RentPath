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
   ├─ Properties (property management)
   ├─ Applications (review & manage)
   ├─ Leads (track interested tenants)
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
- Status (lifecycle only - see below)

**Status** (simplified lifecycle):

| Status        | Description                       |
| ------------- | --------------------------------- |
| `draft`       | Manager setting up, incomplete    |
| `vacant`      | No tenant, ready for market       |
| `leased`      | Tenant in place with active lease |
| `maintenance` | Off market for repairs/renovation |
| `archived`    | No longer managing this property  |

Note: Funnel stage (has applications, under review, etc.) is **derived from applications**, not stored on property.

**Visibility & Access Control**:

| Field                    | Values                           | Description                                 |
| ------------------------ | -------------------------------- | ------------------------------------------- |
| `visibility`             | public, unlisted, private        | Who can SEE the property                    |
| `accepting_applications` | boolean                          | Whether applications are currently accepted |
| `application_access`     | open, link_required, invite_only | Who can APPLY                               |

- `visibility = public`: Searchable, on listings page, SEO indexed
- `visibility = unlisted`: Only via direct link (like YouTube unlisted)
- `visibility = private`: Only manager can see
- `application_access = open`: Anyone who can view can apply
- `application_access = link_required`: Need a shareable token link
- `application_access = invite_only`: Only personally invited leads can apply

**Rules**:

- `status = draft` forces `visibility = private` and `accepting_applications = false`
- Other statuses: manager's choice
- Settings are preserved when changing status

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

### 3. Leads

A Lead is a person (identified by email) who has shown interest in a property OR who the manager wants to have interested (bidirectional).

**Key Fields**:

| Field             | Description                                        |
| ----------------- | -------------------------------------------------- |
| `property_id`     | FK to properties                                   |
| `email`           | Required, indexed                                  |
| `first_name`      | Optional                                           |
| `last_name`       | Optional                                           |
| `phone`           | Optional                                           |
| `token`           | Unique string for personal invite link             |
| `source`          | manual, invite, token_signup, application, inquiry |
| `status`          | invited, viewed, drafting, applied, archived       |
| `user_id`         | FK to users (nullable, linked on signup)           |
| `application_id`  | FK to applications (nullable)                      |
| `invite_token_id` | FK to tokens (if created via token)                |
| `invited_at`      | When invite was sent                               |
| `viewed_at`       | When they first viewed property                    |
| `notes`           | Manager's private notes                            |

**Status Flow**:

```
invited → viewed → drafting → applied
    ↓        ↓         ↓          ↓
archived  archived  archived  archived
```

**Sources**:

- `manual`: Manager added (showing, phone call, referral, open house)
- `invite`: Manager sent personal invite to apply
- `token_signup`: User signed up after clicking anonymous token link
- `application`: Auto-created when user starts a draft application
- `inquiry`: Property inquiry form (future)

**Auto-Lead Creation**:

1. When a user creates a draft Application → Lead created with `source: application`, `status: drafting`
2. When application is submitted → Lead status updated to `applied`

### 4. Application Invite Tokens

**Purpose**: Anonymous shareable links for property access (personal invites moved to Leads)

**Key Fields**:

| Field         | Description                        |
| ------------- | ---------------------------------- |
| `property_id` | Property this grants access to     |
| `name`        | Optional label ("Open House Link") |
| `token`       | 64-char unique string              |
| `max_uses`    | Optional usage limit               |
| `used_count`  | Current application count          |
| `view_count`  | Link click count                   |
| `expires_at`  | Token expiration                   |

Note: `type` and `email` fields removed - personal invites are now tracked via Leads.

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

### Anonymous Shareable Token

```
Property Manager creates token → Shares URL publicly or privately
→ Anyone with link can view property until expiry
→ view_count incremented on each access
→ Must register/login to apply
→ On signup: Lead created with source=token_signup
```

### Personal Invites (via Leads)

```
Property Manager creates Lead with email → Sends invite
→ Lead tracks engagement (invited → viewed → drafting → applied)
→ Lead has unique token for personal invite link
→ Linked to Application when tenant applies
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

## Property Specifications by Type

The Specifications wizard step shows different fields based on property type. Fields are organized into 4 sections (Rooms, Space, Parking, Building), each section only appears if at least one field within it is visible.

### Field Visibility Matrix

| Field                | Apartment | House | Room | Commercial | Industrial | Parking |
| -------------------- | :-------: | :---: | :--: | :--------: | :--------: | :-----: |
| **Rooms Section**    |
| Bedrooms             |     ✓     |   ✓   |  —   |     —      |     —      |    —    |
| Bathrooms            |     ✓     |   ✓   |  ✓   |     ✓      |     ✓      |    —    |
| **Space Section**    |
| Living Space         |     ✓     |   ✓   |  ✓   |     ✓      |     ✓      |   —\*   |
| Balcony/Terrace      |     ✓     |   ✓   |  ✓   |     —      |     —      |    —    |
| Land Size            |     —     |   ✓   |  —   |     —      |     —      |    —    |
| **Parking Section**  |
| Indoor Spots         |     ✓     |   ✓   |  —   |     ✓      |     ✓      |    —    |
| Outdoor Spots        |     ✓     |   ✓   |  —   |     ✓      |     ✓      |    —    |
| **Building Section** |
| Floor Level          |     ✓     |   —   |  ✓   |     ✓      |     —      |    ✓    |
| Year Built           |     ✓     |   ✓   |  —   |     ✓      |     ✓      |    —    |
| Has Elevator         |     ✓     |   ✓   |  ✓   |     ✓      |     —      |    ✓    |

\*Parking type has a special "Parking Space Size (optional)" field instead of Living Space.

### Section Visibility

| Type       | Rooms | Space | Parking | Building |
| ---------- | :---: | :---: | :-----: | :------: |
| Apartment  |   ✓   |   ✓   |    ✓    |    ✓     |
| House      |   ✓   |   ✓   |    ✓    |    ✓     |
| Room       |   ✓   |   ✓   |    —    |    ✓     |
| Commercial |   ✓   |   ✓   |    ✓    |    ✓     |
| Industrial |   ✓   |   ✓   |    ✓    |    ✓     |
| Parking    |   —   |  ✓\*  |    —    |    ✓     |

### Design Rationale

- **Bedrooms excluded from Room**: A room listing IS the bedroom
- **Bathrooms added to Industrial**: Warehouses/factories have worker facilities
- **Balcony added to Room**: Rooms can have private or shared balcony access
- **Floor Level added to Parking**: Multi-level parking garages have floor numbers
- **Elevator expanded**: Relevant for houses (accessibility), rooms (building access), and parking (garage accessibility)
- **Year Built excluded from Room/Parking**: Not relevant for individual room rentals or parking spaces

### Type-Specific Required Fields

Different property types have different required fields in the Specifications step. These requirements are enforced at all layers (frontend Zod, backend Laravel, database constraints).

| Field     | Apartment |  House  |  Room   | Commercial | Industrial | Parking  |
| --------- | :-------: | :-----: | :-----: | :--------: | :--------: | :------: |
| Bedrooms  |    ≥0     |   ≥1    |    —    |     —      |     —      |    —     |
| Bathrooms |    ≥1     |   ≥1    |   ≥0    |     —      |     —      |    —     |
| Size      |  **req**  | **req** | **req** |  **req**   |  **req**   | optional |

**Notes**:

- Apartment bedrooms minimum is 0 (studios are valid)
- House must have at least 1 bedroom
- Apartment/House must have at least 1 bathroom (you can't live without one)
- Room requires bathrooms but minimum is 0 (shared bathroom scenarios)
- Commercial/Industrial only require size (the essential metric for business planning)
- Parking has no required specification fields

### Range Constraints

All numeric specification fields have range constraints enforced at frontend (Zod), backend (Laravel), and database (CHECK constraints) layers.

| Field            | Min  |    Max     | Type    | Notes                              |
| ---------------- | :--: | :--------: | ------- | ---------------------------------- |
| bedrooms         |  0   |     20     | integer | 0 for studios                      |
| bathrooms        |  0   |     10     | decimal | 0.5 increments allowed (half bath) |
| size             |  1   |  100,000   | decimal | m², must be >0 when provided       |
| balcony_size     |  0   |   10,000   | decimal | m², optional                       |
| land_size        |  0   | 1,000,000  | decimal | m², only for houses                |
| floor_level      | -10  |    200     | integer | negative = basement levels         |
| year_built       | 1800 |  current   | year    | validated against current year     |
| parking*spots*\* |  0   |     20     | integer | interior and exterior separate     |
| rent_amount      | 0.01 | 999,999.99 | decimal | currency stored separately         |

### Database CHECK Constraints

MySQL 8.0+ CHECK constraints provide the final layer of data integrity (see migration `add_check_constraints_to_properties_table`):

```sql
-- Range constraints
chk_bedrooms:        bedrooms >= 0 AND bedrooms <= 20
chk_bathrooms:       bathrooms >= 0 AND bathrooms <= 10
chk_size:            size IS NULL OR (size >= 1 AND size <= 100000)
chk_floor_level:     floor_level IS NULL OR (floor_level >= -10 AND floor_level <= 200)
chk_year_built:      year_built IS NULL OR (year_built >= 1800 AND year_built <= 2100)
chk_parking_interior: parking_spots_interior >= 0 AND parking_spots_interior <= 20
chk_parking_exterior: parking_spots_exterior >= 0 AND parking_spots_exterior <= 20
chk_balcony_size:    balcony_size IS NULL OR (balcony_size >= 0 AND balcony_size <= 10000)
chk_land_size:       land_size IS NULL OR (land_size >= 0 AND land_size <= 1000000)
chk_rent_amount:     rent_amount >= 0 AND rent_amount <= 999999.99
```

**Note**: Type-specific required fields cannot be enforced at database level since they depend on the `type` column value. These are enforced at application level only.

---

## Status Workflows

### Property Status (Simplified Lifecycle)

| Status        | Description                    | Next States                   |
| ------------- | ------------------------------ | ----------------------------- |
| `draft`       | Manager setting up, incomplete | vacant                        |
| `vacant`      | No tenant, ready for market    | leased, maintenance, archived |
| `leased`      | Tenant in place                | vacant, maintenance, archived |
| `maintenance` | Off market for repairs         | vacant, archived              |
| `archived`    | No longer managing             | —                             |

Note: Application-related stages (under_review, visit_scheduled, approved) are now derived from the `applications` table, not stored on property.

### Lead Status

| Status     | Description                        | Next States        |
| ---------- | ---------------------------------- | ------------------ |
| `invited`  | Manager invited, no engagement yet | viewed, archived   |
| `viewed`   | Clicked invite link / viewed       | drafting, archived |
| `drafting` | Started application, not submitted | applied, archived  |
| `applied`  | Submitted application              | archived           |
| `archived` | No longer tracking                 | —                  |

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
6. **Lazy draft creation**: Only create the database record on first user interaction, not on page load

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

### Validation UX Feedback

When the user clicks "Continue" with invalid data, two UX enhancements provide immediate feedback:

#### 1. Button Shake Animation

The Continue button shakes horizontally to indicate validation failure:

```typescript
// Shake keyframes: alternating left-right with decay
x: [0, -8, 8, -8, 8, -4, 4, 0]  // pixels
duration: 0.4s
```

This provides instant visual feedback without being intrusive or blocking.

#### 2. Scroll to First Error

After validation fails, the page automatically:

1. Finds the first element with `aria-invalid="true"`
2. Smoothly scrolls it into view (centered)
3. Focuses the field for immediate correction

```typescript
const firstInvalidField = document.querySelector('[aria-invalid="true"]');
if (firstInvalidField) {
    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalidField.focus({ preventScroll: true });
}
```

**Important**: All form inputs that can be invalid must set `aria-invalid={!!errors.fieldName}` for this to work.

#### Design Rationale

- **Button always enabled**: Disabled buttons are poor UX - users don't know why they can't proceed. Keeping it enabled and showing errors on click is more discoverable.
- **Non-blocking feedback**: Shake + scroll doesn't prevent interaction, just guides the user
- **Accessibility**: `aria-invalid` serves dual purpose - screen readers announce invalid state, and scroll-to-error uses it as a selector

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

## Internationalization (i18n)

### Overview

RentPath supports 4 languages (English, French, German, Dutch) using a **server-side translation** approach. Laravel loads translations on each request, passes them to React via Inertia shared props, and the frontend accesses them via a utility function.

### Supported Languages

| Code | Language   | File Directory       |
| ---- | ---------- | -------------------- |
| `en` | English    | `resources/lang/en/` |
| `fr` | Français   | `resources/lang/fr/` |
| `de` | Deutsch    | `resources/lang/de/` |
| `nl` | Nederlands | `resources/lang/nl/` |

### Architecture

```
┌───────────────────────────────────────────────────────────┐
│  Backend (Laravel)                                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  resources/lang/{locale}/*.php                      │  │
│  │  - Per-feature/page translation files               │  │
│  │  - Nested arrays for organization                   │  │
│  │  - E.g., auth.php, header.php, properties.php       │  │
│  └─────────────────────────────────────────────────────┘  │
│                         ↓                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  SetLocale Middleware                               │  │
│  │  - Reads locale from session                        │  │
│  │  - Falls back to browser Accept-Language            │  │
│  │  - Falls back to config default (en)                │  │
│  └─────────────────────────────────────────────────────┘  │
│                         ↓                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  HandleInertiaRequests Middleware                   │  │
│  │  - Loads all translation files via trans()          │  │
│  │  - Passes as shared props to all pages              │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────────┐
│  Frontend (React/TypeScript)                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  usePage<SharedData>().props.translations           │  │
│  │  - All translations available on every page         │  │
│  │  - Current locale in props.locale                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                         ↓                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  translate(translations, 'key.path')                │  │
│  │  - Dot notation: 'auth.login.title'                 │  │
│  │  - Array access: 'landing.slides[0].title'          │  │
│  │  - Returns key as fallback if not found             │  │
│  └─────────────────────────────────────────────────────┘  │
│                         ↓                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  TypeScript Types (resources/js/types/translations/)│  │
│  │  - Interface per translation file                   │  │
│  │  - Full autocomplete and type safety                │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### File Organization

Translations are organized **per feature/page**, not flat:

```
resources/lang/en/
├── auth.php           # Login, register, password reset
├── header.php         # Navigation header
├── sidebar.php        # Sidebar navigation
├── landing.php        # Marketing landing page
├── properties.php     # Property management (manager portal)
├── tenant.php         # Tenant portal specific
├── profile.php        # Profile setup/verification
├── settings.php       # User settings
├── cookie-banner.php  # Cookie consent
├── contact-us.php     # Contact form
├── privacy-policy.php # Legal
└── terms-of-use.php   # Legal
```

### Translation File Structure

```php
// resources/lang/en/auth.php
return [
    'user_types' => [
        'tenant' => 'Tenant',
        'property_manager' => 'Property Manager',
    ],
    'login' => [
        'title' => 'Log in to your account',
        'email_label' => 'Email address',
        'password_label' => 'Password',
        'submit' => 'Sign in',
    ],
];
```

### TypeScript Type Safety

Each translation file has a corresponding TypeScript interface:

```typescript
// resources/js/types/translations/auth.d.ts
export interface AuthTranslations {
    user_types: {
        tenant: string;
        property_manager: string;
    };
    login: {
        title: string;
        email_label: string;
        password_label: string;
        submit: string;
    };
}

// resources/js/types/translations/index.d.ts
export interface Translations {
    auth: AuthTranslations;
    header: HeaderTranslations;
    // ... other translation interfaces
}
```

### Usage in Components

```tsx
import { usePage } from '@inertiajs/react';
import { translate } from '@/utils/translate-utils';
import type { SharedData } from '@/types';

export function LoginForm() {
    const { translations } = usePage<SharedData>().props;

    return <h1>{translate(translations, 'auth.login.title')}</h1>;
}
```

### Language Switching

```
User clicks language → POST /locale { locale: 'de' }
                              ↓
                    Session stores locale
                              ↓
                    Page reloads with new translations
```

### Adding New Translations

1. **Add PHP file** in all 4 locale directories
2. **Create TypeScript interface** in `resources/js/types/translations/`
3. **Update `Translations` interface** in `index.d.ts`
4. **Register in `HandleInertiaRequests`** middleware
5. **Use in components** via `translate()` utility

### Design Rationale

- **Server-side loading**: Translations loaded once per request, no client-side HTTP calls
- **Per-feature organization**: Easy to find, modify, and maintain translations
- **Type safety**: Full TypeScript support prevents typos and missing keys
- **No external i18n library**: Simple, lightweight approach using Laravel's built-in `trans()`
- **Session-based persistence**: User's language preference persists across sessions

---

## Technology Stack

**Backend**: Laravel 12 (PHP 8.3) + Inertia.js
**Frontend**: React 19 + TypeScript + Tailwind CSS 4
**Database**: MySQL 8.0
**Storage**: S3 + CloudFront (signed URLs)
**Infrastructure**: AWS Elastic Beanstalk, RDS, CodePipeline
**IaC**: Terraform
