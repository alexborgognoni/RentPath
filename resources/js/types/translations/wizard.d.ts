// Wizard Translations - Split structure
// Common translations shared across all wizards
interface WizardCommonTranslations {
    nav: {
        back: string;
        continue: string;
        skip: string;
        submit: string;
        submitting: string;
    };
    progress: {
        stepOf: string;
        optional: string;
    };
}

// Property Wizard Translations
interface WizardPropertyTranslations {
    page: {
        addProperty: string;
        editProperty: string;
        publishListing: string;
        updateListing: string;
    };
    steps: {
        propertyType: { title: string; shortTitle: string; description: string };
        location: { title: string; shortTitle: string; description: string };
        specifications: { title: string; shortTitle: string; description: string };
        amenities: { title: string; shortTitle: string; description: string };
        energy: { title: string; shortTitle: string; description: string };
        pricing: { title: string; shortTitle: string; description: string };
        media: { title: string; shortTitle: string; description: string };
        review: { title: string; shortTitle: string; description: string };
    };
    propertyTypeStep: {
        title: string;
        description: string;
        whatKind: string;
        types: Record<string, string>;
        subtypes: Record<string, string>;
    };
    locationStep: {
        title: string;
        description: string;
        number: string;
        streetName: string;
        apartmentSuite: string;
        optional: string;
        city: string;
        postalCode: string;
        stateRegion: string;
        country: string;
        privacyNote: string;
        placeholders: Record<string, string>;
        countries: Record<string, string>;
    };
    specificationsStep: {
        title: string;
        description: string;
        sections: Record<string, string>;
        fields: Record<string, string>;
    };
    amenitiesStep: {
        title: string;
        description: string;
        helperText: string;
        categories: Record<string, string>;
        amenities: Record<string, string>;
    };
    energyStep: {
        title: string;
        description: string;
        optionalNote: string;
        energyPerformance: string;
        energyHelp: string;
        thermalInsulation: string;
        heatingSystem: string;
        heatingTypes: Record<string, string>;
    };
    pricingStep: {
        title: string;
        description: string;
        perMonth: string;
        whenAvailable: string;
        availableImmediately: string;
        orChooseDate: string;
        acceptApplications: string;
        openForApplications: string;
        startReceiving: string;
        notYet: string;
        openLater: string;
    };
    mediaStep: {
        title: string;
        description: string;
        propertyTitle: string;
        titlePlaceholder: string;
        descriptionLabel: string;
        descriptionOptional: string;
        descriptionPlaceholder: string;
        propertyPhotos: string;
        main: string;
        setAsMain: string;
        addMore: string;
        dragToReorder: string;
        uploadPhotos: string;
        clickOrDrag: string;
        maxSize: string;
        allowedFormats: string;
    };
    reviewStep: {
        title: string;
        titleEdit: string;
        description: string;
        descriptionEdit: string;
        fixIssues: string;
        edit: string;
        morePhotos: string;
        noPhotos: string;
        untitledProperty: string;
        locationNotSet: string;
        perMonth: string;
        immediately: string;
        sections: Record<string, string>;
        labels: Record<string, string>;
        amenityLabels: Record<string, string>;
        finalNote: string;
    };
}

// Application Wizard Translations
interface WizardApplicationTranslations {
    profileDataBanner: {
        message: string;
        manageProfile: string;
    };
    page: {
        title: string;
        metaTitle: string;
    };
    sidebar: {
        propertyManager: string;
        privateLandlord: string;
        monthlyRent: string;
        bedrooms: string;
        bathrooms: string;
        size: string;
        parking: string;
        spots: string;
        available: string;
        allowed: string;
        petsAllowed: string;
        smokingAllowed: string;
    };
    steps: {
        identity: { title: string; shortTitle: string };
        household: { title: string; shortTitle: string };
        financial: { title: string; shortTitle: string };
        support: { title: string; shortTitle: string };
        history: { title: string; shortTitle: string };
        additional: { title: string; shortTitle: string };
        consent: { title: string; shortTitle: string };
        review: { title: string; shortTitle: string };
        // Legacy steps
        personal: { title: string; shortTitle: string; description: string };
        employment: { title: string; shortTitle: string; description: string };
        details: { title: string; shortTitle: string; description: string };
        references: { title: string; shortTitle: string; description: string };
        emergency: { title: string; shortTitle: string; description: string };
    };
    personalStep: Record<string, unknown>;
    financialStep: Record<string, unknown>;
    employmentStep: Record<string, unknown>;
    detailsStep: Record<string, unknown>;
    referencesStep: Record<string, unknown>;
    historyStep: Record<string, unknown>;
    supportStep: Record<string, unknown>;
    emergencyStep: Record<string, unknown>;
    additionalStep: Record<string, unknown>;
    consentStep: Record<string, unknown>;
    reviewStep: Record<string, unknown>;
    nav: {
        submitApplication: string;
        submitting: string;
    };
    shared: {
        personalDetails: Record<string, unknown>;
        idDocument: Record<string, unknown>;
        immigrationStatus: Record<string, unknown>;
        rightToRent: Record<string, unknown>;
    };
}

// Combined Wizard Translations interface (new structure)
interface WizardTranslations {
    common: WizardCommonTranslations;
    property: WizardPropertyTranslations;
    application: WizardApplicationTranslations;
}
