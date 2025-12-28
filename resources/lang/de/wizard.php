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

    // ===== Application Wizard =====
    'application' => [
        // Page-level translations
        'page' => [
            'title' => 'Bewerbung für :property',
            'metaTitle' => 'Bewerben für :property',
        ],

        // Sidebar translations
        'sidebar' => [
            'propertyManager' => 'Immobilienverwalter',
            'privateLandlord' => 'Privatvermieter',
            'monthlyRent' => 'Monatsmiete',
            'bedrooms' => 'Schlafzimmer',
            'bathrooms' => 'Badezimmer',
            'size' => 'Größe',
            'parking' => 'Parkplätze',
            'spots' => ':count Stellplatz|:count Stellplätze',
            'available' => 'Verfügbar',
            'allowed' => 'Erlaubt',
            'petsAllowed' => 'Haustiere erlaubt',
            'smokingAllowed' => 'Rauchen erlaubt',
        ],

        // Step titles
        'steps' => [
            'personal' => [
                'title' => 'Persönliche Informationen',
                'shortTitle' => 'Persönlich',
                'description' => 'Erzählen Sie uns von sich',
            ],
            'employment' => [
                'title' => 'Beschäftigung & Einkommen',
                'shortTitle' => 'Beruf',
                'description' => 'Ihre Beschäftigungs- und Einkommensdaten',
            ],
            'details' => [
                'title' => 'Bewerbungsdetails',
                'shortTitle' => 'Details',
                'description' => 'Einzugspräferenzen und Haushalt',
            ],
            'references' => [
                'title' => 'Referenzen',
                'shortTitle' => 'Referenzen',
                'description' => 'Fügen Sie Referenzen hinzu, um Ihre Bewerbung zu stärken',
            ],
            'emergency' => [
                'title' => 'Notfallkontakt',
                'shortTitle' => 'Notfall',
                'description' => 'Notfallkontaktinformationen',
            ],
            'review' => [
                'title' => 'Überprüfen & Absenden',
                'shortTitle' => 'Prüfen',
                'description' => 'Überprüfen und senden Sie Ihre Bewerbung',
            ],
        ],

        // Personal Info Step
        'personalStep' => [
            'title' => 'Persönliche Informationen',
            'description' => 'Ihr Profil wird aktualisiert, wenn Sie diese Bewerbung absenden.',
            'sections' => [
                'currentAddress' => 'Aktuelle Adresse',
                'idDocument' => 'Ausweisdokument (Reisepass, Personalausweis, Führerschein)',
            ],
            'fields' => [
                'dateOfBirth' => 'Geburtsdatum',
                'nationality' => 'Nationalität',
                'phoneNumber' => 'Telefonnummer',
                'streetName' => 'Straßenname',
                'houseNumber' => 'Hausnummer',
                'apartment' => 'Wohnung, Etage, Einheit',
                'city' => 'Stadt',
                'stateProvince' => 'Bundesland/Kanton',
                'postalCode' => 'Postleitzahl',
                'country' => 'Land',
            ],
            'placeholders' => [
                'phone' => '612345678',
                'streetName' => 'Hauptstraße',
                'houseNumber' => '123A',
                'apartment' => 'Whg. 4B, 2. OG',
                'city' => 'Berlin',
            ],
            'fileLabels' => [
                'frontSide' => 'Vorderseite',
                'backSide' => 'Rückseite',
            ],
            'optional' => 'optional',
        ],

        // Employment & Income Step
        'employmentStep' => [
            'title' => 'Beschäftigung & Einkommen',
            'description' => 'Diese Informationen helfen Vermietern, Ihre Zahlungsfähigkeit einzuschätzen. Sie werden in Ihrem Profil gespeichert.',
            'fields' => [
                'employmentStatus' => 'Beschäftigungsstatus',
                'employerName' => 'Arbeitgebername',
                'jobTitle' => 'Berufsbezeichnung',
                'employmentType' => 'Beschäftigungsart',
                'employmentStartDate' => 'Beschäftigungsbeginn',
                'monthlyIncomeGross' => 'Monatliches Einkommen (Brutto)',
                'monthlyIncome' => 'Monatliches Einkommen',
                'university' => 'Universität / Hochschule',
                'programOfStudy' => 'Studiengang',
                'expectedGraduation' => 'Voraussichtlicher Abschluss',
                'incomeSource' => 'Einkommensquelle',
            ],
            'placeholders' => [
                'employerName' => 'Beispiel GmbH',
                'jobTitle' => 'Softwareentwickler',
                'university' => 'Universität Berlin',
                'program' => 'Informatik',
                'incomeSource' => 'Stipendium, Nebenjob, Eltern',
                'income' => '3500',
                'incomeZero' => '0',
            ],
            'employmentStatuses' => [
                'employed' => 'Angestellt',
                'self_employed' => 'Selbstständig',
                'student' => 'Student',
                'unemployed' => 'Arbeitslos',
                'retired' => 'Rentner',
            ],
            'employmentTypes' => [
                'full_time' => 'Vollzeit',
                'part_time' => 'Teilzeit',
                'contract' => 'Befristet',
                'temporary' => 'Zeitarbeit',
            ],
            'guarantor' => [
                'title' => 'Ich habe einen Bürgen',
                'description' => 'Ein Bürge ist jemand, der sich bereit erklärt, Ihre Miete zu zahlen, wenn Sie es nicht können. Dies wird oft für Studenten oder Erstmieter verlangt.',
                'name' => 'Name des Bürgen',
                'relationship' => 'Beziehung',
                'phone' => 'Telefon des Bürgen',
                'email' => 'E-Mail des Bürgen',
                'address' => 'Adresse des Bürgen',
                'employer' => 'Arbeitgeber des Bürgen',
                'monthlyIncome' => 'Monatliches Einkommen des Bürgen',
                'placeholders' => [
                    'name' => 'Max Mustermann',
                    'phone' => '+49 612345678',
                    'email' => 'buerge@beispiel.de',
                    'address' => 'Hauptstraße 123, Berlin, 10115, Deutschland',
                    'employer' => 'Firmenname',
                    'income' => '5000',
                ],
                'relationships' => [
                    'parent' => 'Elternteil',
                    'grandparent' => 'Großelternteil',
                    'sibling' => 'Geschwister',
                    'spouse' => 'Ehepartner',
                    'partner' => 'Partner',
                    'other_family' => 'Andere Familie',
                    'friend' => 'Freund',
                    'employer' => 'Arbeitgeber',
                    'other' => 'Andere',
                ],
            ],
            'documents' => [
                'employmentContract' => 'Arbeitsvertrag',
                'payslip1' => 'Aktuelle Gehaltsabrechnung (1)',
                'payslip2' => 'Aktuelle Gehaltsabrechnung (2)',
                'payslip3' => 'Aktuelle Gehaltsabrechnung (3)',
                'studentProof' => 'Studentennachweis',
                'studentProofDesc' => 'Immatrikulationsbescheinigung, Studentenausweis',
                'pensionProof' => 'Rentennachweis',
                'otherIncomeProof' => 'Einkommensnachweis',
                'otherIncomeProofDesc' => 'Bescheide, Kontoauszüge usw.',
                'guarantorId' => 'Ausweis des Bürgen',
                'guarantorIncomeProof' => 'Einkommensnachweis des Bürgen',
            ],
        ],

        // Details Step
        'detailsStep' => [
            'title' => 'Bewerbungsdetails',
            'fields' => [
                'moveInDate' => 'Gewünschtes Einzugsdatum',
                'leaseDuration' => 'Gewünschte Mietdauer (Monate)',
                'messageToLandlord' => 'Nachricht an den Vermieter',
            ],
            'placeholders' => [
                'message' => 'Stellen Sie sich vor und erklären Sie, warum Sie an dieser Immobilie interessiert sind...',
            ],
            'occupants' => [
                'title' => 'Bewohner',
                'description' => 'Sie (der Bewerber) sind automatisch eingeschlossen. Fügen Sie unten weitere Bewohner hinzu.',
                'occupant' => 'Bewohner :index',
                'name' => 'Name',
                'age' => 'Alter',
                'relationship' => 'Beziehung',
                'specifyRelationship' => 'Bitte Beziehung angeben',
                'addOccupant' => 'Bewohner hinzufügen',
                'placeholder' => 'Beziehung eingeben...',
                'relationships' => [
                    'spouse' => 'Ehepartner',
                    'partner' => 'Partner',
                    'child' => 'Kind',
                    'parent' => 'Elternteil',
                    'sibling' => 'Geschwister',
                    'roommate' => 'Mitbewohner',
                    'other' => 'Andere',
                ],
            ],
            'pets' => [
                'title' => 'Haustiere',
                'hasPets' => 'Ich habe Haustiere',
                'pet' => 'Haustier :index',
                'type' => 'Art',
                'breed' => 'Rasse',
                'age' => 'Alter',
                'weight' => 'Gewicht',
                'specifyType' => 'Bitte Tierart angeben',
                'addPet' => 'Haustier hinzufügen',
                'placeholder' => 'Tierart eingeben...',
                'atLeastOneRequired' => 'Mindestens ein Haustier erforderlich',
                'types' => [
                    'dog' => 'Hund',
                    'cat' => 'Katze',
                    'bird' => 'Vogel',
                    'fish' => 'Fisch',
                    'rabbit' => 'Kaninchen',
                    'hamster' => 'Hamster',
                    'guinea_pig' => 'Meerschweinchen',
                    'reptile' => 'Reptil',
                    'other' => 'Andere',
                ],
            ],
            'characters' => ':count/:max Zeichen',
            'optional' => 'optional',
        ],

        // References Step
        'referencesStep' => [
            'title' => 'Referenzen',
            'description' => 'Fügen Sie Referenzen hinzu, um Ihre Bewerbung zu stärken. Vermieterreferenzen sind besonders wertvoll.',
            'landlord' => [
                'title' => 'Vermieterreferenzen',
                'recommended' => 'Empfohlen',
                'description' => 'Eine Referenz von einem früheren Vermieter hilft, Ihre Miethistorie zu verifizieren.',
                'empty' => 'Noch keine Vermieterreferenzen hinzugefügt.',
                'add' => 'Vermieterreferenz hinzufügen',
                'relationships' => [
                    'previous_landlord' => 'Früherer Vermieter',
                    'property_manager' => 'Hausverwalter',
                    'other' => 'Andere',
                ],
            ],
            'other' => [
                'title' => 'Weitere Referenzen',
                'optional' => 'Optional',
                'description' => 'Fügen Sie persönliche oder berufliche Referenzen hinzu, die für Ihren Charakter und Ihre Zuverlässigkeit bürgen können.',
                'empty' => 'Noch keine weiteren Referenzen hinzugefügt.',
                'addProfessional' => 'Berufliche Referenz hinzufügen',
                'addPersonal' => 'Persönliche Referenz hinzufügen',
            ],
            'personal' => [
                'relationships' => [
                    'friend' => 'Freund',
                    'neighbor' => 'Nachbar',
                    'family_friend' => 'Familienfreund',
                    'other' => 'Andere',
                ],
            ],
            'professional' => [
                'relationships' => [
                    'employer' => 'Arbeitgeber',
                    'manager' => 'Vorgesetzter',
                    'colleague' => 'Kollege',
                    'professor' => 'Professor',
                    'teacher' => 'Lehrer',
                    'mentor' => 'Mentor',
                    'other' => 'Andere',
                ],
            ],
            'fields' => [
                'name' => 'Name',
                'relationship' => 'Beziehung',
                'specify' => 'Bitte angeben',
                'phone' => 'Telefon',
                'email' => 'E-Mail',
                'yearsKnown' => 'Jahre bekannt',
            ],
            'placeholder' => 'Beziehung eingeben...',
            'summary' => ':count Referenz hinzugefügt|:count Referenzen hinzugefügt',
            'summaryDetail' => '(:landlord Vermieter, :other andere)',
        ],

        // Emergency Step
        'emergencyStep' => [
            'title' => 'Notfallkontakt',
            'descriptionWithProfile' => 'Sie können den Notfallkontakt aus Ihrem Profil verwenden oder einen anderen für diese Bewerbung angeben.',
            'descriptionNoProfile' => 'Geben Sie einen Notfallkontakt für diese Bewerbung an.',
            'fields' => [
                'name' => 'Name',
                'phone' => 'Telefon',
                'relationship' => 'Beziehung',
            ],
            'placeholder' => 'Elternteil, Geschwister...',
        ],

        // Review Step
        'reviewStep' => [
            'title' => 'Überprüfen Sie Ihre Bewerbung',
            'description' => 'Bitte überprüfen Sie alle Informationen vor dem Absenden. Klicken Sie auf "Bearbeiten", um Änderungen vorzunehmen.',
            'edit' => 'Bearbeiten',
            'sections' => [
                'personal' => 'Persönliche Informationen',
                'employment' => 'Beschäftigung & Einkommen',
                'details' => 'Bewerbungsdetails',
                'references' => 'Referenzen',
                'emergency' => 'Notfallkontakt',
            ],
            'labels' => [
                'dateOfBirth' => 'Geburtsdatum',
                'nationality' => 'Nationalität',
                'phone' => 'Telefon',
                'currentAddress' => 'Aktuelle Adresse',
                'employmentStatus' => 'Beschäftigungsstatus',
                'employer' => 'Arbeitgeber',
                'jobTitle' => 'Berufsbezeichnung',
                'monthlyIncome' => 'Monatliches Einkommen',
                'employmentType' => 'Beschäftigungsart',
                'startDate' => 'Startdatum',
                'university' => 'Universität',
                'program' => 'Studiengang',
                'expectedGraduation' => 'Voraussichtlicher Abschluss',
                'incomeSource' => 'Einkommensquelle',
                'documents' => 'Dokumente',
                'guarantor' => 'Bürge',
                'moveInDate' => 'Gewünschtes Einzugsdatum',
                'leaseDuration' => 'Mietdauer',
                'additionalOccupants' => 'Weitere Bewohner',
                'pets' => 'Haustiere',
                'messageToLandlord' => 'Nachricht an den Vermieter',
                'previousLandlord' => 'Vermieterreferenzen',
                'personalReferences' => 'Persönliche Referenzen',
                'professionalReferences' => 'Berufliche Referenzen',
                'yearsKnown' => 'Jahre bekannt',
                'age' => 'Alter: :age',
                'name' => 'Name',
                'email' => 'E-Mail',
                'relationship' => 'Beziehung',
            ],
            'documentBadges' => [
                'idFront' => 'Ausweis Vorne',
                'idBack' => 'Ausweis Hinten',
                'employmentContract' => 'Arbeitsvertrag',
                'payslip1' => 'Gehalt 1',
                'payslip2' => 'Gehalt 2',
                'payslip3' => 'Gehalt 3',
                'studentProof' => 'Studentennachweis',
                'otherIncomeProof' => 'Einkommensnachweis',
                'guarantorId' => 'Bürgen-ID',
                'guarantorIncomeProof' => 'Bürgen-Einkommen',
            ],
            'notProvided' => 'Nicht angegeben',
            'noPreviousLandlord' => 'Kein früherer Vermieter angegeben',
            'noReferences' => 'Keine Referenzen angegeben',
            'noEmergencyContact' => 'Kein Notfallkontakt angegeben',
            'months' => ':count Monat|:count Monate',
            'confirmation' => [
                'title' => 'Bereit zum Absenden',
                'description' => 'Mit dem Absenden dieser Bewerbung bestätigen Sie, dass alle angegebenen Informationen korrekt und vollständig sind. Ihre Profildaten werden für zukünftige Bewerbungen gespeichert.',
            ],
        ],

        // Navigation
        'nav' => [
            'submitApplication' => 'Bewerbung absenden',
            'submitting' => 'Wird gesendet...',
        ],
    ],
];
