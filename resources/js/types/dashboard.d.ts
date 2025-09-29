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
    image_url?: string;
    image_path?: string;
    type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio' | 'loft' | 'room' | 'office' | 'garage' | 'storage' | 'warehouse' | 'retail' | 'commercial';
    bedrooms: number;
    bathrooms: number;
    parking_spots: number;
    size?: number;
    size_unit: 'square_meters' | 'square_feet';
    available_date?: string;
    rent_amount: number;
    rent_currency: 'eur' | 'usd' | 'gbp' | 'chf';
    invite_token: string;
    is_active: boolean;
    tenant_count?: number; // This will be computed/added by backend
    created_at: string;
    updated_at: string;
    // Computed attributes
    formatted_rent?: string;
    formatted_size?: string;
    // Relationships
    property_manager?: PropertyManager;
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
    image_url?: string;
    image_path?: string;
    type: Property['type'];
    bedrooms: number;
    bathrooms: number;
    parking_spots: number;
    size?: number;
    size_unit: Property['size_unit'];
    available_date?: string;
    rent_amount: number;
    rent_currency: Property['rent_currency'];
    is_active?: boolean;
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
