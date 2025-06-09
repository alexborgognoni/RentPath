# ✅ **Requirements Specification**

---

## 🧑‍💼 1. User Accounts

### 1.1. **Account Types**

- `property_managers`: private landlords or businesses managing properties
- `renters`: individuals applying to rent properties

### 1.2. **Authentication**

- Each account type has **its own signup and login portal**
- Passwords securely hashed
- Session/token-based authentication (e.g., Laravel Sanctum or Passport)

---

## 🧑‍💼 2. Property Managers

### 2.1. **Basic Fields**

- First/last name, email, password, phone number
- Type: `private` or `business`

### 2.2. **Verification Workflow**

- Separate table: `property_manager_verifications`
- Fields:

  - `company_name`, `registration_number`, `business_address`
  - `identity_document`, `proof_of_authority`, `address_proof`, optional extra documents

- Status: `pending`, `verified`, `rejected`
- Verifiable by other platform-approved property managers or admins
- Fast-access flag on `property_managers`: `is_verified`

### 2.3. **Multi-Manager Support**

- Properties can be assigned to **multiple managers** via `property_manager_property` join table
- Roles: e.g., `owner`, `agent`, `admin`

---

## 🧍‍♂️ 3. Renters

### 3.1. **Basic Fields**

- First/last name, email, password, phone number

### 3.2. **Verification Workflow**

- Separate table: `renter_verifications`
- Fields:

  - `date_of_birth`, `nationality`, `address`, `postal_code`, `city`, `country`, `picture`
  - `profession_type`, `employment_certificate`, `work_contract_start_date`, `work_contract_end_date`
  - `income_proof_1`, `income_proof_2`, `income_proof_3`
  - `proof_of_other_subsidiaries`, `proof_of_accommodation`
  - `other_document_1–3`

- Status: `pending`, `verified`, `rejected`
- Verified by a `property_manager`
- Fast-access flag on `renters`: `is_verified`

---

## 🏘️ 4. Properties

### 4.1. **Property Listings**

- Fields: `title`, `address`, `description`, `rent_amount`, `is_invite_only`, `created_at`
- Properties can be:

  - **Public** (searchable/applicable by any renter)
  - **Invite-only** (only accessible via invitation)

---

## 📬 5. Rental Invitations

### 5.1. **General and Direct Invites**

- Table: `rental_invitations`
- Fields:

  - `property_id`, `invitation_token` (unique), `type` (general or direct), `email`, `usage_limit`, `usage_count`, `status`, `expires_at`

- **General invite**: sharable link
- **Direct invite**: tied to a specific email
- Logic:

  - Check for expiry, usage limits
  - Track who used the invite

---

## 📝 6. Rental Applications

### 6.1. **Application Flow**

- Table: `rental_applications`
- Fields:

  - `renter_id`, `property_id`, `status` (submitted, reviewed, accepted, rejected), `message`

- One renter can apply to multiple properties
- Each application is trackable by the property manager

---

## 🔐 7. Verification & Access Control

### 7.1. **Roles & Visibility**

- Property managers can only see/manage their properties
- Renters can only apply to:

  - Public listings
  - Invite-only listings if they have a valid invitation

- Verified property managers can verify renters

---

## 💾 8. Data Storage Notes

- File fields (documents, photos) store **file paths or URLs** (e.g. to S3 or local storage)
- All file uploads should have **access control** (e.g., only visible to owner and verifier)

---

## 📈 9. Future-Proofing (Optional Add-ons)

- `leases` table for signed tenants
- Notifications (email/in-app for invitation, application status updates)
- Admin dashboard for managing verifications and flagged accounts
- Stripe/Payments integration for agency billing (if needed)

---
