export interface Agent {
    id: number;
    name: string;
    email: string;
    phone?: string;
    profile_picture?: string;
    user_role: 'private_owner' | 'agent';
    company?: string;
    national_agency_id_number?: string;
    agency_website?: string;
    created_at: string;
    updated_at: string;
}

export interface Property {
    id: number;
    user_id: number;
    title: string;
    address: string;
    description?: string;
    image_url?: string;
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
}

export interface DashboardData {
    agent: Agent | null;
    properties: Property[];
}

export interface AgentFormData {
    name: string;
    email: string;
    phone?: string;
    profile_picture?: string;
    user_role: 'private_owner' | 'agent';
    company?: string;
    national_agency_id_number?: string;
    agency_website?: string;
}

export interface PropertyFormData {
    title: string;
    address: string;
    description?: string;
    image_url?: string;
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