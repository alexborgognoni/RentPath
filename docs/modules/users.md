# Users & Profiles

## Overview

RentPath uses a single user table with optional role profiles. One user can have both a PropertyManager AND TenantProfile.

## Database Schema

```
users (authentication)
├─ id, email, password
├─ first_name, last_name
├─ email_verified_at
└─ timestamps

property_managers (optional profile, 1:1 with users)
├─ user_id (unique FK)
├─ type: individual | professional
├─ company_name, company_website, license_number
├─ phone_country_code, phone_number
├─ profile_picture_path
├─ id_document_path, license_document_path
├─ profile_verified_at
└─ rejection_reason, rejected_fields

tenant_profiles (optional profile, 1:1 with users)
├─ user_id (unique FK)
├─ Personal: date_of_birth, nationality, phone
├─ Identity: id_document_type, id_number, id_issuing_country, id_expiry_date
├─ Immigration: immigration_status, visa_type, visa_expiry_date
├─ Address: current_house_number, current_street_name, current_city, etc.
├─ Employment: employment_status, employer_name, job_title, monthly_income
├─ Documents: id_document_front_path, employment_contract_path, payslips
├─ Rental History: current_living_situation, authorize_credit_check, references
├─ profile_verified_at
└─ verification_rejection_reason, verification_rejected_fields
```

## Profile Verification

Both profile types require verification before full access.

**Process**:

1. User uploads required documents
2. Admin reviews (sets `profile_verified_at`)
3. If rejected: `rejection_reason` + `rejected_fields` (JSON)
4. User can edit rejected fields and resubmit

**Gates**:

- Property Managers: Must verify before creating properties
- Tenants: Must verify before submitting applications

## Tenant Profile Page Architecture

The `/profile` page was redesigned from a 1048-line monolithic component to a modular architecture.

### Component Structure

```
pages/tenant/profile.tsx (~170 lines)
├── ProfileHeader                    # Avatar, name, verification status
├── ProfileCompleteness              # Progress ring with gamification milestones
│   └── ProgressRing                 # SVG animated ring (0-100%)
└── ProfileSection (×5)              # Collapsible section wrapper
    ├── PersonalSection              # → PersonalDetailsSection (reused from wizard)
    ├── AddressSection               # → AddressForm (reused)
    ├── IdentitySection              # → IdDocumentSection
    ├── EmploymentSection            # → FinancialInfoSection (1100 lines, reused)
    └── DocumentsSection             # Immigration documents
```

### Key Files

| File                                                       | Purpose                                                     |
| ---------------------------------------------------------- | ----------------------------------------------------------- |
| `resources/js/hooks/use-profile-form.ts`                   | Form state, autosave, Precognition validation, completeness |
| `resources/js/components/profile/profile-completeness.tsx` | Progress ring with milestones (25/50/75/100%)               |
| `resources/js/components/profile/profile-section.tsx`      | Collapsible section with status badges                      |
| `resources/js/components/profile/sections/*.tsx`           | Thin wrappers mapping data to shared sections               |
| `app/Http/Requests/Profile/ValidateProfileRequest.php`     | Precognition validation rules                               |

### Features

- **Autosave**: 500ms debounced saves to `/tenant-profile/autosave`
- **Precognition validation**: Per-field blur validation via `/tenant-profile/draft`
- **Completeness calculation**: Frontend mirrors backend logic with weighted fields
- **Progressive disclosure**: Employment-specific fields based on status selection
- **Sticky sidebar**: Right-aligned progress card with header offset (`top-[5.5rem]`)

### Known Issues

- Translations not yet implemented (English only)
- DOB field has a save bug (date not persisting correctly)

## Related Models

- `app/Models/User.php`
- `app/Models/PropertyManager.php`
- `app/Models/TenantProfile.php`
