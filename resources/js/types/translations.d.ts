interface LandingTranslations {
    hero: {
        heading_primary: string;
        heading_highlighted: string;
        subtitle: string;
        cta_primary_auth: string;
        cta_primary_guest: string;
        cta_secondary: string;
    };
    top_features: {
        heading: string;
        subtitle: string;
        complete_applications: {
            title: string;
            description: string;
        };
        streamlined_leasing: {
            title: string;
            description: string;
        };
        occupancy_overview: {
            title: string;
            description: string;
        };
    };
    demo_carousel: {
        heading: string;
        subtitle: string;
        interactive_demo: string;
        slides: {
            real_time_dashboard: {
                title: string;
                description: string;
                features: [string, string, string, string];
            };
            guided_applications: {
                title: string;
                description: string;
                features: [string, string, string, string];
            };
            automated_review: {
                title: string;
                description: string;
                features: [string, string, string, string];
            };
            progress_visibility: {
                title: string;
                description: string;
                features: [string, string, string, string];
            };
            smart_followup: {
                title: string;
                description: string;
                features: [string, string, string, string];
            };
            digital_inspections: {
                title: string;
                description: string;
                features: [string, string, string, string];
            };
            landlord_reporting: {
                title: string;
                description: string;
                features: [string, string, string, string];
            };
        };
    };
    value_proposition: {
        heading_primary: string;
        heading_highlighted: string;
        subtitle: string;
        stats: {
            applications: string;
            conversion_rate: string;
            support: string;
        };
        features: {
            simple_tenant_invitation: {
                title: string;
                description: string;
                stats_label: string;
            };
            document_collection: {
                title: string;
                description: string;
                stats_label: string;
            };
            complete_visibility: {
                title: string;
                description: string;
                stats_label: string;
            };
            secure_document_storage: {
                title: string;
                description: string;
                stats_label: string;
            };
            intelligent_notifications: {
                title: string;
                description: string;
                stats_label: string;
            };
            digital_inspection_features: {
                title: string;
                description: string;
                stats_label: string;
            };
        };
        cta_subtitle: string;
        stats_percentages: {
            real_time: string;
            bank_level: string;
        };
    };
    testimonials: {
        heading: string;
        subtitle: string;
        companies: [string, string, string, string, string, string, string];
        testimonials: {
            amar_ramdedovic: {
                role: string;
                content: string;
            };
            alessandro_rossi: {
                role: string;
                content: string;
            };
            philippe_hengen: {
                role: string;
                content: string;
            };
        };
        stats: {
            rating_label: string;
            customers_label: string;
            properties_label: string;
        };
        at_keyword: string;
    };
    benefits: {
        heading: string;
        benefits: {
            faster_placements: {
                title: string;
                description: string;
            };
            centralized_data: {
                title: string;
                description: string;
            };
            automated_updates: {
                title: string;
                description: string;
            };
            reduced_overhead: {
                title: string;
                description: string;
            };
            higher_conversion: {
                title: string;
                description: string;
            };
        };
        metrics: {
            heading: string;
            completion_rate_label: string;
            time_to_placement_label: string;
            landlord_satisfaction_label: string;
            admin_time_label: string;
        };
        trial: {
            heading: string;
            benefits: [string, string, string];
            pricing: {
                unit: string;
                offer: string;
            };
        };
    };
    cta: {
        heading: string;
        subtitle: string;
        button_text: string;
    };
    footer: {
        description: string;
        product: string;
        support: string;
        all_rights_reserved: string;
        links: {
            features: string;
            pricing: string;
            free_trial: string;
            help_center: string;
            contact_us: string;
            privacy_policy: string;
            terms_of_use: string;
        };
    };
}

interface ContactUsTranslations {
    page_title: string;
    page_subtitle: string;
    contact_info: {
        email: {
            title: string;
            description: string;
            value: string;
        };
        phone: {
            title: string;
            description: string;
            value: string;
        };
        address: {
            title: string;
            description: string;
            value: string;
            city: string;
            country: string;
        };
    };
    form: {
        title: string;
        description: string;
        fields: {
            name: {
                label: string;
                placeholder: string;
            };
            email: {
                label: string;
                placeholder: string;
            };
            subject: {
                label: string;
                placeholder: string;
            };
            message: {
                label: string;
                placeholder: string;
            };
        };
        submit_button: string;
        submitting_button: string;
    };
    success: {
        title: string;
        description: string;
        send_another_button: string;
    };
}

interface PrivacyPolicyTranslations {
    page_title: string;
    last_updated: string;
    introduction: string;
    sections: {
        who_we_are: {
            title: string;
            content: string;
            contact_details_label: string;
            contact_details: string;
            contact_note: string;
        };
        information_we_collect: {
            title: string;
            intro: string;
            items: {
                account_information: string;
                tenant_application_data: string;
                property_management_data: string;
                communications: string;
                usage_data: string;
                cookies_tracking_data: string;
            };
        };
        lawful_bases: {
            title: string;
            intro: string;
            items: {
                contract: string;
                consent: string;
                legal_obligation: string;
                legitimate_interests: string;
            };
        };
        how_we_use_data: {
            title: string;
            intro: string;
            items: [string, string, string, string, string, string, string];
        };
        sharing_data: {
            title: string;
            intro: string;
            items: {
                landlords_property_managers: string;
                service_providers: string;
                regulatory_authorities: string;
            };
            note: string;
        };
        international_transfers: {
            title: string;
            intro: string;
            items: {
                adequacy_decision: string;
                standard_contractual_clauses: string;
            };
        };
        data_retention: {
            title: string;
            content: string;
        };
        your_rights: {
            title: string;
            intro: string;
            items: {
                right_of_access: string;
                right_to_rectification: string;
                right_to_erasure: string;
                right_to_restrict: string;
                right_to_portability: string;
                right_to_object: string;
                right_to_withdraw: string;
                right_to_complain: string;
            };
            exercise_rights: string;
        };
        cookies_tracking: {
            title: string;
            intro: string;
            items: [string, string, string, string];
            note: string;
        };
        security: {
            title: string;
            content: string;
        };
        changes: {
            title: string;
            content: string;
        };
        contact_us: {
            title: string;
            intro: string;
            contact_details: string;
        };
    };
}

interface TermsOfUseTranslations {
    page_title: string;
    last_updated: string;
    introduction: string;
    sections: {
        who_we_are: {
            title: string;
            content: string;
        };
        eligibility: {
            title: string;
            content: string;
        };
        accounts: {
            title: string;
            items: [string, string, string, string];
        };
        services_provided: {
            title: string;
            intro: string;
            note: string;
        };
        acceptable_use: {
            title: string;
            intro: string;
            items: [string, string, string, string];
            note: string;
        };
        payments: {
            title: string;
            intro: string;
            items: [string, string, string];
        };
        intellectual_property: {
            title: string;
            content: string;
        };
        data_privacy: {
            title: string;
            content: string;
            privacy_policy_link: string;
        };
        disclaimer_warranties: {
            title: string;
            content: string;
        };
        limitation_liability: {
            title: string;
            intro: string;
            items: [string, string];
        };
        termination: {
            title: string;
            content: string;
        };
        changes_terms: {
            title: string;
            content: string;
        };
        governing_law: {
            title: string;
            content: string;
        };
        contact_us: {
            title: string;
            intro: string;
            contact_details: string;
        };
    };
}

interface AuthTranslations {
    login: {
        title: string;
        description: string;
        email_label: string;
        email_placeholder: string;
        password_label: string;
        password_placeholder: string;
        remember_me: string;
        forgot_password: string;
        login_button: string;
        logging_in: string;
        no_account: string;
        register_link: string;
    };
    register: {
        title: string;
        description: string;
        first_name_label: string;
        first_name_placeholder: string;
        last_name_label: string;
        last_name_placeholder: string;
        email_label: string;
        email_placeholder: string;
        password_label: string;
        password_placeholder: string;
        confirm_password_label: string;
        confirm_password_placeholder: string;
        register_button: string;
        registering: string;
        already_have_account: string;
        login_link: string;
    };
    forgot_password: {
        title: string;
        description: string;
        email_label: string;
        email_placeholder: string;
        send_reset_link: string;
        sending: string;
        back_to_login: string;
        success_message: string;
    };
}

interface HeaderTranslations {
    login: string;
}

interface SettingsTranslations {
    menu: {
        account: string;
        password: string;
        appearance: string;
    };
    account: {
        title: string;
        description: string;
        email_address: string;
        email_placeholder: string;
        email_unverified: string;
        resend_verification: string;
        verification_sent: string;
        save_changes: string;
        saving: string;
        saved_successfully: string;
        delete_account: string;
        delete_account_description: string;
        delete_account_button: string;
    };
    password: {
        title: string;
        description: string;
        change_password: string;
        change_password_description: string;
        current_password: string;
        current_password_placeholder: string;
        new_password: string;
        new_password_placeholder: string;
        confirm_password: string;
        confirm_password_placeholder: string;
        update_password: string;
        updating: string;
        password_updated: string;
    };
    appearance: {
        title: string;
        description: string;
        theme: string;
        theme_description: string;
        light: string;
        dark: string;
        system: string;
        theme_preference_saved: string;
    };
}

interface ProfileTranslations {
    setup: {
        title: string;
        edit_title: string;
        description: string;
        edit_description: string;
        verification_notice: string;
        account_type: string;
        individual: string;
        professional: string;
        company_name: string;
        company_name_placeholder: string;
        company_website: string;
        company_website_placeholder: string;
        license_number: string;
        license_number_placeholder: string;
        phone_number: string;
        phone_number_placeholder: string;
        profile_picture: string;
        upload_photo: string;
        remove_photo: string;
        drag_drop_photo: string;
        photo_requirements: string;
        submit_profile: string;
        save_changes: string;
        processing: string;
        profile_submitted: string;
        profile_updated: string;
        first_name: string;
        last_name: string;
        profile_type: string;
        individual_desc: string;
        professional_desc: string;
        documents: string;
        id_document_required: string;
        license_document_required: string;
        upload_file: string;
        replace_file: string;
        drag_drop: string;
        file_requirements: string;
        click_upload_text: string;
        update_profile: string;
        submitting: string;
        updating: string;
        uploading: string;
    };
    unverified: {
        title: string;
        rejected_title: string;
        description: string;
        rejected_description: string;
        thank_you_message: string;
        review_feedback: string;
        identity_verification: string;
        identity_verification_desc: string;
        license_review: string;
        license_review_desc: string;
        review_time: string;
        review_time_desc: string;
        update_resubmit: string;
        edit_profile_info: string;
        return_home: string;
        status_pending: string;
        status_rejected: string;
        review_message: string;
        rejection_title: string;
        rejection_message: string;
        edit_profile: string;
        resubmit: string;
        contact_support: string;
        back_to_dashboard: string;
    };
    common: {
        required: string;
        optional: string;
        cancel: string;
        save: string;
        edit: string;
        delete: string;
        upload: string;
        remove: string;
        close: string;
        confirm: string;
        continue: string;
        back: string;
    };
}

interface Translations {
    landing: LandingTranslations;
    "contact-us": ContactUsTranslations;
    "privacy-policy": PrivacyPolicyTranslations;
    "terms-of-use": TermsOfUseTranslations;
    auth: AuthTranslations;
    header: HeaderTranslations;
    settings: SettingsTranslations;
    profile: ProfileTranslations;
}

type JSONPathOf<T> = T extends string
    ? never
    : T extends readonly (infer U)[]
      ? `[${number}]` | `[${number}].${JSONPathOf<U>}`
      : {
            [K in keyof T & string]: T[K] extends string
                ? `${K}`
                : T[K] extends readonly (infer U)[]
                  ? `${K}` | `${K}[${number}]` | `${K}[${number}].${JSONPathOf<U>}`
                  : `${K}` | `${K}.${JSONPathOf<T[K]>}`;
        }[keyof T & string];

type TranslationKey = JSONPathOf<Translations>;
