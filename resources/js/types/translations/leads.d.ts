export interface LeadsTranslations {
    title: string;
    lead: string;
    leads: string;
    noLeads: string;
    noLeadsDesc: string;
    noResults: string;
    noResultsDesc: string;
    filters: string;
    searchPlaceholder: string;
    allProperties: string;
    allStatuses: string;
    allSources: string;
    createLead: string;
    inviteLead: string;
    leadDetails: string;

    // Table columns
    columnName: string;
    columnEmail: string;
    columnProperty: string;
    columnStatus: string;
    columnSource: string;
    columnInvited: string;
    columnActions: string;
    viewDetails: string;

    // Status labels
    statusInvited: string;
    statusViewed: string;
    statusDrafting: string;
    statusApplied: string;
    statusArchived: string;

    // Source labels
    sourceManual: string;
    sourceInvite: string;
    sourceTokenSignup: string;
    sourceApplication: string;
    sourceInquiry: string;

    // Lead detail page
    contactInfo: string;
    email: string;
    phone: string;
    notProvided: string;
    timeline: string;
    invitedAt: string;
    viewedAt: string;
    startedApplication: string;
    submitted: string;
    notes: string;
    noNotes: string;
    addNote: string;
    saveNote: string;
    linkedApplication: string;
    viewApplication: string;

    // Actions sidebar
    actions: string;
    resendInvite: string;
    resendInviteDesc: string;
    inviteSent: string;
    archiveLead: string;
    archiveLeadDesc: string;
    leadArchived: string;
    deleteLead: string;
    deleteLeadConfirm: string;
    leadDeleted: string;
    dangerZone: string;

    // Create lead modal
    createLeadTitle: string;
    createLeadDesc: string;
    selectProperty: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    initialNotes: string;
    cancel: string;
    sendInvite: string;
    sending: string;
    leadCreated: string;
    leadExists: string;

    // Validation errors
    emailRequired: string;
    emailInvalid: string;
    propertyRequired: string;
}
