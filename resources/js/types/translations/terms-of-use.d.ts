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
