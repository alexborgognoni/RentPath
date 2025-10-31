export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    full_name: string; // Computed attribute
}

export interface PropertyManager {
    id: number;
    user_id: number;
    type: 'individual' | 'professional';
    company_name?: string;
    company_website?: string;
    license_number?: string;
    phone_number?: string;
    profile_picture_path?: string;
    id_document_path?: string;
    license_document_path?: string;
    profile_verified_at?: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Property {
    id: number;
    property_manager_id: number;
    title: string;
    house_number: string;
    street_name: string;
    street_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
    description?: string;
    type: 'apartment' | 'house' | 'room' | 'commercial' | 'industrial' | 'parking';
    subtype: 'studio' | 'loft' | 'duplex' | 'triplex' | 'penthouse' | 'serviced' | 'detached' | 'semi-detached' | 'villa' | 'bungalow' | 'private_room' | 'student_room' | 'co-living' | 'office' | 'retail' | 'warehouse' | 'factory' | 'garage' | 'indoor_spot' | 'outdoor_spot';
    // Property specifications
    bedrooms: number;
    bathrooms: number;
    parking_spots_interior: number;
    parking_spots_exterior: number;
    size?: number; // in square meters
    balcony_size?: number;
    land_size?: number; // only for houses
    floor_level?: number;
    has_elevator: boolean;
    year_built?: number;
    // Energy / building
    energy_class?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
    thermal_insulation_class?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
    heating_type?: 'gas' | 'electric' | 'district' | 'wood' | 'heat_pump' | 'other';
    // Kitchen
    kitchen_equipped: boolean;
    kitchen_separated: boolean;
    // Extras / amenities
    has_cellar: boolean;
    has_laundry: boolean;
    has_fireplace: boolean;
    has_air_conditioning: boolean;
    has_garden: boolean;
    has_rooftop: boolean;
    extras?: Record<string, any>; // JSON field for uncommon features
    // Rental information
    available_date?: string;
    rent_amount: number;
    rent_currency: 'eur' | 'usd' | 'gbp' | 'chf';
    // Property status
    status: 'inactive' | 'available' | 'application_received' | 'under_review' | 'visit_scheduled' | 'approved' | 'leased' | 'maintenance' | 'archived';
    tenant_count?: number; // This will be computed/added by backend
    created_at: string;
    updated_at: string;
    // Computed attributes
    formatted_rent?: string;
    formatted_size?: string;
    // Relationships
    property_manager?: PropertyManager;
    images?: PropertyImage[];
}

export interface PropertyImage {
    id: number;
    property_id: number;
    image_path: string;
    sort_order: number;
    is_main: boolean;
    created_at: string;
    updated_at: string;
    // Computed
    image_url?: string;
}

export interface DashboardData {
    user: User;
    propertyManager: PropertyManager | null;
    properties: Property[];
}

export interface PropertyManagerFormData {
    type: 'individual' | 'professional';
    company_name?: string;
    company_website?: string;
    license_number?: string;
    phone_number: string;
    profile_picture?: File;
    id_document?: File;
    license_document?: File;
}

export interface PropertyFormData {
    title: string;
    house_number: string;
    street_name: string;
    street_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
    description?: string;
    type: Property['type'];
    subtype: Property['subtype'];
    // Property specifications
    bedrooms: number;
    bathrooms: number;
    parking_spots_interior: number;
    parking_spots_exterior: number;
    size?: number; // in square meters
    balcony_size?: number;
    land_size?: number;
    floor_level?: number;
    has_elevator?: boolean;
    year_built?: number;
    // Energy / building
    energy_class?: Property['energy_class'];
    thermal_insulation_class?: Property['thermal_insulation_class'];
    heating_type?: Property['heating_type'];
    // Kitchen
    kitchen_equipped?: boolean;
    kitchen_separated?: boolean;
    // Extras / amenities
    has_cellar?: boolean;
    has_laundry?: boolean;
    has_fireplace?: boolean;
    has_air_conditioning?: boolean;
    has_garden?: boolean;
    has_rooftop?: boolean;
    extras?: Record<string, any>;
    // Rental information
    available_date?: string;
    rent_amount: number;
    rent_currency: Property['rent_currency'];
    // Images
    images?: File[];
    main_image_index?: number;
}

export interface TenantApplication {
    id: number;
    property_id: number;
    applicant_name: string;
    applicant_email: string;
    applicant_phone: string;
    monthly_income: number;
    employment_status: string;
    employer: string;
    move_in_date: string;
    application_status: 'pending' | 'approved' | 'rejected' | 'under_review';
    documents_uploaded: string[];
    notes?: string;
    created_at: string;
    updated_at: string;
}
