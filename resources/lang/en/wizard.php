<?php

return [
    // Page titles and main UI
    'page' => [
        'addProperty' => 'Add New Property',
        'editProperty' => 'Edit Property',
        'publishListing' => 'Publish Listing',
        'updateListing' => 'Update Listing',
    ],

    // Navigation
    'nav' => [
        'back' => 'Back',
        'continue' => 'Continue',
        'skip' => 'Skip for now',
        'submit' => 'Submit',
        'submitting' => 'Submitting...',
    ],

    // Progress
    'progress' => [
        'stepOf' => 'Step :current of :total',
        'optional' => '(opt)',
    ],

    // Step titles and descriptions
    'steps' => [
        'propertyType' => [
            'title' => 'Property Type',
            'shortTitle' => 'Type',
            'description' => 'What kind of property are you listing?',
        ],
        'location' => [
            'title' => 'Location',
            'shortTitle' => 'Location',
            'description' => 'Where is your property located?',
        ],
        'specifications' => [
            'title' => 'Specifications',
            'shortTitle' => 'Specs',
            'description' => 'Tell us about the details',
        ],
        'amenities' => [
            'title' => 'Amenities',
            'shortTitle' => 'Amenities',
            'description' => 'What features does it include?',
        ],
        'energy' => [
            'title' => 'Energy',
            'shortTitle' => 'Energy',
            'description' => 'Energy efficiency information',
        ],
        'pricing' => [
            'title' => 'Pricing',
            'shortTitle' => 'Pricing',
            'description' => 'Set your rental price',
        ],
        'media' => [
            'title' => 'Photos & Details',
            'shortTitle' => 'Media',
            'description' => 'Add photos and description',
        ],
        'review' => [
            'title' => 'Review',
            'shortTitle' => 'Review',
            'description' => 'Review and publish',
        ],
    ],

    // Property Type Step
    'propertyTypeStep' => [
        'title' => 'What type of property are you listing?',
        'description' => 'Choose the category that best describes your property',
        'whatKind' => 'What kind of :type?',

        // Property types
        'types' => [
            'apartment' => 'Apartment',
            'apartmentDesc' => 'Flats, studios, penthouses',
            'house' => 'House',
            'houseDesc' => 'Detached, villas, bungalows',
            'room' => 'Room',
            'roomDesc' => 'Private rooms, co-living',
            'commercial' => 'Commercial',
            'commercialDesc' => 'Offices, retail spaces',
            'industrial' => 'Industrial',
            'industrialDesc' => 'Warehouses, factories',
            'parking' => 'Parking',
            'parkingDesc' => 'Garages, parking spots',
        ],

        // Subtypes
        'subtypes' => [
            'studio' => 'Studio',
            'loft' => 'Loft',
            'duplex' => 'Duplex',
            'triplex' => 'Triplex',
            'penthouse' => 'Penthouse',
            'serviced' => 'Serviced Apartment',
            'detached' => 'Detached House',
            'semi-detached' => 'Semi-detached',
            'villa' => 'Villa',
            'bungalow' => 'Bungalow',
            'private_room' => 'Private Room',
            'student_room' => 'Student Room',
            'co-living' => 'Co-living Space',
            'office' => 'Office Space',
            'retail' => 'Retail Shop',
            'warehouse' => 'Warehouse',
            'factory' => 'Factory',
            'garage' => 'Garage',
            'indoor_spot' => 'Indoor Parking Spot',
            'outdoor_spot' => 'Outdoor Parking Spot',
        ],
    ],

    // Location Step
    'locationStep' => [
        'title' => 'Where is your property located?',
        'description' => 'Enter the address where tenants will live',
        'number' => 'Number',
        'streetName' => 'Street Name',
        'apartmentSuite' => 'Apartment, Suite, Unit',
        'optional' => 'optional',
        'city' => 'City',
        'postalCode' => 'Postal Code',
        'stateRegion' => 'State/Region',
        'country' => 'Country',
        'privacyNote' => 'Your exact address will only be shared with approved applicants',

        // Placeholders
        'placeholders' => [
            'number' => '123',
            'streetName' => 'Main Street',
            'apartmentSuite' => 'Apt 4B, Floor 2, etc.',
            'city' => 'Zurich',
            'postalCode' => '8001',
            'stateRegion' => 'Canton, State, etc.',
        ],

        // Countries
        'countries' => [
            'CH' => 'Switzerland',
            'DE' => 'Germany',
            'FR' => 'France',
            'AT' => 'Austria',
            'IT' => 'Italy',
            'US' => 'United States',
            'GB' => 'United Kingdom',
            'NL' => 'Netherlands',
            'BE' => 'Belgium',
            'ES' => 'Spain',
        ],
    ],

    // Specifications Step
    'specificationsStep' => [
        'title' => 'Tell us about the space',
        'description' => 'These details help tenants find the perfect match',

        // Section titles
        'sections' => [
            'rooms' => 'Rooms',
            'space' => 'Space',
            'parking' => 'Parking',
            'building' => 'Building',
        ],

        // Field labels
        'fields' => [
            'bedrooms' => 'Bedrooms',
            'bathrooms' => 'Bathrooms',
            'livingSpace' => 'Living Space',
            'balconyTerrace' => 'Balcony/Terrace',
            'landSize' => 'Land Size',
            'indoorSpots' => 'Indoor Spots',
            'outdoorSpots' => 'Outdoor Spots',
            'floorLevel' => 'Floor Level',
            'yearBuilt' => 'Year Built',
            'hasElevator' => 'Has Elevator',
            'parkingSpaceSize' => 'Parking Space Size',
        ],
    ],

    // Amenities Step
    'amenitiesStep' => [
        'title' => 'What does your property offer?',
        'description' => 'Select all the features and amenities included',
        'helperText' => "Don't worry if something isn't listed — you can add more details in the description later",

        // Categories
        'categories' => [
            'kitchen' => 'Kitchen',
            'building' => 'Building Features',
            'outdoor' => 'Outdoor Spaces',
        ],

        // Amenities
        'amenities' => [
            'equippedKitchen' => 'Equipped Kitchen',
            'separateKitchen' => 'Separate Kitchen',
            'cellarStorage' => 'Cellar Storage',
            'laundryRoom' => 'Laundry Room',
            'fireplace' => 'Fireplace',
            'airConditioning' => 'Air Conditioning',
            'gardenAccess' => 'Garden Access',
            'rooftopAccess' => 'Rooftop Access',
        ],
    ],

    // Energy Step
    'energyStep' => [
        'title' => 'Energy & Efficiency',
        'description' => 'Help eco-conscious tenants find your property',
        'optionalNote' => 'This step is optional',
        'energyPerformance' => 'Energy Performance Rating',
        'energyHelp' => 'A+ is the most efficient, G is the least',
        'thermalInsulation' => 'Thermal Insulation Rating',
        'heatingSystem' => 'Heating System',

        // Heating types
        'heatingTypes' => [
            'gas' => 'Gas',
            'electric' => 'Electric',
            'district' => 'District Heating',
            'heat_pump' => 'Heat Pump',
            'wood' => 'Wood',
            'other' => 'Other',
        ],
    ],

    // Pricing Step
    'pricingStep' => [
        'title' => 'Set your pricing',
        'description' => 'How much will you charge for rent?',
        'perMonth' => '/month',
        'whenAvailable' => 'When is it available?',
        'availableImmediately' => 'Available Immediately',
        'orChooseDate' => 'or choose a date',
        'acceptApplications' => 'Accept applications?',
        'openForApplications' => 'Open for applications',
        'startReceiving' => 'Start receiving applications',
        'notYet' => 'Not yet',
        'openLater' => 'Open for applications later',
    ],

    // Media Step
    'mediaStep' => [
        'title' => 'Make it shine',
        'description' => 'Great photos and a compelling title attract more applicants',
        'propertyTitle' => 'Property Title',
        'titlePlaceholder' => 'e.g., Sunny 2BR Apartment with Balcony in City Center',
        'descriptionLabel' => 'Description',
        'descriptionOptional' => 'optional but recommended',
        'descriptionPlaceholder' => 'Describe what makes your property special. Mention nearby amenities, transport links, and anything else tenants should know...',
        'propertyPhotos' => 'Property Photos',
        'main' => 'Main',
        'setAsMain' => 'Set as main',
        'addMore' => 'Add more',
        'dragToReorder' => 'Drag to reorder. Hover to set the main photo.',
        'uploadPhotos' => 'Upload property photos',
        'clickOrDrag' => 'Click or drag images here',
        'maxSize' => 'Max :size per image',
        'allowedFormats' => 'JPG, PNG, WebP',
    ],

    // Review Step
    'reviewStep' => [
        'title' => 'Review your listing',
        'titleEdit' => 'Your Property Listing',
        'description' => 'Make sure everything looks good before publishing',
        'descriptionEdit' => 'Click Edit on any section to make changes',
        'fixIssues' => 'Please fix the following issues:',
        'edit' => 'Edit',
        'morePhotos' => '+:count more photos',
        'noPhotos' => 'No photos added',
        'untitledProperty' => 'Untitled Property',
        'locationNotSet' => 'Location not set',
        'perMonth' => '/month',
        'immediately' => 'Immediately',

        // Section titles
        'sections' => [
            'propertyType' => 'Property Type',
            'location' => 'Location',
            'specifications' => 'Specifications',
            'amenities' => 'Amenities',
            'energy' => 'Energy',
            'pricingAvailability' => 'Pricing & Availability',
            'description' => 'Description',
        ],

        // Labels
        'labels' => [
            'bedrooms' => ':count Bedrooms',
            'bedroom' => ':count Bedroom',
            'bathrooms' => ':count Bathrooms',
            'bathroom' => ':count Bathroom',
            'livingSpace' => ':size m² living',
            'balcony' => ':size m² balcony',
            'land' => ':size m² land',
            'parking' => ':count parking',
            'floor' => 'Floor :level',
            'elevator' => 'Elevator',
            'monthlyRent' => 'Monthly Rent',
            'available' => 'Available',
            'energyClass' => 'Energy Class:',
            'insulation' => 'Insulation:',
            'heating' => 'Heating:',
        ],

        // Amenity labels (short)
        'amenityLabels' => [
            'equippedKitchen' => 'Equipped Kitchen',
            'separateKitchen' => 'Separate Kitchen',
            'cellar' => 'Cellar',
            'laundry' => 'Laundry',
            'fireplace' => 'Fireplace',
            'airConditioning' => 'A/C',
            'garden' => 'Garden',
            'rooftop' => 'Rooftop',
        ],

        'finalNote' => 'By publishing, you confirm that the information above is accurate and complete.',
    ],

    // ===== Application Wizard =====
    'application' => [
        // Page-level translations
        'page' => [
            'title' => 'Application for :property',
            'metaTitle' => 'Apply for :property',
        ],

        // Sidebar translations
        'sidebar' => [
            'propertyManager' => 'Property Manager',
            'privateLandlord' => 'Private Landlord',
            'monthlyRent' => 'Monthly Rent',
            'bedrooms' => 'Bedrooms',
            'bathrooms' => 'Bathrooms',
            'size' => 'Size',
            'parking' => 'Parking',
            'spots' => ':count spot|:count spots',
            'available' => 'Available',
            'allowed' => 'Allowed',
            'petsAllowed' => 'Pets allowed',
            'smokingAllowed' => 'Smoking allowed',
        ],

        // Step titles
        'steps' => [
            'personal' => [
                'title' => 'Personal Information',
                'shortTitle' => 'Personal',
                'description' => 'Tell us about yourself',
            ],
            'employment' => [
                'title' => 'Employment & Income',
                'shortTitle' => 'Employment',
                'description' => 'Your employment and income details',
            ],
            'details' => [
                'title' => 'Application Details',
                'shortTitle' => 'Details',
                'description' => 'Move-in preferences and household',
            ],
            'references' => [
                'title' => 'References',
                'shortTitle' => 'References',
                'description' => 'Add references to strengthen your application',
            ],
            'emergency' => [
                'title' => 'Emergency Contact',
                'shortTitle' => 'Emergency',
                'description' => 'Emergency contact information',
            ],
            'review' => [
                'title' => 'Review & Submit',
                'shortTitle' => 'Review',
                'description' => 'Review and submit your application',
            ],
        ],

        // Personal Info Step
        'personalStep' => [
            'title' => 'Personal Information',
            'description' => 'Your profile will be updated when you submit this application.',
            'sections' => [
                'currentAddress' => 'Current Address',
                'idDocument' => 'ID Document (Passport, ID Card, Drivers License)',
            ],
            'fields' => [
                'dateOfBirth' => 'Date of Birth',
                'nationality' => 'Nationality',
                'phoneNumber' => 'Phone Number',
                'streetName' => 'Street Name',
                'houseNumber' => 'House Number',
                'apartment' => 'Apartment, Suite, Unit',
                'city' => 'City',
                'stateProvince' => 'State/Province',
                'postalCode' => 'Postal Code',
                'country' => 'Country',
            ],
            'placeholders' => [
                'phone' => '612345678',
                'streetName' => 'Kalverstraat',
                'houseNumber' => '123A',
                'apartment' => 'Apt 4B, Floor 2',
                'city' => 'Amsterdam',
            ],
            'fileLabels' => [
                'frontSide' => 'Front Side',
                'backSide' => 'Back Side',
            ],
            'optional' => 'optional',
        ],

        // Employment & Income Step
        'employmentStep' => [
            'title' => 'Employment & Income',
            'description' => 'This information helps landlords assess your ability to pay rent. It will be saved to your profile.',
            'optional' => 'optional',
            'fields' => [
                'employmentStatus' => 'Employment Status',
                'employerName' => 'Employer Name',
                'jobTitle' => 'Job Title',
                'employmentType' => 'Employment Type',
                'employmentStartDate' => 'Employment Start Date',
                'monthlyIncomeGross' => 'Monthly Income (Gross)',
                'monthlyIncome' => 'Monthly Income',
                'university' => 'University / Institution',
                'programOfStudy' => 'Program of Study',
                'expectedGraduation' => 'Expected Graduation Date',
                'incomeSource' => 'Income Source',
            ],
            'placeholders' => [
                'employerName' => 'Acme Corporation',
                'jobTitle' => 'Software Engineer',
                'university' => 'University of Amsterdam',
                'program' => 'Computer Science',
                'incomeSource' => 'Scholarship, Part-time job, Parents',
                'income' => '3500',
                'incomeZero' => '0',
            ],
            'employmentStatuses' => [
                'employed' => 'Employed',
                'self_employed' => 'Self-Employed',
                'student' => 'Student',
                'unemployed' => 'Unemployed',
                'retired' => 'Retired',
            ],
            'employmentTypes' => [
                'full_time' => 'Full-time',
                'part_time' => 'Part-time',
                'contract' => 'Contract',
                'temporary' => 'Temporary',
            ],
            'guarantor' => [
                'title' => 'I have a guarantor',
                'description' => 'A guarantor is someone who agrees to pay your rent if you cannot. This is often required for students or first-time renters.',
                'firstName' => 'First Name',
                'lastName' => 'Last Name',
                'relationship' => 'Relationship',
                'specifyRelationship' => 'Please Specify',
                'phone' => 'Phone Number',
                'email' => 'Email Address',
                'addressSection' => 'Address',
                'idDocumentsSection' => 'ID Documents',
                'employmentSection' => 'Employment & Income',
                'employmentStatus' => 'Employment Status',
                'streetName' => 'Street Name',
                'houseNumber' => 'House Number',
                'apartment' => 'Apartment / Unit / Floor',
                'city' => 'City',
                'country' => 'Country',
                'employerName' => 'Employer Name',
                'jobTitle' => 'Job Title',
                'employmentType' => 'Employment Type',
                'employmentStartDate' => 'Employment Start Date',
                'universityName' => 'University Name',
                'programOfStudy' => 'Program of Study',
                'expectedGraduation' => 'Expected Graduation',
                'incomeSource' => 'Income Source',
                'monthlyIncome' => 'Monthly Income',
                'placeholders' => [
                    'firstName' => 'e.g., John',
                    'lastName' => 'e.g., Smith',
                    'relationship' => 'Select relationship...',
                    'specifyRelationship' => 'e.g., Uncle, Colleague',
                    'phone' => '612345678',
                    'email' => 'guarantor@example.com',
                    'streetName' => 'e.g., Main Street',
                    'houseNumber' => 'e.g., 123A',
                    'apartment' => 'e.g., Apt 4B, Floor 2',
                    'city' => 'e.g., Amsterdam',
                    'country' => 'Select country...',
                    'employerName' => 'e.g., Company Name',
                    'jobTitle' => 'e.g., Senior Manager',
                    'universityName' => 'e.g., University of Amsterdam',
                    'programOfStudy' => 'e.g., Computer Science',
                    'incomeSource' => 'e.g., Parents, Scholarship',
                    'income' => '5000',
                ],
                'relationships' => [
                    'parent' => 'Parent',
                    'grandparent' => 'Grandparent',
                    'sibling' => 'Sibling',
                    'spouse' => 'Spouse',
                    'partner' => 'Partner',
                    'other_family' => 'Other Family',
                    'friend' => 'Friend',
                    'employer' => 'Employer',
                    'other' => 'Other',
                ],
            ],
            'documents' => [
                'employmentContract' => 'Employment Contract',
                'payslip1' => 'Recent Payslip (1)',
                'payslip2' => 'Recent Payslip (2)',
                'payslip3' => 'Recent Payslip (3)',
                'studentProof' => 'Proof of Student Status',
                'studentProofDesc' => 'enrollment letter, student ID',
                'pensionProof' => 'Proof of Pension/Retirement Income',
                'otherIncomeProof' => 'Proof of Income Source',
                'otherIncomeProofDesc' => 'benefits statement, bank statements, etc.',
                'guarantorIdFront' => 'Guarantor ID (Front)',
                'guarantorIdBack' => 'Guarantor ID (Back)',
                'guarantorEmploymentContract' => 'Guarantor Employment Contract',
                'guarantorPayslip1' => 'Guarantor Payslip (1)',
                'guarantorPayslip2' => 'Guarantor Payslip (2)',
                'guarantorPayslip3' => 'Guarantor Payslip (3)',
                'guarantorStudentProof' => 'Guarantor Student Proof',
                'guarantorPensionProof' => 'Guarantor Pension Proof',
                'guarantorOtherIncomeProof' => 'Guarantor Income Proof',
            ],
        ],

        // Details Step
        'detailsStep' => [
            'title' => 'Application Details',
            'fields' => [
                'moveInDate' => 'Desired Move-In Date',
                'leaseDuration' => 'Desired Lease Duration (months)',
                'messageToLandlord' => 'Message to Landlord',
            ],
            'placeholders' => [
                'message' => 'Introduce yourself and explain why you\'re interested in this property...',
            ],
            'occupants' => [
                'title' => 'Occupants',
                'description' => 'You (the applicant) are automatically included. Add any additional occupants below.',
                'occupant' => 'Occupant :index',
                'name' => 'Name',
                'age' => 'Age',
                'relationship' => 'Relationship',
                'specifyRelationship' => 'Please specify relationship',
                'addOccupant' => 'Add Occupant',
                'placeholder' => 'Enter relationship...',
                'relationships' => [
                    'spouse' => 'Spouse',
                    'partner' => 'Partner',
                    'child' => 'Child',
                    'parent' => 'Parent',
                    'sibling' => 'Sibling',
                    'roommate' => 'Roommate',
                    'other' => 'Other',
                ],
            ],
            'pets' => [
                'title' => 'Pets',
                'hasPets' => 'I have pets',
                'pet' => 'Pet :index',
                'type' => 'Type',
                'breed' => 'Breed',
                'age' => 'Age',
                'weight' => 'Weight',
                'specifyType' => 'Please specify pet type',
                'addPet' => 'Add Pet',
                'placeholder' => 'Enter pet type...',
                'atLeastOneRequired' => 'At least one pet is required',
                'types' => [
                    'dog' => 'Dog',
                    'cat' => 'Cat',
                    'bird' => 'Bird',
                    'fish' => 'Fish',
                    'rabbit' => 'Rabbit',
                    'hamster' => 'Hamster',
                    'guinea_pig' => 'Guinea Pig',
                    'reptile' => 'Reptile',
                    'other' => 'Other',
                ],
            ],
            'characters' => ':count/:max characters',
            'optional' => 'optional',
        ],

        // References Step
        'referencesStep' => [
            'title' => 'References',
            'description' => 'Add references to strengthen your application. Landlord references are especially valuable.',
            'landlord' => [
                'title' => 'Landlord References',
                'recommended' => 'Recommended',
                'description' => 'A reference from a previous landlord helps verify your rental history.',
                'empty' => 'No landlord references added yet.',
                'add' => 'Add Landlord Reference',
                'relationships' => [
                    'previous_landlord' => 'Previous Landlord',
                    'property_manager' => 'Property Manager',
                    'other' => 'Other',
                ],
            ],
            'other' => [
                'title' => 'Other References',
                'optional' => 'Optional',
                'description' => 'Add personal or professional references who can vouch for your character and reliability.',
                'empty' => 'No other references added yet.',
                'addProfessional' => 'Add Professional Reference',
                'addPersonal' => 'Add Personal Reference',
            ],
            'personal' => [
                'relationships' => [
                    'friend' => 'Friend',
                    'neighbor' => 'Neighbor',
                    'family_friend' => 'Family Friend',
                    'other' => 'Other',
                ],
            ],
            'professional' => [
                'relationships' => [
                    'employer' => 'Employer',
                    'manager' => 'Manager',
                    'colleague' => 'Colleague',
                    'professor' => 'Professor',
                    'teacher' => 'Teacher',
                    'mentor' => 'Mentor',
                    'other' => 'Other',
                ],
            ],
            'fields' => [
                'name' => 'Name',
                'relationship' => 'Relationship',
                'specify' => 'Please specify',
                'phone' => 'Phone',
                'email' => 'Email',
                'yearsKnown' => 'Years Known',
            ],
            'placeholder' => 'Enter relationship...',
            'summary' => ':count reference added|:count references added',
            'summaryDetail' => '(:landlord landlord, :other other)',
        ],

        // Emergency Step
        'emergencyStep' => [
            'title' => 'Emergency Contact',
            'descriptionWithProfile' => 'You can use your profile emergency contact or provide a different one for this application.',
            'descriptionNoProfile' => 'Provide an emergency contact for this application.',
            'fields' => [
                'name' => 'Name',
                'phone' => 'Phone',
                'relationship' => 'Relationship',
            ],
            'placeholder' => 'Parent, Sibling...',
        ],

        // Review Step
        'reviewStep' => [
            'title' => 'Review Your Application',
            'description' => 'Please review all information before submitting. Click "Edit" to make changes.',
            'edit' => 'Edit',
            'sections' => [
                'personal' => 'Personal Information',
                'employment' => 'Employment & Income',
                'details' => 'Application Details',
                'references' => 'References',
                'emergency' => 'Emergency Contact',
            ],
            'labels' => [
                'dateOfBirth' => 'Date of Birth',
                'nationality' => 'Nationality',
                'phone' => 'Phone',
                'currentAddress' => 'Current Address',
                'employmentStatus' => 'Employment Status',
                'employer' => 'Employer',
                'jobTitle' => 'Job Title',
                'monthlyIncome' => 'Monthly Income',
                'employmentType' => 'Employment Type',
                'startDate' => 'Start Date',
                'university' => 'University',
                'program' => 'Program',
                'expectedGraduation' => 'Expected Graduation',
                'incomeSource' => 'Income Source',
                'documents' => 'Documents',
                'guarantor' => 'Guarantor',
                'moveInDate' => 'Desired Move-In Date',
                'leaseDuration' => 'Lease Duration',
                'additionalOccupants' => 'Additional Occupants',
                'pets' => 'Pets',
                'messageToLandlord' => 'Message to Landlord',
                'previousLandlord' => 'Landlord References',
                'personalReferences' => 'Personal References',
                'professionalReferences' => 'Professional References',
                'yearsKnown' => 'Years Known',
                'age' => 'Age: :age',
                'name' => 'Name',
                'email' => 'Email',
                'relationship' => 'Relationship',
                'address' => 'Address',
            ],
            'documentBadges' => [
                'idFront' => 'ID Front',
                'idBack' => 'ID Back',
                'employmentContract' => 'Employment Contract',
                'payslip1' => 'Payslip 1',
                'payslip2' => 'Payslip 2',
                'payslip3' => 'Payslip 3',
                'studentProof' => 'Student Proof',
                'otherIncomeProof' => 'Income Proof',
                'guarantorId' => 'Guarantor ID',
                'guarantorIncomeProof' => 'Guarantor Income Proof',
            ],
            'notProvided' => 'Not provided',
            'noPreviousLandlord' => 'No previous landlord provided',
            'noReferences' => 'No references provided',
            'noEmergencyContact' => 'No emergency contact provided',
            'months' => ':count month|:count months',
            'confirmation' => [
                'title' => 'Ready to Submit',
                'description' => 'By submitting this application, you confirm that all information provided is accurate and complete. Your profile data will be saved for future applications.',
            ],
        ],

        // Navigation
        'nav' => [
            'submitApplication' => 'Submit Application',
            'submitting' => 'Submitting...',
        ],
    ],
];
