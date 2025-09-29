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

