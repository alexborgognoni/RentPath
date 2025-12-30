export interface Auth {
    user: User;
}

// Re-export commonly used types from dashboard.d.ts for convenience
export type { Lead, Property } from '@/types/dashboard';

export interface BreadcrumbItem {
    title: string;
    href?: string; // Optional - current page doesn't have a link
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    subdomain: string | null; // Current subdomain (e.g., 'manager') or null (root domain)
    managerSubdomain: string; // The configured manager subdomain prefix (from MANAGER_SUBDOMAIN env)
    appUrlScheme: string; // http or https - for URL generation only, not actual encryption (from APP_URL_SCHEME env)
    appDomain: string; // The base domain (e.g., 'rentpath.app' or 'rentpath.test')
    appPort: string | null; // Optional port (e.g., '8000' for local, null for production)
    locale: string;
    translations: Translations;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string; // Computed: first_name + last_name
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    property_manager?: {
        id: number;
        profile_picture_path?: string;
        profile_picture_url?: string;
        [key: string]: unknown;
    };
    tenant_profile?: TenantProfile;
    [key: string]: unknown; // This allows for additional properties...
}

export interface TenantProfile {
    id: number;
    user_id: number;

    // Relationship to user (loaded when eager-loaded)
    user?: {
        id: number;
        first_name?: string;
        last_name?: string;
        email: string;
        full_name?: string;
    };

    // Personal information
    date_of_birth: string;
    nationality: string;
    phone_country_code: string;
    phone_number: string;

    // Current address
    current_house_number: string;
    current_address_line_2?: string;
    current_street_name: string;
    current_city: string;
    current_state_province?: string;
    current_postal_code: string;
    current_country: string;

    // Employment
    employment_status: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'retired';
    employer_name?: string;
    job_title?: string;
    employment_start_date?: string;
    employment_type?: 'full_time' | 'part_time' | 'contract' | 'temporary';
    monthly_income?: number;
    income_currency: 'eur' | 'usd' | 'gbp' | 'chf';
    employer_contact_name?: string;
    employer_contact_phone?: string;
    employer_contact_email?: string;

    // Student info
    university_name?: string;
    program_of_study?: string;
    expected_graduation_date?: string;
    student_income_source?: string;

    // Guarantor - Basic Info
    has_guarantor: boolean;
    guarantor_first_name?: string;
    guarantor_last_name?: string;
    guarantor_relationship?: string;
    guarantor_relationship_other?: string;
    guarantor_phone_country_code?: string;
    guarantor_phone_number?: string;
    guarantor_email?: string;
    guarantor_street_name?: string;
    guarantor_house_number?: string;
    guarantor_address_line_2?: string;
    guarantor_city?: string;
    guarantor_state_province?: string;
    guarantor_postal_code?: string;
    guarantor_country?: string;
    // Guarantor - Employment
    guarantor_employment_status?: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'retired';
    guarantor_employer_name?: string;
    guarantor_job_title?: string;
    guarantor_employment_type?: 'full_time' | 'part_time' | 'contract' | 'temporary';
    guarantor_employment_start_date?: string;
    guarantor_monthly_income?: number;
    guarantor_income_currency?: string;
    // Guarantor - Student Info
    guarantor_university_name?: string;
    guarantor_program_of_study?: string;
    guarantor_expected_graduation_date?: string;
    guarantor_student_income_source?: string;

    // Documents
    id_document_front_path?: string;
    id_document_front_original_name?: string;
    id_document_back_path?: string;
    id_document_back_original_name?: string;
    employment_contract_path?: string;
    employment_contract_original_name?: string;
    payslip_1_path?: string;
    payslip_1_original_name?: string;
    payslip_2_path?: string;
    payslip_2_original_name?: string;
    payslip_3_path?: string;
    payslip_3_original_name?: string;
    student_proof_path?: string;
    student_proof_original_name?: string;
    other_income_proof_path?: string;
    other_income_proof_original_name?: string;
    // Guarantor Documents
    guarantor_id_front_path?: string;
    guarantor_id_front_original_name?: string;
    guarantor_id_back_path?: string;
    guarantor_id_back_original_name?: string;
    guarantor_proof_income_path?: string;
    guarantor_proof_income_original_name?: string;
    guarantor_employment_contract_path?: string;
    guarantor_employment_contract_original_name?: string;
    guarantor_payslip_1_path?: string;
    guarantor_payslip_1_original_name?: string;
    guarantor_payslip_2_path?: string;
    guarantor_payslip_2_original_name?: string;
    guarantor_payslip_3_path?: string;
    guarantor_payslip_3_original_name?: string;
    guarantor_student_proof_path?: string;
    guarantor_student_proof_original_name?: string;
    guarantor_other_income_proof_path?: string;
    guarantor_other_income_proof_original_name?: string;
    reference_letter_path?: string;
    reference_letter_original_name?: string;
    profile_picture_path?: string;

    // Emergency contact
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;

    // Preferences
    preferred_move_in_date?: string;
    occupants_count: number;
    has_pets: boolean;
    pets_description?: string;
    is_smoker: boolean;

    // Verification
    profile_verified_at?: string;
    verification_rejection_reason?: string;
    verification_rejected_fields?: string[];

    // Timestamps
    created_at: string;
    updated_at: string;

    // Computed
    age?: number;
    profile_picture_url?: string;
    id_document_front_url?: string;
    id_document_back_url?: string;
    employment_contract_url?: string;
    payslip_1_url?: string;
    payslip_2_url?: string;
    payslip_3_url?: string;
    student_proof_url?: string;
    other_income_proof_url?: string;
    // Guarantor computed URLs
    guarantor_full_name?: string;
    guarantor_id_front_url?: string;
    guarantor_id_back_url?: string;
    guarantor_proof_income_url?: string;
    guarantor_employment_contract_url?: string;
    guarantor_payslip_1_url?: string;
    guarantor_payslip_2_url?: string;
    guarantor_payslip_3_url?: string;
    guarantor_student_proof_url?: string;
    guarantor_other_income_proof_url?: string;
    documents_metadata?: Record<string, { size?: number; lastModified?: number } | null>;
}

export interface Application {
    id: number;
    property_id: number;
    tenant_profile_id: number;
    user_id?: number;

    // Status
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
        | 'archived'
        | 'deleted';

    // Application details
    desired_move_in_date: string;
    lease_duration_months: number;
    message_to_landlord?: string;

    // Occupants
    additional_occupants: number;
    occupants_details?: Array<{
        name: string;
        age: number;
        relationship: string;
    }>;

    // Pets
    has_pets: boolean;
    pets_details?: Array<{
        type: string;
        breed?: string;
        age?: number;
        weight?: number;
    }>;

    // References
    references?: Array<{
        name: string;
        phone: string;
        email: string;
        relationship: string;
        years_known: number;
    }>;

    // Previous landlord
    previous_landlord_name: string;
    previous_landlord_phone: string;
    previous_landlord_email: string;

    // Emergency contact
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;

    // Documents
    application_id_document_path?: string;
    application_id_document_original_name?: string;
    application_proof_of_income_path?: string;
    application_proof_of_income_original_name?: string;
    application_reference_letter_path?: string;
    application_reference_letter_original_name?: string;
    additional_documents?: Array<{
        path: string;
        original_name: string;
        type: string;
        description?: string;
    }>;

    // Review & decision
    rejection_reason?: string;
    rejection_details?: Record<string, unknown>;
    reviewed_by_user_id?: number;
    reviewed_at?: string;

    // Visit
    visit_scheduled_at?: string;
    visit_notes?: string;
    visit_completed_at?: string;

    // Approval
    approved_by_user_id?: number;
    approved_at?: string;
    approval_notes?: string;

    // Lease
    lease_start_date?: string;
    lease_end_date?: string;
    agreed_rent_amount?: number;
    deposit_amount?: number;
    lease_document_path?: string;
    lease_document_original_name?: string;
    lease_signed_at?: string;

    // Status timestamps
    submitted_at?: string;
    withdrawn_at?: string;
    archived_at?: string;

    // Token
    invited_via_token?: string;

    // Internal
    internal_notes?: string;

    // Snapshot fields (frozen profile data at submission)
    snapshot_employment_status?: string;
    snapshot_employer_name?: string;
    snapshot_job_title?: string;
    snapshot_employment_start_date?: string;
    snapshot_employment_type?: string;
    snapshot_monthly_income?: number;
    snapshot_income_currency?: string;
    snapshot_current_house_number?: string;
    snapshot_current_address_line_2?: string;
    snapshot_current_street_name?: string;
    snapshot_current_city?: string;
    snapshot_current_state_province?: string;
    snapshot_current_postal_code?: string;
    snapshot_current_country?: string;
    snapshot_university_name?: string;
    snapshot_program_of_study?: string;
    snapshot_expected_graduation_date?: string;
    snapshot_has_guarantor?: boolean;
    snapshot_guarantor_name?: string;
    snapshot_guarantor_relationship?: string;
    snapshot_guarantor_monthly_income?: number;
    snapshot_id_document_front_path?: string;
    snapshot_id_document_back_path?: string;
    snapshot_employment_contract_path?: string;
    snapshot_payslip_1_path?: string;
    snapshot_payslip_2_path?: string;
    snapshot_payslip_3_path?: string;
    snapshot_student_proof_path?: string;
    snapshot_other_income_proof_path?: string;
    snapshot_guarantor_id_path?: string;
    snapshot_guarantor_proof_income_path?: string;

    // Document URLs (generated by backend)
    snapshot_id_document_front_url?: string;
    snapshot_id_document_back_url?: string;
    snapshot_employment_contract_url?: string;
    snapshot_payslip_1_url?: string;
    snapshot_payslip_2_url?: string;
    snapshot_payslip_3_url?: string;
    snapshot_student_proof_url?: string;
    snapshot_other_income_proof_url?: string;
    snapshot_guarantor_id_url?: string;
    snapshot_guarantor_proof_income_url?: string;
    application_id_document_url?: string;
    application_proof_of_income_url?: string;
    application_reference_letter_url?: string;

    // Timestamps
    created_at: string;
    updated_at: string;

    // Computed
    status_text?: string;
    total_occupants?: number;

    // Relationships
    property?: import('@/types/dashboard').Property;
    tenant_profile?: TenantProfile;
}
