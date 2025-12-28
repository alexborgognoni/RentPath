# International Address & Validation Implementation Plan

## Status: COMPLETED

**Last Updated:** 2024-12-28

---

## Summary

This plan covered implementing comprehensive international validation for:

1. **Address validation** - Country-aware postal codes, state/province fields
2. **Phone validation** - Using libphonenumber for all 217 countries with dial codes
3. **Country/Nationality validation** - Full ISO 3166-1 alpha-2 coverage (250 countries)

All phases have been completed with frontend/backend validation parity as per DESIGN.md.

---

## Completed Phases

### Phase 1: Database Migration ✅

**Files:**

- `database/migrations/XXXX_add_address_fields_to_tenant_profiles_table.php`

**Changes:**

- Added `current_address_line_2` (apartment, unit, suite, floor)
- Added `current_state_province` (state/province/region/canton)
- Updated `TenantProfile` model `$fillable` array

---

### Phase 2: Postal Code Validation ✅

**Coverage:** 120+ countries with standardized postal code systems

**Files:**

- `resources/js/utils/postal-code-patterns.ts` (Frontend)
- `app/Rules/ValidPostalCode.php` (Backend)

**Features:**

- Regex patterns for 120+ countries organized by region
- Example placeholders for each country
- Country-specific labels (ZIP Code, Postcode, Eircode, etc.)
- Lenient validation for countries without patterns

**Regions covered:**

- Europe: 40 countries (Western, British Isles, Nordic, Southern, Central, Eastern, Balkans, Baltic)
- North America: US, Canada, Mexico, Caribbean, Central America
- South America: 11 countries
- Asia: East Asia, Southeast Asia, South Asia, Central Asia, Middle East
- Africa: 11 countries
- Oceania: 7 countries/territories

---

### Phase 3: Phone Validation ✅

**Coverage:** All 217 countries with dial codes

**Files:**

- `resources/js/utils/phone-validation.ts` (Frontend - uses `libphonenumber-js`)
- `app/Rules/ValidPhoneNumber.php` (Backend - uses `giggsey/libphonenumber-for-php`)

**Features:**

- Full phone number validation using libphonenumber on both ends
- Country code to region conversion
- Consistent error messages

---

### Phase 4: Country/Nationality Validation ✅

**Coverage:** 250 countries (full ISO 3166-1 alpha-2)

**Files:**

- `resources/js/utils/country-data.ts` (Frontend)
- `app/Rules/ValidCountryCode.php` (Backend)

**Features:**

- Complete ISO 3166-1 alpha-2 coverage from `i18n-iso-countries` package
- Phone dial codes from `react-international-phone` (217 countries)
- Demonyms/nationality names from `country-flags-svg`
- Flag emoji generation
- Search functionality with relevance scoring

**Data sources:**

- Country names: `i18n-iso-countries` (250 countries)
- Dial codes: `react-international-phone` (217 countries)
- Demonyms: `country-flags-svg` + custom fallbacks

---

### Phase 5: State/Province Validation ✅

**Files:**

- `resources/js/utils/state-province-data.ts`
- `resources/js/utils/address-validation.ts`
- `resources/js/components/ui/state-province-select.tsx`

**Countries requiring state/province:**

- US (50 states + territories)
- Canada (13 provinces/territories)
- Australia (8 states/territories)
- Brazil (27 states)
- Mexico (32 states)
- India (36 states/UTs)

---

### Phase 6: Frontend/Backend Sync ✅

**Validation parity achieved per DESIGN.md:**

| Validation     | Frontend                  | Backend                          | Match            |
| -------------- | ------------------------- | -------------------------------- | ---------------- |
| Postal codes   | `postal-code-patterns.ts` | `ValidPostalCode.php`            | ✅ 120+ patterns |
| Phone numbers  | `libphonenumber-js`       | `giggsey/libphonenumber-for-php` | ✅ 217 countries |
| Country codes  | `country-data.ts`         | `ValidCountryCode.php`           | ✅ 250 codes     |
| State/province | `state-province-data.ts`  | `StoreApplicationRequest.php`    | ✅ 6 countries   |
| Error messages | `application-schemas.ts`  | `StoreApplicationRequest.php`    | ✅ Synchronized  |

**Cross-reference documentation added to:**

- All backend validation rules (`ValidPostalCode.php`, `ValidPhoneNumber.php`, `ValidCountryCode.php`)
- All frontend validation files
- `StoreApplicationRequest.php` messages array

---

### Phase 7: Frontend Components ✅

**Files updated:**

- `resources/js/components/application-wizard/steps/PersonalInfoStep.tsx`
- `resources/js/components/ui/phone-input.tsx`
- `resources/js/hooks/useApplicationWizard.ts`
- `resources/js/lib/validation/application-schemas.ts`
- `resources/js/pages/profile-setup.tsx`

---

### Phase 8: Testing ✅

**Files:**

- `tests/Unit/Rules/ValidPostalCodeTest.php`
- `tests/Feature/AddressValidationTest.php`
- `tests/Feature/ApplicationFlowTest.php` (updated)

---

## Key Files Reference

### Validation Rules (Backend)

| File                             | Purpose                 | Frontend Sync             |
| -------------------------------- | ----------------------- | ------------------------- |
| `app/Rules/ValidPostalCode.php`  | Postal code validation  | `postal-code-patterns.ts` |
| `app/Rules/ValidPhoneNumber.php` | Phone number validation | `phone-validation.ts`     |
| `app/Rules/ValidCountryCode.php` | Country code validation | `country-data.ts`         |

### Validation Data (Frontend)

| File                                         | Purpose                    | Backend Sync                  |
| -------------------------------------------- | -------------------------- | ----------------------------- |
| `resources/js/utils/postal-code-patterns.ts` | 120+ postal patterns       | `ValidPostalCode.php`         |
| `resources/js/utils/phone-validation.ts`     | Phone validation           | `ValidPhoneNumber.php`        |
| `resources/js/utils/country-data.ts`         | 250 country codes          | `ValidCountryCode.php`        |
| `resources/js/utils/state-province-data.ts`  | State/province lists       | `StoreApplicationRequest.php` |
| `resources/js/utils/address-validation.ts`   | Address validation helpers | N/A                           |

### Form Requests

| File                                            | Purpose                           |
| ----------------------------------------------- | --------------------------------- |
| `app/Http/Requests/StoreApplicationRequest.php` | Application submission validation |

### Schemas

| File                                                 | Purpose                      |
| ---------------------------------------------------- | ---------------------------- |
| `resources/js/lib/validation/application-schemas.ts` | Zod schemas + error messages |

---

## Maintenance Notes

### Adding a New Country Postal Pattern

1. Add pattern to `resources/js/utils/postal-code-patterns.ts`:

    ```typescript
    XX: /^pattern$/i, // CountryName: Example
    ```

2. Add same pattern to `app/Rules/ValidPostalCode.php`:

    ```php
    'XX' => '/^pattern$/i', // CountryName: Example
    ```

3. Add example to `POSTAL_CODE_EXAMPLES` in frontend file

### Adding Phone Support for New Territory

Phone validation automatically supports all territories with dial codes via libphonenumber. No manual work needed.

### Modifying Error Messages

1. Update message in `resources/js/lib/validation/application-schemas.ts` (APPLICATION_MESSAGES)
2. Update same message in `app/Http/Requests/StoreApplicationRequest.php` (messages array)
3. Keep messages identical for consistent UX

---

## Future Enhancements (Deferred)

### Address Autocomplete API (Post-MVP)

Options evaluated:

1. **Google Places API** - $200 free/month, limited apartment data
2. **Loqate** - Best for rentals (apartment-level in 120+ countries)
3. **Smarty** - Fastest, fewest restrictions

Implementation approach:

- Single address input with autocomplete
- Auto-populate all fields on selection
- Keep manual entry as fallback
- Validate against API on submit
