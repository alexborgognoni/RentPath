<?php

return [
    // Page titles and main UI
    'page' => [
        'addProperty' => 'Ajouter une propriété',
        'editProperty' => 'Modifier la propriété',
        'publishListing' => 'Publier l\'annonce',
        'updateListing' => 'Mettre à jour l\'annonce',
    ],

    // Navigation
    'nav' => [
        'back' => 'Retour',
        'continue' => 'Continuer',
        'skip' => 'Passer pour l\'instant',
        'submit' => 'Soumettre',
        'submitting' => 'Envoi en cours...',
    ],

    // Progress
    'progress' => [
        'stepOf' => 'Étape :current sur :total',
        'optional' => '(opt)',
    ],

    // Step titles and descriptions
    'steps' => [
        'propertyType' => [
            'title' => 'Type de propriété',
            'shortTitle' => 'Type',
            'description' => 'Quel type de propriété proposez-vous ?',
        ],
        'location' => [
            'title' => 'Emplacement',
            'shortTitle' => 'Lieu',
            'description' => 'Où se trouve votre propriété ?',
        ],
        'specifications' => [
            'title' => 'Caractéristiques',
            'shortTitle' => 'Specs',
            'description' => 'Parlez-nous des détails',
        ],
        'amenities' => [
            'title' => 'Équipements',
            'shortTitle' => 'Équipements',
            'description' => 'Quelles fonctionnalités sont incluses ?',
        ],
        'energy' => [
            'title' => 'Énergie',
            'shortTitle' => 'Énergie',
            'description' => 'Informations sur l\'efficacité énergétique',
        ],
        'pricing' => [
            'title' => 'Tarification',
            'shortTitle' => 'Prix',
            'description' => 'Définissez votre prix de location',
        ],
        'media' => [
            'title' => 'Photos & Détails',
            'shortTitle' => 'Médias',
            'description' => 'Ajoutez des photos et une description',
        ],
        'review' => [
            'title' => 'Vérification',
            'shortTitle' => 'Vérifier',
            'description' => 'Vérifiez et publiez',
        ],
    ],

    // Property Type Step
    'propertyTypeStep' => [
        'title' => 'Quel type de propriété proposez-vous ?',
        'description' => 'Choisissez la catégorie qui décrit le mieux votre propriété',
        'whatKind' => 'Quel type de :type ?',

        // Property types
        'types' => [
            'apartment' => 'Appartement',
            'apartmentDesc' => 'Studios, duplex, penthouses',
            'house' => 'Maison',
            'houseDesc' => 'Individuelles, villas, bungalows',
            'room' => 'Chambre',
            'roomDesc' => 'Chambres privées, colocation',
            'commercial' => 'Commercial',
            'commercialDesc' => 'Bureaux, espaces commerciaux',
            'industrial' => 'Industriel',
            'industrialDesc' => 'Entrepôts, usines',
            'parking' => 'Parking',
            'parkingDesc' => 'Garages, places de parking',
        ],

        // Subtypes
        'subtypes' => [
            'studio' => 'Studio',
            'loft' => 'Loft',
            'duplex' => 'Duplex',
            'triplex' => 'Triplex',
            'penthouse' => 'Penthouse',
            'serviced' => 'Appartement avec services',
            'detached' => 'Maison individuelle',
            'semi-detached' => 'Maison mitoyenne',
            'villa' => 'Villa',
            'bungalow' => 'Bungalow',
            'private_room' => 'Chambre privée',
            'student_room' => 'Chambre étudiante',
            'co-living' => 'Espace de colocation',
            'office' => 'Espace de bureau',
            'retail' => 'Commerce',
            'warehouse' => 'Entrepôt',
            'factory' => 'Usine',
            'garage' => 'Garage',
            'indoor_spot' => 'Place de parking intérieure',
            'outdoor_spot' => 'Place de parking extérieure',
        ],
    ],

    // Location Step
    'locationStep' => [
        'title' => 'Où se trouve votre propriété ?',
        'description' => 'Entrez l\'adresse où les locataires vivront',
        'number' => 'Numéro',
        'streetName' => 'Nom de rue',
        'apartmentSuite' => 'Appartement, Suite, Unité',
        'optional' => 'optionnel',
        'city' => 'Ville',
        'postalCode' => 'Code postal',
        'stateRegion' => 'État/Région',
        'country' => 'Pays',
        'privacyNote' => 'Votre adresse exacte ne sera partagée qu\'avec les candidats approuvés',

        // Placeholders
        'placeholders' => [
            'number' => '123',
            'streetName' => 'Rue Principale',
            'apartmentSuite' => 'Apt 4B, Étage 2, etc.',
            'city' => 'Paris',
            'postalCode' => '75001',
            'stateRegion' => 'Région, État, etc.',
        ],

        // Countries
        'countries' => [
            'CH' => 'Suisse',
            'DE' => 'Allemagne',
            'FR' => 'France',
            'AT' => 'Autriche',
            'IT' => 'Italie',
            'US' => 'États-Unis',
            'GB' => 'Royaume-Uni',
            'NL' => 'Pays-Bas',
            'BE' => 'Belgique',
            'ES' => 'Espagne',
        ],
    ],

    // Specifications Step
    'specificationsStep' => [
        'title' => 'Parlez-nous de l\'espace',
        'description' => 'Ces détails aident les locataires à trouver la correspondance parfaite',

        // Section titles
        'sections' => [
            'rooms' => 'Pièces',
            'space' => 'Surface',
            'parking' => 'Parking',
            'building' => 'Bâtiment',
        ],

        // Field labels
        'fields' => [
            'bedrooms' => 'Chambres',
            'bathrooms' => 'Salles de bain',
            'livingSpace' => 'Surface habitable',
            'balconyTerrace' => 'Balcon/Terrasse',
            'landSize' => 'Surface du terrain',
            'indoorSpots' => 'Places intérieures',
            'outdoorSpots' => 'Places extérieures',
            'floorLevel' => 'Étage',
            'yearBuilt' => 'Année de construction',
            'hasElevator' => 'Ascenseur',
            'parkingSpaceSize' => 'Surface du parking',
        ],
    ],

    // Amenities Step
    'amenitiesStep' => [
        'title' => 'Que propose votre propriété ?',
        'description' => 'Sélectionnez toutes les fonctionnalités et équipements inclus',
        'helperText' => 'Ne vous inquiétez pas si quelque chose n\'est pas listé — vous pourrez ajouter plus de détails dans la description plus tard',

        // Categories
        'categories' => [
            'kitchen' => 'Cuisine',
            'building' => 'Caractéristiques du bâtiment',
            'outdoor' => 'Espaces extérieurs',
        ],

        // Amenities
        'amenities' => [
            'equippedKitchen' => 'Cuisine équipée',
            'separateKitchen' => 'Cuisine séparée',
            'cellarStorage' => 'Cave',
            'laundryRoom' => 'Buanderie',
            'fireplace' => 'Cheminée',
            'airConditioning' => 'Climatisation',
            'gardenAccess' => 'Accès jardin',
            'rooftopAccess' => 'Accès toit-terrasse',
        ],
    ],

    // Energy Step
    'energyStep' => [
        'title' => 'Énergie & Efficacité',
        'description' => 'Aidez les locataires éco-responsables à trouver votre propriété',
        'optionalNote' => 'Cette étape est optionnelle',
        'energyPerformance' => 'Classe énergétique',
        'energyHelp' => 'A+ est le plus efficace, G le moins',
        'thermalInsulation' => 'Isolation thermique',
        'heatingSystem' => 'Système de chauffage',

        // Heating types
        'heatingTypes' => [
            'gas' => 'Gaz',
            'electric' => 'Électrique',
            'district' => 'Chauffage urbain',
            'heat_pump' => 'Pompe à chaleur',
            'wood' => 'Bois',
            'other' => 'Autre',
        ],
    ],

    // Pricing Step
    'pricingStep' => [
        'title' => 'Définissez votre tarification',
        'description' => 'Combien demanderez-vous pour le loyer ?',
        'perMonth' => '/mois',
        'whenAvailable' => 'Quand est-elle disponible ?',
        'availableImmediately' => 'Disponible immédiatement',
        'orChooseDate' => 'ou choisissez une date',
        'acceptApplications' => 'Accepter les candidatures ?',
        'openForApplications' => 'Ouvert aux candidatures',
        'startReceiving' => 'Commencer à recevoir des candidatures',
        'notYet' => 'Pas encore',
        'openLater' => 'Ouvrir aux candidatures plus tard',
    ],

    // Media Step
    'mediaStep' => [
        'title' => 'Faites briller votre annonce',
        'description' => 'De belles photos et un titre accrocheur attirent plus de candidats',
        'propertyTitle' => 'Titre de la propriété',
        'titlePlaceholder' => 'ex. Appartement lumineux 2 chambres avec balcon en centre-ville',
        'descriptionLabel' => 'Description',
        'descriptionOptional' => 'optionnel mais recommandé',
        'descriptionPlaceholder' => 'Décrivez ce qui rend votre propriété spéciale. Mentionnez les commodités à proximité, les transports et tout ce que les locataires devraient savoir...',
        'propertyPhotos' => 'Photos de la propriété',
        'main' => 'Principale',
        'setAsMain' => 'Définir comme principale',
        'addMore' => 'Ajouter plus',
        'dragToReorder' => 'Glissez pour réorganiser. Survolez pour définir la photo principale.',
        'uploadPhotos' => 'Télécharger des photos',
        'clickOrDrag' => 'Cliquez ou glissez des images ici',
        'maxSize' => 'Max :size par image',
        'allowedFormats' => 'JPG, PNG, WebP',
    ],

    // Review Step
    'reviewStep' => [
        'title' => 'Vérifiez votre annonce',
        'titleEdit' => 'Votre annonce',
        'description' => 'Assurez-vous que tout est correct avant de publier',
        'descriptionEdit' => 'Cliquez sur Modifier pour apporter des changements',
        'fixIssues' => 'Veuillez corriger les problèmes suivants :',
        'edit' => 'Modifier',
        'morePhotos' => '+:count autres photos',
        'noPhotos' => 'Aucune photo ajoutée',
        'untitledProperty' => 'Propriété sans titre',
        'locationNotSet' => 'Emplacement non défini',
        'perMonth' => '/mois',
        'immediately' => 'Immédiatement',

        // Section titles
        'sections' => [
            'propertyType' => 'Type de propriété',
            'location' => 'Emplacement',
            'specifications' => 'Caractéristiques',
            'amenities' => 'Équipements',
            'energy' => 'Énergie',
            'pricingAvailability' => 'Prix & Disponibilité',
            'description' => 'Description',
        ],

        // Labels
        'labels' => [
            'bedrooms' => ':count Chambres',
            'bedroom' => ':count Chambre',
            'bathrooms' => ':count Salles de bain',
            'bathroom' => ':count Salle de bain',
            'livingSpace' => ':size m² habitables',
            'balcony' => ':size m² balcon',
            'land' => ':size m² terrain',
            'parking' => ':count parking',
            'floor' => 'Étage :level',
            'elevator' => 'Ascenseur',
            'monthlyRent' => 'Loyer mensuel',
            'available' => 'Disponible',
            'energyClass' => 'Classe énergétique :',
            'insulation' => 'Isolation :',
            'heating' => 'Chauffage :',
        ],

        // Amenity labels (short)
        'amenityLabels' => [
            'equippedKitchen' => 'Cuisine équipée',
            'separateKitchen' => 'Cuisine séparée',
            'cellar' => 'Cave',
            'laundry' => 'Buanderie',
            'fireplace' => 'Cheminée',
            'airConditioning' => 'Clim',
            'garden' => 'Jardin',
            'rooftop' => 'Toit-terrasse',
        ],

        'finalNote' => 'En publiant, vous confirmez que les informations ci-dessus sont exactes et complètes.',
    ],

    // ===== Application Wizard =====
    'application' => [
        // Page-level translations
        'page' => [
            'title' => 'Candidature pour :property',
            'metaTitle' => 'Postuler pour :property',
        ],

        // Sidebar translations
        'sidebar' => [
            'propertyManager' => 'Gestionnaire immobilier',
            'privateLandlord' => 'Propriétaire privé',
            'monthlyRent' => 'Loyer mensuel',
            'bedrooms' => 'Chambres',
            'bathrooms' => 'Salles de bain',
            'size' => 'Surface',
            'parking' => 'Parking',
            'spots' => ':count place|:count places',
            'available' => 'Disponible',
            'allowed' => 'Autorisé',
            'petsAllowed' => 'Animaux acceptés',
            'smokingAllowed' => 'Fumeur accepté',
        ],

        // Step titles
        'steps' => [
            'personal' => [
                'title' => 'Informations personnelles',
                'shortTitle' => 'Personnel',
                'description' => 'Parlez-nous de vous',
            ],
            'employment' => [
                'title' => 'Emploi & Revenus',
                'shortTitle' => 'Emploi',
                'description' => 'Vos informations d\'emploi et de revenus',
            ],
            'details' => [
                'title' => 'Détails de la candidature',
                'shortTitle' => 'Détails',
                'description' => 'Préférences d\'emménagement et foyer',
            ],
            'references' => [
                'title' => 'Références',
                'shortTitle' => 'Références',
                'description' => 'Ajoutez des références pour renforcer votre candidature',
            ],
            'emergency' => [
                'title' => 'Contact d\'urgence',
                'shortTitle' => 'Urgence',
                'description' => 'Informations de contact d\'urgence',
            ],
            'review' => [
                'title' => 'Vérifier & Soumettre',
                'shortTitle' => 'Vérifier',
                'description' => 'Vérifiez et soumettez votre candidature',
            ],
        ],

        // Personal Info Step
        'personalStep' => [
            'title' => 'Informations personnelles',
            'description' => 'Votre profil sera mis à jour lorsque vous soumettrez cette candidature.',
            'sections' => [
                'currentAddress' => 'Adresse actuelle',
                'idDocument' => 'Pièce d\'identité (Passeport, Carte d\'identité, Permis de conduire)',
            ],
            'fields' => [
                'dateOfBirth' => 'Date de naissance',
                'nationality' => 'Nationalité',
                'phoneNumber' => 'Numéro de téléphone',
                'streetName' => 'Nom de rue',
                'houseNumber' => 'Numéro',
                'apartment' => 'Appartement, Suite, Unité',
                'city' => 'Ville',
                'stateProvince' => 'État/Province',
                'postalCode' => 'Code postal',
                'country' => 'Pays',
            ],
            'placeholders' => [
                'phone' => '612345678',
                'streetName' => 'Rue de la Paix',
                'houseNumber' => '123A',
                'apartment' => 'Apt 4B, Étage 2',
                'city' => 'Paris',
            ],
            'fileLabels' => [
                'frontSide' => 'Recto',
                'backSide' => 'Verso',
            ],
            'optional' => 'optionnel',
        ],

        // Employment & Income Step
        'employmentStep' => [
            'title' => 'Emploi & Revenus',
            'description' => 'Ces informations aident les propriétaires à évaluer votre capacité à payer le loyer. Elles seront enregistrées dans votre profil.',
            'optional' => 'optionnel',
            'fields' => [
                'employmentStatus' => 'Statut professionnel',
                'employerName' => 'Nom de l\'employeur',
                'jobTitle' => 'Intitulé du poste',
                'employmentType' => 'Type de contrat',
                'employmentStartDate' => 'Date de début d\'emploi',
                'monthlyIncomeGross' => 'Revenu mensuel (Brut)',
                'monthlyIncome' => 'Revenu mensuel',
                'university' => 'Université / Établissement',
                'programOfStudy' => 'Programme d\'études',
                'expectedGraduation' => 'Date de diplôme prévue',
                'incomeSource' => 'Source de revenus',
            ],
            'placeholders' => [
                'employerName' => 'Société Exemple',
                'jobTitle' => 'Ingénieur logiciel',
                'university' => 'Université de Paris',
                'program' => 'Informatique',
                'incomeSource' => 'Bourse, Travail à temps partiel, Parents',
                'income' => '3500',
                'incomeZero' => '0',
            ],
            'employmentStatuses' => [
                'employed' => 'Salarié',
                'self_employed' => 'Indépendant',
                'student' => 'Étudiant',
                'unemployed' => 'Sans emploi',
                'retired' => 'Retraité',
            ],
            'employmentTypes' => [
                'full_time' => 'Temps plein',
                'part_time' => 'Temps partiel',
                'contract' => 'Contrat',
                'temporary' => 'Temporaire',
            ],
            'guarantor' => [
                'title' => 'J\'ai un garant',
                'description' => 'Un garant est une personne qui accepte de payer votre loyer si vous ne pouvez pas. C\'est souvent requis pour les étudiants ou les primo-locataires.',
                'firstName' => 'Prénom',
                'lastName' => 'Nom',
                'relationship' => 'Relation',
                'specifyRelationship' => 'Veuillez préciser',
                'phone' => 'Numéro de téléphone',
                'email' => 'Adresse e-mail',
                'addressSection' => 'Adresse',
                'idDocumentsSection' => 'Documents d\'identité',
                'employmentSection' => 'Emploi & Revenus',
                'employmentStatus' => 'Statut professionnel',
                'streetName' => 'Nom de la rue',
                'houseNumber' => 'Numéro',
                'apartment' => 'Appartement / Unité / Étage',
                'city' => 'Ville',
                'country' => 'Pays',
                'employerName' => 'Nom de l\'employeur',
                'jobTitle' => 'Intitulé du poste',
                'employmentType' => 'Type de contrat',
                'employmentStartDate' => 'Date de début d\'emploi',
                'universityName' => 'Nom de l\'université',
                'programOfStudy' => 'Programme d\'études',
                'expectedGraduation' => 'Date de diplôme prévue',
                'incomeSource' => 'Source de revenus',
                'monthlyIncome' => 'Revenu mensuel',
                'placeholders' => [
                    'firstName' => 'ex: Jean',
                    'lastName' => 'ex: Dupont',
                    'relationship' => 'Sélectionner la relation...',
                    'specifyRelationship' => 'ex: Oncle, Collègue',
                    'phone' => '612345678',
                    'email' => 'garant@exemple.com',
                    'streetName' => 'ex: Rue Principale',
                    'houseNumber' => 'ex: 123A',
                    'apartment' => 'ex: Apt 4B, Étage 2',
                    'city' => 'ex: Paris',
                    'country' => 'Sélectionner le pays...',
                    'employerName' => 'ex: Nom de l\'entreprise',
                    'jobTitle' => 'ex: Directeur senior',
                    'universityName' => 'ex: Université de Paris',
                    'programOfStudy' => 'ex: Informatique',
                    'incomeSource' => 'ex: Parents, Bourse',
                    'income' => '5000',
                ],
                'relationships' => [
                    'parent' => 'Parent',
                    'grandparent' => 'Grand-parent',
                    'sibling' => 'Frère/Sœur',
                    'spouse' => 'Conjoint',
                    'partner' => 'Partenaire',
                    'other_family' => 'Autre famille',
                    'friend' => 'Ami',
                    'employer' => 'Employeur',
                    'other' => 'Autre',
                ],
            ],
            'documents' => [
                'employmentContract' => 'Contrat de travail',
                'payslip1' => 'Bulletin de salaire récent (1)',
                'payslip2' => 'Bulletin de salaire récent (2)',
                'payslip3' => 'Bulletin de salaire récent (3)',
                'studentProof' => 'Justificatif de statut étudiant',
                'studentProofDesc' => 'certificat de scolarité, carte étudiante',
                'pensionProof' => 'Justificatif de pension/retraite',
                'otherIncomeProof' => 'Justificatif de source de revenus',
                'otherIncomeProofDesc' => 'attestation d\'allocations, relevés bancaires, etc.',
                'guarantorIdFront' => 'Pièce d\'identité du garant (Recto)',
                'guarantorIdBack' => 'Pièce d\'identité du garant (Verso)',
                'guarantorEmploymentContract' => 'Contrat de travail du garant',
                'guarantorPayslip1' => 'Bulletin de salaire du garant (1)',
                'guarantorPayslip2' => 'Bulletin de salaire du garant (2)',
                'guarantorPayslip3' => 'Bulletin de salaire du garant (3)',
                'guarantorStudentProof' => 'Justificatif étudiant du garant',
                'guarantorPensionProof' => 'Justificatif de pension du garant',
                'guarantorOtherIncomeProof' => 'Justificatif de revenus du garant',
            ],
        ],

        // Details Step
        'detailsStep' => [
            'title' => 'Détails de la candidature',
            'fields' => [
                'moveInDate' => 'Date d\'emménagement souhaitée',
                'leaseDuration' => 'Durée de bail souhaitée (mois)',
                'messageToLandlord' => 'Message au propriétaire',
            ],
            'placeholders' => [
                'message' => 'Présentez-vous et expliquez pourquoi cette propriété vous intéresse...',
            ],
            'occupants' => [
                'title' => 'Occupants',
                'description' => 'Vous (le candidat) êtes automatiquement inclus. Ajoutez les occupants supplémentaires ci-dessous.',
                'occupant' => 'Occupant :index',
                'name' => 'Nom',
                'age' => 'Âge',
                'relationship' => 'Relation',
                'specifyRelationship' => 'Veuillez préciser la relation',
                'addOccupant' => 'Ajouter un occupant',
                'placeholder' => 'Entrez la relation...',
                'relationships' => [
                    'spouse' => 'Conjoint',
                    'partner' => 'Partenaire',
                    'child' => 'Enfant',
                    'parent' => 'Parent',
                    'sibling' => 'Frère/Sœur',
                    'roommate' => 'Colocataire',
                    'other' => 'Autre',
                ],
            ],
            'pets' => [
                'title' => 'Animaux',
                'hasPets' => 'J\'ai des animaux',
                'pet' => 'Animal :index',
                'type' => 'Type',
                'breed' => 'Race',
                'age' => 'Âge',
                'weight' => 'Poids',
                'specifyType' => 'Veuillez préciser le type d\'animal',
                'addPet' => 'Ajouter un animal',
                'placeholder' => 'Entrez le type d\'animal...',
                'atLeastOneRequired' => 'Au moins un animal est requis',
                'types' => [
                    'dog' => 'Chien',
                    'cat' => 'Chat',
                    'bird' => 'Oiseau',
                    'fish' => 'Poisson',
                    'rabbit' => 'Lapin',
                    'hamster' => 'Hamster',
                    'guinea_pig' => 'Cochon d\'Inde',
                    'reptile' => 'Reptile',
                    'other' => 'Autre',
                ],
            ],
            'characters' => ':count/:max caractères',
            'optional' => 'optionnel',
        ],

        // References Step
        'referencesStep' => [
            'title' => 'Références',
            'description' => 'Ajoutez des références pour renforcer votre candidature. Les références de propriétaires sont particulièrement précieuses.',
            'landlord' => [
                'title' => 'Références de propriétaires',
                'recommended' => 'Recommandé',
                'description' => 'Une référence d\'un ancien propriétaire aide à vérifier votre historique locatif.',
                'empty' => 'Aucune référence de propriétaire ajoutée.',
                'add' => 'Ajouter une référence de propriétaire',
                'relationships' => [
                    'previous_landlord' => 'Ancien propriétaire',
                    'property_manager' => 'Gestionnaire immobilier',
                    'other' => 'Autre',
                ],
            ],
            'other' => [
                'title' => 'Autres références',
                'optional' => 'Optionnel',
                'description' => 'Ajoutez des références personnelles ou professionnelles qui peuvent attester de votre caractère et fiabilité.',
                'empty' => 'Aucune autre référence ajoutée.',
                'addProfessional' => 'Ajouter une référence professionnelle',
                'addPersonal' => 'Ajouter une référence personnelle',
            ],
            'personal' => [
                'relationships' => [
                    'friend' => 'Ami',
                    'neighbor' => 'Voisin',
                    'family_friend' => 'Ami de la famille',
                    'other' => 'Autre',
                ],
            ],
            'professional' => [
                'relationships' => [
                    'employer' => 'Employeur',
                    'manager' => 'Manager',
                    'colleague' => 'Collègue',
                    'professor' => 'Professeur',
                    'teacher' => 'Enseignant',
                    'mentor' => 'Mentor',
                    'other' => 'Autre',
                ],
            ],
            'fields' => [
                'name' => 'Nom',
                'relationship' => 'Relation',
                'specify' => 'Veuillez préciser',
                'phone' => 'Téléphone',
                'email' => 'Email',
                'yearsKnown' => 'Années de connaissance',
            ],
            'placeholder' => 'Entrez la relation...',
            'summary' => ':count référence ajoutée|:count références ajoutées',
            'summaryDetail' => '(:landlord propriétaire, :other autre)',
        ],

        // Emergency Step
        'emergencyStep' => [
            'title' => 'Contact d\'urgence',
            'descriptionWithProfile' => 'Vous pouvez utiliser le contact d\'urgence de votre profil ou en fournir un différent pour cette candidature.',
            'descriptionNoProfile' => 'Fournissez un contact d\'urgence pour cette candidature.',
            'fields' => [
                'name' => 'Nom',
                'phone' => 'Téléphone',
                'relationship' => 'Relation',
            ],
            'placeholder' => 'Parent, Frère/Sœur...',
        ],

        // Review Step
        'reviewStep' => [
            'title' => 'Vérifiez votre candidature',
            'description' => 'Veuillez vérifier toutes les informations avant de soumettre. Cliquez sur "Modifier" pour apporter des changements.',
            'edit' => 'Modifier',
            'sections' => [
                'personal' => 'Informations personnelles',
                'employment' => 'Emploi & Revenus',
                'details' => 'Détails de la candidature',
                'references' => 'Références',
                'emergency' => 'Contact d\'urgence',
            ],
            'labels' => [
                'dateOfBirth' => 'Date de naissance',
                'nationality' => 'Nationalité',
                'phone' => 'Téléphone',
                'currentAddress' => 'Adresse actuelle',
                'employmentStatus' => 'Statut professionnel',
                'employer' => 'Employeur',
                'jobTitle' => 'Poste',
                'monthlyIncome' => 'Revenu mensuel',
                'employmentType' => 'Type de contrat',
                'startDate' => 'Date de début',
                'university' => 'Université',
                'program' => 'Programme',
                'expectedGraduation' => 'Diplôme prévu',
                'incomeSource' => 'Source de revenus',
                'documents' => 'Documents',
                'guarantor' => 'Garant',
                'moveInDate' => 'Date d\'emménagement souhaitée',
                'leaseDuration' => 'Durée du bail',
                'additionalOccupants' => 'Occupants supplémentaires',
                'pets' => 'Animaux',
                'messageToLandlord' => 'Message au propriétaire',
                'previousLandlord' => 'Références de propriétaires',
                'personalReferences' => 'Références personnelles',
                'professionalReferences' => 'Références professionnelles',
                'yearsKnown' => 'Années de connaissance',
                'age' => 'Âge : :age',
                'name' => 'Nom',
                'email' => 'Email',
                'relationship' => 'Relation',
                'address' => 'Adresse',
            ],
            'documentBadges' => [
                'idFront' => 'ID Recto',
                'idBack' => 'ID Verso',
                'employmentContract' => 'Contrat de travail',
                'payslip1' => 'Bulletin 1',
                'payslip2' => 'Bulletin 2',
                'payslip3' => 'Bulletin 3',
                'studentProof' => 'Justificatif étudiant',
                'otherIncomeProof' => 'Justificatif de revenus',
                'guarantorId' => 'ID Garant',
                'guarantorIncomeProof' => 'Revenus Garant',
            ],
            'notProvided' => 'Non fourni',
            'noPreviousLandlord' => 'Aucun ancien propriétaire fourni',
            'noReferences' => 'Aucune référence fournie',
            'noEmergencyContact' => 'Aucun contact d\'urgence fourni',
            'months' => ':count mois|:count mois',
            'confirmation' => [
                'title' => 'Prêt à soumettre',
                'description' => 'En soumettant cette candidature, vous confirmez que toutes les informations fournies sont exactes et complètes. Les données de votre profil seront enregistrées pour les futures candidatures.',
            ],
        ],

        // Navigation
        'nav' => [
            'submitApplication' => 'Soumettre la candidature',
            'submitting' => 'Envoi en cours...',
        ],
    ],
];
