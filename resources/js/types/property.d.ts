// type OccupancyStatus = 'Occupied' | 'Vacant' | 'Under Maintenance';
// type PropertyType = 'Apartment' | 'House' | 'Condo' | 'Townhouse';

export interface Property ***REMOVED***
    id: string;

    // Core Info
    title: string;
    description: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;

    // Location
    latitude: number | null;
    longitude: number | null;

    // Rent & Availability
    rent_amount: number;
    security_deposit: number | null;
    available_from: string; // ISO date string (e.g. '2025-07-01')
    lease_term_months: number | null;

    // Property Details
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    square_meters: number;
    floor_number: number | null;
    total_floors: number | null;
    year_built: number | null;
    furnished: boolean;
    pets_allowed: boolean;
    smoking_allowed: boolean;
    indoor_parking_spots: number;
    outdoor_parking_spots: number;
    heating_type: string;
    energy_class: string;

    // Media
    cover_image_url: string | null;
    photo_gallery: string[] | null; // JSON field (array of image URLs)
    virtual_tour_url: string | null;

    // Visibility & Access
    is_visible: boolean;
    is_active: boolean;
    is_invite_only: boolean;
    access_code: string | null;

    // Timestamps & Auditing
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
    deleted_at: string | null;
    created_by: string;
    updated_by: string;
***REMOVED***
