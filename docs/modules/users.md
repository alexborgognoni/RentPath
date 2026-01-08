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
├─ Guarantor: has_guarantor, guarantor_* fields
├─ Rental History: current_living_situation, previous_addresses, references
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

## Related Models

- `app/Models/User.php`
- `app/Models/PropertyManager.php`
- `app/Models/TenantProfile.php`
