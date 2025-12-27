<?php

return [
    // Navigation
    'nav' => [
        'dashboard' => 'Tableau de bord',
        'properties' => 'Propriétés',
        'applications' => 'Candidatures',
        'messages' => 'Messages',
        'profile' => 'Profil',
    ],

    // Dashboard
    'dashboard' => [
        'title' => 'Tableau de bord',
        'welcome' => 'Bon retour',
        'subtitle' => 'Gérez vos candidatures et messages',
        'browse_properties' => 'Parcourir les propriétés',
        'empty' => [
            'title' => 'Commencez votre recherche',
            'description' => 'Parcourez les propriétés disponibles et soumettez votre première candidature. Vos candidatures et messages apparaîtront ici.',
            'cta' => 'Parcourir les propriétés',
        ],
        'stats' => [
            'active_apps' => 'Candidatures actives',
            'pending_review' => 'En attente',
            'approved' => 'Approuvées',
            'unread_messages' => 'Messages non lus',
        ],
        'quick_actions' => [
            'browse' => 'Parcourir les propriétés',
            'browse_desc' => 'Trouvez votre prochain logement',
            'applications' => 'Mes candidatures',
            'applications_desc' => 'Suivez vos candidatures',
            'messages' => 'Messages',
            'messages_desc' => 'Discutez avec les propriétaires',
            'profile' => 'Mon profil',
            'profile_desc' => 'Mettez à jour vos informations',
        ],
        'recent_applications' => 'Candidatures récentes',
        'view_all' => 'Voir tout',
        'status' => [
            'draft' => 'Brouillon',
            'submitted' => 'Soumise',
            'under_review' => 'En cours d\'examen',
            'visit_scheduled' => 'Visite programmée',
            'visit_completed' => 'Visite effectuée',
            'approved' => 'Approuvée',
            'rejected' => 'Refusée',
            'withdrawn' => 'Retirée',
            'leased' => 'Louée',
            'archived' => 'Archivée',
        ],
        'card' => [
            'view_details' => 'Voir les détails',
            'applied_on' => 'Postulé le',
        ],
    ],

    // Applications list
    'applications' => [
        'title' => 'Mes candidatures',
        'subtitle' => 'Suivez et gérez vos candidatures de location',
        'filter' => [
            'all' => 'Tous les statuts',
            'search' => 'Rechercher des propriétés...',
            'draft' => 'Brouillon',
            'submitted' => 'Soumise',
            'under_review' => 'En cours d\'examen',
            'visit_scheduled' => 'Visite programmée',
            'visit_completed' => 'Visite effectuée',
            'approved' => 'Approuvée',
            'rejected' => 'Refusée',
            'withdrawn' => 'Retirée',
            'leased' => 'Louée',
        ],
        'empty' => [
            'title' => 'Aucune candidature',
            'description' => 'Lorsque vous postulez à des propriétés, elles apparaîtront ici.',
            'cta' => 'Parcourir les propriétés',
        ],
        'no_results' => 'Aucune candidature trouvée',
        'no_results_description' => 'Essayez d\'ajuster vos filtres.',
        'view_details' => 'Voir les détails',
    ],

    // Profile
    'profile' => [
        'title' => 'Mon profil',
        'subtitle' => 'Vos informations de locataire pour les candidatures',
        'edit' => 'Modifier le profil',
        'completeness' => 'Complétude du profil',
        'personal_info' => 'Informations personnelles',
        'date_of_birth' => 'Date de naissance',
        'nationality' => 'Nationalité',
        'phone' => 'Téléphone',
        'not_provided' => 'Non renseigné',
        'employment' => 'Emploi',
        'employment_status' => 'Statut',
        'employer' => 'Employeur',
        'monthly_income' => 'Revenu mensuel',
        'employment_types' => [
            'employed' => 'Salarié',
            'self_employed' => 'Indépendant',
            'student' => 'Étudiant',
            'unemployed' => 'Sans emploi',
            'retired' => 'Retraité',
        ],
        'documents' => 'Documents',
        'id_document' => 'Pièce d\'identité',
        'proof_of_income' => 'Justificatif de revenus',
        'reference_letter' => 'Lettre de référence',
        'uploaded' => 'Téléchargé',
        'not_uploaded' => 'Non téléchargé',
        'current_address' => 'Adresse actuelle',
        'empty' => [
            'title' => 'Pas encore de profil',
            'description' => 'Votre profil de locataire sera créé lorsque vous soumettrez votre première candidature. Les informations fournies seront réutilisées pour les candidatures futures.',
            'cta' => 'Parcourir les propriétés',
        ],
    ],

    // Common
    'common' => [
        'today' => 'Aujourd\'hui',
        'yesterday' => 'Hier',
        'days_ago' => 'jours',
    ],
];
