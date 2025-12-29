# Application Wizard Restructure Plan

## Overview

Restructure the rental application wizard from 6 steps to 8 steps with clearer separation of concerns and additional EU compliance features.

## Current vs New Structure

| Current (6 steps)                                 | New (8 steps)                         |
| ------------------------------------------------- | ------------------------------------- |
| 1. Personal Info                                  | 1. Identity & Legal Eligibility       |
| 2. Employment & Income (incl. guarantor)          | 2. Household Composition              |
| 3. Application Details (move-in, occupants, pets) | 3. Financial Capability (Tenant)      |
| 4. References (optional)                          | 4. Risk Mitigation                    |
| 5. Emergency Contact (optional)                   | 5. Credit & Rental History            |
| 6. Review                                         | 6. Additional Information & Documents |
|                                                   | 7. Declarations & Consent             |
|                                                   | 8. Review                             |

---

## New Step Definitions

### Step 1: Identity & Legal Eligibility

**Purpose:** Verify the applicant's identity and legal right to rent in the target country.

**Fields:**

**Personal Details:**

| Field                        | Type   | Required | Notes                   |
| ---------------------------- | ------ | -------- | ----------------------- |
| `profile_first_name`         | text   | ✓        |                         |
| `profile_middle_name`        | text   |          |                         |
| `profile_last_name`          | text   | ✓        |                         |
| `profile_date_of_birth`      | date   | ✓        | Must be 18+             |
| `profile_nationality`        | select | ✓        | ISO-2 country code      |
| `profile_email`              | email  | ✓        | Pre-filled from account |
| `profile_phone_country_code` | text   | ✓        | Format: +XXX            |
| `profile_phone_number`       | text   | ✓        |                         |

**ID Document:**

| Field                        | Type   | Required    | Notes                                                    |
| ---------------------------- | ------ | ----------- | -------------------------------------------------------- |
| `profile_id_document_type`   | select | ✓           | passport, national_id, drivers_license, residence_permit |
| `profile_id_number`          | text   | ✓           | Document number (masked in UI after entry)               |
| `profile_id_issuing_country` | select | ✓           | ISO-2 country code                                       |
| `profile_id_expiry_date`     | date   | ✓           | Must be in future                                        |
| `profile_id_document_front`  | file   | ✓           |                                                          |
| `profile_id_document_back`   | file   | Conditional | Required for national_id, drivers_license                |

**Immigration Status (Optional but Recommended):**

| Field                              | Type   | Required    | Notes                                                                   |
| ---------------------------------- | ------ | ----------- | ----------------------------------------------------------------------- |
| `profile_immigration_status`       | select |             | citizen, permanent_resident, visa_holder, refugee, asylum_seeker, other |
| `profile_immigration_status_other` | text   | Conditional | If status = other                                                       |
| `profile_visa_type`                | text   | Conditional | If visa_holder                                                          |
| `profile_visa_expiry_date`         | date   | Conditional | If visa_holder                                                          |
| `profile_work_permit_number`       | text   |             | If applicable                                                           |

**Regional Enhancements (Optional - Shown Based on Property Country):**

| Field                                  | Type   | Required | Notes                                    |
| -------------------------------------- | ------ | -------- | ---------------------------------------- |
| `profile_right_to_rent_document`       | file   | Optional | Suggested for UK/IE properties           |
| `profile_right_to_rent_share_code`     | text   | Optional | UK online right-to-rent share code       |
| `profile_identity_verification_method` | select | Optional | AU: document_based, points_based         |
| `profile_identity_points_documents`    | array  | Optional | AU 100-point ID check                    |
| `profile_identity_points_total`        | number | Auto     | Calculated for AU if using points system |

**New concepts:**

- **ID number & expiry** - Full document details, not just upload (CORE requirement)
- **Immigration status** - Optional but strengthens application
- **Regional documents** - Shown based on property country, never blocking
- **Progressive enhancement** - More docs = stronger application

---

### Step 2: Household Composition

**Purpose:** Understand who will be living in the property, rental intent, and emergency contact.

**Fields:**

**Rental Intent:**

| Field                     | Type    | Required | Notes                     |
| ------------------------- | ------- | -------- | ------------------------- |
| `desired_move_in_date`    | date    | ✓        | Must be in future         |
| `lease_duration_months`   | number  | ✓        | Min 1, max 60             |
| `is_flexible_on_move_in`  | boolean |          | Willing to adjust date    |
| `is_flexible_on_duration` | boolean |          | Willing to negotiate term |

**Occupants:**

| Field                                    | Type    | Required    | Notes                                                                     |
| ---------------------------------------- | ------- | ----------- | ------------------------------------------------------------------------- |
| `additional_occupants`                   | number  | ✓           | 0-20, count besides primary applicant                                     |
| `occupants_details`                      | array   | Conditional | Required if additional_occupants > 0                                      |
| `occupants_details[].first_name`         | text    | ✓           |                                                                           |
| `occupants_details[].last_name`          | text    | ✓           |                                                                           |
| `occupants_details[].date_of_birth`      | date    | ✓           | For age calculation and lease signing eligibility                         |
| `occupants_details[].relationship`       | select  | ✓           | spouse, partner, child, parent, sibling, roommate, dependent, other       |
| `occupants_details[].relationship_other` | text    | Conditional | If relationship = other                                                   |
| `occupants_details[].will_sign_lease`    | boolean | ✓           | If true + 18+, becomes co-signer requiring identity + financial in step 4 |
| `occupants_details[].is_dependent`       | boolean |             | Child or dependent adult                                                  |

**Pets:**

| Field                                            | Type    | Required    | Notes                                                             |
| ------------------------------------------------ | ------- | ----------- | ----------------------------------------------------------------- |
| `has_pets`                                       | boolean | ✓           |                                                                   |
| `pets_details`                                   | array   | Conditional | Required if has_pets = true                                       |
| `pets_details[].type`                            | select  | ✓           | dog, cat, bird, fish, rabbit, hamster, guinea_pig, reptile, other |
| `pets_details[].type_other`                      | text    | Conditional | If type = other                                                   |
| `pets_details[].breed`                           | text    |             |                                                                   |
| `pets_details[].name`                            | text    |             |                                                                   |
| `pets_details[].age_years`                       | number  |             | 0-50                                                              |
| `pets_details[].weight_kg`                       | number  |             |                                                                   |
| `pets_details[].size`                            | select  |             | small, medium, large (for quick filtering)                        |
| `pets_details[].is_registered_assistance_animal` | boolean |             | ESA/service animal - legal protections apply                      |
| `pets_details[].assistance_animal_documentation` | file    | Conditional | If is_registered_assistance_animal = true                         |

**Emergency Contact (Optional - Suggested for US/AU):**

| Field                                  | Type   | Required | Notes                                                  |
| -------------------------------------- | ------ | -------- | ------------------------------------------------------ |
| `emergency_contact_first_name`         | text   |          | Suggested for US/AU properties                         |
| `emergency_contact_last_name`          | text   |          |                                                        |
| `emergency_contact_relationship`       | select |          | spouse, partner, parent, sibling, child, friend, other |
| `emergency_contact_phone_country_code` | text   |          |                                                        |
| `emergency_contact_phone_number`       | text   |          |                                                        |
| `emergency_contact_email`              | email  |          |                                                        |

**Changes from current:**

- **Rental intent moved here** (was in old step 3) - groups "who, when, how long"
- **Emergency contact added** - optional but suggested for US/AU properties
- Split occupant name into first/last
- Added `is_dependent` flag for occupants
- Added `will_sign_lease` flag - triggers identity + financial collection in step 4
- Added pet `size` field for quick landlord filtering
- Added `assistance_animal_documentation` for service/ESA animals
- Standardized weight to kg (convert on display based on user preference)

---

### Step 3: Financial Capability (Tenant)

**Purpose:** Assess the primary applicant's ability to pay rent.

**Fields:**

| Field                             | Type   | Required    | Notes                                                        |
| --------------------------------- | ------ | ----------- | ------------------------------------------------------------ |
| `profile_employment_status`       | select | ✓           | employed, self_employed, student, unemployed, retired, other |
| `profile_employment_status_other` | text   | Conditional | If status = other                                            |

**If employed:**

| Field                              | Type   | Required    | Notes                                           |
| ---------------------------------- | ------ | ----------- | ----------------------------------------------- |
| `profile_employer_name`            | text   | ✓           |                                                 |
| `profile_employer_address`         | text   |             |                                                 |
| `profile_employer_phone`           | text   |             |                                                 |
| `profile_job_title`                | text   | ✓           |                                                 |
| `profile_employment_type`          | select | ✓           | full_time, part_time, zero_hours                |
| `profile_employment_contract_type` | select | ✓           | permanent, fixed_term, freelance, casual        |
| `profile_employment_start_date`    | date   | ✓           |                                                 |
| `profile_employment_end_date`      | date   | Conditional | Required if contract_type = fixed_term          |
| `profile_probation_end_date`       | date   |             | If currently in probation                       |
| `profile_net_monthly_income`       | number | ✓           | After tax, take-home pay (primary metric)       |
| `profile_gross_annual_income`      | number |             | Before tax (optional, for context)              |
| `profile_income_currency`          | select | ✓           | EUR, GBP, CHF, USD, AUD, CAD                    |
| `profile_pay_frequency`            | select |             | weekly, fortnightly, monthly, annually          |
| `profile_employment_contract`      | file   | ✓           |                                                 |
| `profile_payslips`                 | file[] | ✓           | Last 3 months, max 3 files                      |
| `profile_bank_statements`          | file[] |             | Optional, last 3 months (some landlords prefer) |

**If self_employed:**

| Field                                  | Type   | Required | Notes                                           |
| -------------------------------------- | ------ | -------- | ----------------------------------------------- |
| `profile_business_name`                | text   | ✓        |                                                 |
| `profile_business_type`                | text   | ✓        | Sole trader, partnership, limited company, etc. |
| `profile_business_registration_number` | text   |          | Company/ABN/EIN number                          |
| `profile_business_start_date`          | date   | ✓        |                                                 |
| `profile_net_monthly_income`           | number | ✓        | Average monthly take-home after expenses/tax    |
| `profile_gross_annual_revenue`         | number |          | Business revenue (optional, for context)        |
| `profile_income_currency`              | select | ✓        | EUR, GBP, CHF, USD, AUD, CAD                    |
| `profile_tax_returns`                  | file[] | ✓        | Last 2 years, max 2 files                       |
| `profile_business_bank_statements`     | file[] |          | Last 3-6 months                                 |
| `profile_accountant_reference`         | file   |          | Letter from accountant confirming income        |

**If student:**

| Field                              | Type   | Required | Notes                                                         |
| ---------------------------------- | ------ | -------- | ------------------------------------------------------------- |
| `profile_university_name`          | text   | ✓        |                                                               |
| `profile_program_of_study`         | text   | ✓        |                                                               |
| `profile_expected_graduation_date` | date   |          |                                                               |
| `profile_student_id_number`        | text   |          |                                                               |
| `profile_enrollment_proof`         | file   | ✓        |                                                               |
| `profile_student_income_source`    | select |          | loan, grant, parental_support, part_time_work, savings, other |
| `profile_student_monthly_income`   | number |          |                                                               |

**If unemployed/retired/other:**

| Field                     | Type   | Required | Notes                                       |
| ------------------------- | ------ | -------- | ------------------------------------------- |
| `profile_income_source`   | text   | ✓        | Description of income source                |
| `profile_monthly_income`  | number | ✓        |                                             |
| `profile_income_currency` | select | ✓        |                                             |
| `profile_income_proof`    | file   | ✓        | Benefits statement, pension statement, etc. |

**Additional income (all statuses):**

| Field                                                | Type    | Required    | Notes                                                      |
| ---------------------------------------------------- | ------- | ----------- | ---------------------------------------------------------- |
| `profile_has_additional_income`                      | boolean |             |                                                            |
| `profile_additional_income_sources`                  | array   | Conditional |                                                            |
| `profile_additional_income_sources[].type`           | select  | ✓           | rental_income, investments, benefits, child_support, other |
| `profile_additional_income_sources[].monthly_amount` | number  | ✓           |                                                            |
| `profile_additional_income_sources[].proof`          | file    |             |                                                            |

**Changes from current:**

- Split gross annual vs net monthly income
- Added employer contact details
- Added zero_hours employment type
- Expanded self-employed section with business details
- Added student ID and enrollment proof
- New additional income sources section
- Tax returns for self-employed (instead of payslips)

---

### Step 4: Risk Mitigation

**Purpose:** Collect identity and financial details for all lease signers, plus their guarantors.

**Concept clarification:**

- **Primary applicant:** The user filling out the form (always signs the lease)
- **Co-signer:** An occupant marked with `will_sign_lease = true` in step 2 (shares lease liability)
- **Guarantor:** Third party who guarantees rent payment for a specific lease signer (does not live in property)
- **Rent guarantee insurance:** External insurance product

**Data structure:**

```
lease_signers[] (derived from step 2)
├── [0] Primary Applicant (implicit, always included)
│   ├── Identity: collected in Step 1
│   ├── Financial: collected in Step 3
│   └── guarantors[]: 0 or more
├── [1] Co-signer (occupant with will_sign_lease = true)
│   ├── Identity: collected here in Step 4
│   ├── Financial: collected here in Step 4
│   └── guarantors[]: 0 or more
└── [n] Additional co-signers...
```

---

#### Section A: Co-Signer Details

**Displayed for each occupant where `will_sign_lease = true` (from step 2).**

The co-signer's name and relationship are pre-filled from step 2. This section collects their identity and financial information.

**Co-signer Identity (mirrors TenantProfile structure):**

| Field                             | Type   | Required    | Notes                                                     |
| --------------------------------- | ------ | ----------- | --------------------------------------------------------- |
| `co_signers[].occupant_index`     | number | ✓           | Reference to occupants_details index                      |
| `co_signers[].first_name`         | text   | ✓           | Pre-filled from step 2, editable                          |
| `co_signers[].last_name`          | text   | ✓           | Pre-filled from step 2, editable                          |
| `co_signers[].email`              | email  | ✓           | **Key for profile matching**                              |
| `co_signers[].phone_country_code` | text   | ✓           |                                                           |
| `co_signers[].phone_number`       | text   | ✓           |                                                           |
| `co_signers[].date_of_birth`      | date   | ✓           | Must be 18+ (pre-filled from step 2)                      |
| `co_signers[].nationality`        | select | ✓           | ISO country code                                          |
| `co_signers[].id_document_type`   | select | ✓           | passport, national_id, drivers_license, residence_permit  |
| `co_signers[].id_number`          | text   | ✓           | Document number (masked after entry)                      |
| `co_signers[].id_issuing_country` | select | ✓           | ISO country code                                          |
| `co_signers[].id_expiry_date`     | date   | ✓           | Must be in future                                         |
| `co_signers[].id_document_front`  | file   | ✓           |                                                           |
| `co_signers[].id_document_back`   | file   | Conditional | Required for national_id, drivers_license                 |
| `co_signers[].immigration_status` | select |             | Optional - citizen, permanent_resident, visa_holder, etc. |
| `co_signers[].visa_type`          | text   | Conditional | If visa_holder                                            |
| `co_signers[].visa_expiry_date`   | date   | Conditional | If visa_holder                                            |

**Co-signer Financial (mirrors Step 3 structure):**

| Field                            | Type   | Required | Notes                                                        |
| -------------------------------- | ------ | -------- | ------------------------------------------------------------ |
| `co_signers[].employment_status` | select | ✓        | employed, self_employed, student, unemployed, retired, other |

**If employed/self_employed:**

| Field                                | Type   | Required | Notes                                                 |
| ------------------------------------ | ------ | -------- | ----------------------------------------------------- |
| `co_signers[].employer_name`         | text   | ✓        |                                                       |
| `co_signers[].job_title`             | text   | ✓        |                                                       |
| `co_signers[].employment_type`       | select | ✓        | full_time, part_time, contract, temporary, zero_hours |
| `co_signers[].employment_start_date` | date   | ✓        |                                                       |
| `co_signers[].net_monthly_income`    | number | ✓        | Take-home pay after tax                               |
| `co_signers[].income_currency`       | select | ✓        |                                                       |
| `co_signers[].employment_contract`   | file   | ✓        |                                                       |
| `co_signers[].payslips`              | file[] | ✓        | Last 3 months                                         |

**If student:**

| Field                                 | Type   | Required | Notes |
| ------------------------------------- | ------ | -------- | ----- |
| `co_signers[].university_name`        | text   | ✓        |       |
| `co_signers[].enrollment_proof`       | file   | ✓        |       |
| `co_signers[].student_income_source`  | select |          |       |
| `co_signers[].student_monthly_income` | number |          |       |

**If unemployed/retired/other:**

| Field                         | Type   | Required | Notes |
| ----------------------------- | ------ | -------- | ----- |
| `co_signers[].income_source`  | text   | ✓        |       |
| `co_signers[].monthly_income` | number | ✓        |       |
| `co_signers[].income_proof`   | file   | ✓        |       |

---

#### Section B: Guarantors

**Displayed per lease signer (primary applicant + each co-signer).**

Each lease signer can have 0 or more guarantors. The UI shows:

- "Guarantors for [Primary Applicant Name]" (main tenant from step 1)
- "Guarantors for [Co-signer Name]" (for each co-signer)

| Field                              | Type   | Required    | Notes                                   |
| ---------------------------------- | ------ | ----------- | --------------------------------------- |
| `guarantors`                       | array  |             | All guarantors across all signers       |
| `guarantors[].for_signer_type`     | enum   | ✓           | `primary` or `co_signer`                |
| `guarantors[].for_co_signer_index` | number | Conditional | Required if for_signer_type = co_signer |

**Per guarantor - Identity:**

| Field                             | Type   | Required    | Notes                                                          |
| --------------------------------- | ------ | ----------- | -------------------------------------------------------------- |
| `guarantors[].first_name`         | text   | ✓           |                                                                |
| `guarantors[].last_name`          | text   | ✓           |                                                                |
| `guarantors[].relationship`       | select | ✓           | parent, grandparent, sibling, spouse, partner, employer, other |
| `guarantors[].relationship_other` | text   | Conditional | If relationship = other                                        |
| `guarantors[].email`              | email  | ✓           |                                                                |
| `guarantors[].phone_country_code` | text   | ✓           |                                                                |
| `guarantors[].phone_number`       | text   | ✓           |                                                                |
| `guarantors[].date_of_birth`      | date   | ✓           | Must be 18+                                                    |
| `guarantors[].nationality`        | select | ✓           |                                                                |
| `guarantors[].id_document_type`   | select | ✓           | passport, national_id, drivers_license                         |
| `guarantors[].id_document_front`  | file   | ✓           |                                                                |
| `guarantors[].id_document_back`   | file   | Conditional |                                                                |

**Per guarantor - Address:**

| Field                             | Type   | Required    | Notes                              |
| --------------------------------- | ------ | ----------- | ---------------------------------- |
| `guarantors[].street_address`     | text   | ✓           |                                    |
| `guarantors[].city`               | text   | ✓           |                                    |
| `guarantors[].state_province`     | text   | Conditional | Required for US, AU, CA            |
| `guarantors[].postal_code`        | text   | ✓           |                                    |
| `guarantors[].country`            | select | ✓           |                                    |
| `guarantors[].years_at_address`   | number |             | How long at current address        |
| `guarantors[].proof_of_residence` | file   |             | Utility bill, bank statement, etc. |

**Per guarantor - Financial:**

| Field                             | Type   | Required    | Notes                                                                                |
| --------------------------------- | ------ | ----------- | ------------------------------------------------------------------------------------ |
| `guarantors[].employment_status`  | select | ✓           | employed, self_employed, retired, other (no student - guarantors need stable income) |
| `guarantors[].employer_name`      | text   | Conditional | If employed/self_employed                                                            |
| `guarantors[].job_title`          | text   | Conditional | If employed/self_employed                                                            |
| `guarantors[].net_monthly_income` | number | ✓           | Take-home pay after tax                                                              |
| `guarantors[].income_currency`    | select | ✓           |                                                                                      |
| `guarantors[].proof_of_income`    | file   | ✓           | Payslip, tax return, or pension statement                                            |
| `guarantors[].credit_report`      | file   |             | Self-provided credit report (optional)                                               |

**Per guarantor - Consent & Legal:**

| Field                                      | Type     | Required | Notes                             |
| ------------------------------------------ | -------- | -------- | --------------------------------- |
| `guarantors[].consent_to_credit_check`     | boolean  | ✓        | Must be true                      |
| `guarantors[].consent_to_contact`          | boolean  | ✓        | Must be true                      |
| `guarantors[].guarantee_consent_signed`    | boolean  | ✓        | Acknowledges guarantee obligation |
| `guarantors[].guarantee_consent_timestamp` | datetime | Auto     | When consent was given            |
| `guarantors[].guarantee_consent_ip`        | text     | Auto     | IP address for audit trail        |

---

#### Section C: Rent Guarantee Insurance

| Field                              | Type   | Required    | Notes                 |
| ---------------------------------- | ------ | ----------- | --------------------- |
| `interested_in_rent_insurance`     | select |             | yes, no, already_have |
| `existing_insurance_provider`      | text   | Conditional | If already_have       |
| `existing_insurance_policy_number` | text   | Conditional | If already_have       |

---

**Changes from current:**

- **Co-signers now require full identity + financial info** (previously just flagged)
- **Guarantors linked to specific lease signers** (primary or co-signer)
- **Multiple guarantors per signer** (0 or more each)
- **Guarantors need full identity** (DOB, nationality, ID documents)
- **Guarantors need consent checkboxes** (credit check + contact)
- Simplified guarantor employment (no student path)
- New rent guarantee insurance section

---

### Step 5: Credit & Rental History

**Purpose:** Gather authorization for credit/background checks and rental/employment references.

**Fields:**

**Credit Check Authorization (Core Requirement):**

| Field                              | Type    | Required | Notes                                                   |
| ---------------------------------- | ------- | -------- | ------------------------------------------------------- |
| `authorize_credit_check`           | boolean | ✓        | Consent to credit inquiry (CORE)                        |
| `credit_check_provider_preference` | select  |          | experian, equifax, transunion, illion_au, no_preference |

**Background & History (Optional - Suggested for US):**

| Field                        | Type    | Required    | Notes                                                 |
| ---------------------------- | ------- | ----------- | ----------------------------------------------------- |
| `authorize_background_check` | boolean |             | Suggested for US properties                           |
| `has_ccjs_or_bankruptcies`   | boolean |             | Self-declaration (CCJ = UK term)                      |
| `ccj_bankruptcy_details`     | text    | Conditional | If has_ccjs_or_bankruptcies = true                    |
| `has_eviction_history`       | boolean |             | Self-declaration, suggested for US                    |
| `eviction_details`           | text    | Conditional | If has_eviction_history = true                        |
| `self_reported_credit_score` | number  |             | Optional, 300-850 range                               |
| `credit_report_upload`       | file    |             | Self-provided credit report (strengthens application) |

**Current Address:**

| Field                            | Type   | Required    | Notes                                                                                                                                                                             |
| -------------------------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `current_living_situation`       | select | ✓           | renting, owner, living_with_family, student_housing, employer_provided, other                                                                                                     |
| `current_address_street`         | text   | ✓           |                                                                                                                                                                                   |
| `current_address_unit`           | text   |             | Apartment/unit number                                                                                                                                                             |
| `current_address_city`           | text   | ✓           |                                                                                                                                                                                   |
| `current_address_state_province` | text   | Conditional | Required for US, AU, CA                                                                                                                                                           |
| `current_address_postal_code`    | text   | ✓           |                                                                                                                                                                                   |
| `current_address_country`        | select | ✓           |                                                                                                                                                                                   |
| `current_address_move_in_date`   | date   | ✓           |                                                                                                                                                                                   |
| `current_monthly_rent`           | number | Conditional | If renting                                                                                                                                                                        |
| `current_rent_currency`          | select | Conditional | If renting                                                                                                                                                                        |
| `current_landlord_name`          | text   | Conditional | If renting                                                                                                                                                                        |
| `current_landlord_contact`       | text   | Conditional | If renting                                                                                                                                                                        |
| `reason_for_moving`              | select | ✓           | relocation_work, relocation_personal, upsizing, downsizing, end_of_lease, buying_property, relationship_change, closer_to_family, better_location, cost, first_time_renter, other |
| `reason_for_moving_other`        | text   | Conditional | If reason = other                                                                                                                                                                 |

**Previous Addresses (Last 3 years recommended):**

| Field                                       | Type    | Required    | Notes                                    |
| ------------------------------------------- | ------- | ----------- | ---------------------------------------- |
| `previous_addresses`                        | array   |             | Max 5 previous addresses                 |
| `previous_addresses[].street`               | text    | ✓           |                                          |
| `previous_addresses[].city`                 | text    | ✓           |                                          |
| `previous_addresses[].state_province`       | text    | Conditional |                                          |
| `previous_addresses[].postal_code`          | text    | ✓           |                                          |
| `previous_addresses[].country`              | select  | ✓           |                                          |
| `previous_addresses[].from_date`            | date    | ✓           | Move-in date                             |
| `previous_addresses[].to_date`              | date    | ✓           | Move-out date                            |
| `previous_addresses[].living_situation`     | select  | ✓           | renting, owner, living_with_family, etc. |
| `previous_addresses[].monthly_rent`         | number  | Conditional | If renting                               |
| `previous_addresses[].landlord_name`        | text    | Conditional | If renting                               |
| `previous_addresses[].landlord_contact`     | text    | Conditional | Phone or email                           |
| `previous_addresses[].can_contact_landlord` | boolean |             | Consent to contact                       |

**Landlord references:**

| Field                                      | Type    | Required | Notes                                     |
| ------------------------------------------ | ------- | -------- | ----------------------------------------- |
| `landlord_references`                      | array   |          | Max 3                                     |
| `landlord_references[].name`               | text    | ✓        |                                           |
| `landlord_references[].company`            | text    |          | Property management company if applicable |
| `landlord_references[].email`              | email   | ✓        |                                           |
| `landlord_references[].phone`              | text    | ✓        |                                           |
| `landlord_references[].property_address`   | text    | ✓        |                                           |
| `landlord_references[].tenancy_start_date` | date    | ✓        |                                           |
| `landlord_references[].tenancy_end_date`   | date    |          | Blank if current                          |
| `landlord_references[].monthly_rent_paid`  | number  |          |                                           |
| `landlord_references[].consent_to_contact` | boolean | ✓        | Must be true                              |

**Employer reference:**

| Field                          | Type    | Required    | Notes                              |
| ------------------------------ | ------- | ----------- | ---------------------------------- |
| `employer_reference_name`      | text    | Conditional | Required if employed               |
| `employer_reference_email`     | email   | Conditional |                                    |
| `employer_reference_phone`     | text    | Conditional |                                    |
| `employer_reference_job_title` | text    |             | Their job title (e.g., HR Manager) |
| `consent_to_contact_employer`  | boolean | Conditional | Must be true if providing          |

**Other references:**

| Field                                   | Type    | Required | Notes                        |
| --------------------------------------- | ------- | -------- | ---------------------------- |
| `other_references`                      | array   |          | Max 2, personal/professional |
| `other_references[].name`               | text    | ✓        |                              |
| `other_references[].relationship`       | select  | ✓        | professional, personal       |
| `other_references[].email`              | email   | ✓        |                              |
| `other_references[].phone`              | text    | ✓        |                              |
| `other_references[].years_known`        | number  | ✓        |                              |
| `other_references[].consent_to_contact` | boolean | ✓        |                              |

**Changes from current:**

- Added credit check authorization section
- Added CCJ/bankruptcy self-declaration
- Current address moved here (was in step 1)
- Added current living situation context
- Landlord references now include property address and tenancy dates
- All references require explicit consent_to_contact
- Employer reference separated from other references

---

### Step 6: Additional Information & Documents

**Purpose:** Allow applicants to provide context and supporting documents not captured elsewhere.

**Fields:**

| Field                                | Type     | Required | Notes                                         |
| ------------------------------------ | -------- | -------- | --------------------------------------------- |
| `additional_information`             | textarea |          | Max 2000 chars, free-form message to landlord |
| `additional_documents`               | file[]   |          | Max 10 files, 20MB each                       |
| `additional_documents[].file`        | file     | ✓        |                                               |
| `additional_documents[].description` | text     | ✓        | Max 100 chars, what is this document          |

**Use cases:**

- Character references
- Proof of savings
- Previous tenancy agreements
- Pet references/certificates
- Professional certifications
- Explanatory letters (gaps in employment, etc.)

**Changes from current:**

- New step (was partially covered by `message_to_landlord`)
- Structured document upload with descriptions
- Higher file limit (10 vs none before)

---

### Step 7: Declarations & Consent

**Purpose:** Legal acknowledgments and consent collection for GDPR compliance.

**Fields:**

| Field                            | Type    | Required | Notes                                                             |
| -------------------------------- | ------- | -------- | ----------------------------------------------------------------- |
| `declaration_accuracy`           | boolean | ✓        | Must confirm information is accurate                              |
| `declaration_accuracy_text`      | static  |          | "I confirm that all information provided is true and accurate..." |
| `consent_screening`              | boolean | ✓        | Must consent to screening                                         |
| `consent_screening_text`         | static  |          | "I consent to background and credit screening..."                 |
| `consent_data_processing`        | boolean | ✓        | GDPR consent                                                      |
| `consent_data_processing_text`   | static  |          | "I consent to processing of my personal data..."                  |
| `consent_reference_contact`      | boolean | ✓        | Consent to contact references                                     |
| `consent_reference_contact_text` | static  |          | "I consent to contacting the references I have provided..."       |
| `consent_data_sharing`           | boolean |          | Optional - share with other landlords                             |
| `consent_data_sharing_text`      | static  |          | "I consent to sharing my application with other properties..."    |
| `consent_marketing`              | boolean |          | Optional                                                          |
| `digital_signature`              | text    | ✓        | Type full legal name                                              |
| `signature_date`                 | date    | ✓        | Auto-filled, display only                                         |
| `ip_address`                     | text    | ✓        | Auto-captured, display only                                       |

**Changes from current:**

- New dedicated step (was implicit in submission)
- Explicit GDPR consent collection
- Digital signature capture
- IP address logging for audit trail
- Granular consent options

---

### Step 8: Review

**Purpose:** Final review before submission.

**Sections displayed:**

1. Identity & Legal Eligibility summary
2. Household Composition summary
3. Financial Capability summary
4. Risk Mitigation summary
5. Credit & Rental History summary
6. Additional Information summary
7. Declarations summary (read-only)

**Actions:**

- Edit any section (returns to that step)
- Submit application

**Changes from current:**

- Updated to reflect new 8-step structure
- Declarations shown as read-only confirmation

---

## Migration Considerations

### Database Changes

**New columns on `tenant_profiles`:**

_Identity & Legal:_

- `middle_name`
- `id_document_type` (enum: passport, national_id, drivers_license, residence_permit)
- `id_number` (encrypted)
- `id_issuing_country`
- `id_expiry_date`
- `immigration_status` (enum: citizen, permanent_resident, visa_holder, refugee, asylum_seeker, other)
- `immigration_status_other`
- `visa_type`
- `visa_expiry_date`
- `work_permit_number`
- `right_to_rent_document_path`
- `right_to_rent_share_code` (UK)
- `identity_verification_method` (AU: document_based, points_based)
- `identity_points_documents` (JSON, AU)
- `identity_points_total` (AU)

_Employment & Financial:_

- `employment_contract_type` (enum: permanent, fixed_term, freelance, casual)
- `employment_end_date`
- `probation_end_date`
- `pay_frequency` (enum: weekly, fortnightly, monthly, annually)
- `business_name`
- `business_type`
- `business_registration_number`
- `gross_annual_revenue` (self-employed, optional)
- `tax_returns_paths` (JSON array)
- `business_bank_statements_paths` (JSON array)
- `bank_statements_paths` (JSON array)
- `additional_income_sources` (JSON array)

_Emergency Contact:_

- `emergency_contact_first_name`
- `emergency_contact_last_name`
- `emergency_contact_relationship`
- `emergency_contact_phone_country_code`
- `emergency_contact_phone_number`
- `emergency_contact_email`

**New columns on `applications`:**

_Rental Intent:_

- `is_flexible_on_move_in`
- `is_flexible_on_duration`

_Credit & Background:_

- `authorize_credit_check`
- `authorize_background_check`
- `credit_check_provider_preference`
- `has_ccjs_or_bankruptcies`
- `ccj_bankruptcy_details`
- `has_eviction_history`
- `eviction_details`
- `self_reported_credit_score`
- `credit_report_path`

_Current Address:_

- `current_living_situation`
- `current_address_unit`
- `current_address_state_province`
- `current_address_move_in_date`
- `current_landlord_name`
- `current_landlord_contact`
- `reason_for_moving`
- `reason_for_moving_other`

_Previous Addresses:_

- `previous_addresses` (JSON array)

_Insurance:_

- `interested_in_rent_insurance`
- `existing_insurance_provider`
- `existing_insurance_policy_number`

_Additional:_

- `additional_information`
- `additional_documents` (JSON array with file paths and descriptions)

_Declarations & Consent:_

- `declaration_accuracy_at` (timestamp)
- `consent_screening_at` (timestamp)
- `consent_data_processing_at` (timestamp)
- `consent_reference_contact_at` (timestamp)
- `consent_data_sharing_at` (timestamp)
- `consent_marketing_at` (timestamp)
- `digital_signature`
- `signature_ip_address`

**New table: `application_co_signers`:**

- `id`
- `application_id` (FK)
- `occupant_index` (reference to occupants_details array index)
- _Identity:_ `first_name`, `last_name`, `date_of_birth`, `nationality`
- _Contact:_ `email`, `phone_country_code`, `phone_number`
- _ID Document:_ `id_document_type`, `id_number` (encrypted), `id_issuing_country`, `id_expiry_date`
- _ID Files:_ `id_document_front_path`, `id_document_back_path`
- _Immigration:_ `immigration_status`, `visa_type`, `visa_expiry_date`
- _Employment:_ `employment_status`, `employment_status_other`
- _If employed:_ `employer_name`, `job_title`, `employment_type`, `employment_contract_type`, `employment_start_date`
- _Financial:_ `net_monthly_income`, `income_currency`
- _Documents:_ `employment_contract_path`, `payslips_paths` (JSON array)
- _If student:_ `university_name`, `enrollment_proof_path`, `student_income_source`, `student_monthly_income`
- _If other:_ `income_source`, `income_proof_path`
- `created_at`, `updated_at`

**New table: `application_guarantors`:**

- `id`
- `application_id` (FK)
- `for_signer_type` (enum: primary, co_signer)
- `for_co_signer_id` (FK to application_co_signers, nullable)
- _Identity:_ `first_name`, `last_name`, `date_of_birth`, `nationality`
- _Contact:_ `email`, `phone_country_code`, `phone_number`
- _Relationship:_ `relationship`, `relationship_other`
- _ID Document:_ `id_document_type`, `id_number` (encrypted), `id_issuing_country`, `id_expiry_date`
- _ID Files:_ `id_document_front_path`, `id_document_back_path`
- _Address:_ `street_address`, `city`, `state_province`, `postal_code`, `country`
- _Address Meta:_ `years_at_address`, `proof_of_residence_path`
- _Employment:_ `employment_status`, `employer_name`, `job_title`
- _Financial:_ `net_monthly_income`, `income_currency`
- _Documents:_ `proof_of_income_path`, `credit_report_path`
- _Consent:_ `consent_to_credit_check`, `consent_to_contact`, `guarantee_consent_signed`
- _Audit:_ `guarantee_consent_timestamp`, `guarantee_consent_ip`
- `created_at`, `updated_at`

**New table: `application_references`:**

- `id`
- `application_id` (FK)
- `type` (landlord, employer, personal, professional)
- `name`, `company`, `email`, `phone`
- `property_address` (landlord only)
- `tenancy_start_date`, `tenancy_end_date` (landlord only)
- `monthly_rent_paid` (landlord only)
- `job_title` (employer only)
- `relationship` (personal/professional)
- `years_known`
- `consent_to_contact`
- `created_at`, `updated_at`

### Data Migration

1. Migrate existing guarantor data from `tenant_profiles` to `application_guarantors`
2. Migrate existing references from `applications.references` JSON to `application_references` table
3. Map `profile_monthly_income` to `profile_net_monthly_income`
4. Set default `immigration_status` = 'citizen' for existing profiles
5. Set default `current_living_situation` based on whether `current_address` exists

---

## UI/UX Guidelines & Component Reuse

### Follow Existing Patterns

The new 8-step wizard must follow the established UI/UX patterns from the current application wizard:

**Existing Components to Reuse:**

- `WizardProgress` - Step indicator (desktop circles + mobile progress bar)
- `WizardNavigation` - Back/Next/Submit buttons with loading states
- `StepContainer` - Consistent layout wrapper for each step
- `useWizard` hook - Generic wizard state management
- `useProfileAutosave` hook - Immediate save for profile fields

**Form Components (from `resources/js/components/ui/`):**

- `Input`, `Textarea`, `Select` - Standard form inputs
- `DatePicker` - Date selection with validation
- `FileUpload` - Document upload with preview
- `PhoneInput` - Country code + number input
- `AddressForm` - Reusable address fields with country-specific validation
- `CurrencyInput` - Amount + currency selector
- `RadioGroup`, `Checkbox` - Selection inputs
- `FormField`, `FormLabel`, `FormError` - Field wrapper components

**Layout Patterns:**

- Card-based sections with clear headings
- Collapsible/expandable sections for optional content
- Inline validation with error messages below fields
- Help text and tooltips for complex fields
- Loading skeletons for async data

### Styling Guidelines

**Follow existing Tailwind patterns:**

- Use existing color tokens (primary, secondary, muted, destructive)
- Consistent spacing (gap-4, gap-6 for sections)
- Responsive design (mobile-first)
- Dark mode support via `dark:` variants

**Section Structure:**

```tsx
<div className="space-y-6">
    <div>
        <h3 className="text-lg font-medium">{sectionTitle}</h3>
        <p className="text-sm text-muted-foreground">{sectionDescription}</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">{/* Form fields */}</div>
</div>
```

**Conditional Sections:**

```tsx
{
    hasGuarantor && (
        <Card>
            <CardHeader>
                <CardTitle>Guarantor Information</CardTitle>
            </CardHeader>
            <CardContent>{/* Guarantor fields */}</CardContent>
        </Card>
    );
}
```

### New Components Needed

| Component                      | Purpose                                    | Reuses                                    |
| ------------------------------ | ------------------------------------------ | ----------------------------------------- |
| `CoSignerCard`                 | Display/edit co-signer details             | AddressForm, FileUpload, EmploymentFields |
| `GuarantorCard`                | Display/edit guarantor details             | AddressForm, FileUpload, EmploymentFields |
| `OccupantRow`                  | Occupant entry with will_sign_lease toggle | Input, DatePicker, Select                 |
| `PetRow`                       | Pet entry with type/breed/size             | Input, Select                             |
| `ReferenceCard`                | Reference entry by type                    | Input, PhoneInput, Select                 |
| `PreviousAddressCard`          | Previous address entry                     | AddressForm, DatePicker                   |
| `IncomeSourceRow`              | Additional income entry                    | CurrencyInput, Select, FileUpload         |
| `ConsentCheckbox`              | Styled consent with legal text             | Checkbox, expandable text                 |
| `ApplicationStrengthIndicator` | Visual completeness score                  | Progress bar, tooltips                    |

### Validation UX

**Real-time feedback:**

- Validate on blur for individual fields
- Show success checkmarks for valid fields
- Show inline errors immediately
- Disable Next until current step validates

**Step validation:**

- Validate entire step before allowing Next
- Scroll to first error on validation failure
- Highlight invalid fields with red border

**Review step:**

- Show all data in read-only cards
- "Edit" button per section returns to that step
- Final validation before submit

---

## Validation Design

### Source of Truth: Backend

Follow the validation architecture established in `DESIGN.md`. **Backend Laravel Form Requests are the authoritative source of truth**; frontend Zod schemas mirror them for UX but can be bypassed.

**Key Principles:**

1. **Backend is Source of Truth** - Frontend validation can be bypassed; backend MUST reject invalid data
2. **Frontend Mirrors Backend** - Zod schemas replicate Laravel rules exactly (same constraints, same messages)
3. **Consistent Error Messages** - Error text identical between frontend Zod and backend Laravel
4. **Progressive Validation** - Validate current step only for navigation; full validation on submit
5. **Fail Fast** - Show errors immediately on blur, don't wait for submission

### Validation Contexts

| Context          | Frontend        | Backend                     | Rules               |
| ---------------- | --------------- | --------------------------- | ------------------- |
| Field blur       | Zod schema      | -                           | Single field        |
| Step navigation  | Zod step schema | -                           | Current step fields |
| Autosave (draft) | -               | SaveApplicationDraftRequest | Relaxed (nullable)  |
| Submit           | Zod full schema | SubmitApplicationRequest    | Strict (required)   |

### Implementation Pattern

**Backend (source of truth):**

```php
// app/Http/Requests/Application/SubmitApplicationRequest.php
class SubmitApplicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            // Step 1: Identity
            'profile_first_name' => ['required', 'string', 'max:100'],
            'profile_date_of_birth' => ['required', 'date', 'before:' . now()->subYears(18)->toDateString()],
            'profile_id_expiry_date' => ['required', 'date', 'after:today'],
            // ...
        ];
    }

    public function messages(): array
    {
        return [
            'profile_date_of_birth.before' => 'You must be at least 18 years old.',
            'profile_id_expiry_date.after' => 'ID document must not be expired.',
            // ...
        ];
    }
}
```

**Frontend (mirrors backend):**

```typescript
// resources/js/components/application-wizard/schemas/identitySchema.ts
import { z } from 'zod';
import { MESSAGES } from './messages';

export const identitySchema = z.object({
    profile_first_name: z.string().min(1, MESSAGES.first_name.required).max(100, MESSAGES.first_name.maxLength),
    profile_date_of_birth: z
        .string()
        .refine((date) => new Date(date) <= new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000), MESSAGES.date_of_birth.must_be_18),
    profile_id_expiry_date: z.string().refine((date) => new Date(date) > new Date(), MESSAGES.id_expiry_date.must_be_future),
    // ...
});
```

### Scope: Data Changes Only

**IMPORTANT:** This restructure changes only the **data collected within each step**. The following existing patterns remain unchanged:

- Wizard navigation flow (`useWizard` hook, step transitions)
- Progress indicator component (`WizardProgress`)
- Form submission mechanism (Inertia Form, autosave)
- Error display patterns (inline errors, step validation)
- File upload handling (existing `FileUpload` component)
- Layout structure (`StepContainer`, responsive design)

Focus implementation effort on:

- New/modified form fields and their validation rules
- New database columns and relationships
- Updated Zod schemas matching new Form Request rules
- Updated step components with new field layouts
- New translation keys for new fields

---

## Translations (i18n)

### Follow Existing Pattern

Translations use server-side PHP files loaded via Inertia shared props, accessed in React with `translate(translations, 'key.path')`.

**Location:** `resources/lang/{en,fr,de,nl}/`

### New Translation Keys Required

**File: `wizard.php`** (extend existing)

```php
// Step titles and descriptions
'application.steps.identity.title' => 'Identity & Legal Eligibility',
'application.steps.identity.description' => 'Verify your identity and right to rent',
'application.steps.household.title' => 'Household Composition',
'application.steps.household.description' => 'Who will be living in the property',
'application.steps.financial.title' => 'Financial Capability',
'application.steps.financial.description' => 'Your income and employment details',
'application.steps.risk.title' => 'Risk Mitigation',
'application.steps.risk.description' => 'Co-signers and guarantors',
'application.steps.history.title' => 'Credit & Rental History',
'application.steps.history.description' => 'Your rental background and references',
'application.steps.additional.title' => 'Additional Information',
'application.steps.additional.description' => 'Supporting documents and notes',
'application.steps.consent.title' => 'Declarations & Consent',
'application.steps.consent.description' => 'Legal acknowledgments',
'application.steps.review.title' => 'Review & Submit',
'application.steps.review.description' => 'Review your application before submitting',

// Section headings
'application.sections.personal_details' => 'Personal Details',
'application.sections.id_document' => 'ID Document',
'application.sections.immigration' => 'Immigration Status',
'application.sections.rental_intent' => 'Rental Intent',
'application.sections.occupants' => 'Occupants',
'application.sections.pets' => 'Pets',
'application.sections.emergency_contact' => 'Emergency Contact',
'application.sections.employment' => 'Employment',
'application.sections.income' => 'Income',
'application.sections.co_signers' => 'Co-Signers',
'application.sections.guarantors' => 'Guarantors',
'application.sections.guarantors_for' => 'Guarantors for :name',
'application.sections.credit_check' => 'Credit Check Authorization',
'application.sections.current_address' => 'Current Address',
'application.sections.previous_addresses' => 'Previous Addresses',
'application.sections.landlord_references' => 'Landlord References',
'application.sections.other_references' => 'Other References',
'application.sections.declarations' => 'Declarations',

// Field labels (following existing pattern)
'application.fields.first_name' => 'First Name',
'application.fields.middle_name' => 'Middle Name',
'application.fields.last_name' => 'Last Name',
'application.fields.date_of_birth' => 'Date of Birth',
'application.fields.nationality' => 'Nationality',
'application.fields.id_document_type' => 'ID Document Type',
'application.fields.id_number' => 'Document Number',
'application.fields.id_issuing_country' => 'Issuing Country',
'application.fields.id_expiry_date' => 'Expiry Date',
// ... (all field labels)

// Placeholders and help text
'application.help.id_number' => 'Your document number will be encrypted',
'application.help.net_monthly_income' => 'Your take-home pay after tax',
'application.help.will_sign_lease' => 'Check if this person will be on the lease',

// Validation messages
'application.validation.must_be_18' => 'Must be at least 18 years old',
'application.validation.id_expired' => 'ID document has expired',
'application.validation.future_date' => 'Must be a future date',

// Buttons and actions
'application.actions.add_occupant' => 'Add Occupant',
'application.actions.add_pet' => 'Add Pet',
'application.actions.add_guarantor' => 'Add Guarantor',
'application.actions.add_reference' => 'Add Reference',
'application.actions.remove' => 'Remove',
```

### Translation Workflow

1. Add English keys first (`resources/lang/en/wizard.php`)
2. Copy structure to other languages (`fr`, `de`, `nl`)
3. Use placeholders for dynamic values (`:name`, `:count`)
4. Test with each locale to verify layout doesn't break

---

## Code Quality & Refactoring Guidelines

### During Implementation

While building the new wizard, **refactor and improve** existing code:

**Naming Conventions:**

- Use consistent, descriptive names (e.g., `IdentityStep` not `Step1`)
- Follow existing patterns in the codebase
- Rename unclear variables/functions when encountered

**Component Structure:**

- Extract repeated patterns into reusable components
- Keep components focused (single responsibility)
- Use TypeScript interfaces for all props and data shapes

**Code Organization:**

```
resources/js/components/application-wizard/
├── steps/
│   ├── IdentityStep.tsx
│   ├── HouseholdStep.tsx
│   ├── FinancialStep.tsx
│   ├── RiskMitigationStep.tsx
│   ├── HistoryStep.tsx
│   ├── AdditionalInfoStep.tsx
│   ├── ConsentStep.tsx
│   └── ReviewStep.tsx
├── components/
│   ├── CoSignerCard.tsx
│   ├── GuarantorCard.tsx
│   ├── OccupantRow.tsx
│   ├── PetRow.tsx
│   ├── ReferenceCard.tsx
│   ├── PreviousAddressCard.tsx
│   ├── EmploymentFields.tsx      (reusable across tenant/co-signer/guarantor)
│   ├── IdentityFields.tsx        (reusable across tenant/co-signer/guarantor)
│   └── ConsentCheckbox.tsx
├── hooks/
│   ├── useApplicationWizard.ts
│   └── useStepValidation.ts
├── schemas/
│   └── applicationSchemas.ts     (Zod schemas per step)
└── types/
    └── application.ts            (TypeScript interfaces)
```

**Best Practices:**

- Remove dead code and unused imports
- Add JSDoc comments for complex functions
- Use constants for magic strings/numbers
- Prefer composition over prop drilling
- Memoize expensive computations
- Handle loading and error states consistently

**Backend:**

- Use Form Request classes for all validation
- Keep controllers thin, move logic to services if needed
- Use Eloquent relationships properly
- Add database indexes for frequently queried columns

**Testing:**

- Write tests as you build (not after)
- Cover validation rules with unit tests
- Cover wizard flow with feature tests
- Use factories for test data

---

## Implementation Order

### Phase 1: Database & Models

- [ ] Create migrations for new columns on `tenant_profiles` and `applications`
- [ ] Create `application_co_signers` table and model
- [ ] Create `application_guarantors` table and model (with FK to co_signers)
- [ ] Create `application_references` table and model
- [ ] Write data migration for existing guarantor records
- [ ] Update `TenantProfile` model with new fields
- [ ] Update `Application` model with new fields and relationships

### Phase 2: Backend Validation

- [ ] Create new `StoreApplicationRequest` with 8-step validation
- [ ] Update `ApplicationController` step validation logic
- [ ] Add new file upload handling for additional documents
- [ ] Implement consent timestamp recording

### Phase 3: Frontend Components

- [ ] Create new step components (8 total)
- [ ] Update `useApplicationWizard` hook for 8 steps
- [ ] Create new Zod schemas matching backend
- [ ] Update wizard navigation and progress
- [ ] Implement new form fields and conditional logic

### Phase 4: Testing & Polish

- [ ] Unit tests for new validation rules
- [ ] Feature tests for wizard flow
- [ ] Browser tests for full application submission
- [ ] Update translations (en, fr, de, nl)
- [ ] Update review step display

---

## Country-Aware Validation Rules

The application should adapt requirements based on the **property's country** (not applicant's nationality).

### Core Philosophy: Universal Core + Regional Enhancements

**Always Required (All Markets):**

- ✓ Valid ID document (passport, national ID, driver's license, or residence permit)
- ✓ Proof of income/financial capability
- ✓ Basic contact information
- ✓ Credit check authorization consent
- ✓ Data processing consent (GDPR-style, applied globally for consistency)

**Regional Enhancements (Optional/Conditional):**

- Country-specific documents are **shown but optional** unless the landlord explicitly requires them
- System **suggests** additional documents based on property country
- Landlords can configure which optional fields they want to require per listing

### Regional Requirement Matrix

| Field/Feature            | EU             | UK        | US        | AU             | Core?   |
| ------------------------ | -------------- | --------- | --------- | -------------- | ------- |
| **ID Document**          | ✓              | ✓         | ✓         | ✓              | **Yes** |
| **Income Proof**         | ✓              | ✓         | ✓         | ✓              | **Yes** |
| **Credit Auth**          | ✓              | ✓         | ✓         | ✓              | **Yes** |
| **Data Consent**         | ✓              | ✓         | ✓         | ✓              | **Yes** |
| Right-to-rent docs       | Suggested (IE) | Suggested | ✗         | ✗              | No      |
| Right-to-rent share code | ✗              | Suggested | ✗         | ✗              | No      |
| Identity points system   | ✗              | ✗         | ✗         | Suggested      | No      |
| Background check auth    | Optional       | Optional  | Suggested | Optional       | No      |
| Emergency contact        | Optional       | Optional  | Suggested | Suggested      | No      |
| SSN/Tax ID               | ✗              | ✗         | Optional  | Optional (TFN) | No      |
| State/province           | Auto           | Auto      | Auto      | Auto           | Context |
| CCJ disclosure           | ✗              | Optional  | ✗         | ✗              | No      |
| Bankruptcy disclosure    | Optional       | Optional  | Optional  | Optional       | No      |
| Eviction history         | Optional       | Optional  | Suggested | Optional       | No      |

**Legend:**

- **✓ Required** = Always mandatory
- **Suggested** = Shown prominently, recommended but not blocking
- **Optional** = Available if user wants to provide
- **✗** = Not applicable/not shown

### Implementation Notes

1. **Universal baseline** - Core fields work identically everywhere; we don't block submission for missing country-specific docs
2. **Property country hints** - System shows relevant optional fields based on `property.country` but doesn't require them
3. **Landlord configuration** - Property managers can mark specific optional fields as "required for this listing"
4. **Progressive enhancement** - Applicants can strengthen their application by providing optional docs
5. **Completeness indicator** - Show application "strength" score based on how much optional info is provided
6. **Smart defaults** - Pre-select currency, phone country code, common options per region

---

## Future Consideration: Profile Auto-Population

### Concept (Not Implemented Now)

In the future, when a primary applicant enters a co-signer or guarantor's email, the system could:

1. Check if a `TenantProfile` exists with that email
2. Offer to auto-populate their information (with consent)

### Why Field Alignment Matters

To enable this future feature, **co-signer and guarantor fields use the same naming as `TenantProfile`** wherever possible:

| TenantProfile        | Co-Signer            | Guarantor            | Aligned? |
| -------------------- | -------------------- | -------------------- | -------- |
| `first_name`         | `first_name`         | `first_name`         | ✓        |
| `last_name`          | `last_name`          | `last_name`          | ✓        |
| `date_of_birth`      | `date_of_birth`      | `date_of_birth`      | ✓        |
| `email`              | `email`              | `email`              | ✓        |
| `phone_country_code` | `phone_country_code` | `phone_country_code` | ✓        |
| `phone_number`       | `phone_number`       | `phone_number`       | ✓        |
| `nationality`        | `nationality`        | `nationality`        | ✓        |
| `id_document_type`   | `id_document_type`   | `id_document_type`   | ✓        |
| `id_number`          | `id_number`          | `id_number`          | ✓        |
| `id_issuing_country` | `id_issuing_country` | `id_issuing_country` | ✓        |
| `id_expiry_date`     | `id_expiry_date`     | `id_expiry_date`     | ✓        |
| `employment_status`  | `employment_status`  | `employment_status`  | ✓        |
| `employer_name`      | `employer_name`      | `employer_name`      | ✓        |
| `job_title`          | `job_title`          | `job_title`          | ✓        |
| `net_monthly_income` | `net_monthly_income` | `net_monthly_income` | ✓        |
| `income_currency`    | `income_currency`    | `income_currency`    | ✓        |

This alignment enables simple field-by-field copying when auto-population is implemented later.

---

## Open Questions

### Resolved ✅

1. ~~**Co-signer financial details:**~~ → Yes, full identity + financial required in step 4
2. ~~**Emergency contact location:**~~ → Added to Step 2 (Household), required for US/AU
3. ~~**Move-in date and lease duration:**~~ → Added to Step 2 (Household) as "Rental Intent"
4. ~~**Current address location:**~~ → Moved to Step 5 (Credit & Rental History) with previous addresses

### Open 🔄

5. **Guarantor/Co-signer invitation flow:** Should these people fill out their own details via email link instead of the primary applicant entering it?
    - **Pros:** Better data accuracy, direct consent capture, reduces applicant burden
    - **Cons:** Async flow complexity, partial applications, potential delays
    - **Recommendation:** Phase 2 feature - start with applicant entering data, add invitation flow later

6. **Right-to-rent specifics:**
    - UK: Mandatory for all non-British citizens, share code system
    - Ireland: Required, different process
    - EU27: Generally no formal right-to-rent check, but residency verification varies
    - **Action:** Research country-specific requirements for target EU markets

7. **Co-signer age validation:**
    - **Options:**
      a) Disable `will_sign_lease` checkbox if DOB shows under 18
      b) Show warning but allow (emancipated minors exist)
      c) Validate in step 4 and block progress
    - **Recommendation:** Option (a) - disable checkbox with tooltip explaining 18+ requirement

8. **Guarantor limits:**
    - **Recommendation:** Max 3 guarantors per signer (covers most edge cases without UI bloat)
    - Total max: 10 guarantors per application

9. **Income verification threshold:**
    - Should we calculate rent-to-income ratio and warn if below threshold (e.g., 2.5x-3x rent)?
    - **Recommendation:** Yes, soft warning in Review step, not a blocker

10. **Document expiry warnings:**
    - ID documents, visas, work permits expiring within lease term
    - **Recommendation:** Show warning in Review step if any document expires during proposed lease

11. **Sensitive data handling:**
    - ID numbers, tax IDs should be masked after entry
    - Consider tokenization for storage
    - **Action:** Define encryption/masking strategy for PII
