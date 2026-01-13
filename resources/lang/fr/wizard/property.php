<?php

return [
    // Page titles and main UI
    'page' => [
        'addProperty' => 'Ajouter une propriété',
        'editProperty' => 'Modifier la propriété',
        'publishListing' => 'Publier l\'annonce',
        'updateListing' => 'Mettre à jour l\'annonce',
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
];
