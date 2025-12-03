/**
 * Property Validation Constraints
 *
 * Single source of truth for all property validation constraints.
 * These values should match the Laravel backend validation rules exactly.
 */

// ============================================================================
// Property Types & Subtypes
// ============================================================================

export const PROPERTY_TYPES = ['apartment', 'house', 'room', 'commercial', 'industrial', 'parking'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_SUBTYPES = {
    apartment: ['studio', 'loft', 'duplex', 'triplex', 'penthouse', 'serviced'] as const,
    house: ['detached', 'semi-detached', 'villa', 'bungalow'] as const,
    room: ['private_room', 'student_room', 'co-living'] as const,
    commercial: ['office', 'retail'] as const,
    industrial: ['warehouse', 'factory'] as const,
    parking: ['garage', 'indoor_spot', 'outdoor_spot'] as const,
} as const;

export type PropertySubtype = (typeof PROPERTY_SUBTYPES)[PropertyType][number];

export const ALL_SUBTYPES = Object.values(PROPERTY_SUBTYPES).flat();

// ============================================================================
// Energy & Building
// ============================================================================

export const ENERGY_CLASSES = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export type EnergyClass = (typeof ENERGY_CLASSES)[number];

export const THERMAL_INSULATION_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export type ThermalInsulationClass = (typeof THERMAL_INSULATION_CLASSES)[number];

export const HEATING_TYPES = ['gas', 'electric', 'district', 'wood', 'heat_pump', 'other'] as const;
export type HeatingType = (typeof HEATING_TYPES)[number];

// ============================================================================
// Currency
// ============================================================================

export const CURRENCIES = ['eur', 'usd', 'gbp', 'chf'] as const;
export type Currency = (typeof CURRENCIES)[number];

// ============================================================================
// Countries (ISO 3166-1 alpha-2 codes - commonly used)
// ============================================================================

export const COUNTRIES = ['AT', 'BE', 'CH', 'DE', 'ES', 'FR', 'GB', 'IE', 'IT', 'LU', 'NL', 'PT', 'US'] as const;
export type Country = (typeof COUNTRIES)[number];

// ============================================================================
// Validation Constraints
// ============================================================================

export const PROPERTY_CONSTRAINTS = {
    // Step 1: Property Type
    type: {
        required: true,
        values: PROPERTY_TYPES,
    },
    subtype: {
        required: true,
        values: ALL_SUBTYPES,
    },

    // Step 2: Location
    house_number: {
        required: true,
        maxLength: 20,
    },
    street_name: {
        required: true,
        maxLength: 255,
    },
    street_line2: {
        required: false,
        maxLength: 255,
    },
    city: {
        required: true,
        maxLength: 100,
    },
    state: {
        required: false,
        maxLength: 100,
    },
    postal_code: {
        required: true,
        maxLength: 20,
    },
    country: {
        required: true,
        length: 2,
    },

    // Step 3: Specifications
    bedrooms: {
        required: true,
        min: 0,
        max: 20,
    },
    bathrooms: {
        required: true,
        min: 0,
        max: 10,
    },
    size: {
        required: false,
        min: 1,
        max: 100000,
    },
    floor_level: {
        required: false,
        min: -10,
        max: 200,
    },
    has_elevator: {
        required: false,
    },
    year_built: {
        required: false,
        min: 1800,
        maxFn: () => new Date().getFullYear(),
    },
    parking_spots_interior: {
        required: false,
        min: 0,
        max: 20,
    },
    parking_spots_exterior: {
        required: false,
        min: 0,
        max: 20,
    },
    balcony_size: {
        required: false,
        min: 0,
        max: 10000,
    },
    land_size: {
        required: false,
        min: 0,
        max: 1000000,
    },

    // Step 4: Amenities (all optional booleans)
    kitchen_equipped: { required: false },
    kitchen_separated: { required: false },
    has_cellar: { required: false },
    has_laundry: { required: false },
    has_fireplace: { required: false },
    has_air_conditioning: { required: false },
    has_garden: { required: false },
    has_rooftop: { required: false },

    // Step 5: Energy (all optional)
    energy_class: {
        required: false,
        values: ENERGY_CLASSES,
    },
    thermal_insulation_class: {
        required: false,
        values: THERMAL_INSULATION_CLASSES,
    },
    heating_type: {
        required: false,
        values: HEATING_TYPES,
    },

    // Step 6: Pricing
    rent_amount: {
        required: true,
        min: 0.01,
        max: 999999.99,
    },
    rent_currency: {
        required: true,
        values: CURRENCIES,
    },
    available_date: {
        required: false,
    },

    // Step 7: Media
    title: {
        required: true,
        maxLength: 255,
    },
    description: {
        required: false,
        maxLength: 10000,
    },
    images: {
        required: false,
        maxCount: 20,
        maxSizeBytes: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a subtype is valid for a given property type
 */
export function isValidSubtypeForType(type: PropertyType, subtype: string): boolean {
    const validSubtypes = PROPERTY_SUBTYPES[type];
    return validSubtypes.includes(subtype as (typeof validSubtypes)[number]);
}

/**
 * Get valid subtypes for a property type
 */
export function getSubtypesForType(type: PropertyType): readonly string[] {
    return PROPERTY_SUBTYPES[type] || [];
}

/**
 * Get the current year for year_built validation
 */
export function getCurrentYear(): number {
    return new Date().getFullYear();
}
