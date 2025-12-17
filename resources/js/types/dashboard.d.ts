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
    phone_country_code?: string;
    phone_number?: string;
    profile_picture_path?: string;
    profile_picture_url?: string;
    id_document_path?: string;
    id_document_original_name?: string;
    license_document_path?: string;
    license_document_original_name?: string;
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
    subtype:
        | 'studio'
        | 'loft'
        | 'duplex'
        | 'triplex'
        | 'penthouse'
        | 'serviced'
        | 'detached'
        | 'semi-detached'
        | 'villa'
        | 'bungalow'
        | 'private_room'
        | 'student_room'
        | 'co-living'
        | 'office'
        | 'retail'
        | 'warehouse'
        | 'factory'
        | 'garage'
        | 'indoor_spot'
        | 'outdoor_spot';
    // Property specifications
    bedrooms: number;
    bathrooms: number;
    parking_spots_interior: number;
    parking_spots_exterior: number;
    size?: number; // in square meters
    size_sqm?: number; // alias for size
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
    extras?: Record<string, unknown>; // JSON field for uncommon features
    // Rental information
    available_date?: string;
    available_from?: string; // alias for available_date
    rent_amount: number;
    rent_currency: 'eur' | 'usd' | 'gbp' | 'chf';
    utilities_included?: boolean;
    pets_allowed?: boolean;
    smoking_allowed?: boolean;
    // Property status
    status:
        | 'draft'
        | 'inactive'
        | 'available'
        | 'application_received'
        | 'under_review'
        | 'visit_scheduled'
        | 'approved'
        | 'leased'
        | 'maintenance'
        | 'archived';
    wizard_step?: number; // 1-indexed step for draft properties
    tenant_count?: number; // This will be computed/added by backend
    // Application access control and invite tokens
    requires_invite: boolean;
    default_token?: { token: string; used_count: number } | null;
    created_at: string;
    updated_at: string;
    // Computed attributes
    formatted_rent?: string;
    formatted_size?: string;
    main_image_url?: string;
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
    extras?: Record<string, unknown>;
    // Rental information
    available_date?: string;
    rent_amount: number;
    rent_currency: Property['rent_currency'];
    list_immediately: boolean;
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

export interface Application {
    id: number;
    property_id: number;
    tenant_profile_id: number;
    status:
        | 'draft'
        | 'submitted'
        | 'under_review'
        | 'visit_scheduled'
        | 'visit_completed'
        | 'approved'
        | 'rejected'
        | 'withdrawn'
        | 'leased'
        | 'archived';
    current_step: number;
    desired_move_in_date?: string;
    lease_duration_months?: number;
    message_to_landlord?: string;
    additional_occupants?: number;
    occupants_details?: { name: string; age: string; relationship: string; relationship_other: string }[];
    has_pets?: boolean;
    pets_details?: string;
    is_smoker?: boolean;
    has_vehicle?: boolean;
    vehicle_details?: string;
    special_requests?: string;
    employer_name?: string;
    employer_phone?: string;
    job_title?: string;
    monthly_income?: number;
    employment_start_date?: string;
    employment_type?: string;
    proof_of_income_path?: string;
    proof_of_employment_path?: string;
    invited_via_token?: string;
    submitted_at?: string;
    reviewed_at?: string;
    visit_scheduled_at?: string;
    visit_completed_at?: string;
    decision_at?: string;
    withdrawn_at?: string;
    leased_at?: string;
    archived_at?: string;
    created_at: string;
    updated_at: string;
    // Relationships
    property?: Property;
}
