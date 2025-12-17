<?php

return [
    // Page titles and main UI
    'page' => [
        'addProperty' => 'Nieuwe woning toevoegen',
        'editProperty' => 'Woning bewerken',
        'publishListing' => 'Advertentie publiceren',
        'updateListing' => 'Advertentie bijwerken',
    ],

    // Navigation
    'nav' => [
        'back' => 'Terug',
        'continue' => 'Doorgaan',
        'skip' => 'Voorlopig overslaan',
        'submit' => 'Versturen',
        'submitting' => 'Bezig met versturen...',
    ],

    // Progress
    'progress' => [
        'stepOf' => 'Stap :current van :total',
        'optional' => '(opt)',
    ],

    // Step titles and descriptions
    'steps' => [
        'propertyType' => [
            'title' => 'Woningtype',
            'shortTitle' => 'Type',
            'description' => 'Wat voor soort woning biedt u aan?',
        ],
        'location' => [
            'title' => 'Locatie',
            'shortTitle' => 'Locatie',
            'description' => 'Waar bevindt uw woning zich?',
        ],
        'specifications' => [
            'title' => 'Specificaties',
            'shortTitle' => 'Specs',
            'description' => 'Vertel ons over de details',
        ],
        'amenities' => [
            'title' => 'Voorzieningen',
            'shortTitle' => 'Voorzieningen',
            'description' => 'Welke kenmerken zijn inbegrepen?',
        ],
        'energy' => [
            'title' => 'Energie',
            'shortTitle' => 'Energie',
            'description' => 'Informatie over energie-efficiëntie',
        ],
        'pricing' => [
            'title' => 'Prijsstelling',
            'shortTitle' => 'Prijs',
            'description' => 'Stel uw huurprijs in',
        ],
        'media' => [
            'title' => "Foto's & Details",
            'shortTitle' => 'Media',
            'description' => "Voeg foto's en beschrijving toe",
        ],
        'review' => [
            'title' => 'Controleren',
            'shortTitle' => 'Controleren',
            'description' => 'Controleer en publiceer',
        ],
    ],

    // Property Type Step
    'propertyTypeStep' => [
        'title' => 'Wat voor soort woning biedt u aan?',
        'description' => 'Kies de categorie die uw woning het beste beschrijft',
        'whatKind' => 'Wat voor soort :type?',

        // Property types
        'types' => [
            'apartment' => 'Appartement',
            'apartmentDesc' => "Studio's, duplex, penthouses",
            'house' => 'Huis',
            'houseDesc' => "Vrijstaand, villa's, bungalows",
            'room' => 'Kamer',
            'roomDesc' => 'Privékamers, co-living',
            'commercial' => 'Commercieel',
            'commercialDesc' => 'Kantoren, winkels',
            'industrial' => 'Industrieel',
            'industrialDesc' => 'Magazijnen, fabrieken',
            'parking' => 'Parkeren',
            'parkingDesc' => 'Garages, parkeerplaatsen',
        ],

        // Subtypes
        'subtypes' => [
            'studio' => 'Studio',
            'loft' => 'Loft',
            'duplex' => 'Duplex',
            'triplex' => 'Triplex',
            'penthouse' => 'Penthouse',
            'serviced' => 'Serviceappartement',
            'detached' => 'Vrijstaand huis',
            'semi-detached' => 'Twee-onder-een-kap',
            'villa' => 'Villa',
            'bungalow' => 'Bungalow',
            'private_room' => 'Privékamer',
            'student_room' => 'Studentenkamer',
            'co-living' => 'Co-living ruimte',
            'office' => 'Kantoorruimte',
            'retail' => 'Winkel',
            'warehouse' => 'Magazijn',
            'factory' => 'Fabriek',
            'garage' => 'Garage',
            'indoor_spot' => 'Binnenparkeerplek',
            'outdoor_spot' => 'Buitenparkeerplek',
        ],
    ],

    // Location Step
    'locationStep' => [
        'title' => 'Waar bevindt uw woning zich?',
        'description' => 'Voer het adres in waar de huurders zullen wonen',
        'number' => 'Nummer',
        'streetName' => 'Straatnaam',
        'apartmentSuite' => 'Appartement, Suite, Eenheid',
        'optional' => 'optioneel',
        'city' => 'Stad',
        'postalCode' => 'Postcode',
        'stateRegion' => 'Provincie/Regio',
        'country' => 'Land',
        'privacyNote' => 'Uw exacte adres wordt alleen gedeeld met goedgekeurde aanvragers',

        // Placeholders
        'placeholders' => [
            'number' => '123',
            'streetName' => 'Hoofdstraat',
            'apartmentSuite' => 'App. 4B, 2e verdieping, etc.',
            'city' => 'Amsterdam',
            'postalCode' => '1012',
            'stateRegion' => 'Provincie, Regio, etc.',
        ],

        // Countries
        'countries' => [
            'CH' => 'Zwitserland',
            'DE' => 'Duitsland',
            'FR' => 'Frankrijk',
            'AT' => 'Oostenrijk',
            'IT' => 'Italië',
            'US' => 'Verenigde Staten',
            'GB' => 'Verenigd Koninkrijk',
            'NL' => 'Nederland',
            'BE' => 'België',
            'ES' => 'Spanje',
        ],
    ],

    // Specifications Step
    'specificationsStep' => [
        'title' => 'Vertel ons over de ruimte',
        'description' => 'Deze details helpen huurders de perfecte match te vinden',

        // Section titles
        'sections' => [
            'rooms' => 'Kamers',
            'space' => 'Oppervlakte',
            'parking' => 'Parkeren',
            'building' => 'Gebouw',
        ],

        // Field labels
        'fields' => [
            'bedrooms' => 'Slaapkamers',
            'bathrooms' => 'Badkamers',
            'livingSpace' => 'Woonoppervlakte',
            'balconyTerrace' => 'Balkon/Terras',
            'landSize' => 'Perceelgrootte',
            'indoorSpots' => 'Binnenplaatsen',
            'outdoorSpots' => 'Buitenplaatsen',
            'floorLevel' => 'Verdieping',
            'yearBuilt' => 'Bouwjaar',
            'hasElevator' => 'Lift',
            'parkingSpaceSize' => 'Grootte parkeerplaats',
        ],
    ],

    // Amenities Step
    'amenitiesStep' => [
        'title' => 'Wat biedt uw woning?',
        'description' => 'Selecteer alle inbegrepen kenmerken en voorzieningen',
        'helperText' => 'Maak u geen zorgen als iets niet vermeld staat — u kunt later meer details toevoegen in de beschrijving',

        // Categories
        'categories' => [
            'kitchen' => 'Keuken',
            'building' => 'Gebouwkenmerken',
            'outdoor' => 'Buitenruimtes',
        ],

        // Amenities
        'amenities' => [
            'equippedKitchen' => 'Ingerichte keuken',
            'separateKitchen' => 'Aparte keuken',
            'cellarStorage' => 'Berging/Kelder',
            'laundryRoom' => 'Wasruimte',
            'fireplace' => 'Open haard',
            'airConditioning' => 'Airconditioning',
            'gardenAccess' => 'Tuintoegang',
            'rooftopAccess' => 'Dakterrastoegang',
        ],
    ],

    // Energy Step
    'energyStep' => [
        'title' => 'Energie & Efficiëntie',
        'description' => 'Help milieubewuste huurders uw woning te vinden',
        'optionalNote' => 'Deze stap is optioneel',
        'energyPerformance' => 'Energieprestatieklasse',
        'energyHelp' => 'A+ is het meest efficiënt, G het minst',
        'thermalInsulation' => 'Thermische isolatieklasse',
        'heatingSystem' => 'Verwarmingssysteem',

        // Heating types
        'heatingTypes' => [
            'gas' => 'Gas',
            'electric' => 'Elektrisch',
            'district' => 'Stadsverwarming',
            'heat_pump' => 'Warmtepomp',
            'wood' => 'Hout',
            'other' => 'Anders',
        ],
    ],

    // Pricing Step
    'pricingStep' => [
        'title' => 'Stel uw prijs in',
        'description' => 'Hoeveel vraagt u voor de huur?',
        'perMonth' => '/maand',
        'whenAvailable' => 'Wanneer is het beschikbaar?',
        'availableImmediately' => 'Direct beschikbaar',
        'orChooseDate' => 'of kies een datum',
        'acceptApplications' => 'Aanvragen accepteren?',
        'openForApplications' => 'Open voor aanvragen',
        'startReceiving' => 'Begin met ontvangen van aanvragen',
        'notYet' => 'Nog niet',
        'openLater' => 'Later openen voor aanvragen',
    ],

    // Media Step
    'mediaStep' => [
        'title' => 'Laat het stralen',
        'description' => "Goede foto's en een aansprekende titel trekken meer aanvragers",
        'propertyTitle' => 'Woningtitel',
        'titlePlaceholder' => 'bijv. Zonnig 2-kamer appartement met balkon in centrum',
        'descriptionLabel' => 'Beschrijving',
        'descriptionOptional' => 'optioneel maar aanbevolen',
        'descriptionPlaceholder' => 'Beschrijf wat uw woning speciaal maakt. Noem nabijgelegen voorzieningen, openbaar vervoer en alles wat huurders moeten weten...',
        'propertyPhotos' => "Woningfoto's",
        'main' => 'Hoofdfoto',
        'setAsMain' => 'Instellen als hoofdfoto',
        'addMore' => 'Meer toevoegen',
        'dragToReorder' => 'Sleep om te herordenen. Hover om de hoofdfoto in te stellen.',
        'uploadPhotos' => "Foto's uploaden",
        'clickOrDrag' => 'Klik of sleep afbeeldingen hier',
        'maxSize' => 'Max :size per afbeelding',
        'allowedFormats' => 'JPG, PNG, WebP',
    ],

    // Review Step
    'reviewStep' => [
        'title' => 'Controleer uw advertentie',
        'titleEdit' => 'Uw woningadvertentie',
        'description' => 'Zorg dat alles goed is voordat u publiceert',
        'descriptionEdit' => 'Klik op Bewerken om wijzigingen aan te brengen',
        'fixIssues' => 'Los de volgende problemen op:',
        'edit' => 'Bewerken',
        'morePhotos' => "+:count meer foto's",
        'noPhotos' => "Geen foto's toegevoegd",
        'untitledProperty' => 'Naamloze woning',
        'locationNotSet' => 'Locatie niet ingesteld',
        'perMonth' => '/maand',
        'immediately' => 'Direct',

        // Section titles
        'sections' => [
            'propertyType' => 'Woningtype',
            'location' => 'Locatie',
            'specifications' => 'Specificaties',
            'amenities' => 'Voorzieningen',
            'energy' => 'Energie',
            'pricingAvailability' => 'Prijs & Beschikbaarheid',
            'description' => 'Beschrijving',
        ],

        // Labels
        'labels' => [
            'bedrooms' => ':count Slaapkamers',
            'bedroom' => ':count Slaapkamer',
            'bathrooms' => ':count Badkamers',
            'bathroom' => ':count Badkamer',
            'livingSpace' => ':size m² woonruimte',
            'balcony' => ':size m² balkon',
            'land' => ':size m² perceel',
            'parking' => ':count parkeerplaatsen',
            'floor' => 'Verdieping :level',
            'elevator' => 'Lift',
            'monthlyRent' => 'Maandelijkse huur',
            'available' => 'Beschikbaar',
            'energyClass' => 'Energieklasse:',
            'insulation' => 'Isolatie:',
            'heating' => 'Verwarming:',
        ],

        // Amenity labels (short)
        'amenityLabels' => [
            'equippedKitchen' => 'Ingerichte keuken',
            'separateKitchen' => 'Aparte keuken',
            'cellar' => 'Kelder',
            'laundry' => 'Wasruimte',
            'fireplace' => 'Open haard',
            'airConditioning' => 'Airco',
            'garden' => 'Tuin',
            'rooftop' => 'Dakterras',
        ],

        'finalNote' => 'Door te publiceren bevestigt u dat bovenstaande informatie juist en volledig is.',
    ],
];
