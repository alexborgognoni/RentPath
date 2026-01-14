declare namespace App.Data.Application {
    export type ApplicationData = {
        id: number | null;
        property_id: number | null;
        tenant_profile_id: number | null;
        status: App.Enums.ApplicationStatus;
        current_step: number;
        household: App.Data.Application.HouseholdData;
        emergency_contact: App.Data.Application.EmergencyContactData | null;
        co_signers: Array<App.Data.Application.CoSignerData> | null;
        guarantors: Array<App.Data.Application.GuarantorData> | null;
        consent: App.Data.Application.ConsentData | null;
        additional_information: string | null;
        rejection_reason: string | null;
        rejection_details: Record<string, unknown> | null;
        reviewed_by_user_id: number | null;
        reviewed_at: string | null;
        visit_scheduled_at: string | null;
        visit_notes: string | null;
        visit_completed_at: string | null;
        approved_by_user_id: number | null;
        approved_at: string | null;
        approval_notes: string | null;
        lease_start_date: string | null;
        lease_end_date: string | null;
        agreed_rent_amount: number | null;
        deposit_amount: number | null;
        submitted_at: string | null;
        withdrawn_at: string | null;
        archived_at: string | null;
        invited_via_token: string | null;
        internal_notes: string | null;
        created_at: string | null;
        updated_at: string | null;
        property: App.Data.Property.PropertyData | null;
        tenant_profile: App.Data.TenantProfile.TenantProfileData | null;
    };
    export type CoSignerData = {
        id: number | null;
        application_id: number | null;
        first_name: string;
        last_name: string;
        relationship: App.Enums.Relationship;
        relationship_other: string | null;
        phone: App.Data.Shared.PhoneData;
        email: string;
        address: App.Data.Shared.AddressData;
        employment_status: App.Enums.EmploymentStatus;
        employer_name: string | null;
        job_title: string | null;
        monthly_income: number | null;
        income_currency: App.Enums.Currency | null;
        university_name: string | null;
        program_of_study: string | null;
        expected_graduation_date: string | null;
        student_income_source: string | null;
        id_front: App.Data.Shared.DocumentData | null;
        id_back: App.Data.Shared.DocumentData | null;
        proof_of_income: App.Data.Shared.DocumentData | null;
        student_proof: App.Data.Shared.DocumentData | null;
        created_at: string | null;
        updated_at: string | null;
    };
    export type ConsentData = {
        declaration_accuracy_at: string | null;
        consent_screening_at: string | null;
        consent_data_processing_at: string | null;
        consent_reference_contact_at: string | null;
        consent_data_sharing_at: string | null;
        consent_marketing_at: string | null;
        digital_signature: string | null;
        signature_ip_address: string | null;
    };
    export type EmergencyContactData = {
        first_name: string;
        last_name: string;
        phone: App.Data.Shared.PhoneData;
        email: string | null;
        relationship: App.Enums.Relationship;
        relationship_other: string | null;
    };
    export type GuarantorData = {
        id: number | null;
        application_id: number | null;
        first_name: string;
        last_name: string;
        relationship: App.Enums.Relationship;
        relationship_other: string | null;
        phone: App.Data.Shared.PhoneData;
        email: string;
        address: App.Data.Shared.AddressData;
        employment_status: App.Enums.EmploymentStatus;
        employer_name: string | null;
        job_title: string | null;
        monthly_income: number;
        income_currency: App.Enums.Currency;
        university_name: string | null;
        program_of_study: string | null;
        expected_graduation_date: string | null;
        student_income_source: string | null;
        id_front: App.Data.Shared.DocumentData | null;
        id_back: App.Data.Shared.DocumentData | null;
        proof_of_income: App.Data.Shared.DocumentData | null;
        student_proof: App.Data.Shared.DocumentData | null;
        other_income_proof: App.Data.Shared.DocumentData | null;
        created_at: string | null;
        updated_at: string | null;
    };
    export type HouseholdData = {
        desired_move_in_date: string;
        lease_duration_months: number;
        is_flexible_on_move_in: boolean | null;
        is_flexible_on_duration: boolean | null;
        additional_occupants: number;
        occupants_details: Array<App.Data.Application.OccupantData> | null;
        has_pets: boolean;
        pets_details: Array<App.Data.Application.PetData> | null;
        message_to_landlord: string | null;
    };
    export type OccupantData = {
        name: string;
        age: number;
        relationship: App.Enums.Relationship;
        relationship_other: string | null;
    };
    export type PetData = {
        type: string;
        breed: string | null;
        age: number | null;
        weight: number | null;
        description: string | null;
    };
}
declare namespace App.Data.Lead {
    export type LeadData = {
        id: number | null;
        property_id: number | null;
        email: string;
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
        token: string;
        source: App.Enums.LeadSource;
        status: App.Enums.LeadStatus;
        user_id: number | null;
        application_id: number | null;
        invite_token_id: number | null;
        invited_at: string | null;
        viewed_at: string | null;
        notes: string | null;
        created_at: string | null;
        updated_at: string | null;
        property: App.Data.Property.PropertyData | null;
        user: App.Data.User.UserData | null;
        application: App.Data.Application.ApplicationData | null;
    };
}
declare namespace App.Data.Messaging {
    export type ConversationData = {
        id: number | null;
        property_id: number;
        tenant_profile_id: number;
        application_id: number | null;
        last_message_at: string | null;
        tenant_unread_count: number | null;
        manager_unread_count: number | null;
        created_at: string | null;
        updated_at: string | null;
        messages: Array<App.Data.Messaging.MessageData> | null;
    };
    export type MessageAttachmentData = {
        id: number | null;
        message_id: number;
        file_path: string;
        original_name: string;
        mime_type: string | null;
        file_size: number | null;
        file_url: string | null;
        created_at: string | null;
        updated_at: string | null;
    };
    export type MessageData = {
        id: number | null;
        conversation_id: number;
        sender_type: App.Enums.ParticipantType;
        sender_id: number;
        content: string;
        read_at: string | null;
        created_at: string | null;
        updated_at: string | null;
        attachments: Array<App.Data.Messaging.MessageAttachmentData> | null;
    };
}
declare namespace App.Data.Property {
    export type PropertyData = {
        id: number | null;
        property_manager_id: number | null;
        title: string;
        address: App.Data.Shared.AddressData;
        description: string | null;
        type: string;
        subtype: string;
        specs: App.Data.Property.PropertySpecsData;
        available_date: string | null;
        rent_amount: number;
        rent_currency: App.Enums.Currency;
        pets_allowed: boolean | null;
        smoking_allowed: boolean | null;
        status: App.Enums.PropertyStatus;
        wizard_step: number | null;
        visibility: string;
        accepting_applications: boolean;
        application_access: string;
        funnel_stage: string | null;
        main_image_url: string | null;
        created_at: string | null;
        updated_at: string | null;
        property_manager: App.Data.PropertyManager.PropertyManagerData | null;
        images: Array<App.Data.Property.PropertyImageData> | null;
    };
    export type PropertyImageData = {
        id: number | null;
        property_id: number | null;
        image_path: string;
        sort_order: number;
        is_main: boolean;
        image_url: string | null;
        created_at: string | null;
        updated_at: string | null;
    };
    export type PropertySpecsData = {
        bedrooms: number;
        bathrooms: number;
        parking_spots_interior: number;
        parking_spots_exterior: number;
        size: number | null;
        size_unit: string | null;
        balcony_size: number | null;
        land_size: number | null;
        floor_level: number | null;
        has_elevator: boolean;
        year_built: number | null;
        energy_class: string | null;
        thermal_insulation_class: string | null;
        heating_type: string | null;
        kitchen_equipped: boolean;
        kitchen_separated: boolean;
        has_cellar: boolean;
        has_laundry: boolean;
        has_fireplace: boolean;
        has_air_conditioning: boolean;
        has_garden: boolean;
        has_rooftop: boolean;
        extras: Record<string, unknown> | null;
    };
}
declare namespace App.Data.PropertyManager {
    export type PropertyManagerData = {
        id: number | null;
        user_id: number | null;
        type: string;
        company_name: string | null;
        company_website: string | null;
        license_number: string | null;
        phone: App.Data.Shared.PhoneData | null;
        profile_picture: App.Data.Shared.DocumentData | null;
        id_document: App.Data.Shared.DocumentData | null;
        license_document: App.Data.Shared.DocumentData | null;
        profile_verified_at: string | null;
        created_at: string | null;
        updated_at: string | null;
        user: App.Data.User.UserData | null;
    };
}
declare namespace App.Data.Shared {
    export type AddressData = {
        house_number: string;
        street_name: string;
        address_line_2: string | null;
        city: string;
        state_province: string | null;
        postal_code: string;
        country: string;
    };
    export type DocumentData = {
        path: string;
        original_name: string | null;
        url: string | null;
    };
    export type IdDocumentData = {
        type: App.Enums.IdDocumentType;
        number: string;
        issuing_country: string;
        expiry_date: string;
        front: App.Data.Shared.DocumentData | null;
        back: App.Data.Shared.DocumentData | null;
    };
    export type PhoneData = {
        country_code: string;
        number: string;
    };
}
declare namespace App.Data.TenantProfile {
    export type AdditionalIncomeData = {
        source_type: string;
        description: string | null;
        monthly_amount: number;
    };
    export type EmploymentData = {
        employment_status: App.Enums.EmploymentStatus;
        employer_name: string | null;
        job_title: string | null;
        employment_start_date: string | null;
        employment_end_date: string | null;
        probation_end_date: string | null;
        employment_type: App.Enums.EmploymentType | null;
        employment_contract_type: string | null;
        business_name: string | null;
        business_type: string | null;
        business_registration_number: string | null;
        business_start_date: string | null;
        monthly_income: number | null;
        net_monthly_income: number | null;
        gross_annual_income: number | null;
        gross_annual_revenue: number | null;
        income_currency: App.Enums.Currency;
        pay_frequency: string | null;
        employer_contact_name: string | null;
        employer_contact_phone: App.Data.Shared.PhoneData | null;
        employer_contact_email: string | null;
        employer_address: string | null;
        has_additional_income: boolean | null;
        additional_income_sources: Array<App.Data.TenantProfile.AdditionalIncomeData> | null;
        employment_contract: App.Data.Shared.DocumentData | null;
        payslip_1: App.Data.Shared.DocumentData | null;
        payslip_2: App.Data.Shared.DocumentData | null;
        payslip_3: App.Data.Shared.DocumentData | null;
        tax_returns: Array<App.Data.Shared.DocumentData> | null;
        bank_statements: Array<App.Data.Shared.DocumentData> | null;
        business_bank_statements: Array<App.Data.Shared.DocumentData> | null;
    };
    export type IdentityData = {
        date_of_birth: string;
        middle_name: string | null;
        nationality: string;
        phone: App.Data.Shared.PhoneData;
        bio: string | null;
        id_document: App.Data.Shared.IdDocumentData;
        immigration_status: App.Enums.ImmigrationStatus | null;
        immigration_status_other: string | null;
        visa_type: string | null;
        visa_type_other: string | null;
        visa_expiry_date: string | null;
        work_permit_number: string | null;
        right_to_rent_share_code: string | null;
        current_address: App.Data.Shared.AddressData;
    };
    export type PreviousAddressData = {
        address: App.Data.Shared.AddressData;
        move_in_date: string;
        move_out_date: string;
        landlord_name: string | null;
        landlord_contact: string | null;
        reason_for_leaving: string | null;
    };
    export type ReferenceData = {
        first_name: string;
        last_name: string;
        relationship: App.Enums.Relationship;
        relationship_other: string | null;
        phone: string;
        email: string | null;
        years_known: number | null;
    };
    export type RentalHistoryData = {
        current_living_situation: App.Enums.LivingSituation;
        current_address_move_in_date: string | null;
        current_monthly_rent: number | null;
        current_rent_currency: string | null;
        current_landlord_name: string | null;
        current_landlord_contact: string | null;
        reason_for_moving: App.Enums.ReasonForMoving;
        reason_for_moving_other: string | null;
        previous_addresses: Array<App.Data.TenantProfile.PreviousAddressData> | null;
        landlord_references: Array<App.Data.TenantProfile.ReferenceData> | null;
        other_references: Array<App.Data.TenantProfile.ReferenceData> | null;
        authorize_credit_check: boolean | null;
        authorize_background_check: boolean | null;
        credit_check_provider_preference: string | null;
        has_ccjs_or_bankruptcies: boolean | null;
        ccj_bankruptcy_details: string | null;
        has_eviction_history: boolean | null;
        eviction_details: string | null;
    };
    export type StudentData = {
        university_name: string;
        program_of_study: string;
        expected_graduation_date: string;
        income_source_type: string | null;
        income_source_other: string | null;
        monthly_income: number | null;
        student_proof: App.Data.Shared.DocumentData | null;
    };
    export type TenantProfileData = {
        id: number | null;
        user_id: number | null;
        identity: App.Data.TenantProfile.IdentityData;
        employment: App.Data.TenantProfile.EmploymentData;
        student: App.Data.TenantProfile.StudentData | null;
        rental_history: App.Data.TenantProfile.RentalHistoryData;
        profile_picture: App.Data.Shared.DocumentData | null;
        reference_letter: App.Data.Shared.DocumentData | null;
        other_income_proof: App.Data.Shared.DocumentData | null;
        profile_verified_at: string | null;
        verification_rejection_reason: string | null;
        verification_rejected_fields: Array<string> | null;
        created_at: string | null;
        updated_at: string | null;
        user: App.Data.User.UserData | null;
    };
}
declare namespace App.Data.User {
    export type UserData = {
        id: number | null;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string | null;
        email_verified_at: string | null;
        created_at: string | null;
        updated_at: string | null;
    };
}
declare namespace App.Enums {
    export enum ApplicationStatus {
        Draft = 'draft',
        Submitted = 'submitted',
        UnderReview = 'under_review',
        Approved = 'approved',
        Rejected = 'rejected',
        Withdrawn = 'withdrawn',
        Archived = 'archived',
        Deleted = 'deleted',
    }
    export enum Currency {
        Eur = 'eur',
        Usd = 'usd',
        Gbp = 'gbp',
        Chf = 'chf',
    }
    export enum EmploymentStatus {
        Employed = 'employed',
        SelfEmployed = 'self_employed',
        Student = 'student',
        Unemployed = 'unemployed',
        Retired = 'retired',
        Other = 'other',
    }
    export enum EmploymentType {
        FullTime = 'full_time',
        PartTime = 'part_time',
        Contract = 'contract',
        Temporary = 'temporary',
        Internship = 'internship',
        Freelance = 'freelance',
    }
    export enum IdDocumentType {
        Passport = 'passport',
        NationalId = 'national_id',
        DriversLicense = 'drivers_license',
    }
    export enum ImmigrationStatus {
        Citizen = 'citizen',
        PermanentResident = 'permanent_resident',
        VisaHolder = 'visa_holder',
        Refugee = 'refugee',
        AsylumSeeker = 'asylum_seeker',
        Other = 'other',
    }
    export enum LeadSource {
        Manual = 'manual',
        Invite = 'invite',
        Website = 'website',
    }
    export enum LeadStatus {
        Invited = 'invited',
        Viewed = 'viewed',
        Applied = 'applied',
        Archived = 'archived',
    }
    export enum LivingSituation {
        Renting = 'renting',
        Owner = 'owner',
        LivingWithFamily = 'living_with_family',
        StudentHousing = 'student_housing',
        EmployerProvided = 'employer_provided',
        Other = 'other',
    }
    export enum ParticipantType {
        Lead = 'lead',
        Tenant = 'tenant',
    }
    export enum PropertyStatus {
        Draft = 'draft',
        Vacant = 'vacant',
        Occupied = 'occupied',
        Archived = 'archived',
    }
    export enum ReasonForMoving {
        RelocationWork = 'relocation_work',
        RelocationPersonal = 'relocation_personal',
        Upsizing = 'upsizing',
        Downsizing = 'downsizing',
        EndOfLease = 'end_of_lease',
        BuyingProperty = 'buying_property',
        RelationshipChange = 'relationship_change',
        CloserToFamily = 'closer_to_family',
        BetterLocation = 'better_location',
        Cost = 'cost',
        FirstTimeRenter = 'first_time_renter',
        Other = 'other',
    }
    export enum Relationship {
        Spouse = 'spouse',
        Partner = 'partner',
        Parent = 'parent',
        Sibling = 'sibling',
        Child = 'child',
        Friend = 'friend',
        Employer = 'employer',
        Colleague = 'colleague',
        Other = 'other',
    }
}
