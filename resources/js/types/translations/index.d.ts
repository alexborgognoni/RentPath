export interface Translations {
    common: CommonTranslations;
    statuses: StatusesTranslations;
    settings: SettingsTranslations;
    auth: {
        common: AuthCommonTranslations;
        login: AuthLoginTranslations;
        register: AuthRegisterTranslations;
        forgotPassword: AuthForgotPasswordTranslations;
    };
    manager: {
        properties: ManagerPropertiesTranslations;
        applications: ManagerApplicationsTranslations;
        leads: ManagerLeadsTranslations;
        profile: ManagerProfileTranslations;
    };
    tenant: {
        common: TenantCommonTranslations;
        dashboard: TenantDashboardTranslations;
        applications: TenantApplicationsTranslations;
        profile: TenantProfileTranslations;
        properties: TenantPropertiesTranslations;
    };
    public: {
        landing: PublicLandingTranslations;
        contactUs: PublicContactUsTranslations;
        privacyPolicy: PublicPrivacyPolicyTranslations;
        termsOfUse: PublicTermsOfUseTranslations;
    };
    layout: {
        header: LayoutHeaderTranslations;
        sidebar: LayoutSidebarTranslations;
        cookieBanner: LayoutCookieBannerTranslations;
    };
    wizard: WizardTranslations;
}

export type TranslationKey = string;

// Type definitions are kept flexible using index signatures
// to allow for dynamic translation keys
export interface CommonTranslations {
    [key: string]: unknown;
}

export interface StatusesTranslations {
    [key: string]: unknown;
}

export interface SettingsTranslations {
    [key: string]: unknown;
}

export interface AuthCommonTranslations {
    [key: string]: unknown;
}

export interface AuthLoginTranslations {
    [key: string]: unknown;
}

export interface AuthRegisterTranslations {
    [key: string]: unknown;
}

export interface AuthForgotPasswordTranslations {
    [key: string]: unknown;
}

export interface ManagerPropertiesTranslations {
    [key: string]: unknown;
}

export interface ManagerApplicationsTranslations {
    [key: string]: unknown;
}

export interface ManagerLeadsTranslations {
    [key: string]: unknown;
}

export interface ManagerProfileTranslations {
    [key: string]: unknown;
}

export interface TenantCommonTranslations {
    [key: string]: unknown;
}

export interface TenantDashboardTranslations {
    [key: string]: unknown;
}

export interface TenantApplicationsTranslations {
    [key: string]: unknown;
}

export interface TenantProfileTranslations {
    [key: string]: unknown;
}

export interface TenantPropertiesTranslations {
    [key: string]: unknown;
}

export interface PublicLandingTranslations {
    [key: string]: unknown;
}

export interface PublicContactUsTranslations {
    [key: string]: unknown;
}

export interface PublicPrivacyPolicyTranslations {
    [key: string]: unknown;
}

export interface PublicTermsOfUseTranslations {
    [key: string]: unknown;
}

export interface LayoutHeaderTranslations {
    [key: string]: unknown;
}

export interface LayoutSidebarTranslations {
    [key: string]: unknown;
}

export interface LayoutCookieBannerTranslations {
    [key: string]: unknown;
}

export interface WizardTranslations {
    common: WizardCommonTranslations;
    property: WizardPropertyTranslations;
    application: WizardApplicationTranslations;
}

export interface WizardCommonTranslations {
    [key: string]: unknown;
}

export interface WizardPropertyTranslations {
    [key: string]: unknown;
}

export interface WizardApplicationTranslations {
    [key: string]: unknown;
}
