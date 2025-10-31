interface Translations {
    landing: LandingTranslations;
    'contact-us': ContactUsTranslations;
    'privacy-policy': PrivacyPolicyTranslations;
    'terms-of-use': TermsOfUseTranslations;
    auth: AuthTranslations;
    header: HeaderTranslations;
    settings: SettingsTranslations;
    profile: ProfileTranslations;
    'cookie-banner': CookieBannerTranslations;
    dashboard: DashboardTranslations;
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
