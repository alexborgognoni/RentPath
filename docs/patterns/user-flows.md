# User Flows

## Property Manager Flow

### 1. Onboarding

```
Register -> Create PM profile -> Upload documents -> Wait for verification
```

- Must verify profile before creating properties
- Profile verification includes ID and optional license documents

### 2. Property Listing

```
Create property -> Add details via wizard -> Add images -> Configure visibility
-> Generate invite token OR enable public listing
```

**Wizard Steps**:
1. Basic Info (type, title, description)
2. Location (address)
3. Specifications (bedrooms, bathrooms, size, etc.)
4. Energy (energy class, heating)
5. Amenities (features)
6. Rental Terms (rent, availability)
7. Images
8. Review & Publish

### 3. Lead Management

```
View leads -> See engagement funnel -> Send invites -> Track conversions
```

- Manual lead creation (from showings, calls, open houses)
- Auto-created leads from token signups and applications

### 4. Application Management

```
Receive applications -> Review details -> Schedule visit -> Approve/Reject -> Sign lease
```

- View application with snapshot data (as submitted)
- Access applicant documents
- Track status through workflow

## Tenant Flow

### 1. Discovery

```
Click property link (from external listing or email)
-> View property details (PUBLIC, no auth required)
```

- Public properties visible without authentication
- Token-protected properties require valid token

### 2. Registration & Profile

```
Click "Apply" -> Register/Login (if needed)
-> Create tenant profile via wizard
-> Upload required documents
-> Wait for verification (optional)
```

**Profile Wizard Steps**:
1. Identity (personal info, ID document)
2. Financial (employment, income, documents)
3. History (rental history, references)
4. Additional (guarantor if needed)
5. Review

### 3. Application

```
Fill application wizard -> Save as draft (anytime)
-> Submit application
```

**Application Wizard Steps**:
1. Identity (pre-filled from profile, can modify)
2. Financial (pre-filled from profile, can modify)
3. History (rental history, references)
4. Additional (occupants, pets, emergency contact)
5. Consent (declarations, authorizations)
6. Review & Submit

### 4. Tracking

```
Dashboard shows application status
-> Receive notifications on status changes
-> Schedule visit
-> Sign lease
```

## Token Access Control Flows

### Anonymous Shareable Token

```
Property Manager creates token
    ↓
Shares URL publicly or privately
    ↓
Anyone with link can view property until expiry
    ↓
view_count incremented on each access
    ↓
Must register/login to apply
    ↓
On signup: Lead created with source=token_signup
```

### Personal Invite

```
Property Manager creates Lead with email
    ↓
Sends invite (email with personal token)
    ↓
Lead tracks engagement (invited -> viewed -> drafting -> applied)
    ↓
Lead has unique token for personal invite link
    ↓
Linked to Application when tenant applies
```

## Key UX Principles

1. **Public Entry, Auth to Act**: View without account, register to apply
2. **Draft Support**: Save progress anytime in wizards
3. **Profile Reuse**: Profile data pre-fills applications
4. **Snapshot Preservation**: Submitted data frozen at submission time
5. **Progressive Disclosure**: Show relevant fields based on previous answers
