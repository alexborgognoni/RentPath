<?php

return [
    // Navigation
    'nav' => [
        'dashboard' => 'Dashboard',
        'properties' => 'Woningen',
        'applications' => 'Aanvragen',
        'messages' => 'Berichten',
        'profile' => 'Profiel',
    ],

    // Dashboard
    'dashboard' => [
        'title' => 'Dashboard',
        'welcome' => 'Welkom terug',
        'subtitle' => 'Beheer uw huuraanvragen en berichten',
        'browse_properties' => 'Woningen bekijken',
        'empty' => [
            'title' => 'Begin uw zoektocht',
            'description' => 'Bekijk beschikbare woningen en dien uw eerste aanvraag in. Uw aanvragen en berichten verschijnen hier.',
            'cta' => 'Woningen bekijken',
        ],
        'stats' => [
            'active_apps' => 'Actieve aanvragen',
            'pending_review' => 'In behandeling',
            'approved' => 'Goedgekeurd',
            'unread_messages' => 'Ongelezen berichten',
        ],
        'quick_actions' => [
            'browse' => 'Woningen bekijken',
            'browse_desc' => 'Vind uw volgende woning',
            'applications' => 'Mijn aanvragen',
            'applications_desc' => 'Volg uw aanvragen',
            'messages' => 'Berichten',
            'messages_desc' => 'Chat met verhuurders',
            'profile' => 'Mijn profiel',
            'profile_desc' => 'Werk uw gegevens bij',
        ],
        'recent_applications' => 'Recente aanvragen',
        'view_all' => 'Alles bekijken',
        'status' => [
            'draft' => 'Concept',
            'submitted' => 'Ingediend',
            'under_review' => 'In behandeling',
            'visit_scheduled' => 'Bezichtiging gepland',
            'visit_completed' => 'Bezichtiging voltooid',
            'approved' => 'Goedgekeurd',
            'rejected' => 'Afgewezen',
            'withdrawn' => 'Ingetrokken',
            'leased' => 'Verhuurd',
            'archived' => 'Gearchiveerd',
        ],
        'card' => [
            'view_details' => 'Details bekijken',
            'applied_on' => 'Aangevraagd op',
        ],
    ],

    // Applications list
    'applications' => [
        'title' => 'Mijn aanvragen',
        'subtitle' => 'Volg en beheer uw huuraanvragen',
        'filter' => [
            'all' => 'Alle statussen',
            'search' => 'Woningen zoeken...',
            'draft' => 'Concept',
            'submitted' => 'Ingediend',
            'under_review' => 'In behandeling',
            'visit_scheduled' => 'Bezichtiging gepland',
            'visit_completed' => 'Bezichtiging voltooid',
            'approved' => 'Goedgekeurd',
            'rejected' => 'Afgewezen',
            'withdrawn' => 'Ingetrokken',
            'leased' => 'Verhuurd',
        ],
        'empty' => [
            'title' => 'Nog geen aanvragen',
            'description' => 'Wanneer u aanvragen indient voor woningen, verschijnen ze hier.',
            'cta' => 'Woningen bekijken',
        ],
        'no_results' => 'Geen aanvragen gevonden',
        'no_results_description' => 'Probeer uw filters aan te passen.',
        'view_details' => 'Details bekijken',
    ],

    // Profile
    'profile' => [
        'title' => 'Mijn profiel',
        'subtitle' => 'Uw huurdersinformatie voor aanvragen',
        'edit' => 'Profiel bewerken',
        'completeness' => 'Profiel volledigheid',
        'personal_info' => 'Persoonlijke informatie',
        'date_of_birth' => 'Geboortedatum',
        'nationality' => 'Nationaliteit',
        'phone' => 'Telefoon',
        'not_provided' => 'Niet opgegeven',
        'employment' => 'Werkgelegenheid',
        'employment_status' => 'Status',
        'employer' => 'Werkgever',
        'monthly_income' => 'Maandelijks inkomen',
        'employment_types' => [
            'employed' => 'In loondienst',
            'self_employed' => 'Zelfstandig',
            'student' => 'Student',
            'unemployed' => 'Werkloos',
            'retired' => 'Gepensioneerd',
        ],
        'documents' => 'Documenten',
        'id_document' => 'Identiteitsbewijs',
        'proof_of_income' => 'Inkomensbewijs',
        'reference_letter' => 'Referentiebrief',
        'uploaded' => 'Geüpload',
        'not_uploaded' => 'Niet geüpload',
        'current_address' => 'Huidig adres',
        'empty' => [
            'title' => 'Nog geen profiel',
            'description' => 'Uw huurdersprofiel wordt aangemaakt wanneer u uw eerste aanvraag indient. De verstrekte informatie wordt hergebruikt voor toekomstige aanvragen.',
            'cta' => 'Woningen bekijken',
        ],
    ],

    // Common
    'common' => [
        'today' => 'Vandaag',
        'yesterday' => 'Gisteren',
        'days_ago' => 'dagen geleden',
    ],
];
