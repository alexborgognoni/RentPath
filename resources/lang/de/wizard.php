<?php

return [
    // Page titles and main UI
    'page' => [
        'addProperty' => 'Neue Immobilie hinzufügen',
        'editProperty' => 'Immobilie bearbeiten',
        'publishListing' => 'Anzeige veröffentlichen',
        'updateListing' => 'Anzeige aktualisieren',
    ],

    // Navigation
    'nav' => [
        'back' => 'Zurück',
        'continue' => 'Weiter',
        'skip' => 'Vorerst überspringen',
        'submit' => 'Absenden',
        'submitting' => 'Wird gesendet...',
    ],

    // Progress
    'progress' => [
        'stepOf' => 'Schritt :current von :total',
        'optional' => '(opt)',
    ],

    // Step titles and descriptions
    'steps' => [
        'propertyType' => [
            'title' => 'Immobilientyp',
            'shortTitle' => 'Typ',
            'description' => 'Welche Art von Immobilie bieten Sie an?',
        ],
        'location' => [
            'title' => 'Standort',
            'shortTitle' => 'Standort',
            'description' => 'Wo befindet sich Ihre Immobilie?',
        ],
        'specifications' => [
            'title' => 'Ausstattung',
            'shortTitle' => 'Details',
            'description' => 'Erzählen Sie uns von den Details',
        ],
        'amenities' => [
            'title' => 'Ausstattung',
            'shortTitle' => 'Ausstattung',
            'description' => 'Welche Merkmale sind enthalten?',
        ],
        'energy' => [
            'title' => 'Energie',
            'shortTitle' => 'Energie',
            'description' => 'Informationen zur Energieeffizienz',
        ],
        'pricing' => [
            'title' => 'Preisgestaltung',
            'shortTitle' => 'Preis',
            'description' => 'Legen Sie Ihren Mietpreis fest',
        ],
        'media' => [
            'title' => 'Fotos & Details',
            'shortTitle' => 'Medien',
            'description' => 'Fügen Sie Fotos und Beschreibung hinzu',
        ],
        'review' => [
            'title' => 'Überprüfung',
            'shortTitle' => 'Prüfen',
            'description' => 'Überprüfen und veröffentlichen',
        ],
    ],

    // Property Type Step
    'propertyTypeStep' => [
        'title' => 'Welche Art von Immobilie bieten Sie an?',
        'description' => 'Wählen Sie die Kategorie, die Ihre Immobilie am besten beschreibt',
        'whatKind' => 'Welche Art von :type?',

        // Property types
        'types' => [
            'apartment' => 'Wohnung',
            'apartmentDesc' => 'Studios, Duplexe, Penthouses',
            'house' => 'Haus',
            'houseDesc' => 'Einfamilienhäuser, Villen, Bungalows',
            'room' => 'Zimmer',
            'roomDesc' => 'Privatzimmer, WG-Zimmer',
            'commercial' => 'Gewerbe',
            'commercialDesc' => 'Büros, Einzelhandel',
            'industrial' => 'Industrie',
            'industrialDesc' => 'Lagerhallen, Fabriken',
            'parking' => 'Parkplatz',
            'parkingDesc' => 'Garagen, Stellplätze',
        ],

        // Subtypes
        'subtypes' => [
            'studio' => 'Studio',
            'loft' => 'Loft',
            'duplex' => 'Maisonette',
            'triplex' => 'Triplex',
            'penthouse' => 'Penthouse',
            'serviced' => 'Serviced Apartment',
            'detached' => 'Einfamilienhaus',
            'semi-detached' => 'Doppelhaushälfte',
            'villa' => 'Villa',
            'bungalow' => 'Bungalow',
            'private_room' => 'Privatzimmer',
            'student_room' => 'Studentenzimmer',
            'co-living' => 'Co-Living',
            'office' => 'Büro',
            'retail' => 'Einzelhandel',
            'warehouse' => 'Lagerhalle',
            'factory' => 'Fabrik',
            'garage' => 'Garage',
            'indoor_spot' => 'Tiefgaragenstellplatz',
            'outdoor_spot' => 'Außenstellplatz',
        ],
    ],

    // Location Step
    'locationStep' => [
        'title' => 'Wo befindet sich Ihre Immobilie?',
        'description' => 'Geben Sie die Adresse ein, an der die Mieter wohnen werden',
        'number' => 'Hausnummer',
        'streetName' => 'Straße',
        'apartmentSuite' => 'Wohnung, Etage, Einheit',
        'optional' => 'optional',
        'city' => 'Stadt',
        'postalCode' => 'Postleitzahl',
        'stateRegion' => 'Bundesland/Region',
        'country' => 'Land',
        'privacyNote' => 'Ihre genaue Adresse wird nur mit genehmigten Bewerbern geteilt',

        // Placeholders
        'placeholders' => [
            'number' => '123',
            'streetName' => 'Hauptstraße',
            'apartmentSuite' => 'Whg. 4B, 2. OG, etc.',
            'city' => 'Berlin',
            'postalCode' => '10115',
            'stateRegion' => 'Bundesland, Kanton, etc.',
        ],

        // Countries
        'countries' => [
            'CH' => 'Schweiz',
            'DE' => 'Deutschland',
            'FR' => 'Frankreich',
            'AT' => 'Österreich',
            'IT' => 'Italien',
            'US' => 'Vereinigte Staaten',
            'GB' => 'Vereinigtes Königreich',
            'NL' => 'Niederlande',
            'BE' => 'Belgien',
            'ES' => 'Spanien',
        ],
    ],

    // Specifications Step
    'specificationsStep' => [
        'title' => 'Erzählen Sie uns vom Raum',
        'description' => 'Diese Details helfen Mietern, das perfekte Objekt zu finden',

        // Section titles
        'sections' => [
            'rooms' => 'Zimmer',
            'space' => 'Fläche',
            'parking' => 'Parkplätze',
            'building' => 'Gebäude',
        ],

        // Field labels
        'fields' => [
            'bedrooms' => 'Schlafzimmer',
            'bathrooms' => 'Badezimmer',
            'livingSpace' => 'Wohnfläche',
            'balconyTerrace' => 'Balkon/Terrasse',
            'landSize' => 'Grundstücksfläche',
            'indoorSpots' => 'Innenstellplätze',
            'outdoorSpots' => 'Außenstellplätze',
            'floorLevel' => 'Etage',
            'yearBuilt' => 'Baujahr',
            'hasElevator' => 'Aufzug',
            'parkingSpaceSize' => 'Stellplatzgröße',
        ],
    ],

    // Amenities Step
    'amenitiesStep' => [
        'title' => 'Was bietet Ihre Immobilie?',
        'description' => 'Wählen Sie alle enthaltenen Merkmale und Ausstattungen',
        'helperText' => 'Keine Sorge, wenn etwas nicht aufgeführt ist — Sie können später in der Beschreibung weitere Details hinzufügen',

        // Categories
        'categories' => [
            'kitchen' => 'Küche',
            'building' => 'Gebäudemerkmale',
            'outdoor' => 'Außenbereiche',
        ],

        // Amenities
        'amenities' => [
            'equippedKitchen' => 'Einbauküche',
            'separateKitchen' => 'Separate Küche',
            'cellarStorage' => 'Kellerabteil',
            'laundryRoom' => 'Waschküche',
            'fireplace' => 'Kamin',
            'airConditioning' => 'Klimaanlage',
            'gardenAccess' => 'Gartenzugang',
            'rooftopAccess' => 'Dachterrassenzugang',
        ],
    ],

    // Energy Step
    'energyStep' => [
        'title' => 'Energie & Effizienz',
        'description' => 'Helfen Sie umweltbewussten Mietern, Ihre Immobilie zu finden',
        'optionalNote' => 'Dieser Schritt ist optional',
        'energyPerformance' => 'Energieeffizienzklasse',
        'energyHelp' => 'A+ ist am effizientesten, G am wenigsten',
        'thermalInsulation' => 'Wärmedämmklasse',
        'heatingSystem' => 'Heizsystem',

        // Heating types
        'heatingTypes' => [
            'gas' => 'Gas',
            'electric' => 'Elektrisch',
            'district' => 'Fernwärme',
            'heat_pump' => 'Wärmepumpe',
            'wood' => 'Holz',
            'other' => 'Sonstige',
        ],
    ],

    // Pricing Step
    'pricingStep' => [
        'title' => 'Legen Sie Ihren Preis fest',
        'description' => 'Wie viel werden Sie für die Miete verlangen?',
        'perMonth' => '/Monat',
        'whenAvailable' => 'Wann ist sie verfügbar?',
        'availableImmediately' => 'Sofort verfügbar',
        'orChooseDate' => 'oder wählen Sie ein Datum',
        'acceptApplications' => 'Bewerbungen annehmen?',
        'openForApplications' => 'Offen für Bewerbungen',
        'startReceiving' => 'Bewerbungen empfangen',
        'notYet' => 'Noch nicht',
        'openLater' => 'Später für Bewerbungen öffnen',
    ],

    // Media Step
    'mediaStep' => [
        'title' => 'Lassen Sie es strahlen',
        'description' => 'Tolle Fotos und ein überzeugender Titel ziehen mehr Bewerber an',
        'propertyTitle' => 'Immobilientitel',
        'titlePlaceholder' => 'z.B. Sonnige 2-Zimmer-Wohnung mit Balkon im Stadtzentrum',
        'descriptionLabel' => 'Beschreibung',
        'descriptionOptional' => 'optional aber empfohlen',
        'descriptionPlaceholder' => 'Beschreiben Sie, was Ihre Immobilie besonders macht. Erwähnen Sie nahegelegene Einrichtungen, Verkehrsanbindung und alles, was Mieter wissen sollten...',
        'propertyPhotos' => 'Immobilienfotos',
        'main' => 'Hauptbild',
        'setAsMain' => 'Als Hauptbild festlegen',
        'addMore' => 'Mehr hinzufügen',
        'dragToReorder' => 'Ziehen zum Neuordnen. Hovern, um das Hauptfoto festzulegen.',
        'uploadPhotos' => 'Fotos hochladen',
        'clickOrDrag' => 'Klicken oder Bilder hierher ziehen',
        'maxSize' => 'Max :size pro Bild',
        'allowedFormats' => 'JPG, PNG, WebP',
    ],

    // Review Step
    'reviewStep' => [
        'title' => 'Überprüfen Sie Ihre Anzeige',
        'titleEdit' => 'Ihre Immobilienanzeige',
        'description' => 'Stellen Sie sicher, dass alles gut aussieht, bevor Sie veröffentlichen',
        'descriptionEdit' => 'Klicken Sie auf Bearbeiten, um Änderungen vorzunehmen',
        'fixIssues' => 'Bitte beheben Sie die folgenden Probleme:',
        'edit' => 'Bearbeiten',
        'morePhotos' => '+:count weitere Fotos',
        'noPhotos' => 'Keine Fotos hinzugefügt',
        'untitledProperty' => 'Unbenannte Immobilie',
        'locationNotSet' => 'Standort nicht festgelegt',
        'perMonth' => '/Monat',
        'immediately' => 'Sofort',

        // Section titles
        'sections' => [
            'propertyType' => 'Immobilientyp',
            'location' => 'Standort',
            'specifications' => 'Ausstattung',
            'amenities' => 'Ausstattung',
            'energy' => 'Energie',
            'pricingAvailability' => 'Preis & Verfügbarkeit',
            'description' => 'Beschreibung',
        ],

        // Labels
        'labels' => [
            'bedrooms' => ':count Schlafzimmer',
            'bedroom' => ':count Schlafzimmer',
            'bathrooms' => ':count Badezimmer',
            'bathroom' => ':count Badezimmer',
            'livingSpace' => ':size m² Wohnfläche',
            'balcony' => ':size m² Balkon',
            'land' => ':size m² Grundstück',
            'parking' => ':count Stellplätze',
            'floor' => 'Etage :level',
            'elevator' => 'Aufzug',
            'monthlyRent' => 'Monatliche Miete',
            'available' => 'Verfügbar',
            'energyClass' => 'Energieklasse:',
            'insulation' => 'Dämmung:',
            'heating' => 'Heizung:',
        ],

        // Amenity labels (short)
        'amenityLabels' => [
            'equippedKitchen' => 'Einbauküche',
            'separateKitchen' => 'Separate Küche',
            'cellar' => 'Keller',
            'laundry' => 'Waschküche',
            'fireplace' => 'Kamin',
            'airConditioning' => 'Klima',
            'garden' => 'Garten',
            'rooftop' => 'Dachterrasse',
        ],

        'finalNote' => 'Mit der Veröffentlichung bestätigen Sie, dass die obigen Angaben korrekt und vollständig sind.',
    ],
];
