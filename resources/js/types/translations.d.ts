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
        heading: string;
        subtitle: string;
        features: {
            efficiency: {
                title: string;
                description: string;
            };
            tenant_experience: {
                title: string;
                description: string;
            };
            landlord_satisfaction: {
                title: string;
                description: string;
            };
            data_insights: {
                title: string;
                description: string;
            };
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
            completion_rate: {
                label: string;
                value: string;
            };
            time_to_placement: {
                label: string;
                value: string;
            };
            landlord_satisfaction: {
                label: string;
                value: string;
            };
            admin_time: {
                label: string;
                value: string;
            };
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
        };
    };
}

interface Translations {
    landing: LandingTranslations;
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
