/**
 * Property Validation Error Messages
 *
 * Single source of truth for all property validation error messages.
 * These messages must match the Laravel backend validation messages exactly.
 */

import { PROPERTY_CONSTRAINTS, getCurrentYear } from './property-validation';

// ============================================================================
// Error Messages
// ============================================================================

export const PROPERTY_MESSAGES = {
    // Step 1: Property Type
    type: {
        required: 'Property type is required',
        invalid: 'Please select a valid property type',
    },
    subtype: {
        required: 'Property subtype is required',
        invalid: 'Please select a valid subtype for the selected property type',
    },

    // Step 2: Location
    house_number: {
        required: 'House/building number is required',
        maxLength: `House number cannot exceed ${PROPERTY_CONSTRAINTS.house_number.maxLength} characters`,
    },
    street_name: {
        required: 'Street name is required',
        maxLength: `Street name cannot exceed ${PROPERTY_CONSTRAINTS.street_name.maxLength} characters`,
    },
    street_line2: {
        maxLength: `Address line 2 cannot exceed ${PROPERTY_CONSTRAINTS.street_line2.maxLength} characters`,
    },
    city: {
        required: 'City is required',
        maxLength: `City cannot exceed ${PROPERTY_CONSTRAINTS.city.maxLength} characters`,
    },
    state: {
        maxLength: `State/province cannot exceed ${PROPERTY_CONSTRAINTS.state.maxLength} characters`,
    },
    postal_code: {
        required: 'Postal code is required',
        maxLength: `Postal code cannot exceed ${PROPERTY_CONSTRAINTS.postal_code.maxLength} characters`,
    },
    country: {
        required: 'Country is required',
        invalid: 'Please select a valid country',
        length: 'Country code must be exactly 2 characters',
    },

    // Step 3: Specifications
    bedrooms: {
        required: 'Number of bedrooms is required',
        min: `Bedrooms cannot be less than ${PROPERTY_CONSTRAINTS.bedrooms.min}`,
        minHouse: 'Houses must have at least 1 bedroom',
        max: `Bedrooms cannot exceed ${PROPERTY_CONSTRAINTS.bedrooms.max}`,
        integer: 'Bedrooms must be a whole number',
    },
    bathrooms: {
        required: 'Number of bathrooms is required',
        min: `Bathrooms cannot be less than ${PROPERTY_CONSTRAINTS.bathrooms.min}`,
        minResidential: 'Residential properties must have at least 1 bathroom',
        max: `Bathrooms cannot exceed ${PROPERTY_CONSTRAINTS.bathrooms.max}`,
        number: 'Bathrooms must be a number',
    },
    size: {
        required: 'Living space size is required',
        min: 'Size must be greater than 0',
        max: `Size cannot exceed ${PROPERTY_CONSTRAINTS.size.max.toLocaleString()} sqm`,
        number: 'Size must be a valid number',
    },
    floor_level: {
        min: `Floor level cannot be less than ${PROPERTY_CONSTRAINTS.floor_level.min}`,
        max: `Floor level cannot exceed ${PROPERTY_CONSTRAINTS.floor_level.max}`,
        integer: 'Floor level must be a whole number',
    },
    year_built: {
        min: `Year built cannot be earlier than ${PROPERTY_CONSTRAINTS.year_built.min}`,
        max: `Year built cannot be later than ${getCurrentYear()}`,
        integer: 'Year must be a whole number',
    },
    parking_spots_interior: {
        min: `Interior parking spots cannot be less than ${PROPERTY_CONSTRAINTS.parking_spots_interior.min}`,
        max: `Interior parking spots cannot exceed ${PROPERTY_CONSTRAINTS.parking_spots_interior.max}`,
        integer: 'Parking spots must be a whole number',
    },
    parking_spots_exterior: {
        min: `Exterior parking spots cannot be less than ${PROPERTY_CONSTRAINTS.parking_spots_exterior.min}`,
        max: `Exterior parking spots cannot exceed ${PROPERTY_CONSTRAINTS.parking_spots_exterior.max}`,
        integer: 'Parking spots must be a whole number',
    },
    balcony_size: {
        min: 'Balcony size cannot be negative',
        max: `Balcony size cannot exceed ${PROPERTY_CONSTRAINTS.balcony_size.max.toLocaleString()} sqm`,
        number: 'Balcony size must be a valid number',
    },
    land_size: {
        min: 'Land size cannot be negative',
        max: `Land size cannot exceed ${PROPERTY_CONSTRAINTS.land_size.max.toLocaleString()} sqm`,
        number: 'Land size must be a valid number',
    },

    // Step 5: Energy
    energy_class: {
        invalid: 'Please select a valid energy class',
    },
    thermal_insulation_class: {
        invalid: 'Please select a valid thermal insulation class',
    },
    heating_type: {
        invalid: 'Please select a valid heating type',
    },

    // Step 6: Pricing
    rent_amount: {
        required: 'Rent amount is required',
        min: 'Rent amount must be greater than 0',
        max: `Rent amount cannot exceed ${PROPERTY_CONSTRAINTS.rent_amount.max.toLocaleString()}`,
        number: 'Rent amount must be a valid number',
    },
    rent_currency: {
        required: 'Currency is required',
        invalid: 'Please select a valid currency',
    },
    available_date: {
        invalid: 'Please enter a valid date',
        past: 'Available date must be today or in the future',
    },

    // Step 7: Media
    title: {
        required: 'Property title is required',
        maxLength: `Title cannot exceed ${PROPERTY_CONSTRAINTS.title.maxLength} characters`,
    },
    description: {
        maxLength: `Description cannot exceed ${PROPERTY_CONSTRAINTS.description.maxLength.toLocaleString()} characters`,
    },
    images: {
        required: 'At least one photo is required',
        minCount: 'At least one photo is required',
        maxCount: `You can upload a maximum of ${PROPERTY_CONSTRAINTS.images.maxCount} images`,
        maxSize: 'Each image must be less than 10MB',
        invalidType: 'Images must be JPEG, PNG, or WebP format',
    },
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type PropertyMessageKey = keyof typeof PROPERTY_MESSAGES;
export type PropertyMessages = typeof PROPERTY_MESSAGES;
