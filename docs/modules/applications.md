# Applications

## Overview

Applications represent a tenant's interest in renting a property. They capture application-specific data and snapshot profile data at submission time.

## Key Relationships

- `property_id` -> Property being applied to
- `tenant_profile_id` -> Applicant's tenant profile

## Application Status Workflow

```
draft -> submitted -> under_review -> visit_scheduled -> visit_completed
    -> approved/rejected/withdrawn -> leased -> archived/deleted
```

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
| `archived`        | Closed, kept for records | -                                             |
| `deleted`         | Draft cleanup            | -                                             |

## Key Fields

| Category       | Fields                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| Intent         | desired*move_in_date, lease_duration_months, is_flexible*\*               |
| Message        | message_to_landlord                                                       |
| Occupants      | additional_occupants, occupants_details (JSON)                            |
| Pets           | has_pets, pets_details (JSON)                                             |
| Rental History | current*living_situation, current_address*\*, reason_for_moving           |
| References     | Via `application_references` table                                        |
| Background     | authorize_credit_check, has_ccjs_or_bankruptcies, has_eviction_history    |
| Consent        | declaration_accuracy_at, consent_screening_at, consent_data_processing_at |
| Review         | reviewed_by_user_id, reviewed_at                                          |
| Visit          | visit_scheduled_at, visit_completed_at, visit_notes                       |
| Approval       | approved_by_user_id, approved_at, approval_notes                          |
| Lease          | lease_start_date, lease_end_date, agreed_rent_amount, deposit_amount      |

## Data Separation Strategy

**Profile Fields** (stored in `tenant_profiles`, reusable):

- Personal info, ID documents, employment, income, rental history

**Application Fields** (stored in `applications`, per-application):

- Move-in date, message, occupants, pets, emergency contact, is_smoker

**Related Tables** (per-application):

- `application_guarantors` - Guarantors for the tenant or co-signers
- `application_references` - Landlord/personal references
- `application_co_signers` - Additional lease signers

## Snapshot Pattern

On submission, profile data is **copied** to `snapshot_*` fields:

```
During wizard: Profile fields -> TenantProfile (autosave)
On submit:     Profile data -> snapshot_* fields on Application
```

**Why?**

- Tenant may update profile after submission
- Manager sees data as it was at application time
- Legal/audit trail preservation

## Uniqueness

One active (non-draft, non-archived) application per tenant per property.

## Related Files

- `app/Models/Application.php`
- `app/Models/ApplicationCoSigner.php`
- `app/Models/ApplicationGuarantor.php`
- `app/Models/ApplicationReference.php`
- `resources/js/Pages/Applications/`
