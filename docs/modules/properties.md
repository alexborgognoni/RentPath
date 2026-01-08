# Properties

## Overview

Properties are rental listings owned by PropertyManagers. They support multiple types with type-specific specifications.

## Key Fields

| Category | Fields |
|----------|--------|
| Basic | title, description, type, subtype |
| Specs | bedrooms, bathrooms, size, floor_level, year_built |
| Parking | parking_spots_interior, parking_spots_exterior |
| Energy | energy_class, thermal_insulation_class, heating_type |
| Amenities | kitchen_equipped, has_cellar, has_laundry, has_fireplace, etc. |
| Rental | rent_amount, rent_currency, available_date |
| Address | house_number, street_name, city, postal_code, country |
| Images | Via `property_images` table (has `is_main` flag, sort_order) |

## Property Status (Lifecycle)

| Status | Description | Next States |
|--------|-------------|-------------|
| `draft` | Manager setting up, incomplete | vacant |
| `vacant` | No tenant, ready for market | leased, maintenance, archived |
| `leased` | Tenant in place | vacant, maintenance, archived |
| `maintenance` | Off market for repairs | vacant, archived |
| `archived` | No longer managing | - |

**Note**: Application-related stages (under_review, approved) are derived from the `applications` table, not stored on property.

## Visibility & Access Control

| Field | Values | Description |
|-------|--------|-------------|
| `visibility` | public, unlisted, private | Who can SEE the property |
| `accepting_applications` | boolean | Whether applications are accepted |
| `application_access` | open, link_required, invite_only | Who can APPLY |

**Rules**:
- `status = draft` forces `visibility = private` and `accepting_applications = false`
- Settings are preserved when changing status

## Property Types & Subtypes

| Type | Subtypes |
|------|----------|
| Apartment | studio, loft, duplex, triplex, penthouse, serviced |
| House | detached, semi-detached, villa, bungalow |
| Room | private_room, student_room, co-living |
| Commercial | office, retail |
| Industrial | warehouse, factory |
| Parking | garage, indoor_spot, outdoor_spot |

## Type-Specific Specifications

Different fields are shown/required based on property type:

| Field | Apartment | House | Room | Commercial | Industrial | Parking |
|-------|:---------:|:-----:|:----:|:----------:|:----------:|:-------:|
| Bedrooms | Yes (min 0) | Yes (min 1) | - | - | - | - |
| Bathrooms | Yes (min 1) | Yes (min 1) | Yes (min 0) | Optional | Optional | - |
| Size | Required | Required | Required | Required | Required | Optional |
| Floor Level | Yes | - | Yes | Yes | - | Yes |
| Land Size | - | Yes | - | - | - | - |

## Range Constraints

| Field | Min | Max | Notes |
|-------|:---:|:---:|-------|
| bedrooms | 0 | 20 | 0 for studios |
| bathrooms | 0 | 10 | 0.5 increments |
| size | 1 | 100,000 | m² |
| floor_level | -10 | 200 | negative = basement |
| year_built | 1800 | current | validated |
| rent_amount | 0.01 | 999,999.99 | |

## Related Files

- `app/Models/Property.php`
- `app/Models/PropertyImage.php`
- `resources/js/Pages/Properties/` (manager portal)
