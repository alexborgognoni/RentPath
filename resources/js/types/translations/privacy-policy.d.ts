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
