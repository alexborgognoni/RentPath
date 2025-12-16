/**
 * Property Validation Schemas (Zod)
 *
 * Per-step Zod schemas for property validation.
 * Uses constraints and messages from the shared files.
 */

import { z } from 'zod';
import { PROPERTY_MESSAGES } from './property-messages';
import {
    CURRENCIES,
    ENERGY_CLASSES,
    HEATING_TYPES,
    PROPERTY_CONSTRAINTS,
    PROPERTY_TYPES,
    THERMAL_INSULATION_CLASSES,
    getCurrentYear,
    isValidSubtypeForType,
} from './property-validation';

// ============================================================================
// Step 1: Property Type Schema
// ============================================================================

export const propertyTypeSchema = z
    .object({
        type: z.enum([...PROPERTY_TYPES], {
            error: PROPERTY_MESSAGES.type.required,
        }),
        subtype: z.string().min(1, PROPERTY_MESSAGES.subtype.required),
    })
    .refine((data) => isValidSubtypeForType(data.type, data.subtype), {
        message: PROPERTY_MESSAGES.subtype.invalid,
        path: ['subtype'],
    });

// ============================================================================
// Step 2: Location Schema
// ============================================================================

export const locationSchema = z.object({
    house_number: z
        .string()
        .min(1, PROPERTY_MESSAGES.house_number.required)
        .max(PROPERTY_CONSTRAINTS.house_number.maxLength, PROPERTY_MESSAGES.house_number.maxLength),
    street_name: z
        .string()
        .min(1, PROPERTY_MESSAGES.street_name.required)
        .max(PROPERTY_CONSTRAINTS.street_name.maxLength, PROPERTY_MESSAGES.street_name.maxLength),
    street_line2: z.string().max(PROPERTY_CONSTRAINTS.street_line2.maxLength, PROPERTY_MESSAGES.street_line2.maxLength).optional().or(z.literal('')),
    city: z.string().min(1, PROPERTY_MESSAGES.city.required).max(PROPERTY_CONSTRAINTS.city.maxLength, PROPERTY_MESSAGES.city.maxLength),
    state: z.string().max(PROPERTY_CONSTRAINTS.state.maxLength, PROPERTY_MESSAGES.state.maxLength).optional().or(z.literal('')),
    postal_code: z
        .string()
        .min(1, PROPERTY_MESSAGES.postal_code.required)
        .max(PROPERTY_CONSTRAINTS.postal_code.maxLength, PROPERTY_MESSAGES.postal_code.maxLength),
    country: z.string().length(PROPERTY_CONSTRAINTS.country.length, PROPERTY_MESSAGES.country.length),
});

// ============================================================================
// Step 3: Specifications Schema
// ============================================================================

// Helper to handle nullable/optional numeric fields that may come as strings or empty strings
const coerceOptionalNullableNumber = (message: string) =>
    z.preprocess((val) => (val === '' || val === null || val === undefined ? null : Number(val)), z.number({ error: message }).nullable());

export const specificationsSchema = z.object({
    bedrooms: z.coerce
        .number({ error: PROPERTY_MESSAGES.bedrooms.integer })
        .int(PROPERTY_MESSAGES.bedrooms.integer)
        .min(PROPERTY_CONSTRAINTS.bedrooms.min, PROPERTY_MESSAGES.bedrooms.min)
        .max(PROPERTY_CONSTRAINTS.bedrooms.max, PROPERTY_MESSAGES.bedrooms.max),
    bathrooms: z.coerce
        .number({ error: PROPERTY_MESSAGES.bathrooms.number })
        .min(PROPERTY_CONSTRAINTS.bathrooms.min, PROPERTY_MESSAGES.bathrooms.min)
        .max(PROPERTY_CONSTRAINTS.bathrooms.max, PROPERTY_MESSAGES.bathrooms.max),
    size: coerceOptionalNullableNumber(PROPERTY_MESSAGES.size.number).pipe(
        z
            .number()
            .min(PROPERTY_CONSTRAINTS.size.min, PROPERTY_MESSAGES.size.min)
            .max(PROPERTY_CONSTRAINTS.size.max, PROPERTY_MESSAGES.size.max)
            .nullable(),
    ),
    floor_level: coerceOptionalNullableNumber(PROPERTY_MESSAGES.floor_level.integer).pipe(
        z
            .number()
            .int(PROPERTY_MESSAGES.floor_level.integer)
            .min(PROPERTY_CONSTRAINTS.floor_level.min, PROPERTY_MESSAGES.floor_level.min)
            .max(PROPERTY_CONSTRAINTS.floor_level.max, PROPERTY_MESSAGES.floor_level.max)
            .nullable(),
    ),
    has_elevator: z.boolean().optional(),
    year_built: coerceOptionalNullableNumber(PROPERTY_MESSAGES.year_built.integer).pipe(
        z
            .number()
            .int(PROPERTY_MESSAGES.year_built.integer)
            .min(PROPERTY_CONSTRAINTS.year_built.min, PROPERTY_MESSAGES.year_built.min)
            .max(getCurrentYear(), PROPERTY_MESSAGES.year_built.max)
            .nullable(),
    ),
    parking_spots_interior: z.coerce
        .number({ error: PROPERTY_MESSAGES.parking_spots_interior.integer })
        .int(PROPERTY_MESSAGES.parking_spots_interior.integer)
        .min(PROPERTY_CONSTRAINTS.parking_spots_interior.min, PROPERTY_MESSAGES.parking_spots_interior.min)
        .max(PROPERTY_CONSTRAINTS.parking_spots_interior.max, PROPERTY_MESSAGES.parking_spots_interior.max)
        .default(0),
    parking_spots_exterior: z.coerce
        .number({ error: PROPERTY_MESSAGES.parking_spots_exterior.integer })
        .int(PROPERTY_MESSAGES.parking_spots_exterior.integer)
        .min(PROPERTY_CONSTRAINTS.parking_spots_exterior.min, PROPERTY_MESSAGES.parking_spots_exterior.min)
        .max(PROPERTY_CONSTRAINTS.parking_spots_exterior.max, PROPERTY_MESSAGES.parking_spots_exterior.max)
        .default(0),
    balcony_size: coerceOptionalNullableNumber(PROPERTY_MESSAGES.balcony_size.number).pipe(
        z
            .number()
            .min(PROPERTY_CONSTRAINTS.balcony_size.min, PROPERTY_MESSAGES.balcony_size.min)
            .max(PROPERTY_CONSTRAINTS.balcony_size.max, PROPERTY_MESSAGES.balcony_size.max)
            .nullable(),
    ),
    land_size: coerceOptionalNullableNumber(PROPERTY_MESSAGES.land_size.number).pipe(
        z
            .number()
            .min(PROPERTY_CONSTRAINTS.land_size.min, PROPERTY_MESSAGES.land_size.min)
            .max(PROPERTY_CONSTRAINTS.land_size.max, PROPERTY_MESSAGES.land_size.max)
            .nullable(),
    ),
});

// ============================================================================
// Step 4: Amenities Schema
// ============================================================================

export const amenitiesSchema = z.object({
    kitchen_equipped: z.boolean().optional(),
    kitchen_separated: z.boolean().optional(),
    has_cellar: z.boolean().optional(),
    has_laundry: z.boolean().optional(),
    has_fireplace: z.boolean().optional(),
    has_air_conditioning: z.boolean().optional(),
    has_garden: z.boolean().optional(),
    has_rooftop: z.boolean().optional(),
});

// ============================================================================
// Step 5: Energy Schema (Optional Step)
// ============================================================================

export const energySchema = z.object({
    energy_class: z
        .enum([...ENERGY_CLASSES], {
            error: PROPERTY_MESSAGES.energy_class.invalid,
        })
        .optional()
        .nullable(),
    thermal_insulation_class: z
        .enum([...THERMAL_INSULATION_CLASSES], {
            error: PROPERTY_MESSAGES.thermal_insulation_class.invalid,
        })
        .optional()
        .nullable(),
    heating_type: z
        .enum([...HEATING_TYPES], {
            error: PROPERTY_MESSAGES.heating_type.invalid,
        })
        .optional()
        .nullable(),
});

// ============================================================================
// Step 6: Pricing Schema
// ============================================================================

export const pricingSchema = z.object({
    rent_amount: z.coerce
        .number({ error: PROPERTY_MESSAGES.rent_amount.number })
        .min(PROPERTY_CONSTRAINTS.rent_amount.min, PROPERTY_MESSAGES.rent_amount.min)
        .max(PROPERTY_CONSTRAINTS.rent_amount.max, PROPERTY_MESSAGES.rent_amount.max),
    rent_currency: z.enum([...CURRENCIES], {
        error: PROPERTY_MESSAGES.rent_currency.invalid,
    }),
    available_date: z
        .string()
        .optional()
        .nullable()
        .refine(
            (val) => {
                if (!val) return true;
                const date = new Date(val);
                if (isNaN(date.getTime())) return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date >= today;
            },
            { message: PROPERTY_MESSAGES.available_date.past },
        ),
});

// ============================================================================
// Step 7: Media Schema
// ============================================================================

export const mediaSchema = z.object({
    title: z.string().min(1, PROPERTY_MESSAGES.title.required).max(PROPERTY_CONSTRAINTS.title.maxLength, PROPERTY_MESSAGES.title.maxLength),
    description: z.string().max(PROPERTY_CONSTRAINTS.description.maxLength, PROPERTY_MESSAGES.description.maxLength).optional().or(z.literal('')),
});

// Note: Image validation is handled separately since File objects can't be easily validated with Zod
// and images are uploaded via FormData

// ============================================================================
// Combined Schema (for publish validation)
// ============================================================================

export const publishPropertySchema = propertyTypeSchema
    .merge(locationSchema)
    .merge(specificationsSchema)
    .merge(amenitiesSchema)
    .merge(energySchema)
    .merge(pricingSchema)
    .merge(mediaSchema);

// ============================================================================
// Draft Schema (relaxed validation for autosave)
// ============================================================================

// For drafts, we only require type and subtype (which are needed to create the draft)
// All numeric fields use coercion to handle string inputs from forms/database
export const draftPropertySchema = z.object({
    type: z.enum([...PROPERTY_TYPES]).optional(),
    subtype: z.string().optional(),
    // All other fields are optional for drafts
    house_number: z.string().max(PROPERTY_CONSTRAINTS.house_number.maxLength).optional().or(z.literal('')),
    street_name: z.string().max(PROPERTY_CONSTRAINTS.street_name.maxLength).optional().or(z.literal('')),
    street_line2: z.string().max(PROPERTY_CONSTRAINTS.street_line2.maxLength).optional().or(z.literal('')),
    city: z.string().max(PROPERTY_CONSTRAINTS.city.maxLength).optional().or(z.literal('')),
    state: z.string().max(PROPERTY_CONSTRAINTS.state.maxLength).optional().or(z.literal('')),
    postal_code: z.string().max(PROPERTY_CONSTRAINTS.postal_code.maxLength).optional().or(z.literal('')),
    country: z.string().max(PROPERTY_CONSTRAINTS.country.length).optional().or(z.literal('')),
    bedrooms: z.coerce.number().int().min(0).max(PROPERTY_CONSTRAINTS.bedrooms.max).optional(),
    bathrooms: z.coerce.number().min(0).max(PROPERTY_CONSTRAINTS.bathrooms.max).optional(),
    size: coerceOptionalNullableNumber('Must be a number').pipe(z.number().min(0).max(PROPERTY_CONSTRAINTS.size.max).nullable()),
    floor_level: coerceOptionalNullableNumber('Must be a number').pipe(z.number().int().nullable()),
    has_elevator: z.boolean().optional(),
    year_built: coerceOptionalNullableNumber('Must be a number').pipe(z.number().int().nullable()),
    parking_spots_interior: z.coerce.number().int().min(0).optional(),
    parking_spots_exterior: z.coerce.number().int().min(0).optional(),
    balcony_size: coerceOptionalNullableNumber('Must be a number').pipe(z.number().min(0).nullable()),
    land_size: coerceOptionalNullableNumber('Must be a number').pipe(z.number().min(0).nullable()),
    kitchen_equipped: z.boolean().optional(),
    kitchen_separated: z.boolean().optional(),
    has_cellar: z.boolean().optional(),
    has_laundry: z.boolean().optional(),
    has_fireplace: z.boolean().optional(),
    has_air_conditioning: z.boolean().optional(),
    has_garden: z.boolean().optional(),
    has_rooftop: z.boolean().optional(),
    energy_class: z
        .enum([...ENERGY_CLASSES])
        .optional()
        .nullable(),
    thermal_insulation_class: z
        .enum([...THERMAL_INSULATION_CLASSES])
        .optional()
        .nullable(),
    heating_type: z
        .enum([...HEATING_TYPES])
        .optional()
        .nullable(),
    rent_amount: z.coerce.number().min(0).optional(),
    rent_currency: z.enum([...CURRENCIES]).optional(),
    available_date: z.string().optional().nullable(),
    title: z.string().max(PROPERTY_CONSTRAINTS.title.maxLength).optional().or(z.literal('')),
    description: z.string().max(PROPERTY_CONSTRAINTS.description.maxLength).optional().or(z.literal('')),
});

// ============================================================================
// Step Schemas Map
// ============================================================================

export const STEP_SCHEMAS = {
    'property-type': propertyTypeSchema,
    location: locationSchema,
    specifications: specificationsSchema,
    amenities: amenitiesSchema,
    energy: energySchema,
    pricing: pricingSchema,
    media: mediaSchema,
    review: publishPropertySchema, // Review step uses full validation
} as const;

export type StepId = keyof typeof STEP_SCHEMAS;

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validate a specific step's data
 */
export function validateStep(stepId: StepId, data: unknown): { success: true } | { success: false; errors: Record<string, string> } {
    const schema = STEP_SCHEMAS[stepId];
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });

    return { success: false, errors };
}

/**
 * Validate a single field within a step
 */
export function validateField(stepId: StepId, field: string, value: unknown, allData: Record<string, unknown>): string | null {
    const schema = STEP_SCHEMAS[stepId];
    const dataWithField = { ...allData, [field]: value };
    const result = schema.safeParse(dataWithField);

    if (result.success) {
        return null;
    }

    const fieldError = result.error.issues.find((issue) => issue.path[0] === field);

    return fieldError?.message ?? null;
}

/**
 * Validate all data for publishing
 */
export function validateForPublish(data: unknown): { success: true } | { success: false; errors: Record<string, string> } {
    const result = publishPropertySchema.safeParse(data);

    if (result.success) {
        return { success: true };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });

    return { success: false, errors };
}

/**
 * Find the first invalid step index
 */
export function findFirstInvalidStep(data: unknown): number {
    const stepIds: StepId[] = ['property-type', 'location', 'specifications', 'amenities', 'energy', 'pricing', 'media'];

    for (let i = 0; i < stepIds.length; i++) {
        const result = validateStep(stepIds[i], data);
        if (!result.success) {
            return i;
        }
    }

    return stepIds.length; // All valid, return index of review step
}

// ============================================================================
// Type Exports
// ============================================================================

export type PropertyTypeData = z.infer<typeof propertyTypeSchema>;
export type LocationData = z.infer<typeof locationSchema>;
export type SpecificationsData = z.infer<typeof specificationsSchema>;
export type AmenitiesData = z.infer<typeof amenitiesSchema>;
export type EnergyData = z.infer<typeof energySchema>;
export type PricingData = z.infer<typeof pricingSchema>;
export type MediaData = z.infer<typeof mediaSchema>;
export type PublishPropertyData = z.infer<typeof publishPropertySchema>;
export type DraftPropertyData = z.infer<typeof draftPropertySchema>;
