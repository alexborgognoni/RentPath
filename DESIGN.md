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
- `public_apply_url_enabled`: Toggle for open applications
- `invite_token`: 64-char token for private access
- `invite_token_expires_at`: Token expiration

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

| Status | Description | Next States |
|--------|-------------|-------------|
| `inactive` | Not accepting applications | available, maintenance, archived |
| `available` | Open for applications | application_received, leased, inactive, maintenance |
| `application_received` | Has pending applications | under_review, available, archived |
| `under_review` | Reviewing applications | visit_scheduled, approved, rejected, available |
| `visit_scheduled` | Visit confirmed | leased, available, maintenance |
| `approved` | Tenant approved | leased, available |
| `leased` | Currently rented | available, maintenance, archived |
| `maintenance` | Under repair | available, inactive |
| `archived` | Permanently closed | — |

### Application Status

| Status | Description | Next States |
|--------|-------------|-------------|
| `draft` | Started, not submitted | submitted, deleted |
| `submitted` | Awaiting review | under_review, withdrawn, archived |
| `under_review` | Being reviewed | visit_scheduled, approved, rejected, archived |
| `visit_scheduled` | Visit agreed | visit_completed, withdrawn, archived |
| `visit_completed` | Visit done | approved, rejected, withdrawn, archived |
| `approved` | Tenant approved | leased, withdrawn, archived |
| `rejected` | Application declined | archived |
| `withdrawn` | Tenant withdrew | archived |
| `leased` | Lease signed | archived |
| `archived` | Closed, kept for records | — |
| `deleted` | Draft cleanup | — |

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

| Type | Visibility | Max Size | Formats |
|------|-----------|----------|---------|
| Profile pictures | Public | 5MB | JPEG, PNG, WEBP |
| ID documents | Private | 20MB | PDF, JPEG, PNG |
| License documents | Private | 20MB | PDF, JPEG, PNG |
| Property images | Private | 10MB | JPEG, PNG, WEBP |
| Income proof | Private | 20MB | PDF, JPEG, PNG |
| Reference letters | Private | 20MB | PDF |
| Lease documents | Private | 20MB | PDF |

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

## Technology Stack

**Backend**: Laravel 12 (PHP 8.3) + Inertia.js
**Frontend**: React 19 + TypeScript + Tailwind CSS 4
**Database**: MySQL 8.0
**Storage**: S3 + CloudFront (signed URLs)
**Infrastructure**: AWS Elastic Beanstalk, RDS, CodePipeline
**IaC**: Terraform
