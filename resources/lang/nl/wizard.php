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

    // ===== Application Wizard =====
    'application' => [
        // Page-level translations
        'page' => [
            'title' => 'Aanvraag voor :property',
            'metaTitle' => 'Solliciteren voor :property',
        ],

        // Sidebar translations
        'sidebar' => [
            'propertyManager' => 'Vastgoedbeheerder',
            'privateLandlord' => 'Particuliere verhuurder',
            'monthlyRent' => 'Maandelijkse huur',
            'bedrooms' => 'Slaapkamers',
            'bathrooms' => 'Badkamers',
            'size' => 'Oppervlakte',
            'parking' => 'Parkeren',
            'spots' => ':count plek|:count plekken',
            'available' => 'Beschikbaar',
            'allowed' => 'Toegestaan',
            'petsAllowed' => 'Huisdieren toegestaan',
            'smokingAllowed' => 'Roken toegestaan',
        ],

        // Step titles
        'steps' => [
            'personal' => [
                'title' => 'Persoonlijke gegevens',
                'shortTitle' => 'Persoonlijk',
                'description' => 'Vertel ons over uzelf',
            ],
            'employment' => [
                'title' => 'Werk & Inkomen',
                'shortTitle' => 'Werk',
                'description' => 'Uw werk- en inkomensgegevens',
            ],
            'details' => [
                'title' => 'Aanvraagdetails',
                'shortTitle' => 'Details',
                'description' => 'Verhuisvoorkeuren en huishouden',
            ],
            'references' => [
                'title' => 'Referenties',
                'shortTitle' => 'Referenties',
                'description' => 'Voeg referenties toe om uw aanvraag te versterken',
            ],
            'emergency' => [
                'title' => 'Noodcontact',
                'shortTitle' => 'Nood',
                'description' => 'Noodcontactgegevens',
            ],
            'review' => [
                'title' => 'Controleren & Versturen',
                'shortTitle' => 'Controleren',
                'description' => 'Controleer en verstuur uw aanvraag',
            ],
        ],

        // Personal Info Step
        'personalStep' => [
            'title' => 'Persoonlijke gegevens',
            'description' => 'Uw profiel wordt bijgewerkt wanneer u deze aanvraag verstuurt.',
            'sections' => [
                'currentAddress' => 'Huidig adres',
                'idDocument' => 'Identiteitsbewijs (Paspoort, ID-kaart, Rijbewijs)',
            ],
            'fields' => [
                'dateOfBirth' => 'Geboortedatum',
                'nationality' => 'Nationaliteit',
                'phoneNumber' => 'Telefoonnummer',
                'streetName' => 'Straatnaam',
                'houseNumber' => 'Huisnummer',
                'apartment' => 'Appartement, Suite, Eenheid',
                'city' => 'Stad',
                'stateProvince' => 'Provincie',
                'postalCode' => 'Postcode',
                'country' => 'Land',
            ],
            'placeholders' => [
                'phone' => '612345678',
                'streetName' => 'Kalverstraat',
                'houseNumber' => '123A',
                'apartment' => 'App. 4B, 2e verdieping',
                'city' => 'Amsterdam',
            ],
            'fileLabels' => [
                'frontSide' => 'Voorkant',
                'backSide' => 'Achterkant',
            ],
            'optional' => 'optioneel',
        ],

        // Employment & Income Step
        'employmentStep' => [
            'title' => 'Werk & Inkomen',
            'description' => 'Deze informatie helpt verhuurders uw betalingscapaciteit te beoordelen. Het wordt opgeslagen in uw profiel.',
            'fields' => [
                'employmentStatus' => 'Werkstatus',
                'employerName' => 'Werkgevernaam',
                'jobTitle' => 'Functietitel',
                'employmentType' => 'Dienstverband',
                'employmentStartDate' => 'Startdatum dienstverband',
                'monthlyIncomeGross' => 'Maandelijks inkomen (Bruto)',
                'monthlyIncome' => 'Maandelijks inkomen',
                'university' => 'Universiteit / Hogeschool',
                'programOfStudy' => 'Studierichting',
                'expectedGraduation' => 'Verwachte afstudeerdatum',
                'incomeSource' => 'Inkomensbron',
            ],
            'placeholders' => [
                'employerName' => 'Voorbeeld BV',
                'jobTitle' => 'Software Developer',
                'university' => 'Universiteit van Amsterdam',
                'program' => 'Informatica',
                'incomeSource' => 'Studiefinanciering, Bijbaan, Ouders',
                'income' => '3500',
                'incomeZero' => '0',
            ],
            'employmentStatuses' => [
                'employed' => 'In loondienst',
                'self_employed' => 'Zelfstandig',
                'student' => 'Student',
                'unemployed' => 'Werkloos',
                'retired' => 'Gepensioneerd',
            ],
            'employmentTypes' => [
                'full_time' => 'Voltijd',
                'part_time' => 'Deeltijd',
                'contract' => 'Contract',
                'temporary' => 'Tijdelijk',
            ],
            'guarantor' => [
                'title' => 'Ik heb een borg',
                'description' => 'Een borg is iemand die akkoord gaat om uw huur te betalen als u dat niet kunt. Dit wordt vaak gevraagd voor studenten of eerste huurders.',
                'name' => 'Naam borg',
                'relationship' => 'Relatie',
                'phone' => 'Telefoon borg',
                'email' => 'E-mail borg',
                'address' => 'Adres borg',
                'employer' => 'Werkgever borg',
                'monthlyIncome' => 'Maandelijks inkomen borg',
                'placeholders' => [
                    'name' => 'Jan Jansen',
                    'phone' => '+31 612345678',
                    'email' => 'borg@voorbeeld.nl',
                    'address' => 'Hoofdstraat 123, Amsterdam, 1012 AB, Nederland',
                    'employer' => 'Bedrijfsnaam',
                    'income' => '5000',
                ],
                'relationships' => [
                    'parent' => 'Ouder',
                    'grandparent' => 'Grootouder',
                    'sibling' => 'Broer/Zus',
                    'spouse' => 'Echtgenoot',
                    'partner' => 'Partner',
                    'other_family' => 'Overige familie',
                    'friend' => 'Vriend',
                    'employer' => 'Werkgever',
                    'other' => 'Anders',
                ],
            ],
            'documents' => [
                'employmentContract' => 'Arbeidsovereenkomst',
                'payslip1' => 'Recente loonstrook (1)',
                'payslip2' => 'Recente loonstrook (2)',
                'payslip3' => 'Recente loonstrook (3)',
                'studentProof' => 'Bewijs van studentenstatus',
                'studentProofDesc' => 'inschrijvingsbewijs, studentenkaart',
                'pensionProof' => 'Pensioenbewijs',
                'otherIncomeProof' => 'Inkomensbewijs',
                'otherIncomeProofDesc' => 'uitkeringsspecificatie, bankafschriften, etc.',
                'guarantorId' => 'ID-bewijs borg',
                'guarantorIncomeProof' => 'Inkomensbewijs borg',
            ],
        ],

        // Details Step
        'detailsStep' => [
            'title' => 'Aanvraagdetails',
            'fields' => [
                'moveInDate' => 'Gewenste verhuisdatum',
                'leaseDuration' => 'Gewenste huurtermijn (maanden)',
                'messageToLandlord' => 'Bericht aan verhuurder',
            ],
            'placeholders' => [
                'message' => 'Stel uzelf voor en leg uit waarom u geïnteresseerd bent in deze woning...',
            ],
            'occupants' => [
                'title' => 'Bewoners',
                'description' => 'U (de aanvrager) wordt automatisch meegeteld. Voeg hieronder eventuele extra bewoners toe.',
                'occupant' => 'Bewoner :index',
                'name' => 'Naam',
                'age' => 'Leeftijd',
                'relationship' => 'Relatie',
                'specifyRelationship' => 'Specificeer relatie',
                'addOccupant' => 'Bewoner toevoegen',
                'placeholder' => 'Voer relatie in...',
                'relationships' => [
                    'spouse' => 'Echtgenoot',
                    'partner' => 'Partner',
                    'child' => 'Kind',
                    'parent' => 'Ouder',
                    'sibling' => 'Broer/Zus',
                    'roommate' => 'Huisgenoot',
                    'other' => 'Anders',
                ],
            ],
            'pets' => [
                'title' => 'Huisdieren',
                'hasPets' => 'Ik heb huisdieren',
                'pet' => 'Huisdier :index',
                'type' => 'Type',
                'breed' => 'Ras',
                'age' => 'Leeftijd',
                'weight' => 'Gewicht',
                'specifyType' => 'Specificeer diersoort',
                'addPet' => 'Huisdier toevoegen',
                'placeholder' => 'Voer diersoort in...',
                'atLeastOneRequired' => 'Minimaal één huisdier vereist',
                'types' => [
                    'dog' => 'Hond',
                    'cat' => 'Kat',
                    'bird' => 'Vogel',
                    'fish' => 'Vis',
                    'rabbit' => 'Konijn',
                    'hamster' => 'Hamster',
                    'guinea_pig' => 'Cavia',
                    'reptile' => 'Reptiel',
                    'other' => 'Anders',
                ],
            ],
            'characters' => ':count/:max tekens',
            'optional' => 'optioneel',
        ],

        // References Step
        'referencesStep' => [
            'title' => 'Referenties',
            'description' => 'Voeg referenties toe om uw aanvraag te versterken. Verhuurdersreferenties zijn bijzonder waardevol.',
            'landlord' => [
                'title' => 'Verhuurdersreferenties',
                'recommended' => 'Aanbevolen',
                'description' => 'Een referentie van een vorige verhuurder helpt uw huurgeschiedenis te verifiëren.',
                'empty' => 'Nog geen verhuurdersreferenties toegevoegd.',
                'add' => 'Verhuurdersreferentie toevoegen',
                'relationships' => [
                    'previous_landlord' => 'Vorige verhuurder',
                    'property_manager' => 'Vastgoedbeheerder',
                    'other' => 'Anders',
                ],
            ],
            'other' => [
                'title' => 'Overige referenties',
                'optional' => 'Optioneel',
                'description' => 'Voeg persoonlijke of professionele referenties toe die kunnen getuigen van uw karakter en betrouwbaarheid.',
                'empty' => 'Nog geen overige referenties toegevoegd.',
                'addProfessional' => 'Professionele referentie toevoegen',
                'addPersonal' => 'Persoonlijke referentie toevoegen',
            ],
            'personal' => [
                'relationships' => [
                    'friend' => 'Vriend',
                    'neighbor' => 'Buur',
                    'family_friend' => 'Familievriend',
                    'other' => 'Anders',
                ],
            ],
            'professional' => [
                'relationships' => [
                    'employer' => 'Werkgever',
                    'manager' => 'Manager',
                    'colleague' => 'Collega',
                    'professor' => 'Professor',
                    'teacher' => 'Docent',
                    'mentor' => 'Mentor',
                    'other' => 'Anders',
                ],
            ],
            'fields' => [
                'name' => 'Naam',
                'relationship' => 'Relatie',
                'specify' => 'Specificeer',
                'phone' => 'Telefoon',
                'email' => 'E-mail',
                'yearsKnown' => 'Jaren bekend',
            ],
            'placeholder' => 'Voer relatie in...',
            'summary' => ':count referentie toegevoegd|:count referenties toegevoegd',
            'summaryDetail' => '(:landlord verhuurder, :other overig)',
        ],

        // Emergency Step
        'emergencyStep' => [
            'title' => 'Noodcontact',
            'descriptionWithProfile' => 'U kunt het noodcontact uit uw profiel gebruiken of een ander opgeven voor deze aanvraag.',
            'descriptionNoProfile' => 'Geef een noodcontact op voor deze aanvraag.',
            'fields' => [
                'name' => 'Naam',
                'phone' => 'Telefoon',
                'relationship' => 'Relatie',
            ],
            'placeholder' => 'Ouder, Broer/Zus...',
        ],

        // Review Step
        'reviewStep' => [
            'title' => 'Controleer uw aanvraag',
            'description' => 'Controleer alle informatie voordat u verstuurt. Klik op "Bewerken" om wijzigingen aan te brengen.',
            'edit' => 'Bewerken',
            'sections' => [
                'personal' => 'Persoonlijke gegevens',
                'employment' => 'Werk & Inkomen',
                'details' => 'Aanvraagdetails',
                'references' => 'Referenties',
                'emergency' => 'Noodcontact',
            ],
            'labels' => [
                'dateOfBirth' => 'Geboortedatum',
                'nationality' => 'Nationaliteit',
                'phone' => 'Telefoon',
                'currentAddress' => 'Huidig adres',
                'employmentStatus' => 'Werkstatus',
                'employer' => 'Werkgever',
                'jobTitle' => 'Functie',
                'monthlyIncome' => 'Maandelijks inkomen',
                'employmentType' => 'Dienstverband',
                'startDate' => 'Startdatum',
                'university' => 'Universiteit',
                'program' => 'Studierichting',
                'expectedGraduation' => 'Verwachte afstuderen',
                'incomeSource' => 'Inkomensbron',
                'documents' => 'Documenten',
                'guarantor' => 'Borg',
                'moveInDate' => 'Gewenste verhuisdatum',
                'leaseDuration' => 'Huurtermijn',
                'additionalOccupants' => 'Extra bewoners',
                'pets' => 'Huisdieren',
                'messageToLandlord' => 'Bericht aan verhuurder',
                'previousLandlord' => 'Verhuurdersreferenties',
                'personalReferences' => 'Persoonlijke referenties',
                'professionalReferences' => 'Professionele referenties',
                'yearsKnown' => 'Jaren bekend',
                'age' => 'Leeftijd: :age',
                'name' => 'Naam',
                'email' => 'E-mail',
                'relationship' => 'Relatie',
            ],
            'documentBadges' => [
                'idFront' => 'ID Voorkant',
                'idBack' => 'ID Achterkant',
                'employmentContract' => 'Arbeidsovereenkomst',
                'payslip1' => 'Loonstrook 1',
                'payslip2' => 'Loonstrook 2',
                'payslip3' => 'Loonstrook 3',
                'studentProof' => 'Studentenbewijs',
                'otherIncomeProof' => 'Inkomensbewijs',
                'guarantorId' => 'Borg ID',
                'guarantorIncomeProof' => 'Borg Inkomen',
            ],
            'notProvided' => 'Niet opgegeven',
            'noPreviousLandlord' => 'Geen vorige verhuurder opgegeven',
            'noReferences' => 'Geen referenties opgegeven',
            'noEmergencyContact' => 'Geen noodcontact opgegeven',
            'months' => ':count maand|:count maanden',
            'confirmation' => [
                'title' => 'Klaar om te versturen',
                'description' => 'Door deze aanvraag te versturen, bevestigt u dat alle verstrekte informatie juist en volledig is. Uw profielgegevens worden opgeslagen voor toekomstige aanvragen.',
            ],
        ],

        // Navigation
        'nav' => [
            'submitApplication' => 'Aanvraag versturen',
            'submitting' => 'Bezig met versturen...',
        ],
    ],
];
