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
    title: string;
    address: string;
    city: string;
    rent_amount: number;
    bedrooms?: number;
    bathrooms?: number;
    square_meters?: number;
    apartment_image?: string;
    invite_token: string;
    tenant_count: number;
    created_at: string;
    updated_at: string;
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
    city: string;
    rent_amount: number;
    bedrooms?: number;
    bathrooms?: number;
    square_meters?: number;
    apartment_image?: string;
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