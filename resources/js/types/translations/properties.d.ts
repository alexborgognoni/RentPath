interface PropertiesTranslations {
    title: string;
    property: string;
    propertyNotFound: string;
    properties: string;
    addProperty: string;
    noPropertiesYet: string;
    noPropertiesDesc: string;
    editProperty: string;
    viewDetails: string;
    propertyAdded: string;
    propertyUpdated: string;
    propertyDeleted: string;
    month: string;
    bedrooms: string;
    bathrooms: string;
    copyApplicationLink: string;
    profile: string;
    editProfile: string;

    // Table columns
    columnProperty: string;
    columnPrice: string;
    columnStatus: string;
    columnBeds: string;
    columnApplicants: string;
    columnActions: string;

    // Filters
    filters: string;
    searchPlaceholder: string;
    anyBeds: string;
    anyBaths: string;
    bed: string;
    beds: string;
    bath: string;
    baths: string;
    minPrice: string;
    maxPrice: string;
    minSize: string;
    maxSize: string;

    // Status badges
    statusDraft: string;
    statusInactive: string;
    statusAvailable: string;
    statusApplicationReceived: string;
    statusUnderReview: string;
    statusVisitScheduled: string;
    statusApproved: string;
    statusLeased: string;
    statusMaintenance: string;
    statusArchived: string;
    statusReserved: string;

    // Draft section
    drafts: string;
    untitledDraft: string;
    draftIncomplete: string;
    continue: string;
    delete: string;

    // Actions
    invite: string;
    edit: string;
    perMonth: string;

    // Toast messages
    linkCopied: string;
    linkCopyFailed: string;

    // Error states
    notFoundMessage: string;
    backToProperties: string;
    noMatchingFilters: string;
    adjustFilters: string;
    noImage: string;

    // Confirmation dialogs
    deleteDraftConfirm: string;
    draftDeleted: string;
    draftDeleteFailed: string;

    // Browse properties (tenant portal)
    browse: {
        title: string;
        subtitle: string;
        empty_title: string;
        empty_description: string;
        view_details: string;
    };

    // Property details labels
    details: {
        type: string;
        bedrooms: string;
        bathrooms: string;
        size: string;
        available: string;
        immediately: string;
        description: string;
        propertyDetails: string;
        parking: string;
        indoor: string;
        outdoor: string;
        balcony: string;
        landSize: string;
        floor: string;
        level: string;
        elevatorAvailable: string;
        yearBuilt: string;
        energyClass: string;
        thermalInsulation: string;
        heating: string;
        kitchen: string;
        equipped: string;
        separated: string;
        amenities: string;
        cellar: string;
        laundry: string;
        fireplace: string;
        airConditioning: string;
        garden: string;
        rooftopAccess: string;
        propertyImages: string;
        mainImage: string;
    };

    // Property sidebar
    sidebar: {
        quickStats: string;
        monthlyRent: string;
        applications: string;
        status: string;
        actions: string;
        editProperty: string;
        applicationAccess: string;
        requireInvite: string;
        inviteRequiredDesc: string;
        defaultInviteLink: string;
        usedTimes: string;
        copied: string;
        copyInviteLink: string;
        regenerateLink: string;
        manageCustomLinks: string;
        publicAccessDesc: string;
        copyLink: string;
        dangerZone: string;
        deleteWarning: string;
        deleteProperty: string;
    };

    // Tenant applications
    applications: {
        title: string;
        subtitle: string;
        noApplications: string;
        noApplicationsDesc: string;
        income: string;
        employment: string;
        moveIn: string;
        documents: string;
        files: string;
        appliedOn: string;
        lastUpdated: string;
    };

    // Wizard - Pricing step
    pricing: {
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

    // Property form
    form: {
        addNewProperty: string;
        publishListing: string;
        saveChanges: string;
        saving: string;
        cancel: string;
        reviewAndUpdate: string;
        makeChanges: string;
    };
}
