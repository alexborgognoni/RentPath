# Property entity

```sql
CREATE TABLE properties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_manager_id BIGINT UNSIGNED NOT NULL,

    -- Basic property information
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NULL,
    image_path VARCHAR(255) NULL,

    -- Property type and subtype
    type ENUM(
        'apartment',
        'house',
        'room',
        'commercial',
        'industrial',
        'parking'
    ) NOT NULL,
    subtype ENUM(
        -- Apartment subtypes
        'studio', 'loft', 'duplex', 'triplex', 'penthouse', 'serviced',
        -- House subtypes
        'detached', 'semi-detached', 'villa', 'bungalow',
        -- Room subtypes
        'private_room', 'student_room', 'co-living',
        -- Commercial subtypes
        'office', 'retail',
        -- Industrial subtypes
        'warehouse', 'factory',
        -- Parking subtypes
        'garage', 'indoor_spot', 'outdoor_spot'
    ) NOT NULL,

    -- Property specifications
    bedrooms INT UNSIGNED DEFAULT 0,
    bathrooms DECIMAL(3,1) DEFAULT 0.0,
    parking_spots_interior INT UNSIGNED DEFAULT 0,
    parking_spots_exterior INT UNSIGNED DEFAULT 0,
    size DECIMAL(10,2) NULL, -- in square meters
    balcony_size DECIMAL(10,2) NULL,
    land_size DECIMAL(10,2) NULL, -- only for houses
    floor_level INT NULL,
    has_elevator BOOLEAN DEFAULT FALSE,
    year_built YEAR NULL,

    -- Energy / building
    energy_class ENUM('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G') NULL,
    thermal_insulation_class ENUM('A', 'B', 'C', 'D', 'E', 'F', 'G') NULL,
    heating_type ENUM('gas', 'electric', 'district', 'wood', 'heat_pump', 'other') NULL,

    -- Kitchen
    kitchen_equipped BOOLEAN DEFAULT FALSE,
    kitchen_separated BOOLEAN DEFAULT FALSE,

    -- Extras / amenities
    has_cellar BOOLEAN DEFAULT FALSE,
    has_laundry BOOLEAN DEFAULT FALSE,
    has_fireplace BOOLEAN DEFAULT FALSE,
    has_air_conditioning BOOLEAN DEFAULT FALSE,
    has_garden BOOLEAN DEFAULT FALSE,
    has_rooftop BOOLEAN DEFAULT FALSE,
    extras JSON NULL, -- for uncommon features like sauna, home_office, etc.

    -- Rental information
    available_date DATE NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    rent_currency ENUM('eur', 'usd', 'gbp', 'chf') DEFAULT 'eur',

    -- Property status
    status ENUM(
        'inactive',
        'available',
        'application_received',
        'under_review',
        'visit_scheduled',
        'approved',
        'leased',
        'maintenance',
        'archived'
    ) NOT NULL DEFAULT 'inactive',

    -- Address fields
    house_number VARCHAR(20) NOT NULL,
    street_name VARCHAR(255) NOT NULL,
    street_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NULL,
    postal_code VARCHAR(20) NOT NULL,
    country CHAR(2) NOT NULL, -- ISO 3166-1 alpha-2

    -- Metadata
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_property_manager_status(property_manager_id, status),
    INDEX idx_city_postal(city, postal_code),
    INDEX idx_type_subtype(type, subtype),
    INDEX idx_available_date(available_date),
    INDEX idx_rent_amount(rent_amount)
);
```

### 🏢 **Property Types**

| ID  | Type       | Description                                             |
| --- | ---------- | ------------------------------------------------------- |
| 1   | Apartment  | Multi-unit residential properties (e.g., flats, condos) |
| 2   | House      | Standalone or semi-detached residential units           |
| 3   | Commercial | Offices, retail spaces, or business premises            |
| 4   | Industrial | Warehouses, factories, or workshops                     |
| 5   | Parking    | Garages and parking spaces for rent                     |

---

| ID  | Type ID | Subtype       | Example                                          |
| --- | ------- | ------------- | ------------------------------------------------ |
| 1   | 1       | Studio        | Single-room apartment                            |
| 2   | 1       | Loft          | Open-plan apartment with high ceilings           |
| 3   | 1       | Duplex        | Two-level apartment                              |
| 3   | 1       | Triplex       | Three-level apartment                            |
| 4   | 1       | Penthouse     | Luxury top-floor apartment                       |
| 5   | 1       | Serviced      | Fully furnished with cleaning/services           |
| 6   | 2       | Detached      | Fully independent house                          |
| 7   | 2       | Semi-detached | Shares a wall with another house                 |
| 8   | 2       | Villa         | Large, often luxurious house                     |
| 9   | 2       | Bungalow      | Single-story home                                |
| 10  | 3       | Private Room  | Single room within shared property               |
| 12  | 3       | Student Room  | Specifically in student residence or near campus |
| 13  | 3       | Co-living     | Room in a modern communal housing setup          |
| 14  | 4       | Office        | Workspace for businesses                         |
| 15  | 4       | Retail        | Store or shop location                           |
| 16  | 5       | Warehouse     | Storage or distribution building                 |
| 17  | 5       | Factory       | Light industrial or production site              |
| 18  | 6       | Garage        | Enclosed private parking                         |
| 19  | 6       | Indoor Spot   | Covered or underground parking                   |
| 20  | 6       | Outdoor Spot  | Driveway or open-lot parking                     |

# Property statuses

| Status                   | Description                                                                                | Typical Transitions                                              |
| ------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **inactive**             | Property exists but isn’t currently accepting applications.                                | → `available`, `maintenance`, or `archived`                      |
| **available**            | Property is open for applications.                                                         | → `application_received`, `leased`, `inactive`, or `maintenance` |
| **application_received** | One or more tenants have applied.                                                          | → `under_review`, `available`, or `archived`                     |
| **under_review**         | Property manager reviewing one or more applications.                                       | → `visit_scheduled`, `approved`, `rejected`, or `available`      |
| **visit_scheduled**      | At least one visit is confirmed between a potential tenant and the property manager/owner. | → `leased`, `available`, or `maintenance`                        |
| **approved**             | Tenant approved, lease preparation in progress.                                            | → `leased` or `available`                                        |
| **leased**               | Property currently rented under an active lease.                                           | → `available` (after lease end), `maintenance`, or `archived`    |
| **maintenance**          | Property temporarily unavailable for repairs or preparation.                               | → `available` or `inactive`                                      |
| **archived**             | Property permanently closed or deleted.                                                    | —                                                                |

# Conceptual flow

| id  | action                                                                                                                                   | next step(s)      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | property manager lists property                                                                                                          | 2                 |
| 2   | property manager shares invite link openly or directly with potential tenants                                                            | 3                 |
| 3   | potential tenant fills out required information, and uploads documents (if not already saved in his profile) and submits the application | 4                 |
| 4   | property manager receives application linked to that property                                                                            | 5                 |
| 5   | (optionally) send profile to property owner for approval                                                                                 | 6, 7              |
| 6   | reject application, either by property owner or manager's choice                                                                         | optional: 99, 100 |
| 7   | approve application and property manager enters his availabilies for a visit in the calendar                                             | 8                 |
| 8   | potential tenant agrees on a visit time and date                                                                                         | 9, 10             |
| 9   | visit completed, tenant rejects property                                                                                                 | optional: 99, 100 |
| 10  | visit completed successfully                                                                                                             | 11                |
| 11  | lease signing, insurance, and deposit payment                                                                                            | 12                |
| 12  | move-in                                                                                                                                  | optional: 99, 100 |
| 99  | application archived                                                                                                                     | -                 |
| 100 | application deleted                                                                                                                      | -                 |

# Application statuses

| Status              | Description                                                                                  | Typical Transitions                                        |
| ------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **draft**           | Applicant started filling out info but hasn’t submitted.                                     | → `submitted` or `deleted`                                 |
| **submitted**       | Application received and pending review by property manager.                                 | → `under_review`, `withdrawn`, or `archived`               |
| **under_review**    | Property manager reviewing documents, verifying identity, or discussing with property owner. | → `visit_scheduled`, `approved`, `rejected`, or `archived` |
| **visit_scheduled** | Visit date/time agreed upon.                                                                 | → `visit_completed`, `withdrawn`, or `archived`            |
| **visit_completed** | Visit took place; awaiting manager or applicant decision.                                    | → `approved`, `rejected`, `withdrawn`, or `archived`       |
| **approved**        | Manager/owner approved the tenant, awaiting lease signature or deposit.                      | → `leased`, `withdrawn`, or `archived`                     |
| **rejected**        | Application declined by manager or owner.                                                    | → `archived`                                               |
| **withdrawn**       | Applicant voluntarily withdrew their application.                                            | → `archived`                                               |
| **leased**          | Application led to a signed lease.                                                           | → `archived` (after lease start or end)                    |
| **archived**        | Application closed and kept for records (cannot be modified).                                | —                                                          |
| **deleted**         | Application removed before submission (draft cleanup).                                       | —                                                          |

# Application Invite Tokens

| Field                       | Type                               | Description                                                                 |
| --------------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| **id**                      | UUID / BIGINT                      | Primary key                                                                 |
| **property_id**             | FK → `properties.id`               | Property this token grants access to                                        |
| **token**                   | string, **NOT NULL**               | Unique token used in the URL (always required now)                          |
| **type**                    | ENUM('private', 'invite')          | `private` = shareable token link, `invite` = restricted to a specific email |
| **email**                   | string, nullable                   | Used if `type = 'invite'` to restrict by recipient                          |
| **max_uses**                | int, nullable                      | Maximum allowed uses (e.g., 1 for one-time invites)                         |
| **used_count**              | int, default 0                     | Current number of uses                                                      |
| **expires_at**              | datetime, nullable                 | When the token becomes invalid                                              |
| **status**                  | ENUM('active','revoked','expired') | Current state of the token                                                  |
| **created_by**              | FK → `users.id`                    | Who generated the link                                                      |
| **created_at / updated_at** | timestamps                         | Standard auditing fields                                                    |
