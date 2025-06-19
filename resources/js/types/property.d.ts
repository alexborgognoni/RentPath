// property-globals.d.ts (or any name, as long as it's included in tsconfig)

export type OccupancyStatus = 'Occupied' | 'Vacant' | 'Under Maintenance';

export type PropertyType =
    | 'House'
    | 'Detached House'
    | 'Semi‑detached House'
    | 'Apartment'
    | 'Studio'
    | 'Penthouse'
    | 'Duplex'
    | 'Triplex'
    | 'Loft'
    | 'Garage'
    | 'Office';

export interface Property {
    id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;

    latitude: number | null;
    longitude: number | null;

    occupancy_status: OccupancyStatus;
    rent_amount: number;
    security_deposit: number | null;
    available_from: string;
    lease_term_months: number | null;

    property_type: PropertyType;
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

    cover_image_url: string | null;
    photo_gallery: string[];
    virtual_tour_url: string | null;

    is_visible: boolean;
    is_active: boolean;
    is_invite_only: boolean;
    access_code: string | null;

    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: string;
    updated_by: string;

    [key: string]: unknown;
}
